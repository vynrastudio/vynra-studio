import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date("2026-06-27"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
