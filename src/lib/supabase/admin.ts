import "server-only";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getClientEnvironment } from "@/lib/env/client";
import type { Database } from "@/types/database.types";

const serviceRoleSchema = z.string().min(1);

export function createAdminClient() {
  const environment = getClientEnvironment();
  const serviceRoleKey = serviceRoleSchema.parse(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  return createClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
