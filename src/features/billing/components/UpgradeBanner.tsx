import { Sparkles } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { CheckoutButton } from "@/features/billing/components/CheckoutButton";
import type { AppLocale } from "@/i18n/routing";

export type UpgradeBannerContext =
  "dashboard" | "general" | "memory" | "timeline";

export async function UpgradeBanner({
  context = "general",
}: {
  context?: UpgradeBannerContext;
}) {
  const [locale, t] = await Promise.all([
    getLocale() as Promise<AppLocale>,
    getTranslations("billing.upgradeBanner"),
  ]);
  return (
    <aside className="from-primary/12 via-card/90 to-ai/10 flex flex-col gap-5 rounded-[2rem] border bg-gradient-to-br p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex gap-4">
        <span className="bg-primary/12 text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
          <Sparkles aria-hidden className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">{t(`${context}.title`)}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
            {t(`${context}.description`)}
          </p>
        </div>
      </div>
      <CheckoutButton label={t("action")} locale={locale} />
    </aside>
  );
}
