import type { Metadata } from "next";
import Link from "next/link";
import packageJson from "../../../../../package.json";
import { Download, Info, LockKeyhole, Settings } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  AccountPage,
  AccountSection,
} from "@/features/account/components/AccountPage";
import { AccountDeletionPanel } from "@/features/account/components/AccountDeletionPanel";
import { SettingsForm } from "@/features/account/components/SettingsForm";
import { getAccountSettings } from "@/features/account/services/accountService";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { ConsentPreferencesButton } from "@/lib/analytics/ConsentPreferencesButton";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "account.settings.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/settings`);
  const [settings, t] = await Promise.all([
    getAccountSettings(user),
    getTranslations({ locale, namespace: "account.settings" }),
  ]);
  return (
    <AccountPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={Settings}
      title={t("title")}
    >
      <div className="space-y-6">
        <AccountSection title={t("preferencesTitle")}>
          <SettingsForm settings={settings} />
        </AccountSection>
        <AccountSection
          description={t("privacy.description")}
          title={t("privacy.title")}
        >
          <div className="flex items-center gap-3">
            <LockKeyhole aria-hidden className="text-primary size-5" />
            <p className="text-sm">{t("privacy.message")}</p>
          </div>
          <ConsentPreferencesButton />
        </AccountSection>
        <AccountSection
          description={t("export.description")}
          title={t("export.title")}
        >
          <Button asChild icon={<Download aria-hidden />} variant="outline">
            <Link download href="/api/account/export" prefetch={false}>
              {t("export.action")}
            </Link>
          </Button>
        </AccountSection>
        <AccountSection title={t("about.title")}>
          <div className="flex items-center gap-3">
            <Info aria-hidden className="text-primary size-5" />
            <p>{t("about.version", { version: packageJson.version })}</p>
          </div>
        </AccountSection>
        <AccountDeletionPanel />
      </div>
    </AccountPage>
  );
}
