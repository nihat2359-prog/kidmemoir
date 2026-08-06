export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "USER_ALREADY_REGISTERED"
  | "WEAK_PASSWORD"
  | "SAME_PASSWORD"
  | "EMAIL_NOT_VERIFIED"
  | "SESSION_EXPIRED"
  | "RESET_LINK_INVALID"
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AuthError";
    this.code = code;
  }
}
