import { AuthApiError } from "@supabase/supabase-js";
import { AuthError } from "@/features/auth/errors/AuthError";

const ERROR_MESSAGES = {
  emailNotVerified: "Email address must be verified.",
  invalidCredentials: "Email or password is incorrect.",
  userAlreadyRegistered: "An account already exists for this email address.",
  weakPassword: "Password does not meet the security requirements.",
  samePassword: "New password must be different from the current password.",
  network: "Authentication service is unavailable.",
  rateLimited: "Too many authentication attempts.",
  resetLinkInvalid: "The password reset link is invalid or has expired.",
  sessionExpired: "Your session has expired.",
  unknown: "Authentication could not be completed.",
} as const;

export function normalizeAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error;
  }

  if (error instanceof AuthApiError) {
    if (error.status === 429) {
      return new AuthError("RATE_LIMITED", ERROR_MESSAGES.rateLimited, {
        cause: error,
      });
    }

    if (error.code === "email_not_confirmed") {
      return new AuthError(
        "EMAIL_NOT_VERIFIED",
        ERROR_MESSAGES.emailNotVerified,
        { cause: error },
      );
    }

    if (error.code === "invalid_credentials") {
      return new AuthError(
        "INVALID_CREDENTIALS",
        ERROR_MESSAGES.invalidCredentials,
        { cause: error },
      );
    }

    if (
      error.code === "user_already_exists" ||
      error.code === "user_already_registered"
    ) {
      return new AuthError(
        "USER_ALREADY_REGISTERED",
        ERROR_MESSAGES.userAlreadyRegistered,
        { cause: error },
      );
    }

    if (error.code === "weak_password") {
      return new AuthError("WEAK_PASSWORD", ERROR_MESSAGES.weakPassword, {
        cause: error,
      });
    }

    if (error.code === "same_password") {
      return new AuthError("SAME_PASSWORD", ERROR_MESSAGES.samePassword, {
        cause: error,
      });
    }

    if (error.code === "refresh_token_not_found") {
      return new AuthError("SESSION_EXPIRED", ERROR_MESSAGES.sessionExpired, {
        cause: error,
      });
    }

    if (
      error.code === "bad_code_verifier" ||
      error.code === "flow_state_expired" ||
      error.code === "flow_state_not_found" ||
      error.code === "otp_expired" ||
      error.code === "session_not_found"
    ) {
      return new AuthError(
        "RESET_LINK_INVALID",
        ERROR_MESSAGES.resetLinkInvalid,
        { cause: error },
      );
    }
  }

  if (
    error instanceof TypeError ||
    (error instanceof Error && error.name === "AuthRetryableFetchError")
  ) {
    return new AuthError("NETWORK_ERROR", ERROR_MESSAGES.network, {
      cause: error,
    });
  }

  return new AuthError("UNKNOWN", ERROR_MESSAGES.unknown, { cause: error });
}
