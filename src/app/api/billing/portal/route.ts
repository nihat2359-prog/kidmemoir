import { NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import { lemonBillingService } from "@/features/billing/services/lemonBillingService";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

function localeFrom(value: string | null): AppLocale {
  return value && hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
}

export async function GET(request: NextRequest) {
  const locale = localeFrom(request.nextUrl.searchParams.get("locale"));
  const target = request.nextUrl.searchParams.get("target");
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url), 303);
  try {
    const supabase = await createClient();
    const subscription = await supabase
      .from("subscriptions")
      .select("provider_subscription_id")
      .eq("user_id", user.id)
      .eq("provider", "lemon")
      .single();
    if (subscription.error || !subscription.data.provider_subscription_id)
      throw new Error("Lemon subscription is unavailable");
    const urls = await lemonBillingService.getCustomerPortal(
      subscription.data.provider_subscription_id,
    );
    const destination =
      target === "payment" ? urls.updatePaymentMethod : urls.customerPortal;
    if (!destination) throw new Error("Lemon portal URL is unavailable");
    return NextResponse.redirect(destination, 303);
  } catch (error) {
    console.error("Lemon customer portal redirect failed", error);
    return NextResponse.redirect(
      new URL(`/${locale}/subscription?billing_error=portal`, request.url),
      303,
    );
  }
}
