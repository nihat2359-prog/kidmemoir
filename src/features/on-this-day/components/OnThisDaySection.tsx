import { PartyPopper, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { OnThisDayCard } from "@/features/on-this-day/components/OnThisDayCard";
import type { OnThisDayMemory } from "@/features/on-this-day/types/onThisDay.types";
import type { AppLocale } from "@/i18n/routing";

export async function OnThisDaySection({
  locale,
  memories,
}: {
  locale: AppLocale;
  memories: readonly OnThisDayMemory[];
}) {
  if (!memories.length) return null;
  const t = await getTranslations({ locale, namespace: "onThisDay" });
  return (
    <section
      aria-labelledby="on-this-day-title"
      className="from-primary/12 via-card/72 to-journal/10 relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br p-5 shadow-lg sm:p-8 lg:p-10 dark:border-white/10"
    >
      <header className="relative z-10 mb-7 sm:mb-9">
        <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase">
          <Sparkles aria-hidden className="size-4" />
          {t("eyebrow")}
        </p>
        <h2
          className="mt-2 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl"
          id="on-this-day-title"
        >
          {t("title")}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl leading-7">
          {t("description")}
        </p>
      </header>
      <div
        className={`relative z-10 grid gap-5 ${memories.length > 1 ? "lg:grid-cols-2" : "max-w-4xl"}`}
      >
        {memories.map((memory) => (
          <OnThisDayCard
            action={t("action")}
            date={new Intl.DateTimeFormat(locale, {
              dateStyle: "long",
              timeZone: "Europe/Istanbul",
            }).format(new Date(memory.occurredAt))}
            headline={t("yearsAgo", { count: memory.yearsAgo })}
            key={memory.id}
            mediaLabel={t("mediaLabel", { title: memory.title })}
            memory={memory}
          />
        ))}
      </div>
      <PartyPopper
        aria-hidden
        className="text-primary/5 absolute -right-12 -bottom-16 size-64 rotate-[-12deg]"
      />
    </section>
  );
}
