export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export enum SORT_BY {
  CREATED_DATE = 'CREATED_DATE',
  DUE_DATE = 'DUE_DATE',
}

export enum ORDERING {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}
