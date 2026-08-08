import {
  BookOpen,
  CalendarClock,
  Link2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AiSearch } from "@/features/ai-page/AiSearch";
import { MemoryOfTheDayCard } from "@/features/dashboard/components/MemoryOfTheDayCard";
import { MemoryConnections } from "@/features/memories/components/MemoryConnections";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type Data = NonNullable<
  Awaited<ReturnType<typeof import("@/features/ai-page/service").getAiPageData>>
>;
export async function AiPageExperience({
  data,
  locale,
}: {
  data: Data;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "aiPage" });
  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-24">
      <header className="from-ai/18 via-card to-primary/10 rounded-[2.5rem] border bg-gradient-to-br p-7 sm:p-10">
        <Sparkles aria-hidden className="text-ai size-8" />
        <p className="text-ai mt-5 text-sm font-semibold">{t("eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
          {t("description", { name: data.child.name })}
        </p>
      </header>
      {data.memoryOfTheDay && (
        <MemoryOfTheDayCard
          isPremium={data.isPremium}
          locale={locale}
          memory={data.memoryOfTheDay}
        />
      )}
      <AiSearch childId={data.child.id} locale={locale} />
      <section aria-labelledby="insights-title">
        <div className="flex items-center gap-3">
          <BookOpen aria-hidden className="text-ai size-5" />
          <h2 id="insights-title" className="text-2xl font-semibold">
            {t("insights.title")}
          </h2>
        </div>
        <p className="text-muted-foreground mt-2">
          {t("insights.description")}
        </p>
        {data.insights.length ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {data.insights.map((insight) => (
              <Link
                data-analytics-event="ai_insight_opened"
                className="bg-card/75 rounded-[1.75rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                href={`/memories/${insight.eventId}`}
                key={insight.id}
              >
                <div className="flex justify-between gap-4">
                  <span className="text-ai text-xs font-semibold">
                    {t("insights.label")}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {insight.importance}/100
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold">{insight.title}</h3>
                <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-6">
                  {insight.summary}
                </p>
                {insight.quote && (
                  <blockquote className="border-ai/30 text-muted-foreground mt-4 border-l-2 pl-4 text-sm italic">
                    {insight.quote}
                  </blockquote>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-card/60 mt-5 rounded-[1.75rem] border border-dashed p-8 text-center">
            <p className="font-semibold">{t("insights.emptyTitle")}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              {t("insights.emptyDescription")}
            </p>
          </div>
        )}
      </section>
      {data.connections.length > 0 && (
        <section className="rounded-[2rem] border p-6">
          <div className="flex items-center gap-3">
            <Link2 aria-hidden className="text-ai size-5" />
            <h2 className="font-semibold">{t("connections")}</h2>
          </div>
          <MemoryConnections connections={data.connections} locale={locale} />
        </section>
      )}
      <section className="grid gap-4 sm:grid-cols-2">
        {(["monthly", "annual"] as const).map((key) => (
          <article
            className="bg-card/65 rounded-[1.75rem] border p-6"
            key={key}
          >
            <span className="bg-muted grid size-11 place-items-center rounded-2xl">
              {data.isPremium ? (
                <CalendarClock aria-hidden />
              ) : (
                <LockKeyhole aria-hidden />
              )}
            </span>
            <h2 className="mt-5 text-xl font-semibold">{t(`${key}.title`)}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-6">
              {t(`${key}.description`)}
            </p>
            <span className="text-primary mt-4 inline-block text-xs font-semibold">
              {t("comingSoon")}
            </span>
          </article>
        ))}
      </section>
    </main>
  );
}
