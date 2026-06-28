import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { CSRF_COOKIE_NAME } from "@/lib/constants";
import { generateCsrfToken } from "@/lib/server/csrf-token";
import { isSessionValid, sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";

const PUBLIC_PATHS = ["/login"];
const isDev = process.env.NODE_ENV !== "production";

function buildCsp(nonce: string): string {
  const scriptSrc = isDev
    ? `'self' 'unsafe-eval' 'unsafe-inline'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, csp: string) {
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
}

/** Sets the JS-readable CSRF cookie when absent (double-submit pattern). */
function ensureCsrfCookie(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get(CSRF_COOKIE_NAME)) {
    response.cookies.set(CSRF_COOKIE_NAME, generateCsrfToken(), {
      httpOnly: false,
      secure: !isDev,
      sameSite: "lax",
      path: "/",
    });
  }
}

export async function proxy(request: NextRequest) {
  const nonce = btoa(generateCsrfToken());
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const baseResponse = NextResponse.next({ request: { headers: requestHeaders } });
  const session = await getIronSession<SessionData>(
    request,
    baseResponse,
    sessionOptions,
  );
  const authed = isSessionValid(session);

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Redirect signed-in users away from the login page.
  if (authed && isPublic) {
    const response = NextResponse.redirect(new URL("/invoices", request.url));
    applySecurityHeaders(response, csp);
    ensureCsrfCookie(request, response);
    return response;
  }

  // Protect everything that isn't public.
  if (!authed && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response, csp);
    ensureCsrfCookie(request, response);
    return response;
  }

  applySecurityHeaders(baseResponse, csp);
  ensureCsrfCookie(request, baseResponse);
  return baseResponse;
}

export const config = {
  // Run on all routes except API (self-guarded) and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
