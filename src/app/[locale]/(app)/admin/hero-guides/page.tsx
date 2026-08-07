import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  AdminHeroGenerator,
  listHeroGuideDrafts,
  listHeroGeneratorOptions,
} from "@/features/programmatic-seo/hero-generator";
import { userHasPermission } from "@/features/auth/utils/authorization";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export default async function HeroGuidesAdminPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!userHasPermission(user, "admin:write")) notFound();
  const [options, drafts] = await Promise.all([
    listHeroGeneratorOptions(locale as AppLocale),
    listHeroGuideDrafts(locale as AppLocale),
  ]);
  return (
    <AdminHeroGenerator
      locale={locale as "tr" | "en"}
      drafts={drafts}
      templates={options.templates}
      topics={options.topics}
    />
  );
}
