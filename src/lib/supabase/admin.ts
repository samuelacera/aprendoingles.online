import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Bypasses RLS — use ONLY in server code (API routes,
 * server actions, webhooks) and NEVER expose to the browser.
 *
 * All authoritative writes (enrollments, progress, activity, subscriptions)
 * go through this client AFTER the caller has been authenticated and the
 * action validated. The DB has no user-facing write policies, so this is the
 * only path that can mutate those tables.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
