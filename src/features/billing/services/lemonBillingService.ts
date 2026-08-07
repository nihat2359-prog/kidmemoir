import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { requireLemonConfiguration } from "@/features/billing/config/lemon";
import {
  LEMON_EVENTS,
  type CheckoutInput,
  type LemonSubscriptionUrls,
  type LemonWebhook,
  type WebhookInput,
} from "@/features/billing/types/billing.types";
import { createAdminClient } from "@/lib/supabase/admin";

const apiResponseSchema = z.object({
  data: z.object({
    attributes: z.record(z.unknown()),
    id: z.string(),
    type: z.string(),
  }),
});

const webhookSchema = z.object({
  data: z.object({
    attributes: z.record(z.unknown()),
    id: z.union([z.string(), z.number()]).transform(String),
    type: z.string(),
  }),
  meta: z.object({
    custom_data: z.record(z.unknown()).optional().default({}),
    event_name: z.enum(LEMON_EVENTS),
  }),
});

const userIdSchema = z.string().uuid();
const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";
const CHECKOUT_TTL_MS = 30 * 60 * 1000;
const WEBHOOK_CLAIM_STALE_MS = 2 * 60 * 1000;

class LemonApiError extends Error {
  constructor(readonly status: number) {
    super("Billing provider request failed");
    this.name = "LemonApiError";
  }
}

async function lemonRequest(
  path: string,
  init: RequestInit = {},
): Promise<z.infer<typeof apiResponseSchema>> {
  const configuration = requireLemonConfiguration();
  const response = await fetch(`${LEMON_API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${configuration.LEMON_API_KEY}`,
      "Content-Type": "application/vnd.api+json",
      ...init.headers,
    },
  });
  if (!response.ok) throw new LemonApiError(response.status);
  return apiResponseSchema.parse(await response.json());
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function idValue(value: unknown): string | null {
  return typeof value === "number" || typeof value === "string"
    ? String(value)
    : null;
}

function subscriptionUrls(
  attributes: Record<string, unknown>,
): LemonSubscriptionUrls {
  const urls = z.record(z.unknown()).safeParse(attributes.urls);
  return {
    customerPortal: urls.success
      ? stringValue(urls.data.customer_portal)
      : null,
    updatePaymentMethod: urls.success
      ? stringValue(urls.data.update_payment_method)
      : null,
  };
}

function databaseStatus(status: unknown): {
  plan: "free" | "premium";
  status:
    "active" | "canceled" | "expired" | "incomplete" | "past_due" | "trialing";
} {
  if (status === "active") return { plan: "premium", status: "active" };
  if (status === "on_trial") return { plan: "premium", status: "trialing" };
  if (status === "cancelled") return { plan: "premium", status: "canceled" };
  if (status === "expired") return { plan: "free", status: "expired" };
  if (status === "past_due" || status === "unpaid" || status === "paused")
    return { plan: "premium", status: "past_due" };
  return { plan: "free", status: "incomplete" };
}

async function syncProfile(
  userId: string,
  plan: "free" | "premium",
  status: string,
) {
  const admin = createAdminClient();
  const result = await admin
    .from("profiles")
    .update({ subscription_plan: plan, subscription_status: status })
    .eq("id", userId);
  if (result.error)
    throw new Error("Billing profile sync failed", { cause: result.error });
}

async function clearCheckoutSession(userId: string): Promise<void> {
  const result = await createAdminClient()
    .from("billing_checkout_sessions")
    .delete()
    .eq("user_id", userId);
  if (result.error)
    throw new Error("Billing checkout cleanup failed", { cause: result.error });
}

