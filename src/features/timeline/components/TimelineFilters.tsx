"use client";

import { useState, useTransition } from "react";
import { CalendarRange, Heart, Image, Mic, Search, Video } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import type {
  TimelineCategory,
  TimelineFiltersValue,
  TimelineTypeFilter,
} from "@/features/timeline/types/timeline.types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { analytics } from "@/lib/analytics";

export function TimelineFilters({
  categories,
  filters,
  locale,
}: {
  categories: readonly TimelineCategory[];
  filters: TimelineFiltersValue;
  locale: "tr" | "en";
}) {
  const t = useTranslations("timeline.filters");
  const pathname = usePathname();
  const router = useRouter();
  const current = useSearchParams();
  const [query, setQuery] = useState(filters.query);
  const [isPending, startTransition] = useTransition();
  const calendarLocale = locale === "tr" ? "tr-TR" : "en-US";

  function update(values: Record<string, string | null>) {
    const params = new URLSearchParams(current.toString());
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    const search = params.toString();
    if (search === current.toString()) return;
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  }
  const typeOptions: Array<{ icon: typeof Image; value: TimelineTypeFilter }> =
    [
      { icon: CalendarRange, value: "all" },
      { icon: Image, value: "photo" },
      { icon: Video, value: "video" },
      { icon: Mic, value: "audio" },
      { icon: CalendarRange, value: "written" },
    ];
  return (
    <section
      aria-label={t("ariaLabel")}
      className="bg-card/70 space-y-6 rounded-[2rem] border p-5 shadow-sm backdrop-blur-xl sm:p-7"
    >
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (query.trim())
            analytics.track("search_used", { search_scope: "timeline" });
          update({ q: query.trim() || null });
        }}
        role="search"
      >
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2"
          />
          <Input
            aria-label={t("searchLabel")}
            className="h-12 rounded-xl pl-11"
            disabled={isPending}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            value={query}
          />
        </div>
        <Button loading={isPending} type="submit" variant="outline">
          {t("searchAction")}
        </Button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        <Select
          disabled={isPending}
          onValueChange={(value) =>
            update({ category: value === "all" ? null : value })
          }
          value={filters.categoryId || "all"}
        >
          <SelectTrigger
            aria-label={t("categoryLabel")}
            className="h-12 rounded-xl"
          >
            <SelectValue placeholder={t("categoryLabel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          aria-label={t("fromLabel")}
          calendarLabel={t("calendarLabel")}
          isDisabled={isPending}
          locale={calendarLocale}
          name="timeline-from"
          nextMonthLabel={t("nextMonth")}
          onValueChange={(value) => update({ from: value || null })}
          openCalendarLabel={t("openCalendar")}
          previousMonthLabel={t("previousMonth")}
          value={filters.from}
        />
        <DatePicker
          aria-label={t("toLabel")}
          calendarLabel={t("calendarLabel")}
          isDisabled={isPending}
          locale={calendarLocale}
          name="timeline-to"
          nextMonthLabel={t("nextMonth")}
          onValueChange={(value) => update({ to: value || null })}
          openCalendarLabel={t("openCalendar")}
          previousMonthLabel={t("previousMonth")}
          value={filters.to}
        />
      </div>
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={t("typeLabel")}
      >
        {typeOptions.map(({ icon: Icon, value }) => (
          <button
            aria-pressed={filters.type === value}
            className={`focus-visible:ring-ring inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-2 ${filters.type === value ? "bg-primary text-primary-foreground border-primary" : "bg-background/70 hover:bg-accent"}`}
            key={value}
            disabled={isPending}
            onClick={() => update({ type: value === "all" ? null : value })}
            type="button"
          >
            <Icon aria-hidden className="size-4" />
            {t(`types.${value}`)}
          </button>
        ))}
        <button
          aria-pressed={filters.favorite}
          className={`focus-visible:ring-ring inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-2 ${filters.favorite ? "bg-primary text-primary-foreground border-primary" : "bg-background/70 hover:bg-accent"}`}
          disabled={isPending}
          onClick={() => update({ favorite: filters.favorite ? null : "true" })}
          type="button"
        >
          <Heart aria-hidden className="size-4" />
          {t("favorites")}
        </button>
      </div>
    </section>
  );
}
