import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password";
import { routing } from "@/i18n/routing";

type ResetPasswordPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: ResetPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({
    locale,
    namespace: "auth.resetPassword.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.resetPassword" });

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      title={t("title")}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
