import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  AdminHeroGenerator,
  listHeroGeneratorOptions,
} from "@/features/programmatic-seo/hero-generator";
import { userHasPermission } from "@/features/auth/utils/authorization";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function HeroGuidesAdminPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!userHasPermission(user, "admin:write")) notFound();
  const options = await listHeroGeneratorOptions(locale as AppLocale);
  return (
    <AdminHeroGenerator
      locale={locale as "tr" | "en"}
      templates={options.templates}
      topics={options.topics}
    />
  );
}
