import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import {
  CreateMemoryExperience,
  getCreateMemoryContext,
} from "@/features/memories";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

type PageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "memories.create.metadata",
  });
  return {
    description: t("description"),
    robots: { follow: false, index: false },
    title: t("title"),
  };
}

export default async function CreateMemoryPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/memories/new`);
  const context = await getCreateMemoryContext(user);
  if (!context) redirect(`/${locale}/onboarding`);
  return (
    <CreateMemoryExperience context={context} locale={locale as AppLocale} />
  );
}
