import React, { createContext, useState, useContext, useCallback } from 'react';
import { InvoiceResponse } from '@/types/server';
import { useInvoice } from '@/hooks/useInvoice';
import { ORDERING, SORT_BY } from '@/types/client';

interface InvoiceContextType {
  invoices: InvoiceResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  searchTerm: string;
  sortBy: SORT_BY;
  ordering: ORDERING;
  refreshInvoices: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: SORT_BY) => void;
  setOrdering: (order: ORDERING) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getInvoices } = useInvoice();
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SORT_BY>(SORT_BY.CREATED_DATE);
  const [ordering, setOrdering] = useState<ORDERING>(ORDERING.DESCENDING);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInvoices({
        pageNum: currentPage,
        pageSize,
        sortBy,
        ordering,
        keyword: searchTerm,
      });
      if (response) {
        setInvoices(response.data);
        setTotalPages(Math.ceil(response.paging.totalRecords / pageSize));
        setTotalRecords(response.paging.totalRecords);
      }
    } catch (err) {
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, ordering, searchTerm, refreshTrigger]);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const refreshInvoices = () => setRefreshTrigger((prev) => prev + 1);

  const value = {
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
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};
