import { routing, type AppLocale } from "@/i18n/routing";

export const SEO_CONFIG = {
  brand: "KidMemoir",
  defaultLocale: routing.defaultLocale,
  locales: routing.locales,
  organizationId: "https://www.kidmemoir.com/#organization",
  publisher: "KidMemoir",
  siteUrl: "https://www.kidmemoir.com",
  socialImage: (locale: AppLocale) => `/${locale}/opengraph-image`,
  websiteId: "https://www.kidmemoir.com/#website",
} as const;

export const PUBLIC_SEO_PATHS = [
  "",
  "/pricing",
  "/help",
  "/privacy",
  "/terms",
] as const;

export function normalizeSeoPath(path = ""): string {
  if (!path || path === "/") return "";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

export function absoluteUrl(path = ""): string {
  return new URL(normalizeSeoPath(path), SEO_CONFIG.siteUrl).toString();
}

export function localizedUrl(locale: AppLocale, path = ""): string {
  return absoluteUrl(`/${locale}${normalizeSeoPath(path)}`);
}
