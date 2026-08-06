import { CircleAlert, MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

type VerifyEmailStatusProps = Readonly<{
  email?: string;
}>;

export function VerifyEmailStatus({ email }: VerifyEmailStatusProps) {
  const t = useTranslations("auth.verifyEmail");

  return (
    <div className="space-y-6">
      <div
        aria-hidden
        className="border-primary/20 bg-primary/10 text-primary mx-auto grid size-24 place-items-center rounded-full border shadow-md"
      >
        <MailCheck className="size-11" strokeWidth={1.6} />
      </div>

      {email ? (
        <div
          aria-label={t("emailAriaLabel")}
          className="border-border/60 bg-background/55 rounded-lg border px-4 py-3 text-center shadow-sm backdrop-blur-xl"
        >
          <p className="text-muted-foreground text-xs font-medium">
            {t("emailLabel")}
          </p>
          <p className="mt-1 text-sm font-semibold break-all" dir="ltr">
            {email}
          </p>
        </div>
      ) : null}

      <div className="space-y-3">
        <Button
          aria-describedby="verify-email-resend-note"
          className="h-12 rounded-lg shadow-md"
          disabled
          fullWidth
          size="lg"
          type="button"
        >
          {t("resendButton")}
        </Button>
        <p
          className="text-muted-foreground text-center text-xs leading-5"
          id="verify-email-resend-note"
        >
          {t("resendPlaceholder")}
        </p>
      </div>

      <aside
        aria-label={t("spamAriaLabel")}
        className="border-border/55 bg-muted/45 flex gap-3 rounded-lg border p-4"
      >
        <CircleAlert
          aria-hidden
          className="text-primary mt-0.5 size-4 shrink-0"
        />
        <p className="text-muted-foreground text-sm leading-6">
          {t("spamNotice")}
        </p>
      </aside>

      <p className="text-center text-sm">
        <Link
          className="text-primary focus-visible:ring-ring rounded-xs font-semibold transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-offset-2"
          href="/login"
        >
          {t("differentAccountLink")}
        </Link>
      </p>
    </div>
  );
}
