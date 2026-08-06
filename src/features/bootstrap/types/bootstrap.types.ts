import type { User } from "@supabase/supabase-js";
import type { AppLocale } from "@/i18n/routing";

export type BootstrapContext = Readonly<{
  acceptLanguage: string | null;
  locale: AppLocale;
  user: User;
  userAgent: string | null;
}>;

export type BootstrapDestination = "/dashboard" | "/onboarding";
