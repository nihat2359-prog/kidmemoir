import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import {
  AccountPage,
  AccountSection,
} from "@/features/account/components/AccountPage";
import { AccountDeletionPanel } from "@/features/account/components/AccountDeletionPanel";
import { AvatarUploader } from "@/features/account/components/AvatarUploader";
import { ProfileForm } from "@/features/account/components/ProfileForm";
import { getAccountProfile } from "@/features/account/services/accountService";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "account.profile.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/profile`);
  const [profile, t] = await Promise.all([
    getAccountProfile(user),
    getTranslations({ locale, namespace: "account.profile" }),
  ]);
  const name = [profile.firstName, profile.lastName].join(" ");
  return (
    <AccountPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={UserRound}
      title={t("title")}
    >
      <div className="space-y-6">
        <AccountSection
          description={t("avatar.sectionDescription")}
          title={t("avatar.sectionTitle")}
        >
          <AvatarUploader imageUrl={profile.avatarUrl} name={name} />
        </AccountSection>
        <AccountSection title={t("information")}>
          <ProfileForm profile={profile} />
        </AccountSection>
        <AccountDeletionPanel />
      </div>
    </AccountPage>
  );
}
