import type { SearchIntent } from "@/features/programmatic-seo/types/content";

export type ContentTier = 1 | 2 | 3;

export type PrioritySignals = Readonly<{
  authorityContribution: number;
  competition: number;
  evergreen: number;
  internalLinkStrength: number;
  parentValue: number;
  premiumConversion: number;
  seoValue: number;
}>;

export type QualitySignals = Readonly<{
  authorityContribution: number;
  conversion: number;
  informationValue: number;
  intent: number;
  internalLinking: number;
  uniqueness: number;
}>;

export type TopicIntelligence = Readonly<{
  priorityScore: number;
  qualityScore: number;
  searchIntent: SearchIntent;
  tier: ContentTier;
}>;
