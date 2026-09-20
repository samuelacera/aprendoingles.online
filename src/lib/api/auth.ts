import type { User } from "@supabase/supabase-js";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createCookieClient } from "@/lib/supabase/server";

/**
 * Resolves the caller for an API route, supporting BOTH clients:
 *
 *   - Web  → Supabase session cookie (set by @supabase/ssr)
 *   - App  → `Authorization: Bearer <access_token>` (supabase_flutter)
 *
 * The Bearer token is verified against Supabase Auth on every call, so a
 * forged or expired JWT is rejected server-side. Never trust anything the
 * client sends about *who* it is beyond this function's return value.
 *
 * Returns null when there is no valid session.
 */
export async function getApiUser(request: Request): Promise<User | null> {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (!token) return null;

    // Stateless client: no cookies, no session persistence. getUser(token)
    // validates the JWT against the Auth server.
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    return error ? null : user;
  }

  const supabase = await createCookieClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
