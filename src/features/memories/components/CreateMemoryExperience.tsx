import { Heart, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CreateMemoryForm } from "@/features/memories/components/CreateMemoryForm";
import type { CreateMemoryContext } from "@/features/memories/types/createMemory.types";
import type { AppLocale } from "@/i18n/routing";

export async function CreateMemoryExperience({
  context,
  locale,
}: {
  context: CreateMemoryContext;
  locale: AppLocale;
}) {
  const t = await getTranslations({ locale, namespace: "memories.create" });
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  now.setUTCDate(now.getUTCDate() + 1);
  const tomorrow = now.toISOString().slice(0, 10);
  return (
    <main className="relative min-h-svh overflow-hidden pb-12">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="bg-primary/8 absolute -top-40 -left-40 size-[34rem] rounded-full blur-3xl" />
        <div className="bg-ai/6 absolute top-1/3 -right-48 size-[38rem] rounded-full blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <header className="from-primary/12 via-card/70 to-ai/9 relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-gradient-to-br p-7 shadow-lg sm:p-12 lg:p-14 dark:border-white/10">
          <div className="relative z-10 max-w-3xl">
            <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase">
              <Sparkles aria-hidden className="size-4" />
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.96] font-semibold tracking-[-0.06em] text-balance">
              {t("title")}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
              {t("description", { name: context.child.firstName })}
            </p>
          </div>
          <Heart
            aria-hidden
            className="text-primary/6 absolute -right-16 -bottom-24 size-80 rotate-[-10deg]"
            fill="currentColor"
          />
          <div
            aria-hidden
            className="bg-primary/12 absolute -top-24 right-1/4 size-64 rounded-full blur-3xl"
          />
        </header>
        <div className="mt-10 sm:mt-14">
          <CreateMemoryForm
            context={context}
            locale={locale}
            today={today}
            tomorrow={tomorrow}
          />
        </div>
      </div>
    </main>
  );
}
