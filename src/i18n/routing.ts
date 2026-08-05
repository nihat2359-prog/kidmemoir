import { defineRouting } from "next-intl/routing";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  },
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
