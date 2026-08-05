import type { Session, User } from "@supabase/supabase-js";

export type AuthRole = "admin" | "user";

export type AuthPermission =
  "account:read" | "account:write" | "admin:read" | "admin:write";

export type AuthState = Readonly<{
  error: Error | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
}>;

export type SignInCredentials = Readonly<{
  email: string;
  password: string;
}>;
