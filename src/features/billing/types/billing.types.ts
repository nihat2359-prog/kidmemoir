export type BillingPlan = "free" | "premium";
export type SubscriptionState =
  "cancelled" | "expired" | "free" | "premium" | "trial";

export type BillingUnavailableReason = "not_configured" | "not_implemented";

export type BillingPlaceholderResult = Readonly<{
  available: false;
  reason: BillingUnavailableReason;
}>;

export type CheckoutInput = Readonly<{
  locale: "en" | "tr";
  userId: string;
}>;

export type WebhookInput = Readonly<{
  payload: string;
  signature: string;
}>;
