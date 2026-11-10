import { notFound } from "next/navigation";
import CoursePage, { generateMetadata as courseMetadata } from "@/app/cursos/[slug]/page";
import { isPrivateSlug } from "@/sanity/private";

/**
 * Private course page, reached through proxy.ts from /cursos/privado-…
 * Same page as app/cursos/[slug], but always dynamic so it can read the
 * session and show the course only to the accounts on its list.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props) {
  const { slug } = await props.params;
  if (!isPrivateSlug(slug)) return {};
  return courseMetadata(props);
}

export default async function PrivateCoursePage(props: Props) {
  const { slug } = await props.params;
  if (!isPrivateSlug(slug)) notFound();
  return CoursePage(props);
}
