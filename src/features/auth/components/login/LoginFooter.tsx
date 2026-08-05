import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function LoginFooter() {
  const t = useTranslations("auth.login");

  return (
    <p>
      {t("registerPrompt")}{" "}
      <Link
        className="text-primary focus-visible:ring-ring rounded-xs font-semibold transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-offset-2"
        href="/register"
      >
        {t("registerLink")}
      </Link>
    </p>
  );
}
