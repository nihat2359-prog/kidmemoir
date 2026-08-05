import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AUTH_REDIRECTS } from "@/features/auth/constants/routes";
import { getVerifiedSessionClaims } from "@/lib/supabase/session";

type PublicRouteProps = Readonly<{
  children: ReactNode;
  redirectTo?: string;
}>;

export async function PublicRoute({
  children,
  redirectTo = AUTH_REDIRECTS.authenticated,
}: PublicRouteProps) {
  const claims = await getVerifiedSessionClaims();

  if (typeof claims?.sub === "string") {
    redirect(redirectTo);
  }

  return children;
}
