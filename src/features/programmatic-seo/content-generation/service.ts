import "server-only";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createOrReuseHeroGuide,
  getHeroGuideDraft,
  previewHeroGuide,
} from "@/features/programmatic-seo/hero-generator/repository";
import { countGuideWords } from "@/features/programmatic-seo/hero-generator/quality";
import type { FactoryTemplate } from "@/features/programmatic-seo/types/contentFactory";
import { SEO_CONFIG } from "@/lib/seo/config";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbSchema,
  schemaBuilders,
  webpageSchema,
} from "@/lib/seo/structuredData";
import { renderContentMarkdown } from "./markdown";
import type {
  ContentGenerationOptions,
  ContentGenerationResult,
  GenerateContentInput,
} from "./types";

const inputSchema = z.object({
  locale: z.enum(["tr", "en"]),
  template: z.enum([
    "guide",
    "checklist",
    "timeline",
    "faq",
    "knowledge",
    "comparison",
    "ideas",
    "tool",
    "templates",
    "landing",
  ]),
  topic: z.string().trim().min(2).max(180),
});

function normalizeSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function difficultyFor(template: FactoryTemplate) {
  if (template === "tool") return "advanced" as const;
  if (["comparison", "knowledge"].includes(template))
    return "intermediate" as const;
  return "beginner" as const;
}

async function resolveTopic(input: GenerateContentInput) {
  const db = createAdminClient();
  const columns = "id,title,slug,locale" as const;
  const bySlug = await db
    .from("seo_topics")
    .select(columns)
    .eq("locale", input.locale)
    .eq("slug", normalizeSlug(input.topic))
    .in("status", ["draft", "published"])
    .maybeSingle();
  if (bySlug.data) return bySlug.data;
  const byTitle = await db
    .from("seo_topics")
    .select(columns)
    .eq("locale", input.locale)
    .ilike("title", input.topic)
    .in("status", ["draft", "published"])
    .limit(1)
    .maybeSingle();
  if (byTitle.error || !byTitle.data) throw new Error("SEO_TOPIC_NOT_FOUND");
  return byTitle.data;
}

/** Generates or reuses one quality-gated Content Factory draft. */
export async function generateContent(
  rawInput: GenerateContentInput,
  options: ContentGenerationOptions = {},
): Promise<ContentGenerationResult> {
  const input = inputSchema.parse(rawInput);
  const topic = await resolveTopic(input);
  const db = createAdminClient();
  const intelligence = await db
    .from("seo_topic_intelligence")
    .select("content_tier,search_intent")
    .eq("topic_id", topic.id)
    .maybeSingle();
  const tierValue = intelligence.data?.content_tier ?? 1;
  const tier = (tierValue >= 1 && tierValue <= 3 ? tierValue : 1) as 1 | 2 | 3;
  const generationInput = {
    locale: input.locale,
    searchIntent: intelligence.data?.search_intent ?? "informational",
    template: input.template,
    tier,
    topicId: topic.id,
  } as const;
  const persisted =
    options.persist === false
      ? null
      : await createOrReuseHeroGuide(generationInput);
  const draft = persisted ? await getHeroGuideDraft(persisted.draftId) : null;
  const preview = persisted ? null : await previewHeroGuide(generationInput);
  if (persisted && (!draft || draft.quality_score < 85))
    throw new Error("SEO_CONTENT_QUALITY_GATE_FAILED");
  const generation = draft?.generation ?? preview?.generation;
  const qualityScore = draft?.quality_score ?? preview?.qualityScore;
  if (!generation || qualityScore === undefined)
    throw new Error("SEO_CONTENT_GENERATION_FAILED");
  const { analytics, delivery, generated } = generation;
  const wordCount = countGuideWords(generated);
  const canonicalUrl = new URL(generation.canonical);
  const localizedPrefix = `/${input.locale}`;
  const pagePath = canonicalUrl.pathname.startsWith(localizedPrefix)
    ? canonicalUrl.pathname.slice(localizedPrefix.length)
    : canonicalUrl.pathname;
  const metadata = buildMetadata({
    description: generated.metaDescription,
    imageAlt: generated.hero.title,
    keywords: [
      topic.title,
      ...delivery.internalLinks.map((link) => link.anchor),
    ],
    locale: input.locale,
    openGraphDescription: generated.hero.description,
    openGraphTitle: generated.seoTitle,
    path: pagePath,
    title: generated.metaTitle,
    type: "article",
  });
  const schema = [
    webpageSchema({
      description: generated.metaDescription,
      locale: input.locale,
      name: generated.metaTitle,
      path: pagePath,
    }),
    breadcrumbSchema([
      {
        name: SEO_CONFIG.brand,
        url: new URL(`/${input.locale}`, SEO_CONFIG.siteUrl).toString(),
      },
      { name: generated.metaTitle, url: generation.canonical },
    ]),
    schemaBuilders.faqPage(generated.faq),
    ...(input.template === "checklist" || input.template === "timeline"
      ? [
          schemaBuilders.howTo({
            description: generated.quickAnswer,
            name: generated.hero.title,
            steps: generated.checklist,
          }),
        ]
      : [
          schemaBuilders.article({
            author: SEO_CONFIG.publisher,
            datePublished: draft?.created_at ?? preview!.createdAt,
            description: generated.metaDescription,
            headline: generated.seoTitle,
            url: generation.canonical,
          }),
        ]),
  ];
  return {
    cached: persisted?.cached ?? preview?.cached ?? false,
    checklist: generated.checklist,
    cta: generated.cta,
    difficulty: difficultyFor(input.template),
    draftId: draft?.id ?? null,
    faq: generated.faq,
    internalLinks: delivery.internalLinks,
    markdown: renderContentMarkdown(generated, input.locale),
    media: [
      { suggestions: generated.photoIdeas, type: "photo" },
      { suggestions: generated.videoIdeas, type: "video" },
    ],
    metadata: {
      canonical: generation.canonical,
      value: metadata,
    },
    quality: { minimum: 85, passed: true, score: qualityScore },
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
    schema,
    seo: {
      description: generated.metaDescription,
      locale: input.locale,
      slug: generated.slug,
      title: generated.metaTitle,
    },
    usage: {
      durationMs: analytics.durationMs,
      estimatedCost: analytics.estimatedCost,
      initialValidationPassed: analytics.initialValidationPassed,
      inputTokens: analytics.inputTokens,
      outputTokens: analytics.outputTokens,
      repairAttempts: analytics.repairAttempts,
      repairEstimatedCost: analytics.repairEstimatedCost,
      repairInputTokens: analytics.repairInputTokens,
      repairOutputTokens: analytics.repairOutputTokens,
      totalTokens: analytics.totalTokens,
    },
  };
}
