import Image from "next/image";
import {
  Cake,
  Camera,
  Clock3,
  Heart,
  Mic,
  NotebookText,
  Sparkles,
  Video,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { DashboardChild } from "@/features/dashboard/types/dashboard.types";
import type {
  DashboardMemory,
  DashboardSummary,
} from "@/features/dashboard/types/dashboard.types";
import { getNextBirthday } from "@/features/dashboard/utils/date";
import type { AppLocale } from "@/i18n/routing";

export async function CurrentChildCard({
  child,
  locale,
  recentMemory,
  summary,
}: {
  child: DashboardChild;
  locale: AppLocale;
  recentMemory: DashboardMemory | null;
  summary: DashboardSummary;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.child" });
  const birthday = getNextBirthday(child.birthDate);
  const fullName = [child.firstName, child.lastName].filter(Boolean).join(" ");
  const stats = [
    { icon: NotebookText, label: t("memories"), value: summary.memories },
    { icon: Camera, label: t("photos"), value: summary.photos },
    { icon: Video, label: t("videos"), value: summary.videos },
    { icon: Mic, label: t("audio"), value: summary.audio },
  ];

  return (
    <DashboardCard
      className="relative overflow-hidden border-white/50 bg-transparent p-0 shadow-none backdrop-blur-none hover:shadow-none sm:p-0 dark:border-white/10"
      label={t("ariaLabel")}
    >
      <div className="relative z-10 flex flex-col gap-5 p-5 sm:p-7 lg:p-8">
        <div className="flex items-center gap-5">
          {child.avatarUrl ? (
            <div className="relative size-24 shrink-0 overflow-hidden rounded-[1.75rem] shadow-xl ring-4 ring-white/50 sm:size-28 dark:ring-white/10">
              <Image
                alt={t("avatarLabel", { name: child.firstName })}
                className="object-cover"
                fill
                sizes="112px"
                src={child.avatarUrl}
              />
            </div>
          ) : (
            <div
              aria-label={t("avatarLabel", { name: child.firstName })}
              className="from-primary to-ai text-primary-foreground grid size-24 shrink-0 place-items-center rounded-[1.75rem] bg-gradient-to-br text-4xl font-semibold shadow-xl ring-4 ring-white/50 sm:size-28 dark:ring-white/10"
              role="img"
            >
              {child.firstName.charAt(0).toLocaleUpperCase(locale)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
              <Sparkles aria-hidden className="size-3.5" />
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 truncate text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              {fullName}
            </h2>
          </div>
        </div>
        <div className="from-primary/12 via-background/55 to-ai/10 rounded-[1.6rem] border border-white/45 bg-gradient-to-br p-4 shadow-md backdrop-blur-xl dark:border-white/10">
          <div className="flex items-end justify-between gap-4 border-b border-white/45 pb-4 dark:border-white/10">
            <div
              className="from-primary to-ai text-primary-foreground shadow-primary/15 grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-lg"
              aria-hidden
            >
              <NotebookText className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs font-medium">
                {t("memories")}
              </p>
              <p className="mt-0.5 text-4xl leading-none font-semibold tracking-[-0.055em] tabular-nums">
                {summary.memories}
              </p>
            </div>
            <span className="bg-background/65 text-muted-foreground rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold backdrop-blur-md">
              {t("thisMonth")}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {stats.slice(1).map(({ icon: Icon, label, value }) => (
              <div
                className="bg-background/45 min-w-0 rounded-xl border border-white/45 px-2.5 py-3 text-center shadow-sm dark:border-white/10"
                key={label}
              >
                <Icon aria-hidden className="text-primary mx-auto size-4" />
                <p className="mt-2 text-lg font-semibold tracking-tight tabular-nums">
                  {value}
                </p>
                <p className="text-muted-foreground mt-0.5 truncate text-[0.65rem]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-border/45 bg-background/50 grid gap-3 rounded-[1.4rem] border p-3.5 shadow-sm backdrop-blur-xl sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <span className="from-primary/15 to-ai/15 text-primary grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br">
              <Cake aria-hidden className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold">
                {birthday.days === 0
                  ? t("birthdayToday")
                  : t("birthdayCountdown", { count: birthday.days })}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[0.68rem]">
                {new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                  month: "long",
                }).format(birthday.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
            <span className="bg-timeline/12 text-timeline grid size-10 shrink-0 place-items-center rounded-xl">
              <Clock3 aria-hidden className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-muted-foreground text-[0.68rem] font-medium">
                {t("latestMemory")}
              </p>
              <p className="mt-0.5 truncate text-xs font-semibold">
                {recentMemory?.title ?? t("noMemory")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="bg-primary/12 absolute -top-20 -right-16 size-64 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-ai/10 absolute -bottom-28 -left-20 size-72 rounded-full blur-3xl"
      />
      <Heart
        aria-hidden
        className="text-primary/6 absolute -right-12 -bottom-16 size-64 rotate-[-8deg]"
        fill="currentColor"
      />
    </DashboardCard>
  );
}
