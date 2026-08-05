import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthLogo } from "@/features/auth/components/layout/AuthLogo";

export function AuthBrand() {
  const t = useTranslations("auth.layout");

  return (
    <header className="max-w-xl">
      <AuthLogo />
      <p className="text-primary mt-12 flex items-center gap-2 text-sm font-medium">
        <ShieldCheck aria-hidden className="size-4" />
        {t("eyebrow")}
      </p>
      <h2 className="mt-5 text-4xl font-semibold tracking-tight text-balance xl:text-5xl">
        {t("brandTitle")}
      </h2>
      <p className="text-muted-foreground mt-5 max-w-lg text-base leading-7 text-pretty">
        {t("brandDescription")}
      </p>
    </header>
  );
}
