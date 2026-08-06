import Image from "next/image";
import { Clock3, Mic, Milestone, Video } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { DashboardCard } from "@/features/dashboard/components/DashboardCard";
import { DashboardEmptyState } from "@/features/dashboard/components/DashboardEmptyState";
import { DashboardSectionHeader } from "@/features/dashboard/components/DashboardSectionHeader";
import type { DashboardMemory } from "@/features/dashboard/types/dashboard.types";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export async function TimelinePreview({
  locale,
  memories,
}: {
  locale: AppLocale;
  memories: DashboardMemory[];
}) {
  const t = await getTranslations({ locale, namespace: "dashboard.timeline" });
  return (
    <DashboardCard className="overflow-hidden" label={t("ariaLabel")}>
      <DashboardSectionHeader
        action={t("viewTimeline")}
        href="/timeline"
        title={t("title")}
      />
      {memories.length === 0 ? (
        <DashboardEmptyState
          description={t("emptyDescription")}
          icon={Milestone}
          title={t("emptyTitle")}
        />
      ) : (
        <div className="relative -mx-6 overflow-x-auto px-6 pb-3 sm:-mx-8 sm:px-8">
          <div
            aria-hidden
            className="from-primary/30 via-timeline/30 absolute top-5 right-8 left-8 h-px bg-gradient-to-r to-transparent"
          />
          <ol className="relative flex min-w-max gap-4 pt-1">
            {memories.map((memory, index) => (
              <li
                className="bg-background/65 hover:border-timeline/30 relative w-64 shrink-0 rounded-[1.75rem] border p-5 pt-8 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none sm:w-72"
                key={memory.id}
              >
                <Link
                  aria-label={t("open", { title: memory.title })}
                  className="focus-visible:ring-ring absolute inset-0 z-10 rounded-[1.75rem] focus-visible:ring-2 focus-visible:outline-none"
                  href={`/memories/${memory.id}/edit`}
                />
                <span className="bg-primary text-primary-foreground ring-background absolute -top-1 left-5 grid size-8 place-items-center rounded-full text-xs font-semibold shadow-sm ring-4">
                  {index + 1}
                </span>
                {memory.photoUrl ? (
                  <Image
                    alt=""
                    className="mb-4 h-24 w-full rounded-xl object-cover"
                    height={192}
                    src={memory.photoUrl}
                    unoptimized
                    width={448}
                  />
                ) : null}
                <h3 className="mt-2 line-clamp-2 text-base font-semibold tracking-tight">
                  {memory.title}
                </h3>
                <p className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
                  <Clock3 aria-hidden className="size-3.5" />
                  {new Intl.DateTimeFormat(locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(memory.occurredAt))}
                </p>
                {(memory.hasVideo || memory.hasAudio) && (
                  <div
                    className="text-muted-foreground mt-4 flex gap-2"
                    aria-hidden
                  >
                    {memory.hasVideo && <Video className="size-4" />}
                    {memory.hasAudio && <Mic className="size-4" />}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </DashboardCard>
  );
}
