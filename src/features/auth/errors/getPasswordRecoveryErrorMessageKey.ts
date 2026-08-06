import type { AuthErrorCode } from "@/features/auth/errors/AuthError";

export type PasswordRecoveryErrorMessageKey =
  | "errors.expiredLink"
  | "errors.network"
  | "errors.rateLimited"
  | "errors.unknown"
  | "errors.samePassword"
  | "errors.weakPassword";

const PASSWORD_RECOVERY_ERROR_MESSAGE_KEYS: Record<
  AuthErrorCode,
  PasswordRecoveryErrorMessageKey
> = {
  EMAIL_NOT_VERIFIED: "errors.unknown",
  INVALID_CREDENTIALS: "errors.unknown",
  NETWORK_ERROR: "errors.network",
  RATE_LIMITED: "errors.rateLimited",
  SAME_PASSWORD: "errors.samePassword",
  RESET_LINK_INVALID: "errors.expiredLink",
  SESSION_EXPIRED: "errors.expiredLink",
  UNKNOWN: "errors.unknown",
  USER_ALREADY_REGISTERED: "errors.unknown",
  WEAK_PASSWORD: "errors.weakPassword",
};

export function getPasswordRecoveryErrorMessageKey(
  code: AuthErrorCode,
): PasswordRecoveryErrorMessageKey {
  return PASSWORD_RECOVERY_ERROR_MESSAGE_KEYS[code];
}
