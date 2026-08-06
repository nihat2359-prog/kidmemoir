import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { OnboardingExperience } from "@/features/onboarding";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type OnboardingPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: OnboardingPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "onboarding.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/onboarding`);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .select("id")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .limit(1);

  if (error) {
    throw new Error("Onboarding eligibility check failed", { cause: error });
  }
  if (data.length > 0) redirect(`/${locale}/dashboard`);

  return <OnboardingExperience locale={locale} />;
}
