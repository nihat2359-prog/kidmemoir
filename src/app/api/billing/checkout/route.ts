import { NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { getAccountPlan } from "@/features/account/services/accountService";
import { lemonBillingService } from "@/features/billing/services/lemonBillingService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

function localeFrom(value: FormDataEntryValue | null): AppLocale {
  return typeof value === "string" && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const locale = localeFrom(form?.get("locale") ?? null);
  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?next=/subscription`, request.url),
      303,
    );
  }
  try {
    if ((await getAccountPlan(user)) === "premium")
      return NextResponse.redirect(
        new URL(`/${locale}/subscription`, request.url),
        303,
      );
    const checkoutUrl = await lemonBillingService.createCheckout({
      email: user.email,
      locale,
      plan: "premium",
      userId: user.id,
    });
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("Lemon checkout creation failed", error);
    return NextResponse.redirect(
      new URL(`/${locale}/subscription?billing_error=checkout`, request.url),
      303,
    );
  }
}
