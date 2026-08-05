export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export type PasswordStrength = Readonly<{
  level: PasswordStrengthLevel | null;
  score: number;
}>;

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: null, score: 0 };

  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
  ].filter(Boolean).length;

  if (score <= 1) return { level: "weak", score: 1 };
  if (score === 2) return { level: "fair", score };
  if (score === 3) return { level: "good", score };
  return { level: "strong", score };
}
