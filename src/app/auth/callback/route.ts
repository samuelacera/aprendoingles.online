import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveProfileFromMetadata } from "@/lib/learning-profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/mi-cuenta";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Signup from the level test: its answers wait in the user metadata.
      if (data.user) await saveProfileFromMetadata(data.user);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
