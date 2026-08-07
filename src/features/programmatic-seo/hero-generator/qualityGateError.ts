import type { HeroGuideGeneration } from "./types";

type GenerationAnalytics = HeroGuideGeneration["analytics"];

export class SeoQualityGateError extends Error {
  readonly analytics: GenerationAnalytics;
  readonly qualityScore: number;

  constructor(qualityScore: number, analytics: GenerationAnalytics) {
    super(`SEO_QUALITY_GATE_${qualityScore}`);
    this.name = "SeoQualityGateError";
    this.analytics = analytics;
    this.qualityScore = qualityScore;
  }
}
