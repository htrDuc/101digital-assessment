import "server-only";

import type { NextRequest } from "next/server";

import { fail } from "@/lib/server/api-response";
import { verifyCsrf } from "@/lib/server/csrf";
import { isSameOrigin } from "@/lib/server/origin";

/**
 * Guards a state-changing request: same-origin + valid CSRF token.
 * Returns an error `NextResponse` to short-circuit, or `null` when the request
 * is allowed to proceed.
 */
export function guardMutation(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return fail(403, "Request origin not allowed");
  }
  if (!verifyCsrf(request)) {
    return fail(403, "Invalid or missing CSRF token");
  }
  return null;
}
