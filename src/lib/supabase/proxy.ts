import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request.
 * This ensures Server Components always receive a valid, up-to-date session.
 *
 * IMPORTANT: Do not add code between createServerClient and getClaims().
 * Random logouts can occur if the token is not refreshed correctly.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Forward refreshed cookies to both request and response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          // Apply cache-control headers to prevent CDN caching of auth responses
          Object.entries(headers ?? {}).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Validate and refresh the session — must be called before any other Supabase calls
  await supabase.auth.getClaims();

  // Expose the current pathname to Server Components (e.g. for active nav state).
  // `headers()` in a Server Component can read this without opting the whole
  // tree into client-side routing knowledge.
  // supabaseResponse.headers.set("x-pathname", request.nextUrl.pathname)

  return supabaseResponse;
}
