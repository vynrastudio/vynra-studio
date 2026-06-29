"use client";

import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Services() {
  const { traditional, vynra } = site.comparison;
  const rows = traditional.map((t, i) => ({ old: t, ours: vynra[i] }));

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden bg-bg py-28 sm:py-36"
    >
      <div className="relative mx-auto max-w-container px-5 sm:px-8">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
              <span className="h-px w-6 bg-accent/40" />
              The difference
            </span>
            <h2 className="mt-5 text-balance text-[clamp(2.4rem,5.5vw,4.4rem)] font-semibold leading-[0.96] tracking-tightest text-ink">
              We build systems, not just edits.
            </h2>
            <p className="mt-6 max-w-xl text-[1.12rem] leading-relaxed text-muted">
              Most editing stops at the export. We design the whole engine —
              story, retention, and distribution — so your content compounds
              instead of disappearing.
            </p>
          </div>
        </Reveal>

        {/* Comparison */}
        <Reveal delay={0.08}>
          <div className="mt-16 sm:mt-20">
            {/* Column headers */}
            <div className="grid grid-cols-2 border-b border-line">
              <div className="pb-5 pr-5 sm:pr-10">
                <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-muted/70">
                  Traditional editing
                </span>
              </div>
              <div className="border-l border-line pb-5 pl-5 sm:pl-10">
                <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink">
                  Vynra Studio
                </span>
              </div>
            </div>

            {/* Rows */}
            <dl>
              {rows.map((row) => (
                <div key={row.ours} className="grid grid-cols-2 border-b border-line">
                  {/* Traditional — de-emphasised */}
                  <dt className="flex items-center gap-3 py-7 pr-5 sm:gap-4 sm:py-9 sm:pr-10">
                    <svg
                      aria-hidden
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="shrink-0 text-muted/40"
                    >
                      <line
                        x1="3.5"
                        y1="8"
                        x2="12.5"
                        y2="8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-[clamp(1.05rem,2.1vw,1.45rem)] font-normal leading-snug text-muted">
                      {row.old}
                    </span>
                  </dt>

                  {/* Vynra — emphasised */}
                  <dd className="flex items-center gap-3 border-l border-line py-7 pl-5 sm:gap-4 sm:py-9 sm:pl-10">
                    <svg
                      aria-hidden
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="shrink-0 text-ink"
                    >
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-balance text-[clamp(1.05rem,2.1vw,1.45rem)] font-medium leading-snug tracking-tight text-ink">
                      {row.ours}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
