import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/server/api-response";
import { authenticate } from "@/lib/server/auth-service";
import { guardMutation } from "@/lib/server/guard";
import { UpstreamError } from "@/lib/server/http";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { getSession } from "@/lib/session";
import { loginSchema } from "@/lib/validation/auth";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  const guard = guardMutation(request);
  if (guard) return guard;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "Username and password are required");
  }

  // Throttle by IP + username to blunt brute-force / credential stuffing.
  const key = `login:${clientKey(request)}:${parsed.data.username}`;
  const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);
  if (!limit.allowed) {
    return fail(429, "Too many attempts. Please try again shortly.");
  }

  try {
    const sessionData = await authenticate(
      parsed.data.username,
      parsed.data.password,
    );

    const session = await getSession();
    Object.assign(session, sessionData);
    await session.save();

    return ok({ profile: sessionData.profile });
  } catch (error) {
    if (error instanceof UpstreamError && error.status >= 400 && error.status < 500) {
      return fail(401, "Invalid username or password");
    }
    return fail(502, "Authentication service is unavailable. Try again later.");
  }
}
