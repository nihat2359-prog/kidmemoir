export const RECOVERY_CONFIRMATION_COOKIE_NAME = "km-recovery-otp";
export const RECOVERY_VERIFIED_COOKIE_NAME = "km-recovery-verified";
export const RECOVERY_CONFIRMATION_COOKIE_MAX_AGE = 10 * 60;

export function getRecoveryTokenCookieOptions() {
  return {
    httpOnly: true,
    maxAge: RECOVERY_CONFIRMATION_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function getRecoveryVerifiedCookieOptions() {
  return {
    httpOnly: true,
    maxAge: RECOVERY_CONFIRMATION_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}
