import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PricingExperience } from "@/features/billing/components/PricingExperience";
import { InformationPage } from "@/features/information/components/InformationPage";
import { routing } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "billing.pricing.metadata",
  });
  return buildMetadata({
    description: t("description"),
    imageAlt: t("imageAlt"),
    locale: locale as AppLocale,
    path: "/pricing",
    title: t("title"),
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "billing.pricing" });
  return (
    <InformationPage
      backLabel={t("back")}
      backHref="/"
      description={t("description")}
      eyebrow={t("eyebrow")}
      icon={CreditCard}
      seoPath="/pricing"
      title={t("title")}
    >
      <PricingExperience />
    </InformationPage>
  );
}
