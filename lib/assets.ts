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

/** Returns the absolute path of the first image in a folder, or null. */
function firstImageAbs(folder: string): string | null {
  const dir = path.join(ASSET_ROOT, folder);
  return (
    walk(dir).find((f) => IMAGE_EXT.has(path.extname(f).toLowerCase())) ?? null
  );
}

/** Returns the first image found in a folder under the asset root, or null. */
function firstImageIn(folder: string): string | null {
  const abs = firstImageAbs(folder);
  return abs ? toPublicPath(abs) : null;
}

/** Reads intrinsic pixel dimensions from PNG / WebP / JPEG headers. */
function readImageSize(file: string): { width: number; height: number } | null {
  try {
    const fd = fs.openSync(file, "r");
    const buf = Buffer.alloc(64);
    fs.readSync(fd, buf, 0, 64, 0);
    fs.closeSync(fd);
    const ext = path.extname(file).toLowerCase();

    if (ext === ".png") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
    if (ext === ".webp" && buf.toString("ascii", 0, 4) === "RIFF") {
      const fourcc = buf.toString("ascii", 12, 16);
      if (fourcc === "VP8 ") {
        return {
          width: buf.readUInt16LE(26) & 0x3fff,
          height: buf.readUInt16LE(28) & 0x3fff,
        };
      }
      if (fourcc === "VP8X") {
        const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
        const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
        return { width: w, height: h };
      }
      if (fourcc === "VP8L") {
        const b1 = buf[22];
        const b2 = buf[23];
        const b3 = buf[24];
        return {
          width: 1 + (((b2 & 0x3f) << 8) | buf[21]),
          height: 1 + (((b3 & 0x0f) << 10) | (b2 >> 6) | (b1 << 2)),
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export interface LogoAsset {
  src: string;
  width: number;
  height: number;
}

export function getLogo(): LogoAsset | null {
  const abs = firstImageAbs("logo");
  if (!abs) return null;
  const dims = readImageSize(abs) ?? { width: 320, height: 210 };
  return { src: toPublicPath(abs), width: dims.width, height: dims.height };
}

export function getFounderPhoto(): string | null {
  return firstImageIn("founder-photo");
}
