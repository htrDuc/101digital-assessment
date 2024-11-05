import { useInvoiceContext } from '@/contexts/InvoiceContext';
import { useInvoice } from '@/hooks/useInvoice';
import { useToast } from '@/hooks/useToast';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateInvoiceDialog from './index';

// Mock the hooks
jest.mock('@/hooks/useInvoice', () => ({
  useInvoice: jest.fn(),
}));

jest.mock('@/contexts/InvoiceContext', () => ({
  useInvoiceContext: jest.fn(),
}));

jest.mock('@/hooks/useToast', () => ({
  useToast: jest.fn(),
}));

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

describe('CreateInvoiceDialog', () => {
  const mockAddInvoice = jest.fn();
  const mockRefreshInvoices = jest.fn();
  const mockToast = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useInvoice as jest.Mock).mockReturnValue({ addInvoice: mockAddInvoice });
    (useInvoiceContext as jest.Mock).mockReturnValue({
      refreshInvoices: mockRefreshInvoices,
    });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('renders the dialog when isOpen is true', () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);
    expect(
      screen.getByRole('dialog', { name: /create invoice/i }),
    ).toBeInTheDocument();
  });

  it('does not render the dialog when isOpen is false', () => {
    render(<CreateInvoiceDialog isOpen={false} onClose={mockOnClose} />);
    expect(
      screen.queryByRole('dialog', { name: /create invoice/i }),
    ).not.toBeInTheDocument();
  });

  it('shows validation errors for invalid data', async () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', {
      name: /create invoice/i,
    });
    await userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('adds a new custom field when "Add Custom Field" button is clicked', async () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);

    const addCustomFieldButton = screen.getByRole('button', {
      name: /add custom field/i,
    });
    await userEvent.click(addCustomFieldButton);

    await waitFor(() => {
      const customFieldInputs =
        screen.getAllByPlaceholderText(/custom field key/i);
      expect(customFieldInputs.length).toBe(1);
    });
  });

  it('adds a new extension when "Add Extension" button is clicked', async () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);

    const addExtensionButton = screen.getByRole('button', {
      name: /add extension/i,
    });
    await userEvent.click(addExtensionButton);

    await waitFor(() => {
      const extensionNameInputs =
        screen.getAllByPlaceholderText(/extension name/i);
      expect(extensionNameInputs.length).toBe(1);
    });
  });

  it('shows alert dialog when trying to close with unsaved changes', async () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);

    await userEvent.type(
      screen.getByLabelText(/invoice number/i),
      'New Invoice Number',
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.getByText(/are you absolutely sure\?/i),
      ).toBeInTheDocument();
    });
  });

  it('closes the dialog when confirming unsaved changes', async () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);

    await userEvent.type(
      screen.getByLabelText(/invoice number/i),
      'New Invoice Number',
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    const confirmButton = screen.getByRole('button', { name: /continue/i });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('updates form fields correctly', async () => {
    render(<CreateInvoiceDialog isOpen={true} onClose={mockOnClose} />);

    await userEvent.type(screen.getByLabelText(/invoice number/i), 'INV-003');
    await userEvent.type(
      screen.getByLabelText(/invoice reference/i),
      'REF-003',
    );
    await userEvent.type(
      screen.getByLabelText(/description/i),
      'Test Description',
    );
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'john.doe@example.com',
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/invoice number/i)).toHaveValue('INV-003');
      expect(screen.getByLabelText(/invoice reference/i)).toHaveValue(
        'REF-003',
      );
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        'Test Description',
      );
      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue(
        'john.doe@example.com',
      );
    });
  });
});
