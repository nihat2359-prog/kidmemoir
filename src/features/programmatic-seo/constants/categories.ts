export const SEO_CATEGORIES = [
  "guides",
  "milestones",
  "activities",
  "memory-ideas",
  "photo-ideas",
  "checklists",
  "templates",
  "questions",
  "compare",
  "tools",
  "knowledge",
] as const;

export type SeoCategory = (typeof SEO_CATEGORIES)[number];
export type SeoCategorySlug = string;

export function isSeoCategorySlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function isSeoCategory(value: string): value is SeoCategory {
  return SEO_CATEGORIES.some((category) => category === value);
}
