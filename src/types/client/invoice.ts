export interface InvoiceParams {
  pageNum: number;
  pageSize: number;
  sortBy: string;
  ordering: string;
  keyword?: string;
}

export interface Invoice {
  bankAccount: BankAccount;
  customer: Customer;
  documents: Document[];
  invoiceReference: string;
  invoiceNumber: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  description: string;
  customFields: CustomField[];
  extensions: Extension[];
  items: Item[];
}

export interface BankAccount {
  bankId: string;
  sortCode: string;
  accountNumber: string;
  accountName: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  contact: Contact;
  addresses: Address[];
}

export interface Contact {
  email: string;
  mobileNumber: string;
}

export interface Address {
  premise: string;
  countryCode: string;
  postcode: string;
  county: string;
  city: string;
  addressType: string;
}

export interface Document {
  documentId: string;
  documentName: string;
  documentUrl: string;
}

export interface CustomField {
  key: string;
  value: string;
}

export interface Extension {
  addDeduct: string;
  value: number;
  type: string;
  name: string;
}

export interface Item {
  itemReference: string;
  description: string;
  quantity: number;
  rate: number;
  itemName: string;
  itemUOM: string;
  customFields: CustomField2[];
  extensions: Extension2[];
}

export interface CustomField2 {
  key: string;
  value: string;
}

export interface Extension2 {
  addDeduct: string;
  value: number;
  type: string;
  name: string;
}
