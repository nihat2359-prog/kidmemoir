import type { BillingPlan } from "@/features/billing/types/billing.types";

export type QuotaLimit =
  | Readonly<{ kind: "configured_at_launch" }>
  | Readonly<{ kind: "fixed"; value: number }>
  | Readonly<{ kind: "unlimited" }>;

export type PlanQuotaPolicy = Readonly<{
  aiRequestsPerMonth: QuotaLimit;
  children: QuotaLimit;
  featureSet: "basic" | "premium";
  mediaBytes: QuotaLimit;
}>;

const GIBIBYTE = 1024 ** 3;

export const PLAN_QUOTAS: Record<BillingPlan, PlanQuotaPolicy> = {
  free: {
    aiRequestsPerMonth: { kind: "configured_at_launch" },
    children: { kind: "fixed", value: 1 },
    featureSet: "basic",
    mediaBytes: { kind: "fixed", value: GIBIBYTE },
  },
  premium: {
    aiRequestsPerMonth: { kind: "unlimited" },
    children: { kind: "unlimited" },
    featureSet: "premium",
    mediaBytes: { kind: "configured_at_launch" },
  },
};
