"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { updateChild } from "@/features/account/actions/children";
import type { AppLocale } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";

type Values = {
  birthDate: string;
  firstName: string;
  gender: "female" | "male" | "other" | "prefer_not_to_say";
  lastName: string;
};
export function EditChildForm({
  child,
  locale,
}: {
  child: Values & { id: string };
  locale: AppLocale;
}) {
  const t = useTranslations("account.children.edit");
  const router = useRouter();
  const [error, setError] = useState(false);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<Values>({ defaultValues: child });
  async function submit(values: Values) {
    const result = await updateChild(child.id, values);
    if (!result.success) {
      setError(true);
      return;
    }
    router.replace("/children");
    router.refresh();
  }
  return (
    <form
      className="bg-card/75 space-y-6 rounded-[2rem] border p-5 shadow-sm sm:p-8"
      onSubmit={handleSubmit(submit)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("firstName")}>
          <Input required {...register("firstName", { required: true })} />
        </Field>
        <Field label={t("lastName")}>
          <Input {...register("lastName")} />
        </Field>
        <Field label={t("birthDate")}>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <DatePicker
                aria-label={t("birthDate")}
                calendarLabel={t("calendar")}
                locale={locale === "tr" ? "tr-TR" : "en-US"}
                maxValue={new Date().toISOString().slice(0, 10)}
                nextMonthLabel={t("nextMonth")}
                onValueChange={field.onChange}
                openCalendarLabel={t("openCalendar")}
                previousMonthLabel={t("previousMonth")}
                value={field.value}
              />
            )}
          />
        </Field>
        <Field label={t("gender")}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["female", "male", "other", "prefer_not_to_say"].map(
                    (value) => (
                      <SelectItem key={value} value={value}>
                        {t(`genders.${value}`)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      {error && (
        <p className="text-danger" role="alert">
          {t("error")}
        </p>
      )}
      <Button icon={<Save aria-hidden />} loading={isSubmitting}>
        {t("save")}
      </Button>
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
