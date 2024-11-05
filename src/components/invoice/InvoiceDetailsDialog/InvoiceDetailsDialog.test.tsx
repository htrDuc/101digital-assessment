import { InvoiceResponse } from '@/types/server';
import { render, screen } from '@/utils/jest';
import InvoiceDetailsDialog from './index';

describe('InvoiceDetailsDialog', () => {
  const mockInvoice: InvoiceResponse = {
    createdAt: '2023-01-01T12:00:00Z',
    createdBy: 'Admin',
    currency: 'USD',
    currencySymbol: '$',
    customer: {
      id: 'CUST001',
      firstName: 'John',
      lastName: 'Doe',
      addresses: [],
    },
    description: 'Invoice description',
    dueDate: '2023-01-31',
    extensions: [],
    invoiceDate: '2023-01-01',
    invoiceId: '1',
    invoiceNumber: 'INV001',
    invoiceSubTotal: 1000,
    totalDiscount: 50,
    totalTax: 100,
    totalAmount: 1050,
    totalPaid: 500,
    balanceAmount: 550,
    numberOfDocuments: 0,
    documents: [],
    items: [],
    merchant: {
      id: 'MERCH001',
      name: 'ACME Corp',
      addresses: [],
    },
    payments: [],
    referenceNo: 'REF001',
    invoiceReference: 'REF001',
    status: [{ key: 'PAID', value: false }],
    subStatus: [],
    type: 'Standard',
    version: '1.0',
    invoiceGrossTotal: 1050,
    customFields: [
      { key: 'Field1', value: 'Value1' },
      { key: 'Field2', value: 'Value2' },
    ],
  };

  it('renders the invoice details', () => {
    render(<InvoiceDetailsDialog invoice={mockInvoice} onClose={() => {}} />);

    expect(screen.getByText('Invoice #INV001')).toBeInTheDocument();
    expect(screen.getByText('#REF001')).toBeInTheDocument();
    expect(screen.getByText('Unpaid')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('1/31/2023')).toBeInTheDocument();
    expect(screen.getByText('1050 USD')).toBeInTheDocument();
    expect(screen.getByText('500 USD')).toBeInTheDocument();
    expect(screen.getByText('550 USD')).toBeInTheDocument();
  });

  it('renders custom fields', () => {
    render(<InvoiceDetailsDialog invoice={mockInvoice} onClose={() => {}} />);

    expect(screen.getByText('Field1:')).toBeInTheDocument();
    expect(screen.getByText('Value1')).toBeInTheDocument();
    expect(screen.getByText('Field2:')).toBeInTheDocument();
    expect(screen.getByText('Value2')).toBeInTheDocument();
  });

  it('does not render when invoice is null', () => {
    render(<InvoiceDetailsDialog invoice={null} onClose={() => {}} />);
    expect(screen.queryByText('Invoice #')).not.toBeInTheDocument();
  });
});
