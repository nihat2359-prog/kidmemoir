"use server";

import { generateContent } from "@/features/programmatic-seo/content-generation";
import type { ContentGenerationResult } from "@/features/programmatic-seo/content-generation";

export type DevGeneratorState = Readonly<{
  error: string | null;
  result: ContentGenerationResult | null;
}>;

export async function generateDevelopmentContent(
  _previous: DevGeneratorState,
  formData: FormData,
): Promise<DevGeneratorState> {
  if (process.env.NODE_ENV !== "development") {
    return { error: "DEVELOPMENT_ONLY", result: null };
  }
  try {
    const result = await generateContent(
      {
        locale: formData.get("locale") === "tr" ? "tr" : "en",
        template: String(formData.get("template") ?? "guide") as Parameters<
          typeof generateContent
        >[0]["template"],
        topic: String(formData.get("topic") ?? ""),
      },
      { persist: false },
    );
    return { error: null, result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "GENERATION_FAILED",
      result: null,
    };
  }
}
