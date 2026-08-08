"use client";

import { createContext, useCallback, useMemo, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type {
  AuthPermission,
  AuthRole,
  AuthState,
  PasswordResetRequest,
  OAuthSignInRequest,
  SignInCredentials,
  SignUpCredentials,
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
    requestPasswordReset: (request: PasswordResetRequest) => Promise<void>;
    signIn: (credentials: SignInCredentials) => Promise<Session | null>;
    signInWithOAuth: (request: OAuthSignInRequest) => Promise<void>;
    signUp: (credentials: SignUpCredentials) => Promise<User | null>;
    signOut: () => Promise<void>;
    updatePassword: (password: string) => Promise<User>;
  }>;

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    error,
    isLoading,
    refreshSession,
    requestPasswordReset,
    session,
    signIn,
    signInWithOAuth,
    signOut,
    signUp,
    updatePassword,
  } = useSession();
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
      requestPasswordReset,
      session,
      signIn,
      signInWithOAuth,
      signUp,
      signOut,
      user,
      updatePassword,
    }),
    [
      error,
      hasPermission,
      hasRole,
      isLoading,
      refreshSession,
      requestPasswordReset,
      session,
      signIn,
      signInWithOAuth,
      signUp,
      signOut,
      user,
      updatePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
