import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AUTH_REDIRECTS } from "@/features/auth/constants/routes";
import { getVerifiedSessionClaims } from "@/lib/supabase/session";

type ProtectedRouteProps = Readonly<{
  children: ReactNode;
  redirectTo?: string;
}>;

export async function ProtectedRoute({
  children,
  redirectTo = AUTH_REDIRECTS.unauthenticated,
}: ProtectedRouteProps) {
  const claims = await getVerifiedSessionClaims();

  if (typeof claims?.sub !== "string") {
    redirect(redirectTo);
  }

  return children;
}
