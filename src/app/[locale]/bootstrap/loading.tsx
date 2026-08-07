import { getTranslations } from "next-intl/server";
import { Check, LockKeyhole, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";

export default async function BootstrapLoading() {
  const t = await getTranslations("bootstrap.loading");

  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="bg-background relative isolate grid min-h-svh place-items-center overflow-hidden px-4 py-12"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="landing-background-base absolute inset-0" />
        <div className="bg-primary/12 absolute -top-32 -left-28 size-96 rounded-full blur-3xl" />
        <div className="bg-ai/10 absolute -right-32 -bottom-40 size-[30rem] rounded-full blur-3xl" />
      </div>
      <section className="w-full max-w-xl text-center">
        <div className="bg-card/80 relative mx-auto mb-8 grid size-20 place-items-center rounded-[1.75rem] border shadow-xl backdrop-blur-xl">
          <div className="bg-primary/20 absolute inset-0 animate-ping rounded-[1.75rem] opacity-30" />
          <LogoMark className="relative h-12 w-11 rounded-xl" />
        </div>
        <p className="text-primary mb-3 flex items-center justify-center gap-2 text-sm font-semibold">
          <Sparkles aria-hidden className="size-4" />
          {t("eyebrow")}
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md leading-7">
          {t("description")}
        </p>
        <div className="bg-muted mx-auto mt-9 h-1.5 max-w-sm overflow-hidden rounded-full">
          <div className="bg-primary h-full w-2/3 animate-pulse rounded-full" />
        </div>
        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="bg-card/60 flex items-center gap-3 rounded-2xl border p-4 backdrop-blur">
            <span className="bg-success/12 text-success grid size-9 place-items-center rounded-xl">
              <Check aria-hidden className="size-4" />
            </span>
            <span className="text-sm font-medium">{t("preferences")}</span>
          </div>
          <div className="bg-card/60 flex items-center gap-3 rounded-2xl border p-4 backdrop-blur">
            <span className="bg-primary/12 text-primary grid size-9 place-items-center rounded-xl">
              <LockKeyhole aria-hidden className="size-4" />
            </span>
            <span className="text-sm font-medium">{t("security")}</span>
          </div>
        </div>
        <p className="text-muted-foreground mt-7 text-xs">{t("message")}</p>
      </section>
    </main>
  );
}
