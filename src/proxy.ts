import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  routing,
  type AppLocale,
} from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/updateSession";

const handleI18nRouting = createMiddleware(routing);

function isAppLocale(value: string | undefined): value is AppLocale {
  return routing.locales.some((locale) => locale === value);
}

function getPathLocale(pathname: string): AppLocale | null {
  const segment = pathname.split("/")[1];
  return isAppLocale(segment) ? segment : null;
}

function getPreferredBrowserLocale(header: string | null): AppLocale | null {
  if (!header) return null;

  const preferences = header
    .split(",")
    .map((entry) => {
      const [language = "", quality = "q=1"] = entry.trim().split(";");
      return {
        locale: language.toLowerCase().split("-")[0],
        quality: Number.parseFloat(quality.replace("q=", "")) || 0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  const preference = preferences.find(({ locale }) => isAppLocale(locale));
  return isAppLocale(preference?.locale) ? preference.locale : null;
}

function detectLocale(request: NextRequest): AppLocale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isAppLocale(cookieLocale)) return cookieLocale;

  const browserLocale = getPreferredBrowserLocale(
    request.headers.get("accept-language"),
  );
  if (browserLocale) return browserLocale;

  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  return country?.toUpperCase() === "TR" ? "tr" : "en";
}

function setLocaleCookie(response: NextResponse, locale: AppLocale): void {
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    httpOnly: false,
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function copyResponseState(source: NextResponse, target: NextResponse): void {
  source.headers.forEach((value, key) => {
    if (key !== "set-cookie") target.headers.set(key, value);
  });
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
}

function stripLocale(pathname: string, locale: AppLocale): string {
  const stripped = pathname.slice(locale.length + 1);
  return stripped || "/";
}

function localizeRedirect(
  location: string,
  request: NextRequest,
  locale: AppLocale,
) {
  const url = new URL(location, request.url);
  if (url.origin === request.nextUrl.origin && !getPathLocale(url.pathname)) {
    url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  }
  return url;
}

export async function proxy(request: NextRequest) {
  const pathLocale = getPathLocale(request.nextUrl.pathname);

  if (!pathLocale) {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
    const response = NextResponse.redirect(url);
    setLocaleCookie(response, locale);
    return response;
  }

  const authUrl = request.nextUrl.clone();
  authUrl.pathname = stripLocale(request.nextUrl.pathname, pathLocale);
  const authRequest = new Request(authUrl, request);
  const authResponse = await updateSession(new NextRequest(authRequest));

  if (authResponse.headers.has("location")) {
    const response = NextResponse.redirect(
      localizeRedirect(
        authResponse.headers.get("location")!,
        request,
        pathLocale,
      ),
      authResponse.status,
    );
    authResponse.cookies
      .getAll()
      .forEach((cookie) => response.cookies.set(cookie));
    setLocaleCookie(response, pathLocale);
    return response;
  }

  const intlResponse = handleI18nRouting(request);
  copyResponseState(intlResponse, authResponse);
  setLocaleCookie(authResponse, pathLocale);
  return authResponse;
}

export const config = {
  matcher: [
    "/((?!api|auth/callback|auth/login|auth/recovery-prepare|auth/recovery-confirm|_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
