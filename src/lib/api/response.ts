import { NextResponse } from "next/server";
import { normalizeError } from "@/lib/errors";
import type { ApiFailure, ApiFieldError, ApiSuccess } from "@/lib/api/types";

export function apiSuccess<T>(
  data: T,
  options: { message?: string | null; status?: number } = {},
) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    message: options.message ?? null,
  };

  return NextResponse.json(body, { status: options.status ?? 200 });
}

export function apiFailure(error: unknown, errors: ApiFieldError[] = []) {
  const normalizedError = normalizeError(error);
  const body: ApiFailure = {
    success: false,
    message: normalizedError.message,
    errors,
  };

  return NextResponse.json(body, { status: normalizedError.status });
}
