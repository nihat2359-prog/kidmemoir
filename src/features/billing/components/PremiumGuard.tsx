import type { ReactNode } from "react";
import {
  isPremium,
  type SubscriptionEntitlement,
} from "@/features/billing/utils/entitlements";

type PremiumGuardProps = Readonly<{
  children: ReactNode;
  fallback: ReactNode;
  subscription: SubscriptionEntitlement;
}>;

export function PremiumGuard({
  children,
  fallback,
  subscription,
}: PremiumGuardProps) {
  return isPremium(subscription) ? children : fallback;
}
