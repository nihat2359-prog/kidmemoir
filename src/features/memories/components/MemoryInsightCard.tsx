import { Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { AnalyticsMarker } from "@/lib/analytics/AnalyticsMarker";

export async function MemoryInsightCard({
  insight,
  locale,
  eventId,
}: {
  eventId: string;
  insight: Readonly<{
    emotion: string | null;
    importance_score: number | null;
    keywords: string[];
    memory_quote: string | null;
    short_title: string | null;
    summary: string;
  }> | null;
  locale: AppLocale;
}) {
  if (!insight) return null;
  const t = await getTranslations({ locale, namespace: "memories.insight" });
  const emotionKey = insight.emotion ? `emotions.${insight.emotion}` : null;
  const emotion = emotionKey && t.has(emotionKey) ? t(emotionKey) : null;
  return (
    <section
      aria-labelledby="memory-insight-title"
      className="from-ai/10 via-card/75 to-primary/8 mt-12 rounded-[2rem] border bg-gradient-to-br p-6 shadow-sm sm:p-8"
    >
      <AnalyticsMarker dedupeKey={eventId} event="ai_insight_generated" />
      <div className="flex items-center gap-3">
        <span className="bg-ai/12 text-ai grid size-10 place-items-center rounded-xl">
          <Sparkles aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="font-semibold" id="memory-insight-title">
            {insight.short_title ?? t("title")}
          </h2>
        </div>
      </div>
      <p className="text-foreground/90 mt-5 max-w-3xl leading-7">
        {insight.summary}
      </p>
      {insight.memory_quote ? (
        <blockquote className="border-primary/40 text-foreground/80 mt-5 max-w-3xl border-l-2 pl-5 leading-7 italic">
          “{insight.memory_quote}”
        </blockquote>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {emotion ? (
          <span className="bg-background/60 rounded-full border px-3 py-1.5 text-xs font-medium">
            {t("emotion", { value: emotion })}
          </span>
        ) : null}
        {insight.importance_score ? (
          <span className="bg-background/60 rounded-full border px-3 py-1.5 text-xs font-medium">
            {t("importance", { value: insight.importance_score })}
          </span>
        ) : null}
        {insight.keywords.map((keyword) => (
          <span
            className="bg-muted rounded-full px-3 py-1.5 text-xs"
            key={keyword}
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
