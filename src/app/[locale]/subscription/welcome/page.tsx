import type { Metadata } from "next";
import { Crown } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BillingStatusPage } from "@/features/billing/components/BillingStatusPage";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = { robots: { follow: false, index: false } };
export default async function PremiumWelcomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "billing.results.welcome",
  });
  return (
    <BillingStatusPage
      action={t("action")}
      actionHref="/dashboard"
      description={t("description")}
      icon={Crown}
      note={t("note")}
      title={t("title")}
    />
  );
}
