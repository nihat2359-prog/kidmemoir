import "server-only";

import type { CookieOptions } from "@supabase/ssr";
import type { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export type CookieToSet = {
  name: string;
  options: CookieOptions;
  value: string;
};

type ServerCookieStore = Awaited<ReturnType<typeof cookies>>;

export function createServerCookieAdapter(cookieStore: ServerCookieStore) {
  return {
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet: CookieToSet[]) => {
      try {
        cookiesToSet.forEach(({ name, options, value }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Server Components cannot write cookies. The proxy refreshes auth cookies.
      }
    },
  };
}

export function applyCookiesToRequest(
  request: NextRequest,
  cookiesToSet: CookieToSet[],
) {
  cookiesToSet.forEach(({ name, value }) => {
    request.cookies.set(name, value);
  });
}

export function applyCookiesToResponse(
  response: NextResponse,
  cookiesToSet: CookieToSet[],
  headers: Record<string, string>,
) {
  cookiesToSet.forEach(({ name, options, value }) => {
    response.cookies.set(name, value, options);
  });

  Object.entries(headers).forEach(([name, value]) => {
    response.headers.set(name, value);
  });
}
