"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import {
  initializeLemonOverlay,
  openLemonOverlay,
} from "@/features/billing/client/lemonOverlay";
import { analytics } from "@/lib/analytics";

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
    initializeLemonOverlay();
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

      analytics.track("premium_checkout_started", {
        locale,
        plan: "premium_yearly",
      });
      await openLemonOverlay(result.checkoutUrl);
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
