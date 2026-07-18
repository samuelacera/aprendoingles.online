import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
};

export default async function NuevaPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  // The recovery link (via /auth/callback) establishes a session; without it
  // the user can't set a new password here.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="bg-background text-foreground min-h-[calc(100vh-64px)] flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Nueva contraseña</h1>
          <p className="text-foreground/50 mt-2">Elige una contraseña nueva para tu cuenta.</p>
        </div>

        {!user ? (
          <div className="bg-surface-2 border border-line rounded-2xl p-8 text-center">
            <p className="text-foreground/60 mb-6">
              Este enlace no es válido o ha caducado. Solicita uno nuevo para
              restablecer tu contraseña.
            </p>
            <Link
              href="/recuperar"
              className="inline-block bg-gold text-ink font-semibold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
            >
              Pedir un enlace nuevo
            </Link>
          </div>
        ) : (
          <div className="bg-surface-2 border border-line rounded-2xl p-8">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-lg p-4 mb-6">
                No se pudo actualizar la contraseña. Inténtalo de nuevo.
              </div>
            )}
            <form action={updatePassword} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-1">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-background border border-line text-foreground placeholder:text-foreground/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-gold/60 focus:border-transparent outline-none"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gold text-ink font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
              >
                Guardar contraseña
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
