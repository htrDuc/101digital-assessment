import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvoiceContext } from '@/contexts/InvoiceContext';
import { ORDERING, SORT_BY } from '@/types/client';
import { InvoiceResponse } from '@/types/server';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import InvoiceDetailsDialog from '../InvoiceDetailsDialog';
import { InvoicePagination } from '../InvoicePagination';

export default function InvoiceList() {
  const {
    invoices,
    loading,
    error,
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    searchTerm,
    sortBy,
    ordering,
    refreshInvoices,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setSortBy,
    setOrdering,
  } = useInvoiceContext();

  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceResponse | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refreshInvoices();
  };

  const handleViewDetails = (invoice: InvoiceResponse) => {
    setSelectedInvoice(invoice);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex-col flex md:space-x-4 md:flex-row space-y-4 md:space-y-0">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 min-w-[150px] max-w-[350px]"
            />
          </div>
        </form>
        <div className="flex-row flex space-x-4 items-center">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SORT_BY)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SORT_BY.CREATED_DATE}>Created Date</SelectItem>
              <SelectItem value={SORT_BY.DUE_DATE}>Due Date</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={ordering}
            onValueChange={(value) => setOrdering(value as ORDERING)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ORDERING.ASCENDING}>Ascending</SelectItem>
              <SelectItem value={ORDERING.DESCENDING}>Descending</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshInvoices}>Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div role="status" className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {invoices.map((invoice) => (
                  <motion.tr
                    key={invoice.invoiceId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>
                      {invoice.customer.firstName} {invoice.customer.lastName}
                    </TableCell>
                    <TableCell>
                      {invoice.totalAmount} {invoice.currency}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status.some(
                            (s) => s.key === 'PAID' && s.value,
                          )
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {invoice.status.some((s) => s.key === 'PAID' && s.value)
                          ? 'Paid'
                          : 'Unpaid'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(invoice)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>
      )}

      <InvoicePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {selectedInvoice && (
        <InvoiceDetailsDialog
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
