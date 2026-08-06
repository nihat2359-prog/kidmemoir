import type { ReactNode } from "react";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { AppShell, getAppShellData } from "@/features/app-shell";
import { routing, type AppLocale } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

type AuthenticatedLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function AuthenticatedLayout({
  children,
  params,
}: AuthenticatedLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/bootstrap`);

  let data;
  try {
    data = await getAppShellData(user, locale as AppLocale);
  } catch (error) {
    console.error("Application shell loading failed", error);
    throw error;
  }
  return <AppShell data={data}>{children}</AppShell>;
}
