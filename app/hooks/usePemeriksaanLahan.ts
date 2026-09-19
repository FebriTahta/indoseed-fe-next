"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  pemeriksaanLahanService,
  GetPemeriksaanLahanParams,
} from '../services/pemeriksaanLahanService';
import {
  PemeriksaanLahanItem,
  PemeriksaanStats,
  ReferensiJadwalTanamItem,
} from '../types/pemeriksaanLahan';

export function usePemeriksaanLahan() {
  const [items, setItems] = useState<PemeriksaanLahanItem[]>([]);
  const [stats, setStats] = useState<PemeriksaanStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua Komoditas');
  const [filterStatus, setFilterStatus] = useState<string>('Semua Status');
  const [activeTab, setActiveTab] = useState<string>('semua');
  const [filterPeriode, setFilterPeriode] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Selected Item & Side Detail Panel
  const [selectedItem, setSelectedItem] = useState<PemeriksaanLahanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Modal Tambah (Placeholder)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Eligible Jadwal Tanam Reference
  const [eligibleJadwals, setEligibleJadwals] = useState<ReferensiJadwalTanamItem[]>([]);
  const [loadingEligible, setLoadingEligible] = useState<boolean>(false);

  // Fetch Items & Stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetPemeriksaanLahanParams = {
        page: currentPage,
        pageSize,
        tab: activeTab,
      };

      if (search.trim()) params.search = search.trim();
      if (filterKomoditas && filterKomoditas !== 'Semua Komoditas') {
        params.komoditas = filterKomoditas;
      }
      if (filterStatus && filterStatus !== 'Semua Status') {
        params.status = filterStatus;
      }
      if (filterPeriode) {
        // e.g. "2026-06-01 - 2026-06-30"
        const parts = filterPeriode.split(' - ');
        if (parts.length === 2) {
          params.startDate = parts[0]?.trim();
          params.endDate = parts[1]?.trim();
        }
      }

      const res = await pemeriksaanLahanService.getList(params);
      setItems(res.data || []);
      setTotalRecords(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
      if (res.stats) {
        setStats(res.stats);
      }

      // If selectedItem is currently open, keep it updated with fresh data
      if (selectedItem) {
        const found = (res.data || []).find((i) => i.id === selectedItem.id);
        if (found) setSelectedItem(found);
      }
    } catch (err: any) {
      console.warn('Gagal memuat data pemeriksaan:', err?.message || String(err));
      setError(err?.message || 'Gagal memuat data pemeriksaan lahan');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, activeTab, search, filterKomoditas, filterStatus, filterPeriode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch Eligible Jadwals
  const fetchEligibleJadwals = useCallback(async () => {
    try {
      setLoadingEligible(true);
      const res = await pemeriksaanLahanService.getReferensiJadwalTanam();
      setEligibleJadwals(res.data || []);
    } catch (err: any) {
      console.warn('Gagal memuat referensi jadwal tanam:', err?.message || String(err));
    } finally {
      setLoadingEligible(false);
    }
  }, []);

  const handleOpenDetail = (item: PemeriksaanLahanItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedItem(null);
  };

  const handleOpenAddModal = () => {
    fetchEligibleJadwals();
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterKomoditas('Semua Komoditas');
    setFilterStatus('Semua Status');
    setActiveTab('semua');
    setFilterPeriode('');
    setCurrentPage(1);
  };

  return {
    items,
    stats,
    loading,
    error,
    // Filters
    search,
    setSearch,
    filterKomoditas,
    setFilterKomoditas,
    filterStatus,
    setFilterStatus,
    activeTab,
    setActiveTab,
    filterPeriode,
    setFilterPeriode,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Detail Selection
    selectedItem,
    isDetailOpen,
    handleOpenDetail,
    handleCloseDetail,
    // Add Modal
    isAddModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    // Eligible Jadwal
    eligibleJadwals,
    loadingEligible,
    fetchEligibleJadwals,
    // Actions
    handleResetFilters,
    refreshData: fetchData,
  };
}

export default usePemeriksaanLahan;
