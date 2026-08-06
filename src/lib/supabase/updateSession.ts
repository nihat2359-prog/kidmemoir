import "server-only";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getRouteRedirect } from "@/features/auth/utils/routeGuard";
import { getClientEnvironment, hasSupabaseEnvironment } from "@/lib/env/client";
import {
  applyCookiesToRequest,
  applyCookiesToResponse,
  type CookieToSet,
} from "@/lib/supabase/cookies";
import type { Database } from "@/types/database.types";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnvironment() && process.env.NODE_ENV !== "production") {
    return NextResponse.next({ request });
  }

  const environment = getClientEnvironment();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (
          cookiesToSet: CookieToSet[],
          headers: Record<string, string>,
        ) => {
          applyCookiesToRequest(request, cookiesToSet);
          response = NextResponse.next({ request });
          applyCookiesToResponse(response, cookiesToSet, headers);
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthSuccessLogin =
    request.nextUrl.pathname === "/login" &&
    (request.nextUrl.searchParams.get("verified") === "true" ||
      request.nextUrl.searchParams.get("reset") === "success");
  const redirectPath = isAuthSuccessLogin
    ? null
    : getRouteRedirect(request.nextUrl.pathname, Boolean(user));

  if (redirectPath) {
    const redirectResponse = NextResponse.redirect(
      new URL(redirectPath, request.url),
    );

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return response;
}
