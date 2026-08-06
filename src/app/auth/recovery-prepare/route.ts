import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import {
  getRecoveryTokenCookieOptions,
  RECOVERY_CONFIRMATION_COOKIE_NAME,
} from "@/features/auth/constants/recovery";
import { routing, type AppLocale } from "@/i18n/routing";

function resolveLocale(request: NextRequest): AppLocale {
  const locale = request.nextUrl.searchParams.get("locale");
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

export function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const token = request.nextUrl.searchParams.get("token");
  const type = request.nextUrl.searchParams.get("type");

  if (!token || !/^\d{6,8}$/.test(token) || type !== "recovery") {
    return NextResponse.redirect(
      new URL(`/${locale}/reset-password?error=invalid_link`, request.url),
    );
  }

  const response = NextResponse.redirect(
    new URL(`/${locale}/recovery-confirm`, request.url),
  );
  response.cookies.set(
    RECOVERY_CONFIRMATION_COOKIE_NAME,
    token,
    getRecoveryTokenCookieOptions(),
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
