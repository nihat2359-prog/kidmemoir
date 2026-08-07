import type {
  FactoryTemplate,
  QualityRule,
} from "@/features/programmatic-seo/types/contentFactory";

export const PUBLISH_QUALITY_THRESHOLD = 80;
export const REQUIRED_RULE_THRESHOLD = 60;

export const QUALITY_WEIGHTS: Readonly<Record<QualityRule, number>> = {
  "search-intent-match": 8,
  "title-quality": 6,
  "description-quality": 5,
  "heading-structure": 6,
  "keyword-coverage": 7,
  "internal-links": 7,
  "external-reference-placeholder": 5,
  readability: 7,
  "helpful-content": 10,
  eeat: 9,
  "duplicate-risk": 6,
  "thin-content": 7,
  cannibalization: 5,
  "natural-language": 6,
  originality: 6,
};

export const TEMPLATE_LENGTH_RULES: Readonly<
  Record<
    FactoryTemplate,
    Readonly<{ maximum: number; minimum: number; recommended: number }>
  >
> = {
  guide: { maximum: 3500, minimum: 1600, recommended: 2200 },
  checklist: { maximum: 2200, minimum: 900, recommended: 1300 },
  faq: { maximum: 2200, minimum: 1000, recommended: 1400 },
  comparison: { maximum: 3800, minimum: 1800, recommended: 2400 },
  ideas: { maximum: 3000, minimum: 1400, recommended: 1900 },
  knowledge: { maximum: 3800, minimum: 1800, recommended: 2400 },
  tool: { maximum: 2000, minimum: 800, recommended: 1200 },
  timeline: { maximum: 2800, minimum: 1200, recommended: 1700 },
  templates: { maximum: 2200, minimum: 800, recommended: 1200 },
  landing: { maximum: 1800, minimum: 700, recommended: 1000 },
};
