import { z } from "zod";
import type { TimelineFiltersValue } from "@/features/timeline/types/timeline.types";

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .or(z.literal(""));
const schema = z.object({
  categoryId: z.string().uuid().or(z.literal("")),
  favorite: z.boolean(),
  from: date,
  query: z.string().trim().max(100),
  to: date,
  type: z.enum(["all", "photo", "video", "audio", "written"]),
});

export function parseTimelineFilters(
  input: Record<string, string | string[] | undefined>,
): TimelineFiltersValue {
  const parsed = schema.safeParse({
    categoryId: typeof input.category === "string" ? input.category : "",
    favorite: input.favorite === "true",
    from: typeof input.from === "string" ? input.from : "",
    query: typeof input.q === "string" ? input.q : "",
    to: typeof input.to === "string" ? input.to : "",
    type: typeof input.type === "string" ? input.type : "all",
  });
  return parsed.success
    ? parsed.data
    : {
        categoryId: "",
        favorite: false,
        from: "",
        query: "",
        to: "",
        type: "all",
      };
}
