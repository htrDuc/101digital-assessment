import "server-only";

import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/constants";

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Double-submit CSRF check for state-changing requests.
 *
 * The token lives in a JS-readable cookie set by middleware; the client echoes
 * it back in the `x-csrf-token` header. A cross-site attacker cannot read the
 * cookie (Same-Origin Policy), so it cannot forge a matching header.
 */
export function verifyCsrf(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  if (!cookieToken || !headerToken) return false;
  return constantTimeEqual(cookieToken, headerToken);
}
