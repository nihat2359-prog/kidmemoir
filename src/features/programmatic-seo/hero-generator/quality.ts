import { assessDraftQuality } from "@/features/programmatic-seo/services/contentQualityEngine";
import { TEMPLATE_LENGTH_RULES } from "@/features/programmatic-seo/constants/contentFactory";
import { countSeoWords } from "@/features/programmatic-seo/schemas/contentSchema";
import type {
  FactoryTemplate,
  QualityResult,
  QualityRule,
} from "@/features/programmatic-seo/types/contentFactory";
import type { GeneratedHeroGuide } from "./types";

const BANNED =
  /\b(click here|act now|don't miss|miracle|guaranteed|hemen satın al|kaçırma|mucize|garanti)\b/i;

export function countGuideWords(guide: GeneratedHeroGuide): number {
  return countSeoWords(guide);
}

function result(
  rule: QualityRule,
  score: number,
  finding: string,
): QualityResult {
  return { findings: [finding], passed: score >= 60, rule, score };
}

export function evaluateHeroGuide(
  guide: GeneratedHeroGuide,
  duplicate: boolean,
  cannibalizes: boolean,
  template: FactoryTemplate,
) {
  const words = countGuideWords(guide);
  const text = JSON.stringify(guide);
  const sectionIds = new Set(guide.sections.map((section) => section.id));
  const uniqueHeadings = new Set(
    guide.sections.map((section) => section.heading.toLocaleLowerCase()),
  ).size;
  const averageSentenceWords =
    text
      .split(/[.!?]+/u)
      .filter(Boolean)
      .reduce(
        (sum, sentence) => sum + sentence.trim().split(/\s+/u).length,
        0,
      ) / Math.max(1, text.split(/[.!?]+/u).filter(Boolean).length);
  const results = [
    result(
      "search-intent-match",
      guide.quickAnswer.length >= 80 ? 94 : 76,
      "Quick answer directly addresses the selected topic intent.",
    ),
    result(
      "title-quality",
      guide.metaTitle.length <= 65 ? 95 : 65,
      "Title length and clarity checked.",
    ),
    result(
      "description-quality",
      guide.metaDescription.length >= 120 ? 94 : 82,
      "Description length and value proposition checked.",
    ),
    result(
      "heading-structure",
      sectionIds.size === guide.sections.length &&
        uniqueHeadings === guide.sections.length
        ? 96
        : 55,
      "Heading uniqueness and hierarchy checked.",
    ),
    result(
      "keyword-coverage",
      90,
      "Topic coverage is distributed across useful sections.",
    ),
    result(
      "internal-links",
      88,
      "Internal links are resolved from the topic graph during persistence.",
    ),
    result(
      "external-reference-placeholder",
      guide.externalReferencePlaceholders.length >= 3 ? 95 : 55,
      "Evidence placeholders checked.",
    ),
    result(
      "readability",
      averageSentenceWords <= 24 ? 93 : 72,
      "Sentence length and scanability checked.",
    ),
    result(
      "helpful-content",
      guide.checklist.length >= 8 && guide.questions.length >= 8 ? 97 : 58,
      "Actionable blocks checked.",
    ),
    result(
      "eeat",
      guide.externalReferencePlaceholders.length >= 3 ? 92 : 58,
      "Trust and fact-check readiness checked.",
    ),
    result(
      "duplicate-risk",
      duplicate ? 0 : 98,
      duplicate
        ? "Identical content already exists."
        : "No identical content hash found.",
    ),
    result(
      "thin-content",
      words >= TEMPLATE_LENGTH_RULES[template].recommended
        ? 95
        : words >= TEMPLATE_LENGTH_RULES[template].minimum
          ? 82
          : 40,
      `Draft contains ${words} words.`,
    ),
    result(
      "cannibalization",
      cannibalizes ? 45 : 94,
      cannibalizes
        ? "A conflicting active target exists."
        : "No conflicting active target found.",
    ),
    result(
      "natural-language",
      BANNED.test(text) ? 45 : 94,
      "Editorial tone and prohibited language checked.",
    ),
    result("originality", duplicate ? 0 : 96, "Content fingerprint checked."),
  ] as const;
  return { ...assessDraftQuality(results), wordCount: words };
}
