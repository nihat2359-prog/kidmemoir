import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ensureApplicationBootstrap } from "@/features/bootstrap";
import type { BootstrapDestination } from "@/features/bootstrap";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/supabase/auth";

type BootstrapPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

const MINIMUM_BOOTSTRAP_DURATION_MS = 900;

export async function generateMetadata({
  params,
}: BootstrapPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "bootstrap.metadata" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { follow: false, index: false },
  };
}

export default async function BootstrapPage({ params }: BootstrapPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/bootstrap`);

  let destination: BootstrapDestination | null = null;

  try {
    const requestHeaders = await headers();
    [destination] = await Promise.all([
      ensureApplicationBootstrap({
        acceptLanguage: requestHeaders.get("accept-language"),
        locale,
        user,
        userAgent: requestHeaders.get("user-agent"),
      }),
      new Promise((resolve) =>
        setTimeout(resolve, MINIMUM_BOOTSTRAP_DURATION_MS),
      ),
    ]);
  } catch (error) {
    console.error("Application bootstrap failed", error);
  }

  if (destination) {
    redirect(`/${locale}${destination}`);
  }

  const t = await getTranslations({ locale, namespace: "bootstrap.error" });
  return (
    <main className="bg-background grid min-h-svh place-items-center px-4 py-12">
      <section
        aria-labelledby="bootstrap-error-title"
        className="w-full max-w-lg space-y-6"
      >
        <Alert variant="danger">
          <CircleAlert aria-hidden />
          <AlertTitle id="bootstrap-error-title">{t("title")}</AlertTitle>
          <AlertDescription>{t("description")}</AlertDescription>
        </Alert>
        <Button asChild fullWidth size="lg">
          <Link href="/bootstrap">{t("retry")}</Link>
        </Button>
      </section>
    </main>
  );
}
