"use client";

import { useActionState, useState } from "react";
import { CircleAlert, CircleCheck, Paperclip, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  sendSupportRequest,
  type SupportFormState,
} from "@/features/information/actions/sendSupportRequest";
import { supportSubjects } from "@/features/information/schemas/supportSchema";
import type { AppLocale } from "@/i18n/routing";

const initialSupportFormState: SupportFormState = { status: "idle" };

export function SupportForm({ locale }: { locale: AppLocale }) {
  const t = useTranslations("information.support.form");
  const [filename, setFilename] = useState<string | null>(null);
  const [state, action] = useActionState(
    sendSupportRequest,
    initialSupportFormState,
  );

  return (
    <form
      action={action}
      aria-describedby="support-form-note"
      className="space-y-6"
    >
      <input name="locale" type="hidden" value={locale} />
      <div aria-hidden className="hidden">
        <label htmlFor="support-website">Website</label>
        <input
          autoComplete="off"
          id="support-website"
          name="website"
          tabIndex={-1}
        />
      </div>

      {state.status === "success" ? (
        <Alert variant="success">
          <CircleCheck aria-hidden />
          <AlertTitle>{t("feedback.successTitle")}</AlertTitle>
          <AlertDescription>
            {t("feedback.successDescription")}
          </AlertDescription>
        </Alert>
      ) : state.status === "error" ? (
        <Alert variant="danger">
          <CircleAlert aria-hidden />
          <AlertTitle>{t("feedback.errorTitle")}</AlertTitle>
          <AlertDescription>
            {t(`feedback.errors.${state.type ?? "network"}`)}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="support-email">
          {t("email.label")}
        </label>
        <Input
          aria-describedby={
            state.fieldErrors?.email ? "support-email-error" : undefined
          }
          autoComplete="email"
          className="h-12 rounded-xl"
          id="support-email"
          maxLength={254}
          name="email"
          placeholder={t("email.placeholder")}
          required
          status={state.fieldErrors?.email ? "error" : "default"}
          type="email"
        />
        {state.fieldErrors?.email ? (
          <p className="text-danger text-xs" id="support-email-error">
            {t("validation.email")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" id="support-subject-label">
          {t("subject.label")}
        </label>
        <Select name="subject" required>
          <SelectTrigger
            aria-describedby={
              state.fieldErrors?.subject ? "support-subject-error" : undefined
            }
            aria-labelledby="support-subject-label"
            className="h-12 rounded-xl"
            status={state.fieldErrors?.subject ? "error" : "default"}
          >
            <SelectValue placeholder={t("subject.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {supportSubjects.map((key) => (
              <SelectItem key={key} value={key}>
                {t(`subject.options.${key}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.fieldErrors?.subject ? (
          <p className="text-danger text-xs" id="support-subject-error">
            {t("validation.subject")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="support-message">
          {t("message.label")}
        </label>
        <Textarea
          aria-describedby={
            state.fieldErrors?.message
              ? "support-message-error"
              : "support-message-hint"
          }
          className="min-h-44 rounded-xl"
          id="support-message"
          maxLength={5000}
          minLength={20}
          name="message"
          placeholder={t("message.placeholder")}
          required
          status={state.fieldErrors?.message ? "error" : "default"}
        />
        <p className="text-muted-foreground text-xs" id="support-message-hint">
          {t("message.hint")}
        </p>
        {state.fieldErrors?.message ? (
          <p className="text-danger text-xs" id="support-message-error">
            {t("validation.message")}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="support-attachment">
          {t("attachment.label")}
        </label>
        <label
          className="hover:border-primary/50 hover:bg-primary/5 focus-within:ring-ring flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center transition-colors focus-within:ring-2"
          htmlFor="support-attachment"
        >
          <Paperclip aria-hidden className="text-primary size-5" />
          <span className="mt-2 text-sm font-medium">
            {filename ?? t("attachment.action")}
          </span>
          <span className="text-muted-foreground mt-1 text-xs">
            {t("attachment.hint")}
          </span>
        </label>
        <input
          accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,image/jpeg,image/png,image/webp,application/pdf,text/plain"
          aria-describedby={
            state.fieldErrors?.attachment
              ? "support-attachment-error"
              : undefined
          }
          className="sr-only"
          id="support-attachment"
          name="attachment"
          onChange={(event) =>
            setFilename(event.target.files?.[0]?.name ?? null)
          }
          type="file"
        />
        {state.fieldErrors?.attachment ? (
          <p className="text-danger text-xs" id="support-attachment-error">
            {t("validation.attachment")}
          </p>
        ) : null}
      </div>

      <SubmitButton label={t("submit")} pendingLabel={t("submitting")} />
      <p
        className="text-muted-foreground text-center text-xs leading-5"
        id="support-form-note"
      >
        {t("backendNote")}
      </p>
    </form>
  );
}

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      fullWidth
      icon={<Send aria-hidden />}
      loading={pending}
      size="lg"
      type="submit"
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}
