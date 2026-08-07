import {
  PUBLISH_QUALITY_THRESHOLD,
  QUALITY_WEIGHTS,
  REQUIRED_RULE_THRESHOLD,
  TEMPLATE_LENGTH_RULES,
} from "@/features/programmatic-seo/constants/contentFactory";
import { qualityResultSchema } from "@/features/programmatic-seo/schemas/draftSchema";
import {
  QUALITY_RULES,
  type EditorialStatus,
  type FactoryTemplate,
  type QualityAssessment,
  type QualityResult,
} from "@/features/programmatic-seo/types/contentFactory";

const WORKFLOW_TRANSITIONS: Readonly<
  Record<EditorialStatus, readonly EditorialStatus[]>
> = {
  draft: ["needs_review", "archived"],
  needs_review: ["draft", "approved", "archived"],
  approved: ["needs_review", "published", "archived"],
  published: ["archived"],
  archived: ["draft"],
};

export function assessDraftQuality(
  input: readonly QualityResult[],
): QualityAssessment {
  const results = input.map((result) => qualityResultSchema.parse(result));
  const byRule = new Map(results.map((result) => [result.rule, result]));
  const complete = QUALITY_RULES.every((rule) => byRule.has(rule));
  const weightedTotal = QUALITY_RULES.reduce(
    (total, rule) =>
      total + (byRule.get(rule)?.score ?? 0) * QUALITY_WEIGHTS[rule],
    0,
  );
  const totalWeight = Object.values(QUALITY_WEIGHTS).reduce(
    (total, weight) => total + weight,
    0,
  );
  const score = Math.round(weightedTotal / totalWeight);
  const requiredRulesPass = QUALITY_RULES.every((rule) => {
    const result = byRule.get(rule);
    return Boolean(
      result && result.passed && result.score >= REQUIRED_RULE_THRESHOLD,
    );
  });
  const passed =
    complete && requiredRulesPass && score >= PUBLISH_QUALITY_THRESHOLD;
  return { passed, publishable: passed, results, score };
}

export function meetsTemplateLength(
  template: FactoryTemplate,
  wordCount: number,
): boolean {
  return (
    Number.isInteger(wordCount) &&
    wordCount >= TEMPLATE_LENGTH_RULES[template].minimum
  );
}

export function canTransitionEditorialStatus(
  current: EditorialStatus,
  target: EditorialStatus,
): boolean {
  return WORKFLOW_TRANSITIONS[current].includes(target);
}
