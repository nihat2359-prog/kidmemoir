"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleCheckBig,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginFieldError } from "@/features/auth/components/login/LoginFieldError";
import { AUTH_REDIRECTS } from "@/features/auth/constants/routes";
import { getLoginErrorMessageKey } from "@/features/auth/errors/getLoginErrorMessageKey";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import {
  createLoginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

type LoginFormProps = Readonly<{
  emailVerified?: boolean;
  isLoading?: boolean;
  passwordReset?: boolean;
}>;

export function LoginForm({
  emailVerified = false,
  isLoading = false,
  passwordReset = false,
}: LoginFormProps) {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const { isLoading: isAuthLoading, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const schema = createLoginSchema({
    emailInvalid: t("validation.emailInvalid"),
    emailRequired: t("validation.emailRequired"),
    passwordMinLength: t("validation.passwordMinLength"),
    passwordRequired: t("validation.passwordRequired"),
  });
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setFocus,
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", rememberMe: false },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });
  const submitting = isLoading || isAuthLoading || isSubmitting;

  async function handleValidSubmit(values: LoginFormValues) {
    clearErrors("root");

    try {
      const session = await signIn({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (!session) {
        throw new Error("Missing authentication session");
      }

      analytics.identify(session.user.id);
      analytics.track("login", { method: "email" });
      analytics.track("login_email");
      router.replace(AUTH_REDIRECTS.authenticated);
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      setError("root", {
        message: t(getLoginErrorMessageKey(normalizedError.code)),
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
      {emailVerified ? (
        <Alert variant="success">
          <CircleCheckBig aria-hidden />
          <AlertTitle>{t("verificationSuccess.title")}</AlertTitle>
          <AlertDescription>
            {t("verificationSuccess.description")}
          </AlertDescription>
        </Alert>
      ) : null}
      {passwordReset ? (
        <Alert variant="success">
          <CircleCheckBig aria-hidden />
          <AlertTitle>{t("passwordResetSuccess.title")}</AlertTitle>
          <AlertDescription>
            {t("passwordResetSuccess.description")}
          </AlertDescription>
        </Alert>
      ) : null}
      {errors.root?.message ? (
        <Alert variant="danger">
          <ShieldAlert aria-hidden />
          <AlertTitle>{t("errors.title")}</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="login-email">
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
            aria-describedby={errors.email ? "login-email-error" : undefined}
            autoComplete="email"
            className="bg-background/65 group-hover:border-primary/25 focus-visible:bg-background/85 h-12 rounded-lg pr-4 pl-11 backdrop-blur-xl transition-[border-color,box-shadow,background-color]"
            disabled={submitting}
            id="login-email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            status={errors.email ? "error" : "default"}
            type="email"
            {...register("email")}
          />
        </div>
        <LoginFieldError
          id="login-email-error"
          message={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="login-password">
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
              errors.password ? "login-password-error" : undefined
            }
            autoComplete="current-password"
            className="bg-background/65 group-hover:border-primary/25 focus-visible:bg-background/85 h-12 rounded-lg pr-12 pl-11 backdrop-blur-xl transition-[border-color,box-shadow,background-color]"
            disabled={submitting}
            id="login-password"
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
        <LoginFieldError
          id="login-password-error"
          message={errors.password?.message}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label
          className="flex cursor-pointer items-center gap-2.5 text-sm"
          htmlFor="remember-me"
        >
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                disabled={submitting}
                id="remember-me"
                name={field.name}
                onBlur={field.onBlur}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                ref={field.ref}
              />
            )}
          />
          <span>{t("rememberMe")}</span>
        </label>
        <Link
          className="text-primary focus-visible:ring-ring rounded-xs text-sm font-medium transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-offset-2"
          href="/forgot-password"
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <Button
        className="h-12 rounded-lg shadow-md"
        fullWidth
        disabled={submitting}
        loading={submitting}
        size="lg"
        type="submit"
      >
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
