"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  ArrowLeft,
  BellRing,
  Brain,
  CircleAlert,
  Heart,
  Save,
  Tags,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Controller,
  useForm,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { createMemoryAction } from "@/features/memories/actions/createMemory";
import { updateMemoryAction } from "@/features/memories/actions/updateMemory";
import { CreateMemoryFieldError } from "@/features/memories/components/CreateMemoryFieldError";
import { MediaEditor } from "@/features/memories/components/MediaEditor";
import { MemoryTypeSelector } from "@/features/memories/components/MemoryTypeSelector";
import {
  createMemorySchema,
  type CreateMemoryInput,
  type CreateMemoryValues,
} from "@/features/memories/schemas/createMemorySchema";
import type {
  CreateMemoryContext,
  ExistingMemoryMedia,
  MemoryEntryType,
} from "@/features/memories/types/createMemory.types";
import type {
  PreparedMedia,
  UploadStatus,
} from "@/features/memories/types/media.types";
import {
  createMediaUploadGrant,
  discardCreatedMemory,
  finalizeEventMedia,
  removePendingMedia,
} from "@/features/memories/actions/media";
import { uploadToSignedUrl } from "@/features/memories/utils/upload";
import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { analytics } from "@/lib/analytics";

export function CreateMemoryForm({
  context,
  locale,
  today,
  tomorrow,
  eventId,
  existingMedia,
  initialValues,
}: {
  context: CreateMemoryContext;
  locale: AppLocale;
  today: string;
  tomorrow: string;
  eventId?: string;
  existingMedia?: ExistingMemoryMedia | null;
  initialValues?: CreateMemoryInput;
}) {
  const t = useTranslations("memories.create");
  const router = useRouter();
  const controlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const [resultState, setResultState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [media, setMedia] = useState<PreparedMedia | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const pendingEventRef = useRef<string | null>(null);
  const pendingPathRef = useRef<string | null>(null);
  const cancelUploadRef = useRef<(() => void) | null>(null);
  const feedbackRef = useRef<HTMLFormElement | null>(null);
  const mediaEditorRef = useRef<HTMLDivElement | null>(null);
  const schema = createMemorySchema({
    categoryRequired: t("validation.categoryRequired"),
    descriptionMax: t("validation.descriptionMax"),
    importanceInvalid: t("validation.importanceInvalid"),
    locationMax: t("validation.locationMax"),
    moodInvalid: t("validation.moodInvalid"),
    occurredAtFuture: t("validation.occurredAtFuture"),
    occurredAtRequired: t("validation.occurredAtRequired"),
    reminderDateRequired: t("validation.reminderDateRequired"),
    reminderFuture: t("validation.reminderFuture"),
    reminderNoteMax: t("validation.reminderNoteMax"),
    repeatTypeInvalid: t("validation.repeatTypeInvalid"),
    tagsInvalid: t("validation.tagsInvalid"),
    titleMax: t("validation.titleMax"),
    titleRequired: t("validation.titleRequired"),
    typeRequired: t("validation.typeRequired"),
  });
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<CreateMemoryInput, unknown, CreateMemoryValues>({
    defaultValues: initialValues ?? {
      aiEnabled: true,
      categoryId: "",
      description: "",
      entryType: "memory",
      importance: "normal",
      location: "",
      mood: "neutral",
      occurredAt: today,
      reminderAt: "",
      reminderEnabled: false,
      reminderNote: "",
      repeatType: "none",
      subCategoryId: "",
      tags: "",
      title: "",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });
  const entryType = useWatch({ control, name: "entryType" }) as MemoryEntryType;
  const categoryId = useWatch({ control, name: "categoryId" });
  const reminderEnabled = useWatch({ control, name: "reminderEnabled" });
  const subCategories = useMemo(
    () =>
      context.categories.find((category) => category.id === categoryId)
        ?.subCategories ?? [],
    [categoryId, context.categories],
  );
  const catalogLabel = (name: string) => {
    const key = `catalog.${name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
    return t.has(key) ? t(key) : name;
  };

  useEffect(
    () => () => {
      if (media) URL.revokeObjectURL(media.previewUrl);
    },
    [media],
  );

  async function uploadMedia(eventId: string, selectedMedia: PreparedMedia) {
    setUploadStatus("uploading");
    setUploadProgress(0);
    setMediaError(null);
    const grant = await createMediaUploadGrant({
      childId: context.child.id,
      eventId,
      mimeType: selectedMedia.mimeType,
      size: selectedMedia.size,
      type: selectedMedia.type,
    });
    if (!grant.success) throw new Error("GRANT_FAILED");
    pendingPathRef.current = grant.path;
    const upload = uploadToSignedUrl({
      blob: selectedMedia.blob,
      onProgress: setUploadProgress,
      signedUrl: grant.signedUrl,
    });
    cancelUploadRef.current = upload.cancel;
    await upload.promise;
    cancelUploadRef.current = null;
    const finalized = await finalizeEventMedia({
      childId: context.child.id,
      duration: selectedMedia.duration,
      eventId,
      fileName: selectedMedia.fileName,
      height: selectedMedia.height,
      mimeType: selectedMedia.mimeType,
      path: grant.path,
      size: selectedMedia.size,
      type: selectedMedia.type,
      width: selectedMedia.width,
    });
    if (!finalized.success) throw new Error("FINALIZE_FAILED");
    pendingPathRef.current = null;
    setUploadProgress(100);
  }

  async function retryUpload() {
    if (!pendingEventRef.current || !media) return;
    try {
      await uploadMedia(pendingEventRef.current, media);
      setResultState("success");
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setUploadStatus("error");
      setMediaError(t("media.errors.uploadFailed"));
    }
  }

  async function cancelUpload() {
    cancelUploadRef.current?.();
    const eventId = pendingEventRef.current;
    if (eventId)
      await discardCreatedMemory(
        eventId,
        context.child.id,
        pendingPathRef.current ?? undefined,
      );
    pendingEventRef.current = null;
    pendingPathRef.current = null;
    setUploadStatus("cancelled");
    setMediaError(t("media.cancelled"));
  }

  async function discardPendingEvent() {
    const eventId = pendingEventRef.current;
    if (!eventId) return;
    await discardCreatedMemory(
      eventId,
      context.child.id,
      pendingPathRef.current ?? undefined,
    );
    pendingEventRef.current = null;
    pendingPathRef.current = null;
  }

  async function leaveEditor() {
    await discardPendingEvent();
    router.replace("/dashboard");
  }

  async function onSubmit(values: CreateMemoryValues) {
    setResultState("idle");
    if (values.entryType !== "memory" && !media && !existingMedia) {
      setMediaError(t("media.errors.mediaRequired"));
      window.requestAnimationFrame(() => {
        mediaEditorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
      return;
    }
    if (eventId) {
      const result = await updateMemoryAction(
        eventId,
        values,
        locale,
        context.child.id,
      );
      if (result.success) {
        analytics.track("memory_updated", { entry_type: values.entryType });
        setResultState("success");
        router.replace("/dashboard");
        router.refresh();
        return;
      }
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          if (message) setError(field as keyof CreateMemoryInput, { message });
        });
        scrollToFirstError(result.fieldErrors);
      }
      setResultState("error");
      if (!result.fieldErrors)
        window.requestAnimationFrame(() =>
          feedbackRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        );
      return;
    }
    await discardPendingEvent();
    const result = await createMemoryAction(values, locale, context.child.id);
    if (result.success) {
      if (values.entryType === "memory" || !media) {
        analytics.track("memory_created", { entry_type: values.entryType });
        setResultState("success");
        router.replace("/dashboard");
        router.refresh();
        return;
      }
      pendingEventRef.current = result.eventId;
      try {
        await uploadMedia(result.eventId, media);
        analytics.track("media_uploaded", { media_type: values.entryType });
        analytics.track("memory_created", { entry_type: values.entryType });
        setResultState("success");
        router.replace("/dashboard");
        router.refresh();
      } catch (error) {
        if (pendingPathRef.current)
          await removePendingMedia(
            result.eventId,
            context.child.id,
            pendingPathRef.current,
          );
        pendingPathRef.current = null;
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setUploadStatus("error");
        setMediaError(t("media.errors.uploadFailed"));
      }
      return;
    }
    if (result.fieldErrors) {
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        if (message) setError(field as keyof CreateMemoryInput, { message });
      });
      scrollToFirstError(result.fieldErrors);
    }
    setResultState("error");
    if (!result.fieldErrors)
      window.requestAnimationFrame(() =>
        feedbackRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      );
  }

  function scrollToFirstError(
    fieldErrors:
      | FieldErrors<CreateMemoryInput>
      | Partial<Record<keyof CreateMemoryInput, unknown>>,
  ) {
    const errorTargets: Partial<Record<keyof CreateMemoryInput, string>> = {
      categoryId: "memory-category-error",
      description: "memory-description-error",
      location: "memory-location-error",
      occurredAt: "memory-date-error",
      reminderAt: "reminder-date-error",
      reminderNote: "reminder-note-error",
      tags: "memory-tags-error",
      title: "memory-title-error",
    };
    const firstField = Object.keys(fieldErrors).find(
      (field): field is keyof CreateMemoryInput =>
        Boolean(errorTargets[field as keyof CreateMemoryInput]),
    );
    const errorId = firstField ? errorTargets[firstField] : undefined;
    window.setTimeout(() => {
      const errorElement = errorId ? document.getElementById(errorId) : null;
      const target = errorElement?.closest("label") ?? errorElement;
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      const control = target?.querySelector<HTMLElement>(
        "input, textarea, button, [tabindex]:not([tabindex='-1'])",
      );
      control?.focus({ preventScroll: true });
    }, 0);
  }

  const inputClass = "h-12 rounded-xl bg-background/70 backdrop-blur-sm";
  // Upload-controller refs are read only when the resulting native submit
  // handler runs, never while React renders the form.
  // eslint-disable-next-line react-hooks/refs
  const submitHandler = handleSubmit(onSubmit, scrollToFirstError);
  return (
    <form
      className="space-y-12 sm:space-y-16"
      noValidate
      onSubmit={submitHandler}
      ref={feedbackRef}
    >
      <div className="flex justify-start">
        <Button
          disabled={isSubmitting || uploadStatus === "uploading"}
          icon={<ArrowLeft aria-hidden />}
          onClick={() => void leaveEditor()}
          type="button"
          variant="outline"
        >
          {t("cancel")}
        </Button>
      </div>
      {resultState === "success" && (
        <Alert className="rounded-2xl" variant="success">
          <Heart aria-hidden />
          <AlertTitle>{t("feedback.successTitle")}</AlertTitle>
          <AlertDescription>
            {t("feedback.successDescription")}
          </AlertDescription>
        </Alert>
      )}
      {resultState === "error" && (
        <Alert className="rounded-2xl" variant="danger">
          <CircleAlert aria-hidden />
          <AlertTitle>{t("feedback.errorTitle")}</AlertTitle>
          <AlertDescription>{t("feedback.errorDescription")}</AlertDescription>
        </Alert>
      )}

      <fieldset
        className="space-y-12 sm:space-y-16"
        disabled={isSubmitting || resultState === "success"}
      >
        <legend className="sr-only">{t("formLegend")}</legend>
        <section aria-labelledby="memory-type-title" className="space-y-7">
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
              {t("typeEyebrow")}
            </p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl"
              id="memory-type-title"
            >
              {t("typeTitle")}
            </h2>
          </div>
          <Controller
            control={control}
            name="entryType"
            render={({ field }) => (
              <MemoryTypeSelector
                disabled={isSubmitting || Boolean(eventId)}
                onChange={(value) => {
                  if (value !== entryType) {
                    void discardPendingEvent();
                    setMedia(null);
                    setMediaError(null);
                    setUploadStatus("idle");
                  }
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />
        </section>

        {entryType !== "memory" && existingMedia ? (
          <section className="bg-card/70 overflow-hidden rounded-[2rem] border p-4 shadow-sm sm:p-6">
            {existingMedia.type === "photo" && (
              <Image
                alt={t("media.previewAlt")}
                className="max-h-[32rem] w-full rounded-2xl object-contain"
                height={1200}
                src={existingMedia.url}
                unoptimized
                width={1600}
              />
            )}
            {existingMedia.type === "video" && (
              <video
                aria-label={t("media.previewAlt")}
                className="max-h-[32rem] w-full rounded-2xl bg-black"
                controls
                preload="metadata"
                src={existingMedia.url}
              />
            )}
            {existingMedia.type === "audio" && (
              <audio
                aria-label={t("media.previewAlt")}
                className="w-full"
                controls
                src={existingMedia.url}
              />
            )}
          </section>
        ) : entryType !== "memory" ? (
          <div ref={mediaEditorRef}>
            <MediaEditor
              error={mediaError}
              media={media}
              onCancel={() => void cancelUpload()}
              onChange={(value) => {
                if (value !== media) void discardPendingEvent();
                setMedia(value);
                setUploadStatus(value ? "ready" : "idle");
                setMediaError(null);
              }}
              onRetry={() => void retryUpload()}
              progress={uploadProgress}
              status={uploadStatus}
              type={entryType}
            />
          </div>
        ) : null}

        <section
          aria-labelledby="memory-details-title"
          className="bg-card/65 space-y-10 rounded-[2rem] border p-6 shadow-sm sm:p-10"
        >
          <div>
            <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
              {t("details.eyebrow")}
            </p>
            <h2
              className="mt-2 text-2xl font-semibold tracking-[-0.03em]"
              id="memory-details-title"
            >
              {t("details.title")}
            </h2>
          </div>
          <Field label={t("fields.title.label")} required>
            <Input
              aria-describedby={errors.title ? "memory-title-error" : undefined}
              className={inputClass}
              placeholder={t("fields.title.placeholder")}
              status={errors.title ? "error" : "default"}
              {...register("title")}
            />
            <CreateMemoryFieldError
              id="memory-title-error"
              message={errors.title?.message}
            />
          </Field>
          <div className="py-4 sm:py-6">
            <Field
              label={t("fields.description.label")}
              optional={t("optional")}
            >
              <Textarea
                aria-describedby={
                  errors.description ? "memory-description-error" : undefined
                }
                className="bg-background/70 min-h-40 rounded-xl"
                placeholder={t("fields.description.placeholder")}
                status={errors.description ? "error" : "default"}
                {...register("description")}
              />
              <CreateMemoryFieldError
                id="memory-description-error"
                message={errors.description?.message}
              />
            </Field>
          </div>
          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            <Field label={t("fields.category.label")} required>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue("subCategoryId", "");
                    }}
                    value={field.value}
                  >
                    <SelectTrigger
                      aria-describedby={
                        errors.categoryId ? "memory-category-error" : undefined
                      }
                      className={inputClass}
                      status={errors.categoryId ? "error" : "default"}
                    >
                      <SelectValue
                        placeholder={t("fields.category.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {context.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {catalogLabel(category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <CreateMemoryFieldError
                id="memory-category-error"
                message={errors.categoryId?.message}
              />
            </Field>
            <Field
              label={t("fields.subCategory.label")}
              optional={t("optional")}
            >
              <Controller
                control={control}
                name="subCategoryId"
                render={({ field }) => (
                  <Select
                    disabled={
                      !categoryId || subCategories.length === 0 || isSubmitting
                    }
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue
                        placeholder={t("fields.subCategory.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {catalogLabel(category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label={t("fields.date.label")} required>
              <Controller
                control={control}
                name="occurredAt"
                render={({ field }) => (
                  <DatePicker
                    aria-describedby={
                      errors.occurredAt ? "memory-date-error" : undefined
                    }
                    aria-label={t("fields.date.label")}
                    calendarLabel={t("controls.calendarLabel")}
                    isDisabled={isSubmitting}
                    isInvalid={Boolean(errors.occurredAt)}
                    locale={controlLocale}
                    maxValue={today}
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
              <CreateMemoryFieldError
                id="memory-date-error"
                message={errors.occurredAt?.message}
              />
            </Field>
            <Field label={t("fields.location.label")} optional={t("optional")}>
              <Input
                className={inputClass}
                placeholder={t("fields.location.placeholder")}
                status={errors.location ? "error" : "default"}
                {...register("location")}
              />
              <CreateMemoryFieldError
                id="memory-location-error"
                message={errors.location?.message}
              />
            </Field>
            <Field label={t("fields.mood.label")} optional={t("optional")}>
              <Controller
                control={control}
                name="mood"
                render={({ field }) => (
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "happy",
                        "sad",
                        "fear",
                        "excitement",
                        "proud",
                        "disappointed",
                        "neutral",
                      ].map((value) => (
                        <SelectItem key={value} value={value}>
                          {t(`moods.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field
              label={t("fields.importance.label")}
              optional={t("optional")}
            >
              <Controller
                control={control}
                name="importance"
                render={({ field }) => (
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["low", "normal", "high", "critical"].map((value) => (
                        <SelectItem key={value} value={value}>
                          {t(`importance.${value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
          <Field label={t("fields.tags.label")} optional={t("optional")}>
            <div className="relative">
              <Tags
                aria-hidden
                className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input
                className={`${inputClass} pl-10`}
                placeholder={t("fields.tags.placeholder")}
                status={errors.tags ? "error" : "default"}
                {...register("tags")}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              {t("fields.tags.hint")}
            </p>
            <CreateMemoryFieldError
              id="memory-tags-error"
              message={errors.tags?.message}
            />
          </Field>
        </section>

        <section aria-labelledby="memory-options-title" className="space-y-6">
          <h2
            className="text-xl font-semibold tracking-tight"
            id="memory-options-title"
          >
            {t("options.title")}
          </h2>
          <Controller
            control={control}
            name="aiEnabled"
            render={({ field }) => (
              <OptionCard
                checked={field.value}
                description={t("options.ai.description")}
                icon={Brain}
                label={t("options.ai.label")}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="reminderEnabled"
            render={({ field }) => (
              <OptionCard
                checked={field.value}
                description={t("options.reminder.description")}
                icon={BellRing}
                label={t("options.reminder.label")}
                onChange={field.onChange}
              />
            )}
          />
          {reminderEnabled && (
            <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 bg-background/55 grid gap-x-6 gap-y-8 rounded-[1.75rem] border p-6 motion-safe:duration-300 sm:grid-cols-2 sm:p-8">
              <Field label={t("reminder.date.label")} required>
                <Controller
                  control={control}
                  name="reminderAt"
                  render={({ field }) => (
                    <DatePicker
                      aria-describedby={
                        errors.reminderAt ? "reminder-date-error" : undefined
                      }
                      aria-label={t("reminder.date.label")}
                      calendarLabel={t("controls.reminderCalendarLabel")}
                      isDisabled={isSubmitting}
                      isInvalid={Boolean(errors.reminderAt)}
                      locale={controlLocale}
                      minValue={tomorrow}
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
                <CreateMemoryFieldError
                  id="reminder-date-error"
                  message={errors.reminderAt?.message}
                />
              </Field>
              <Field label={t("reminder.repeat.label")}>
                <Controller
                  control={control}
                  name="repeatType"
                  render={({ field }) => (
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={inputClass}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["none", "daily", "weekly", "monthly", "yearly"].map(
                          (value) => (
                            <SelectItem key={value} value={value}>
                              {t(`reminder.repeat.${value}`)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label={t("reminder.note.label")}
                  optional={t("optional")}
                >
                  <Textarea
                    className="bg-background/70 rounded-xl"
                    placeholder={t("reminder.note.placeholder")}
                    status={errors.reminderNote ? "error" : "default"}
                    {...register("reminderNote")}
                  />
                  <CreateMemoryFieldError
                    id="reminder-note-error"
                    message={errors.reminderNote?.message}
                  />
                </Field>
              </div>
            </div>
          )}
        </section>
      </fieldset>

      <div className="from-primary/10 via-card/75 to-ai/8 sticky bottom-20 z-20 rounded-[1.75rem] border bg-gradient-to-r p-3 shadow-lg backdrop-blur-xl lg:bottom-4">
        <Button
          className="h-14 rounded-2xl text-base shadow-md"
          disabled={resultState === "success"}
          fullWidth
          icon={<Save aria-hidden />}
          loading={isSubmitting}
          size="lg"
          type="submit"
        >
          {resultState === "success"
            ? t("save.saved")
            : isSubmitting
              ? t("save.saving")
              : t("save.label")}
        </Button>
      </div>
    </form>
  );
}

function Field({
  children,
  label,
  optional,
  required,
}: {
  children: React.ReactNode;
  label: string;
  optional?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-3 text-sm font-medium">
      <span className="flex items-center gap-2">
        {label}
        {required && (
          <span aria-hidden className="text-danger">
            *
          </span>
        )}
        {optional && (
          <span className="text-muted-foreground text-xs font-normal">
            {optional}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

function OptionCard({
  checked,
  description,
  icon: Icon,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  icon: typeof Brain;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="bg-card/60 hover:border-primary/20 flex cursor-pointer items-start gap-4 rounded-3xl border p-5 transition-colors">
      <span className="from-primary/12 to-ai/10 text-primary grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br">
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        <span className="text-muted-foreground mt-1 block text-sm leading-6">
          {description}
        </span>
      </span>
      <Checkbox
        aria-label={label}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
      />
    </label>
  );
}
