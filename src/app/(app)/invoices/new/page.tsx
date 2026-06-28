import type { Metadata } from "next";
import Link from "next/link";

import { CreateInvoiceForm } from "@/components/invoices/create-invoice-form";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = { title: "New invoice · SimpleInvoice" };

export default function NewInvoicePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={ROUTES.invoices}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to invoices
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          New invoice
        </h1>
      </div>
      <CreateInvoiceForm />
    </div>
  );
}
