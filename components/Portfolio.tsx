"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PortfolioItem } from "@/lib/assets";
import { CATEGORIES } from "@/lib/site";
import VideoCard from "./VideoCard";
import PortfolioModal from "./PortfolioModal";
import Reveal from "./Reveal";

type Filter = "All" | (typeof CATEGORIES)[number];

export default function Portfolio({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<Filter>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<PortfolioItem | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      active === "All"
        ? items
        : items.filter((i) => i.category === active),
    [items, active]
  );

  const filters: Filter[] = ["All", ...CATEGORIES];

  // GSAP horizontal "filmstrip" — desktop + motion only. Rebuilds on filter
  // change so the pin distance always matches the visible track width.
  useEffect(() => {
    const mql = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
    );
    if (!mql.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const getDistance = () =>
        Math.max(0, track.scrollWidth - pin.clientWidth);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top+=88",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 60);

    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [active, filtered.length]);

  const handleFilter = (f: Filter) => {
    if (f === active) return;
    setActive(f);
    setHoveredId(null);
    // Reset to a clean position so the rebuilt pin starts fresh.
    window.dispatchEvent(
      new CustomEvent("lenis:scrollTo", {
        detail: { target: "#work", offset: -88 },
      })
    );
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative scroll-mt-24 bg-bg py-24 sm:py-32"
    >
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
                thought leadership. Hover to preview — click to open the reel.
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

      {/* Pinned horizontal filmstrip (desktop). On smaller screens this is a
          natural horizontal scroll; the GSAP effect simply doesn't attach. */}
      <div ref={pinRef} className="relative mt-12 overflow-hidden">
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 overflow-x-auto px-5 pb-2 sm:px-8 lg:overflow-visible lg:px-[max(2rem,calc((100vw-1280px)/2+2rem))]"
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
                onOpen={setOpenItem}
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
      </div>

      <PortfolioModal item={openItem} onClose={() => setOpenItem(null)} />
    </section>
  );
}
