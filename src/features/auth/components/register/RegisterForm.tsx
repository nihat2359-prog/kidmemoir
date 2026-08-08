"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { PasswordStrength } from "@/features/auth/components/register/PasswordStrength";
import { AuthFieldError } from "@/features/auth/components/shared/AuthFieldError";
import { AUTH_ROUTES } from "@/features/auth/constants/routes";
import { getRegisterErrorMessageKey } from "@/features/auth/errors/getRegisterErrorMessageKey";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createRegisterSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/registerSchema";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

const inputClassName =
  "bg-background/65 group-hover:border-primary/25 focus-visible:bg-background/85 h-12 rounded-lg pr-4 pl-11 backdrop-blur-xl transition-[border-color,box-shadow,background-color]";

type RegisterFormProps = Readonly<{
  isLoading?: boolean;
}>;

export function RegisterForm({ isLoading = false }: RegisterFormProps) {
  const t = useTranslations("auth.register");
  const locale = useLocale();
  const router = useRouter();
  const { isLoading: isAuthLoading, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const schema = createRegisterSchema({
    confirmPasswordRequired: t("validation.confirmPasswordRequired"),
    emailInvalid: t("validation.emailInvalid"),
    emailRequired: t("validation.emailRequired"),
    firstNameMaxLength: t("validation.firstNameMaxLength"),
    firstNameMinLength: t("validation.firstNameMinLength"),
    firstNameRequired: t("validation.firstNameRequired"),
    lastNameMaxLength: t("validation.lastNameMaxLength"),
    lastNameMinLength: t("validation.lastNameMinLength"),
    lastNameRequired: t("validation.lastNameRequired"),
    passwordLowercase: t("validation.passwordLowercase"),
    passwordMinLength: t("validation.passwordMinLength"),
    passwordNumber: t("validation.passwordNumber"),
    passwordRequired: t("validation.passwordRequired"),
    passwordUppercase: t("validation.passwordUppercase"),
    passwordsMismatch: t("validation.passwordsMismatch"),
    privacyRequired: t("validation.privacyRequired"),
    termsRequired: t("validation.termsRequired"),
  });
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setFocus,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      privacy: false,
      terms: false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });
  const password = useWatch({ control, name: "password" });
  const submitting = isLoading || isAuthLoading || isSubmitting;

  async function handleValidSubmit(values: RegisterFormValues) {
    clearErrors("root");

    try {
      const emailRedirectTo = new URL("/auth/callback", window.location.origin);
      emailRedirectTo.searchParams.set("locale", locale);
      const user = await signUp({
        email: values.email,
        emailRedirectTo: emailRedirectTo.toString(),
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
      });

      if (!user) {
        throw new Error("Missing authentication user");
      }

      analytics.track("sign_up", { method: "email" });
      router.replace(AUTH_ROUTES.verifyEmail);
      router.refresh();
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      setError("root", {
        message: t(getRegisterErrorMessageKey(normalizedError.code)),
        type: normalizedError.code,
      });
      setFocus("email");
    }
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="register-first-name">
            {t("firstNameLabel")}
          </label>
          <div className="group relative">
            <UserRound
              aria-hidden
              className={cn(
                "text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 transition-colors",
                errors.firstName &&
                  "text-danger group-focus-within:text-danger",
              )}
            />
            <Input
              aria-describedby={
                errors.firstName ? "register-first-name-error" : undefined
              }
              autoComplete="given-name"
              className={inputClassName}
              disabled={submitting}
              id="register-first-name"
              placeholder={t("firstNamePlaceholder")}
              status={errors.firstName ? "error" : "default"}
              type="text"
              {...register("firstName")}
            />
          </div>
          <AuthFieldError
            id="register-first-name-error"
            message={errors.firstName?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="register-last-name">
            {t("lastNameLabel")}
          </label>
          <div className="group relative">
            <UserRound
              aria-hidden
              className={cn(
                "text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 transition-colors",
                errors.lastName && "text-danger group-focus-within:text-danger",
              )}
            />
            <Input
              aria-describedby={
                errors.lastName ? "register-last-name-error" : undefined
              }
              autoComplete="family-name"
              className={inputClassName}
              disabled={submitting}
              id="register-last-name"
              placeholder={t("lastNamePlaceholder")}
              status={errors.lastName ? "error" : "default"}
              type="text"
              {...register("lastName")}
            />
          </div>
          <AuthFieldError
            id="register-last-name-error"
            message={errors.lastName?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="register-email">
          {t("emailLabel")}
        </label>
        <div className="group relative">
          <Mail
            aria-hidden
            className={cn(
              "text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 transition-colors",
              errors.email && "text-danger group-focus-within:text-danger",
            )}
          />
          <Input
            aria-describedby={errors.email ? "register-email-error" : undefined}
            autoComplete="email"
            className={inputClassName}
            disabled={submitting}
            id="register-email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            status={errors.email ? "error" : "default"}
            type="email"
            {...register("email")}
          />
        </div>
        <AuthFieldError
          id="register-email-error"
          message={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="register-password">
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
                ? "register-password-error register-password-strength"
                : "register-password-strength"
            }
            autoComplete="new-password"
            className={`${inputClassName} pr-12`}
            disabled={submitting}
            id="register-password"
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
          id="register-password-error"
          message={errors.password?.message}
        />
        <PasswordStrength
          id="register-password-strength"
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
        <label
          className="text-sm font-medium"
          htmlFor="register-confirm-password"
        >
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
                ? "register-confirm-password-error"
                : undefined
            }
            autoComplete="new-password"
            className={`${inputClassName} pr-12`}
            disabled={submitting}
            id="register-confirm-password"
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
          id="register-confirm-password-error"
          message={errors.confirmPassword?.message}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="sr-only">{t("agreementsLegend")}</legend>
        <div className="space-y-1.5">
          <label
            className="flex cursor-pointer items-start gap-3 text-sm leading-5"
            htmlFor="register-terms"
          >
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <Checkbox
                  aria-describedby={
                    errors.terms ? "register-terms-error" : undefined
                  }
                  aria-invalid={Boolean(errors.terms) || undefined}
                  checked={field.value}
                  className={errors.terms ? "border-danger" : undefined}
                  disabled={submitting}
                  id="register-terms"
                  name={field.name}
                  onBlur={field.onBlur}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  ref={field.ref}
                />
              )}
            />
            <span>{t("termsAgreement")}</span>
          </label>
          <AuthFieldError
            id="register-terms-error"
            message={errors.terms?.message}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="flex cursor-pointer items-start gap-3 text-sm leading-5"
            htmlFor="register-privacy"
          >
            <Controller
              control={control}
              name="privacy"
              render={({ field }) => (
                <Checkbox
                  aria-describedby={
                    errors.privacy ? "register-privacy-error" : undefined
                  }
                  aria-invalid={Boolean(errors.privacy) || undefined}
                  checked={field.value}
                  className={errors.privacy ? "border-danger" : undefined}
                  disabled={submitting}
                  id="register-privacy"
                  name={field.name}
                  onBlur={field.onBlur}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  ref={field.ref}
                />
              )}
            />
            <span>{t("privacyAgreement")}</span>
          </label>
          <AuthFieldError
            id="register-privacy-error"
            message={errors.privacy?.message}
          />
        </div>
      </fieldset>

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
