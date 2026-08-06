import Image from "next/image";
import { BookHeart, CalendarDays, Mic, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";
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
    <DashboardCard className="h-full" label={t("ariaLabel")}>
      <DashboardSectionHeader
        action={t("viewAll")}
        href="/events"
        title={t("title")}
      />
      {memories.length === 0 ? (
        <DashboardEmptyState
          description={t("emptyDescription")}
          icon={BookHeart}
          title={t("emptyTitle")}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {memories.map((memory, index) => (
            <li
              className={`group from-journal/9 via-background/70 to-primary/5 hover:border-journal/25 relative min-h-48 overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none ${index === 0 ? "sm:col-span-2 sm:min-h-64 sm:p-7" : ""}`}
              key={memory.id}
            >
              <Link
                aria-label={t("open", { title: memory.title })}
                className="focus-visible:ring-ring absolute inset-0 z-20 rounded-[1.75rem] focus-visible:ring-2 focus-visible:outline-none"
                href={`/memories/${memory.id}/edit`}
              />
              {memory.photoUrl ? (
                <Image
                  alt=""
                  className="absolute top-5 right-5 z-10 h-20 w-24 rounded-2xl border border-white/40 object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
                  height={160}
                  src={memory.photoUrl}
                  unoptimized
                  width={192}
                />
              ) : null}
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div className={memory.photoUrl ? "pr-28" : undefined}>
                  <span className="bg-background/75 text-journal grid size-11 place-items-center rounded-2xl border shadow-sm backdrop-blur-sm">
                    <BookHeart aria-hidden className="size-5" />
                  </span>
                  <h3
                    className={`mt-5 line-clamp-2 font-semibold tracking-[-0.02em] ${index === 0 ? "text-xl sm:text-2xl" : "text-base"}`}
                  >
                    {memory.title}
                  </h3>
                  {memory.description ? (
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-6">
                      {memory.description}
                    </p>
                  ) : null}
                </div>
                <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs">
                  <CalendarDays aria-hidden className="size-3.5" />
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(memory.occurredAt))}
                </p>
                {(memory.hasVideo || memory.hasAudio) && (
                  <div className="flex gap-2" aria-hidden>
                    {memory.hasVideo && <Video className="size-4" />}
                    {memory.hasAudio && <Mic className="size-4" />}
                  </div>
                )}
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
