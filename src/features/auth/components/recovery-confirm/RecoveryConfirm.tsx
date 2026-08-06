import { ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { HiddenField } from "@/components/ui/HiddenField";
import { Input } from "@/components/ui/Input";
import { Link } from "@/i18n/navigation";

export function RecoveryConfirm() {
  const locale = useLocale();
  const t = useTranslations("auth.recoveryConfirm");

  return (
    <div className="space-y-6">
      <div
        aria-hidden
        className="border-primary/20 bg-primary/10 text-primary mx-auto grid size-24 place-items-center rounded-full border shadow-md"
      >
        <ShieldCheck className="size-11" strokeWidth={1.6} />
      </div>

      <aside
        aria-label={t("securityNoteAriaLabel")}
        className="border-border/55 bg-muted/45 rounded-lg border p-4"
      >
        <p className="text-muted-foreground text-center text-sm leading-6">
          {t("securityNote")}
        </p>
      </aside>

      <form action="/auth/recovery-confirm" method="post">
        <HiddenField name="locale" value={locale} />
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="recovery-email">
            {t("emailLabel")}
          </label>
          <Input
            autoComplete="email"
            id="recovery-email"
            name="email"
            placeholder={t("emailPlaceholder")}
            required
            type="email"
          />
        </div>
        <Button className="mt-5 h-12 rounded-lg shadow-md" fullWidth size="lg">
          {t("submit")}
        </Button>
      </form>

      <p className="text-center text-sm">
        <Link
          className="text-primary focus-visible:ring-ring rounded-xs font-semibold transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-offset-2"
          href="/forgot-password"
        >
          {t("requestNewLink")}
        </Link>
      </p>
    </div>
  );
}
