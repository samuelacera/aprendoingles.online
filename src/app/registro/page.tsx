import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Regístrate en aprendoingles.online y empieza a aprender inglés profesional especializado.",
};

const ERRORS: Record<string, string> = {
  "User already registered": "Ya existe una cuenta con este email. Inicia sesión o recupera tu contraseña.",
};

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; status?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/mi-cuenta");

  const { next, status, error } = await searchParams;

  // Confirmation email sent — show a check-your-inbox panel instead of the form.
  if (status === "check-email") {
    return (
      <section className="bg-background text-foreground min-h-[calc(100vh-64px)] flex items-center justify-center py-16">
        <div className="w-full max-w-md mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5 text-gold">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Revisa tu correo</h1>
          <p className="text-foreground/60 mb-6">
            Te hemos enviado un enlace para confirmar tu cuenta. Ábrelo y podrás
            empezar a aprender. Si no lo ves, revisa la carpeta de spam.
          </p>
          <Link href="/login" className="text-gold hover:text-gold-light font-medium text-sm">
            Volver a iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background text-foreground min-h-[calc(100vh-64px)] flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Crea tu cuenta</h1>
          <p className="text-foreground/50 mt-2">Empieza a aprender inglés profesional hoy</p>
        </div>
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-lg p-4 mb-6">
            {ERRORS[error] ?? "No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo."}
          </div>
        )}
        <AuthForm mode="register" redirectTo={next} />
      </div>
    </section>
  );
}
