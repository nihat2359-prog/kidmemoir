import type { AuthErrorCode } from "@/features/auth/errors/AuthError";

export type LoginErrorMessageKey =
  | "errors.emailNotVerified"
  | "errors.invalidCredentials"
  | "errors.network"
  | "errors.rateLimited"
  | "errors.sessionExpired"
  | "errors.unknown";

const LOGIN_ERROR_MESSAGE_KEYS: Record<AuthErrorCode, LoginErrorMessageKey> = {
  EMAIL_NOT_VERIFIED: "errors.emailNotVerified",
  INVALID_CREDENTIALS: "errors.invalidCredentials",
  NETWORK_ERROR: "errors.network",
  RATE_LIMITED: "errors.rateLimited",
  SESSION_EXPIRED: "errors.sessionExpired",
  UNKNOWN: "errors.unknown",
  USER_ALREADY_REGISTERED: "errors.unknown",
  WEAK_PASSWORD: "errors.unknown",
};

export function getLoginErrorMessageKey(
  code: AuthErrorCode,
): LoginErrorMessageKey {
  return LOGIN_ERROR_MESSAGE_KEYS[code];
}
