import Image from "next/image";
import { BookOpen, Camera, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
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
      className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 from-primary/20 via-card to-ai/15 relative isolate min-h-[30rem] overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br shadow-xl motion-safe:duration-700 sm:min-h-[34rem] dark:border-white/10"
    >
      {memory.mediaUrl ? (
        <>
          <Image
            alt=""
            aria-hidden
            className="scale-110 object-cover opacity-45 blur-2xl dark:opacity-35"
            fill
            priority
            sizes="(max-width: 1536px) 100vw, 1440px"
            src={memory.mediaUrl}
          />
          <div
            aria-hidden
            className="from-background/95 via-background/80 to-background/40 absolute inset-0 bg-gradient-to-r"
          />
        </>
      ) : null}
      <div className="relative z-10 flex min-h-[30rem] flex-col justify-end p-7 sm:min-h-[34rem] sm:p-10 lg:p-14">
        <div className="max-w-3xl">
          <Badge variant="premium">
            <Sparkles aria-hidden className="size-3.5" />
            {t("eyebrow")}
          </Badge>
          <p className="text-primary mt-5 text-sm font-medium">
            {t(`types.${memory.type}`, { years: memory.yearsAgo })}
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            id="memory-of-the-day-title"
          >
            {memory.title}
          </h2>
          {memory.description ? (
            <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              {memory.description}
            </p>
          ) : null}
          {memory.quote ? (
            <blockquote className="border-primary/45 text-foreground/85 mt-6 max-w-2xl border-l-2 pl-5 text-base leading-7 italic sm:text-lg">
              “{memory.quote}”
            </blockquote>
          ) : null}
          <p className="text-muted-foreground mt-4 text-sm">{date}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {memory.mediaUrl ? (
              <Link
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
                href={`/memories/${memory.eventId}#media`}
              >
                <Camera aria-hidden className="size-4" />
                {t("actions.photo")}
              </Link>
            ) : null}
            <Link
              className="bg-background/70 hover:bg-accent focus-visible:ring-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium backdrop-blur transition focus-visible:ring-2 focus-visible:outline-none"
              href={`/memories/${memory.eventId}`}
            >
              <BookOpen aria-hidden className="size-4" />
              {t("actions.open")}
            </Link>
            <Link
              className="hover:bg-accent focus-visible:ring-ring inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
              href="/timeline"
            >
              {t("actions.timeline")}
            </Link>
          </div>
        </div>
        {isPremium ? (
          <div className="border-foreground/10 mt-8 border-t pt-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {t("premium.title")}
            </p>
            <ul
              className="mt-3 flex flex-wrap gap-2"
              aria-label={t("premium.ariaLabel")}
            >
              {(["related", "after", "weekly", "pdf"] as const).map((key) => (
                <li
                  className="bg-background/55 rounded-full border px-3 py-2 text-xs font-medium backdrop-blur"
                  key={key}
                >
                  {t(`premium.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
