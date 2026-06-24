import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCoursePrice } from "@/sanity/queries";

export async function POST(request: Request) {
  // 1. Authenticate the user (session client, RLS-bound)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { courseSlug } = await request.json();
  if (!courseSlug || typeof courseSlug !== "string") {
    return NextResponse.json({ error: "Falta courseSlug" }, { status: 400 });
  }

  // 2. Validate server-side that this course exists and is actually free.
  //    A free enrollment for a paid course must be rejected here — the client
  //    can never grant itself paid access (it has no write policy anyway).
  const price = await getCoursePrice(courseSlug);
  if (price === undefined) {
    return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
  }
  if (price > 0) {
    return NextResponse.json(
      { error: "Este curso es de pago. Usa el checkout." },
      { status: 402 },
    );
  }

  // 3. Authoritative write via service role.
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ enrolled: true, message: "Ya inscrito" });
  }

  const { error } = await admin.from("enrollments").insert({
    user_id: user.id,
    course_slug: courseSlug,
    enrollment_type: "free",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await admin.from("activity_log").insert({
    user_id: user.id,
    activity: "enrollment",
    course_slug: courseSlug,
    metadata: { type: "free" },
  });

  return NextResponse.json({ enrolled: true });
}
