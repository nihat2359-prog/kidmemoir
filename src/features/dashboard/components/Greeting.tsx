import { getTranslations } from "next-intl/server";
import { getGreetingPeriod } from "@/features/dashboard/utils/date";
import type { AppLocale } from "@/i18n/routing";

export async function Greeting({
  childName,
  firstName,
  locale,
}: {
  childName: string;
  firstName: string;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.greeting" });
  return (
    <header className="max-w-3xl">
      <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase sm:text-sm">
        {t(getGreetingPeriod())}
      </p>
      <h1 className="mt-3 text-[clamp(2.25rem,6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.055em] text-balance">
        {t("title", { name: firstName })}
      </h1>
      <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
        {t("prompt", { name: childName })}
      </p>
    </header>
  );
}
