import type { AppLocale } from "@/i18n/routing";
import type { SeoCategorySlug } from "@/features/programmatic-seo/constants/categories";

export type SearchIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational"
  | "comparison"
  | "inspirational"
  | "educational";

export type SeoSchemaType =
  "faq" | "howto" | "article" | "webpage" | "checklist" | "guide";

export type SeoHero = Readonly<{
  eyebrow?: string;
  title: string;
  description: string;
  image?: Readonly<{ alt: string; height: number; url: string; width: number }>;
}>;

export type SeoFaqItem = Readonly<{ answer: string; question: string }>;
export type SeoHowTo = Readonly<{
  description: string;
  name: string;
  steps: readonly Readonly<{ text: string; title?: string }>[];
  totalTime?: string;
}>;
export type SeoCta = Readonly<{
  description: string;
  href: string;
  label: string;
  title: string;
}>;

export type SeoContentSection = Readonly<{
  body?: readonly string[];
  id: string;
  items?: readonly Readonly<{
    description: string;
    title?: string;
  }>[];
  title: string;
  type:
    | "quick-summary"
    | "timeline"
    | "parent-tips"
    | "memory-ideas"
    | "photo-ideas"
    | "newsletter";
}>;

export type SeoPage = Readonly<{
  id: string;
  category: SeoCategorySlug;
  locale: AppLocale;
  clusterId: string;
  clusterTitle: string;
  topicId: string;
  topicTitle: string;
  slug: string;
  slugPath: readonly string[];
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  hero: SeoHero;
  content: readonly SeoContentSection[];
  faq: readonly SeoFaqItem[];
  howto: SeoHowTo | null;
  cta: SeoCta;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  readingTime: number;
  searchIntent: SearchIntent;
  searchVolume: number | null;
  parentStage: string | null;
  childAgeMin: number | null;
  childAgeMax: number | null;
  schemaType: SeoSchemaType;
  semanticTerms: readonly string[];
  contentWordCount: number;
  qualityScore: number;
  updatedAt: string;
  publishedAt: string;
}>;

export type RelatedSeoPage = Readonly<{
  category: SeoCategorySlug;
  excerpt: string;
  id: string;
  relationType: string;
  slugPath: readonly string[];
  title: string;
}>;
