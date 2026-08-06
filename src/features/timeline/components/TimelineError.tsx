"use client";
import { CircleAlert, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
export function TimelineError({ reset }: { reset: () => void }) {
  const t = useTranslations("timeline.error");
  return (
    <main className="mx-auto grid min-h-[60svh] max-w-2xl place-items-center px-4">
      <section className="bg-card w-full rounded-[2rem] border p-8 text-center shadow-sm">
        <CircleAlert aria-hidden className="text-danger mx-auto size-10" />
        <h1 className="mt-5 text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
        <Button
          className="mt-6"
          icon={<RotateCcw aria-hidden />}
          onClick={reset}
        >
          {t("action")}
        </Button>
      </section>
    </main>
  );
}
