import { Badge } from "@/components/ui/badge";
import { getInvoiceStatus } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

type Variant = React.ComponentProps<typeof Badge>["variant"];

const STATUS_VARIANT: Record<string, Variant> = {
  Paid: "default",
  Due: "secondary",
  Overdue: "destructive",
  Cancelled: "outline",
};

export function InvoiceStatusBadge({ invoice }: { invoice: Invoice }) {
  const status = getInvoiceStatus(invoice);
  return <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>{status}</Badge>;
}
