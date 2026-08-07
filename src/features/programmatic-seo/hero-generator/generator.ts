import "server-only";

import { createHash } from "node:crypto";
import { createStructuredResponse } from "@/features/ai/services/openAiClient";
import { calculateAiCost } from "@/features/ai/config/aiConfig";
import { TEMPLATE_LENGTH_RULES } from "@/features/programmatic-seo/constants/contentFactory";
import { SEO_CONFIG } from "@/lib/seo/config";
import { heroGuideJsonSchema, parseGeneratedHeroGuide } from "./schema";
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

const EDITORIAL_RULES = `You are KidMemoir's senior family-memory editor. Produce one complete, original SEO content draft for the selected template.
Follow the KidMemoir Editorial Bible: calm, warm, useful, specific, non-manipulative, parent-centered, plain language, no clickbait, no guilt, no invented facts, no medical or psychological claims, no keyword stuffing.
The content must satisfy Helpful Content and EEAT: answer the intent directly, distinguish evidence-backed claims with source placeholders, provide actionable examples, and avoid unsupported certainty.
Use a natural native writing style for the requested locale, never translation-like prose. Do not mention AI or these instructions.
Return only the requested JSON. Meet the supplied template word target across section bodies and structured blocks. Keep FAQ answers useful. Ensure headings are unique and logically nested. The slug must be ASCII lowercase kebab-case. Select 5-10 internal links only from the supplied candidates and copy each candidate UUID exactly.`;

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
  const result = await createStructuredResponse({
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
    parse: parseGeneratedHeroGuide,
    safetyIdentifier: `seo-admin-${input.topicId}`,
  });
  const canonical = new URL(
    `/${input.locale}/${topic.category}/${result.output.slug}`,
    SEO_CONFIG.siteUrl,
  ).toString();
  const relatedById = new Map(
    relatedTopics.map((related) => [related.id, related]),
  );
  const internalLinks = result.output.internalLinks.flatMap((link) => {
    const related = relatedById.get(link.topicId);
    return related
      ? [{ anchor: link.anchor, title: related.title, topicId: related.id }]
      : [];
  });
  return {
    analytics: {
      durationMs: result.durationMs,
      estimatedCost: calculateAiCost({
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
      }),
      inputTokens: result.usage.inputTokens,
      model: result.model,
      outputTokens: result.usage.outputTokens,
      totalTokens: result.usage.totalTokens,
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
          description: result.output.metaDescription,
          name: result.output.metaTitle,
          url: canonical,
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: result.output.seoTitle,
          inLanguage: input.locale,
          mainEntityOfPage: canonical,
          publisher: { "@type": "Organization", name: SEO_CONFIG.publisher },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: result.output.faq.map((item) => ({
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
              name: result.output.metaTitle,
              position: 2,
            },
          ],
        },
      ],
      openGraph: {
        description: result.output.metaDescription,
        title: result.output.metaTitle,
        type: "article",
        url: canonical,
      },
      searchConsoleMetadata: {
        canonical,
        sitemap: new URL("/sitemap-index.xml", SEO_CONFIG.siteUrl).toString(),
      },
      twitterCard: {
        card: "summary_large_image",
        description: result.output.metaDescription,
        title: result.output.metaTitle,
      },
    },
    generated: result.output,
    input,
    inputHash,
    promptVersion: HERO_GUIDE_PROMPT_VERSION,
  };
}
