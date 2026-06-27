"use client";

import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Process() {
  return (
    <section
      id="process"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
      style={{
        background:
          "linear-gradient(180deg, #F7F7F5 0%, #FFFFFF 50%, #F7F7F5 100%)",
      }}
    >
      <div className="relative mx-auto max-w-container px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-[12px] font-medium uppercase tracking-[0.22em] text-accent">
              How it works
            </span>
            <h2 className="mt-3 text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-tightest text-ink">
              A calm, simple process.
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
              Four steps from raw footage to a finished, scroll-stopping edit.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-16">
          {/* connecting line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[22px] hidden h-px lg:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(74,125,255,0) 0%, rgba(74,125,255,0.35) 20%, rgba(74,125,255,0.35) 80%, rgba(74,125,255,0) 100%)",
            }}
          />
          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
            {site.process.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.08} as="li" className="relative">
                <div className="flex items-center gap-4 lg:block">
                  <span className="glass relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-[14px] font-semibold tabular-nums text-ink">
                    {p.step}
                  </span>
                  <h3 className="text-[1.15rem] font-semibold tracking-tight text-ink lg:mt-6">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted lg:max-w-[15rem]">
                  {p.desc}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
