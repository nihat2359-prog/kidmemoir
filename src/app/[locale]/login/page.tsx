import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LoginFooter, LoginForm } from "@/features/auth/components/login";
import { AuthLayout } from "@/features/auth/components/layout";
import {
  EmailAuthDisclosure,
  OAuthButtons,
} from "@/features/auth/components/OAuthButtons";
import { routing } from "@/i18n/routing";

type LoginPageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    reset?: string | string[];
    verified?: string | string[];
    oauth_error?: string | string[];
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
  const { oauth_error: oauthError, reset, verified } = await searchParams;
  const safeOAuthError =
    oauthError === "cancelled" || oauthError === "sessionExpired"
      ? oauthError
      : undefined;

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      footer={<LoginFooter />}
      title={t("title")}
    >
      <div className="space-y-5">
        <OAuthButtons initialError={safeOAuthError} />
        <EmailAuthDisclosure
          initialOpen={verified === "true" || reset === "success"}
        >
          <LoginForm
            emailVerified={verified === "true"}
            passwordReset={reset === "success"}
          />
        </EmailAuthDisclosure>
      </div>
    </AuthLayout>
  );
}
