"use client";

import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate, getCustomerName } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export function InvoiceDetailsDialog({
  invoice,
  onOpenChange,
}: {
  invoice: Invoice | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(invoice)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {invoice && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {invoice.invoiceNumber}
                <InvoiceStatusBadge invoice={invoice} />
              </DialogTitle>
              <DialogDescription>
                Issued to {getCustomerName(invoice)}
              </DialogDescription>
            </DialogHeader>

            <div className="divide-y">
              <div className="pb-2">
                <Row label="Invoice date" value={formatDate(invoice.invoiceDate)} />
                <Row label="Due date" value={formatDate(invoice.dueDate)} />
                <Row label="Currency" value={invoice.currency} />
              </div>

              <div className="py-2">
                <Row
                  label="Subtotal"
                  value={formatCurrency(invoice.invoiceSubTotal, invoice.currency)}
                />
                <Row
                  label="Tax"
                  value={formatCurrency(invoice.totalTax, invoice.currency)}
                />
                <Row
                  label="Discount"
                  value={formatCurrency(invoice.totalDiscount, invoice.currency)}
                />
                <Row
                  label="Total"
                  value={formatCurrency(invoice.totalAmount, invoice.currency)}
                />
                <Row
                  label="Paid"
                  value={formatCurrency(invoice.totalPaid, invoice.currency)}
                />
                <Row
                  label="Balance"
                  value={formatCurrency(invoice.balanceAmount, invoice.currency)}
                />
              </div>

              {invoice.items && invoice.items.length > 0 && (
                <div className="pt-2">
                  <p className="mb-1 text-sm font-medium">Line items</p>
                  {invoice.items.map((item, index) => (
                    <Row
                      key={index}
                      label={`${item.itemName ?? item.description ?? "Item"} × ${item.quantity ?? 1}`}
                      value={formatCurrency(item.rate ?? 0, invoice.currency)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
