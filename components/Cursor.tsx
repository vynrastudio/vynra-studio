"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Subtle premium cursor glow.
 *
 * The system cursor stays fully visible and everything remains readable and
 * clickable. This only adds a small, soft blue light that trails the pointer —
 * rendered with `mix-blend-mode: multiply` so it gently tints the light
 * background around the cursor while leaving text crisp and never blurred.
 * Grows a touch over interactive elements as a quiet affordance.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches) return;
    setEnabled(true);

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { ...pos };
    let scale = 1;
    let targetScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      targetOpacity = 1;
      const interactive = (e.target as HTMLElement)?.closest?.(
        "a, button, [role='button'], [data-cursor]"
      );
      targetScale = interactive ? 1.9 : 1;
    };
    const onLeave = () => {
      targetOpacity = 0;
    };

    const render = () => {
      // gentle trailing ease (or snap when reduced motion)
      const k = reduce.matches ? 1 : 0.2;
      cur.x += (pos.x - cur.x) * k;
      cur.y += (pos.y - cur.y) * k;
      scale += (targetScale - scale) * 0.15;
      opacity += (targetOpacity - opacity) * 0.12;
      const el = ref.current;
      if (el) {
        el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-9 w-9 rounded-full"
      style={{
        opacity: 0,
        background:
          "radial-gradient(circle, rgba(74,125,255,0.55) 0%, rgba(108,149,255,0.28) 42%, rgba(108,149,255,0) 70%)",
        mixBlendMode: "multiply",
        willChange: "transform, opacity",
      }}
    />
  );
}
