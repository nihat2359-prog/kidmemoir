import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import type { SignInCredentials } from "@/features/auth/types/auth.types";
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

    async signInWithPassword(credentials: SignInCredentials) {
      const { data, error } =
        await supabase.auth.signInWithPassword(credentials);

      if (error) {
        throw normalizeAuthError(error);
      }

      return data;
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
