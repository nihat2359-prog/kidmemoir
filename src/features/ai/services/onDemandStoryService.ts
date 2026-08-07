import "server-only";

import { after } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  runAiJobById,
  runPendingMemoryInsightForChild,
} from "@/features/ai/services/aiWorker";
import { reportException } from "@/lib/monitoring";
import type { Database, Json } from "@/types/database.types";

export type OnDemandStoryKind = "monthly_story" | "weekly_story" | "year_book";

function record(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

export async function requestStoryOnDemand(
  supabase: SupabaseClient<Database>,
  childId: string,
  kind: OnDemandStoryKind,
) {
  const result = await supabase.rpc("request_ai_story", {
    target_child_id: childId,
    target_kind: kind,
  });
  if (result.error)
    throw new Error("AI_STORY_REQUEST_FAILED", { cause: result.error });
  const response = record(result.data);
  if (response.status !== "queued" || typeof response.jobId !== "string")
    return null;
  return response.jobId;
}

export function scheduleStoryJob(jobId: string, kind: OnDemandStoryKind) {
  after(async () => {
    try {
      await runAiJobById(jobId);
    } catch (error) {
      reportException(error, { jobId, operation: kind });
    }
  });
}

export async function scheduleDashboardAi(
  supabase: SupabaseClient<Database>,
  childId: string,
  premium: boolean,
) {
  const storyJobId = premium
    ? await requestStoryOnDemand(supabase, childId, "weekly_story")
    : null;
  after(async () => {
    try {
      const memoryResult = await runPendingMemoryInsightForChild(childId);
      if (!memoryResult && storyJobId) await runAiJobById(storyJobId);
    } catch (error) {
      reportException(error, {
        childId,
        operation: "dashboard_ai_on_demand",
      });
    }
  });
}
