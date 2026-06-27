"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import CloudOverlay from "./CloudOverlay";
import Magnetic from "./Magnetic";

function scrollTo(target: string) {
  window.dispatchEvent(
    new CustomEvent("lenis:scrollTo", { detail: { target, offset: -80 } })
  );
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-28 sm:px-8"
      initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(14px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease }}
    >
      <CloudOverlay blue mouseParallax />
      {/* faint vertical depth gradient — seats the section into the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(247,247,245,0.5) 0%, rgba(247,247,245,0) 22%, rgba(247,247,245,0) 64%, rgba(247,247,245,0.95) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12.5px] font-medium tracking-wide text-muted"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Premium creative studio — editing &amp; storytelling
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease }}
          className="text-balance text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.98] tracking-tightest text-ink"
        >
          {site.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.85, ease }}
          className="mx-auto mt-7 max-w-2xl text-balance text-[clamp(1rem,2.1vw,1.22rem)] leading-relaxed text-muted"
        >
          {site.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Magnetic className="w-full sm:w-auto">
            <button
              onClick={() => scrollTo("#work")}
              className="group w-full rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-colors duration-300 ease-cinematic hover:bg-[#000] sm:w-auto"
            >
              View Work
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <button
              onClick={() => scrollTo("#book")}
              className="w-full rounded-full border border-ink bg-transparent px-7 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-white sm:w-auto"
            >
              Book a Call
            </button>
          </Magnetic>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4, ease }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-ink/20 p-1">
          <motion.span
            animate={reduce ? {} : { y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-ink/40"
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
