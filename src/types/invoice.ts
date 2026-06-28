export interface InvoiceParty {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
}

export interface InvoiceStatusFlag {
  key: string;
  value: boolean;
}

export interface InvoiceItem {
  itemReference?: string;
  itemName?: string;
  description?: string;
  quantity?: number;
  rate?: number;
  itemUOM?: string;
}

export interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  invoiceReference?: string;
  currency: string;
  currencySymbol?: string;
  customer?: InvoiceParty;
  merchant?: InvoiceParty;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatusFlag[];
  invoiceSubTotal: number;
  totalTax: number;
  totalDiscount: number;
  totalAmount: number;
  totalPaid: number;
  balanceAmount: number;
  items?: InvoiceItem[];
  createdAt: string;
}

export interface Paging {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
}

export interface InvoiceListResult {
  invoices: Invoice[];
  paging: Paging;
}
