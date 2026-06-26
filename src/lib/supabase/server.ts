import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

const currentUserCache = new Map<string, Promise<User | null>>();

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Reads and writes session from/to cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignore errors from Server Components — proxy handles token refresh
          }
        },
      },
    },
  );
}

async function getCookieCacheKey() {
  const cookieStore = cookies();
  const cookieEntries = (await cookieStore)
    .getAll()
    .map(({ name, value }) => `${name}=${value}`);
  return cookieEntries.sort().join(";");
}

/**
 * Returns the currently authenticated user for the current request.
 * Caches the result per request to avoid repeated Supabase auth calls.
 */
export async function getCurrentUser() {
  const key = await getCookieCacheKey();
  const cached = currentUserCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw new Error(error.message);
    return user;
  })();

  currentUserCache.set(key, promise);

  try {
    return await promise;
  } catch (error) {
    currentUserCache.delete(key);
    throw error;
  }
}

export async function getCurrentUserOrThrow() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");
  return user;
}
