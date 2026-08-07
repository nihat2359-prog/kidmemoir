import { NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { getAccountPlan } from "@/features/account/services/accountService";
import { lemonBillingService } from "@/features/billing/services/lemonBillingService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { enforceRateLimit, requestFingerprint } from "@/lib/security/rateLimit";

function localeFrom(value: FormDataEntryValue | null): AppLocale {
  return typeof value === "string" && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
}

export async function POST(request: NextRequest) {
  const expectsJson = request.headers
    .get("accept")
    ?.includes("application/json");
  const form = await request.formData().catch(() => null);
  const locale = localeFrom(form?.get("locale") ?? null);
  const user = await getCurrentUser();
  if (!user?.email) {
    const redirectTo = `/${locale}/login?next=/subscription`;
    if (expectsJson) return NextResponse.json({ redirectTo }, { status: 401 });
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }
  const rateLimit = enforceRateLimit(requestFingerprint(request, user.id), {
    limit: 8,
    namespace: "billing-checkout",
    windowMs: 5 * 60 * 1000,
  });
  if (!rateLimit.allowed) {
    const redirectTo = `/${locale}/subscription?billing_error=checkout`;
    if (expectsJson)
      return NextResponse.json(
        { redirectTo },
        {
          headers: { "Retry-After": String(rateLimit.retryAfter) },
          status: 429,
        },
      );
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }
  try {
    if ((await getAccountPlan(user)) === "premium") {
      const redirectTo = `/${locale}/subscription`;
      if (expectsJson) return NextResponse.json({ redirectTo });
      return NextResponse.redirect(new URL(redirectTo, request.url), 303);
    }
    const checkoutUrl = await lemonBillingService.createCheckout({
      email: user.email,
      locale,
      plan: "premium",
      userId: user.id,
    });
    if (expectsJson) return NextResponse.json({ checkoutUrl });
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("Lemon checkout creation failed", error);
    const redirectTo = `/${locale}/subscription?billing_error=checkout`;
    if (expectsJson) return NextResponse.json({ redirectTo }, { status: 502 });
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }
}
