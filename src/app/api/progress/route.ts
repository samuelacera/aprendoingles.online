import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Max seconds a single heartbeat can add. Heartbeats fire ~every 30s, so this
// bounds how much a tampered client can inflate time per call. (A fully
// tamper-proof time record needs server-side timestamp diffing — see TODO.)
const MAX_HEARTBEAT_SECONDS = 90;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { courseSlug, lessonSlug, action, timeSpent, quizScore, quizTotal } = body;

  if (!courseSlug || !lessonSlug || !action) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const admin = createAdminClient();

  if (action === "start") {
    const { data: existing } = await admin
      .from("lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle();

    if (!existing) {
      await admin.from("lesson_progress").insert({
        user_id: user.id,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });

      await admin.from("activity_log").insert({
        user_id: user.id,
        activity: "lesson_start",
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
      });
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "time") {
    const seconds = Math.min(
      MAX_HEARTBEAT_SECONDS,
      Math.max(0, Number(timeSpent) || 0),
    );
    await admin.rpc("increment_time_spent", {
      p_user_id: user.id,
      p_course_slug: courseSlug,
      p_lesson_slug: lessonSlug,
      p_seconds: seconds,
    });

    return NextResponse.json({ ok: true });
  }

  if (action === "complete") {
    await admin
      .from("lesson_progress")
      .update({ completed_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("lesson_slug", lessonSlug)
      .is("completed_at", null); // don't overwrite the original completion time

    await admin.from("activity_log").insert({
      user_id: user.id,
      activity: "lesson_complete",
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
    });

    return NextResponse.json({ ok: true });
  }

  if (action === "quiz") {
    const score = Number(quizScore) || 0;
    const total = Number(quizTotal) || 0;

    await admin.rpc("increment_quiz_attempts", {
      p_user_id: user.id,
      p_course_slug: courseSlug,
      p_lesson_slug: lessonSlug,
      p_score: score,
      p_total: total,
    });

    await admin.from("activity_log").insert({
      user_id: user.id,
      activity: total > 0 && score === total ? "quiz_pass" : "quiz_attempt",
      course_slug: courseSlug,
      lesson_slug: lessonSlug,
      metadata: { score, total },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
