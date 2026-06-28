"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVOICE_STATUSES,
  ORDERINGS,
  PAGE_SIZE_OPTIONS,
  SORT_FIELDS,
} from "@/lib/constants";
import type { InvoiceQuery } from "@/lib/validation/invoice-query";

const ALL = "ALL";
const SORT_LABELS: Record<string, string> = {
  CREATED_DATE: "Created date",
  INVOICE_DATE: "Invoice date",
  DUE_DATE: "Due date",
};

export function InvoiceFilters({ query }: { query: InvoiceQuery }) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(query.keyword ?? "");

  function navigate(next: Partial<InvoiceQuery>) {
    const merged = { ...query, pageNum: 1, ...next };
    const params = new URLSearchParams();
    if (merged.keyword) params.set("keyword", merged.keyword);
    if (merged.status) params.set("status", merged.status);
    params.set("sortBy", merged.sortBy);
    params.set("ordering", merged.ordering);
    if (merged.fromDate) params.set("fromDate", merged.fromDate);
    if (merged.toDate) params.set("toDate", merged.toDate);
    params.set("pageSize", String(merged.pageSize));
    params.set("pageNum", String(merged.pageNum));
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    const current = query.keyword ?? "";
    if (keyword.trim() === current) return;
    const timer = setTimeout(
      () => navigate({ keyword: keyword.trim() || undefined }),
      400,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const hasFilters =
    Boolean(query.keyword || query.status || query.fromDate || query.toDate) ||
    query.sortBy !== "CREATED_DATE" ||
    query.ordering !== "DESCENDING";

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="keyword">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="keyword"
              placeholder="Search by invoice number…"
              className="pl-9"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
        </div>
        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setKeyword("");
              router.push(pathname);
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={query.status ?? ALL}
            onValueChange={(value) =>
              navigate({
                status:
                  value === ALL ? undefined : (value as InvoiceQuery["status"]),
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) => (value === ALL ? "All statuses" : String(value))}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              {INVOICE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Sort by</Label>
          <Select
            value={query.sortBy}
            onValueChange={(value) =>
              navigate({ sortBy: value as InvoiceQuery["sortBy"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) => SORT_LABELS[String(value)] ?? String(value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_FIELDS.map((field) => (
                <SelectItem key={field} value={field}>
                  {SORT_LABELS[field] ?? field}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Order</Label>
          <Select
            value={query.ordering}
            onValueChange={(value) =>
              navigate({ ordering: value as InvoiceQuery["ordering"] })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value) =>
                  value === "DESCENDING" ? "Newest first" : "Oldest first"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ORDERINGS.map((order) => (
                <SelectItem key={order} value={order}>
                  {order === "DESCENDING" ? "Newest first" : "Oldest first"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromDate">From date</Label>
          <Input
            id="fromDate"
            type="date"
            value={query.fromDate ?? ""}
            onChange={(event) =>
              navigate({ fromDate: event.target.value || undefined })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="toDate">To date</Label>
          <Input
            id="toDate"
            type="date"
            value={query.toDate ?? ""}
            onChange={(event) =>
              navigate({ toDate: event.target.value || undefined })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Per page</Label>
          <Select
            value={String(query.pageSize)}
            onValueChange={(value) => navigate({ pageSize: Number(value) })}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{(value) => `${value} per page`}</SelectValue>{" "}
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
