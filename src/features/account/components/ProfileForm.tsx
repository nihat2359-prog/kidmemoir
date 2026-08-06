"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { updateAccountProfile } from "@/features/account/actions/profile";
import type { AccountProfile } from "@/features/account/types/account.types";
import { Link, useRouter } from "@/i18n/navigation";

type Values = {
  firstName: string;
  language: "tr" | "en";
  lastName: string;
  theme: "light" | "dark" | "system";
  timezone: string;
};
export function ProfileForm({ profile }: { profile: AccountProfile }) {
  const t = useTranslations("account.profile");
  const router = useRouter();
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<Values>({
    defaultValues: {
      firstName: profile.firstName,
      language: profile.language === "en" ? "en" : "tr",
      lastName: profile.lastName,
      theme: profile.theme,
      timezone: profile.timezone,
    },
  });
  async function submit(values: Values) {
    setFeedback(null);
    const result = await updateAccountProfile(values);
    setFeedback(result.success ? "success" : "error");
    if (result.success) router.refresh();
  }
  return (
    <form className="space-y-6" onSubmit={handleSubmit(submit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("fields.firstName")}>
          <Input
            required
            {...register("firstName", { required: true, maxLength: 100 })}
          />
        </Field>
        <Field label={t("fields.lastName")}>
          <Input
            required
            {...register("lastName", { required: true, maxLength: 100 })}
          />
        </Field>
        <Field label={t("fields.email")}>
          <Input readOnly value={profile.email} />
        </Field>
        <Field label={t("fields.language")}>
          <Controller
            control={control}
            name="language"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">{t("languages.tr")}</SelectItem>
                  <SelectItem value="en">{t("languages.en")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label={t("fields.timezone")}>
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Europe/Istanbul",
                    "Europe/London",
                    "America/New_York",
                    "America/Los_Angeles",
                    "Asia/Dubai",
                  ].map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label={t("fields.theme")}>
          <Controller
            control={control}
            name="theme"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["system", "light", "dark"].map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`themes.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      {feedback && (
        <p
          className={feedback === "success" ? "text-success" : "text-danger"}
          role="status"
        >
          {t(`feedback.${feedback}`)}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          icon={<Save aria-hidden />}
          loading={isSubmitting}
          type="submit"
        >
          {t("save")}
        </Button>
        <Button asChild variant="outline">
          <Link href="/forgot-password">{t("changePassword")}</Link>
        </Button>
      </div>
    </form>
  );
}
function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
