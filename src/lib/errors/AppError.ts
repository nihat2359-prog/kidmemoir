export type AppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "STORAGE_ERROR"
  | "INTERNAL_ERROR";

type AppErrorOptions = {
  cause?: unknown;
  code: AppErrorCode;
  details?: unknown;
  message: string;
  status: number;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly details?: unknown;
  readonly status: number;

  constructor({ cause, code, details, message, status }: AppErrorOptions) {
    super(message, { cause });
    this.name = "AppError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}
