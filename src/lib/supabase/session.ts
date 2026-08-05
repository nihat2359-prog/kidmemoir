import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getVerifiedSessionClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function getSessionUserId(): Promise<string | null> {
  const claims = await getVerifiedSessionClaims();
  return typeof claims?.sub === "string" ? claims.sub : null;
}
