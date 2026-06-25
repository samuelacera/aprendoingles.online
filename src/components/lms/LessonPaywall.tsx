import Link from "next/link";
import EnrollButton from "./EnrollButton";

interface LessonPaywallProps {
  courseSlug: string;
  courseName: string;
  /** null = anonymous visitor; otherwise authenticated user id */
  loggedIn: boolean;
  /** Course price in euros (0 = free course). */
  price: number;
  /** Path to return to after auth, e.g. the current lesson URL. */
  next: string;
}

/**
 * Server-rendered lock state for a lesson the viewer can't access yet.
 * The CTA adapts to the situation:
 *   - anonymous            → create account / log in
 *   - free course, no enrol → enroll for free (inline)
 *   - paid course, no access → purchase / subscribe
 */
export default function LessonPaywall({
  courseSlug,
  courseName,
  loggedIn,
  price,
  next,
}: LessonPaywallProps) {
  const isFreeCourse = price <= 0;

  return (
    <div className="border border-line rounded-2xl p-8 sm:p-10 text-center bg-surface">
      <div className="w-14 h-14 bg-gold/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      {!loggedIn ? (
        <>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Crea tu cuenta para acceder
          </h3>
          <p className="text-foreground/60 max-w-md mx-auto mb-6">
            Regístrate gratis para acceder a las lecciones y guardar tu progreso.
          </p>
          <div className="max-w-xs mx-auto space-y-3">
            <Link
              href={`/registro?next=${encodeURIComponent(next)}`}
              className="block w-full text-center bg-gold text-ink font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors"
            >
              Crear cuenta gratis
            </Link>
            <p className="text-sm text-foreground/50">
              ¿Ya tienes cuenta?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="text-gold hover:text-gold-light font-medium"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </>
      ) : isFreeCourse ? (
        <>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Inscríbete para continuar
          </h3>
          <p className="text-foreground/60 max-w-md mx-auto mb-6">
            Este curso es gratuito. Inscríbete para desbloquear todas las lecciones.
          </p>
          <div className="max-w-xs mx-auto">
            <EnrollButton courseSlug={courseSlug} courseName={courseName} free />
          </div>
        </>
      ) : (
        <>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Lección premium
          </h3>
          <p className="text-foreground/60 max-w-md mx-auto mb-6">
            Accede a este curso completo por {price}&nbsp;€ o suscríbete para
            tener acceso a todos los cursos.
          </p>
          <div className="max-w-xs mx-auto space-y-3">
            <Link
              href={`/cursos/${courseSlug}`}
              className="block w-full text-center bg-gold text-ink font-semibold py-3 rounded-lg hover:bg-gold-light transition-colors"
            >
              Ver opciones de acceso
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
