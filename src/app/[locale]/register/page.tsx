import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/layout";
import {
  RegisterDivider,
  RegisterFooter,
  RegisterForm,
  SocialRegisterPlaceholders,
} from "@/features/auth/components/register";
import { routing } from "@/i18n/routing";

type RegisterPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({
    locale,
    namespace: "auth.register.metadata",
  });
  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auth.register" });

  return (
    <AuthLayout
      description={t("description")}
      eyebrow={t("eyebrow")}
      footer={<RegisterFooter />}
      title={t("title")}
    >
      <RegisterForm />
      <RegisterDivider />
      <SocialRegisterPlaceholders />
    </AuthLayout>
  );
}
