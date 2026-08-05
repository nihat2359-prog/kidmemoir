import {
  AUTH_REDIRECTS,
  PROTECTED_ROUTE_PREFIXES,
  PUBLIC_AUTH_ROUTES,
} from "@/features/auth/constants/routes";

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix),
  );
}

export function isPublicAuthRoute(pathname: string): boolean {
  return PUBLIC_AUTH_ROUTES.some((route) => matchesPrefix(pathname, route));
}

export function getSafeRedirectPath(
  value: string | null,
  fallback = AUTH_REDIRECTS.authenticated,
): string {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function getRouteRedirect(
  pathname: string,
  isAuthenticated: boolean,
): string | null {
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return `${AUTH_REDIRECTS.unauthenticated}?next=${encodeURIComponent(pathname)}`;
  }

  if (isAuthenticated && isPublicAuthRoute(pathname)) {
    return AUTH_REDIRECTS.authenticated;
  }

  return null;
}
