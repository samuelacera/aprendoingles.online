import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPracticeScenario } from "@/lib/practice";
import { MAX_HINTS_PER_CALL, suggestNext } from "@/lib/practice-hints";

export const dynamic = "force-dynamic";
export const maxDuration = 30;
export const OPTIONS = apiOptions;

const UUID = /^[0-9a-f-]{36}$/i;

/**
 * POST /api/v1/practice/sessions/:id/hint   { lines: [{ who: "me"|"them", text }] }
 *  → { suggestions: [{ en, es }] }
 *
 * "Modo guiado": 3 options for what to say next. Only for the learner's
 * own guided session while the call is open. The lines come from the
 * client (it has the live transcript); they only steer the suggestions.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return guard(async () => {
    const user = await getApiUser(request);
    if (!user) return apiError("unauthorized", "Inicia sesión para continuar.");

    const { id } = await params;
    if (!UUID.test(id)) return apiError("bad_request", "Sesión no válida.");

    const admin = createAdminClient();
    // select("*"): works before and after migration 005 (guided, hints_used).
    const { data: row, error } = await admin
      .from("practice_sessions")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!row || row.user_id !== user.id) return apiError("not_found", "Sesión no encontrada.");
    if (!["started", "connected"].includes(row.status)) {
      return apiError("conflict", "La llamada ya ha terminado.");
    }
    if (row.guided === false) return apiError("forbidden", "Esta llamada no es guiada.");
    if ((row.hints_used ?? 0) >= MAX_HINTS_PER_CALL) {
      return apiError("forbidden", "Ya no quedan sugerencias en esta llamada.");
    }

    const body = await request.json().catch(() => null);
    const lines = (Array.isArray(body?.lines) ? body.lines : [])
      .filter(
        (l: unknown): l is { who: "me" | "them"; text: string } =>
          !!l &&
          typeof l === "object" &&
          ((l as { who?: unknown }).who === "me" || (l as { who?: unknown }).who === "them") &&
          typeof (l as { text?: unknown }).text === "string",
      )
      .slice(-10)
      .map((l: { who: "me" | "them"; text: string }) => ({ who: l.who, text: l.text.slice(0, 500) }));

    const scenario = await getPracticeScenario(row.course_slug, row.lesson_slug);
    if (!scenario) return apiError("not_found", "Esta lección no tiene práctica por voz.");

    const learnerName =
      (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
      (user.user_metadata?.name as string | undefined)?.split(" ")[0] ||
      "Alex";

    const result = await suggestNext({
      scenario,
      englishLevel: row.english_level ?? "B1",
      learnerName,
      lines,
    });

    if (typeof row.hints_used === "number") {
      await admin
        .from("practice_sessions")
        .update({ hints_used: row.hints_used + 1 })
        .eq("id", id);
    }

    return apiOk(result);
  });
}
