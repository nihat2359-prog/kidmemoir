"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  CirclePause,
  CirclePlay,
  Mic,
  RotateCcw,
  Square,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type {
  MediaType,
  MediaValidationError,
  PreparedMedia,
  UploadStatus,
} from "@/features/memories/types/media.types";
import {
  prepareMedia,
  recordingToWav,
  RECORDING_MAX_SECONDS,
} from "@/features/memories/utils/media";
import { cn } from "@/lib/utils";

const icons = { audio: Mic, photo: Camera, video: Video } as const;
const accepts = {
  audio: "audio/mpeg,audio/mp4,audio/ogg,audio/wav,.mp3,.m4a,.ogg,.wav",
  photo: "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,.heic,.heif",
  video: "video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm",
} as const;

export function MediaEditor({
  error,
  media,
  onCancel,
  onChange,
  onRetry,
  progress,
  status,
  type,
}: {
  error: string | null;
  media: PreparedMedia | null;
  onCancel: () => void;
  onChange: (media: PreparedMedia | null) => void;
  onRetry: () => void;
  progress: number;
  status: UploadStatus;
  type: MediaType;
}) {
  const t = useTranslations("memories.create.media");
  const format = useFormatter();
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused"
  >("idle");
  const [seconds, setSeconds] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const Icon = icons[type];

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  async function select(file?: File) {
    if (!file) return;
    setProcessing(true);
    setLocalError(null);
    try {
      const next = await prepareMedia(file, type);
      if (media) URL.revokeObjectURL(media.previewUrl);
      onChange(next);
    } catch (caught) {
      const code =
        caught instanceof Error && "code" in caught
          ? String(caught.code)
          : "imageProcessingFailed";
      setLocalError(t(`errors.${code as MediaValidationError}`));
    } finally {
      setProcessing(false);
    }
  }

  async function startRecording() {
    setLocalError(null);
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setLocalError(t("errors.unsupportedRecorder"));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        stream.getTracks().forEach((track) => track.stop());
        setProcessing(true);
        try {
          const next = await recordingToWav(
            new Blob(chunksRef.current, { type: recorder.mimeType }),
            t("record.fileName"),
          );
          if (media) URL.revokeObjectURL(media.previewUrl);
          onChange(next);
          setRecordingState("idle");
        } catch {
          setLocalError(t("errors.recordingFailed"));
          setRecordingState("idle");
        } finally {
          setProcessing(false);
        }
      };
      recorder.start(1000);
      setSeconds(0);
      setRecordingState("recording");
      timerRef.current = setInterval(() => {
        setSeconds((value) => {
          if (recorder.state !== "recording") return value;
          if (value + 1 >= RECORDING_MAX_SECONDS) {
            if (timerRef.current) clearInterval(timerRef.current);
            recorder.stop();
          }
          return Math.min(RECORDING_MAX_SECONDS, value + 1);
        });
      }, 1000);
    } catch {
      setLocalError(t("errors.recordingFailed"));
    }
  }

  function remove() {
    if (media) URL.revokeObjectURL(media.previewUrl);
    onChange(null);
    setLocalError(null);
  }

  const disabled = processing || status === "uploading";
  return (
    <section aria-label={t(`${type}.title`)} className="space-y-4">
      {!media ? (
        <div
          className={cn(
            "from-muted/45 via-background/40 to-primary/6 relative overflow-hidden rounded-[2rem] border border-dashed bg-gradient-to-br p-8 text-center transition-colors sm:p-12",
            dragging && "border-primary bg-primary/5",
          )}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void select(event.dataTransfer.files[0]);
          }}
        >
          <span className="from-primary/16 to-ai/12 text-primary mx-auto grid size-16 place-items-center rounded-3xl bg-gradient-to-br shadow-sm">
            <Icon aria-hidden className="size-7" />
          </span>
          <h3 className="mt-5 text-lg font-semibold tracking-tight">
            {t(`${type}.title`)}
          </h3>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-6">
            {t(`${type}.description`)}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              disabled={disabled}
              icon={<UploadCloud aria-hidden />}
              loading={processing}
              onClick={() => inputRef.current?.click()}
              type="button"
              variant="outline"
            >
              {t("selectFile")}
            </Button>
            {type === "audio" && (
              <Button
                disabled={disabled}
                icon={<Mic aria-hidden />}
                onClick={startRecording}
                type="button"
              >
                {t("record.start")}
              </Button>
            )}
          </div>
          <input
            ref={inputRef}
            accept={accepts[type]}
            aria-label={t("selectFile")}
            capture={type === "photo" ? "environment" : undefined}
            className="sr-only"
            onChange={(event) => void select(event.target.files?.[0])}
            type="file"
          />
        </div>
      ) : (
        <div className="bg-card/70 overflow-hidden rounded-[2rem] border p-4 shadow-sm sm:p-6">
          {type === "photo" && (
            <Image
              alt={t("previewAlt")}
              className="max-h-[32rem] w-full rounded-2xl object-contain"
              height={media.height ?? 2048}
              src={media.previewUrl}
              unoptimized
              width={media.width ?? 2048}
            />
          )}
          {type === "video" && (
            <video
              aria-label={t("previewAlt")}
              className="max-h-[32rem] w-full rounded-2xl bg-black object-contain"
              controls
              poster={media.posterUrl}
              preload="metadata"
              src={media.previewUrl}
            />
          )}
          {type === "audio" && (
            <audio
              aria-label={t("previewAlt")}
              className="w-full"
              controls
              src={media.previewUrl}
            />
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{media.fileName}</p>
              <p className="text-muted-foreground text-xs">
                {format.number(media.size / 1048576, {
                  maximumFractionDigits: 1,
                  style: "unit",
                  unit: "megabyte",
                  unitDisplay: "short",
                })}
              </p>
            </div>
            <Button
              aria-label={t("remove")}
              disabled={status === "uploading"}
              onClick={remove}
              type="button"
              variant="icon"
            >
              <Trash2 aria-hidden />
            </Button>
          </div>
        </div>
      )}

      {recordingState !== "idle" && (
        <div
          className="bg-danger/6 border-danger/20 flex flex-wrap items-center gap-3 rounded-2xl border p-4"
          role="status"
        >
          <span className="bg-danger size-2.5 animate-pulse rounded-full motion-reduce:animate-none" />
          <span className="font-mono text-sm tabular-nums">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
          <Button
            icon={
              recordingState === "paused" ? (
                <CirclePlay aria-hidden />
              ) : (
                <CirclePause aria-hidden />
              )
            }
            onClick={() => {
              const recorder = recorderRef.current;
              if (!recorder) return;
              if (recordingState === "paused") {
                recorder.resume();
                setRecordingState("recording");
              } else {
                recorder.pause();
                setRecordingState("paused");
              }
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            {recordingState === "paused"
              ? t("record.resume")
              : t("record.pause")}
          </Button>
          <Button
            icon={<Square aria-hidden />}
            onClick={() => recorderRef.current?.stop()}
            size="sm"
            type="button"
            variant="danger"
          >
            {t("record.stop")}
          </Button>
        </div>
      )}

      {status === "uploading" && (
        <div
          aria-label={t("uploading", { progress })}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="space-y-2"
          role="progressbar"
        >
          <div className="flex justify-between text-xs">
            <span>{t("uploading", { progress })}</span>
            <span>{progress}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-[width] motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button onClick={onCancel} size="sm" type="button" variant="ghost">
            {t("cancel")}
          </Button>
        </div>
      )}
      {(localError || error) && (
        <div
          className="border-danger/25 bg-danger/6 text-danger flex items-center justify-between gap-3 rounded-2xl border p-4 text-sm"
          role="alert"
        >
          <span>{localError ?? error}</span>
          {status === "error" && (
            <Button
              icon={<RotateCcw aria-hidden />}
              onClick={onRetry}
              size="sm"
              type="button"
              variant="outline"
            >
              {t("retry")}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
