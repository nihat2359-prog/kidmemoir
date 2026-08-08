"use client";
import { useMemo, useState } from "react";
import { Bell, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { TimePicker } from "@/components/ui/TimePicker";
import {
  deleteReminder,
  saveReminder,
  setReminderActive,
} from "@/features/reminders/actions";
import type {
  ReminderData,
  ReminderInput,
  ReminderItem,
} from "@/features/reminders/types";
import { useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";

const split = (iso: string) => {
  const d = new Date(iso);
  const local = new Date(
    d.getTime() - d.getTimezoneOffset() * 60000,
  ).toISOString();
  return { date: local.slice(0, 10), time: local.slice(11, 16) };
};
export function RemindersExperience({
  data,
  locale,
}: {
  data: ReminderData;
  locale: "tr" | "en";
}) {
  const t = useTranslations("reminders");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [child, setChild] = useState("all");
  const [view, setView] = useState("upcoming");
  const [editing, setEditing] = useState<ReminderItem | null | "new">(null);
  const [busy, setBusy] = useState(false);
  const now = Date.parse(data.referenceTime);
  const items = useMemo(
    () =>
      data.items.filter(
        (item) =>
          (child === "all" || item.childId === child) &&
          item.title
            .toLocaleLowerCase(locale)
            .includes(query.toLocaleLowerCase(locale)) &&
          (view === "all" ||
            (view === "upcoming"
              ? new Date(item.reminderAt).getTime() >= now
              : new Date(item.reminderAt).getTime() < now)),
      ),
    [data.items, child, query, view, locale, now],
  );
  async function remove(item: ReminderItem) {
    if (!confirm(t("deleteConfirm"))) return;
    setBusy(true);
    const r = await deleteReminder(item.id, item.childId);
    if (r.success) {
      analytics.track("reminder_deleted");
      router.refresh();
    }
    setBusy(false);
  }
  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-24">
      <header className="from-primary/12 via-card to-ai/8 rounded-[2.5rem] border bg-gradient-to-br p-7 sm:p-10">
        <p className="text-primary text-sm font-semibold">{t("eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl leading-7">
          {t("description")}
        </p>
        <Button
          className="mt-6"
          icon={<Plus aria-hidden />}
          onClick={() => setEditing("new")}
        >
          {t("create")}
        </Button>
      </header>
      <section
        aria-label={t("filters.ariaLabel")}
        className="bg-card/75 grid gap-3 rounded-[2rem] border p-5 md:grid-cols-3"
      >
        <div className="relative">
          <Search
            aria-hidden
            className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2"
          />
          <Input
            aria-label={t("filters.search")}
            className="pl-11"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            value={query}
          />
        </div>
        <Select value={child} onValueChange={setChild}>
          <SelectTrigger aria-label={t("filters.child")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.allChildren")}</SelectItem>
            {data.children.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={view} onValueChange={setView}>
          <SelectTrigger aria-label={t("filters.period")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["upcoming", "past", "all"].map((v) => (
              <SelectItem key={v} value={v}>
                {t(`filters.${v}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
      {items.length ? (
        <ul className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <li
              className="bg-card/75 rounded-[1.75rem] border p-5 shadow-sm"
              key={item.id}
            >
              <div className="flex gap-4">
                <span className="bg-primary/10 text-primary grid size-11 place-items-center rounded-2xl">
                  <Bell aria-hidden className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {item.childName} ·{" "}
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.reminderAt))}
                  </p>
                  {item.description && (
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {item.description}
                    </p>
                  )}
                </div>
                <Switch
                  aria-label={t("active")}
                  checked={item.status === "scheduled"}
                  disabled={busy}
                  onCheckedChange={async (v) => {
                    setBusy(true);
                    const r = await setReminderActive(item.id, item.childId, v);
                    if (r.success) {
                      analytics.track("reminder_updated", { active: v });
                      router.refresh();
                    }
                    setBusy(false);
                  }}
                />
              </div>
              <div className="mt-4 flex gap-2 border-t pt-4">
                <Button
                  icon={<Pencil aria-hidden />}
                  onClick={() => setEditing(item)}
                  size="sm"
                  variant="ghost"
                >
                  {t("edit")}
                </Button>
                <Button
                  icon={<Trash2 aria-hidden />}
                  onClick={() => void remove(item)}
                  size="sm"
                  variant="danger"
                >
                  {t("delete")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Bell />}
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <Button onClick={() => setEditing("new")}>
              {t("empty.action")}
            </Button>
          }
        />
      )}
      <ReminderDialog
        childrenOptions={data.children}
        item={editing}
        locale={locale}
        onClose={() => setEditing(null)}
        onSaved={() => router.refresh()}
      />
    </main>
  );
}

function ReminderDialog({
  childrenOptions,
  item,
  locale,
  onClose,
  onSaved,
}: {
  childrenOptions: ReminderData["children"];
  item: ReminderItem | null | "new";
  locale: "tr" | "en";
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslations("reminders.form");
  const date =
    item && item !== "new"
      ? split(item.reminderAt)
      : { date: "", time: "09:00" };
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ReminderInput>({
    values: {
      childId:
        item && item !== "new" ? item.childId : (childrenOptions[0]?.id ?? ""),
      date: date.date,
      description: item && item !== "new" ? (item.description ?? "") : "",
      id: item && item !== "new" ? item.id : undefined,
      repeatType:
        item &&
        item !== "new" &&
        ["daily", "weekly", "monthly", "yearly"].includes(item.repeatType)
          ? (item.repeatType as ReminderInput["repeatType"])
          : "none",
      time: date.time,
      title: item && item !== "new" ? item.title : "",
    },
  });
  async function submit(v: ReminderInput) {
    const r = await saveReminder(v);
    if (r.success) {
      analytics.track(r.created ? "reminder_created" : "reminder_updated");
      onSaved();
      onClose();
    }
  }
  return (
    <Dialog
      open={item !== null}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(item === "new" ? "createTitle" : "editTitle")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form
          id="reminder-form"
          className="space-y-4"
          onSubmit={handleSubmit(submit)}
        >
          <label className="space-y-2 text-sm font-medium">
            <span>{t("title")}</span>
            <Input {...register("title", { required: true })} />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>{t("child")}</span>
            <Controller
              control={control}
              name="childId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {childrenOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>{t("date")}</span>
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    aria-label={t("date")}
                    calendarLabel={t("calendar")}
                    locale={locale === "tr" ? "tr-TR" : "en-US"}
                    name={field.name}
                    nextMonthLabel={t("nextMonth")}
                    onValueChange={(v) => field.onChange(v ?? "")}
                    openCalendarLabel={t("openCalendar")}
                    previousMonthLabel={t("previousMonth")}
                    value={field.value}
                  />
                )}
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>{t("time")}</span>
              <Controller
                control={control}
                name="time"
                render={({ field }) => (
                  <TimePicker
                    aria-label={t("time")}
                    locale={locale === "tr" ? "tr-TR" : "en-US"}
                    onValueChange={(v) => field.onChange(v ?? "")}
                    value={field.value}
                  />
                )}
              />
            </label>
          </div>
          <label className="space-y-2 text-sm font-medium">
            <span>{t("repeat")}</span>
            <Controller
              control={control}
              name="repeatType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["none", "daily", "weekly", "monthly", "yearly"].map(
                      (v) => (
                        <SelectItem key={v} value={v}>
                          {t(`repeats.${v}`)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </label>
          <label className="space-y-2 text-sm font-medium">
            <span>{t("note")}</span>
            <Textarea {...register("description")} />
          </label>
        </form>
        <DialogFooter>
          <Button onClick={onClose} type="button" variant="outline">
            {t("cancel")}
          </Button>
          <Button form="reminder-form" loading={isSubmitting} type="submit">
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
