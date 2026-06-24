"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface EnrollButtonProps {
  courseSlug: string;
  courseName: string;
  free?: boolean;
}

export default function EnrollButton({ courseSlug, courseName, free }: EnrollButtonProps) {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUser(uid);
      if (uid) {
        supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", uid)
          .eq("course_slug", courseSlug)
          .single()
          .then(({ data: enrollment }) => {
            setEnrolled(!!enrollment);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, [courseSlug]);

  async function handleEnroll() {
    if (!user) {
      router.push(`/registro?next=/cursos/${courseSlug}`);
      return;
    }

    if (free) {
      setLoading(true);
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      if (res.ok) {
        setEnrolled(true);
        router.refresh();
      }
      setLoading(false);
    } else {
      // TODO: Stripe checkout
      router.push(`/registro?next=/cursos/${courseSlug}`);
    }
  }

  if (loading) {
    return (
      <div className="h-12 bg-white/5 rounded-lg animate-pulse" />
    );
  }

  if (enrolled) {
    return (
      <div className="text-center">
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold py-3 rounded-lg text-sm mb-2">
          Inscrito en este curso
        </div>
        <button
          onClick={() => router.push(`/cursos/${courseSlug}`)}
          className="text-sm text-gold hover:text-gold-light"
        >
          Ir al temario
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="group/cta relative block w-full overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 via-gold to-orange-500 py-3.5 text-center font-bold text-ink shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/50 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
    >
      {/* shine sweep on hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
      <span className="relative inline-flex items-center justify-center gap-2">
        {free ? "Inscribirme gratis" : "Comprar acceso"}
        <svg className="w-4 h-4 transition-transform group-hover/cta:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
