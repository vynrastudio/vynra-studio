"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Magnetic cinematic cursor.
 * - Hidden system cursor on fine-pointer devices (see globals.css).
 * - A tiny #111 dot that smoothly trails the pointer.
 * - Over [data-cursor="play"] targets it expands into a translucent,
 *   backdrop-blurred circle with the word "PLAY" inside.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      const target = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]"
      ) as HTMLElement | null;
      if (target) {
        setActive(true);
        setLabel(target.dataset.cursor === "play" ? "PLAY" : "");
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const render = () => {
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Tiny dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-ink transition-opacity duration-300"
        style={{
          opacity: active ? 0 : 1,
        }}
      />
      {/* Expanding ring / PLAY bubble */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full text-[11px] font-medium tracking-[0.22em] text-ink transition-[width,height,margin,background-color,border-color,color] duration-300 ease-cinematic"
        style={{
          width: active ? 84 : 26,
          height: active ? 84 : 26,
          marginLeft: active ? -42 : -13,
          marginTop: active ? -42 : -13,
          backgroundColor: active
            ? "rgba(255,255,255,0.45)"
            : "rgba(17,17,17,0)",
          border: active
            ? "1px solid rgba(255,255,255,0.7)"
            : "1px solid rgba(17,17,17,0.25)",
          backdropFilter: active ? "blur(6px)" : "blur(0px)",
          WebkitBackdropFilter: active ? "blur(6px)" : "blur(0px)",
          color: active ? "#111111" : "rgba(17,17,17,0)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
