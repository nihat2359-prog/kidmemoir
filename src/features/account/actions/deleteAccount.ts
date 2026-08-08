"use server";

import { z } from "zod";
import { lemonBillingService } from "@/features/billing/services/lemonBillingService";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/supabase/auth";

const BUCKETS = ["avatars", "event-media", "documents", "exports"] as const;
async function listFiles(
  bucket: (typeof BUCKETS)[number],
  prefix: string,
): Promise<string[]> {
  const admin = createAdminClient();
  const files: string[] = [];
  let offset = 0;
  while (true) {
    const result = await admin.storage.from(bucket).list(prefix, {
      limit: 100,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (result.error)
      throw new Error("ACCOUNT_STORAGE_LIST_FAILED", { cause: result.error });
    const rows = result.data ?? [];
    for (const row of rows) {
      const path = `${prefix}/${row.name}`;
      if (row.id) files.push(path);
      else files.push(...(await listFiles(bucket, path)));
    }
    if (rows.length < 100) break;
    offset += rows.length;
  }
  return files;
}
export async function deleteAccountAction(confirmation: string) {
  if (!z.literal("DELETE").safeParse(confirmation).success)
    return { error: "confirmation" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  const admin = createAdminClient();
  const subscription = await admin
    .from("subscriptions")
    .select("provider_subscription_id,status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (subscription.error)
    return { error: "database" as const, success: false as const };
  try {
    if (
      subscription.data?.provider_subscription_id &&
      ["active", "trialing", "past_due"].includes(subscription.data.status)
    )
      await lemonBillingService.cancelSubscription(
        subscription.data.provider_subscription_id,
      );
    for (const bucket of BUCKETS) {
      const files = await listFiles(bucket, user.id);
      for (let index = 0; index < files.length; index += 100) {
        const removed = await admin.storage
          .from(bucket)
          .remove(files.slice(index, index + 100));
        if (removed.error)
          throw new Error("ACCOUNT_STORAGE_DELETE_FAILED", {
            cause: removed.error,
          });
      }
    }
    const deleted = await admin.auth.admin.deleteUser(user.id);
    if (deleted.error)
      throw new Error("ACCOUNT_AUTH_DELETE_FAILED", { cause: deleted.error });
    return { success: true as const };
  } catch (error) {
    console.error(
      "Account deletion failed",
      error instanceof Error ? error.message : "unknown",
    );
    return { error: "failed" as const, success: false as const };
  }
}
