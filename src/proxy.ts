import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
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
