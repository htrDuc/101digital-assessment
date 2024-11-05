import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/types/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function InvoicePagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Pagination) {
  return (
    <div className="flex flex-wrap items-center justify-between px-2 ">
      <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
        <p className="block text-sm font-medium">
          Total Records: {totalRecords}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center space-x-2 sm:space-x-4">
        <div className="flex items-center space-x-1 sm:space-x-2 ">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="hidden sm:flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                className="h-8 w-8 mx-0.5"
                onClick={() => onPageChange(page)}
              >
                <span className="sr-only">Go to page {page}</span>
                <span>{page}</span>
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder={pageSize.toString()} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
