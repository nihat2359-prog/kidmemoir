import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import {
  absoluteUrl,
  localizedUrl,
  normalizeSeoPath,
  SEO_CONFIG,
} from "@/lib/seo/config";

type MetadataInput = Readonly<{
  alternatePaths?: Partial<Record<AppLocale, string>>;
  locale: AppLocale;
  title: string;
  description: string;
  path?: string;
  keywords?: readonly string[];
  imageAlt?: string;
  index?: boolean;
  openGraphTitle?: string;
  openGraphDescription?: string;
  type?: "website" | "article";
}>;

function languageAlternates(
  path: string,
  alternatePaths?: Partial<Record<AppLocale, string>>,
) {
  const locales = alternatePaths
    ? routing.locales.filter((locale) => alternatePaths[locale])
    : routing.locales;
  const defaultLocale = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : locales[0];
  return Object.fromEntries([
    ...locales.map((locale) => [
      locale,
      localizedUrl(locale, alternatePaths?.[locale] ?? path),
    ]),
    ...(defaultLocale
      ? [
          [
            "x-default",
            localizedUrl(
              defaultLocale,
              alternatePaths?.[defaultLocale] ?? path,
            ),
          ],
        ]
      : []),
  ]);
}

export function buildMetadata({
  alternatePaths,
  description,
  imageAlt = SEO_CONFIG.brand,
  index = true,
  keywords,
  locale,
  openGraphDescription,
  openGraphTitle,
  path = "",
  title,
  type = "website",
}: MetadataInput): Metadata {
  const normalizedPath = normalizeSeoPath(path);
  const canonical = localizedUrl(locale, normalizedPath);
  const image = absoluteUrl(SEO_CONFIG.socialImage(locale));
  const alternateLocales = routing.locales
    .filter((item) => item !== locale)
    .map((item) => (item === "tr" ? "tr_TR" : "en_US"));

  return {
    alternates: {
      canonical,
      languages: languageAlternates(normalizedPath, alternatePaths),
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: SEO_CONFIG.brand,
    },
    appLinks: {
      web: { should_fallback: true, url: canonical },
    },
    applicationName: SEO_CONFIG.brand,
    authors: [{ name: SEO_CONFIG.brand, url: SEO_CONFIG.siteUrl }],
    category: "lifestyle",
    description,
    keywords: keywords ? [...keywords] : undefined,
    openGraph: {
      alternateLocale: alternateLocales,
      description: openGraphDescription ?? description,
      images: [{ alt: imageAlt, height: 630, url: image, width: 1200 }],
      locale: locale === "tr" ? "tr_TR" : "en_US",
      siteName: SEO_CONFIG.brand,
      title: openGraphTitle ?? title,
      type,
      url: canonical,
    },
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "msapplication-TileColor": "#101622",
    },
    publisher: SEO_CONFIG.publisher,
    robots: index
      ? {
          follow: true,
          googleBot: {
            follow: true,
            index: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
          index: true,
        }
      : { follow: false, index: false, noarchive: true, noimageindex: true },
    title,
    twitter: {
      card: "summary_large_image",
      description: openGraphDescription ?? description,
      images: [image],
      title: openGraphTitle ?? title,
    },
  };
}

export function buildPrivateMetadata(title?: string): Metadata {
  return {
    robots: {
      follow: false,
      index: false,
      noarchive: true,
      noimageindex: true,
    },
    title,
  };
}
