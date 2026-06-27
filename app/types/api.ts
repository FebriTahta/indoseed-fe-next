export interface ApiResponse<T> {
  status: 'success' | 'error';
  success?: boolean;
  message?: string;
  data: T;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
