import { formatCurrency, getCustomerName, getInvoiceStatus } from "@/lib/format";
import type { Invoice } from "@/types/invoice";

function makeInvoice(overrides: Partial<Invoice> = {}): Invoice {
  return {
    invoiceId: "1",
    invoiceNumber: "INV1",
    currency: "GBP",
    invoiceDate: "2026-01-01",
    dueDate: "2026-01-08",
    status: [{ key: "Due", value: true }],
    invoiceSubTotal: 100,
    totalTax: 0,
    totalDiscount: 0,
    totalAmount: 100,
    totalPaid: 0,
    balanceAmount: 100,
    createdAt: "2026-01-01T00:00:00.000",
    ...overrides,
  };
}

describe("getInvoiceStatus", () => {
  it("returns the active status flag", () => {
    const invoice = makeInvoice({
      status: [
        { key: "Paid", value: true },
        { key: "Due", value: false },
      ],
    });
    expect(getInvoiceStatus(invoice)).toBe("Paid");
  });

  it("returns Unknown when no flag is active", () => {
    expect(getInvoiceStatus(makeInvoice({ status: [] }))).toBe("Unknown");
  });
});

describe("getCustomerName", () => {
  it("joins first and last name", () => {
    const invoice = makeInvoice({
      customer: { firstName: "Lionel", lastName: "Messi" },
    });
    expect(getCustomerName(invoice)).toBe("Lionel Messi");
  });

  it("returns a dash when there is no customer", () => {
    expect(getCustomerName(makeInvoice({ customer: undefined }))).toBe("—");
  });
});

describe("formatCurrency", () => {
  it("formats with the currency symbol", () => {
    const output = formatCurrency(1000, "GBP");
    expect(output).toContain("1,000");
    expect(output).toContain("£");
  });
});
