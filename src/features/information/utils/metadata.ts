import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";

const siteUrl = "https://kidmemoir.com";

export function informationMetadata({
  description,
  locale,
  path,
  title,
}: {
  description: string;
  locale: AppLocale;
  path: string;
  title: string;
}): Metadata {
  const canonical = `${siteUrl}/${locale}/${path}`;
  return {
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en/${path}`,
        tr: `${siteUrl}/tr/${path}`,
        "x-default": `${siteUrl}/en/${path}`,
      },
    },
    description,
    openGraph: {
      description,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      title,
      type: "website",
      url: canonical,
    },
    title,
  };
}
