import { Paging } from './paging';

export interface InvoiceDataResponse {
  data: InvoiceResponse[];
  paging: Paging;
}

export interface InvoiceResponse {
  createdAt: string;
  createdBy: string;
  currency: string;
  currencySymbol: string;
  customer: Customer;
  description: string;
  dueDate: string;
  extensions: any[];
  invoiceDate: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceSubTotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  totalPaid: number;
  balanceAmount: number;
  numberOfDocuments: number;
  documents: any[];
  items: any[];
  merchant: Merchant;
  payments: any[];
  referenceNo: string;
  invoiceReference: string;
  status: Status[];
  subStatus: any[];
  type: string;
  version: string;
  invoiceGrossTotal: number;
  customFields: CustomField[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  addresses: any[];
}

export interface Merchant {
  id: string;
  name: string;
  addresses: any[];
}

export interface Status {
  key: string;
  value: boolean;
}

export interface CustomField {
  key: string;
  value: string;
}
