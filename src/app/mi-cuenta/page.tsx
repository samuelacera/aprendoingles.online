import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Tu panel de aprendizaje en aprendoingles.online",
};

export default async function MiCuentaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("enrolled_at", { ascending: false });

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id);

  const progressByCoure = (progress ?? []).reduce<
    Record<string, { completed: number; total_time: number; best_score: number }>
  >((acc, p) => {
    if (!acc[p.course_slug]) acc[p.course_slug] = { completed: 0, total_time: 0, best_score: 0 };
    if (p.completed_at) acc[p.course_slug].completed++;
    acc[p.course_slug].total_time += p.time_spent_seconds;
    if (p.quiz_score && p.quiz_score > acc[p.course_slug].best_score) {
      acc[p.course_slug].best_score = p.quiz_score;
    }
    return acc;
  }, {});

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Alumno";

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="border-b border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold/15 text-gold rounded-full flex items-center justify-center text-xl font-bold">
              {displayName[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Hola, {displayName}</h1>
              <p className="text-foreground/50 text-sm">{user.email}</p>
            </div>
            <form action={logout} className="ml-auto">
              <button
                type="submit"
                className="text-sm text-foreground/60 hover:text-foreground border border-line px-4 py-2 rounded-lg transition-colors"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl font-semibold mb-6">Mis cursos</h2>

          {(!enrollments || enrollments.length === 0) ? (
            <div className="bg-surface border border-line rounded-xl p-8 text-center">
              <p className="text-foreground/50 mb-4">Aún no estás inscrito en ningún curso.</p>
              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-gold text-ink font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors"
              >
                Explorar cursos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {enrollments.map((enrollment) => {
                const courseProgress = progressByCoure[enrollment.course_slug];
                const totalTime = courseProgress?.total_time ?? 0;
                const hours = Math.floor(totalTime / 3600);
                const minutes = Math.floor((totalTime % 3600) / 60);

                return (
                  <Link
                    key={enrollment.id}
                    href={`/cursos/${enrollment.course_slug}`}
                    className="bg-surface border border-line rounded-xl p-6 hover:border-gold/50 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        enrollment.enrollment_type === "free"
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-gold/15 text-gold"
                      }`}>
                        {enrollment.enrollment_type === "free" ? "Gratuito" : "Premium"}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground group-hover:text-gold transition-colors mb-2 capitalize">
                      {enrollment.course_slug.replace(/-/g, " ").replace("ingles para ", "Inglés para ")}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-foreground/40">
                      {courseProgress && (
                        <>
                          <span>{courseProgress.completed} lecciones completadas</span>
                          {totalTime > 0 && (
                            <span>
                              {hours > 0 ? `${hours}h ` : ""}{minutes}min dedicados
                            </span>
                          )}
                        </>
                      )}
                      {!courseProgress && <span>Sin empezar</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
