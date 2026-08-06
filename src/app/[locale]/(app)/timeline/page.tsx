import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import {
  getTimelineScreenData,
  parseTimelineFilters,
  TimelineExperience,
} from "@/features/timeline";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "timeline.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function TimelinePage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/timeline`);
  const filters = parseTimelineFilters(await searchParams);
  const data = await getTimelineScreenData(user, filters);
  if (!data) redirect(`/${locale}/onboarding`);
  return (
    <TimelineExperience
      data={data}
      filters={filters}
      locale={locale as AppLocale}
    />
  );
}
