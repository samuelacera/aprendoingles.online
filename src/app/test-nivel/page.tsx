import { Metadata } from "next";
import { getCategories } from "@/sanity/queries";
import { createClient } from "@/lib/supabase/server";
import LevelTest, { type TestCategory } from "@/components/level-test/LevelTest";

export const metadata: Metadata = {
  title: "Test de nivel de inglés profesional gratis",
  description:
    "Descubre tu nivel de inglés en 4 minutos con un test adaptado a tu sector: gramática, vocabulario técnico, expresiones reales y listening con acentos. Resultado al momento.",
  alternates: { canonical: "/test-nivel" },
};

const ERRORS: Record<string, string> = {
  "User already registered": "Ya existe una cuenta con este email. Inicia sesión y guarda tu resultado.",
};

export default async function TestNivelPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, categories, supabase] = await Promise.all([
    searchParams,
    getCategories(),
    createClient(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();

  const data: TestCategory[] = categories
    .filter((c) => c.courses.length > 0)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      courses: c.courses
        .map((co) => ({ slug: co.slug, h1: co.h1, lessonCount: co.lessonCount ?? 0 }))
        .sort((a, b) => Number(b.lessonCount > 0) - Number(a.lessonCount > 0)),
    }));

  return (
    <LevelTest
      categories={data}
      loggedIn={!!user}
      error={error ? (ERRORS[error] ?? "No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.") : undefined}
    />
  );
}
