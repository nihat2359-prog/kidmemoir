export const FREE_AI_INSIGHT_LIMIT = 20;

export const AI_ENTITLEMENTS = {
  free: {
    annualStory: false,
    developmentInsights: false,
    historyLimit: FREE_AI_INSIGHT_LIMIT,
    memoryConnections: false,
    memoryHighlights: true,
    memoryInsight: true,
    monthlyStory: false,
    pdfStory: false,
    semanticSearch: false,
    weeklyStory: false,
  },
  premium: {
    annualStory: true,
    developmentInsights: true,
    historyLimit: null,
    memoryConnections: true,
    memoryHighlights: true,
    memoryInsight: true,
    monthlyStory: true,
    pdfStory: true,
    semanticSearch: true,
    weeklyStory: true,
  },
} as const;

export type AiPlan = keyof typeof AI_ENTITLEMENTS;
export type AiEntitlement = Exclude<
  keyof (typeof AI_ENTITLEMENTS)["free"],
  "historyLimit"
>;

export function hasAiEntitlement(plan: AiPlan, feature: AiEntitlement) {
  return AI_ENTITLEMENTS[plan][feature];
}
