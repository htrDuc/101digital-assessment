/**
 * Shared, non-secret constants. Safe to import from both server and client.
 */
export const CSRF_COOKIE_NAME = "si_csrf";

export const CSRF_HEADER_NAME = "x-csrf-token";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export const SORT_FIELDS = ["CREATED_DATE", "INVOICE_DATE", "DUE_DATE"] as const;
export const ORDERINGS = ["DESCENDING", "ASCENDING"] as const;

export const INVOICE_STATUSES = ["Due", "Paid", "Overdue", "Cancelled"] as const;

export const ROUTES = {
  login: "/login",
  invoices: "/invoices",
  newInvoice: "/invoices/new",
  /** Clears a stale session then redirects to login (see api/auth/expired). */
  sessionExpired: "/api/auth/expired",
} as const;
