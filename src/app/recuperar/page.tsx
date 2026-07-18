import { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Recupera el acceso a tu cuenta de aprendoingles.online.",
};

export default async function RecuperarPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  if (status === "sent") {
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
            Si existe una cuenta con ese email, te hemos enviado un enlace para
            restablecer tu contraseña. Revisa también la carpeta de spam.
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
          <h1 className="font-display text-3xl font-bold">Recuperar contraseña</h1>
          <p className="text-foreground/50 mt-2">
            Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>

        <div className="bg-surface-2 border border-line rounded-2xl p-8">
          <form action={requestPasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-background border border-line text-foreground placeholder:text-foreground/30 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-gold/60 focus:border-transparent outline-none"
                placeholder="tu@email.com"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gold text-ink font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors text-sm"
            >
              Enviar enlace de recuperación
            </button>
          </form>
          <p className="text-center text-sm text-foreground/50 mt-6">
            <Link href="/login" className="text-gold hover:text-gold-light font-medium">
              Volver a iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
