"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Heavy, buttery-smooth scrolling via Lenis, wired into GSAP's ticker and
 * ScrollTrigger so pinned/scrubbed animations stay perfectly in sync.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.4, // heavy, cinematic glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Allow other components to request a scroll (e.g. nav links).
    const handleScrollTo = (e: Event) => {
      const detail = (e as CustomEvent<{ target: string; offset?: number }>)
        .detail;
      if (!detail) return;
      lenis.scrollTo(detail.target, {
        offset: detail.offset ?? 0,
        duration: 1.6,
      });
    };
    window.addEventListener("lenis:scrollTo", handleScrollTo);

    return () => {
      window.removeEventListener("lenis:scrollTo", handleScrollTo);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
}
