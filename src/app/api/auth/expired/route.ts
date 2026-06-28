import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ROUTES } from "@/lib/constants";
import { getSession } from "@/lib/session";

/**
 * Clears a stale session, then redirects to /login.
 *
 * Needed because a Server Component (e.g. the invoices page) cannot write
 * cookies: when its server-side fetch hits a 401 (token rejected upstream while
 * the cookie still looks locally valid), redirecting straight to /login would
 * loop — the proxy still sees a "valid" session and bounces back. Routing the
 * 401 through this handler destroys the session first, breaking the loop.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  session.destroy();
  return NextResponse.redirect(new URL(ROUTES.login, request.url));
}
