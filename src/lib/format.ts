import type { Invoice } from "@/types/invoice";

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getInvoiceStatus(invoice: Invoice): string {
  return invoice.status?.find((flag) => flag.value)?.key ?? "Unknown";
}

export function getCustomerName(invoice: Invoice): string {
  const customer = invoice.customer;
  if (!customer) return "—";
  return (
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    customer.name ||
    "—"
  );
}
