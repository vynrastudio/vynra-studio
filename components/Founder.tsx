"use client";

import Image from "next/image";
import { site } from "@/lib/site";
import Reveal from "./Reveal";
import CloudOverlay from "./CloudOverlay";

export default function Founder({ photo }: { photo: string | null }) {
  const { founder } = site;
  const firstName = founder.name.split(" ")[0];

  return (
    <section
      id="founder"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F7F7F5 45%, #F7F7F5 100%)",
      }}
    >
      <CloudOverlay className="opacity-70" blue />
      <div className="relative mx-auto grid max-w-container items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        {/* Photo */}
        <Reveal y={34}>
          <div className="relative mx-auto w-full max-w-sm">
            {/* brand-blue glow behind the portrait */}
            <div
              aria-hidden
              className="absolute -inset-6 -z-10 rounded-[2.5rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(74,125,255,0.28), rgba(108,149,255,0.08) 55%, rgba(255,255,255,0) 75%)",
              }}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-bg p-1.5 ring-1 ring-white/60 shadow-float">
              <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] ring-1 ring-black/5">
                {photo ? (
                  <Image
                    src={photo}
                    alt={`${founder.name}, ${founder.title}`}
                    fill
                    sizes="(max-width: 480px) 88vw, 384px"
                    className="object-cover"
                    style={{ objectPosition: "50% 26%", transform: "scale(1.08)" }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#eef0f5] to-[#dfe4ee]">
                    <span className="text-6xl font-semibold tracking-tight text-ink/15">
                      {founder.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
                {/* subtle bottom vignette for depth */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(17,17,17,0) 0%, rgba(17,17,17,0.18) 100%)",
                  }}
                />
              </div>

              {/* availability status */}
              <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-medium text-ink">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available for projects
              </div>
            </div>

            {/* name plate */}
            <div className="glass absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-2xl px-6 py-2.5 text-center">
              <p className="text-[14px] font-semibold tracking-tight text-ink">
                {founder.name}
              </p>
              <p className="text-[11px] text-muted">{founder.title}</p>
            </div>
          </div>
        </Reveal>

        {/* Bio + stats */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
              <span className="h-px w-6 bg-accent/40" />
              The Founder
            </span>
            <h2 className="mt-4 text-balance text-[clamp(2rem,4.2vw,3.1rem)] font-semibold leading-[1.04] tracking-tightest text-ink">
              Meet {firstName}.
            </h2>
          </Reveal>

          {/* featured line — pulled from the studio's philosophy */}
          <Reveal delay={0.06}>
            <p className="mt-6 max-w-xl text-balance text-[clamp(1.15rem,2vw,1.4rem)] font-medium leading-snug text-ink">
              <span className="text-accent">“</span>Great content shouldn&apos;t
              just look good — it should make people{" "}
              <span className="italic">stop scrolling.</span>
              <span className="text-accent">”</span>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-[1.8] text-muted">
              {founder.bio}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {founder.stats.map((s) => (
                <div
                  key={s.label}
                  className="glass-line rounded-2xl bg-white/60 p-4 backdrop-blur-sm"
                >
                  <dt className="text-[clamp(1.4rem,2.2vw,1.85rem)] font-semibold tracking-tight text-ink">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[12.5px] leading-snug text-muted">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* signature */}
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p
                className="text-[1.6rem] text-ink/85"
                style={{
                  fontFamily: "'Snell Roundhand','Segoe Script',cursive",
                }}
              >
                {founder.name}
              </p>
              <a
                href={site.contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group inline-flex items-center gap-2 text-[14px] font-medium text-ink"
              >
                <span className="border-b border-ink/30 pb-0.5 transition-colors group-hover:border-accent group-hover:text-accent">
                  Work with {firstName}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
