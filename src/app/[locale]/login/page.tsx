import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  LoginDivider,
  LoginFooter,
  LoginForm,
  SocialLoginPlaceholders,
} from "@/features/auth/components/login";
import { AuthLayout } from "@/features/auth/components/layout";
import { routing } from "@/i18n/routing";

type LoginPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "auth.login.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.login" });

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      footer={<LoginFooter />}
      title={t("title")}
    >
      <LoginForm />
      <LoginDivider />
      <SocialLoginPlaceholders />
    </AuthLayout>
  );
}
