import { AppError } from "@/lib/errors/AppError";

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError({
    cause: error,
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred.",
    status: 500,
  });
}
