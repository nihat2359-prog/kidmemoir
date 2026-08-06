import "server-only";

import { getLemonConfiguration } from "@/features/billing/config/lemon";
import type {
  BillingPlaceholderResult,
  CheckoutInput,
  WebhookInput,
} from "@/features/billing/types/billing.types";

function unavailable(): BillingPlaceholderResult {
  return {
    available: false,
    reason: getLemonConfiguration().configured
      ? "not_implemented"
      : "not_configured",
  };
}

export const lemonBillingService = {
  async cancelSubscription(
    subscriptionId: string,
  ): Promise<BillingPlaceholderResult> {
    void subscriptionId;
    return unavailable();
  },
  async createCheckout(
    input: CheckoutInput,
  ): Promise<BillingPlaceholderResult> {
    void input;
    return unavailable();
  },
  async getCustomerPortal(userId: string): Promise<BillingPlaceholderResult> {
    void userId;
    return unavailable();
  },
  async resumeSubscription(
    subscriptionId: string,
  ): Promise<BillingPlaceholderResult> {
    void subscriptionId;
    return unavailable();
  },
  async syncSubscription(
    externalSubscriptionId: string,
  ): Promise<BillingPlaceholderResult> {
    void externalSubscriptionId;
    return unavailable();
  },
  async verifyWebhook(input: WebhookInput): Promise<BillingPlaceholderResult> {
    void input;
    return unavailable();
  },
} as const;
