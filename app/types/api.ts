export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  success?: boolean;
  message?: string;
  data: T;
  pagination?: PaginationMeta;
}
