"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, Mail, ShieldAlert } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthFieldError } from "@/features/auth/components/shared/AuthFieldError";
import {
  AUTH_RECOVERY_REDIRECTS,
  AUTH_ROUTES,
} from "@/features/auth/constants/routes";
import { getPasswordRecoveryErrorMessageKey } from "@/features/auth/errors/getPasswordRecoveryErrorMessageKey";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgotPasswordSchema";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const locale = useLocale();
  const { isLoading, requestPasswordReset } = useAuth();
  const [isSent, setIsSent] = useState(false);
  const schema = createForgotPasswordSchema({
    emailInvalid: t("validation.emailInvalid"),
    emailRequired: t("validation.emailRequired"),
  });
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setFocus,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
    shouldFocusError: true,
  });
  const submitting = isLoading || isSubmitting;

  async function handleValidSubmit(values: ForgotPasswordFormValues) {
    clearErrors("root");

    try {
      const redirectTo = new URL(
        AUTH_RECOVERY_REDIRECTS.prepare,
        window.location.origin,
      );
      redirectTo.searchParams.set("locale", locale);

      await requestPasswordReset({
        email: values.email,
        redirectTo: redirectTo.toString(),
      });
      analytics.track("forgot_password");
      setIsSent(true);
    } catch (error) {
      const normalizedError = normalizeAuthError(error);
      setError("root", {
        message: t(getPasswordRecoveryErrorMessageKey(normalizedError.code)),
        type: normalizedError.code,
      });
      setFocus("email");
    }
  }

  if (isSent) {
    return (
      <section aria-live="polite" className="space-y-6 text-center">
        <div className="border-success/25 bg-success/10 text-success mx-auto grid size-20 place-items-center rounded-full border shadow-md">
          <CircleCheckBig aria-hidden className="size-9" strokeWidth={1.7} />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {t("success.title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {t("success.description")}
          </p>
        </div>
        <Button asChild className="h-12 rounded-lg" fullWidth size="lg">
          <Link href={AUTH_ROUTES.login}>{t("backToLogin")}</Link>
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
        <label className="text-sm font-medium" htmlFor="forgot-email">
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
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
            autoComplete="email"
            className="bg-background/65 group-hover:border-primary/25 focus-visible:bg-background/85 h-12 rounded-lg pr-4 pl-11 backdrop-blur-xl transition-[border-color,box-shadow,background-color]"
            disabled={submitting}
            id="forgot-email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            status={errors.email ? "error" : "default"}
            type="email"
            {...register("email")}
          />
        </div>
        <AuthFieldError
          id="forgot-email-error"
          message={errors.email?.message}
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

      <p className="text-center text-sm">
        <Link
          className="text-primary focus-visible:ring-ring rounded-xs font-semibold transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-offset-2"
          href={AUTH_ROUTES.login}
        >
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
