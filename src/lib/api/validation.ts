import type { ZodType } from "zod";
import { AppError } from "@/lib/errors";

export async function parseRequestBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    throw new AppError({
      cause: error,
      code: "BAD_REQUEST",
      message: "Request body must be valid JSON.",
      status: 400,
    });
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      details: result.error.flatten(),
      message: "Validation failed.",
      status: 422,
    });
  }

  return result.data;
}
