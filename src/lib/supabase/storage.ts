import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "@/lib/errors";
import type { Database } from "@/types/database.types";

export const storageBuckets = {
  avatars: "avatars",
  documents: "documents",
  eventMedia: "event-media",
  exports: "exports",
} as const;

export type StorageBucket =
  (typeof storageBuckets)[keyof typeof storageBuckets];
type StorageBody = ArrayBuffer | Blob | Uint8Array;

function storageError(message: string, cause: unknown) {
  return new AppError({
    cause,
    code: "STORAGE_ERROR",
    message,
    status: 500,
  });
}

export async function uploadStorageObject(
  client: SupabaseClient<Database>,
  options: {
    body: StorageBody;
    bucket: StorageBucket;
    cacheControl?: string;
    contentType: string;
    path: string;
    upsert?: boolean;
  },
) {
  const { data, error } = await client.storage
    .from(options.bucket)
    .upload(options.path, options.body, {
      cacheControl: options.cacheControl,
      contentType: options.contentType,
      upsert: options.upsert ?? false,
    });

  if (error) {
    throw storageError("The file could not be uploaded.", error);
  }

  return data;
}

export async function createSignedStorageUrl(
  client: SupabaseClient<Database>,
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 60,
) {
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw storageError("A secure file URL could not be created.", error);
  }

  return data;
}

export async function removeStorageObjects(
  client: SupabaseClient<Database>,
  bucket: StorageBucket,
  paths: string[],
) {
  const { data, error } = await client.storage.from(bucket).remove(paths);

  if (error) {
    throw storageError("The files could not be removed.", error);
  }

  return data;
}
