import type { FactoryTemplate } from "@/features/programmatic-seo/types/contentFactory";

export const HERO_GUIDE_PROMPT_VERSION = "content-generation-v6";

export type HeroGuideInput = Readonly<{
  locale: "tr" | "en";
  searchIntent: string;
  template: FactoryTemplate;
  tier: 1 | 2 | 3;
  topicId: string;
}>;

export type HeroGuideSection = Readonly<{
  body: readonly string[];
  heading: string;
  id: string;
  type:
    | "introduction"
    | "quick-summary"
    | "timeline"
    | "parent-tips"
    | "memory-ideas"
    | "photo-ideas"
    | "questions-to-ask"
    | "checklist"
    | "common-mistakes"
    | "conclusion";
}>;

export type GeneratedHeroGuide = Readonly<{
  checklist: readonly string[];
  commonMistakes: readonly Readonly<{ correction: string; mistake: string }>[];
  comparison: Readonly<{
    columns: readonly string[];
    rows: readonly (readonly string[])[];
  }>;
  conclusion: readonly string[];
  cta: Readonly<{
    description: string;
    label: string;
    target: "register" | "premium" | "timeline" | "memory-book" | "ai-features";
    title: string;
  }>;
  externalReferencePlaceholders: readonly Readonly<{
    claim: string;
    sectionId: string;
  }>[];
  faq: readonly Readonly<{ answer: string; question: string }>[];
  featuredSnippet: string;
  hero: Readonly<{ description: string; eyebrow: string; title: string }>;
  introduction: readonly string[];
  internalLinks: readonly Readonly<{ anchor: string; topicId: string }>[];
  letters: readonly string[];
  memoryIdeas: readonly string[];
  metaDescription: string;
  metaTitle: string;
  photoIdeas: readonly string[];
  questions: readonly string[];
  quickAnswer: string;
  sections: readonly HeroGuideSection[];
  seoTitle: string;
  slug: string;
  timeline: readonly Readonly<{ description: string; label: string }>[];
  videoIdeas: readonly string[];
}>;

export type HeroGuideGeneration = Readonly<{
  analytics: Readonly<{
    durationMs: number;
    estimatedCost: number;
    initialValidationPassed: boolean;
    inputTokens: number;
    model: string;
    outputTokens: number;
    repairAttempts: number;
    repairEstimatedCost: number;
    repairInputTokens: number;
    repairOutputTokens: number;
    totalTokens: number;
  }>;
  canonical: string;
  delivery: Readonly<{
    analyticsMetadata: Readonly<Record<string, string | number>>;
    internalLinks: readonly Readonly<{
      anchor: string;
      title: string;
      topicId: string;
    }>[];
    jsonLd: readonly Readonly<Record<string, unknown>>[];
    openGraph: Readonly<{
      description: string;
      title: string;
      type: "article";
      url: string;
    }>;
    searchConsoleMetadata: Readonly<{ canonical: string; sitemap: string }>;
    twitterCard: Readonly<{
      card: "summary_large_image";
      description: string;
      title: string;
    }>;
  }>;
  generated: GeneratedHeroGuide;
  input: HeroGuideInput;
  inputHash: string;
  promptVersion: string;
}>;
