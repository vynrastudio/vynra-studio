"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Cinematic volumetric fog.
 *
 * Multiple soft, elongated cloud banks stacked at different depths. Each layer
 * drifts very slowly on the horizontal axis (CSS) while an outer wrapper adds a
 * gentle vertical parallax tied to scroll (Framer). No circles, dots or
 * particles — just blurred, gradient-shaped fog that reads like premium
 * atmosphere rather than weather. Densest toward the edges/floor so the
 * centre stays clear and text is never blocked.
 */

// Soft organic cloud texture (fractal noise) — adds volume to the gradient banks.
const FOG_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='4' seed='12' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.7 0.7 0.7 0 -0.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23c)'/%3E%3C/svg%3E\")";

interface FogBank {
  className: string;
  gradient: string;
  blur: number;
  opacity: number;
  anim: string; // drift keyframes + timing
  parallax: number; // px travel across the scroll range
}

function banks(blue: boolean): FogBank[] {
  const accent = blue ? "rgba(108,149,255,0.55)" : "rgba(206,219,255,0.4)";
  const accentSoft = blue ? "rgba(74,125,255,0.3)" : "rgba(216,226,255,0.3)";
  return [
    // far, high — a broad luminous bank that fills the upper frame
    {
      className: "left-[-25%] top-[-22%] h-[80vh] w-[150%]",
      gradient:
        "radial-gradient(65% 60% at 50% 45%, rgba(255,255,255,0.92), rgba(255,255,255,0) 72%)",
      blur: 70,
      opacity: 0.7,
      anim: "fog-drift-a 150s ease-in-out infinite alternate",
      parallax: -28,
    },
    // mid — broad horizontal bank drifting through the middle, faint blue
    {
      className: "left-[-30%] top-[4%] h-[70vh] w-[170%]",
      gradient: `radial-gradient(55% 52% at 45% 50%, rgba(248,250,255,0.9), ${accentSoft} 52%, rgba(248,250,255,0) 74%)`,
      blur: 90,
      opacity: 0.72,
      anim: "fog-drift-b 200s ease-in-out infinite alternate",
      parallax: 40,
    },
    // near, low — the floor fog, carries the brand-blue depth, centred
    {
      className: "left-[-15%] bottom-[-25%] h-[85vh] w-[130%]",
      gradient: `radial-gradient(62% 58% at 50% 55%, rgba(255,255,255,0.78), ${accent} 46%, rgba(255,255,255,0) 80%)`,
      blur: 100,
      opacity: blue ? 0.75 : 0.62,
      anim: "fog-drift-c 120s ease-in-out infinite alternate",
      parallax: 72,
    },
    // drifting side wisp for asymmetry / movement on the right
    {
      className: "right-[-30%] top-[16%] h-[65vh] w-[125%]",
      gradient:
        "radial-gradient(52% 50% at 55% 50%, rgba(255,255,255,0.7), rgba(255,255,255,0) 72%)",
      blur: 85,
      opacity: 0.55,
      anim: "fog-drift-a 240s ease-in-out infinite alternate-reverse",
      parallax: 54,
    },
  ];
}

export default function CloudOverlay({
  className = "",
  blue = false,
  mouseParallax = false,
}: {
  className?: string;
  /** Fold a stronger brand-blue depth into the floor fog. */
  blue?: boolean;
  /** Add a gentle pointer-driven parallax drift (use in the hero). */
  mouseParallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Pointer parallax — a soft, springy drift of the whole fog field.
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const smx = useSpring(mvx, { stiffness: 45, damping: 18, mass: 0.7 });
  const smy = useSpring(mvy, { stiffness: 45, damping: 18, mass: 0.7 });
  useEffect(() => {
    if (!mouseParallax || reduce) return;
    const onMove = (e: MouseEvent) => {
      mvx.set((e.clientX / window.innerWidth - 0.5) * 28);
      mvy.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseParallax, reduce, mvx, mvy]);

  // One parallax transform per bank (hooks must be unconditional & fixed count).
  const list = banks(blue);
  const y0 = useTransform(scrollYProgress, [0, 1], [-list[0].parallax, list[0].parallax]);
  const y1 = useTransform(scrollYProgress, [0, 1], [-list[1].parallax, list[1].parallax]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-list[2].parallax, list[2].parallax]);
  const y3 = useTransform(scrollYProgress, [0, 1], [-list[3].parallax, list[3].parallax]);
  const yTexture = useTransform(scrollYProgress, [0, 1], [-20, 44]);
  const ys = [y0, y1, y2, y3];

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={mouseParallax && !reduce ? { x: smx, y: smy } : undefined}
      >
      {list.map((b, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={reduce ? undefined : { y: ys[i] }}
        >
          <div
            className={`fog-layer ${b.className}`}
            style={{
              background: b.gradient,
              opacity: b.opacity,
              filter: `blur(${b.blur}px)`,
              animation: reduce ? undefined : b.anim,
            }}
          />
        </motion.div>
      ))}

      {/* organic volume — subtle fractal-noise cloud texture */}
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: yTexture }}
      >
        <div
          className="fog-layer left-[-20%] top-[-10%] h-[130%] w-[140%]"
          style={{
            backgroundImage: FOG_TEXTURE,
            backgroundSize: "120% 120%",
            opacity: 0.3,
            filter: "blur(24px)",
            mixBlendMode: "screen",
            animation: reduce
              ? undefined
              : "fog-drift-c 300s ease-in-out infinite alternate",
            WebkitMaskImage:
              "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0.9), rgba(0,0,0,0) 75%)",
            maskImage:
              "radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0.9), rgba(0,0,0,0) 75%)",
          }}
        />
      </motion.div>
      </motion.div>
    </div>
  );
}
