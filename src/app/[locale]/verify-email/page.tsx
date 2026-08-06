import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/layout";
import { VerifyEmailStatus } from "@/features/auth/components/verify-email";
import { routing } from "@/i18n/routing";

type VerifyEmailPageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string | string[] }>;
}>;

export async function generateMetadata({
  params,
}: VerifyEmailPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({
    locale,
    namespace: "auth.verifyEmail.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: VerifyEmailPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.verifyEmail" });
  const { email: emailParam } = await searchParams;
  const email = typeof emailParam === "string" ? emailParam : undefined;

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      title={t("title")}
    >
      <VerifyEmailStatus email={email} />
    </AuthLayout>
  );
}
