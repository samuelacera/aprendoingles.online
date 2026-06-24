import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Regístrate en aprendoingles.online y empieza a aprender inglés profesional especializado.",
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/mi-cuenta");

  const { next } = await searchParams;

  return (
    <section className="bg-ink text-cream min-h-[calc(100vh-64px)] flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Crea tu cuenta</h1>
          <p className="text-cream/50 mt-2">Empieza a aprender inglés profesional hoy</p>
        </div>
        <AuthForm mode="register" redirectTo={next} />
      </div>
    </section>
  );
}
