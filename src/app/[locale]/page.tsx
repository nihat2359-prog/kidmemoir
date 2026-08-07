import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LandingPage } from "@/features/landing";
import { routing } from "@/i18n/routing";
import { JsonLdScript } from "@/components/seo/JsonLd";
import {
  buildMetadata,
  softwareApplicationSchema,
  webpageSchema,
} from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

type HomePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "landing.seo" });
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    locale: locale as AppLocale,
    openGraphDescription: t("openGraphDescription"),
    openGraphTitle: t("openGraphTitle"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "landing.seo" });
  const appLocale = locale as AppLocale;

  return (
    <>
      <JsonLdScript
        data={[
          webpageSchema({
            description: t("description"),
            locale: appLocale,
            name: t("title"),
          }),
          softwareApplicationSchema({
            description: t("description"),
            locale: appLocale,
          }),
        ]}
      />
      <LandingPage />
    </>
  );
}
