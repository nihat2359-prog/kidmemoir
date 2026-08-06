import { Cake, Heart, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import type { DashboardChild } from "@/features/dashboard/types/dashboard.types";
import { getAgeParts, getNextBirthday } from "@/features/dashboard/utils/date";
import type { AppLocale } from "@/i18n/routing";

export async function CurrentChildCard({
  child,
  locale,
}: {
  child: DashboardChild;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.child" });
  const age = getAgeParts(child.birthDate);
  const birthday = getNextBirthday(child.birthDate);
  const ageLabel =
    age.years > 0
      ? t("ageYears", { count: age.years })
      : age.months > 0
        ? t("ageMonths", { count: age.months })
        : t("ageDays", { count: age.days });
  const fullName = [child.firstName, child.lastName].filter(Boolean).join(" ");

  return (
    <DashboardCard
      className="relative overflow-hidden border-white/50 bg-transparent p-0 shadow-none backdrop-blur-none hover:shadow-none sm:p-0 dark:border-white/10"
      label={t("ariaLabel")}
    >
      <div className="relative z-10 flex h-full flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {child.avatarUrl ? (
            <div
              aria-label={t("avatarLabel", { name: child.firstName })}
              className="size-28 shrink-0 rounded-[2rem] bg-cover bg-center shadow-lg ring-4 ring-white/55 sm:size-36 dark:ring-white/10"
              role="img"
              style={{
                backgroundImage: `url(${JSON.stringify(child.avatarUrl).slice(1, -1)})`,
              }}
            />
          ) : (
            <div
              aria-label={t("avatarLabel", { name: child.firstName })}
              className="from-primary to-ai text-primary-foreground grid size-28 shrink-0 place-items-center rounded-[2rem] bg-gradient-to-br text-4xl font-semibold shadow-lg ring-4 ring-white/55 sm:size-36 sm:text-5xl dark:ring-white/10"
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
            <h2 className="mt-2 truncate text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {fullName}
            </h2>
            <p className="text-muted-foreground mt-2 text-base">{ageLabel}</p>
          </div>
        </div>
        <div className="border-border/50 bg-background/55 flex items-center gap-4 rounded-3xl border p-4 shadow-sm backdrop-blur-xl sm:max-w-sm">
          <span className="from-primary/15 to-ai/15 text-primary grid size-12 place-items-center rounded-2xl bg-gradient-to-br">
            <Cake aria-hidden className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold sm:text-base">
              {birthday.days === 0
                ? t("birthdayToday")
                : t("birthdayCountdown", { count: birthday.days })}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
              }).format(birthday.date)}
            </p>
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
