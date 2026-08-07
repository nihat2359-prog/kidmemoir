export const CONTENT_SECTION_TYPES = [
  "hero",
  "introduction",
  "quick-summary",
  "timeline",
  "parent-tips",
  "memory-ideas",
  "photo-ideas",
  "questions-to-ask",
  "checklist",
  "common-mistakes",
  "faq",
  "related-topics",
  "cta",
  "conclusion",
] as const;

export const QUALITY_RULES = [
  "search-intent-match",
  "title-quality",
  "description-quality",
  "heading-structure",
  "keyword-coverage",
  "internal-links",
  "external-reference-placeholder",
  "readability",
  "helpful-content",
  "eeat",
  "duplicate-risk",
  "thin-content",
  "cannibalization",
  "natural-language",
  "originality",
] as const;

export type ContentSectionType = (typeof CONTENT_SECTION_TYPES)[number];
export type QualityRule = (typeof QUALITY_RULES)[number];
export type EditorialStatus =
  "draft" | "needs_review" | "approved" | "published" | "archived";
export type FactoryTemplate =
  | "guide"
  | "checklist"
  | "faq"
  | "comparison"
  | "ideas"
  | "knowledge"
  | "tool"
  | "timeline"
  | "templates"
  | "landing";
export type MediaRecommendationType =
  "photo" | "video" | "infographic" | "illustration" | "table";

export type QualityResult = Readonly<{
  findings: readonly string[];
  passed: boolean;
  rule: QualityRule;
  score: number;
}>;

export type QualityAssessment = Readonly<{
  passed: boolean;
  publishable: boolean;
  results: readonly QualityResult[];
  score: number;
}>;
