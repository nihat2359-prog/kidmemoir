import type { AuthErrorCode } from "@/features/auth/errors/AuthError";

export type RegisterErrorMessageKey =
  | "errors.alreadyRegistered"
  | "errors.network"
  | "errors.rateLimited"
  | "errors.unknown"
  | "errors.weakPassword";

const REGISTER_ERROR_MESSAGE_KEYS: Record<
  AuthErrorCode,
  RegisterErrorMessageKey
> = {
  EMAIL_NOT_VERIFIED: "errors.unknown",
  INVALID_CREDENTIALS: "errors.unknown",
  NETWORK_ERROR: "errors.network",
  RATE_LIMITED: "errors.rateLimited",
  SAME_PASSWORD: "errors.unknown",
  RESET_LINK_INVALID: "errors.unknown",
  SESSION_EXPIRED: "errors.unknown",
  UNKNOWN: "errors.unknown",
  USER_ALREADY_REGISTERED: "errors.alreadyRegistered",
  WEAK_PASSWORD: "errors.weakPassword",
};

export function getRegisterErrorMessageKey(
  code: AuthErrorCode,
): RegisterErrorMessageKey {
  return REGISTER_ERROR_MESSAGE_KEYS[code];
}
