import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function QuickActions({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({
    locale,
    namespace: "dashboard.quickActions",
  });
  return (
    <DashboardCard
      className="from-primary/14 via-card/70 to-ai/10 group relative overflow-hidden bg-gradient-to-br p-7 shadow-md hover:-translate-y-1 hover:shadow-lg sm:p-10"
      label={t("ariaLabel")}
    >
      <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
            <Sparkles aria-hidden className="size-4" />
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-7 sm:text-base">
            {t("description")}
          </p>
        </div>
        <Link
          className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex min-h-14 shrink-0 items-center justify-center gap-3 rounded-2xl px-6 text-base font-semibold shadow-md transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 active:scale-[0.98] motion-reduce:transform-none"
          href="/memories/new"
        >
          <Plus aria-hidden className="size-5" />
          {t("cta")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <div
        aria-hidden
        className="bg-primary/12 absolute -top-20 -right-12 size-64 rounded-full blur-3xl"
      />
    </DashboardCard>
  );
}
