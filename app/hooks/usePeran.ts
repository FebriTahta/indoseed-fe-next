"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import peranService from '../services/peranService';
import { Peran, PeranStats, PeranFormValues } from '../types/peran';

const defaultFormValues: PeranFormValues = {
  kodePeran: '',
  namaPeran: '',
  kategori: 'Operasional',
  deskripsi: '',
  status: 'Aktif',
};

export function usePeran() {
  const [peranList, setPeranList] = useState<Peran[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Stats
  const [stats, setStats] = useState<PeranStats>({
    totalPeran: 0,
    aktif: 0,
    nonaktif: 0,
    totalPersonelAssigned: 0,
  });

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<Peran | null>(null);

  // Modal State (Detail)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<Peran | null>(null);

  // Modal State (Delete Confirm)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Peran | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // Form State
  const [formValues, setFormValues] = useState<PeranFormValues>(defaultFormValues);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await peranService.getStats();
      if (res.status === 'success' && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch peran stats:', err);
    }
  }, []);

  // Fetch Next Kode
  const handleFetchNextKode = useCallback(async () => {
    try {
      const res = await peranService.getNextKode();
      if (res.status === 'success' && res.data?.kodePeran) {
        setFormValues((prev) => ({ ...prev, kodePeran: res.data.kodePeran }));
      }
    } catch (err) {
      console.error('Failed to fetch next kode peran:', err);
    }
  }, []);

  // Fetch List
  const fetchList = useCallback(async () => {
    try {
      setIsTableLoading(true);
      const params: any = {
        page: currentPage,
        pageSize,
      };

      if (search.trim()) params.search = search.trim();
      if (filterKategori !== 'Semua') params.kategori = filterKategori;
      if (filterStatus !== 'Semua') params.status = filterStatus;

      const res = await peranService.getPerans(params);
      if (res.status === 'success' && res.data) {
        setPeranList(res.data);
        if (res.pagination) {
          setTotalRecords(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        }
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch peran list:', err);
      toast.error('Gagal memuat data master peran');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [currentPage, pageSize, search, filterKategori, filterStatus]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Open Add Modal
  const handleOpenAddModal = async () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormValues(defaultFormValues);
    setFormErrors({});
    setIsModalOpen(true);
    await handleFetchNextKode();
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: Peran) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormValues({
      kodePeran: item.kodePeran,
      namaPeran: item.namaPeran,
      kategori: item.kategori || 'Operasional',
      deskripsi: item.deskripsi || '',
      status: (item.status as 'Aktif' | 'Nonaktif') || 'Aktif',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = async (item: Peran) => {
    try {
      const res = await peranService.getById(item.id);
      if (res.status === 'success' && res.data) {
        setDetailItem(res.data);
      } else {
        setDetailItem(item);
      }
    } catch (err) {
      setDetailItem(item);
    }
    setIsDetailModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (item: Peran) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterKategori('Semua');
    setFilterStatus('Semua');
    setCurrentPage(1);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formValues.namaPeran.trim()) {
      errors.namaPeran = 'Nama peran wajib diisi';
    }

    if (!formValues.kategori) {
      errors.kategori = 'Kategori wajib dipilih';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Modal
  const handleSaveModal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.warning('Silakan lengkapi formulir dengan benar');
      return;
    }

    try {
      setIsSubmitLoading(true);

      if (modalMode === 'create') {
        const res = await peranService.create(formValues);
        if (res.status === 'success') {
          toast.success(res.message || 'Peran berhasil ditambahkan');
          setIsModalOpen(false);
          await fetchList();
          await fetchStats();
        }
      } else if (modalMode === 'edit' && selectedItem) {
        const res = await peranService.update(selectedItem.id, formValues);
        if (res.status === 'success') {
          toast.success(res.message || 'Peran berhasil diperbarui');
          setIsModalOpen(false);
          await fetchList();
          await fetchStats();
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menyimpan peran';
      toast.error(msg);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleteLoading(true);
      const res = await peranService.delete(itemToDelete.id);
      if (res.status === 'success') {
        toast.success(res.message || 'Peran berhasil dihapus');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        await fetchList();
        await fetchStats();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menghapus peran';
      toast.error(msg);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (item: Peran) => {
    try {
      const nextStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await peranService.update(item.id, { status: nextStatus });
      if (res.status === 'success') {
        toast.success(`Status peran berhasil diubah menjadi ${nextStatus}`);
        await fetchList();
        await fetchStats();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal mengubah status peran';
      toast.error(msg);
    }
  };

  return {
    peranList,
    loading,
    isTableLoading,
    isSubmitLoading,
    stats,
    // Filters
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Modals
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formValues,
    setFormValues,
    formErrors,
    handleFetchNextKode,
    isDetailModalOpen,
    setIsDetailModalOpen,
    detailItem,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    isDeleteLoading,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleOpenDeleteModal,
    handleResetFilters,
    handleSaveModal,
    handleConfirmDelete,
    handleToggleStatus,
    fetchList,
    fetchStats,
  };
}

export default usePeran;
