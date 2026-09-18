'use client';

import { useState, useEffect, useCallback } from 'react';
import { persetujuanProduksiService } from '@/app/services/persetujuanProduksiService';
import {
  PersetujuanProduksi,
  PersetujuanProduksiStats,
} from '@/app/types/persetujuanProduksi';
import { toast } from 'react-toastify';

export function usePersetujuanProduksi() {
  const [items, setItems] = useState<PersetujuanProduksi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<PersetujuanProduksiStats>({
    menunggu: 0,
    disetujui: 0,
    ditolak: 0,
    total: 0,
  });

  // Filter states
  const [search, setSearch] = useState<string>('');
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [filterPengaju, setFilterPengaju] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPeriode, setFilterPeriode] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await persetujuanProduksiService.getStats();
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch Persetujuan Produksi stats:', err);
    }
  }, []);

  // Fetch List
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let startDate: string | undefined = undefined;
      let endDate: string | undefined = undefined;

      if (filterPeriode && filterPeriode !== 'all') {
        if (filterPeriode === '2026-06') {
          startDate = '2026-06-01';
          endDate = '2026-06-30';
        } else if (filterPeriode === '2026-07') {
          startDate = '2026-07-01';
          endDate = '2026-07-31';
        } else if (filterPeriode === '2026-08') {
          startDate = '2026-08-01';
          endDate = '2026-08-31';
        } else if (filterPeriode === '2026-09') {
          startDate = '2026-09-01';
          endDate = '2026-09-30';
        } else if (filterPeriode === '2026-10') {
          startDate = '2026-10-01';
          endDate = '2026-10-31';
        }
      }

      const res = await persetujuanProduksiService.getList({
        search: search.trim() || undefined,
        jenis: filterJenis !== 'all' ? filterJenis : undefined,
        pengaju: filterPengaju !== 'all' ? filterPengaju : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        startDate,
        endDate,
        page: currentPage,
        pageSize,
      });

      if (res && res.data) {
        setItems(res.data);
        if (res.pagination) {
          setTotalRecords(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch Persetujuan Produksi list:', err);
      setError(err?.response?.data?.message || 'Gagal memuat data persetujuan produksi');
    } finally {
      setLoading(false);
    }
  }, [
    search,
    filterJenis,
    filterPengaju,
    filterStatus,
    filterPeriode,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleResetFilters = () => {
    setSearch('');
    setFilterJenis('all');
    setFilterPengaju('all');
    setFilterStatus('all');
    setFilterPeriode('all');
    setCurrentPage(1);
  };

  const handleApprove = async (id: string, catatan?: string) => {
    try {
      const res = await persetujuanProduksiService.approve(id, catatan);
      toast.success(res.message || 'Pengajuan berhasil disetujui');
      fetchItems();
      fetchStats();
      return true;
    } catch (err: any) {
      console.error('Error approving:', err);
      toast.error(err?.response?.data?.message || 'Gagal menyetujui pengajuan');
      return false;
    }
  };

  const handleReject = async (id: string, alasan: string) => {
    try {
      const res = await persetujuanProduksiService.reject(id, alasan);
      toast.success(res.message || 'Pengajuan berhasil ditolak');
      fetchItems();
      fetchStats();
      return true;
    } catch (err: any) {
      console.error('Error rejecting:', err);
      toast.error(err?.response?.data?.message || 'Gagal menolak pengajuan');
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    stats,
    search,
    setSearch,
    filterJenis,
    setFilterJenis,
    filterPengaju,
    setFilterPengaju,
    filterStatus,
    setFilterStatus,
    filterPeriode,
    setFilterPeriode,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    handleResetFilters,
    handleApprove,
    handleReject,
    refreshData: () => {
      fetchItems();
      fetchStats();
    },
  };
}
