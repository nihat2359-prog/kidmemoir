"use client";

import { createContext, useCallback, useMemo, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type {
  AuthPermission,
  AuthRole,
  AuthState,
  SignInCredentials,
} from "@/features/auth/types/auth.types";
import {
  userHasPermission,
  userHasRole,
} from "@/features/auth/utils/authorization";
import { useSession } from "@/features/auth/hooks/useSession";

export type AuthContextValue = AuthState &
  Readonly<{
    hasPermission: (permission: AuthPermission) => boolean;
    hasRole: (role: AuthRole) => boolean;
    refreshSession: () => Promise<Session | null>;
    signIn: (credentials: SignInCredentials) => Promise<Session | null>;
    signOut: () => Promise<void>;
  }>;

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const { error, isLoading, refreshSession, session, signIn, signOut } =
    useSession();
  const user: User | null = session?.user ?? null;
  const hasPermission = useCallback(
    (permission: AuthPermission) => userHasPermission(user, permission),
    [user],
  );
  const hasRole = useCallback(
    (role: AuthRole) => userHasRole(user, role),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      hasPermission,
      hasRole,
      isAuthenticated: Boolean(user),
      isLoading,
      refreshSession,
      session,
      signIn,
      signOut,
      user,
    }),
    [
      error,
      hasPermission,
      hasRole,
      isLoading,
      refreshSession,
      session,
      signIn,
      signOut,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
