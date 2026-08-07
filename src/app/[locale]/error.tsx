"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { StatusPage } from "@/components/status/StatusPage";
import { Link } from "@/i18n/navigation";
import { reportException } from "@/lib/monitoring";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("statusPages.unexpected");
  useEffect(() => reportException(error, { boundary: "locale" }), [error]);
  return (
    <StatusPage
      action={
        <>
          <Button onClick={reset} size="lg">
            {t("retry")}
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">{t("home")}</Link>
          </Button>
        </>
      }
      description={t("description")}
      eyebrow={t("eyebrow")}
      title={t("title")}
      type="unexpected"
    />
  );
}
