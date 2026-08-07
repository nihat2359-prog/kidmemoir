import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { DashboardExperience, getDashboardData } from "@/features/dashboard";
import { DashboardError } from "@/features/dashboard/components/DashboardError";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

export const maxDuration = 60;

type DashboardPageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "dashboard.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/dashboard`);

  let data;
  try {
    data = await getDashboardData(user);
  } catch (error) {
    console.error("Dashboard loading failed", error);
    return <DashboardError locale={locale} />;
  }

  if (!data.child) redirect(`/${locale}/onboarding`);
  return (
    <DashboardExperience
      data={{ ...data, child: data.child }}
      locale={locale}
    />
  );
}
