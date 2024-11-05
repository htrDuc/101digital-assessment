import { createInvoice, fetchInvoices } from '@/services';
import { InvoiceParams } from '@/types/client';
import { InvoiceFormData } from '@/utils/validation';
import { useState } from 'react';

export function useInvoice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInvoices = async (params: InvoiceParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchInvoices(params);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch invoices');
      return null;
    }
  };

  const addInvoice = async (invoiceData: InvoiceFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createInvoice({
        invoices: [invoiceData],
      });
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError('Failed to create invoice');
      return null;
    }
  };

  return { getInvoices, addInvoice, loading, error };
}
