import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const createClient = () => {
  const { url, anonKey } = getSupabaseConfig();

  return createBrowserClient(url, anonKey);
};
