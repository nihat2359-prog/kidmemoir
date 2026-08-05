"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import { createAuthService } from "@/features/auth/services/authService";
import type { SignInCredentials } from "@/features/auth/types/auth.types";
import { createClient } from "@/lib/supabase/client";

export type SessionContextValue = Readonly<{
  error: Error | null;
  isLoading: boolean;
  refreshSession: () => Promise<Session | null>;
  session: Session | null;
  signIn: (credentials: SignInCredentials) => Promise<Session | null>;
  signOut: () => Promise<void>;
}>;

export const SessionContext = createContext<SessionContextValue | null>(null);

type SessionProviderProps = Readonly<{
  children: ReactNode;
}>;

export function SessionProvider({ children }: SessionProviderProps) {
  const supabase = useMemo(() => createClient(), []);
  const authService = useMemo(() => createAuthService(supabase), [supabase]);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const refreshedSession = await authService.refreshSession();
      setSession(refreshedSession);
      return refreshedSession;
    } catch (refreshError) {
      const normalizedError = normalizeAuthError(refreshError);
      setError(normalizedError);
      setSession(null);
      throw normalizedError;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const signIn = useCallback(
    async (credentials: SignInCredentials) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await authService.signInWithPassword(credentials);
        setSession(result.session);
        return result.session;
      } catch (signInError) {
        const normalizedError = normalizeAuthError(signInError);
        setError(normalizedError);
        setSession(null);
        throw normalizedError;
      } finally {
        setIsLoading(false);
      }
    },
    [authService],
  );

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.signOut();
      setSession(null);
    } catch (signOutError) {
      const normalizedError = normalizeAuthError(signOutError);
      setError(normalizedError);
      throw normalizedError;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  useEffect(() => {
    let isMounted = true;

    void authService
      .getSession()
      .then((currentSession) => {
        if (isMounted) {
          setSession(currentSession);
          setError(null);
        }
      })
      .catch((sessionError: unknown) => {
        if (isMounted) {
          setError(normalizeAuthError(sessionError));
          setSession(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isMounted) {
        setSession(nextSession);
        setError(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [authService, supabase]);

  const value = useMemo<SessionContextValue>(
    () => ({
      error,
      isLoading,
      refreshSession,
      session,
      signIn,
      signOut,
    }),
    [error, isLoading, refreshSession, session, signIn, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
