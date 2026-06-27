"use client";

import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Services() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-bg py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[50vh] w-[50vh] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(74,125,255,0.07), rgba(255,255,255,0) 70%)",
        }}
      />
      <div className="relative mx-auto max-w-container px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
              <span className="h-px w-6 bg-accent/40" />
              What we do
            </span>
            <h2 className="mt-3 text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              Editing, end to end.
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
              A full content system — from a single hero edit to a library of
              shorts built to keep your audience watching.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <article
                data-cursor="link"
                className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 shadow-soft transition-all duration-500 ease-cinematic hover:-translate-y-1.5 hover:border-accent/20 hover:shadow-cinematic"
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-2 transition-transform duration-500 ease-cinematic group-hover:scale-x-100"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold tabular-nums text-accent">
                    0{i + 1}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path
                        d="M1 12L12 1M12 1H3.5M12 1v8.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                <h3 className="mt-8 text-[1.2rem] font-semibold tracking-tight text-ink">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                  {s.desc}
                </p>
              </article>
            </Reveal>
          ))}

          {/* CTA tile */}
          <Reveal delay={site.services.length * 0.05}>
            <article className="flex h-full flex-col justify-between rounded-2xl bg-ink p-7 text-white">
              <h3 className="text-[1.2rem] font-semibold tracking-tight">
                Not sure what you need?
              </h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/65">
                Tell us the goal — we&apos;ll shape the right content system
                around it.
              </p>
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("lenis:scrollTo", {
                      detail: { target: "#book", offset: -80 },
                    })
                  )
                }
                data-cursor="link"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                Book a call →
              </button>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
