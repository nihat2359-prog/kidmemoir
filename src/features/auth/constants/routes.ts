export const AUTH_ROUTES = {
  bootstrap: "/bootstrap",
  forgotPassword: "/forgot-password",
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
} as const;

export const AUTH_REDIRECTS = {
  authenticated: AUTH_ROUTES.bootstrap,
  unauthenticated: AUTH_ROUTES.login,
} as const;

export const AUTH_VERIFICATION_REDIRECTS = {
  success: AUTH_ROUTES.login,
} as const;

export const AUTH_RECOVERY_REDIRECTS = {
  callback: "/auth/callback",
  prepare: "/auth/recovery-prepare",
  success: AUTH_ROUTES.resetPassword,
} as const;

export const PUBLIC_AUTH_ROUTES = [
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
  AUTH_ROUTES.verifyEmail,
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  AUTH_ROUTES.bootstrap,
  "/dashboard",
  "/onboarding",
  "/children",
  "/events",
  "/timeline",
  "/ai",
  "/files",
  "/reports",
  "/settings",
  "/subscription",
  "/notifications",
] as const;
