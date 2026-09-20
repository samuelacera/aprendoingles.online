/**
 * Legacy web endpoint. The implementation now lives in the versioned API so
 * web and app share one code path (and one set of validations).
 *
 * @deprecated Use /api/v1/enroll.
 */
export { POST, OPTIONS } from "@/app/api/v1/enroll/route";

// Route segment config must be declared literally — Next.js parses it
// statically and cannot follow a re-export.
export const dynamic = "force-dynamic";
