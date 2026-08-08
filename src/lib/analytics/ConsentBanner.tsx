"use client";
import { useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  ANALYTICS_CONSENT_COOKIE,
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeConsent,
  type AnalyticsConsent,
} from "@/lib/analytics/consent";
function storeConsent(value: Exclude<AnalyticsConsent, null>) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  window.gtag?.("consent", "update", {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: value,
  });
  window.dispatchEvent(new CustomEvent("kidmemoir:consent", { detail: value }));
}

function subscribeHydration() {
  return () => undefined;
}

export function ConsentBanner() {
  const t = useTranslations("consent");
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const [manage, setManage] = useState(false);
  const consentLoaded = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );

  function choose(value: Exclude<AnalyticsConsent, null>) {
    storeConsent(value);
    setManage(false);
  }
  if (!consentLoaded || consent !== null) return null;
  return (
    <>
      <aside
        aria-labelledby="cookie-consent-title"
        className="bg-card/95 fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-3xl rounded-[1.75rem] border p-5 shadow-2xl backdrop-blur-xl sm:p-6"
      >
        <div className="flex items-start gap-4">
          <span className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
            <Cookie aria-hidden className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-consent-title" className="font-semibold">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {t("description")}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button onClick={() => choose("denied")} variant="ghost">
            {t("reject")}
          </Button>
          <Button onClick={() => setManage(true)} variant="outline">
            {t("manage")}
          </Button>
          <Button onClick={() => choose("granted")}>{t("accept")}</Button>
        </div>
      </aside>
      <Dialog onOpenChange={setManage} open={manage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("preferencesTitle")}</DialogTitle>
            <DialogDescription>{t("preferencesDescription")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-2xl border p-4 text-sm">
            <p className="font-medium">{t("necessaryTitle")}</p>
            <p className="text-muted-foreground">{t("necessaryDescription")}</p>
            <p className="pt-2 font-medium">{t("analyticsTitle")}</p>
            <p className="text-muted-foreground">{t("analyticsDescription")}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{t("close")}</Button>
            </DialogClose>
            <Button onClick={() => choose("denied")} variant="outline">
              {t("reject")}
            </Button>
            <Button onClick={() => choose("granted")}>{t("accept")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
