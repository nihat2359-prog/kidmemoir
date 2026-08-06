import { Baby } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { AccountPage } from "@/features/account/components/AccountPage";
import { EditChildForm } from "@/features/account/components/EditChildForm";
import { getEditableChild } from "@/features/account/services/accountService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
export default async function EditChildPage({
  params,
}: {
  params: Promise<{ childId: string; locale: string }>;
}) {
  const { childId, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/children/${childId}/edit`);
  const [child, t] = await Promise.all([
    getEditableChild(user, childId),
    getTranslations({ locale, namespace: "account.children.edit" }),
  ]);
  if (!child) notFound();
  return (
    <AccountPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={Baby}
      title={t("title")}
    >
      <EditChildForm child={child} locale={locale as AppLocale} />
    </AccountPage>
  );
}
