"use client";

import Image from "next/image";
import { site } from "@/lib/site";
import type { LogoAsset } from "@/lib/assets";

export default function Footer({ logo }: { logo: LogoAsset | null }) {
  const year = 2026;
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-container px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              {logo ? (
                <Image
                  src={logo.src}
                  alt={`${site.name} logo`}
                  width={logo.width}
                  height={logo.height}
                  sizes="56px"
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="h-7 w-7 rounded-md bg-ink" />
              )}
              <span className="text-[17px] font-semibold tracking-tight text-ink">
                {site.name}
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[1rem] leading-relaxed text-muted">
              {site.headline} Premium editing, cinematic storytelling, and
              content systems for creators and businesses.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted/70">
              Contact
            </h4>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  data-cursor="link"
                  className="text-ink transition-colors hover:text-accent"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="text-ink transition-colors hover:text-accent"
                >
                  Book a 30-min call →
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[12px] font-medium uppercase tracking-[0.18em] text-muted/70">
              Social
            </h4>
            <ul className="mt-5 space-y-3 text-[15px]">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="text-ink transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-line pt-7 text-[13px] text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p>
            Crafted by {site.founder.name} · {site.founder.title}
          </p>
        </div>
      </div>
    </footer>
  );
}
