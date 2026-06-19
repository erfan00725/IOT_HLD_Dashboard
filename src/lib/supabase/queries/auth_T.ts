import { createClient } from "../client";

/**
 * Sign in a user with email and password using Supabase.
 * @returns the Supabase auth response data (user + session)
 */
export async function login(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export default login;

/**
 * Store the raw access token. On the client this uses `localStorage`.
 * On the server it stores the token as an HTTP-only cookie using `next/headers`.
 */
export async function storeAccessToken(token: string): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("supabase_access_token", token);
      return;
    } catch (e) {
      console.error("storeAccessToken error:", e);
      return;
    }
  }

  try {
    const nh = await import("next/headers");
    const cookieStore = nh.cookies();
    (await cookieStore).set("supabase_access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (e) {
    console.error("storeAccessToken (server) error:", e);
  }
}

/**
 * Retrieve the access token. Returns `null` if not found.
 */
export async function getAccessToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    try {
      return window.localStorage.getItem("supabase_access_token");
    } catch (e) {
      console.error("getAccessToken error:", e);
      return null;
    }
  }

  try {
    const nh = await import("next/headers");
    const cookieStore = nh.cookies();
    const cookie = (await cookieStore).get("supabase_access_token");
    return cookie?.value ?? null;
  } catch (e) {
    console.error("getAccessToken (server) error:", e);
    return null;
  }
}

/**
 * Remove the access token from storage/cookies.
 */
export async function deleteAccessToken(): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem("supabase_access_token");
      return;
    } catch (e) {
      console.error("deleteAccessToken error:", e);
      return;
    }
  }

  try {
    const nh = await import("next/headers");
    const cookieStore = nh.cookies();
    (await cookieStore).delete("supabase_access_token");
  } catch (e) {
    console.error("deleteAccessToken (server) error:", e);
  }
}
