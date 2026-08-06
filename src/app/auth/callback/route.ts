import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import {
  AUTH_RECOVERY_REDIRECTS,
  AUTH_VERIFICATION_REDIRECTS,
} from "@/features/auth/constants/routes";
import { LOCALE_COOKIE_NAME, routing, type AppLocale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

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
  const code = request.nextUrl.searchParams.get("code");
  const flowId = request.nextUrl.searchParams.get("sb_flow_id");

  if (!code) {
    if (isRecovery) redirectUrl.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(redirectUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(
    code,
    flowId ? { flowId } : undefined,
  );

  if (error) {
    if (isRecovery) redirectUrl.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(redirectUrl);
  }

  if (!isRecovery) redirectUrl.searchParams.set("verified", "true");
  return NextResponse.redirect(redirectUrl);
}
