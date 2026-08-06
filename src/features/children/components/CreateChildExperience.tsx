import { Heart, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AuthLogo } from "@/features/auth/components/layout";
import { CreateChildForm } from "@/features/children/components/CreateChildForm";
import type { AppLocale } from "@/i18n/routing";

export async function CreateChildExperience({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "children.create" });

  return (
    <main className="bg-background relative isolate min-h-svh overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="landing-background-base absolute inset-0" />
        <div className="bg-primary/12 absolute -top-48 -left-40 size-[32rem] rounded-full blur-3xl" />
        <div className="bg-ai/8 absolute top-1/3 -right-48 size-[34rem] rounded-full blur-3xl" />
        <div className="landing-background-grid absolute inset-0 opacity-25 dark:opacity-15" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <AuthLogo />
        <section
          className="grid gap-10 py-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(32rem,1.22fr)] lg:gap-16 lg:py-14"
          aria-labelledby="create-child-title"
        >
          <div className="lg:sticky lg:top-14 lg:self-start">
            <p className="text-primary text-sm font-semibold tracking-wide">
              {t("eyebrow")}
            </p>
            <h1
              className="mt-4 text-4xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-5xl"
              id="create-child-title"
            >
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7 text-pretty sm:text-lg">
              {t("description")}
            </p>
            <div className="border-border/70 bg-background/60 mt-8 rounded-2xl border p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
                  <ShieldCheck aria-hidden className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{t("privacy.title")}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">
                    {t("privacy.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-border/70 bg-card/75 rounded-3xl border p-5 shadow-lg backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <span className="from-primary to-ai text-primary-foreground grid size-11 place-items-center rounded-xl bg-gradient-to-br shadow-sm">
                <Heart aria-hidden className="size-5" fill="currentColor" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">{t("formTitle")}</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  {t("formDescription")}
                </p>
              </div>
            </div>
            <CreateChildForm locale={locale} />
          </div>
        </section>
      </div>
    </main>
  );
}
