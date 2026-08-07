import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LandingPage } from "@/features/landing";
import { routing } from "@/i18n/routing";

const siteUrl = "https://www.kidmemoir.com";

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "landing.seo" });
  const canonical = `${siteUrl}/${locale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en`,
        tr: `${siteUrl}/tr`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: t("openGraphTitle"),
      description: t("openGraphDescription"),
      images: [
        {
          alt: "KidMemoir",
          height: 630,
          url: `${siteUrl}/${locale}/opengraph-image`,
          width: 1200,
        },
      ],
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"],
      siteName: "KidMemoir",
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
      images: [`${siteUrl}/${locale}/opengraph-image`],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing.seo" });
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "KidMemoir",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    description: t("description"),
    inLanguage: locale,
    offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <LandingPage />
    </>
  );
}
