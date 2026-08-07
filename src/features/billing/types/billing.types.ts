export type BillingPlan = "free" | "premium";
export type SubscriptionState =
  "cancelled" | "expired" | "free" | "past_due" | "premium" | "trial";

export type CheckoutInput = Readonly<{
  email: string;
  locale: "en" | "tr";
  plan: "premium";
  userId: string;
}>;

export type WebhookInput = Readonly<{
  payload: string;
  signature: string;
}>;

export const LEMON_EVENTS = [
  "subscription_created",
  "subscription_updated",
  "subscription_resumed",
  "subscription_cancelled",
  "subscription_expired",
  "subscription_payment_success",
  "subscription_payment_failed",
  "order_created",
] as const;

export type LemonEventName = (typeof LEMON_EVENTS)[number];

export type LemonWebhook = Readonly<{
  attributes: Record<string, unknown>;
  customData: Record<string, unknown>;
  eventName: LemonEventName;
  resourceId: string;
  resourceType: string;
}>;

export type LemonSubscriptionUrls = Readonly<{
  customerPortal: string | null;
  updatePaymentMethod: string | null;
}>;
