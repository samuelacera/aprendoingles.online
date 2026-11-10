import { cache } from "react";
import { createClient, type SanityClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";
import { createClient as createSessionClient } from "@/lib/supabase/server";

/**
 * Private courses: courses only some accounts can see (e.g. a course built
 * for one person). Server-only: never import from a client component.
 *
 * The dataset is public, so a private course can't just be "unpublished":
 * anyone can query the public API. Instead its documents live under the
 * `private.` ID path, which Sanity only returns to authenticated requests:
 *
 *   course   _id = "private.course-<slug>"  + allowedEmails: string[]
 *   lessons  _id = "private.lesson-…"        course → private.course-<slug>
 *   slug     always starts with "privado-" (proxy.ts routes those URLs to
 *            app/privado/, which is dynamic and can read the session)
 *
 * The public client (sanity/client.ts) never sees them, so catalog, sitemap,
 * categories and static params leave them out with no extra filter. The
 * functions in sanity/queries.ts fall back to this client only when a slug
 * is a private course AND the viewer's email is in its allowedEmails.
 *
 * Needs SANITY_READ_TOKEN (a "Viewer" token) on the server.
 */

const PRIVATE_COURSE_PREFIX = "private.course-";

/** Every private course slug starts with this (see proxy.ts). */
export const PRIVATE_SLUG_PREFIX = "privado-";

export function isPrivateSlug(slug: string): boolean {
  return slug.startsWith(PRIVATE_SLUG_PREFIX);
}

export function privateCourseId(slug: string): string {
  return `${PRIVATE_COURSE_PREFIX}${slug}`;
}

let _client: SanityClient | null | undefined;

/** Authenticated client, or null when no token is configured. */
export function getPrivateClient(): SanityClient | null {
  if (_client !== undefined) return _client;
  const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN;
  _client = token
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token,
        useCdn: false,
        perspective: "published",
      })
    : null;
  return _client;
}

const normalize = (email: string | null | undefined) =>
  email ? email.trim().toLowerCase() : null;

/**
 * Allowed emails of the private course with this slug, or null when the slug
 * is not a private course (or there is no token). Deduplicated per request.
 */
export const getPrivateCourseAllowlist = cache(
  async (slug: string): Promise<string[] | null> => {
    const client = getPrivateClient();
    if (!client || !isPrivateSlug(slug)) return null;
    const emails = await client.fetch<string[] | null>(
      `*[_id == $id && published == true][0].allowedEmails`,
      { id: privateCourseId(slug) },
      { cache: "no-store" },
    );
    return emails ? emails.map((e) => e.trim().toLowerCase()) : null;
  },
);

export async function canViewPrivateCourse(
  slug: string,
  email: string | null | undefined,
): Promise<boolean> {
  const viewer = normalize(email);
  if (!viewer) return false;
  const allow = await getPrivateCourseAllowlist(slug);
  return !!allow && allow.includes(viewer);
}

/** Email of the web session (cookie). Reading it makes the render dynamic. */
export const getSessionEmail = cache(async (): Promise<string | null> => {
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? null;
});

/**
 * Runs `query` with the authenticated client if `slug` is a private course
 * the viewer may see; otherwise returns null.
 *
 * viewerEmail: pass it from API routes (Bearer or cookie user). Leave it
 * undefined in pages: the session cookie is read, but only after the slug
 * turned out to be private, so public pages stay static.
 */
export async function fetchPrivateCourse<T>(
  slug: string,
  viewerEmail: string | null | undefined,
  query: string,
  params: Record<string, unknown>,
): Promise<T | null> {
  const allow = await getPrivateCourseAllowlist(slug);
  if (!allow) return null;
  const email = viewerEmail === undefined ? await getSessionEmail() : viewerEmail;
  if (!(await canViewPrivateCourse(slug, email))) return null;
  return getPrivateClient()!.fetch<T>(
    query,
    { ...params, privateCourseId: privateCourseId(slug) },
    { cache: "no-store" },
  );
}
