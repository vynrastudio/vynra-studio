"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const LINKS = [
  { label: "Work", target: "#work" },
  { label: "Founder", target: "#founder" },
  { label: "Services", target: "#services" },
  { label: "Process", target: "#process" },
];

function scrollTo(target: string) {
  window.dispatchEvent(
    new CustomEvent("lenis:scrollTo", { detail: { target, offset: -80 } })
  );
  // Fallback for reduced-motion (Lenis not mounted).
  const el = document.querySelector(target);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar({ logo }: { logo: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handle = (target: string) => {
    setOpen(false);
    scrollTo(target);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-cinematic ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <nav
          className={`flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 ease-cinematic sm:px-5 ${
            scrolled
              ? "border-line bg-[rgba(255,255,255,0.75)] shadow-[0_8px_30px_rgba(17,17,17,0.06)] backdrop-blur-xl"
              : "border-transparent bg-[rgba(255,255,255,0.0)]"
          }`}
        >
          <button
            onClick={() => handle("#top")}
            data-cursor="link"
            className="flex items-center gap-2.5"
            aria-label={`${site.name} home`}
          >
            <span className="flex items-center gap-2">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={`${site.name} logo`}
                  className="h-7 w-auto object-contain"
                />
              ) : (
                <span className="h-6 w-6 rounded-md bg-ink" />
              )}
              <span className="text-[15px] font-semibold tracking-tight text-ink">
                {site.name}
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <button
                key={l.target}
                onClick={() => handle(l.target)}
                data-cursor="link"
                className="rounded-full px-4 py-2 text-[14px] text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handle("#book")}
              data-cursor="link"
              className="hidden rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white transition-transform duration-300 ease-cinematic hover:-translate-y-0.5 sm:block"
            >
              Book a Call
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              data-cursor="link"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 backdrop-blur md:hidden"
            >
              <div className="space-y-1.5">
                <span
                  className={`block h-px w-4 bg-ink transition-transform ${
                    open ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-px w-4 bg-ink transition-transform ${
                    open ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="mx-1 mt-2 rounded-3xl border border-line bg-[rgba(255,255,255,0.9)] p-2 backdrop-blur-xl md:hidden">
            {LINKS.map((l) => (
              <button
                key={l.target}
                onClick={() => handle(l.target)}
                className="block w-full rounded-2xl px-4 py-3 text-left text-[15px] text-ink/80 transition-colors hover:bg-bg"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => handle("#book")}
              className="mt-1 block w-full rounded-2xl bg-ink px-4 py-3 text-center text-[15px] font-medium text-white"
            >
              Book a Call
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
