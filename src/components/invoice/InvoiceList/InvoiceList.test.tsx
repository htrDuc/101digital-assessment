import { useInvoiceContext } from '@/contexts/InvoiceContext';
import { render, screen } from '@/utils/jest';
import InvoiceList from './index';

jest.mock('@/contexts/InvoiceContext');

describe('InvoiceList', () => {
  const mockInvoices = [
    {
      invoiceId: '1',
      invoiceNumber: 'INV-001',
      customer: { firstName: 'John', lastName: 'Doe' },
      totalAmount: 1000,
      currency: 'USD',
      dueDate: '2024-12-04',
      status: [{ key: 'PAID', value: true }],
    },
    {
      invoiceId: '2',
      invoiceNumber: 'INV-002',
      customer: { firstName: 'Jane', lastName: 'Smith' },
      totalAmount: 2000,
      currency: 'EUR',
      dueDate: '2024-12-04',
      status: [{ key: 'PAID', value: false }],
    },
  ];
  beforeEach(() => {
    (useInvoiceContext as jest.Mock).mockReturnValue({
      invoices: mockInvoices,
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalRecords: 2,
      pageSize: 10,
      refreshInvoices: jest.fn(),
      setCurrentPage: jest.fn(),
      setPageSize: jest.fn(),
    });
  });

  it('renders the table with correct headers', () => {
    render(<InvoiceList />);
    expect(screen.getByText('Invoice Number')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders "View Details" buttons for each invoice', () => {
    render(<InvoiceList />);
    const viewDetailsButtons = screen.getAllByText('View Details');
    expect(viewDetailsButtons).toHaveLength(2);
  });

  it('displays loading state when loading is true', () => {
    (useInvoiceContext as jest.Mock).mockReturnValue({
      ...useInvoiceContext(),
      loading: true,
      invoices: [],
    });
    render(<InvoiceList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    (useInvoiceContext as jest.Mock).mockReturnValue({
      ...useInvoiceContext(),
      error: 'Failed to fetch invoices',
      invoices: [],
    });
    render(<InvoiceList />);
    expect(screen.getByText('Failed to fetch invoices')).toBeInTheDocument();
  });
});
