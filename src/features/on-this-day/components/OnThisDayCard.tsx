import { ArrowRight, CalendarDays, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OnThisDayMediaPreview } from "@/features/on-this-day/components/OnThisDayMediaPreview";
import type { OnThisDayMemory } from "@/features/on-this-day/types/onThisDay.types";
import { Link } from "@/i18n/navigation";

export function OnThisDayCard({
  action,
  date,
  headline,
  mediaLabel,
  memory,
}: {
  action: string;
  date: string;
  headline: string;
  mediaLabel: string;
  memory: OnThisDayMemory;
}) {
  return (
    <article className="group bg-background/68 flex h-full flex-col rounded-[2rem] border border-white/55 p-4 shadow-sm backdrop-blur-xl sm:p-6 dark:border-white/10">
      {memory.media && (
        <OnThisDayMediaPreview label={mediaLabel} media={memory.media} />
      )}
      <div
        className={`flex flex-1 flex-col ${memory.media ? "pt-6" : "p-2 sm:p-4"}`}
      >
        <p className="text-primary flex items-center gap-2 text-sm font-semibold">
          <Heart aria-hidden className="size-4" fill="currentColor" />
          {headline}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
          {memory.title}
        </h3>
        {memory.description && (
          <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-7 sm:text-base">
            {memory.description}
          </p>
        )}
        <p className="text-muted-foreground mt-5 flex items-center gap-2 text-sm">
          <CalendarDays aria-hidden className="size-4" />
          {date}
        </p>
        <Button
          asChild
          className="mt-6 self-start"
          icon={<ArrowRight aria-hidden />}
          iconPosition="end"
          variant="outline"
        >
          <Link href={`/memories/${memory.id}`}>{action}</Link>
        </Button>
      </div>
    </article>
  );
}
