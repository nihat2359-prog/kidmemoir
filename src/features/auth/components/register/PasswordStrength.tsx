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
  id: string;
  label: string;
  levelLabels: Readonly<Record<PasswordStrengthLevel | "pending", string>>;
  password: string;
}>;

export function PasswordStrength({
  id,
  label,
  levelLabels,
  password,
}: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);
  const strengthLabel = strength.level
    ? levelLabels[strength.level]
    : levelLabels.pending;

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="space-y-2"
      id={id}
      role="status"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="text-muted-foreground text-xs">{strengthLabel}</span>
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
