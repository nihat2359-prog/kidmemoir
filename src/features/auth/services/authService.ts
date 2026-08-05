import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import type {
  SignInCredentials,
  SignUpCredentials,
} from "@/features/auth/types/auth.types";
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw normalizeAuthError(error);
      }

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

    async signOut() {
      const { error } = await supabase.auth.signOut({ scope: "local" });

      if (error) {
        throw normalizeAuthError(error);
      }
    },
  } as const;
}

export type AuthService = ReturnType<typeof createAuthService>;
