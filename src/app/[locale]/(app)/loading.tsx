import { getTranslations } from "next-intl/server";
import { Skeleton } from "@/components/ui/Skeleton";

export default async function ApplicationLoading() {
  const t = await getTranslations("applicationShell.loading");

  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="bg-primary fixed inset-x-0 top-0 z-50 h-0.5 animate-pulse" />
        <p className="sr-only">{t("message")}</p>
        <section className="bg-card/70 overflow-hidden rounded-[2rem] border p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="size-16 shrink-0 rounded-2xl sm:size-20" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-full max-w-md" />
              <Skeleton className="h-4 w-full max-w-xl" />
            </div>
          </div>
        </section>
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <Skeleton className="h-72 rounded-[2rem] lg:col-span-8" />
          <Skeleton className="h-72 rounded-[2rem] lg:col-span-4" />
          <Skeleton className="h-64 rounded-[2rem] lg:col-span-5" />
          <Skeleton className="h-64 rounded-[2rem] lg:col-span-7" />
        </div>
      </div>
    </main>
  );
}
