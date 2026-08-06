import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import {
  getRecoveryTokenCookieOptions,
  getRecoveryVerifiedCookieOptions,
  RECOVERY_CONFIRMATION_COOKIE_NAME,
  RECOVERY_VERIFIED_COOKIE_NAME,
} from "@/features/auth/constants/recovery";
import { routing, type AppLocale } from "@/i18n/routing";
import { getClientEnvironment } from "@/lib/env/client";
import type { CookieToSet } from "@/lib/supabase/cookies";
import type { Database } from "@/types/database.types";

function resolveLocale(value: FormDataEntryValue | null): AppLocale {
  return typeof value === "string" && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
}

function clearRecoveryToken(response: NextResponse) {
  response.cookies.set(RECOVERY_CONFIRMATION_COOKIE_NAME, "", {
    ...getRecoveryTokenCookieOptions(),
    maxAge: 0,
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const locale = resolveLocale(formData.get("locale"));
  const emailValue = formData.get("email");
  const email = typeof emailValue === "string" ? emailValue.trim() : "";
  const token = request.cookies.get(RECOVERY_CONFIRMATION_COOKIE_NAME)?.value;
  const resetUrl = new URL(`/${locale}/reset-password`, request.url);

  if (!token || !/^\d{6,8}$/.test(token) || !/^\S+@\S+\.\S+$/.test(email)) {
    resetUrl.searchParams.set("error", "invalid_link");
    resetUrl.searchParams.set("reason", "invalid_recovery_data");
    return NextResponse.redirect(resetUrl, 303);
  }

  const environment = getClientEnvironment();
  const authCookies: CookieToSet[] = [];
  const supabase = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          authCookies.push(...cookiesToSet);
        },
      },
    },
  );
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (error || !data.session) {
    resetUrl.searchParams.set("error", "invalid_link");
    resetUrl.searchParams.set("reason", error?.code ?? "missing_session");
  }

  const response = NextResponse.redirect(resetUrl, 303);
  authCookies.forEach(({ name, options, value }) => {
    response.cookies.set(name, value, options);
  });
  if (!error && data.session) {
    response.cookies.set(
      RECOVERY_VERIFIED_COOKIE_NAME,
      "true",
      getRecoveryVerifiedCookieOptions(),
    );
  }
  clearRecoveryToken(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
