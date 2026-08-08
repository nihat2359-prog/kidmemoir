"use client";

import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
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
import type { EventFilters, EventsData } from "@/features/events/types";
import { usePathname, useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";

export function EventsFilters({
  data,
  filters,
  locale,
}: {
  data: EventsData;
  filters: EventFilters;
  locale: "tr" | "en";
}) {
  const t = useTranslations("events.filters");
  const current = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState(filters.query);
  const [pending, startTransition] = useTransition();
  function update(values: Record<string, string | null>) {
    const params = new URLSearchParams(current.toString());
    params.delete("page");
    Object.entries(values).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key),
    );
    startTransition(() =>
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      }),
    );
  }
  return (
    <section
      aria-label={t("ariaLabel")}
      className="bg-card/75 space-y-5 rounded-[2rem] border p-5 shadow-sm backdrop-blur-xl sm:p-7"
    >
      <form
        className="flex gap-3"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (query.trim())
            analytics.track("search_used", { search_scope: "events" });
          update({ q: query.trim() || null });
        }}
      >
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2"
          />
          <Input
            aria-label={t("searchLabel")}
            className="pl-11"
            disabled={pending}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
        <Button loading={pending} type="submit" variant="outline">
          {t("search")}
        </Button>
      </form>
      <div className="grid gap-3 md:grid-cols-3">
        <Select
          value={filters.childId || "all"}
          onValueChange={(v) => update({ child: v === "all" ? null : v })}
        >
          <SelectTrigger aria-label={t("child")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allChildren")}</SelectItem>
            {data.children.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.type}
          onValueChange={(v) => update({ type: v === "all" ? null : v })}
        >
          <SelectTrigger aria-label={t("type")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "photo", "video", "audio", "written"].map((v) => (
              <SelectItem key={v} value={v}>
                {t(`types.${v}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.importance}
          onValueChange={(v) => update({ importance: v === "all" ? null : v })}
        >
          <SelectTrigger aria-label={t("importance")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "low", "normal", "high", "critical"].map((v) => (
              <SelectItem key={v} value={v}>
                {t(`importanceOptions.${v}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          aria-label={t("from")}
          calendarLabel={t("calendar")}
          locale={locale === "tr" ? "tr-TR" : "en-US"}
          name="events-from"
          nextMonthLabel={t("nextMonth")}
          openCalendarLabel={t("openCalendar")}
          previousMonthLabel={t("previousMonth")}
          value={filters.from}
          onValueChange={(v) => update({ from: v || null })}
        />
        <DatePicker
          aria-label={t("to")}
          calendarLabel={t("calendar")}
          locale={locale === "tr" ? "tr-TR" : "en-US"}
          name="events-to"
          nextMonthLabel={t("nextMonth")}
          openCalendarLabel={t("openCalendar")}
          previousMonthLabel={t("previousMonth")}
          value={filters.to}
          onValueChange={(v) => update({ to: v || null })}
        />
        <Button
          aria-pressed={filters.favorite}
          onClick={() => update({ favorite: filters.favorite ? null : "true" })}
          type="button"
          variant={filters.favorite ? "primary" : "outline"}
        >
          {t("favorites")}
        </Button>
      </div>
    </section>
  );
}
