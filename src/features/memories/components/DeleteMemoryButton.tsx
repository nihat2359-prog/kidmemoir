"use client";

import { useState } from "react";
import { CircleAlert, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteMemoryAction } from "@/features/memories/actions/deleteMemory";
import { Alert, AlertDescription } from "@/components/ui/Alert";
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
import { useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";

export function DeleteMemoryButton({
  childId,
  eventId,
}: {
  childId: string;
  eventId: string;
}) {
  const t = useTranslations("memories.edit.delete");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);

  async function remove() {
    if (deleting) return;
    setDeleting(true);
    setError(false);
    const result = await deleteMemoryAction(eventId, childId);
    if (!result.success) {
      setDeleting(false);
      setError(true);
      return;
    }
    analytics.track("memory_deleted");
    setOpen(false);
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!deleting) {
          setOpen(value);
          if (value) setError(false);
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button icon={<Trash2 aria-hidden />} type="button" variant="danger">
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent showClose={false}>
        <DialogHeader>
          <span className="bg-danger/10 text-danger mb-2 grid size-12 place-items-center rounded-2xl">
            <CircleAlert aria-hidden className="size-6" />
          </span>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="danger">
            <CircleAlert aria-hidden />
            <AlertDescription>{t("error")}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={deleting} type="button" variant="outline">
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button
            icon={<Trash2 aria-hidden />}
            loading={deleting}
            onClick={() => void remove()}
            type="button"
            variant="danger"
          >
            {deleting ? t("deleting") : t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
