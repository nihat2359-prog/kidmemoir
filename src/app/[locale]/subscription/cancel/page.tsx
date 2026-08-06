import type { Metadata } from "next";
import { CircleX } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BillingStatusPage } from "@/features/billing/components/BillingStatusPage";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = { robots: { follow: false, index: false } };
export default async function SubscriptionCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: "billing.results.cancel",
  });
  return (
    <BillingStatusPage
      action={t("action")}
      description={t("description")}
      icon={CircleX}
      note={t("note")}
      title={t("title")}
    />
  );
}
