import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { CreateChildExperience } from "@/features/children";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

type CreateChildPageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({
  params,
}: CreateChildPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "children.create.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function CreateChildPage({
  params,
}: CreateChildPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/children/new`);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .select("id")
    .eq("user_id", user.id)
    .is("archived_at", null)
    .limit(1);
  if (error)
    throw new Error("First child eligibility check failed", { cause: error });
  if (data.length > 0) redirect(`/${locale}/dashboard`);

  return <CreateChildExperience locale={locale} />;
}
