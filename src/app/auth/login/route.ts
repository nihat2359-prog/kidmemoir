import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { normalizeAuthError } from "@/features/auth/errors/normalizeAuthError";
import { getClientEnvironment } from "@/lib/env/client";
import type { CookieToSet } from "@/lib/supabase/cookies";
import type { Database } from "@/types/database.types";

type LoginRequest = Readonly<{
  email?: unknown;
  password?: unknown;
}>;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as LoginRequest | null;

  if (typeof body?.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ code: "UNKNOWN" }, { status: 400 });
  }

  const environment = getClientEnvironment();
  const authCookies: CookieToSet[] = [];
  let authHeaders: Record<string, string> = {};
  const supabase = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          authCookies.push(...cookiesToSet);
          authHeaders = headers;
        },
      },
    },
  );

  const { error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error) {
    const normalizedError = normalizeAuthError(error);
    return NextResponse.json(
      { code: normalizedError.code },
      { status: error.status || 401 },
    );
  }

  const response = NextResponse.json({ authenticated: true });
  authCookies.forEach(({ name, options, value }) => {
    response.cookies.set(name, value, options);
  });
  Object.entries(authHeaders).forEach(([name, value]) => {
    response.headers.set(name, value);
  });

  return response;
}