async function syncSubscriptionEvent(event: LemonWebhook): Promise<void> {
  const configuration = requireLemonConfiguration();
  const attributes = event.attributes;
  const storeId = idValue(attributes.store_id);
  const productId = idValue(attributes.product_id);
  const variantId = idValue(attributes.variant_id);
  if (storeId && storeId !== configuration.LEMON_STORE_ID)
    throw new Error("Webhook store mismatch");
  if (productId && productId !== configuration.LEMON_PRODUCT_ID)
    throw new Error("Webhook product mismatch");
  if (variantId && variantId !== configuration.LEMON_VARIANT_ID)
    throw new Error("Webhook variant mismatch");

  const externalSubscriptionId =
    event.resourceType === "subscriptions"
      ? event.resourceId
      : idValue(attributes.subscription_id);
  const customUserId = userIdSchema.safeParse(event.customData.user_id);
  const admin = createAdminClient();
  const existing = externalSubscriptionId
    ? await admin
        .from("subscriptions")
        .select("user_id,premium_started_at,status,current_period_start")
        .eq("provider", "lemon")
        .eq("provider_subscription_id", externalSubscriptionId)
        .maybeSingle()
    : { data: null, error: null };
  if (existing.error)
    throw new Error("Billing subscription lookup failed", {
      cause: existing.error,
    });
  const userId = customUserId.success
    ? customUserId.data
    : existing.data?.user_id;
  if (!userId) {
    if (event.eventName === "order_created") return;
    throw new Error("Webhook user identity is missing");
  }

  if (event.eventName === "subscription_payment_success") {
    const payment = await admin
      .from("subscriptions")
      .update({
        last_payment_at:
          stringValue(attributes.created_at) ?? new Date().toISOString(),
        plan: "premium",
        status: "active",
      })
      .eq("user_id", userId);
    if (payment.error)
      throw new Error("Billing payment sync failed", { cause: payment.error });
    await syncProfile(userId, "premium", "active");
    await clearCheckoutSession(userId);
    return;
  }

  if (event.eventName === "subscription_payment_failed") {
    const failed = await admin
      .from("subscriptions")
      .update({ status: "past_due" })
      .eq("user_id", userId);
    if (failed.error)
      throw new Error("Billing payment failure sync failed", {
        cause: failed.error,
      });
    await syncProfile(userId, "premium", "past_due");
    await clearCheckoutSession(userId);
    return;
  }

  if (event.eventName === "order_created") {
    const order = await admin
      .from("subscriptions")
      .update({ provider_order_id: event.resourceId })
      .eq("user_id", userId);
    if (order.error)
      throw new Error("Billing order sync failed", { cause: order.error });
    await clearCheckoutSession(userId);
    return;
  }

  const mapped = databaseStatus(attributes.status);
  const now = new Date().toISOString();
  const renewsAt = stringValue(attributes.renews_at);
  const endsAt = stringValue(attributes.ends_at);
  const cancelledAt =
    mapped.status === "canceled"
      ? (stringValue(attributes.updated_at) ?? now)
      : null;
  const result = await admin.from("subscriptions").upsert(
    {
      billing_cycle: "yearly",
      cancelled_at: cancelledAt,
      current_period_end: endsAt ?? renewsAt,
      current_period_start:
        existing.data?.current_period_start ??
        stringValue(attributes.created_at) ??
        now,
      next_payment_at:
        mapped.status === "active" || mapped.status === "trialing"
          ? renewsAt
          : null,
      plan: mapped.plan,
      premium_started_at:
        existing.data?.premium_started_at ??
        (mapped.plan === "premium" ? now : null),
      provider: "lemon",
      provider_customer_id: idValue(attributes.customer_id),
      provider_order_id: idValue(attributes.order_id),
      product_id: productId,
      provider_subscription_id: externalSubscriptionId,
      renews_at: renewsAt,
      status: mapped.status,
      user_id: userId,
      variant_id: variantId,
    },
    { onConflict: "user_id" },
  );
  if (result.error)
    throw new Error("Billing subscription sync failed", {
      cause: result.error,
    });
  await syncProfile(userId, mapped.plan, mapped.status);
  await clearCheckoutSession(userId);
}

