"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

const mediaTypes = ["photo", "video", "audio"] as const;
const allowedMimeTypes = {
  audio: ["audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav"],
  photo: ["image/jpeg", "image/png", "image/webp"],
  video: ["video/mp4", "video/quicktime", "video/webm"],
} as const;
const limits = {
  audio: 25 * 1024 * 1024,
  photo: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
} as const;
const extensions: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

const grantSchema = z.object({
  childId: z.string().uuid(),
  eventId: z.string().uuid(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  type: z.enum(mediaTypes),
});

const finalizeSchema = grantSchema.extend({
  duration: z.number().int().nonnegative().nullable(),
  fileName: z.string().trim().min(1).max(1024),
  height: z.number().int().positive().nullable(),
  path: z.string().min(1).max(1024),
  width: z.number().int().positive().nullable(),
});

async function ownedEvent(eventId: string, childId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const [eventResult, childResult] = await Promise.all([
    supabase
      .from("events")
      .select("id,child_id")
      .eq("id", eventId)
      .eq("child_id", childId)
      .is("archived_at", null)
      .maybeSingle(),
    supabase
      .from("children")
      .select("id")
      .eq("id", childId)
      .eq("user_id", user.id)
      .is("archived_at", null)
      .maybeSingle(),
  ]);
  if (
    eventResult.error ||
    childResult.error ||
    !eventResult.data ||
    !childResult.data
  )
    return null;
  return { supabase, user };
}

function validMedia(
  type: keyof typeof allowedMimeTypes,
  mimeType: string,
  size: number,
) {
  return (
    (allowedMimeTypes[type] as readonly string[]).includes(mimeType) &&
    size <= limits[type]
  );
}

export async function createMediaUploadGrant(input: unknown) {
  const parsed = grantSchema.safeParse(input);
  if (
    !parsed.success ||
    !validMedia(parsed.data.type, parsed.data.mimeType, parsed.data.size)
  )
    return { error: "invalid" as const, success: false as const };
  const owner = await ownedEvent(parsed.data.eventId, parsed.data.childId);
  if (!owner)
    return { error: "unauthorized" as const, success: false as const };
  const extension = extensions[parsed.data.mimeType];
  if (!extension) return { error: "invalid" as const, success: false as const };
  const path = `${owner.user.id}/${parsed.data.childId}/${parsed.data.eventId}/${crypto.randomUUID()}.${extension}`;
  const result = await owner.supabase.storage
    .from("event-media")
    .createSignedUploadUrl(path, { upsert: true });
  if (result.error) {
    console.error("Media upload grant failed", result.error);
    return { error: "storage" as const, success: false as const };
  }
  return { path, signedUrl: result.data.signedUrl, success: true as const };
}

export async function finalizeEventMedia(input: unknown) {
  const parsed = finalizeSchema.safeParse(input);
  if (
    !parsed.success ||
    !validMedia(parsed.data.type, parsed.data.mimeType, parsed.data.size)
  )
    return { error: "invalid" as const, success: false as const };
  if ((parsed.data.width === null) !== (parsed.data.height === null))
    return { error: "invalid" as const, success: false as const };
  const owner = await ownedEvent(parsed.data.eventId, parsed.data.childId);
  if (!owner)
    return { error: "unauthorized" as const, success: false as const };
  const prefix = `${owner.user.id}/${parsed.data.childId}/${parsed.data.eventId}/`;
  const extension = extensions[parsed.data.mimeType];
  const objectName = parsed.data.path.slice(prefix.length);
  const safeObjectName = extension
    ? new RegExp(`^[0-9a-f-]{36}\\.${extension}$`, "i").test(objectName)
    : false;
  if (
    !parsed.data.path.startsWith(prefix) ||
    parsed.data.path.includes("..") ||
    !safeObjectName
  )
    return { error: "invalid" as const, success: false as const };

  const storedObject = await owner.supabase.storage
    .from("event-media")
    .info(parsed.data.path);
  if (
    storedObject.error ||
    storedObject.data.size !== parsed.data.size ||
    storedObject.data.contentType !== parsed.data.mimeType
  ) {
    if (!storedObject.error)
      await owner.supabase.storage
        .from("event-media")
        .remove([parsed.data.path]);
    return { error: "invalid" as const, success: false as const };
  }

  const result = await owner.supabase.from("event_media").insert({
    duration: parsed.data.duration,
    event_id: parsed.data.eventId,
    file_name: parsed.data.fileName.slice(0, 255),
    file_size: parsed.data.size,
    height: parsed.data.height,
    media_type: parsed.data.type,
    mime_type: parsed.data.mimeType,
    storage_path: parsed.data.path,
    width: parsed.data.width,
  });
  if (result.error) {
    console.error("Event media finalize failed", result.error);
    await owner.supabase.storage.from("event-media").remove([parsed.data.path]);
    return { error: "database" as const, success: false as const };
  }
  return { success: true as const };
}

export async function discardCreatedMemory(
  eventId: string,
  childId: string,
  path?: string,
) {
  const owner = await ownedEvent(eventId, childId);
  if (!owner) return;
  if (path) {
    const prefix = `${owner.user.id}/${childId}/${eventId}/`;
    if (path.startsWith(prefix) && !path.includes(".."))
      await owner.supabase.storage.from("event-media").remove([path]);
  }
  await Promise.all([
    owner.supabase.from("event_tags").delete().eq("event_id", eventId),
    owner.supabase.from("reminders").delete().eq("event_id", eventId),
    owner.supabase
      .from("events")
      .update({ archived_at: new Date().toISOString() })
      .eq("id", eventId),
  ]);
}

export async function removePendingMedia(
  eventId: string,
  childId: string,
  path: string,
) {
  const owner = await ownedEvent(eventId, childId);
  if (!owner) return;
  const prefix = `${owner.user.id}/${childId}/${eventId}/`;
  if (path.startsWith(prefix) && !path.includes(".."))
    await owner.supabase.storage.from("event-media").remove([path]);
}
