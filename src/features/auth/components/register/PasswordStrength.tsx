import { useTranslations } from "next-intl";
import {
  getPasswordStrength,
  type PasswordStrengthLevel,
} from "@/features/auth/utils/passwordStrength";

const strengthColors: Record<PasswordStrengthLevel, string> = {
  weak: "bg-danger",
  fair: "bg-warning",
  good: "bg-info",
  strong: "bg-success",
};

const segments = [0, 1, 2, 3] as const;

type PasswordStrengthProps = Readonly<{
  password: string;
}>;

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const t = useTranslations("auth.register");
  const strength = getPasswordStrength(password);
  const label = strength.level
    ? t(`passwordStrength.${strength.level}`)
    : t("passwordStrength.pending");

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="space-y-2"
      id="register-password-strength"
      role="status"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs">
          {t("passwordStrengthLabel")}
        </span>
        <span className="text-muted-foreground text-xs">{label}</span>
      </div>
      <div aria-hidden className="grid grid-cols-4 gap-1.5">
        {segments.map((segment) => (
          <span
            className={`h-1 rounded-full transition-colors ${
              segment < strength.score && strength.level
                ? strengthColors[strength.level]
                : "bg-muted"
            }`}
            key={segment}
          />
        ))}
      </div>
    </div>
  );
}
