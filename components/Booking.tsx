"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import Reveal from "./Reveal";
import CloudOverlay from "./CloudOverlay";
import Magnetic from "./Magnetic";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";
const ease = [0.16, 1, 0.3, 1] as const;

function ensureCalendlyAssets(): Promise<void> {
  return new Promise((resolve) => {
    if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CALENDLY_CSS;
      document.head.appendChild(link);
    }
    if (window.Calendly) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_JS}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      // already loaded but Calendly defined late
      if (window.Calendly) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export default function Booking() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(async () => {
    setOpen(true);
    await ensureCalendlyAssets();
    setReady(true);
  }, []);

  // Mount the inline widget once the modal is open, assets ready and node present.
  useEffect(() => {
    if (!open || !ready) return;
    const node = widgetRef.current;
    if (node && window.Calendly && node.childElementCount === 0) {
      window.Calendly.initInlineWidget({
        url: `${site.contact.calendly}?hide_gdpr_banner=1&background_color=ffffff&text_color=111111&primary_color=4a7dff`,
        parentElement: node,
      });
    }
  }, [open, ready]);

  // Lock scroll while modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setReady(false);
    if (widgetRef.current) widgetRef.current.innerHTML = "";
  };

  return (
    <section
      id="book"
      className="relative scroll-mt-24 overflow-hidden bg-bg py-24 sm:py-32"
    >
      <CloudOverlay className="opacity-70" />
      <div className="relative mx-auto max-w-container px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink px-7 py-16 text-center sm:px-12 sm:py-20">
            <CloudOverlay className="opacity-[0.07] mix-blend-screen" />
            <div className="relative">
              <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-accent-2">
                Let&apos;s talk
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.04] tracking-tightest text-white">
                Ready to make something people stop for?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-white/60">
                Book a free 30-minute call. We&apos;ll talk through your goals,
                your footage, and how we can help you stand out.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Magnetic className="w-full sm:w-auto">
                  <button
                    onClick={openModal}
                    className="w-full rounded-full bg-white px-7 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 ease-cinematic hover:bg-white/90 sm:w-auto"
                  >
                    Book a Call
                  </button>
                </Magnetic>
                <Magnetic className="w-full sm:w-auto">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="block w-full rounded-full border border-white/25 px-7 py-3.5 text-center text-[15px] font-medium text-white transition-colors duration-300 hover:bg-white/10 sm:w-auto"
                  >
                    Email us
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            onClick={close}
          >
            <div className="absolute inset-0 bg-[rgba(17,17,17,0.45)] backdrop-blur-xl" />
            <motion.div
              className="relative z-10 flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
              initial={{ scale: 0.95, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 16, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <p className="text-[14px] font-medium text-ink">
                    Book a 30-min call — {site.name}
                  </p>
                </div>
                <button
                  onClick={close}
                  data-cursor="link"
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-bg hover:text-ink"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 1l12 12M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative flex-1 bg-white">
                {!ready && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-accent" />
                  </div>
                )}
                <div ref={widgetRef} className="h-full w-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
