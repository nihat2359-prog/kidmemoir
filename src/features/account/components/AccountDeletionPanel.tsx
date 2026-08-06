"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
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

export function AccountDeletionPanel() {
  const t = useTranslations("account.deletion");
  return (
    <div className="border-danger/25 bg-danger/5 rounded-2xl border p-5">
      <h3 className="font-semibold">{t("title")}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        {t("description")}
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="mt-5"
            icon={<Trash2 aria-hidden />}
            variant="danger"
          >
            {t("trigger")}
          </Button>
        </DialogTrigger>
        <DialogContent showClose={false}>
          <DialogHeader>
            <DialogTitle>{t("confirmTitle")}</DialogTitle>
            <DialogDescription>{t("unavailable")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("close")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
