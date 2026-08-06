import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/LogoMark";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AuthLogoProps = Readonly<{
  className?: string;
}>;

export function AuthLogo({ className }: AuthLogoProps) {
  const t = useTranslations("auth.layout");

  return (
    <Link
      aria-label={t("homeAriaLabel")}
      className={cn(
        "focus-visible:ring-ring inline-flex w-fit items-center gap-2.5 rounded-md text-base font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      href="/"
    >
      <LogoMark className="h-10 w-9 rounded-md" />
      <span>{t("brandName")}</span>
    </Link>
  );
}
