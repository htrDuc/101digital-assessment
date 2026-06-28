import "server-only";

import { env } from "@/lib/env";
import { requestJson } from "@/lib/server/http";
import type { SessionData } from "@/lib/session";
import type { CreateInvoiceInput } from "@/lib/validation/invoice";
import type { InvoiceQuery } from "@/lib/validation/invoice-query";
import type { Invoice, InvoiceListResult, Paging } from "@/types/invoice";

type AuthContext = Pick<SessionData, "accessToken" | "orgToken">;

interface InvoiceListApiResponse {
  data: Invoice[];
  paging: Paging;
}

function authHeaders({ accessToken, orgToken }: AuthContext) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "org-token": orgToken,
  };
}

export async function listInvoices(
  query: InvoiceQuery,
  auth: AuthContext,
): Promise<InvoiceListResult> {
  const params = new URLSearchParams({
    sortBy: query.sortBy,
    ordering: query.ordering,
    pageNum: String(query.pageNum),
    pageSize: String(query.pageSize),
  });
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.status) params.set("status", query.status);
  if (query.fromDate) params.set("fromDate", query.fromDate);
  if (query.toDate) params.set("toDate", query.toDate);

  const response = await requestJson<InvoiceListApiResponse>(
    `${env.API_BASE_URL}/invoice-service/1.0.0/invoices?${params.toString()}`,
    { headers: authHeaders(auth) },
  );

  return { invoices: response.data ?? [], paging: response.paging };
}

function toCreatePayload(input: CreateInvoiceInput) {
  return {
    invoices: [
      {
        bankAccount: {
          bankId: "",
          sortCode: input.bankSortCode,
          accountNumber: input.bankAccountNumber,
          accountName: input.bankAccountName,
        },
        customer: {
          firstName: input.customerFirstName,
          lastName: input.customerLastName,
          contact: {
            email: input.customerEmail,
            mobileNumber: input.customerMobile,
          },
        },
        invoiceReference: input.invoiceReference || input.invoiceNumber,
        invoiceNumber: input.invoiceNumber,
        currency: input.currency,
        invoiceDate: input.invoiceDate,
        dueDate: input.dueDate,
        description: input.description ?? "",
        items: [
          {
            itemReference: input.itemName,
            description: input.itemDescription ?? input.itemName,
            quantity: input.quantity,
            rate: input.rate,
            itemName: input.itemName,
            itemUOM: input.itemUOM || "UNIT",
          },
        ],
      },
    ],
  };
}

export async function createInvoice(
  input: CreateInvoiceInput,
  auth: AuthContext,
): Promise<unknown> {
  return requestJson(
    `${env.API_BASE_URL}/invoice-service/1.0.0/invoices`,
    {
      method: "POST",
      headers: {
        ...authHeaders(auth),
        "Operation-Mode": "SYNC",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toCreatePayload(input)),
    },
  );
}
