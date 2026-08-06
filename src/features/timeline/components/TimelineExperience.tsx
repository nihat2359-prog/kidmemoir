import { getTranslations } from "next-intl/server";
import { OnThisDaySection } from "@/features/on-this-day";
import { TimelineFeed } from "@/features/timeline/components/TimelineFeed";
import { TimelineFilters } from "@/features/timeline/components/TimelineFilters";
import { TimelineHero } from "@/features/timeline/components/TimelineHero";
import type {
  TimelineFiltersValue,
  TimelineScreenData,
} from "@/features/timeline/types/timeline.types";
import type { AppLocale } from "@/i18n/routing";

export async function TimelineExperience({
  data,
  filters,
  locale,
}: {
  data: TimelineScreenData;
  filters: TimelineFiltersValue;
  locale: AppLocale;
}) {
  const [t, catalog] = await Promise.all([
    getTranslations({ locale, namespace: "timeline" }),
    getTranslations({ locale, namespace: "memories.create" }),
  ]);
  const categories = data.categories.map((category) => {
    const key = `catalog.${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
    return {
      ...category,
      name: catalog.has(key) ? catalog(key) : category.name,
    };
  });
  const childName = [data.child.firstName, data.child.lastName]
    .filter(Boolean)
    .join(" ");
  const filterKey = JSON.stringify(filters);
  return (
    <main className="min-h-svh pb-16">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:space-y-10 lg:px-8 lg:py-14">
        <TimelineHero
          avatarLabel={t("hero.avatarLabel", { name: childName })}
          avatarUrl={data.child.avatarUrl}
          backLabel={t("hero.backDashboard")}
          childName={childName}
          description={t("hero.description")}
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
        />
        <OnThisDaySection locale={locale} memories={data.onThisDay} />
        <TimelineFilters
          categories={categories}
          filters={filters}
          key={`filters-${filterKey}`}
          locale={locale}
        />
        <TimelineFeed
          categories={categories}
          filters={filters}
          initialPage={data.page}
          key={`feed-${filterKey}`}
          locale={locale}
        />
      </div>
    </main>
  );
}
