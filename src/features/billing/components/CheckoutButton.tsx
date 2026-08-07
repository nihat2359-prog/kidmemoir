import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export function CheckoutButton({
  className,
  fullWidth = false,
  label,
  locale,
  size = "lg",
}: {
  className?: string;
  fullWidth?: boolean;
  label: string;
  locale: AppLocale;
  size?: "md" | "lg";
}) {
  return (
    <form action="/api/billing/checkout" method="post">
      <input name="locale" type="hidden" value={locale} />
      <Button
        className={className}
        fullWidth={fullWidth}
        size={size}
        type="submit"
      >
        {label}
      </Button>
    </form>
  );
}
