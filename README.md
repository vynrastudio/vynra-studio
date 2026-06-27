# Vynra Studio

Premium creative-studio website — video editing, cinematic storytelling, and
content systems. Built for the **vynrastudio.com** domain.

> _Stories people stop scrolling for._

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** for styling (light luxury / Apple-inspired palette)
- **Framer Motion** + **GSAP (ScrollTrigger)** for animation
- **Lenis** for heavy, buttery-smooth scrolling

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (statically prerendered)
npm start        # serve the production build
```

## Adding your assets

All assets live in `public/vynra-studio-assets/` and are **auto-discovered at
build time** — no code changes needed.

```
public/vynra-studio-assets/
├── logo/                 → first image = navbar + footer logo
├── founder-photo/        → first image = founder portrait
└── portfolio-videos/     → reels, auto-categorized (see folder README)
```

### Portfolio auto-categorization

Drop reels into `portfolio-videos/`. They're sorted into the four categories
automatically — either by a **category sub-folder** or by a **keyword in the
file name**. See `portfolio-videos/README.txt` for the full guide. Card titles
are generated from file names (`aether-brand-film.mp4` → "Aether Brand Film").

Until real videos are added, the site shows elegant placeholder cards so the
full layout is visible.

## Signature interactions

- **Focus Pull hero** — the hero rack-focuses from soft blur to sharp over 1.5s.
- **Magnetic cinematic cursor** — a tiny dot that expands into a translucent
  "PLAY" bubble over portfolio reels (desktop only).
- **Theater-mode portfolio** — GSAP horizontal filmstrip; hovering a reel dims
  the surrounding UI and adds a subtle film-grain overlay.
- **Seamless crossfades** — every section fades-and-pushes-up into view.

All motion respects `prefers-reduced-motion`.

## Configuration

Brand copy, contact details, services, process steps and the Calendly link all
live in [`lib/site.ts`](lib/site.ts). Update the production domain in `site.url`
(currently `https://vynrastudio.com`) — it drives metadata, sitemap and robots.

## Deployment

Zero-config on **Vercel** (recommended) or any Node host:

1. Push the repo to GitHub.
2. Import into Vercel → it detects Next.js automatically.
3. Add the custom domain `vynrastudio.com` in the project's Domains settings.

The site is fully static (`force-static`), so it can also be exported and served
from any CDN.
