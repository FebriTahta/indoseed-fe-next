"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import lokasiService from '../services/lokasiService';
import { Lokasi, LokasiStats, LokasiFormValues } from '../types/lokasi';

const defaultFormValues: LokasiFormValues = {
  kodeLokasi: '',
  namaLokasi: '',
  tipeLokasi: 'Kebun / Lahan',
  alamat: '',
  kota: '',
  provinsi: '',
  koordinat: '',
  luasArea: 0,
  penanggungJawabUtama: '',
  status: 'Aktif',
  keterangan: '',
};

export function useLokasi() {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [filterTipeLokasi, setFilterTipeLokasi] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Stats
  const [stats, setStats] = useState<LokasiStats>({
    totalLokasi: 0,
    aktif: 0,
    nonaktif: 0,
    totalPersonelAssigned: 0,
  });

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<Lokasi | null>(null);

  // Modal State (Detail)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<Lokasi | null>(null);

  // Modal State (Delete Confirm)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Lokasi | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // Form State
  const [formValues, setFormValues] = useState<LokasiFormValues>(defaultFormValues);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await lokasiService.getStats();
      if (res.status === 'success' && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch lokasi stats:', err);
    }
  }, []);

  // Fetch Next Kode
  const handleFetchNextKode = useCallback(async () => {
    try {
      const res = await lokasiService.getNextKode();
      if (res.status === 'success' && res.data?.kodeLokasi) {
        setFormValues((prev) => ({ ...prev, kodeLokasi: res.data.kodeLokasi }));
      }
    } catch (err) {
      console.error('Failed to fetch next kode lokasi:', err);
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
      if (filterTipeLokasi !== 'Semua') params.tipeLokasi = filterTipeLokasi;
      if (filterStatus !== 'Semua') params.status = filterStatus;

      const res = await lokasiService.getLokasis(params);
      if (res.status === 'success' && res.data) {
        setLokasiList(res.data);
        if (res.pagination) {
          setTotalRecords(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        }
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch lokasi list:', err);
      toast.error('Gagal memuat data master lokasi');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [currentPage, pageSize, search, filterTipeLokasi, filterStatus]);

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
  const handleOpenEditModal = (item: Lokasi) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormValues({
      kodeLokasi: item.kodeLokasi,
      namaLokasi: item.namaLokasi,
      tipeLokasi: item.tipeLokasi || 'Kebun / Lahan',
      alamat: item.alamat || '',
      kota: item.kota || '',
      provinsi: item.provinsi || '',
      koordinat: item.koordinat || '',
      luasArea: item.luasArea !== null && item.luasArea !== undefined ? item.luasArea : 0,
      penanggungJawabUtama: item.penanggungJawabUtama || '',
      status: (item.status as 'Aktif' | 'Nonaktif') || 'Aktif',
      keterangan: item.keterangan || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = async (item: Lokasi) => {
    try {
      const res = await lokasiService.getById(item.id);
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
  const handleOpenDeleteModal = (item: Lokasi) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterTipeLokasi('Semua');
    setFilterStatus('Semua');
    setCurrentPage(1);
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formValues.namaLokasi.trim()) {
      errors.namaLokasi = 'Nama lokasi wajib diisi';
    }

    if (!formValues.tipeLokasi) {
      errors.tipeLokasi = 'Tipe lokasi wajib dipilih';
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
        const res = await lokasiService.create(formValues);
        if (res.status === 'success') {
          toast.success(res.message || 'Lokasi berhasil ditambahkan');
          setIsModalOpen(false);
          await fetchList();
          await fetchStats();
        }
      } else if (modalMode === 'edit' && selectedItem) {
        const res = await lokasiService.update(selectedItem.id, formValues);
        if (res.status === 'success') {
          toast.success(res.message || 'Lokasi berhasil diperbarui');
          setIsModalOpen(false);
          await fetchList();
          await fetchStats();
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menyimpan lokasi';
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
      const res = await lokasiService.delete(itemToDelete.id);
      if (res.status === 'success') {
        toast.success(res.message || 'Lokasi berhasil dihapus');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        await fetchList();
        await fetchStats();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal menghapus lokasi';
      toast.error(msg);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (item: Lokasi) => {
    try {
      const nextStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      const res = await lokasiService.update(item.id, { status: nextStatus });
      if (res.status === 'success') {
        toast.success(`Status lokasi berhasil diubah menjadi ${nextStatus}`);
        await fetchList();
        await fetchStats();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Gagal mengubah status lokasi';
      toast.error(msg);
    }
  };

  return {
    lokasiList,
    loading,
    isTableLoading,
    isSubmitLoading,
    stats,
    // Filters
    search,
    setSearch,
    filterTipeLokasi,
    setFilterTipeLokasi,
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

export default useLokasi;
