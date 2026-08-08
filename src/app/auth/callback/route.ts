import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import {
  AUTH_RECOVERY_REDIRECTS,
  AUTH_VERIFICATION_REDIRECTS,
} from "@/features/auth/constants/routes";
import { LOCALE_COOKIE_NAME, routing, type AppLocale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

const AUTH_EVENT_COOKIE = "km_auth_event";

function resolveLocale(request: NextRequest): AppLocale {
  const requestedLocale = request.nextUrl.searchParams.get("locale");
  if (hasLocale(routing.locales, requestedLocale)) return requestedLocale;

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (hasLocale(routing.locales, cookieLocale)) return cookieLocale;

  return routing.defaultLocale;
}

function createRedirectUrl(request: NextRequest, locale: AppLocale) {
  const isRecovery = request.nextUrl.searchParams.get("flow") === "recovery";
  const pathname = isRecovery
    ? AUTH_RECOVERY_REDIRECTS.success
    : AUTH_VERIFICATION_REDIRECTS.success;

  return new URL(`/${locale}${pathname}`, request.url);
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request);
  const redirectUrl = createRedirectUrl(request, locale);
  const isRecovery = request.nextUrl.searchParams.get("flow") === "recovery";
  const isOAuth = request.nextUrl.searchParams.get("flow") === "oauth";
  const code = request.nextUrl.searchParams.get("code");
  const flowId = request.nextUrl.searchParams.get("sb_flow_id");

  if (!code) {
    if (isRecovery) redirectUrl.searchParams.set("error", "invalid_link");
    if (isOAuth) redirectUrl.searchParams.set("oauth_error", "cancelled");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(
    code,
    flowId ? { flowId } : undefined,
  );

  if (error) {
    if (isRecovery) redirectUrl.searchParams.set("error", "invalid_link");
    if (isOAuth) redirectUrl.searchParams.set("oauth_error", "sessionExpired");
    return NextResponse.redirect(redirectUrl);
  }

  if (isOAuth) {
    const provider = request.nextUrl.searchParams.get("provider");
    const safeProvider = provider === "apple" ? "apple" : "google";
    const createdAt = data.user?.created_at
      ? Date.parse(data.user.created_at)
      : Number.NaN;
    const isNewUser =
      Number.isFinite(createdAt) && Date.now() - createdAt < 5 * 60 * 1000;
    const response = NextResponse.redirect(
      new URL(`/${locale}/bootstrap`, request.url),
    );
    response.cookies.set(
      AUTH_EVENT_COOKIE,
      `${isNewUser ? "signup" : "login"}_${safeProvider}`,
      {
        httpOnly: false,
        maxAge: 120,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    );
    return response;
  }

  if (!isRecovery) {
    redirectUrl.searchParams.set("verified", "true");
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(AUTH_EVENT_COOKIE, "email_verified", {
      httpOnly: false,
      maxAge: 120,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }
  return NextResponse.redirect(redirectUrl);
}
