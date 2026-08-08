import { ArrowRight, CalendarDays, Milestone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardEmptyState } from "@/features/dashboard/components/DashboardEmptyState";
import { TimelinePreviewCarousel } from "@/features/dashboard/components/TimelinePreviewCarousel";
import type { DashboardMemory } from "@/features/dashboard/types/dashboard.types";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export async function TimelinePreview({
  locale,
  memories,
  childName,
}: {
  locale: AppLocale;
  memories: DashboardMemory[];
  childName: string;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.timeline" });
  return (
    <DashboardCard
      className="self-start overflow-hidden border-white/65 p-5 shadow-[0_18px_65px_-35px_rgba(76,29,149,0.35)] sm:p-8 lg:p-10 dark:border-white/10"
      label={t("ariaLabel")}
    >
      <header className="mb-6 flex items-start justify-between gap-5 sm:mb-8">
        <div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-xl sm:size-11 sm:rounded-2xl">
              <CalendarDays aria-hidden className="size-4 sm:size-5" />
            </span>
            <h2 className="text-xl font-bold tracking-[-0.035em] sm:text-3xl">
              {t("title")}
            </h2>
          </div>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            {t("subtitle", { name: childName })}
          </p>
        </div>
        <Button
          asChild
          className="hidden shrink-0 sm:inline-flex"
          variant="outline"
        >
          <Link href="/timeline">
            {t("viewTimeline")}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Button>
      </header>
      {memories.length === 0 ? (
        <DashboardEmptyState
          action={
            <Button asChild>
              <Link href="/memories/new">{t("emptyAction")}</Link>
            </Button>
          }
          description={t("emptyDescription")}
          icon={Milestone}
          title={t("emptyTitle")}
        />
      ) : (
        <TimelinePreviewCarousel
          items={memories.map((memory) => ({
            ...memory,
            date: new Intl.DateTimeFormat(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(new Date(memory.occurredAt)),
            openLabel: t("open", { title: memory.title }),
          }))}
          labels={{
            audio: t("types.audio"),
            memory: t("types.memory"),
            next: t("next"),
            photo: t("types.photo"),
            previous: t("previous"),
            video: t("types.video"),
          }}
        />
      )}
      <Button asChild className="mt-6 w-full sm:hidden" variant="outline">
        <Link href="/timeline">
          {t("viewTimeline")}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </Button>
    </DashboardCard>
  );
}
