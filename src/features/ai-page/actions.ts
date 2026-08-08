"use server";
import { z } from "zod";
import { semanticMemorySearch } from "@/features/ai/services/intelligenceService";
import { getCurrentUser } from "@/lib/supabase/auth";
const schema = z.object({
  childId: z.string().uuid(),
  query: z.string().trim().min(2).max(500),
});
export async function searchAiMemories(input: {
  childId: string;
  query: string;
}) {
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return { error: "validation" as const, success: false as const };
  const user = await getCurrentUser();
  if (!user) return { error: "unauthorized" as const, success: false as const };
  try {
    return {
      data: await semanticMemorySearch(
        user,
        parsed.data.childId,
        parsed.data.query,
      ),
      success: true as const,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error && error.message === "AI_PREMIUM_REQUIRED"
          ? ("premium" as const)
          : ("failed" as const),
      success: false as const,
    };
  }
}
