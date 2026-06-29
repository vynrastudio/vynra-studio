import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * The site is a single route (`/`) whose key areas are in-page sections.
 * We list the homepage plus each important section anchor so they're
 * discoverable. Note: search engines collapse `#fragment` URLs onto the
 * homepage for indexing — the homepage entry carries the canonical weight.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/#work`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/#founder`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/#services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/#process`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
