import { site } from "@/lib/site";
import Reveal from "./Reveal";

export default function Services() {
  const { traditional, vynra } = site.comparison;
  const rows = traditional.map((t, i) => ({ old: t, ours: vynra[i] }));

  return (
    <section
      id="services"
      className="relative scroll-mt-24 bg-bg py-24 sm:py-32"
    >
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <Reveal y={34}>
          {/* Deep matte-black premium panel */}
          <div
            className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] p-7 backdrop-blur-xl sm:rounded-[2.25rem] sm:p-12 lg:p-16"
            style={{
              background:
                "linear-gradient(180deg, #111113 0%, #0B0B0C 60%, #0A0A0A 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.07), 0 50px 120px -45px rgba(0,0,0,0.75)",
            }}
          >
            {/* faint top sheen for glassy depth */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.05), transparent 70%)",
              }}
            />

            {/* Header */}
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-white/45">
                <span className="h-px w-6 bg-white/25" />
                The difference
              </span>
              <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.0] tracking-tightest text-white">
                We Build Systems, Not Just Edits.
              </h2>
              <p className="mt-5 max-w-xl text-[1.08rem] leading-relaxed text-white/55">
                Most editors deliver files. We build content ecosystems designed
                for retention, repurposing, and growth.
              </p>
            </div>

            {/* Comparison */}
            <div className="relative mt-12 sm:mt-16">
              {/* Column headers */}
              <div className="grid grid-cols-2">
                <div className="pb-4 pr-4 sm:pr-10">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                    Traditional Editing
                  </span>
                </div>
                <div className="rounded-t-2xl border-l border-white/[0.08] bg-white/[0.03] px-4 pb-4 pt-4 sm:px-10">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Vynra Studio
                  </span>
                </div>
              </div>

              {/* Rows */}
              <div>
                {rows.map((row, i) => {
                  const last = i === rows.length - 1;
                  return (
                    <div
                      key={row.ours}
                      className="group grid grid-cols-2 border-t border-white/[0.08]"
                    >
                      {/* Traditional — softer gray, de-emphasised */}
                      <div className="flex items-center gap-3 py-6 pr-4 sm:gap-4 sm:py-7 sm:pr-10">
                        <svg
                          aria-hidden
                          width="15"
                          height="15"
                          viewBox="0 0 16 16"
                          className="shrink-0 text-white/25"
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
                        <span className="text-[clamp(1rem,1.9vw,1.3rem)] leading-snug text-[#9A9A9A]">
                          {row.old}
                        </span>
                      </div>

                      {/* Vynra — dominant, brighter; brightens on row hover */}
                      <div
                        className={`flex items-center gap-3 border-l border-white/[0.08] bg-white/[0.03] px-4 py-6 transition-colors duration-300 ease-out group-hover:bg-white/[0.07] sm:gap-4 sm:px-10 sm:py-7 ${
                          last ? "rounded-b-2xl" : ""
                        }`}
                      >
                        <svg
                          aria-hidden
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          className="shrink-0 text-accent-2"
                        >
                          <path
                            d="M3.25 8.5 6.25 11.5 12.75 4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-balance text-[clamp(1rem,1.9vw,1.3rem)] font-medium leading-snug tracking-tight text-white">
                          {row.ours}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
