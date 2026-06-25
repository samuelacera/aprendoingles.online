import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de aprendoingles.online para continuar tu formación en inglés profesional.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/mi-cuenta");

  const { error, next } = await searchParams;

  return (
    <section className="bg-background text-foreground min-h-[calc(100vh-64px)] flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Inicia sesión</h1>
          <p className="text-foreground/50 mt-2">Accede a tus cursos y continúa aprendiendo</p>
        </div>
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-lg p-4 mb-6">
            Ha habido un error con la autenticación. Inténtalo de nuevo.
          </div>
        )}
        <AuthForm mode="login" redirectTo={next} />
      </div>
    </section>
  );
}
