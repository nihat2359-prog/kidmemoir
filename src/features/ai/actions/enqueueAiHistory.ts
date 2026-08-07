"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function enqueueAiHistory() {
  const user = await getCurrentUser();
  if (!user) return;
  const supabase = await createClient();
  const result = await supabase.rpc("enqueue_ai_history", {
    target_child_id: undefined,
  });
  if (result.error)
    throw new Error("AI_HISTORY_ENQUEUE_FAILED", { cause: result.error });
  revalidatePath("/", "layout");
}
