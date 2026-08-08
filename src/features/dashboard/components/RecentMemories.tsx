import Image from "next/image";
import { BookHeart, CalendarDays, Mic, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardEmptyState } from "@/features/dashboard/components/DashboardEmptyState";
import { DashboardSectionHeader } from "@/features/dashboard/components/DashboardSectionHeader";
import type { DashboardMemory } from "@/features/dashboard/types/dashboard.types";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export async function RecentMemories({
  locale,
  memories,
}: {
  locale: AppLocale;
  memories: DashboardMemory[];
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.recent" });
  return (
    <DashboardCard className="self-start p-5 sm:p-8" label={t("ariaLabel")}>
      <DashboardSectionHeader
        action={t("viewAll")}
        href="/events"
        title={t("title")}
      />
      {memories.length === 0 ? (
        <DashboardEmptyState
          action={
            <Button asChild>
              <Link href="/memories/new">{t("emptyAction")}</Link>
            </Button>
          }
          description={t("emptyDescription")}
          icon={BookHeart}
          title={t("emptyTitle")}
        />
      ) : (
        <ul className="grid min-w-0 grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {memories.map((memory, index) => (
            <li
              className={`group from-journal/9 via-background/70 to-primary/5 hover:border-journal/25 relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-br shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              key={memory.id}
            >
              <Link
                aria-label={t("open", { title: memory.title })}
                className="focus-visible:ring-ring absolute inset-0 z-20 rounded-[1.75rem] focus-visible:ring-2 focus-visible:outline-none"
                href={`/memories/${memory.id}`}
              />
              {memory.photoUrl ? (
                <div
                  className={`relative w-full overflow-hidden ${index === 0 ? "aspect-[16/8] sm:aspect-[16/6] lg:aspect-[16/7]" : "aspect-[16/7]"}`}
                >
                  <Image
                    alt=""
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 1024px) 100vw, 58vw"
                        : "(max-width: 640px) 100vw, 30vw"
                    }
                    src={memory.photoUrl}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              ) : null}
              <div className="relative z-10 p-4 sm:p-5">
                <div>
                  {!memory.photoUrl ? (
                    <span className="bg-background/75 text-journal grid size-10 place-items-center rounded-xl border shadow-sm backdrop-blur-sm">
                      <BookHeart aria-hidden className="size-4" />
                    </span>
                  ) : null}
                  <h3
                    className={`line-clamp-2 font-semibold tracking-[-0.025em] ${memory.photoUrl ? "mt-0" : "mt-4"} ${index === 0 ? "text-lg sm:text-xl" : "text-base"}`}
                  >
                    {memory.title}
                  </h3>
                  {memory.description ? (
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-5">
                      {memory.description}
                    </p>
                  ) : null}
                </div>
                <div className="text-muted-foreground mt-4 flex items-center justify-between gap-3 text-xs">
                  <p className="flex min-w-0 items-center gap-1.5">
                    <CalendarDays aria-hidden className="size-3.5 shrink-0" />
                    <span className="truncate">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                      }).format(new Date(memory.occurredAt))}
                    </span>
                  </p>
                  {(memory.hasVideo || memory.hasAudio) && (
                    <div className="flex shrink-0 gap-2" aria-hidden>
                      {memory.hasVideo && <Video className="size-4" />}
                      {memory.hasAudio && <Mic className="size-4" />}
                    </div>
                  )}
                </div>
              </div>
              <div
                aria-hidden
                className="bg-journal/8 absolute -right-14 -bottom-16 size-44 rounded-full blur-3xl"
              />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
