"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { InvoiceQuery } from "@/lib/validation/invoice-query";
import type { Paging } from "@/types/invoice";

export function InvoicePagination({
  paging,
  query,
}: {
  paging: Paging;
  query: InvoiceQuery;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const totalPages = Math.max(1, Math.ceil(paging.totalRecords / paging.pageSize));
  const current = paging.pageNumber;
  const from = paging.totalRecords === 0 ? 0 : (current - 1) * paging.pageSize + 1;
  const to = Math.min(current * paging.pageSize, paging.totalRecords);

  function goTo(pageNum: number) {
    const params = new URLSearchParams();
    if (query.keyword) params.set("keyword", query.keyword);
    if (query.status) params.set("status", query.status);
    params.set("sortBy", query.sortBy);
    params.set("ordering", query.ordering);
    if (query.fromDate) params.set("fromDate", query.fromDate);
    if (query.toDate) params.set("toDate", query.toDate);
    params.set("pageSize", String(query.pageSize));
    params.set("pageNum", String(pageNum));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium">{from}</span>–
        <span className="font-medium">{to}</span> of{" "}
        <span className="font-medium">{paging.totalRecords}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={current <= 1}
          onClick={() => goTo(current - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {current} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={current >= totalPages}
          onClick={() => goTo(current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
