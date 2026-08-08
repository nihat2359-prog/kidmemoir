import { Heart, Sparkles, Sprout, Star, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AiUpgradeSheet } from "@/features/billing/components/AiUpgradeSheet";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardEmptyState } from "@/features/dashboard/components/DashboardEmptyState";
import type { DashboardInsight } from "@/features/dashboard/types/dashboard.types";
import type { SmartDashboardInsight } from "@/features/ai/types/ai.types";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export async function AIInsight({
  available,
  insight,
  intelligence,
  locale,
}: {
  available: boolean;
  insight: DashboardInsight | null;
  intelligence: SmartDashboardInsight | null;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.ai" });
  return (
    <DashboardCard
      className="from-ai/14 via-card/75 to-primary/8 relative self-start overflow-hidden bg-gradient-to-br p-5 shadow-md hover:shadow-lg sm:p-8"
      label={t("ariaLabel")}
    >
      <div className="relative z-10 mb-5 flex items-center gap-3 sm:mb-7 sm:gap-4">
        <span className="from-ai/20 to-primary/15 text-ai grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br shadow-sm sm:size-14 sm:rounded-2xl">
          <Sparkles aria-hidden className="size-5 sm:size-6" />
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
        <div className="relative z-10 space-y-4">
          <div className="bg-background/50 rounded-[1.4rem] border p-4 text-sm leading-7 shadow-sm backdrop-blur-md sm:rounded-[1.75rem] sm:p-8 sm:text-base sm:leading-8">
            <p className="text-pretty">{insight.summary}</p>
            {insight.quote ? (
              <blockquote className="border-primary/35 text-foreground/80 mt-4 border-l-2 pl-4 text-sm italic">
                “{insight.quote}”
              </blockquote>
            ) : null}
            <footer className="text-muted-foreground mt-3 text-xs">
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(insight.createdAt),
              )}
            </footer>
          </div>
          {intelligence && (
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="bg-background/45 rounded-2xl border p-4">
                <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                  <Sprout aria-hidden className="size-4" /> {t("notable")}
                </dt>
                <dd className="mt-2 text-sm font-semibold">
                  {intelligence.notable?.title ?? t("waiting")}
                </dd>
              </div>
              <div className="bg-background/45 rounded-2xl border p-4">
                <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                  <Star aria-hidden className="size-4" /> {t("favorites")}
                </dt>
                <dd className="mt-2 text-sm font-semibold">
                  {t("favoriteCount", { count: intelligence.favoriteCount })}
                </dd>
              </div>
              {available ? (
                <>
                  <div className="bg-background/45 rounded-2xl border p-4">
                    <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <Heart aria-hidden className="size-4" /> {t("emotional")}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold">
                      {intelligence.emotionalMemory?.title ?? t("waiting")}
                    </dd>
                  </div>
                  <div className="bg-background/45 rounded-2xl border p-4">
                    <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <TrendingUp aria-hidden className="size-4" />{" "}
                      {t("activities")}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold">
                      {t("activityCount", {
                        count: intelligence.recentActivities.length,
                      })}
                    </dd>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-background/55 relative overflow-hidden rounded-2xl border p-4 text-center">
                    <div aria-hidden className="blur-sm select-none">
                      <p className="text-sm font-semibold">
                        {t("previewStory")}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {t("previewLines")}
                      </p>
                    </div>
                    <div className="bg-background/65 absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
                      <Badge variant="premium">{t("premiumBadge")}</Badge>
                      <p className="text-xs font-medium">
                        {t("weeklyPreview")}
                      </p>
                      <AiUpgradeSheet
                        feature="weekly"
                        locale={locale}
                        triggerLabel={t("previewAction")}
                      />
                    </div>
                  </div>
                  <div className="bg-background/55 relative overflow-hidden rounded-2xl border p-4 text-center">
                    <div aria-hidden className="blur-sm select-none">
                      <p className="text-sm font-semibold">
                        {t("previewTrends")}
                      </p>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {t("previewLines")}
                      </p>
                    </div>
                    <div className="bg-background/65 absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
                      <Badge variant="premium">{t("premiumBadge")}</Badge>
                      <p className="text-xs font-medium">
                        {t("trendsPreview")}
                      </p>
                      <AiUpgradeSheet
                        feature="trends"
                        locale={locale}
                        triggerLabel={t("previewAction")}
                      />
                    </div>
                  </div>
                </>
              )}
            </dl>
          )}
        </div>
      ) : (
        <DashboardEmptyState
          action={
            <Button asChild variant="outline">
              <Link href="/memories/new">{t("emptyAction")}</Link>
            </Button>
          }
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
