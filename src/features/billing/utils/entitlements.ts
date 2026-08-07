import {
  PLAN_QUOTAS,
  type QuotaLimit,
} from "@/features/billing/constants/quotas";
import type {
  BillingPlan,
  SubscriptionState,
} from "@/features/billing/types/billing.types";

export type SubscriptionEntitlement = Readonly<{
  endDate: string | null;
  plan: BillingPlan;
  status: SubscriptionState;
}>;

function activeGracePeriod(subscription: SubscriptionEntitlement): boolean {
  return (
    subscription.status === "cancelled" &&
    Boolean(subscription.endDate) &&
    new Date(subscription.endDate as string).getTime() > Date.now()
  );
}

export function isPremium(subscription: SubscriptionEntitlement): boolean {
  return (
    subscription.plan === "premium" &&
    (subscription.status === "premium" ||
      subscription.status === "trial" ||
      subscription.status === "past_due" ||
      activeGracePeriod(subscription))
  );
}

export function isExpired(subscription: SubscriptionEntitlement): boolean {
  return (
    subscription.status === "expired" ||
    (subscription.status === "cancelled" && !activeGracePeriod(subscription))
  );
}

function hasCapacity(limit: QuotaLimit, used: number): boolean {
  return limit.kind === "unlimited" || limit.kind === "configured_at_launch"
    ? true
    : used < limit.value;
}

export function canUseAI(
  subscription: SubscriptionEntitlement,
  usedThisMonth: number,
): boolean {
  if (isExpired(subscription)) return false;
  const plan = isPremium(subscription) ? "premium" : "free";
  return hasCapacity(PLAN_QUOTAS[plan].aiRequestsPerMonth, usedThisMonth);
}

export function canCreateChild(
  subscription: SubscriptionEntitlement,
  currentChildren: number,
): boolean {
  const plan = isPremium(subscription) ? "premium" : "free";
  return hasCapacity(PLAN_QUOTAS[plan].children, currentChildren);
}

export function canUploadMedia(
  subscription: SubscriptionEntitlement,
  usedBytes: number,
  incomingBytes: number,
): boolean {
  if (incomingBytes < 0 || isExpired(subscription)) return false;
  const plan = isPremium(subscription) ? "premium" : "free";
  const limit = PLAN_QUOTAS[plan].mediaBytes;
  return limit.kind !== "fixed" || usedBytes + incomingBytes <= limit.value;
}

export function remainingQuota(limit: QuotaLimit, used: number): number | null {
  if (limit.kind !== "fixed") return null;
  return Math.max(0, limit.value - Math.max(0, used));
}
