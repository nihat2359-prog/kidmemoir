import type { User } from "@supabase/supabase-js";
import type {
  AuthPermission,
  AuthRole,
} from "@/features/auth/types/auth.types";

const ROLE_PERMISSIONS: Readonly<Record<AuthRole, readonly AuthPermission[]>> =
  {
    admin: ["account:read", "account:write", "admin:read", "admin:write"],
    user: ["account:read", "account:write"],
  };

export function getUserRole(user: User | null): AuthRole {
  return user?.app_metadata.role === "admin" ? "admin" : "user";
}

export function userHasRole(user: User | null, role: AuthRole): boolean {
  return Boolean(user) && getUserRole(user) === role;
}

export function userHasPermission(
  user: User | null,
  permission: AuthPermission,
): boolean {
  if (!user) {
    return false;
  }

  return ROLE_PERMISSIONS[getUserRole(user)].includes(permission);
}
