"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { parseOnboarding, saveLearningProfile } from "@/lib/learning-profile";

/** Absolute origin of the current request (works in local, preview and prod). */
async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host")!;
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const redirectTo = (formData.get("redirectTo") as string) || "/mi-cuenta";

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(redirectTo);
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const redirectTo = (formData.get("redirectTo") as string) || "/mi-cuenta";

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: (formData.get("fullName") as string | null) || undefined,
      },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    redirect(`/registro?error=${encodeURIComponent(error.message)}`);
  }

  // If a session came back, email confirmation is OFF → the user is logged in now.
  if (data.session) {
    redirect(redirectTo);
  }

  // Otherwise Supabase sent a confirmation email — tell the user to check it.
  redirect(`/registro?status=check-email`);
}

/** Only same-site paths, never an open redirect. */
const safePath = (value: unknown, fallback: string) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;

/**
 * Signup at the end of the level test (/test-nivel). The answers travel in
 * the user metadata: with email confirmation on there is no session yet, so
 * /auth/callback writes them to learning_profiles once the email is confirmed.
 */
export async function registerFromTest(formData: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();
  const onboarding = parseOnboarding(formData.get("onboarding"));
  const next = safePath(formData.get("redirectTo"), "/mi-cuenta");

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: (formData.get("fullName") as string | null) || undefined,
        ...(onboarding ? { onboarding } : {}),
      },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`/test-nivel?error=${encodeURIComponent(error.message)}`);
  }

  if (data.session && data.user) {
    if (onboarding) {
      await saveLearningProfile(data.user.id, onboarding).catch((e) =>
        console.error("learning_profiles at signup:", e),
      );
    }
    redirect(next);
  }

  redirect(`/registro?status=check-email`);
}

/** A logged-in user who takes the test saves it straight to their profile. */
export async function saveTestResult(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/test-nivel");

  const onboarding = parseOnboarding(formData.get("onboarding"));
  if (onboarding) await saveLearningProfile(user.id, onboarding);
  redirect(safePath(formData.get("redirectTo"), "/mi-cuenta"));
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const origin = await getOrigin();

  // Errors are swallowed on purpose (don't reveal whether an email exists).
  await supabase.auth.resetPasswordForEmail(formData.get("email") as string, {
    redirectTo: `${origin}/auth/callback?next=/nueva-password`,
  });

  redirect(`/recuperar?status=sent`);
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/nueva-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/mi-cuenta");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function loginWithProvider(provider: "google" | "linkedin_oidc") {
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}
