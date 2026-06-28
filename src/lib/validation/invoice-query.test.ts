import { parseInvoiceQuery } from "@/lib/validation/invoice-query";

describe("parseInvoiceQuery", () => {
  it("applies sensible defaults for an empty query", () => {
    expect(parseInvoiceQuery({})).toEqual({
      sortBy: "CREATED_DATE",
      ordering: "DESCENDING",
      pageNum: 1,
      pageSize: 10,
    });
  });

  it("coerces pagination strings to numbers", () => {
    const query = parseInvoiceQuery({ pageNum: "2", pageSize: "20" });
    expect(query.pageNum).toBe(2);
    expect(query.pageSize).toBe(20);
  });

  it("passes through a search keyword and status", () => {
    const query = parseInvoiceQuery({ keyword: "INV123", status: "Paid" });
    expect(query.keyword).toBe("INV123");
    expect(query.status).toBe("Paid");
  });

  it("falls back to defaults on invalid input", () => {
    const query = parseInvoiceQuery({ pageNum: "0" });
    expect(query.pageNum).toBe(1);
  });

  it("ignores an unknown status value", () => {
    const query = parseInvoiceQuery({ status: "NotAStatus" });
    expect(query.status).toBeUndefined();
  });
});
