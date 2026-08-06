"use client";

import { useState } from "react";
import { Baby, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { setDefaultChild } from "@/features/app-shell/actions/preferences";
import { Avatar } from "@/features/app-shell/components/Avatar";
import type { ShellChild } from "@/features/app-shell/types/appShell.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useRouter } from "@/i18n/navigation";

export function ChildSwitcher({ items }: { items: readonly ShellChild[] }) {
  const t = useTranslations("applicationShell.childSwitcher");
  const router = useRouter();
  const active = items.find((child) => child.isDefault) ?? items[0];
  const [selectedId, setSelectedId] = useState(active?.id ?? "");
  const [isPending, setIsPending] = useState(false);

  if (!active) return null;

  async function changeChild(childId: string) {
    if (childId === selectedId) return;
    const previousId = selectedId;
    setSelectedId(childId);
    setIsPending(true);
    try {
      await setDefaultChild(childId);
      router.refresh();
    } catch {
      setSelectedId(previousId);
    } finally {
      setIsPending(false);
    }
  }

  if (items.length === 1) {
    const name = [active.firstName, active.lastName].filter(Boolean).join(" ");
    return (
      <div className="bg-surface/70 hidden items-center gap-2 rounded-full border px-2 py-1.5 shadow-sm sm:flex">
        <Avatar
          className="size-7 text-[10px]"
          imageUrl={active.avatarUrl}
          label={t("avatarLabel", { name })}
          name={name}
        />
        <span className="max-w-32 truncate pr-1 text-sm font-medium">
          {name}
        </span>
      </div>
    );
  }

  return (
    <Select disabled={isPending} onValueChange={changeChild} value={selectedId}>
      <SelectTrigger
        aria-label={t("label")}
        className="bg-surface/70 hidden min-h-9 w-44 rounded-full sm:flex"
      >
        {isPending ? (
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
        ) : (
          <Baby aria-hidden className="size-4" />
        )}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((child) => (
          <SelectItem key={child.id} value={child.id}>
            {[child.firstName, child.lastName].filter(Boolean).join(" ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
