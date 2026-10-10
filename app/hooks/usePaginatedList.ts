import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '@/app/types/qc';
import { getErrorMessage } from '@/app/lib/format';

/**
 * State daftar server-side (filter + paginasi) yang dipakai ulang oleh daftar
 * Permintaan, Pemeriksaan, dan Hasil Pengujian.
 */
export function usePaginatedList<T, F extends object>(
  fetcher: (params: F & { page: number; pageSize: number }) => Promise<PaginatedResponse<T>>,
  initialFilters: F,
  initialPageSize = 10
) {
  const [filters, setFiltersState] = useState<F>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    try {
      const res = await fetcherRef.current({ ...filters, page, pageSize });
      if (current !== requestId.current) return; // abaikan response yang sudah usang
      setItems(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      if (current === requestId.current) toast.error(getErrorMessage(err, 'Gagal memuat data'));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  /** Ubah satu/lebih filter dan kembali ke halaman pertama. */
  const setFilters = useCallback((patch: Partial<F>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  return { items, total, totalPages, loading, filters, setFilters, resetFilters, page, setPage, pageSize, setPageSize, reload: load };
}
