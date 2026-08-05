import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function RegisterFooter() {
  const t = useTranslations("auth.register");

  return (
    <p>
      {t("loginPrompt")}{" "}
      <Link
        className="text-primary focus-visible:ring-ring rounded-xs font-semibold transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-offset-2"
        href="/login"
      >
        {t("loginLink")}
      </Link>
    </p>
  );
}
