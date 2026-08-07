import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { AccountPage } from "@/features/account/components/AccountPage";
import { SubscriptionOverview } from "@/features/account/components/SubscriptionOverview";
import { getAccountSubscription } from "@/features/account/services/accountService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    billing_error?: string;
    billing_status?: string;
    reason?: string;
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "account.subscription.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}
export default async function SubscriptionPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const {
    billing_error: billingError,
    billing_status: billingStatus,
    reason,
  } = await searchParams;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/subscription`);
  const [data, t] = await Promise.all([
    getAccountSubscription(user),
    getTranslations({ locale, namespace: "account.subscription" }),
  ]);
  return (
    <AccountPage
      backLabel={t("back")}
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={CreditCard}
      title={t("title")}
    >
      <SubscriptionOverview
        data={data}
        billingError={billingError ?? null}
        billingStatus={billingStatus ?? null}
        locale={locale as AppLocale}
        reason={reason === "child_limit" ? "childLimit" : null}
      />
    </AccountPage>
  );
}
