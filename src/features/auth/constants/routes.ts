export const AUTH_ROUTES = {
  forgotPassword: "/forgot-password",
  login: "/login",
  register: "/register",
  verifyEmail: "/verify-email",
} as const;

export const AUTH_REDIRECTS = {
  authenticated: "/children",
  unauthenticated: AUTH_ROUTES.login,
} as const;

export const PUBLIC_AUTH_ROUTES = Object.values(AUTH_ROUTES);

export const PROTECTED_ROUTE_PREFIXES = [
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
