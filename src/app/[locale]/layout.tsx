import type { Metadata, Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/Toast";
import { AuthProvider, SessionProvider } from "@/features/auth/client";
import { routing, type AppLocale } from "@/i18n/routing";
import { AnalyticsRouteTracker, GoogleAnalytics } from "@/lib/analytics";
import { ConsentBanner } from "@/lib/analytics/ConsentBanner";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = {
  applicationName: "KidMemoir",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "KidMemoir",
  },
  authors: [{ name: "KidMemoir", url: "https://www.kidmemoir.com" }],
  icons: {
    icon: [
      {
        type: "image/svg+xml",
        url: "https://www.kidmemoir.com/kidmemoir.svg",
      },
    ],
    shortcut: "https://www.kidmemoir.com/kidmemoir.svg",
    apple: [{ sizes: "180x180", url: "/apple-icon" }],
  },
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://www.kidmemoir.com"),
  openGraph: {
    images: [
      {
        alt: "KidMemoir",
        height: 630,
        url: "/en/opengraph-image",
        width: 1200,
      },
    ],
    siteName: "KidMemoir",
    title: "KidMemoir",
    type: "website",
  },
  publisher: "KidMemoir",
  robots: { follow: false, index: false, noarchive: true },
  title: {
    default: "KidMemoir",
    template: "%s | KidMemoir",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/en/opengraph-image"],
    title: "KidMemoir",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { color: "#faf9f7", media: "(prefers-color-scheme: light)" },
    { color: "#101622", media: "(prefers-color-scheme: dark)" },
  ],
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
      <head>
        <link href="https://app.lemonsqueezy.com" rel="preconnect" />
        <link href="https://app.lemonsqueezy.com" rel="dns-prefetch" />
      </head>
      <body className={GeistSans.variable}>
        <GoogleAnalytics />
        <JsonLdScript
          data={[organizationSchema(), websiteSchema(locale as AppLocale)]}
        />
        <Script
          src="https://app.lemonsqueezy.com/js/lemon.js"
          strategy="afterInteractive"
        />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <SessionProvider>
              <AuthProvider>
                {children}
                <Suspense fallback={null}>
                  <AnalyticsRouteTracker />
                </Suspense>
                <ConsentBanner />
                <Toaster />
              </AuthProvider>
            </SessionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
