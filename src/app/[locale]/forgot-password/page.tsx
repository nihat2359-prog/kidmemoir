import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password";
import { AuthLayout } from "@/features/auth/components/layout";
import { routing } from "@/i18n/routing";

type ForgotPasswordPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: ForgotPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({
    locale,
    namespace: "auth.forgotPassword.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.forgotPassword" });

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      title={t("title")}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
