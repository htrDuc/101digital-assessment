"use client";

import { useState } from "react";

import { InvoiceDetailsDialog } from "@/components/invoices/invoice-details-dialog";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, getCustomerName } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [selected, setSelected] = useState<Invoice | null>(null);

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No invoices match your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead className="hidden sm:table-cell">Customer</TableHead>
              <TableHead className="hidden md:table-cell">Invoice date</TableHead>
              <TableHead className="hidden md:table-cell">Due date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.invoiceId}
                className="cursor-pointer"
                onClick={() => setSelected(invoice)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setSelected(invoice);
                }}
              >
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {getCustomerName(invoice)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(invoice.invoiceDate)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(invoice.dueDate)}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge invoice={invoice} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.totalAmount, invoice.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InvoiceDetailsDialog
        invoice={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
