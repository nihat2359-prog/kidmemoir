"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  initializeLemonOverlay,
  openLemonOverlay,
} from "@/features/billing/client/lemonOverlay";
import type { AppLocale } from "@/i18n/routing";

type PortalResponse = {
  portalUrl?: unknown;
  redirectTo?: unknown;
};

export function PortalButton({
  label,
  locale,
  target,
  variant = "primary",
}: {
  label: string;
  locale: AppLocale;
  target: "payment" | "portal";
  variant?: "outline" | "primary";
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => initializeLemonOverlay(), []);

  async function openPortal() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/billing/portal?locale=${locale}&target=${target}`,
        { headers: { Accept: "application/json" } },
      );
      const result = (await response.json()) as PortalResponse;
      if (typeof result.redirectTo === "string") {
        router.push(result.redirectTo);
        return;
      }
      if (typeof result.portalUrl !== "string") throw new Error();
      await openLemonOverlay(result.portalUrl);
    } catch {
      router.push(`/${locale}/subscription?billing_error=portal`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button loading={isLoading} onClick={openPortal} variant={variant}>
      {label}
    </Button>
  );
}
