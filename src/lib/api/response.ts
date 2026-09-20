import { NextResponse } from "next/server";

/**
 * Uniform JSON envelope for the v1 API so the Flutter client can rely on a
 * single error shape: { error: { code, message } }.
 *
 * Codes are stable identifiers the app can branch on (e.g. show the paywall
 * on "payment_required"); messages are Spanish and user-presentable.
 */

export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "bad_request"
  | "payment_required"
  | "conflict"
  | "server_error";

const STATUS: Record<ApiErrorCode, number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  bad_request: 400,
  payment_required: 402,
  conflict: 409,
  server_error: 500,
};

/** CORS — needed only for Flutter Web / local tooling; native apps ignore it. */
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization,content-type",
  "Access-Control-Max-Age": "86400",
};

export function apiOk<T>(data: T, init?: { status?: number; cache?: string }) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      ...CORS_HEADERS,
      // Anything user-scoped must never be cached by a CDN.
      "Cache-Control": init?.cache ?? "private, no-store",
    },
  });
}

export function apiError(code: ApiErrorCode, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    {
      status: STATUS[code],
      headers: { ...CORS_HEADERS, "Cache-Control": "private, no-store" },
    },
  );
}

/** Shared preflight handler — re-export as `OPTIONS` from each route. */
export function apiOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/** Wraps a handler so an unexpected throw becomes a clean 500, never an HTML page. */
export async function guard<T extends Response>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (err) {
    console.error("[api/v1]", err);
    return apiError("server_error", "Error interno. Inténtalo de nuevo.");
  }
}
