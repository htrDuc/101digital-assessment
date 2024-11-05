import CreateInvoiceDialog from '@/components/invoice/CreateInvoiceDialog';
import InvoiceList from '@/components/invoice/InvoiceList';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InvoiceProvider } from '@/contexts/InvoiceContext';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Invoice() {
  const [isOpenCreateInvoiceDialog, setIsOpenCreateInvoiceDialog] =
    useState(false);

  return (
    <>
      <InvoiceProvider>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold">Invoices</span>
              <Button onClick={() => setIsOpenCreateInvoiceDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </CardTitle>
            <CardDescription>Manage and view your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceList />
          </CardContent>
        </Card>
        {isOpenCreateInvoiceDialog && (
          <CreateInvoiceDialog
            isOpen={isOpenCreateInvoiceDialog}
            onClose={() => setIsOpenCreateInvoiceDialog(false)}
          />
        )}
      </InvoiceProvider>
    </>
  );
}
