import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export function Brand() {
  const t = useTranslations("landing.brand");

  return (
    <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight">
      <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md shadow-sm">
        <Heart aria-hidden className="size-4" fill="currentColor" />
      </span>
      {t("name")}
    </span>
  );
}
