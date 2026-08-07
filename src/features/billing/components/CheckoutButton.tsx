"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

type LemonWindow = Window & {
  createLemonSqueezy?: () => void;
  LemonSqueezy?: {
    Url: {
      Open: (url: string) => void;
    };
  };
};

const LEMON_INITIALIZATION_ATTEMPTS = 50;
const LEMON_INITIALIZATION_INTERVAL_MS = 100;

async function getLemonSqueezy(): Promise<
  NonNullable<LemonWindow["LemonSqueezy"]>
> {
  const lemonWindow = window as LemonWindow;

  for (let attempt = 0; attempt < LEMON_INITIALIZATION_ATTEMPTS; attempt++) {
    lemonWindow.createLemonSqueezy?.();
    if (lemonWindow.LemonSqueezy) return lemonWindow.LemonSqueezy;
    await new Promise((resolve) =>
      window.setTimeout(resolve, LEMON_INITIALIZATION_INTERVAL_MS),
    );
  }

  throw new Error("Checkout overlay is unavailable");
}

async function openWithLemonButton(url: string): Promise<void> {
  await getLemonSqueezy();

  const checkoutLink = document.createElement("a");
  checkoutLink.className = "lemonsqueezy-button";
  checkoutLink.href = url;
  checkoutLink.hidden = true;
  document.body.appendChild(checkoutLink);

  (window as LemonWindow).createLemonSqueezy?.();
  checkoutLink.click();
  checkoutLink.remove();
}

type CheckoutResponse = {
  checkoutUrl?: unknown;
  redirectTo?: unknown;
};

export function CheckoutButton({
  className,
  fullWidth = false,
  label,
  locale,
  size = "lg",
}: {
  className?: string;
  fullWidth?: boolean;
  label: string;
  locale: AppLocale;
  size?: "md" | "lg";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (window as LemonWindow).createLemonSqueezy?.();
  }, []);

  async function openCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/billing/checkout", {
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as CheckoutResponse;

      if (typeof result.redirectTo === "string") {
        router.push(result.redirectTo);
        return;
      }
      if (typeof result.checkoutUrl !== "string") throw new Error();

      await openWithLemonButton(result.checkoutUrl);
    } catch {
      router.push(`/${locale}/subscription?billing_error=checkout`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action="/api/billing/checkout" method="post" onSubmit={openCheckout}>
      <input name="locale" type="hidden" value={locale} />
      <Button
        className={className}
        fullWidth={fullWidth}
        loading={isLoading}
        size={size}
        type="submit"
      >
        {label}
      </Button>
    </form>
  );
}
