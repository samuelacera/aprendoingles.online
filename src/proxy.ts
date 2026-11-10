import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Private courses (sanity/private.ts) keep their public-looking URL,
 * /cursos/privado-…, but are served by app/privado/, which is always
 * dynamic: the public course pages are static and can't read the session.
 */
const PRIVATE_COURSE_PATH = /^\/cursos\/(privado-[a-z0-9-]+)(\/[a-z0-9-]+)?\/?$/;

export async function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(PRIVATE_COURSE_PATH);
  if (match) {
    const url = request.nextUrl.clone();
    url.pathname = `/privado/cursos/${match[1]}${match[2] ?? ""}`;
    return await updateSession(request, url);
  }
  return await updateSession(request);
}

export const config = {
  // `api` is excluded on purpose: those routes authenticate themselves (cookie
  // OR Bearer token, see lib/api/auth.ts) and refreshing the cookie session
  // here would add a pointless Auth round-trip to every mobile request.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
