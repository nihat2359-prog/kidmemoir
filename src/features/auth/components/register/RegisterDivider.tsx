import { useTranslations } from "next-intl";

export function RegisterDivider() {
  const t = useTranslations("auth.register");

  return (
    <div className="my-7 flex items-center gap-4" role="separator">
      <span aria-hidden className="bg-border/70 h-px flex-1" />
      <span className="text-muted-foreground text-xs font-medium">
        {t("divider")}
      </span>
      <span aria-hidden className="bg-border/70 h-px flex-1" />
    </div>
  );
}
