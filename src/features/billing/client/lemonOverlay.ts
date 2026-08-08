"use client";

import { analytics } from "@/lib/analytics";

type LemonEvent = Readonly<{ data?: unknown; event?: unknown }>;

type LemonWindow = Window & {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: {
    Setup?: (options: { eventHandler: (event: LemonEvent) => void }) => void;
    Url: {
      Close: () => void;
      Open: (url: string) => void;
    };
  };
};

const INITIALIZATION_ATTEMPTS = 50;
const INITIALIZATION_INTERVAL_MS = 100;
let eventHandlerRegistered = false;

function recordCheckoutSuccess(event: LemonEvent): void {
  if (event.event !== "Checkout.Success") return;
  const root =
    event.data && typeof event.data === "object"
      ? (event.data as Record<string, unknown>)
      : {};
  const order =
    root.order && typeof root.order === "object"
      ? (root.order as Record<string, unknown>)
      : {};
  const orderData =
    order.data && typeof order.data === "object"
      ? (order.data as Record<string, unknown>)
      : order;
  const attributes =
    orderData.attributes && typeof orderData.attributes === "object"
      ? (orderData.attributes as Record<string, unknown>)
      : {};
  const transactionId = typeof orderData.id === "string" ? orderData.id : null;
  if (transactionId && sessionStorage.getItem(`ga-purchase:${transactionId}`))
    return;

  analytics.track("premium_checkout_completed", { plan: "premium_yearly" });
  analytics.track("premium_purchase_completed", { plan: "premium_yearly" });
  const total = typeof attributes.total === "number" ? attributes.total : null;
  const currency =
    typeof attributes.currency === "string"
      ? attributes.currency.toUpperCase()
      : null;
  if (transactionId && total != null && currency) {
    analytics.purchase({
      currency,
      plan: "premium_yearly",
      transactionId,
      value: total / 100,
    });
    sessionStorage.setItem(`ga-purchase:${transactionId}`, "1");
  }
}

function registerEventHandler(): void {
  if (eventHandlerRegistered) return;
  const lemon = (window as LemonWindow).LemonSqueezy;
  if (!lemon?.Setup) return;
  lemon.Setup({ eventHandler: recordCheckoutSuccess });
  eventHandlerRegistered = true;
}

export function initializeLemonOverlay(): void {
  (window as LemonWindow).createLemonSqueezy?.();
  registerEventHandler();
}

async function waitForLemonSqueezy(): Promise<void> {
  const lemonWindow = window as LemonWindow;
  for (let attempt = 0; attempt < INITIALIZATION_ATTEMPTS; attempt++) {
    lemonWindow.createLemonSqueezy?.();
    if (lemonWindow.LemonSqueezy) {
      registerEventHandler();
      return;
    }
    await new Promise((resolve) =>
      window.setTimeout(resolve, INITIALIZATION_INTERVAL_MS),
    );
  }
  throw new Error("Lemon overlay is unavailable");
}

export async function openLemonOverlay(url: string): Promise<void> {
  await waitForLemonSqueezy();

  const link = document.createElement("a");
  link.className = "lemonsqueezy-button";
  link.href = url;
  link.hidden = true;
  document.body.appendChild(link);
  initializeLemonOverlay();
  link.click();
  link.remove();
}
