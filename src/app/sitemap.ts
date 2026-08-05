import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    en: "https://kidmemoir.com/en",
    tr: "https://kidmemoir.com/tr",
  };

  return Object.values(languages).map((url) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
    alternates: { languages },
  }));
}
