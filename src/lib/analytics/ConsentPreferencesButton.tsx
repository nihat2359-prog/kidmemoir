"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ANALYTICS_CONSENT_COOKIE } from "@/lib/analytics/consent";

export function ConsentPreferencesButton() {
  const t = useTranslations("consent");
  function openPreferences() {
    document.cookie = `${ANALYTICS_CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent("kidmemoir:consent"));
  }
  return (
    <Button
      className="mt-4"
      icon={<SlidersHorizontal aria-hidden />}
      onClick={openPreferences}
      type="button"
      variant="outline"
    >
      {t("manage")}
    </Button>
  );
}