export const lemonBillingService = {
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await lemonRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      method: "DELETE",
    });
  },

  async createCheckout(input: CheckoutInput): Promise<string> {
    const configuration = requireLemonConfiguration();
    const admin = createAdminClient();
    const now = new Date();
    const returnUrl = `${configuration.NEXT_PUBLIC_APP_URL}/${input.locale}/subscription/success`;
    const cancelUrl = `${configuration.NEXT_PUBLIC_APP_URL}/${input.locale}/subscription/cancel`;
    const cached = await admin
      .from("billing_checkout_sessions")
      .select("checkout_url,expires_at,provider_checkout_id,state")
      .eq("user_id", input.userId)
      .gt("expires_at", now.toISOString())
      .maybeSingle();
    if (cached.error)
      throw new Error("Billing checkout lookup failed", {
        cause: cached.error,
      });
    if (cached.data?.state === "ready" && cached.data.checkout_url) {
      let matchesCurrentEnvironment = false;
      if (cached.data.provider_checkout_id) {
        try {
          const existingCheckout = await lemonRequest(
            `/checkouts/${encodeURIComponent(cached.data.provider_checkout_id)}`,
          );
          const checkoutOptions = z
            .record(z.unknown())
            .safeParse(existingCheckout.data.attributes.checkout_options);
          const productOptions = z
            .record(z.unknown())
            .safeParse(existingCheckout.data.attributes.product_options);
          const checkoutData = z
            .record(z.unknown())
            .safeParse(existingCheckout.data.attributes.checkout_data);
          const customData = checkoutData.success
            ? z.record(z.unknown()).safeParse(checkoutData.data.custom)
            : null;
          const cachedUrl = new URL(cached.data.checkout_url);
          const hasLegacyMutatedParameters =
            cachedUrl.searchParams.has("media") ||
            cachedUrl.searchParams.has("logo") ||
            cachedUrl.searchParams.has("desc");
          matchesCurrentEnvironment =
            !hasLegacyMutatedParameters &&
            idValue(existingCheckout.data.attributes.store_id) ===
              configuration.LEMON_STORE_ID &&
            idValue(existingCheckout.data.attributes.variant_id) ===
              configuration.LEMON_VARIANT_ID &&
            checkoutOptions.success &&
            checkoutOptions.data.embed === true &&
            checkoutOptions.data.media === false &&
            checkoutOptions.data.logo === false &&
            checkoutOptions.data.desc === false &&
            productOptions.success &&
            productOptions.data.redirect_url === returnUrl &&
            customData?.success === true &&
            customData.data.return_url === returnUrl &&
            customData.data.cancel_url === cancelUrl;
        } catch {
          matchesCurrentEnvironment = false;
        }
      }
      if (matchesCurrentEnvironment) return cached.data.checkout_url;

      const staleHostedCheckout = await admin
        .from("billing_checkout_sessions")
        .delete()
        .eq("user_id", input.userId);
      if (staleHostedCheckout.error)
        throw new Error("Hosted checkout cache cleanup failed", {
          cause: staleHostedCheckout.error,
        });
    } else if (cached.data) {
      throw new Error("Billing checkout creation is already in progress");
    }

    const expiresAt = new Date(now.getTime() + CHECKOUT_TTL_MS).toISOString();
    const expired = await admin
      .from("billing_checkout_sessions")
      .delete()
      .eq("user_id", input.userId)
      .lte("expires_at", now.toISOString());
    if (expired.error)
      throw new Error("Expired billing checkout cleanup failed", {
        cause: expired.error,
      });
    const claimed = await admin.from("billing_checkout_sessions").insert({
      expires_at: expiresAt,
      provider: "lemon",
      state: "pending",
      user_id: input.userId,
    });
    if (claimed.error?.code === "23505")
      throw new Error("Billing checkout creation is already in progress");
    if (claimed.error)
      throw new Error("Billing checkout claim failed", {
        cause: claimed.error,
      });

    try {
      const response = await lemonRequest("/checkouts", {
        body: JSON.stringify({
          data: {
            attributes: {
              checkout_data: {
                custom: {
                  cancel_url: cancelUrl,
                  locale: input.locale,
                  plan: input.plan,
                  return_url: returnUrl,
                  user_email: input.email,
                  user_id: input.userId,
                },
                email: input.email,
              },
              checkout_options: {
                desc: false,
                embed: true,
                logo: false,
                media: false,
              },
              product_options: {
                enabled_variants: [Number(configuration.LEMON_VARIANT_ID)],
                redirect_url: returnUrl,
              },
              expires_at: expiresAt,
            },
            relationships: {
              store: {
                data: { id: configuration.LEMON_STORE_ID, type: "stores" },
              },
              variant: {
                data: { id: configuration.LEMON_VARIANT_ID, type: "variants" },
              },
            },
            type: "checkouts",
          },
        }),
        method: "POST",
      });
      const checkoutUrl = this.getCheckoutUrl(response.data.attributes);
      const stored = await admin
        .from("billing_checkout_sessions")
        .update({
          checkout_url: checkoutUrl,
          provider_checkout_id: response.data.id,
          state: "ready",
        })
        .eq("user_id", input.userId);
      if (stored.error)
        throw new Error("Billing checkout cache failed", {
          cause: stored.error,
        });
      return checkoutUrl;
    } catch (error) {
      await admin
        .from("billing_checkout_sessions")
        .delete()
        .eq("user_id", input.userId);
      throw error;
    }
  },

  getCheckoutUrl(attributes: Record<string, unknown>): string {
    return z.string().url().parse(attributes.url);
  },

  async getCustomerPortal(
    subscriptionId: string,
  ): Promise<LemonSubscriptionUrls> {
    const response = await lemonRequest(
      `/subscriptions/${encodeURIComponent(subscriptionId)}`,
    );
    return subscriptionUrls(response.data.attributes);
  },

  parseWebhook(payload: string): LemonWebhook {
    const parsed = webhookSchema.parse(JSON.parse(payload));
    return {
      attributes: parsed.data.attributes,
      customData: parsed.meta.custom_data,
      eventName: parsed.meta.event_name,
      resourceId: parsed.data.id,
      resourceType: parsed.data.type,
    };
  },

  async claimWebhookEvent(
    event: LemonWebhook,
    payload: string,
  ): Promise<
    | { eventKey: string; state: "claimed" }
    | { state: "completed" | "processing" }
  > {
    const payloadHash = createHash("sha256").update(payload).digest("hex");
    const eventKey = createHash("sha256")
      .update(`${event.eventName}:${payloadHash}`)
      .digest("hex");
    const result = await createAdminClient()
      .from("billing_webhook_events")
      .insert({
        event_key: eventKey,
        event_name: event.eventName,
        payload_hash: payloadHash,
        resource_id: event.resourceId,
        resource_type: event.resourceType,
      });
    if (result.error?.code === "23505") {
      const admin = createAdminClient();
      const existing = await admin
        .from("billing_webhook_events")
        .select("status,claimed_at")
        .eq("event_key", eventKey)
        .single();
      if (existing.error)
        throw new Error("Webhook idempotency lookup failed", {
          cause: existing.error,
        });
      if (existing.data.status === "completed") return { state: "completed" };
      const staleBefore = new Date(
        Date.now() - WEBHOOK_CLAIM_STALE_MS,
      ).toISOString();
      if (existing.data.claimed_at > staleBefore)
        return { state: "processing" };
      const reclaimed = await admin
        .from("billing_webhook_events")
        .update({
          claimed_at: new Date().toISOString(),
          processed_at: null,
          status: "processing",
        })
        .eq("event_key", eventKey)
        .eq("claimed_at", existing.data.claimed_at)
        .select("event_key")
        .maybeSingle();
      if (reclaimed.error)
        throw new Error("Webhook idempotency reclaim failed", {
          cause: reclaimed.error,
        });
      return reclaimed.data
        ? { eventKey, state: "claimed" }
        : { state: "processing" };
    }
    if (result.error)
      throw new Error("Webhook idempotency claim failed", {
        cause: result.error,
      });
    return { eventKey, state: "claimed" };
  },

  async completeWebhookEvent(eventKey: string): Promise<void> {
    const result = await createAdminClient()
      .from("billing_webhook_events")
      .update({ processed_at: new Date().toISOString(), status: "completed" })
      .eq("event_key", eventKey);
    if (result.error)
      throw new Error("Webhook idempotency completion failed", {
        cause: result.error,
      });
  },

  async releaseWebhookEvent(eventKey: string): Promise<void> {
    const result = await createAdminClient()
      .from("billing_webhook_events")
      .delete()
      .eq("event_key", eventKey);
    if (result.error)
      throw new Error("Webhook idempotency release failed", {
        cause: result.error,
      });
  },

  async resumeSubscription(subscriptionId: string): Promise<void> {
    await lemonRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      body: JSON.stringify({
        data: {
          attributes: { cancelled: false },
          id: subscriptionId,
          type: "subscriptions",
        },
      }),
      method: "PATCH",
    });
  },

  async syncSubscription(event: LemonWebhook): Promise<void> {
    await syncSubscriptionEvent(event);
  },

  verifyWebhookSignature({ payload, signature }: WebhookInput): boolean {
    const { LEMON_WEBHOOK_SECRET } = requireLemonConfiguration();
    const expected = Buffer.from(
      createHmac("sha256", LEMON_WEBHOOK_SECRET).update(payload).digest("hex"),
      "utf8",
    );
    const received = Buffer.from(signature, "utf8");
    return (
      expected.length === received.length && timingSafeEqual(expected, received)
    );
  },
} as const;

export { LemonApiError };
