import { getTranslations } from "next-intl/server";
import { Spinner } from "@/components/ui/Spinner";

export default async function BootstrapLoading() {
  const t = await getTranslations("bootstrap.loading");

  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="bg-background grid min-h-svh place-items-center px-4"
    >
      <div className="text-muted-foreground flex items-center gap-3 text-sm">
        <Spinner aria-hidden />
        <span>{t("message")}</span>
      </div>
    </main>
  );
}
