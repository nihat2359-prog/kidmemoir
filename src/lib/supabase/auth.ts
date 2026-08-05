import "server-only";

import { AppError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import { getVerifiedSessionClaims } from "@/lib/supabase/session";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return data.user;
}

export async function requireAuthenticatedUser() {
  const claims = await getVerifiedSessionClaims();

  if (!claims || typeof claims.sub !== "string") {
    throw new AppError({
      code: "UNAUTHORIZED",
      message: "Authentication is required.",
      status: 401,
    });
  }

  return claims;
}
