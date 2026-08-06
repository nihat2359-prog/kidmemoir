"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { loadTimelinePage } from "@/features/timeline/actions/loadTimelinePage";
import { TimelineCard } from "@/features/timeline/components/TimelineCard";
import {
  TimelineDateDivider,
  TimelineYearDivider,
} from "@/features/timeline/components/TimelineDividers";
import { TimelineEmptyState } from "@/features/timeline/components/TimelineEmptyState";
import type {
  TimelineCategory,
  TimelineCursor,
  TimelineFiltersValue,
  TimelineItem,
  TimelinePageResult,
} from "@/features/timeline/types/timeline.types";

function dateKey(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Europe/Istanbul",
    year: "numeric",
  }).format(new Date(value));
}

export function TimelineFeed({
  categories,
  filters,
  initialPage,
  locale,
}: {
  categories: readonly TimelineCategory[];
  filters: TimelineFiltersValue;
  initialPage: TimelinePageResult;
  locale: "tr" | "en";
}) {
  const t = useTranslations("timeline");
  const [items, setItems] = useState<readonly TimelineItem[]>(
    initialPage.items,
  );
  const [cursor, setCursor] = useState<TimelineCursor | null>(
    initialPage.nextCursor,
  );
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );
  const groups = useMemo(() => {
    const result: Array<{ date: string; items: TimelineItem[] }> = [];
    items.forEach((item) => {
      const key = dateKey(item.occurredAt);
      const current = result.at(-1);
      if (current?.date === key) current.items.push(item);
      else result.push({ date: key, items: [item] });
    });
    return result;
  }, [items]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setFailed(false);
    const result = await loadTimelinePage(filters, cursor);
    if (result.success) {
      setItems((current) => {
        const ids = new Set(current.map(({ id }) => id));
        return [
          ...current,
          ...result.data.items.filter(({ id }) => !ids.has(id)),
        ];
      });
      setCursor(result.data.nextCursor);
    } else setFailed(true);
    loadingRef.current = false;
    setLoading(false);
  }, [cursor, filters]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !cursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "500px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [cursor, loadMore]);

  if (items.length === 0 && !cursor && !loading)
    return (
      <TimelineEmptyState
        action={t("empty.action")}
        description={t("empty.description")}
        title={t("empty.title")}
      />
    );
  let previousYear = "";
  return (
    <section aria-label={t("feed.ariaLabel")} aria-busy={loading}>
      <div className="space-y-8">
        {groups.map((group) => {
          const date = new Date(`${group.date}T12:00:00Z`);
          const year = new Intl.DateTimeFormat(locale, {
            timeZone: "Europe/Istanbul",
            year: "numeric",
          }).format(date);
          const showYear = year !== previousYear;
          previousYear = year;
          return (
            <div key={group.date}>
              {showYear && <TimelineYearDivider year={year} />}
              <TimelineDateDivider
                label={new Intl.DateTimeFormat(locale, {
                  dateStyle: "long",
                  timeZone: "Europe/Istanbul",
                }).format(date)}
              />
              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                {group.items.map((item) => (
                  <TimelineCard
                    category={
                      categoryNames.get(item.categoryId) ??
                      t("card.uncategorized")
                    }
                    item={item}
                    key={item.id}
                    locale={locale}
                    mediaLabel={t("card.mediaLabel", { title: item.title })}
                    openLabel={t("card.openLabel", { title: item.title })}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="mt-12 flex min-h-16 items-center justify-center"
        ref={sentinel}
      >
        {loading && (
          <p
            className="text-muted-foreground flex items-center gap-2 text-sm"
            role="status"
          >
            <LoaderCircle
              aria-hidden
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            {t("feed.loading")}
          </p>
        )}
        {failed && (
          <Button
            icon={<RotateCcw aria-hidden />}
            onClick={() => void loadMore()}
            type="button"
            variant="outline"
          >
            {t("feed.retry")}
          </Button>
        )}
        {!cursor && items.length > 0 && (
          <p className="text-muted-foreground text-sm">{t("feed.end")}</p>
        )}
      </div>
    </section>
  );
}
