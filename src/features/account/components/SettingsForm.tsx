"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { updateAccountSettings } from "@/features/account/actions/settings";
import type { AccountSettings } from "@/features/account/types/account.types";
import { useRouter } from "@/i18n/navigation";

export function SettingsForm({ settings }: { settings: AccountSettings }) {
  const t = useTranslations("account.settings");
  const router = useRouter();
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<AccountSettings>({ defaultValues: settings });
  async function submit(values: AccountSettings) {
    setFeedback(null);
    const result = await updateAccountSettings(values);
    setFeedback(result.success ? "success" : "error");
    if (result.success) router.refresh();
  }
  return (
    <form className="space-y-8" onSubmit={handleSubmit(submit)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          control={control}
          label={t("fields.language")}
          name="language"
          options={["tr", "en"]}
          t={t}
        />
        <SelectField
          control={control}
          label={t("fields.theme")}
          name="theme"
          options={["system", "light", "dark"]}
          t={t}
        />
        <SelectField
          control={control}
          label={t("fields.timezone")}
          name="timezone"
          options={[
            "Europe/Istanbul",
            "Europe/London",
            "America/New_York",
            "America/Los_Angeles",
            "Asia/Dubai",
          ]}
          t={t}
        />
        <SelectField
          control={control}
          label={t("fields.dateFormat")}
          name="dateFormat"
          options={["DD.MM.YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
          t={t}
        />
        <SelectField
          control={control}
          label={t("fields.timeFormat")}
          name="timeFormat"
          options={["24h", "12h"]}
          t={t}
        />
      </div>
      <div className="space-y-3">
        {(
          [
            "pushNotifications",
            "emailNotifications",
            "reminderNotifications",
            "aiEnabled",
          ] as const
        ).map((name) => (
          <Controller
            control={control}
            key={name}
            name={name}
            render={({ field }) => (
              <label className="bg-background/65 flex items-center justify-between gap-4 rounded-2xl border p-4">
                <span>
                  <span className="block font-medium">
                    {t(`toggles.${name}.title`)}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-sm">
                    {t(`toggles.${name}.description`)}
                  </span>
                </span>
                <Switch
                  aria-label={t(`toggles.${name}.title`)}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </label>
            )}
          />
        ))}
      </div>
      {feedback && (
        <p
          className={feedback === "success" ? "text-success" : "text-danger"}
          role="status"
        >
          {t(`feedback.${feedback}`)}
        </p>
      )}
      <Button icon={<Save aria-hidden />} loading={isSubmitting} type="submit">
        {t("save")}
      </Button>
    </form>
  );
}
function SelectField({
  control,
  label,
  name,
  options,
  t,
}: {
  control: ReturnType<typeof useForm<AccountSettings>>["control"];
  label: string;
  name: "language" | "theme" | "timezone" | "dateFormat" | "timeFormat";
  options: readonly string[];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span>{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={String(field.value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {t.has(`options.${option}`) ? t(`options.${option}`) : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </label>
  );
}
