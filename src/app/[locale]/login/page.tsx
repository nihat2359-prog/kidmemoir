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
  searchParams: Promise<{
    reset?: string | string[];
    verified?: string | string[];
  }>;
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

export default async function LoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.login" });
  const { reset, verified } = await searchParams;

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      footer={<LoginFooter />}
      title={t("title")}
    >
      <LoginForm
        emailVerified={verified === "true"}
        passwordReset={reset === "success"}
      />
      <LoginDivider />
      <SocialLoginPlaceholders />
    </AuthLayout>
  );
}
