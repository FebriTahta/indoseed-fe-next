"use client";

import { useState, useEffect, useCallback } from 'react';
import { monitoringGudangService } from '../services/monitoringGudangService';
import {
  MonitoringGudangItem,
  MonitoringGudangStats,
  MonitoringAlertItem,
  MasterGudangOption,
  MonitoringTab,
  MonitoringFormInput,
} from '../types/monitoringGudang';

export default function useMonitoringGudang() {
  const [activeTab, setActiveTab] = useState<MonitoringTab>('monitoring');
  const [items, setItems] = useState<MonitoringGudangItem[]>([]);
  const [stats, setStats] = useState<MonitoringGudangStats>({
    totalZona: 18,
    normal: 13,
    perluPerhatian: 3,
    tidakSesuai: 1,
    sensorOffline: 1,
    offlineOrTidakSesuai: 2,
    normalPercentage: 72.2,
    perluPerhatianPercentage: 16.7,
    tidakSesuaiPercentage: 5.6,
    sensorOfflinePercentage: 5.6,
  });
  const [alerts, setAlerts] = useState<MonitoringAlertItem[]>([]);
  const [gudangOptions, setGudangOptions] = useState<MasterGudangOption[]>([]);
  const [trenData, setTrenData] = useState<{
    location: string;
    series: { tanggal: string; suhu: number; rh: number }[];
  }>({
    location: 'Gudang Benih Bersih – Zona A (7 Hari Terakhir)',
    series: [
      { tanggal: '14 Nov', suhu: 23.5, rh: 48 },
      { tanggal: '15 Nov', suhu: 24.1, rh: 52 },
      { tanggal: '16 Nov', suhu: 24.0, rh: 50 },
      { tanggal: '17 Nov', suhu: 25.2, rh: 56 },
      { tanggal: '18 Nov', suhu: 24.6, rh: 53 },
      { tanggal: '19 Nov', suhu: 24.8, rh: 54 },
      { tanggal: '20 Nov', suhu: 24.5, rh: 48 },
    ],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGudang, setFilterGudang] = useState<string>('all');
  const [filterZona, setFilterZona] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRange, setFilterRange] = useState<string>('7days');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [totalRecords, setTotalRecords] = useState<number>(18);
  const [totalPages, setTotalPages] = useState<number>(3);

  // Modals
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isLaporanModalOpen, setIsLaporanModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MonitoringGudangItem | null>(null);
  const [editingItem, setEditingItem] = useState<MonitoringGudangItem | null>(null);

  // Form State for Manual Input
  const initialFormState: MonitoringFormInput = {
    gudangId: '',
    namaGudang: '',
    zona: 'Zona A',
    sensor: '',
    suhu: 24.5,
    rh: 50.0,
    suhuMin: 22.0,
    suhuMax: 26.0,
    rhMin: 45.0,
    rhMax: 55.0,
    waktuPengukuran: new Date().toISOString().slice(0, 16),
    sumberData: 'Manual',
    status: 'Auto',
    catatan: '',
    petugas: 'Admin Gudang',
  };
  const [formData, setFormData] = useState<MonitoringFormInput>(initialFormState);

  // Fetch initial Master Gudang options
  const fetchGudangOptions = useCallback(async () => {
    try {
      const res = await monitoringGudangService.getMasterGudangOptions();
      if (res && res.data) {
        setGudangOptions(res.data);
      }
    } catch (err) {
      console.error('Error fetching master gudang options:', err);
    }
  }, []);

  // Fetch Stats & Trend & Alerts
  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, alertsRes, trenRes] = await Promise.allSettled([
        monitoringGudangService.getStats(),
        monitoringGudangService.getAlerts(),
        monitoringGudangService.getTren(7),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value?.data) {
        setAlerts(alertsRes.value.data);
      }
      if (trenRes.status === 'fulfilled' && trenRes.value?.data) {
        setTrenData(trenRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard monitoring data:', err);
    }
  }, []);

  // Fetch Table List
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await monitoringGudangService.getMonitoringList({
        page: currentPage,
        pageSize,
        search: searchQuery || undefined,
        gudangId: filterGudang !== 'all' ? filterGudang : undefined,
        zona: filterZona !== 'all' ? filterZona : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        dateRange: filterRange,
      });

      if (res && res.data) {
        setItems(res.data);
        if (res.pagination) {
          setTotalRecords(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error('Error fetching monitoring list:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, filterGudang, filterZona, filterStatus, filterRange]);

  useEffect(() => {
    fetchGudangOptions();
    fetchDashboardData();
  }, [fetchGudangOptions, fetchDashboardData]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Handle Tab Switch
  const handleTabChange = (tab: MonitoringTab) => {
    setActiveTab(tab);
    if (tab === 'input') {
      handleOpenCreateModal();
    }
  };

  // Handle Search & Filter submit
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchList();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterGudang('all');
    setFilterZona('all');
    setFilterStatus('all');
    setFilterRange('7days');
    setCurrentPage(1);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const defaultGudang = gudangOptions.length > 0 ? gudangOptions[0] : null;
    setFormData({
      ...initialFormState,
      gudangId: defaultGudang ? defaultGudang.id : '',
      namaGudang: defaultGudang ? defaultGudang.namaGudang : 'Gudang Benih Bersih',
      waktuPengukuran: new Date().toISOString().slice(0, 16),
    });
    setEditingItem(null);
    setIsInputModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: MonitoringGudangItem) => {
    setEditingItem(item);
    setFormData({
      gudangId: item.gudangId || '',
      namaGudang: item.namaGudang,
      zona: item.zona,
      sensor: item.sensor || '',
      suhu: item.suhu !== null ? item.suhu : '',
      rh: item.rh !== null ? item.rh : '',
      suhuMin: item.suhuMin,
      suhuMax: item.suhuMax,
      rhMin: item.rhMin,
      rhMax: item.rhMax,
      waktuPengukuran: item.waktuPengukuran
        ? new Date(item.waktuPengukuran).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      sumberData: item.sumberData,
      status: item.status,
      catatan: item.catatan || '',
      petugas: item.petugas || 'Admin Gudang',
    });
    setIsInputModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: MonitoringGudangItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Submit Measurement Form (Create / Edit)
  const handleSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await monitoringGudangService.updatePengukuran(editingItem.id, formData);
      } else {
        await monitoringGudangService.createPengukuran(formData);
      }
      setIsInputModalOpen(false);
      setEditingItem(null);
      await Promise.all([fetchList(), fetchDashboardData()]);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Record
  const handleDeleteItem = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus catatan monitoring ini?')) {
      try {
        await monitoringGudangService.deletePengukuran(id);
        await Promise.all([fetchList(), fetchDashboardData()]);
      } catch (err: any) {
        alert(err.response?.data?.message || err.message || 'Gagal menghapus data');
      }
    }
  };

  // Handle Alert quick action
  const handleAlertAction = (alertItem: MonitoringAlertItem) => {
    if (alertItem.actionType === 'done') {
      alert(`Catatan: ${alertItem.title} telah selesai diverifikasi.`);
      return;
    }
    // Filter table by relevant warehouse/status
    if (alertItem.status) {
      setFilterStatus(alertItem.status);
    }
  };

  return {
    activeTab,
    handleTabChange,
    items,
    stats,
    alerts,
    trenData,
    gudangOptions,
    loading,
    isSubmitting,
    // Filters
    searchQuery,
    setSearchQuery,
    filterGudang,
    setFilterGudang,
    filterZona,
    setFilterZona,
    filterStatus,
    setFilterStatus,
    filterRange,
    setFilterRange,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals
    isInputModalOpen,
    setIsInputModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isLaporanModalOpen,
    setIsLaporanModalOpen,
    selectedItem,
    editingItem,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleDeleteItem,
    handleAlertAction,
    // Form
    formData,
    setFormData,
    handleSubmitForm,
    fetchList,
    fetchDashboardData,
  };
}
