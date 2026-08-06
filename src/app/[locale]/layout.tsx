import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/Toast";
import { AuthProvider, SessionProvider } from "@/features/auth/client";
import { routing, type AppLocale } from "@/i18n/routing";
import "@/styles/globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        type: "image/svg+xml",
        url: "https://kidmemoir.com/kidmemoir.svg",
      },
    ],
    shortcut: "https://kidmemoir.com/kidmemoir.svg",
  },
  metadataBase: new URL("https://kidmemoir.com"),
  title: {
    default: "KidMemoir",
    template: "%s | KidMemoir",
  },
};

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams(): Array<{ locale: AppLocale }> {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={GeistSans.variable}>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SessionProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </SessionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
