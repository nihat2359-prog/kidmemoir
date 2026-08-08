export const ANALYTICS_EVENTS = [
  "sign_up",
  "login",
  "logout",
  "child_created",
  "child_updated",
  "memory_created",
  "memory_updated",
  "memory_deleted",
  "memory_favorited",
  "media_uploaded",
  "ai_insight_generated",
  "ai_story_generated",
  "ai_search_used",
  "timeline_viewed",
  "dashboard_viewed",
  "premium_page_viewed",
  "premium_checkout_started",
  "premium_checkout_completed",
  "premium_purchase_completed",
  "subscription_cancelled",
  "subscription_resumed",
  "search_used",
  "guide_viewed",
  "guide_internal_link_clicked",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];
export type AnalyticsValue = string | number | boolean;
export type AnalyticsPayload = Readonly<
  Record<string, AnalyticsValue | null | undefined>
>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const eventNames = new Set<string>(ANALYTICS_EVENTS);
const forbiddenKey =
  /(email|name|child|note|message|content|description|prompt|address|phone)/i;
const isProduction = process.env.NODE_ENV === "production";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

function enabled(): boolean {
  return Boolean(
    isProduction &&
    measurementId &&
    typeof window !== "undefined" &&
    window.gtag,
  );
}

function sanitize(
  payload: AnalyticsPayload = {},
): Record<string, AnalyticsValue> {
  const sanitized: Record<string, AnalyticsValue> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (forbiddenKey.test(key) || value == null) continue;
    if (typeof value === "string") sanitized[key] = value.slice(0, 100);
    else if (typeof value === "number" && Number.isFinite(value))
      sanitized[key] = value;
    else if (typeof value === "boolean") sanitized[key] = value;
  }
  return sanitized;
}

export const analytics = {
  debug(eventName: string, payload: AnalyticsPayload = {}): void {
    if (isProduction) return;
    console.info("[analytics]", eventName, sanitize(payload));
  },

  identify(userId: string | null): void {
    if (!enabled()) return;
    window.gtag?.("config", measurementId, {
      send_page_view: false,
      user_id: userId || undefined,
    });
  },

  pageView(path: string): boolean {
    if (!isProduction) {
      this.debug("page_view", { page_path: path });
      return false;
    }
    if (!enabled()) return false;
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: path,
      page_title: document.title,
    });
    return true;
  },

  purchase(
    input: Readonly<{
      currency: string;
      plan: string;
      transactionId: string;
      value: number;
    }>,
  ): void {
    if (!enabled() || !input.transactionId || input.value < 0) return;
    window.gtag?.("event", "purchase", {
      currency: input.currency,
      items: [{ item_id: input.plan, item_name: input.plan, quantity: 1 }],
      transaction_id: input.transactionId,
      value: input.value,
    });
  },

  track(eventName: AnalyticsEventName, payload: AnalyticsPayload = {}): void {
    if (!eventNames.has(eventName)) return;
    if (!isProduction) {
      this.debug(eventName, payload);
      return;
    }
    if (!enabled()) return;
    window.gtag?.("event", eventName, sanitize(payload));
  },
} as const;
