"use client";

import type {
  MediaType,
  MediaValidationError,
  PreparedMedia,
} from "@/features/memories/types/media.types";

export const PHOTO_MAX_BYTES = 10 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 100 * 1024 * 1024;
export const AUDIO_MAX_BYTES = 25 * 1024 * 1024;
export const RECORDING_MAX_SECONDS = 10 * 60;

const acceptedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const audioMimeByExtension: Record<string, string> = {
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
};

const videoMimeByExtension: Record<string, string> = {
  mov: "video/quicktime",
  mp4: "video/mp4",
  webm: "video/webm",
};

function mediaError(code: MediaValidationError): Error {
  return Object.assign(new Error(code), { code });
}

function fileExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(mediaError("imageProcessingFailed"));
    };
    image.src = url;
  });
}

export async function preparePhoto(file: File): Promise<PreparedMedia> {
  const extension = fileExtension(file.name);
  if (
    extension === "heic" ||
    extension === "heif" ||
    /hei[cf]/i.test(file.type)
  )
    throw mediaError("heicUnsupported");
  if (
    !acceptedPhotoTypes.has(file.type) ||
    !["jpg", "jpeg", "png", "webp"].includes(extension)
  )
    throw mediaError("unsupportedPhoto");
  if (file.size > PHOTO_MAX_BYTES) throw mediaError("photoTooLarge");

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    2048 / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw mediaError("imageProcessingFailed");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) throw mediaError("imageProcessingFailed");
  if (blob.size > PHOTO_MAX_BYTES) throw mediaError("photoTooLarge");
  return {
    blob,
    duration: null,
    fileName: `${file.name.replace(/\.[^.]+$/, "")}.jpg`,
    height,
    mimeType: "image/jpeg",
    previewUrl: URL.createObjectURL(blob),
    size: blob.size,
    type: "photo",
    width,
  };
}

function readDuration(file: Blob, kind: "audio" | "video"): Promise<number> {
  const url = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    const element = document.createElement(kind);
    element.preload = "metadata";
    element.onloadedmetadata = () => {
      const duration = Number.isFinite(element.duration)
        ? Math.round(element.duration)
        : 0;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    element.onerror = () => {
      URL.revokeObjectURL(url);
      reject(mediaError("unsupportedAudio"));
    };
    element.src = url;
  });
}

export async function prepareVideo(file: File): Promise<PreparedMedia> {
  const extension = fileExtension(file.name);
  const mimeType = videoMimeByExtension[extension];
  const compatibleType =
    !file.type ||
    file.type === mimeType ||
    (extension === "mov" && file.type === "video/mp4");
  if (!mimeType || !compatibleType) throw mediaError("unsupportedVideo");
  if (file.size > VIDEO_MAX_BYTES) throw mediaError("videoTooLarge");
  const previewUrl = URL.createObjectURL(file);
  const metadata = await new Promise<{
    duration: number;
    height: number;
    posterUrl?: string;
    width: number;
  }>((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "metadata";
    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);
      resolve({
        duration: Number.isFinite(video.duration)
          ? Math.round(video.duration)
          : 0,
        height: video.videoHeight,
        posterUrl:
          canvas.width && canvas.height
            ? canvas.toDataURL("image/jpeg", 0.8)
            : undefined,
        width: video.videoWidth,
      });
    };
    video.onerror = () => reject(mediaError("unsupportedVideo"));
    video.src = previewUrl;
  });
  return {
    blob: file.slice(0, file.size, mimeType),
    duration: metadata.duration,
    fileName: file.name,
    height: metadata.height || null,
    mimeType,
    posterUrl: metadata.posterUrl,
    previewUrl,
    size: file.size,
    type: "video",
    width: metadata.width || null,
  };
}

export async function prepareAudio(file: File): Promise<PreparedMedia> {
  const extension = fileExtension(file.name);
  const mimeType = audioMimeByExtension[extension];
  const normalizedFileType =
    file.type === "audio/x-wav" ? "audio/wav" : file.type;
  const compatibleType =
    !normalizedFileType ||
    normalizedFileType === mimeType ||
    (extension === "m4a" && normalizedFileType === "audio/x-m4a");
  if (!mimeType || !compatibleType) throw mediaError("unsupportedAudio");
  if (file.size > AUDIO_MAX_BYTES) throw mediaError("audioTooLarge");
  return {
    blob: file.slice(0, file.size, mimeType),
    duration: await readDuration(file, "audio"),
    fileName: file.name,
    height: null,
    mimeType,
    previewUrl: URL.createObjectURL(file),
    size: file.size,
    type: "audio",
    width: null,
  };
}

function encodeMonoWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (offset: number, value: string) =>
    [...value].forEach((character, index) =>
      view.setUint8(offset + index, character.charCodeAt(0)),
    );
  write(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, index) =>
    view.setInt16(
      44 + index * 2,
      Math.max(-1, Math.min(1, sample)) * 0x7fff,
      true,
    ),
  );
  return new Blob([buffer], { type: "audio/wav" });
}

export async function recordingToWav(
  recording: Blob,
  fileName: string,
): Promise<PreparedMedia> {
  try {
    const audioContext = new AudioContext();
    const decoded = await audioContext.decodeAudioData(
      await recording.arrayBuffer(),
    );
    await audioContext.close();
    const targetRate = 16000;
    const targetLength = Math.ceil(decoded.duration * targetRate);
    const mono = new Float32Array(targetLength);
    for (let index = 0; index < targetLength; index += 1) {
      const sourceIndex = Math.min(
        decoded.length - 1,
        Math.floor((index * decoded.sampleRate) / targetRate),
      );
      let value = 0;
      for (let channel = 0; channel < decoded.numberOfChannels; channel += 1)
        value += decoded.getChannelData(channel)[sourceIndex] ?? 0;
      mono[index] = value / decoded.numberOfChannels;
    }
    const blob = encodeMonoWav(mono, targetRate);
    if (blob.size > AUDIO_MAX_BYTES) throw mediaError("audioTooLarge");
    return {
      blob,
      duration: Math.round(decoded.duration),
      fileName,
      height: null,
      mimeType: "audio/wav",
      previewUrl: URL.createObjectURL(blob),
      size: blob.size,
      type: "audio",
      width: null,
    };
  } catch (error) {
    if (error instanceof Error && "code" in error) throw error;
    throw mediaError("recordingFailed");
  }
}

export async function prepareMedia(file: File, type: MediaType) {
  if (type === "photo") return preparePhoto(file);
  if (type === "video") return prepareVideo(file);
  return prepareAudio(file);
}
