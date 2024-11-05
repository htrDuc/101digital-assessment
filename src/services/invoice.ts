import { apiInstance } from '@/lib/axios';
import { InvoiceParams } from '@/types/client';
import { InvoiceDataResponse } from '@/types/server';

export async function fetchInvoices(
  params: InvoiceParams,
): Promise<InvoiceDataResponse> {
  const response = await apiInstance.get('/invoice-service/1.0.0/invoices', {
    params,
  });
  return response.data;
}

export async function createInvoice(invoiceData: any) {
  const response = await apiInstance.post(
    '/invoice-service/1.0.0/invoices',
    invoiceData,
    {
      headers: {
        'Operation-Mode': 'SYNC',
      },
    },
  );
  return response.data;
}
