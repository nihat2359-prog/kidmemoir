import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getClientEnvironment } from "@/lib/env/client";
import { createServerCookieAdapter } from "@/lib/supabase/cookies";
import type { Database } from "@/types/database.types";

export async function createClient() {
  const cookieStore = await cookies();
  const environment = getClientEnvironment();

  return createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { cookies: createServerCookieAdapter(cookieStore) },
  );
}
