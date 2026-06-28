import Link from "next/link";
import { redirect } from "next/navigation";

import { InvoiceFilters } from "@/components/invoices/invoice-filters";
import { InvoicePagination } from "@/components/invoices/invoice-pagination";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { UpstreamError } from "@/lib/server/http";
import { listInvoices } from "@/lib/server/invoices";
import { getSession, isSessionValid } from "@/lib/session";
import { parseInvoiceQuery } from "@/lib/validation/invoice-query";
import type { InvoiceListResult } from "@/types/invoice";

type SearchParams = Record<string, string | string[] | undefined>;

function flatten(params: SearchParams): Record<string, string | undefined> {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!isSessionValid(session)) redirect(ROUTES.login);

  const query = parseInvoiceQuery(flatten(await searchParams));

  let result: InvoiceListResult | null = null;
  let loadError = false;
  try {
    result = await listInvoices(query, session);
  } catch (error) {
    if (error instanceof UpstreamError && error.status === 401) {
      redirect(ROUTES.sessionExpired);
    }
    loadError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter and manage your invoices
          </p>
        </div>
        <Link href={ROUTES.newInvoice} className={cn(buttonVariants())}>
          New invoice
        </Link>
      </div>

      <InvoiceFilters query={query} />

      {loadError ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-destructive">
          Could not load invoices. Please try again.
        </p>
      ) : (
        <>
          <InvoiceTable invoices={result?.invoices ?? []} />
          {result && <InvoicePagination paging={result.paging} query={query} />}
        </>
      )}
    </div>
  );
}
