import type { NextRequest } from "next/server";

import { fail, ok } from "@/lib/server/api-response";
import { guardMutation } from "@/lib/server/guard";
import { UpstreamError } from "@/lib/server/http";
import { createInvoice, listInvoices } from "@/lib/server/invoices";
import { getSession, isSessionValid } from "@/lib/session";
import { createInvoiceSchema } from "@/lib/validation/invoice";
import { parseInvoiceQuery } from "@/lib/validation/invoice-query";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!isSessionValid(session)) {
    return fail(401, "Your session has expired. Please sign in again.");
  }

  const query = parseInvoiceQuery(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  try {
    const result = await listInvoices(query, session);
    return ok(result);
  } catch (error) {
    if (error instanceof UpstreamError && error.status === 401) {
      session.destroy();
      return fail(401, "Your session has expired. Please sign in again.");
    }
    return fail(502, "Could not load invoices. Please try again.");
  }
}

export async function POST(request: NextRequest) {
  const guard = guardMutation(request);
  if (guard) return guard;

  const session = await getSession();
  if (!isSessionValid(session)) {
    return fail(401, "Your session has expired. Please sign in again.");
  }

  const body = await request.json().catch(() => null);
  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "Please correct the highlighted fields and try again.");
  }

  try {
    await createInvoice(parsed.data, session);
    return ok({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof UpstreamError && error.status === 401) {
      session.destroy();
      return fail(401, "Your session has expired. Please sign in again.");
    }
    if (error instanceof UpstreamError && error.status >= 400 && error.status < 500) {
      return fail(422, "The invoice could not be created. Check your details.");
    }
    return fail(502, "Could not create the invoice. Please try again.");
  }
}
 