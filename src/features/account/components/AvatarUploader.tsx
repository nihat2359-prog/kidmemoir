"use client";

import { useRef, useState } from "react";
import { Camera, CircleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import {
  createProfileAvatarGrant,
  finalizeProfileAvatar,
} from "@/features/account/actions/profile";
import { Avatar } from "@/features/app-shell/components/Avatar";
import { preparePhoto } from "@/features/memories/utils/media";
import { uploadToSignedUrl } from "@/features/memories/utils/upload";
import { useRouter } from "@/i18n/navigation";

export function AvatarUploader({
  imageUrl,
  name,
}: {
  imageUrl: string | null;
  name: string;
}) {
  const t = useTranslations("account.profile.avatar");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  async function select(file?: File) {
    if (!file || loading) return;
    let previewUrl: string | null = null;
    setLoading(true);
    setError(false);
    setProgress(0);
    try {
      const photo = await preparePhoto(file);
      previewUrl = photo.previewUrl;
      if (photo.size > 5 * 1024 * 1024) throw new Error("SIZE");
      const grant = await createProfileAvatarGrant({
        mimeType: photo.mimeType,
        size: photo.size,
      });
      if (!grant.success) throw new Error("GRANT");
      await uploadToSignedUrl({
        blob: photo.blob,
        onProgress: setProgress,
        signedUrl: grant.signedUrl,
      }).promise;
      const done = await finalizeProfileAvatar(grant.path, photo.size);
      if (!done.success) throw new Error("FINALIZE");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (input.current) input.current.value = "";
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <Avatar
        className="size-24 text-2xl"
        imageUrl={imageUrl}
        label={t("label", { name })}
        name={name}
      />
      <div>
        <input
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          aria-label={t("action")}
          className="sr-only"
          onChange={(event) => void select(event.target.files?.[0])}
          ref={input}
          type="file"
        />
        <Button
          icon={<Camera aria-hidden />}
          loading={loading}
          onClick={() => input.current?.click()}
          type="button"
          variant="outline"
        >
          {loading ? t("uploading", { progress }) : t("action")}
        </Button>
        <p className="text-muted-foreground mt-2 text-xs">{t("description")}</p>
        {error && (
          <p
            className="text-danger mt-2 flex items-center gap-1 text-sm"
            role="alert"
          >
            <CircleAlert aria-hidden className="size-4" />
            {t("error")}
          </p>
        )}
      </div>
    </div>
  );
}
