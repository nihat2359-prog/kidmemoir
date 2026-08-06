import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/LogoMark";

export function Brand() {
  const t = useTranslations("landing.brand");

  return (
    <span className="inline-flex items-center gap-2 text-base font-semibold tracking-tight">
      <LogoMark className="h-9 w-8 rounded-md" />
      <span>{t("name")}</span>
    </span>
  );
}
