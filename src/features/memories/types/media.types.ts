import type { MemoryEntryType } from "@/features/memories/types/createMemory.types";

export type MediaType = Exclude<MemoryEntryType, "memory">;
export type UploadStatus =
  "idle" | "ready" | "uploading" | "error" | "cancelled";

export type PreparedMedia = Readonly<{
  blob: Blob;
  duration: number | null;
  fileName: string;
  height: number | null;
  mimeType: string;
  posterUrl?: string;
  previewUrl: string;
  size: number;
  type: MediaType;
  width: number | null;
}>;

export type MediaValidationError =
  | "audioTooLarge"
  | "heicUnsupported"
  | "imageProcessingFailed"
  | "photoTooLarge"
  | "recordingFailed"
  | "unsupportedAudio"
  | "unsupportedPhoto"
  | "unsupportedRecorder"
  | "unsupportedVideo"
  | "videoTooLarge";
