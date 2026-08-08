import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AuthError,
  type AuthErrorCode,
} from "@/features/auth/errors/AuthError";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import type {
  SignInCredentials,
  PasswordResetRequest,
  OAuthSignInRequest,
  SignUpCredentials,
} from "@/features/auth/types/auth.types";
import { getClientEnvironment } from "@/lib/env/client";
import type { Database } from "@/types/database.types";

export function createAuthService(supabase: SupabaseClient<Database>) {
  return {
    async getSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw normalizeAuthError(error);
      }

      return data.session;
    },

    async refreshSession() {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw normalizeAuthError(error);
      }

      return data.session;
    },

    async signInWithPassword({ email, password }: SignInCredentials) {
      const response = await fetch("/auth/login", {
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          code?: AuthErrorCode;
        } | null;
        throw new AuthError(
          body?.code ?? "UNKNOWN",
          "Authentication could not be completed.",
        );
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) throw normalizeAuthError(error);
      if (!data.session) {
        throw new AuthError(
          "SESSION_EXPIRED",
          "Authentication session was not persisted.",
        );
      }

      return data.session;
    },

    async signInWithOAuth({ provider, redirectTo }: OAuthSignInRequest) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw normalizeAuthError(error);
      return data;
    },

    async signUp({
      email,
      emailRedirectTo,
      firstName,
      lastName,
      password,
    }: SignUpCredentials) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo,
        },
      });

      if (error) {
        throw normalizeAuthError(error);
      }

      return data;
    },

    async requestPasswordReset({ email, redirectTo }: PasswordResetRequest) {
      const environment = getClientEnvironment();
      const recoveryUrl = new URL(
        "/auth/v1/recover",
        environment.NEXT_PUBLIC_SUPABASE_URL,
      );
      recoveryUrl.searchParams.set("redirect_to", redirectTo);
      const response = await fetch(recoveryUrl, {
        body: JSON.stringify({
          code_challenge: null,
          code_challenge_method: null,
          email,
          gotrue_meta_security: {},
        }),
        headers: {
          apikey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          code?: AuthErrorCode;
        } | null;
        throw new AuthError(
          body?.code ?? "UNKNOWN",
          "Password reset request failed.",
        );
      }
    },

    async updatePassword(password: string) {
      const { data, error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw normalizeAuthError(error);
      }

      return data.user;
    },

    async signOut() {
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        throw normalizeAuthError(error);
      }
    },
  } as const;
}

export type AuthService = ReturnType<typeof createAuthService>;
