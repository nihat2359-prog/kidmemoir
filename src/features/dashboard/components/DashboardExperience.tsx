import { AIInsight } from "@/features/dashboard/components/AIInsight";
import { CurrentChildCard } from "@/features/dashboard/components/CurrentChildCard";
import { Greeting } from "@/features/dashboard/components/Greeting";
import { MonthlySummary } from "@/features/dashboard/components/MonthlySummary";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { RecentMemories } from "@/features/dashboard/components/RecentMemories";
import { TimelinePreview } from "@/features/dashboard/components/TimelinePreview";
import { UpcomingEvents } from "@/features/dashboard/components/UpcomingEvents";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { OnThisDaySection } from "@/features/on-this-day";
import type { AppLocale } from "@/i18n/routing";

export async function DashboardExperience({
  data,
  locale,
}: {
  data: DashboardData & { child: NonNullable<DashboardData["child"]> };
  locale: AppLocale;
}) {
  return (
    <main className="relative isolate min-h-svh overflow-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="landing-background-base absolute inset-0" />
        <div className="bg-primary/9 absolute -top-48 -left-40 size-[38rem] rounded-full blur-3xl" />
        <div className="bg-ai/6 absolute top-1/3 -right-48 size-[40rem] rounded-full blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-[90rem] px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16 2xl:px-12">
        <section className="from-primary/11 via-card/72 to-ai/9 relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br shadow-lg dark:border-white/10">
          <div className="grid min-h-[34rem] items-stretch lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative z-10 flex items-center p-7 sm:p-10 lg:p-14 xl:p-16">
              <Greeting
                childName={data.child.firstName}
                firstName={data.profileFirstName}
                locale={locale}
              />
            </div>
            <div className="m-3 mt-0 rounded-[2rem] border border-white/45 bg-white/30 shadow-sm backdrop-blur-xl sm:m-5 sm:mt-0 lg:m-5 lg:ml-0 dark:border-white/10 dark:bg-white/5">
              <CurrentChildCard child={data.child} locale={locale} />
            </div>
          </div>
          <div
            aria-hidden
            className="bg-primary/10 absolute -top-32 left-1/3 size-80 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-ai/8 absolute -right-28 -bottom-32 size-96 rounded-full blur-3xl"
          />
        </section>
        {data.onThisDay.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <OnThisDaySection locale={locale} memories={data.onThisDay} />
          </div>
        )}
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 mt-12 motion-safe:duration-500 sm:mt-16">
          <QuickActions locale={locale} />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <RecentMemories locale={locale} memories={data.recentMemories} />
          </div>
          <div className="lg:col-span-5">
            <UpcomingEvents
              child={data.child}
              locale={locale}
              reminders={data.reminders}
            />
          </div>
          <div className="lg:col-span-7">
            <AIInsight insight={data.insight} locale={locale} />
          </div>
          <div className="lg:col-span-5">
            <MonthlySummary locale={locale} summary={data.summary} />
          </div>
          <div className="lg:col-span-12">
            <TimelinePreview locale={locale} memories={data.recentMemories} />
          </div>
        </div>
      </div>
    </main>
  );
}
