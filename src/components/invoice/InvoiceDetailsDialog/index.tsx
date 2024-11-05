import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InvoiceResponse } from '@/types/server';

interface InvoiceDetailsProps {
  invoice: InvoiceResponse | null;
  onClose: () => void;
}

export default function InvoiceDetailsDialog({
  invoice,
  onClose,
}: InvoiceDetailsProps) {
  if (!invoice) return null;

  const isPaid = invoice.status.some((s) => s.key === 'PAID' && s.value);

  return (
    <Dialog open={!!invoice} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogTitle className="p-6 pb-0 text-2xl font-semibold">
          Invoice #{invoice.invoiceNumber}
        </DialogTitle>
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <p className="text-sm text-muted-foreground">
                #{invoice.invoiceReference}
              </p>
              <Badge
                variant={isPaid ? 'default' : 'destructive'}
                className="text-sm"
              >
                {isPaid ? 'Paid' : 'Unpaid'}
              </Badge>
            </div>

            {/* Bill To / From */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Bill to:
                </h3>
                <p className="text-lg font-medium">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Customer ID: {invoice.customer.id}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  From:
                </h3>
                <p className="text-lg font-medium">{invoice.merchant.name}</p>
                <p className="text-sm text-muted-foreground">
                  Merchant ID: {invoice.merchant.id}
                </p>
              </div>
            </div>

            {/* Dates and Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Invoice Date
                </h3>
                <p>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Due Date
                </h3>
                <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Reference
                </h3>
                <p>{invoice.referenceNo}</p>
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-lg border p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>
                    {invoice.invoiceSubTotal} {invoice.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>
                    {invoice.totalTax} {invoice.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span>
                    {invoice.totalDiscount} {invoice.currency}
                  </span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total:</span>
                  <span>
                    {invoice.totalAmount} {invoice.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Amount Paid:</span>
                  <span>
                    {invoice.totalPaid} {invoice.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Balance:</span>
                  <span>
                    {invoice.balanceAmount} {invoice.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Additional Information
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Created by: {invoice.createdBy}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created at: {new Date(invoice.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Version: {invoice.version}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Custom Fields
                </h3>
                <div className="space-y-1">
                  {invoice.customFields.map((field, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-muted-foreground">
                        {field.key}:{' '}
                      </span>
                      <span>{field.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
