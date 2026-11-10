import { notFound } from "next/navigation";
import LessonPage, {
  generateMetadata as lessonMetadata,
} from "@/app/cursos/[slug]/[lessonSlug]/page";
import { isPrivateSlug } from "@/sanity/private";

/**
 * Private lesson page, reached through proxy.ts from /cursos/privado-…/…
 * Same page as app/cursos/[slug]/[lessonSlug], always dynamic.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

export async function generateMetadata(props: Props) {
  const { slug } = await props.params;
  if (!isPrivateSlug(slug)) return {};
  return lessonMetadata(props);
}

export default async function PrivateLessonPage(props: Props) {
  const { slug } = await props.params;
  if (!isPrivateSlug(slug)) notFound();
  return LessonPage(props);
}
