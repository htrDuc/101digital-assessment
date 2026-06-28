import { z } from "zod";

import {
  DEFAULT_PAGE_SIZE,
  INVOICE_STATUSES,
  ORDERINGS,
  SORT_FIELDS,
} from "@/lib/constants";

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
  .optional();

export const invoiceQuerySchema = z.object({
  keyword: z.string().trim().optional(),
  status: z.enum(INVOICE_STATUSES).optional(),
  sortBy: z.enum(SORT_FIELDS).default("CREATED_DATE"),
  ordering: z.enum(ORDERINGS).default("DESCENDING"),
  pageNum: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE),
  fromDate: dateString,
  toDate: dateString,
});

export type InvoiceQuery = z.infer<typeof invoiceQuerySchema>;

export function parseInvoiceQuery(
  params: Record<string, string | undefined>,
): InvoiceQuery {
  const result = invoiceQuerySchema.safeParse(params);
  return result.success ? result.data : invoiceQuerySchema.parse({});
}
