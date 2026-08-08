import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { MemoryOfTheDay } from "@/features/dashboard/types/dashboard.types";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function MemoryOfTheDayCard({
  isPremium,
  locale,
  memory,
}: {
  isPremium: boolean;
  locale: AppLocale;
  memory: MemoryOfTheDay;
}) {
  const t = await getTranslations({
    locale,
    namespace: "dashboard.memoryOfTheDay",
  });
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(memory.occurredAt),
  );

  return (
    <section
      aria-labelledby="memory-of-the-day-title"
      className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 from-primary/12 via-background/45 to-ai/10 relative isolate mt-9 overflow-hidden rounded-[1.75rem] border border-white/50 bg-gradient-to-br shadow-lg backdrop-blur-xl motion-safe:duration-500 dark:border-white/10"
    >
      {memory.mediaUrl ? (
        <>
          <Image
            alt=""
            aria-hidden
            className="object-cover opacity-25 blur-xl dark:opacity-20"
            fill
            priority
            sizes="(max-width: 1536px) 100vw, 1440px"
            src={memory.mediaUrl}
          />
          <div
            aria-hidden
            className="from-background/95 via-background/80 to-background/55 absolute inset-0 bg-gradient-to-r"
          />
        </>
      ) : null}
      <div className="relative z-10 p-5 sm:p-6">
        <Link
          aria-label={t("actions.open")}
          className="focus-visible:ring-ring absolute inset-0 z-10 rounded-[1.75rem] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
          href={`/memories/${memory.eventId}`}
        />
        <div className="relative max-w-xl">
          <span className="text-primary inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase">
            <Sparkles aria-hidden className="size-3.5" />
            {t("eyebrow")}
          </span>
          <p className="text-primary mt-3 text-xs font-medium">
            {t(`types.${memory.type}`, { years: memory.yearsAgo })}
          </p>
          <h2
            className="mt-1.5 line-clamp-2 text-xl font-semibold tracking-[-0.035em] text-balance sm:text-2xl"
            id="memory-of-the-day-title"
          >
            {memory.title}
          </h2>
          {memory.description ? (
            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6">
              {memory.description}
            </p>
          ) : null}
          {memory.quote ? (
            <blockquote className="border-primary/35 text-foreground/75 mt-3 line-clamp-1 border-l-2 pl-3 text-xs leading-5 italic sm:text-sm">
              “{memory.quote}”
            </blockquote>
          ) : null}
          <div className="text-muted-foreground mt-3 flex items-center justify-between gap-3 text-xs">
            <span>{date}</span>
            <span className="text-primary inline-flex items-center gap-1 font-semibold">
              {t("actions.open")}
              <ArrowRight aria-hidden className="size-3.5" />
            </span>
          </div>
        </div>
        {isPremium ? (
          <span className="sr-only">{t("premium.title")}</span>
        ) : null}
      </div>
    </section>
  );
}
