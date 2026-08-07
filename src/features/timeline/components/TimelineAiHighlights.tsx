import { LockKeyhole, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { AiUpgradeSheet } from "@/features/billing/components/AiUpgradeSheet";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { TimelineScreenData } from "@/features/timeline/types/timeline.types";

export async function TimelineAiHighlights({
  ai,
  locale,
}: {
  ai: TimelineScreenData["ai"];
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "timeline.ai" });

  if (!ai.isPremium)
    return (
      <section
        aria-labelledby="timeline-ai-title"
        className="bg-card/75 relative overflow-hidden rounded-[2rem] border p-6 shadow-sm sm:p-8"
      >
        <div
          aria-hidden
          className="from-ai/12 to-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent"
        />
        <div className="relative">
          <Badge variant="premium">
            <LockKeyhole aria-hidden className="size-3.5" />
            {t("premiumBadge")}
          </Badge>
          <div className="mt-5 space-y-3 blur-[5px] select-none" aria-hidden>
            <div className="bg-foreground/25 h-5 w-2/3 rounded-full" />
            <div className="bg-foreground/15 h-4 w-full rounded-full" />
            <div className="bg-foreground/15 h-4 w-4/5 rounded-full" />
          </div>
          <h2 id="timeline-ai-title" className="mt-6 text-xl font-semibold">
            {t("previewTitle")}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
            {t("previewDescription")}
          </p>
          <div className="mt-5">
            <AiUpgradeSheet feature="connections" locale={locale} />
          </div>
        </div>
      </section>
    );

  if (!ai.highlights.length) return null;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  return (
    <section
      aria-labelledby="timeline-ai-title"
      className="bg-card/75 rounded-[2rem] border p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-center gap-3">
        <Sparkles aria-hidden className="text-ai size-5" />
        <h2 id="timeline-ai-title" className="text-xl font-semibold">
          {t("title")}
        </h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {ai.highlights.map((item) => (
          <Link
            className="bg-background/65 focus-visible:ring-ring rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:outline-none"
            href={`/memories/${item.id}`}
            key={item.id}
          >
            <p className="font-medium">{item.title}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              {date.format(new Date(item.occurredAt))}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
