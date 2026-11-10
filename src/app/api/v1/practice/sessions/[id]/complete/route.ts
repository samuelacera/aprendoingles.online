import { getApiUser } from "@/lib/api/auth";
import { apiError, apiOk, apiOptions, guard } from "@/lib/api/response";
import { createAdminClient } from "@/lib/supabase/admin";
import { AGENT_ID, getConversation, getPracticeScenario } from "@/lib/practice";
import { EVALUATOR_MODEL, countLearnerWords, evaluateCall, stripAudioTags } from "@/lib/practice-eval";

export const dynamic = "force-dynamic";
// The evaluation is one Claude call; give it room on Vercel.
export const maxDuration = 120;
export const OPTIONS = apiOptions;

const UUID = /^[0-9a-f-]{36}$/i;
const CONV = /^conv_[a-z0-9]{10,60}$/i;

/** Below this many learner words there is nothing to grade. */
const MIN_WORDS = 12;

const PUBLIC_FIELDS =
  "id, status, duration_seconds, overall_score, goal_achieved, cefr_estimate, scores, feedback";

/**
 * POST /api/v1/practice/sessions/:id/complete   { conversationId }
 *
 * Called by the client after hanging up, and polled until it answers
 * { ready: true }. ElevenLabs needs a few seconds to close the transcript;
 * meanwhile this returns { ready: false }. Idempotent: a session already
 * evaluated returns the stored result, and a conditional status update
 * makes sure two polls never pay for two evaluations.
 *
 * The conversation is trusted only if it belongs to our agent AND carries
 * this session id in its dynamic variables.
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
    const { data: row, error } = await admin
      .from("practice_sessions")
      .select("*") // works before and after migration 005 (guided)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!row || row.user_id !== user.id) return apiError("not_found", "Sesión no encontrada.");

    if (row.status === "evaluated") return apiOk({ ready: true, session: publicView(row) });
    if (row.status === "failed") return apiError("conflict", "Esta llamada no se pudo evaluar.");

    const body = await request.json().catch(() => ({}));
    const conversationId: string | null =
      row.elevenlabs_conversation_id ??
      (typeof body?.conversationId === "string" && CONV.test(body.conversationId)
        ? body.conversationId
        : null);
    if (!conversationId) return apiError("bad_request", "Falta la llamada.");

    const conversation = await getConversation(conversationId);
    const ownSession =
      conversation.conversation_initiation_client_data?.dynamic_variables?.session_id === id;
    if (conversation.agent_id !== AGENT_ID || !ownSession) {
      return apiError("forbidden", "Esa llamada no corresponde a esta práctica.");
    }

    if (!row.elevenlabs_conversation_id) {
      await admin
        .from("practice_sessions")
        .update({ elevenlabs_conversation_id: conversationId, status: "connected" })
        .eq("id", id)
        .is("elevenlabs_conversation_id", null);
    }

    if (conversation.status === "failed") {
      await admin.from("practice_sessions").update({ status: "failed" }).eq("id", id);
      return apiError("conflict", "La llamada se cortó antes de tiempo.");
    }
    if (conversation.status !== "done") return apiOk({ ready: false });

    // Lock: only the poll that flips the status runs the evaluation.
    const { data: locked } = await admin
      .from("practice_sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", id)
      .in("status", ["started", "connected"])
      .select("id");
    if (!locked?.length) return apiOk({ ready: false });

    const transcript = conversation.transcript ?? [];
    const durationSeconds = Math.round(conversation.metadata?.call_duration_secs ?? 0);
    const scenario = await getPracticeScenario(row.course_slug, row.lesson_slug, user.email ?? null);
    if (!scenario) {
      await admin.from("practice_sessions").update({ status: "failed" }).eq("id", id);
      return apiError("not_found", "La práctica de esta lección ya no existe.");
    }

    const words = countLearnerWords(transcript);
    const update =
      words < MIN_WORDS
        ? tooShort(durationSeconds)
        : await evaluateCall({
            scenario,
            englishLevel: row.english_level ?? "B1",
            guided: row.guided === true,
            transcript,
            durationSeconds,
          }).then((e) => ({
            overall_score: e.overall,
            goal_achieved: e.goal_achieved,
            cefr_estimate: e.cefr_estimate,
            scores: e.scores,
            feedback: {
              summary: e.summary,
              strengths: e.strengths,
              corrections: e.corrections,
              phrases_used: e.phrases_used,
              next_focus: e.next_focus,
              guided: row.guided === true,
            },
            evaluator_model: EVALUATOR_MODEL,
          }))
          .catch(async (err) => {
            // Let a later poll retry the evaluation.
            await admin.from("practice_sessions").update({ status: "connected" }).eq("id", id);
            throw err;
          });

    const { data: saved, error: saveError } = await admin
      .from("practice_sessions")
      .update({
        ...update,
        status: "evaluated",
        duration_seconds: durationSeconds,
        transcript: transcript.map((t) => ({
          role: t.role,
          text: t.message ? stripAudioTags(t.message) : null,
          t: t.time_in_call_secs,
        })),
        evaluated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(PUBLIC_FIELDS)
      .single();
    if (saveError) throw saveError;

    await admin.from("activity_log").insert({
      user_id: user.id,
      activity: "practice_call",
      course_slug: row.course_slug,
      lesson_slug: row.lesson_slug,
      metadata: {
        practice_session_id: id,
        scenario_key: scenario.key,
        duration_seconds: durationSeconds,
        overall_score: update.overall_score,
      },
    });

    return apiOk({ ready: true, session: publicView(saved) });
  });
}

function tooShort(durationSeconds: number) {
  return {
    overall_score: 0,
    goal_achieved: false,
    cefr_estimate: null,
    scores: null,
    feedback: {
      summary:
        durationSeconds < 20
          ? "La llamada ha sido demasiado corta para darte una nota. Vuelve a llamar y lánzate: equivocarse aquí es gratis."
          : "Apenas te hemos oído hablar, así que no hay mucho que corregir. Prueba otra vez y habla tú más que el personaje.",
      strengths: [],
      corrections: [],
      phrases_used: [],
      next_focus: "Abre la llamada con tu nombre, tu empresa y el motivo en una sola frase.",
    },
    evaluator_model: null,
  };
}

function publicView(row: Record<string, unknown>) {
  return {
    id: row.id,
    durationSeconds: row.duration_seconds,
    overall: row.overall_score,
    goalAchieved: row.goal_achieved,
    cefr: row.cefr_estimate,
    scores: row.scores,
    feedback: row.feedback,
  };
}
