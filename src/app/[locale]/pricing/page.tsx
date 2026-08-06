import type { Metadata } from "next";
import { CreditCard } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PricingExperience } from "@/features/billing/components/PricingExperience";
import { InformationPage } from "@/features/information/components/InformationPage";
import { routing } from "@/i18n/routing";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({
    locale,
    namespace: "billing.pricing.metadata",
  });
  const canonical = `https://kidmemoir.com/${locale}/pricing`;
  return {
    alternates: {
      canonical,
      languages: {
        en: "https://kidmemoir.com/en/pricing",
        tr: "https://kidmemoir.com/tr/pricing",
        "x-default": "https://kidmemoir.com/en/pricing",
      },
    },
    description: t("description"),
    metadataBase: new URL("https://kidmemoir.com"),
    openGraph: {
      description: t("description"),
      images: [
        {
          alt: t("imageAlt"),
          height: 630,
          url: `https://kidmemoir.com/${locale}/opengraph-image`,
          width: 1200,
        },
      ],
      locale: locale === "tr" ? "tr_TR" : "en_US",
      title: t("title"),
      type: "website",
      url: canonical,
    },
    title: t("title"),
    twitter: {
      card: "summary_large_image",
      description: t("description"),
      images: [`https://kidmemoir.com/${locale}/opengraph-image`],
      title: t("title"),
    },
  };
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
      title={t("title")}
    >
      <PricingExperience />
    </InformationPage>
  );
}
