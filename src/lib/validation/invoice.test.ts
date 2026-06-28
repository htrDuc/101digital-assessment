import { createInvoiceSchema } from "@/lib/validation/invoice";

const validInput = {
  customerFirstName: "John",
  customerLastName: "Doe",
  customerEmail: "john@example.com",
  customerMobile: "+6597594971",
  invoiceNumber: "INV1001",
  invoiceReference: "",
  currency: "GBP",
  invoiceDate: "2026-01-01",
  dueDate: "2026-01-08",
  description: "",
  itemName: "Widget",
  itemDescription: "",
  quantity: 2,
  rate: 10,
  itemUOM: "UNIT",
  bankAccountName: "John Doe",
  bankAccountNumber: "12345678",
  bankSortCode: "09-01-01",
};

describe("createInvoiceSchema", () => {
  it("accepts a valid invoice", () => {
    expect(createInvoiceSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects a non-numeric quantity", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInput,
      quantity: "three",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a due date before the invoice date", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInput,
      invoiceDate: "2026-01-10",
      dueDate: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInput,
      customerEmail: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a negative rate", () => {
    const result = createInvoiceSchema.safeParse({ ...validInput, rate: -5 });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed sort code", () => {
    const result = createInvoiceSchema.safeParse({
      ...validInput,
      bankSortCode: "0901",
    });
    expect(result.success).toBe(false);
  });
});
