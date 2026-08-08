import Image from "next/image";
import { ArrowLeft, CalendarDays, MapPin, Pencil } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { DeleteMemoryButton } from "@/features/memories/components/DeleteMemoryButton";
import { MemoryConnections } from "@/features/memories/components/MemoryConnections";
import { MemoryInsightCard } from "@/features/memories/components/MemoryInsightCard";
import type { getMemoryDetail } from "@/features/memories/services/memoryDetailService";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type Detail = NonNullable<Awaited<ReturnType<typeof getMemoryDetail>>>;
export async function MemoryDetailExperience({
  detail,
  locale,
}: {
  detail: Detail;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "memories.detail" });
  return (
    <main className="mx-auto max-w-5xl space-y-8 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild icon={<ArrowLeft aria-hidden />} variant="outline">
          <Link href="/events">{t("back")}</Link>
        </Button>
        <Button asChild icon={<Pencil aria-hidden />}>
          <Link href={`/memories/${detail.id}/edit`}>{t("edit")}</Link>
        </Button>
      </div>
      <article className="bg-card/75 overflow-hidden rounded-[2.5rem] border shadow-lg">
        <header className="from-primary/12 via-card to-journal/8 bg-gradient-to-br p-7 sm:p-12">
          <p className="text-primary text-sm font-semibold">
            {detail.category}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
            {detail.title}
          </h1>
          <div className="text-muted-foreground mt-5 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <CalendarDays aria-hidden className="size-4" />
              {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
                new Date(detail.occurredAt),
              )}
            </span>
            {detail.location && (
              <span className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4" />
                {detail.location}
              </span>
            )}
          </div>
        </header>
        <div className="space-y-8 p-6 sm:p-10">
          {detail.description && (
            <p className="text-lg leading-8 whitespace-pre-wrap">
              {detail.description}
            </p>
          )}
          {detail.media.length > 0 && (
            <section
              aria-label={t("mediaLabel")}
              className="grid gap-4 sm:grid-cols-2"
            >
              {detail.media.map((media) =>
                media.mediaType === "photo" ? (
                  <Image
                    alt={media.fileName}
                    className="h-auto w-full rounded-2xl border object-cover"
                    height={900}
                    key={media.id}
                    src={media.url}
                    width={1200}
                  />
                ) : media.mediaType === "video" ? (
                  <video
                    className="w-full rounded-2xl border"
                    controls
                    key={media.id}
                    preload="metadata"
                    src={media.url}
                  >
                    {t("videoFallback")}
                  </video>
                ) : media.mediaType === "audio" ? (
                  <audio
                    className="w-full"
                    controls
                    key={media.id}
                    preload="metadata"
                    src={media.url}
                  >
                    {t("audioFallback")}
                  </audio>
                ) : null,
              )}
            </section>
          )}
        </div>
      </article>
      <MemoryInsightCard
        eventId={detail.id}
        insight={detail.insight}
        locale={locale}
      />
      <MemoryConnections connections={detail.connections} locale={locale} />
      <section className="border-danger/20 bg-danger/5 flex flex-col gap-4 rounded-[2rem] border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">{t("deleteTitle")}</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("deleteDescription")}
          </p>
        </div>
        <DeleteMemoryButton childId={detail.childId} eventId={detail.id} />
      </section>
    </main>
  );
}
