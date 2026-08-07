import "server-only";

import { createHash } from "node:crypto";
import { createStructuredResponse } from "@/features/ai/services/openAiClient";
import { calculateAiCost } from "@/features/ai/config/aiConfig";
import { TEMPLATE_LENGTH_RULES } from "@/features/programmatic-seo/constants/contentFactory";
import { SEO_CONFIG } from "@/lib/seo/config";
import {
  generatedHeroGuideSchema,
  heroGuideJsonSchema,
  heroGuideRepairJsonSchema,
  parseHeroGuideRepairPatch,
  type HeroGuideRepairPatch,
} from "./schema";
import {
  HERO_GUIDE_PROMPT_VERSION,
  type HeroGuideGeneration,
  type HeroGuideInput,
} from "./types";

type TopicContext = Readonly<{
  category: string;
  description: string;
  slug: string;
  title: string;
}>;
type RelatedTopic = Readonly<{ id: string; title: string }>;

const HERO_GENERATION_TIMEOUT_MS = 240_000;

const EDITORIAL_RULES = `You are KidMemoir's senior family-memory editor. Produce one complete, original SEO content draft for the selected template.
Follow the KidMemoir Editorial Bible: calm, warm, useful, specific, non-manipulative, parent-centered, plain language, no clickbait, no guilt, no invented facts, no medical or psychological claims, no keyword stuffing.
The content must satisfy Helpful Content and EEAT: answer the intent directly, distinguish evidence-backed claims with source placeholders, provide actionable examples, and avoid unsupported certainty.
Use a natural native writing style for the requested locale, never translation-like prose. Do not mention AI or these instructions.
Return only the requested JSON. Keep FAQ answers useful. Ensure headings are unique and logically nested. The slug must be ASCII lowercase kebab-case. Select 5-10 internal links only from the supplied candidates and copy each candidate UUID exactly.
WORD COUNT CONTRACT: targetLength.minimum is a hard minimum, not a suggestion. Count the complete draft before responding and never return fewer words than targetLength.minimum. Aim for targetLength.recommended without exceeding targetLength.maximum.
METADATA CONTRACT: metaDescription must contain 70-160 characters, metaTitle 20-65 characters, and seoTitle 20-70 characters. Count characters before responding.
COMPLETION CONTRACT — count every item before responding: externalReferencePlaceholders >= 3; faq >= 5; introduction >= 2 complete paragraphs; letters >= 4; memoryIdeas >= 6; photoIdeas >= 6; questions >= 8; timeline >= 6; sections >= 10; every sections[].body >= 2 complete paragraphs of at least 40 characters each. Never omit a required field and never return an undersized collection.`;

const REPAIR_RULES = `Repair only the fields named by validationIssues. Return null for every field that does not need repair. Do not rewrite valid content. Metadata limits are strict: metaDescription 70-160 characters, metaTitle 20-65 characters, seoTitle 20-70 characters. For sectionRepairs, return only invalid sections, preserving their id, type, and heading; add new complete sections only when the section count is below 10. Every repaired paragraph must contain at least 40 characters. Observe these minimums: externalReferencePlaceholders 3, faq 5, introduction 2 paragraphs, letters 4, memoryIdeas 6, photoIdeas 6, questions 8, timeline 6, and each repaired section body 2 paragraphs.`;

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function stableHash(value: unknown): string {
  return createHash("sha256").update(stableJson(value)).digest("hex");
}

function applyRepair(candidate: unknown, patch: HeroGuideRepairPatch): unknown {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate))
    return candidate;
  const repaired = { ...(candidate as Record<string, unknown>) };
  for (const key of [
    "externalReferencePlaceholders",
    "faq",
    "introduction",
    "letters",
    "memoryIdeas",
    "metaDescription",
    "metaTitle",
    "photoIdeas",
    "questions",
    "seoTitle",
    "timeline",
  ] as const) {
    if (patch[key] !== null) repaired[key] = patch[key];
  }
  if (patch.sectionRepairs) {
    const current = Array.isArray(repaired.sections)
      ? (repaired.sections as Record<string, unknown>[])
      : [];
    const byId = new Map(current.map((section) => [section.id, section]));
    patch.sectionRepairs.forEach((section) => byId.set(section.id, section));
    repaired.sections = [...byId.values()];
  }
  return repaired;
}

export function getHeroGuideInputHash(
  input: HeroGuideInput,
  topic: TopicContext,
  relatedTopics: readonly RelatedTopic[],
): string {
  return stableHash({
    input,
    promptVersion: HERO_GUIDE_PROMPT_VERSION,
    relatedTopicIds: relatedTopics.map(({ id }) => id).sort(),
    topic,
  });
}

