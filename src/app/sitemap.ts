import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pricing", "/help", "/privacy", "/terms"].flatMap((path) => {
    const languages = {
      en: `https://kidmemoir.com/en${path}`,
      tr: `https://kidmemoir.com/tr${path}`,
    };
    return Object.values(languages).map((url) => ({
      alternates: { languages },
      changeFrequency: path ? ("monthly" as const) : ("weekly" as const),
      lastModified: new Date(),
      priority: path ? 0.7 : 1,
      url,
    }));
  });
}
