import type { FactoryTemplate } from "@/features/programmatic-seo/types/contentFactory";
import type { Metadata } from "next";
import type { JsonLd } from "@/lib/seo/structuredData";

export type GenerateContentInput = Readonly<{
  locale: "tr" | "en";
  template: FactoryTemplate;
  topic: string;
}>;

export type ContentGenerationOptions = Readonly<{ persist?: boolean }>;

export type ContentGenerationResult = Readonly<{
  cached: boolean;
  checklist: readonly string[];
  cta: Readonly<{
    description: string;
    label: string;
    target: string;
    title: string;
  }>;
  difficulty: "beginner" | "intermediate" | "advanced";
  draftId: string | null;
  faq: readonly Readonly<{ answer: string; question: string }>[];
  internalLinks: readonly Readonly<{
    anchor: string;
    title: string;
    topicId: string;
  }>[];
  markdown: string;
  media: readonly Readonly<{
    suggestions: readonly string[];
    type: "photo" | "video";
  }>[];
  metadata: Readonly<{
    canonical: string;
    value: Metadata;
  }>;
  quality: Readonly<{ minimum: 85; passed: true; score: number }>;
  readingTime: number;
  schema: readonly JsonLd[];
  seo: Readonly<{
    description: string;
    locale: "tr" | "en";
    slug: string;
    title: string;
  }>;
  usage: Readonly<{
    durationMs: number;
    estimatedCost: number;
    initialValidationPassed: boolean;
    inputTokens: number;
    outputTokens: number;
    repairAttempts: number;
    repairEstimatedCost: number;
    repairInputTokens: number;
    repairOutputTokens: number;
    totalTokens: number;
  }>;
}>;
