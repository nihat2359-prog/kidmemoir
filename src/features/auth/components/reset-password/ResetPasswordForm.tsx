"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Link2Off, LockKeyhole, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/features/auth/components/register/PasswordStrength";
import { AuthFieldError } from "@/features/auth/components/shared/AuthFieldError";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { getPasswordRecoveryErrorMessageKey } from "@/features/auth/errors/getPasswordRecoveryErrorMessageKey";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/resetPasswordSchema";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

const inputClassName =
  "bg-background/65 group-hover:border-primary/25 focus-visible:bg-background/85 h-12 rounded-lg pr-12 pl-11 backdrop-blur-xl transition-[border-color,box-shadow,background-color]";

type ResetPasswordFormProps = Readonly<{
  invalidLink?: boolean;
}>;

export function ResetPasswordForm({
  invalidLink = false,
}: ResetPasswordFormProps) {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();
  const { isLoading, signOut, updatePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const schema = createResetPasswordSchema({
    confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    passwordLowercase: t("validation.passwordLowercase"),
    passwordMinLength: t("validation.passwordMinLength"),
    passwordNumber: t("validation.passwordNumber"),
    passwordRequired: t("validation.passwordRequired"),
    passwordUppercase: t("validation.passwordUppercase"),
    passwordsMismatch: t("validation.passwordsMismatch"),
  });
  const {
    clearErrors,
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setFocus,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { confirmPassword: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });
  const password = useWatch({ control, name: "password" });
  const submitting = isLoading || isSubmitting;

  async function handleValidSubmit(values: ResetPasswordFormValues) {
    clearErrors("root");

    try {
      await updatePassword(values.password);
      analytics.track("password_reset");
      await signOut();
      router.replace(`${AUTH_ROUTES.login}?reset=success`);
      router.refresh();
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      setError("root", {
        message: t(getPasswordRecoveryErrorMessageKey(normalizedError.code)),
        type: normalizedError.code,
      });
      setFocus("password");
    }
  }

  if (invalidLink) {
    return (
      <section className="space-y-6">
        <Alert variant="danger">
          <Link2Off aria-hidden />
          <AlertTitle>{t("errors.expiredLinkTitle")}</AlertTitle>
          <AlertDescription>{t("errors.expiredLink")}</AlertDescription>
        </Alert>
        <Button asChild className="h-12 rounded-lg" fullWidth size="lg">
          <Link href={AUTH_ROUTES.forgotPassword}>{t("requestNewLink")}</Link>
        </Button>
      </section>
    );
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      {errors.root?.message ? (
        <Alert variant="danger">
          <ShieldAlert aria-hidden />
          <AlertTitle>{t("errors.title")}</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="reset-password">
          {t("passwordLabel")}
        </label>
        <div className="group relative">
          <LockKeyhole
            aria-hidden
            className={cn(
              "text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 transition-colors",
              errors.password && "text-danger group-focus-within:text-danger",
            )}
          />
          <Input
            aria-describedby={
              errors.password
                ? "reset-password-error reset-password-strength"
                : "reset-password-strength"
            }
            autoComplete="new-password"
            className={inputClassName}
            disabled={submitting}
            id="reset-password"
            placeholder={t("passwordPlaceholder")}
            status={errors.password ? "error" : "default"}
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          <button
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-md transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
            disabled={submitting}
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        </div>
        <AuthFieldError
          id="reset-password-error"
          message={errors.password?.message}
        />
        <PasswordStrength
          id="reset-password-strength"
          label={t("passwordStrengthLabel")}
          levelLabels={{
            fair: t("passwordStrength.fair"),
            good: t("passwordStrength.good"),
            pending: t("passwordStrength.pending"),
            strong: t("passwordStrength.strong"),
            weak: t("passwordStrength.weak"),
          }}
          password={password}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="reset-confirm-password">
          {t("confirmPasswordLabel")}
        </label>
        <div className="group relative">
          <LockKeyhole
            aria-hidden
            className={cn(
              "text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 transition-colors",
              errors.confirmPassword &&
                "text-danger group-focus-within:text-danger",
            )}
          />
          <Input
            aria-describedby={
              errors.confirmPassword
                ? "reset-confirm-password-error"
                : undefined
            }
            autoComplete="new-password"
            className={inputClassName}
            disabled={submitting}
            id="reset-confirm-password"
            placeholder={t("confirmPasswordPlaceholder")}
            status={errors.confirmPassword ? "error" : "default"}
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
          />
          <button
            aria-label={
              showConfirmPassword
                ? t("hideConfirmPassword")
                : t("showConfirmPassword")
            }
            className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-md transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
            disabled={submitting}
            onClick={() => setShowConfirmPassword((visible) => !visible)}
            type="button"
          >
            {showConfirmPassword ? (
              <EyeOff aria-hidden className="size-4" />
            ) : (
              <Eye aria-hidden className="size-4" />
            )}
          </button>
        </div>
        <AuthFieldError
          id="reset-confirm-password-error"
          message={errors.confirmPassword?.message}
        />
      </div>

      <Button
        className="h-12 rounded-lg shadow-md"
        disabled={submitting}
        fullWidth
        loading={submitting}
        size="lg"
        type="submit"
      >
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
