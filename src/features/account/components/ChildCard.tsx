"use client";

import { useState } from "react";
import {
  Baby,
  Heart,
  Image,
  NotebookText,
  Pencil,
  Star,
  Trash2,
  Video,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  archiveChild,
  makeDefaultChild,
} from "@/features/account/actions/children";
import type { AccountChild } from "@/features/account/types/account.types";
import { Avatar } from "@/features/app-shell/components/Avatar";
import { Link, useRouter } from "@/i18n/navigation";

export function ChildCard({
  child,
  locale,
}: {
  child: AccountChild;
  locale: string;
}) {
  const t = useTranslations("account.children.card");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = [child.firstName, child.lastName].filter(Boolean).join(" ");
  const birthDate = new Date(`${child.birthDate}T12:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  )
    age -= 1;
  const summary = [
    {
      icon: Baby,
      key: "age",
      value: t("summary.ageValue", { count: Math.max(0, age) }),
    },
    {
      icon: Image,
      key: "photos",
      value: new Intl.NumberFormat(locale).format(child.summary.photos),
    },
    {
      icon: NotebookText,
      key: "memories",
      value: new Intl.NumberFormat(locale).format(child.summary.memories),
    },
    {
      icon: Video,
      key: "videos",
      value: new Intl.NumberFormat(locale).format(child.summary.videos),
    },
    {
      icon: Heart,
      key: "lastMemory",
      value: child.summary.lastMemoryCreatedAt
        ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
            new Date(child.summary.lastMemoryCreatedAt),
          )
        : t("summary.noMemory"),
    },
  ] as const;
  async function setDefault() {
    setPending(true);
    const result = await makeDefaultChild(child.id);
    if (!result.success) setError(t("errors.default"));
    else router.refresh();
    setPending(false);
  }
  async function remove() {
    setPending(true);
    const result = await archiveChild(child.id);
    if (!result.success) {
      setError(t(`errors.${result.error}`));
      setPending(false);
      return;
    }
    router.refresh();
  }
  return (
    <article className="bg-card/75 rounded-[2rem] border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <Avatar
          className="size-20 text-xl"
          imageUrl={child.avatarUrl}
          label={t("avatar", { name })}
          name={name}
        />
        {child.isDefault && <Badge variant="primary">{t("active")}</Badge>}
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">{name}</h2>
      <p className="text-muted-foreground mt-1 text-sm">
        {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
          new Date(`${child.birthDate}T12:00:00Z`),
        )}
      </p>
      <dl className="bg-muted/35 mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-1 xl:grid-cols-2">
        {summary.map(({ icon: Icon, key, value }) => (
          <div
            className="bg-card/70 min-w-0 p-3 last:col-span-2 sm:last:col-span-1 xl:last:col-span-2"
            key={key}
          >
            <dt className="text-muted-foreground flex items-center gap-2 text-xs">
              <Icon aria-hidden className="text-primary size-3.5 shrink-0" />
              {t(`summary.${key}`)}
            </dt>
            <dd className="mt-1 truncate text-sm font-semibold" title={value}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {error && (
        <p className="text-danger mt-3 text-sm" role="alert">
          {error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          asChild
          icon={<Pencil aria-hidden />}
          size="sm"
          variant="outline"
        >
          <Link href={`/children/${child.id}/edit`}>{t("edit")}</Link>
        </Button>
        {!child.isDefault && (
          <Button
            disabled={pending}
            icon={<Star aria-hidden />}
            onClick={() => void setDefault()}
            size="sm"
            variant="outline"
          >
            {t("makeDefault")}
          </Button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={pending}
              icon={<Trash2 aria-hidden />}
              size="sm"
              variant="danger"
            >
              {t("delete")}
            </Button>
          </DialogTrigger>
          <DialogContent showClose={false}>
            <DialogHeader>
              <DialogTitle>{t("confirmTitle")}</DialogTitle>
              <DialogDescription>
                {t("confirmDescription", { name })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button
                loading={pending}
                onClick={() => void remove()}
                variant="danger"
              >
                {t("confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  );
}
