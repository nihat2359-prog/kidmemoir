"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Baby, Camera, CircleAlert, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { NumberInput } from "@/components/ui/NumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createChildAction } from "@/features/children/actions/createChild";
import { CreateChildFieldError } from "@/features/children/components/CreateChildFieldError";
import {
  createChildSchema,
  type CreateChildInput,
  type CreateChildValues,
} from "@/features/children/schemas/createChildSchema";
import type { AppLocale } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";

type CreateChildFormProps = Readonly<{ locale: AppLocale }>;

export function CreateChildForm({ locale }: CreateChildFormProps) {
  const t = useTranslations("children.create");
  const router = useRouter();
  const controlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = createChildSchema({
    birthDateFuture: t("validation.birthDateFuture"),
    birthDateInvalid: t("validation.birthDateInvalid"),
    birthDateRequired: t("validation.birthDateRequired"),
    birthHeightPositive: t("validation.birthHeightPositive"),
    birthPlaceMaxLength: t("validation.birthPlaceMaxLength"),
    birthWeightPositive: t("validation.birthWeightPositive"),
    firstNameMaxLength: t("validation.firstNameMaxLength"),
    firstNameRequired: t("validation.firstNameRequired"),
    genderRequired: t("validation.genderRequired"),
    lastNameMaxLength: t("validation.lastNameMaxLength"),
    notesMaxLength: t("validation.notesMaxLength"),
  });
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CreateChildInput, unknown, CreateChildValues>({
    defaultValues: {
      birthDate: "",
      birthHeight: "",
      birthPlace: "",
      birthWeight: "",
      firstName: "",
      gender: undefined,
      lastName: "",
      notes: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: CreateChildValues) {
    setSubmitError(null);
    const result = await createChildAction(values, locale);

    if (result.error === "premiumRequired") {
      router.push("/subscription?reason=child_limit");
      return;
    }

    if (result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        if (message) setError(field as keyof CreateChildInput, { message });
      });
    }
    setSubmitError(t(`errors.${result.error}`));
  }

  const inputClassName =
    "bg-background/70 h-12 rounded-xl backdrop-blur-sm transition-[border-color,box-shadow,background-color]";

  return (
    <form className="space-y-8" noValidate onSubmit={handleSubmit(onSubmit)}>
      {submitError ? (
        <Alert variant="danger">
          <CircleAlert aria-hidden />
          <AlertTitle>{t("errors.title")}</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <fieldset className="space-y-6" disabled={isSubmitting}>
        <legend className="sr-only">{t("formLegend")}</legend>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-6 text-center">
          <span className="from-primary/20 to-ai/20 text-primary grid size-20 place-items-center rounded-full bg-gradient-to-br">
            <Baby aria-hidden className="size-8" />
          </span>
          <div>
            <p className="font-medium">{t("avatar.label")}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t("avatar.description")}
            </p>
          </div>
          <Button
            disabled
            icon={<Camera aria-hidden />}
            type="button"
            variant="outline"
          >
            {t("avatar.action")}
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("firstName.label")} required>
            <Input
              aria-describedby={
                errors.firstName ? "first-name-error" : undefined
              }
              autoComplete="off"
              className={inputClassName}
              placeholder={t("firstName.placeholder")}
              status={errors.firstName ? "error" : "default"}
              {...register("firstName")}
            />
            <CreateChildFieldError
              id="first-name-error"
              message={errors.firstName?.message}
            />
          </Field>
          <Field label={t("lastName.label")} optional={t("optional")}>
            <Input
              aria-describedby={errors.lastName ? "last-name-error" : undefined}
              autoComplete="off"
              className={inputClassName}
              placeholder={t("lastName.placeholder")}
              status={errors.lastName ? "error" : "default"}
              {...register("lastName")}
            />
            <CreateChildFieldError
              id="last-name-error"
              message={errors.lastName?.message}
            />
          </Field>
          <Field label={t("birthDate.label")} required>
            <Controller
              control={control}
              name="birthDate"
              render={({ field }) => (
                <DatePicker
                  aria-describedby={
                    errors.birthDate ? "birth-date-error" : undefined
                  }
                  aria-label={t("birthDate.label")}
                  calendarLabel={t("controls.calendarLabel")}
                  isDisabled={isSubmitting}
                  isInvalid={Boolean(errors.birthDate)}
                  locale={controlLocale}
                  maxValue={new Date().toISOString().slice(0, 10)}
                  name={field.name}
                  nextMonthLabel={t("controls.nextMonth")}
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  openCalendarLabel={t("controls.openCalendar")}
                  previousMonthLabel={t("controls.previousMonth")}
                  value={field.value}
                />
              )}
            />
            <CreateChildFieldError
              id="birth-date-error"
              message={errors.birthDate?.message}
            />
          </Field>
          <Field label={t("gender.label")} required>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    aria-describedby={
                      errors.gender ? "gender-error" : undefined
                    }
                    aria-invalid={Boolean(errors.gender)}
                    className="bg-background/70 h-12 rounded-xl"
                    status={errors.gender ? "error" : "default"}
                  >
                    <SelectValue placeholder={t("gender.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">{t("gender.female")}</SelectItem>
                    <SelectItem value="male">{t("gender.male")}</SelectItem>
                    <SelectItem value="other">{t("gender.other")}</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      {t("gender.preferNotToSay")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <CreateChildFieldError
              id="gender-error"
              message={errors.gender?.message}
            />
          </Field>
          <Field label={t("birthPlace.label")} optional={t("optional")}>
            <Input
              aria-describedby={
                errors.birthPlace ? "birth-place-error" : undefined
              }
              className={inputClassName}
              placeholder={t("birthPlace.placeholder")}
              status={errors.birthPlace ? "error" : "default"}
              {...register("birthPlace")}
            />
            <CreateChildFieldError
              id="birth-place-error"
              message={errors.birthPlace?.message}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("birthHeight.label")} optional={t("optional")}>
              <Controller
                control={control}
                name="birthHeight"
                render={({ field }) => (
                  <NumberInput
                    aria-describedby={
                      errors.birthHeight ? "birth-height-error" : undefined
                    }
                    aria-label={t("birthHeight.label")}
                    decrementLabel={t("controls.decreaseHeight")}
                    formatOptions={{ maximumFractionDigits: 2 }}
                    incrementLabel={t("controls.increaseHeight")}
                    isDisabled={isSubmitting}
                    isInvalid={Boolean(errors.birthHeight)}
                    locale={controlLocale}
                    maxValue={999.99}
                    minValue={0.01}
                    name={field.name}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    placeholder={t("birthHeight.placeholder")}
                    step={0.01}
                    value={
                      typeof field.value === "number" ? field.value : undefined
                    }
                  />
                )}
              />
              <CreateChildFieldError
                id="birth-height-error"
                message={errors.birthHeight?.message}
              />
            </Field>
            <Field label={t("birthWeight.label")} optional={t("optional")}>
              <Controller
                control={control}
                name="birthWeight"
                render={({ field }) => (
                  <NumberInput
                    aria-describedby={
                      errors.birthWeight ? "birth-weight-error" : undefined
                    }
                    aria-label={t("birthWeight.label")}
                    decrementLabel={t("controls.decreaseWeight")}
                    formatOptions={{ maximumFractionDigits: 2 }}
                    incrementLabel={t("controls.increaseWeight")}
                    isDisabled={isSubmitting}
                    isInvalid={Boolean(errors.birthWeight)}
                    locale={controlLocale}
                    maxValue={999.99}
                    minValue={0.01}
                    name={field.name}
                    onBlur={field.onBlur}
                    onValueChange={field.onChange}
                    placeholder={t("birthWeight.placeholder")}
                    step={0.01}
                    value={
                      typeof field.value === "number" ? field.value : undefined
                    }
                  />
                )}
              />
              <CreateChildFieldError
                id="birth-weight-error"
                message={errors.birthWeight?.message}
              />
            </Field>
          </div>
        </div>

        <Field label={t("notes.label")} optional={t("optional")}>
          <Textarea
            aria-describedby={errors.notes ? "notes-error" : "notes-hint"}
            className="bg-background/70 min-h-28 rounded-xl backdrop-blur-sm"
            maxLength={10000}
            placeholder={t("notes.placeholder")}
            status={errors.notes ? "error" : "default"}
            {...register("notes")}
          />
          <p className="text-muted-foreground text-xs" id="notes-hint">
            {t("notes.hint")}
          </p>
          <CreateChildFieldError
            id="notes-error"
            message={errors.notes?.message}
          />
        </Field>
      </fieldset>

      <Button
        className="h-12 rounded-xl shadow-md"
        fullWidth
        icon={<Save aria-hidden />}
        loading={isSubmitting}
        size="lg"
        type="submit"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

type FieldProps = Readonly<{
  children: React.ReactNode;
  label: string;
  optional?: string;
  required?: boolean;
}>;

function Field({ children, label, optional, required = false }: FieldProps) {
  return (
    <label className="space-y-2 text-sm font-medium">
      <span className="flex items-center gap-2">
        {label}
        {required ? (
          <span aria-hidden className="text-danger">
            *
          </span>
        ) : null}
        {optional ? (
          <span className="text-muted-foreground text-xs font-normal">
            {optional}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}
