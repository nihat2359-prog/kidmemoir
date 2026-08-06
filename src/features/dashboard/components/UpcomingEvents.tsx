import { Bell, Cake, CalendarDays } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardSectionHeader } from "@/features/dashboard/components/DashboardSectionHeader";
import type {
  DashboardChild,
  DashboardReminder,
} from "@/features/dashboard/types/dashboard.types";
import { getNextBirthday } from "@/features/dashboard/utils/date";
import type { AppLocale } from "@/i18n/routing";

export async function UpcomingEvents({
  child,
  locale,
  reminders,
}: {
  child: DashboardChild;
  locale: AppLocale;
  reminders: DashboardReminder[];
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.upcoming" });
  const birthday = getNextBirthday(child.birthDate);
  return (
    <DashboardCard className="h-full" label={t("ariaLabel")}>
      <DashboardSectionHeader
        action={t("viewAll")}
        href="/reminders"
        title={t("title")}
      />
      <ul className="space-y-4">
        <li className="from-primary/12 via-background/65 to-ai/8 relative overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-5 shadow-sm sm:p-6">
          <div className="relative z-10 flex items-start gap-4">
            <span className="bg-background text-primary grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm">
              <Cake aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold">
                {t("birthday", { name: child.firstName })}
              </h3>
              <p className="text-primary mt-2 text-2xl font-semibold tracking-[-0.035em] tabular-nums">
                {birthday.days === 0
                  ? t("today")
                  : t("inDays", { count: birthday.days })}
              </p>
              <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
                <CalendarDays aria-hidden className="size-3.5" />
                {new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                  month: "long",
                }).format(birthday.date)}
              </p>
            </div>
          </div>
          <div
            aria-hidden
            className="bg-primary/10 absolute -right-12 -bottom-14 size-40 rounded-full blur-3xl"
          />
        </li>
        {reminders.map((reminder) => (
          <li
            className="bg-background/55 hover:border-primary/20 flex items-start gap-4 rounded-3xl border p-4 transition-[border-color,transform] duration-300 hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
            key={reminder.id}
          >
            <span className="bg-muted grid size-10 shrink-0 place-items-center rounded-2xl">
              <Bell aria-hidden className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">{reminder.title}</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(reminder.reminderAt))}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {reminders.length === 0 ? (
        <p className="text-muted-foreground bg-muted/30 mt-4 rounded-2xl px-4 py-3 text-center text-xs">
          {t("noReminders")}
        </p>
      ) : null}
    </DashboardCard>
  );
}