export async function generateHeroGuide(
  input: HeroGuideInput,
  topic: TopicContext,
  relatedTopics: readonly RelatedTopic[],
): Promise<HeroGuideGeneration> {
  const inputHash = getHeroGuideInputHash(input, topic, relatedTopics);
  const initial = await createStructuredResponse({
    idempotencyKey: inputHash,
    input: {
      editorialStandard: "KidMemoir Editorial Bible v1",
      internalLinkCandidates: relatedTopics,
      locale: input.locale,
      requiredBlocks: [
        "Hero",
        "Quick Answer",
        "Featured Snippet",
        "Introduction",
        "H2/H3 sections",
        "Checklist",
        "Timeline",
        "Memory Ideas",
        "Photo Ideas",
        "Video Ideas",
        "Letters",
        "Questions",
        "FAQ",
        "Comparison Table",
        "Common Mistakes",
        "Conclusion",
        "CTA",
        "External Reference Placeholders",
      ],
      searchIntent: input.searchIntent,
      template: input.template,
      targetLength: TEMPLATE_LENGTH_RULES[input.template],
      tier: input.tier,
      topic,
    },
    instructions: EDITORIAL_RULES,
    maxOutputTokens: 9_000,
    name: "kidmemoir_hero_guide",
    outputSchema: heroGuideJsonSchema,
    parse: (value) => value,
    safetyIdentifier: `seo-admin-${input.topicId}`,
    timeoutMs: HERO_GENERATION_TIMEOUT_MS,
  });
  let candidate: unknown = initial.output;
  let validation = generatedHeroGuideSchema.safeParse(candidate);
  const initialValidationPassed = validation.success;
  let repairAttempts = 0;
  let repairDurationMs = 0;
  let repairInputTokens = 0;
  let repairOutputTokens = 0;
  while (!validation.success && repairAttempts < 2) {
    repairAttempts += 1;
    const issues = validation.error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path.join("."),
    }));
    const candidateRecord =
      candidate && typeof candidate === "object" && !Array.isArray(candidate)
        ? (candidate as Record<string, unknown>)
        : {};
    const sections = Array.isArray(candidateRecord.sections)
      ? candidateRecord.sections
      : [];
    const deficientSectionIndexes = new Set(
      validation.error.issues
        .filter((issue) => issue.path[0] === "sections")
        .map((issue) => issue.path[1])
        .filter((index): index is number => typeof index === "number"),
    );
    const repair = await createStructuredResponse({
      idempotencyKey: `${inputHash}-repair-${repairAttempts}`,
      input: {
        currentCounts: Object.fromEntries(
          [
            "externalReferencePlaceholders",
            "faq",
            "introduction",
            "letters",
            "memoryIdeas",
            "metaDescription",
            "metaTitle",
            "photoIdeas",
            "questions",
            "seoTitle",
            "sections",
            "timeline",
          ].map((key) => [
            key,
            Array.isArray(candidateRecord[key])
              ? candidateRecord[key].length
              : 0,
          ]),
        ),
        deficientSections: sections.filter((_, index) =>
          deficientSectionIndexes.has(index),
        ),
        locale: input.locale,
        topic,
        validationIssues: issues,
      },
      instructions: REPAIR_RULES,
      maxOutputTokens: 3_500,
      name: "kidmemoir_content_repair",
      outputSchema: heroGuideRepairJsonSchema,
      parse: parseHeroGuideRepairPatch,
      safetyIdentifier: `seo-admin-${input.topicId}`,
      timeoutMs: HERO_GENERATION_TIMEOUT_MS,
    });
    repairDurationMs += repair.durationMs;
    repairInputTokens += repair.usage.inputTokens;
    repairOutputTokens += repair.usage.outputTokens;
    candidate = applyRepair(candidate, repair.output);
    validation = generatedHeroGuideSchema.safeParse(candidate);
  }
  const output = generatedHeroGuideSchema.parse(candidate);
  const canonical = new URL(
    `/${input.locale}/${topic.category}/${output.slug}`,
    SEO_CONFIG.siteUrl,
  ).toString();
  const relatedById = new Map(
    relatedTopics.map((related) => [related.id, related]),
  );
  const internalLinks = output.internalLinks.flatMap((link) => {
    const related = relatedById.get(link.topicId);
    return related
      ? [{ anchor: link.anchor, title: related.title, topicId: related.id }]
      : [];
  });
  return {
    analytics: {
      durationMs: initial.durationMs + repairDurationMs,
      estimatedCost: calculateAiCost({
        inputTokens: initial.usage.inputTokens + repairInputTokens,
        outputTokens: initial.usage.outputTokens + repairOutputTokens,
      }),
      initialValidationPassed,
      inputTokens: initial.usage.inputTokens + repairInputTokens,
      model: initial.model,
      outputTokens: initial.usage.outputTokens + repairOutputTokens,
      repairAttempts,
      repairEstimatedCost: calculateAiCost({
        inputTokens: repairInputTokens,
        outputTokens: repairOutputTokens,
      }),
      repairInputTokens,
      repairOutputTokens,
      totalTokens:
        initial.usage.totalTokens + repairInputTokens + repairOutputTokens,
    },
    canonical,
    delivery: {
      analyticsMetadata: {
        contentTier: input.tier,
        locale: input.locale,
        searchIntent: input.searchIntent,
        template: input.template,
        topicId: input.topicId,
      },
      internalLinks,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          description: output.metaDescription,
          name: output.metaTitle,
          url: canonical,
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: output.seoTitle,
          inLanguage: input.locale,
          mainEntityOfPage: canonical,
          publisher: { "@type": "Organization", name: SEO_CONFIG.publisher },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: output.faq.map((item) => ({
            "@type": "Question",
            acceptedAnswer: { "@type": "Answer", text: item.answer },
            name: item.question,
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              item: new URL(`/${input.locale}`, SEO_CONFIG.siteUrl).toString(),
              name: SEO_CONFIG.brand,
              position: 1,
            },
            {
              "@type": "ListItem",
              item: canonical,
              name: output.metaTitle,
              position: 2,
            },
          ],
        },
      ],
      openGraph: {
        description: output.metaDescription,
        title: output.metaTitle,
        type: "article",
        url: canonical,
      },
      searchConsoleMetadata: {
        canonical,
        sitemap: new URL("/sitemap-index.xml", SEO_CONFIG.siteUrl).toString(),
      },
      twitterCard: {
        card: "summary_large_image",
        description: output.metaDescription,
        title: output.metaTitle,
      },
    },
    generated: output,
    input,
    inputHash,
    promptVersion: HERO_GUIDE_PROMPT_VERSION,
  };
}
