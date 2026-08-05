import "server-only";

import { AppError } from "@/lib/errors";
import type {
  AuthPermission,
  AuthRole,
} from "@/features/auth/types/auth.types";
import {
  userHasPermission,
  userHasRole,
} from "@/features/auth/utils/authorization";
import { createClient } from "@/lib/supabase/server";
import { getVerifiedSessionClaims } from "@/lib/supabase/session";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function requireAuthenticatedUser() {
  const claims = await getVerifiedSessionClaims();

  if (!claims || typeof claims.sub !== "string") {
    throw new AppError({
      code: "UNAUTHORIZED",
      message: "Authentication is required.",
      status: 401,
    });
  }

  return claims;
}

export async function requireRole(role: AuthRole) {
  const user = await getCurrentUser();

  if (!user) {
    throw new AppError({
      code: "UNAUTHORIZED",
      message: "Authentication is required.",
      status: 401,
    });
  }

  if (!userHasRole(user, role)) {
    throw new AppError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource.",
      status: 403,
    });
  }

  return user;
}

export async function requirePermission(permission: AuthPermission) {
  const user = await getCurrentUser();

  if (!user) {
    throw new AppError({
      code: "UNAUTHORIZED",
      message: "Authentication is required.",
      status: 401,
    });
  }

  if (!userHasPermission(user, permission)) {
    throw new AppError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource.",
      status: 403,
    });
  }

  return user;
}
