import { AIInsight } from "@/features/dashboard/components/AIInsight";
import { CurrentChildCard } from "@/features/dashboard/components/CurrentChildCard";
import { Greeting } from "@/features/dashboard/components/Greeting";
import { RecentMemories } from "@/features/dashboard/components/RecentMemories";
import { TimelinePreview } from "@/features/dashboard/components/TimelinePreview";
import { UpcomingEvents } from "@/features/dashboard/components/UpcomingEvents";
import type { DashboardData } from "@/features/dashboard/types/dashboard.types";
import { OnThisDaySection } from "@/features/on-this-day";
import { MemoryOfTheDayCard } from "@/features/dashboard/components/MemoryOfTheDayCard";
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
        <section className="from-primary/13 via-card/78 to-ai/11 relative overflow-hidden rounded-[2.5rem] border border-white/55 bg-gradient-to-br shadow-[0_28px_90px_-48px_rgba(67,56,202,0.5)] dark:border-white/10">
          <div className="grid items-stretch lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-14">
              <Greeting
                childName={data.child.firstName}
                firstName={data.profileFirstName}
                locale={locale}
              />
              {data.memoryOfTheDay ? (
                <MemoryOfTheDayCard
                  isPremium={data.aiAvailable}
                  locale={locale}
                  memory={data.memoryOfTheDay}
                />
              ) : null}
            </div>
            <div className="mx-3 mb-3 self-start rounded-[2rem] border border-white/45 bg-white/30 shadow-xl backdrop-blur-xl sm:mx-5 sm:mb-5 lg:m-5 lg:ml-0 lg:self-center dark:border-white/10 dark:bg-white/5">
              <CurrentChildCard
                child={data.child}
                locale={locale}
                recentMemory={data.recentMemories[0] ?? null}
                summary={data.summary}
              />
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
          <div
            aria-hidden
            className="text-primary/8 absolute top-12 left-[49%] hidden size-28 rotate-6 rounded-[1.75rem] border border-current bg-white/10 shadow-xl backdrop-blur-sm lg:block"
          />
        </section>
        {data.onThisDay.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <OnThisDaySection locale={locale} memories={data.onThisDay} />
          </div>
        )}
        <div className="mt-10 grid items-start gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-12">
            <RecentMemories locale={locale} memories={data.recentMemories} />
          </div>
          <div className="lg:col-span-12">
            <UpcomingEvents
              child={data.child}
              locale={locale}
              reminders={data.reminders}
            />
          </div>
          <div className="lg:col-span-12">
            <AIInsight
              available={data.aiAvailable}
              insight={data.insight}
              intelligence={data.intelligence}
              locale={locale}
            />
          </div>
          <div className="lg:col-span-12">
            <TimelinePreview
              childName={data.child.firstName}
              locale={locale}
              memories={data.recentMemories}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
