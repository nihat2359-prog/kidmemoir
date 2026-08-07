import type { SubscriptionState } from "@/features/billing/types/billing.types";

export function normalizeSubscriptionState({
  plan,
  status,
}: {
  plan: string;
  status: string;
}): SubscriptionState {
  if (status === "trialing") return "trial";
  if (status === "canceled") return "cancelled";
  if (status === "past_due") return "past_due";
  if (status === "expired" || status === "incomplete") return "expired";
  return plan === "premium" ? "premium" : "free";
}
