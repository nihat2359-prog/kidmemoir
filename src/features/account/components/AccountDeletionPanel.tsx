"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
import { deleteAccountAction } from "@/features/account/actions/deleteAccount";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";
import { analytics } from "@/lib/analytics";

export function AccountDeletionPanel() {
  const t = useTranslations("account.deletion");
  const router = useRouter();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);
  async function remove() {
    if (confirmation !== "DELETE" || deleting) return;
    setDeleting(true);
    setError(false);
    const result = await deleteAccountAction(confirmation);
    if (!result.success) {
      setDeleting(false);
      setError(true);
      return;
    }
    analytics.track("account_deleted");
    try {
      await signOut();
    } catch {}
    router.replace("/");
    router.refresh();
  }
  return (
    <div className="border-danger/25 bg-danger/5 rounded-2xl border p-5">
      <h3 className="font-semibold">{t("title")}</h3>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        {t("description")}
      </p>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!deleting) {
            setOpen(value);
            setConfirmation("");
            setError(false);
          }
        }}
      >
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
            <DialogDescription>{t("confirmDescription")}</DialogDescription>
          </DialogHeader>
          <ul className="bg-danger/5 text-muted-foreground border-danger/20 space-y-2 rounded-2xl border p-4 text-sm">
            {(
              [
                "profile",
                "children",
                "memories",
                "media",
                "subscription",
                "preferences",
              ] as const
            ).map((key) => (
              <li key={key}>• {t(`items.${key}`)}</li>
            ))}
          </ul>
          <label className="space-y-2 text-sm font-medium">
            <span>{t("confirmationLabel")}</span>
            <Input
              autoComplete="off"
              disabled={deleting}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="DELETE"
              value={confirmation}
            />
          </label>
          {error && (
            <p className="text-danger text-sm" role="alert">
              {t("error")}
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={deleting} variant="outline">
                {t("close")}
              </Button>
            </DialogClose>
            <Button
              disabled={confirmation !== "DELETE"}
              loading={deleting}
              onClick={() => void remove()}
              variant="danger"
            >
              {deleting ? t("deleting") : t("confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
