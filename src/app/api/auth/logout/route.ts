import type { NextRequest } from "next/server";

import { ok } from "@/lib/server/api-response";
import { guardMutation } from "@/lib/server/guard";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const guard = guardMutation(request);
  if (guard) return guard;

  const session = await getSession();
  session.destroy();

  return ok({ ok: true });
}
