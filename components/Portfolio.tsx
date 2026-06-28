"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PortfolioItem } from "@/lib/assets";
import { CATEGORIES } from "@/lib/site";
import VideoCard from "./VideoCard";
import Reveal from "./Reveal";

type Filter = "All" | (typeof CATEGORIES)[number];

export default function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<Filter>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      active === "All" ? items : items.filter((i) => i.category === active),
    [items, active]
  );

  const filters: Filter[] = ["All", ...CATEGORIES];

  // Reset the carousel to the start whenever the filter changes.
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [active]);

  /**
   * Carousel interactions on the horizontal strip:
   * - mouse wheel → smooth horizontal scroll (releases at the ends so the page
   *   can keep scrolling); Lenis is told to ignore the wheel here.
   * - click-and-drag → horizontal scroll, with grab / grabbing cursors.
   * - touch swipe → native (untouched).
   */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    let target = el.scrollLeft;
    let raf = 0;
    let lerping = false;

    const tick = () => {
      const max = el.scrollWidth - el.clientWidth;
      target = clamp(target, 0, max);
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        el.scrollLeft = target;
        lerping = false;
        return;
      }
      const prev = el.scrollLeft;
      el.scrollLeft = prev + diff * 0.2; // smooth glide
      if (Math.abs(el.scrollLeft - prev) < 0.1) {
        lerping = false; // reached the real scroll limit
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const startLerp = () => {
      if (!lerping) {
        lerping = true;
        raf = requestAnimationFrame(tick);
      }
    };

    // ---- wheel → horizontal ----
    const onWheel = (e: WheelEvent) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      // Release at the ends (with a tolerance for sub-pixel rounding) so the
      // page keeps scrolling once the strip can't move further that way.
      const pos = el.scrollLeft;
      const EDGE = 2;
      if ((delta > 0 && pos >= max - EDGE) || (delta < 0 && pos <= EDGE)) return;
      e.preventDefault();
      if (!lerping) target = pos; // sync before accumulating
      target = clamp(target + delta, 0, max);
      startLerp();
    };

    // ---- click + drag → horizontal ----
    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let pid = -1;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return; // touch is native
      down = true;
      moved = false;
      pid = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      target = el.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        setDragging(true);
        try {
          el.setPointerCapture(pid);
        } catch {}
      }
      if (moved) {
        el.scrollLeft = startLeft - dx;
        target = el.scrollLeft;
      }
    };
    const endDrag = () => {
      if (!down) return;
      down = false;
      setDragging(false);
      try {
        el.releasePointerCapture(pid);
      } catch {}
    };
    // a drag must not also trigger a card click (which plays the video)
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [active, filtered.length]);

  const handleFilter = (f: Filter) => {
    if (f === active) return;
    setActive(f);
    setHoveredId(null);
  };

  return (
    <section id="work" className="relative scroll-mt-24 bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <Reveal>
          <div
            className="flex flex-col gap-6 transition-opacity duration-500 lg:flex-row lg:items-end lg:justify-between"
            style={{ opacity: hoveredId ? 0.5 : 1 }}
          >
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
                <span className="h-px w-6 bg-accent/40" />
                Selected Work
              </span>
              <h2 className="mt-3 text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
                The reels do the talking.
              </h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
                A selection of edits across branding, creators, education, and
                thought leadership. Hover to preview — click to play.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Category filter pills */}
        <Reveal delay={0.05}>
          <div
            className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-1 transition-opacity duration-500"
            style={{ opacity: hoveredId ? 0.5 : 1 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                data-cursor="link"
                className={`shrink-0 rounded-full px-4 py-2 text-[13.5px] font-medium transition-all duration-300 ${
                  active === f
                    ? "bg-ink text-white shadow-soft"
                    : "glass text-muted hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Horizontal reel carousel — wheel / drag / swipe, scrollbar hidden */}
      <div
        ref={trackRef}
        data-lenis-prevent-wheel
        className={`reel-track no-scrollbar mt-12 flex select-none gap-5 overflow-x-auto px-5 pb-2 sm:px-8 lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))] ${
          dragging ? "is-dragging" : ""
        }`}
      >
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className="w-[72vw] shrink-0 sm:w-[42vw] md:w-[300px] lg:w-[320px]"
          >
            <VideoCard
              item={item}
              index={i}
              hovered={hoveredId === item.id}
              dimmed={hoveredId !== null && hoveredId !== item.id}
              onHover={setHoveredId}
            />
          </div>
        ))}

        {/* trailing spacer so the last card can clear the viewport edge */}
        <div aria-hidden className="w-px shrink-0 lg:w-[20vw]" />
      </div>

      {filtered.length === 0 && (
        <p className="px-8 py-16 text-center text-muted">
          No reels in this category yet.
        </p>
      )}
    </section>
  );
}
