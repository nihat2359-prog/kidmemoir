import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventCard } from "@/features/events/EventCard";
import { EventsFilters } from "@/features/events/EventsFilters";
import { getEventsData } from "@/features/events/service";
import type { EventFilters } from "@/features/events/types";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const one = (v: string | string[] | undefined) =>
  Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
function filters(
  raw: Record<string, string | string[] | undefined>,
): EventFilters {
  const importance = one(raw.importance);
  const type = one(raw.type);
  return {
    childId: one(raw.child),
    favorite: one(raw.favorite) === "true",
    from: one(raw.from),
    importance: ["low", "normal", "high", "critical"].includes(importance)
      ? (importance as EventFilters["importance"])
      : "all",
    page: Math.max(1, Number.parseInt(one(raw.page) || "1", 10) || 1),
    query: one(raw.q),
    to: one(raw.to),
    type: ["photo", "video", "audio", "written"].includes(type)
      ? (type as EventFilters["type"])
      : "all",
  };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "events.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function EventsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/events`);
  const f = filters(await searchParams);
  const data = await getEventsData(user, f);
  const t = await getTranslations({ locale, namespace: "events" });
  const base = new URLSearchParams();
  Object.entries(await searchParams).forEach(([k, v]) => {
    const x = one(v);
    if (x && k !== "page") base.set(k, x);
  });
  return (
    <main className="mx-auto max-w-7xl space-y-8 pb-24">
      <header className="from-primary/12 via-card/80 to-journal/10 rounded-[2.5rem] border bg-gradient-to-br p-7 sm:p-10">
        <p className="text-primary text-sm font-semibold">{t("eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
          {t("description")}
        </p>
        <p className="mt-5 text-sm font-medium">
          {t("count", { count: data.total })}
        </p>
      </header>
      <EventsFilters data={data} filters={f} locale={locale} />
      {data.items.length ? (
        <section
          aria-label={t("listLabel")}
          className="grid gap-5 lg:grid-cols-2"
        >
          {data.items.map((item) => (
            <EventCard item={item} key={item.id} locale={locale} />
          ))}
        </section>
      ) : (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Button asChild>
              <Link href="/memories/new">{t("empty.action")}</Link>
            </Button>
          }
        />
      )}
      <nav
        aria-label={t("paginationLabel")}
        className="flex justify-center gap-3"
      >
        {f.page > 1 && (
          <Button asChild variant="outline">
            <Link
              href={`/events?${new URLSearchParams([...base, ["page", String(f.page - 1)]])}`}
            >
              {t("previous")}
            </Link>
          </Button>
        )}
        {data.hasNext && (
          <Button asChild variant="outline">
            <Link
              href={`/events?${new URLSearchParams([...base, ["page", String(f.page + 1)]])}`}
            >
              {t("next")}
            </Link>
          </Button>
        )}
      </nav>
    </main>
  );
}
