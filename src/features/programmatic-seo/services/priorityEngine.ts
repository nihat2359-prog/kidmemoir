import type {
  ContentTier,
  PrioritySignals,
  QualitySignals,
} from "@/features/programmatic-seo/types/intelligence";

function boundedScore(value: number): number {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("SEO intelligence scores must be between 0 and 100.");
  }
  return value;
}

export function calculatePriorityScore(signals: PrioritySignals): number {
  const score =
    boundedScore(signals.seoValue) * 0.2 +
    boundedScore(signals.evergreen) * 0.15 +
    boundedScore(signals.premiumConversion) * 0.15 +
    boundedScore(signals.parentValue) * 0.2 +
    (100 - boundedScore(signals.competition)) * 0.1 +
    boundedScore(signals.internalLinkStrength) * 0.1 +
    boundedScore(signals.authorityContribution) * 0.1;
  return Math.round(score);
}

export function resolveContentTier(priorityScore: number): ContentTier {
  const score = boundedScore(priorityScore);
  if (score >= 80) return 1;
  if (score >= 60) return 2;
  return 3;
}

export function calculateQualityScore(signals: QualitySignals): number {
  const scores = Object.values(signals).map(boundedScore);
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / 6);
}
