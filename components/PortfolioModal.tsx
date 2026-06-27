"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PortfolioItem } from "@/lib/assets";

const ease = [0.16, 1, 0.3, 1] as const;

export default function PortfolioModal({
  item,
  onClose,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          onClick={onClose}
        >
          {/* dimmed, blurred theater backdrop */}
          <div className="absolute inset-0 bg-[rgba(17,17,17,0.55)] backdrop-blur-xl" />

          <motion.div
            className="relative z-10 w-full max-w-[420px]"
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              data-cursor="link"
              aria-label="Close"
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 sm:-right-12 sm:top-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
              <div className="relative aspect-[9/16] w-full bg-black">
                {item.src ? (
                  <video
                    key={item.id}
                    src={item.src}
                    poster={item.poster ?? undefined}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1a1a1a] to-[#0c0c0c] text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M4 2.5v11l9-5.5-9-5.5Z" fill="#fff" />
                      </svg>
                    </div>
                    <p className="px-8 text-sm text-white/60">
                      Reel preview — drop your video into the portfolio assets
                      folder to play it here.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    {item.category}
                  </p>
                  <h3 className="mt-0.5 text-[15px] font-medium text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
