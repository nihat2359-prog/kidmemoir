import { CalendarDays, Heart } from "lucide-react";
import { TimelineMediaPreview } from "@/features/timeline/components/TimelineMediaPreview";
import type { TimelineItem } from "@/features/timeline/types/timeline.types";
import { Link } from "@/i18n/navigation";

export function TimelineCard({
  category,
  item,
  locale,
  mediaLabel,
  openLabel,
}: {
  category: string;
  item: TimelineItem;
  locale: string;
  mediaLabel: string;
  openLabel: string;
}) {
  return (
    <article className="group bg-card/75 hover:border-primary/20 relative overflow-hidden rounded-[2rem] border p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none sm:p-7">
      <Link
        aria-label={openLabel}
        className="focus-visible:ring-ring absolute inset-0 z-20 rounded-[2rem] focus-visible:ring-2 focus-visible:outline-none"
        href={`/memories/${item.id}`}
      />
      <TimelineMediaPreview label={mediaLabel} media={item.media} />
      <div className={item.media.length ? "mt-6" : undefined}>
        <div className="flex items-center justify-between gap-4">
          <span className="bg-primary/8 text-primary rounded-full px-3 py-1 text-xs font-semibold">
            {category}
          </span>
          {item.isFavorite && (
            <Heart
              aria-hidden
              className="text-danger size-4"
              fill="currentColor"
            />
          )}
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-muted-foreground mt-3 line-clamp-4 text-sm leading-7 sm:text-base">
            {item.description}
          </p>
        )}
        <p className="text-muted-foreground mt-6 flex items-center gap-2 text-xs">
          <CalendarDays aria-hidden className="size-3.5" />
          {new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
          }).format(new Date(item.occurredAt))}
        </p>
      </div>
    </article>
  );
}
