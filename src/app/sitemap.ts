import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pricing", "/help", "/privacy", "/terms", "/support"].flatMap(
    (path) => {
      const languages = {
        en: `https://www.kidmemoir.com/en${path}`,
        tr: `https://www.kidmemoir.com/tr${path}`,
        "x-default": `https://www.kidmemoir.com/en${path}`,
      };
      return [languages.en, languages.tr].map((url) => ({
        alternates: { languages },
        changeFrequency: path ? ("monthly" as const) : ("weekly" as const),
        priority: path ? 0.7 : 1,
        url,
      }));
    },
  );
}
