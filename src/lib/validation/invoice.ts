import { z } from "zod";

export const CURRENCIES = ["GBP", "USD", "EUR", "VND", "SGD"] as const;


export const createInvoiceSchema = z
  .object({
    customerFirstName: z.string().trim().min(1, "First name is required"),
    customerLastName: z.string().trim().min(1, "Last name is required"),
    customerEmail: z.email("A valid email is required"),
    customerMobile: z
      .string()
      .trim()
      .regex(/^\+?[0-9]{6,15}$/, "Enter a valid phone number"),

    invoiceNumber: z.string().trim().min(1, "Invoice number is required"),
    invoiceReference: z.string().trim().optional(),
    currency: z.enum(CURRENCIES),
    invoiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick an invoice date"),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a due date"),
    description: z.string().trim().max(500).optional(),

    itemName: z.string().trim().min(1, "Item name is required"),
    itemDescription: z.string().trim().max(500).optional(),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    rate: z.number().min(0, "Rate cannot be negative"),
    itemUOM: z.string().trim().optional(),

    bankAccountName: z.string().trim().min(1, "Account name is required"),
    bankAccountNumber: z
      .string()
      .trim()
      .regex(/^[0-9]{6,18}$/, "Enter a valid account number"),
    bankSortCode: z
      .string()
      .trim()
      .regex(/^[0-9]{2}-[0-9]{2}-[0-9]{2}$/, "Format: 00-00-00"),
  })
  .refine((data) => data.dueDate >= data.invoiceDate, {
    message: "Due date must be on or after the invoice date",
    path: ["dueDate"],
  });

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
