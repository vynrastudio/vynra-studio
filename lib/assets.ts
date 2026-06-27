import fs from "node:fs";
import path from "node:path";
import { CATEGORIES, Category } from "./site";

const ASSET_ROOT = path.join(
  process.cwd(),
  "public",
  "vynra-studio-assets"
);

const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v", ".ogv"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);

export interface PortfolioItem {
  id: string;
  title: string;
  category: Category;
  src: string | null; // public path to the video, or null (placeholder)
  poster: string | null; // public path to a poster image, if a matching one exists
}

/** Keyword → category map used to auto-classify videos by folder or file name. */
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  "Business Branding": [
    "business",
    "brand",
    "branding",
    "company",
    "corporate",
    "product",
    "saas",
    "agency",
    "startup",
    "promo",
    "ad",
    "commercial",
  ],
  "Creator Branding": [
    "creator",
    "personal",
    "influencer",
    "vlog",
    "youtuber",
    "short",
    "reel",
    "lifestyle",
    "story",
  ],
  "Tech & Educational Content": [
    "tech",
    "education",
    "educational",
    "tutorial",
    "course",
    "explainer",
    "howto",
    "how-to",
    "learn",
    "coding",
    "dev",
    "ai",
    "review",
  ],
  "Thought Leadership": [
    "thought",
    "leadership",
    "podcast",
    "interview",
    "talk",
    "keynote",
    "speaker",
    "founder",
    "insight",
    "opinion",
  ],
};

function slugToTitle(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[\-_]+/g, " ")
    .replace(/\b\d+\b/g, (m) => m)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function classify(segments: string[], index: number): Category {
  // Whole-word tokens only — substring matching would let "ad" match
  // "le-AD-ership" and misfile a Thought Leadership clip under Branding.
  const tokens = new Set(
    segments
      .join(" ")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
  for (const cat of CATEGORIES) {
    if (CATEGORY_KEYWORDS[cat].some((kw) => tokens.has(kw))) {
      return cat;
    }
  }
  // Even, deterministic distribution when nothing matches.
  return CATEGORIES[index % CATEGORIES.length];
}

function toPublicPath(absFile: string): string {
  const publicDir = path.join(process.cwd(), "public");
  return "/" + path.relative(publicDir, absFile).split(path.sep).join("/");
}

function walk(dir: string): string[] {
  let out: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

/** Demo entries shown when no real videos have been uploaded yet. */
function placeholderItems(): PortfolioItem[] {
  const seed: Record<Category, string[]> = {
    "Business Branding": ["Brand Film — Aether", "Product Launch — Nova"],
    "Creator Branding": ["Creator Reel — Maya", "Personal Brand — Dev Diaries"],
    "Tech & Educational Content": [
      "Explainer — How AI Edits",
      "Tutorial — Color Grading",
    ],
    "Thought Leadership": ["Podcast — The Long Game", "Keynote — Build in Public"],
  };
  const items: PortfolioItem[] = [];
  (Object.keys(seed) as Category[]).forEach((cat) => {
    seed[cat].forEach((title, i) => {
      items.push({
        id: `${cat}-${i}`.replace(/\s+/g, "-").toLowerCase(),
        title,
        category: cat,
        src: null,
        poster: null,
      });
    });
  });
  return items;
}

/**
 * Scans public/vynra-studio-assets/portfolio-videos at build time and returns
 * an auto-categorized list. Falls back to elegant placeholders when empty.
 */
export function getPortfolioItems(): PortfolioItem[] {
  const dir = path.join(ASSET_ROOT, "portfolio-videos");
  const files = walk(dir).filter((f) =>
    VIDEO_EXT.has(path.extname(f).toLowerCase())
  );

  if (files.length === 0) return placeholderItems();

  // Build a lookup of available poster images by basename (without extension).
  const posters = new Map<string, string>();
  walk(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .forEach((f) => {
      const base = path.basename(f).replace(/\.[^.]+$/, "").toLowerCase();
      posters.set(base, toPublicPath(f));
    });

  return files
    .sort((a, b) => a.localeCompare(b))
    .map((file, index) => {
      const rel = path.relative(dir, file);
      const segments = rel.split(path.sep);
      const base = path.basename(file).replace(/\.[^.]+$/, "");
      return {
        id: rel.replace(/[^a-z0-9]+/gi, "-").toLowerCase(),
        title: slugToTitle(base),
        category: classify(segments, index),
        src: toPublicPath(file),
        poster: posters.get(base.toLowerCase()) ?? null,
      };
    });
}

/** Returns the first image found in a folder under the asset root, or null. */
function firstImageIn(folder: string): string | null {
  const dir = path.join(ASSET_ROOT, folder);
  const img = walk(dir).find((f) =>
    IMAGE_EXT.has(path.extname(f).toLowerCase())
  );
  return img ? toPublicPath(img) : null;
}

export function getLogo(): string | null {
  return firstImageIn("logo");
}

export function getFounderPhoto(): string | null {
  return firstImageIn("founder-photo");
}
