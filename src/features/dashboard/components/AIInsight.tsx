import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardEmptyState } from "@/features/dashboard/components/DashboardEmptyState";
import type { DashboardInsight } from "@/features/dashboard/types/dashboard.types";
import type { AppLocale } from "@/i18n/routing";

export async function AIInsight({
  insight,
  locale,
}: {
  insight: DashboardInsight | null;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.ai" });
  return (
    <DashboardCard
      className="from-ai/14 via-card/75 to-primary/8 relative h-full overflow-hidden bg-gradient-to-br shadow-md hover:shadow-lg"
      label={t("ariaLabel")}
    >
      <div className="relative z-10 mb-7 flex items-center gap-4">
        <span className="from-ai/20 to-primary/15 text-ai grid size-14 place-items-center rounded-2xl bg-gradient-to-br shadow-sm">
          <Sparkles aria-hidden className="size-6" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.025em] sm:text-2xl">
            {t("title")}
          </h2>
        </div>
      </div>
      {insight ? (
        <blockquote className="bg-background/50 relative z-10 rounded-[1.75rem] border p-6 text-base leading-8 shadow-sm backdrop-blur-md sm:p-8">
          <p className="text-pretty">{insight.summary}</p>
          <footer className="text-muted-foreground mt-3 text-xs">
            {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
              new Date(insight.createdAt),
            )}
          </footer>
        </blockquote>
      ) : (
        <DashboardEmptyState
          description={t("emptyDescription")}
          icon={Sparkles}
          title={t("emptyTitle")}
        />
      )}
      <div
        aria-hidden
        className="bg-ai/12 absolute -top-20 -right-16 size-64 rounded-full blur-3xl"
      />
    </DashboardCard>
  );
}
