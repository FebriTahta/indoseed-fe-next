"use client";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import penanggungJawabService from '../services/penanggungJawabService';
import { PenanggungJawab, PenanggungJawabStats } from '../types/penanggungJawab';

export interface FormValuesState {
  kodePersonel: string;
  nama: string;
  noHp: string;
  email: string;
  status: 'Aktif' | 'Nonaktif';
  peran: string;
  areaModul: string;
  lokasi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  catatan: string;
}

const defaultFormValues: FormValuesState = {
  kodePersonel: '',
  nama: '',
  noHp: '',
  email: '',
  status: 'Aktif',
  peran: 'Penanggung Jawab',
  areaModul: 'Produksi',
  lokasi: 'Semua Lokasi',
  tanggalMulai: '',
  tanggalSelesai: '',
  catatan: '',
};

export function usePenanggungJawab() {
  const [penanggungJawabList, setPenanggungJawabList] = useState<PenanggungJawab[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [filterPeran, setFilterPeran] = useState<string>('Semua');
  const [filterAreaModul, setFilterAreaModul] = useState<string>('Semua');
  const [filterLokasi, setFilterLokasi] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Aktif');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Stats
  const [stats, setStats] = useState<PenanggungJawabStats>({
    totalPersonel: 0,
    kepalaProduksi: 0,
    penanggungJawab: 0,
    aktif: 0,
    nonaktif: 0,
  });

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<PenanggungJawab | null>(null);

  // Modal State (Info Peran & Area / Modul)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Modal State (Detail Personel)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [detailItem, setDetailItem] = useState<PenanggungJawab | null>(null);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<PenanggungJawab | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // Form State
  const [formValues, setFormValues] = useState<FormValuesState>(defaultFormValues);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await penanggungJawabService.getStats();
      if (res.status === 'success' && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Fetch List
  const fetchPenanggungJawab = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const res = await penanggungJawabService.getPenanggungJawab({
        search: search.trim() || undefined,
        peran: filterPeran === 'Semua' ? undefined : filterPeran,
        areaModul: filterAreaModul === 'Semua' ? undefined : filterAreaModul,
        lokasi: filterLokasi === 'Semua' ? undefined : filterLokasi,
        status: filterStatus === 'Semua' || filterStatus === 'ALL' ? undefined : filterStatus,
        page: currentPage,
        pageSize,
      });

      if (res.status === 'success') {
        setPenanggungJawabList(res.data || []);
        if (res.pagination) {
          setTotalRecords(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        }
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch penanggung jawab:', err);
      toast.error(err.response?.data?.message || 'Gagal memuat data penanggung jawab');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [search, filterPeran, filterAreaModul, filterLokasi, filterStatus, currentPage, pageSize]);

  // Initial & Filter Triggers
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPenanggungJawab();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchPenanggungJawab]);

  // Fetch Next Kode
  const handleFetchNextKode = async () => {
    try {
      const res = await penanggungJawabService.getNextKode();
      if (res.status === 'success' && res.data?.kodePersonel) {
        setFormValues((prev) => ({ ...prev, kodePersonel: res.data.kodePersonel }));
      }
    } catch (err) {
      console.error('Failed to get next kode:', err);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = async () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormValues({ ...defaultFormValues });
    setFormErrors({});
    setIsModalOpen(true);

    try {
      const res = await penanggungJawabService.getNextKode();
      if (res.status === 'success' && res.data?.kodePersonel) {
        setFormValues((prev) => ({ ...prev, kodePersonel: res.data.kodePersonel }));
      }
    } catch {
      setFormValues((prev) => ({ ...prev, kodePersonel: 'PJ-001' }));
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: PenanggungJawab) => {
    setModalMode('edit');
    setSelectedItem(item);

    const formatDateInput = (dateStr?: string | null) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };

    setFormValues({
      kodePersonel: item.kodePersonel || '',
      nama: item.nama || '',
      noHp: item.noHp || '',
      email: item.email || '',
      status: (item.status === 'Nonaktif' || item.status === 'Tidak Aktif' ? 'Nonaktif' : 'Aktif') as 'Aktif' | 'Nonaktif',
      peran: item.peran || 'Penanggung Jawab',
      areaModul: item.areaModul || 'Produksi',
      lokasi: item.lokasi || 'Semua Lokasi',
      tanggalMulai: formatDateInput(item.tanggalMulai),
      tanggalSelesai: formatDateInput(item.tanggalSelesai),
      catatan: item.catatan || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: PenanggungJawab) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (item: PenanggungJawab) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterPeran('Semua');
    setFilterAreaModul('Semua');
    setFilterLokasi('Semua');
    setFilterStatus('Semua');
    setCurrentPage(1);
  };

  // Save Modal (Create / Update)
  const handleSaveModal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const errors: { [key: string]: string } = {};
    if (!formValues.nama.trim()) {
      errors.nama = 'Nama lengkap wajib diisi';
    }
    if (!formValues.peran) {
      errors.peran = 'Peran wajib dipilih';
    }
    if (!formValues.areaModul) {
      errors.areaModul = 'Area / Modul wajib dipilih';
    }
    if (!formValues.lokasi) {
      errors.lokasi = 'Lokasi tanggung jawab wajib dipilih';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Mohon lengkapi kolom yang wajib diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const payload = {
        kodePersonel: formValues.kodePersonel.trim() || undefined,
        nama: formValues.nama.trim(),
        peran: formValues.peran,
        areaModul: formValues.areaModul,
        lokasi: formValues.lokasi,
        noHp: formValues.noHp.trim() || undefined,
        email: formValues.email.trim() || undefined,
        status: formValues.status,
        tanggalMulai: formValues.tanggalMulai ? formValues.tanggalMulai : null,
        tanggalSelesai: formValues.tanggalSelesai ? formValues.tanggalSelesai : null,
        catatan: formValues.catatan.trim() || undefined,
      };

      if (modalMode === 'create') {
        const res = await penanggungJawabService.createPenanggungJawab(payload);
        if (res.status === 'success') {
          toast.success(res.message || 'Personel & Tanggung Jawab berhasil ditambahkan');
          setIsModalOpen(false);
          fetchPenanggungJawab();
          fetchStats();
        }
      } else if (modalMode === 'edit' && selectedItem) {
        const res = await penanggungJawabService.updatePenanggungJawab(selectedItem.id, payload);
        if (res.status === 'success') {
          toast.success(res.message || 'Data Personel & Tanggung Jawab berhasil diperbarui');
          setIsModalOpen(false);
          fetchPenanggungJawab();
          fetchStats();
        }
      }
    } catch (err: any) {
      console.error('Failed to save penanggung jawab:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan data penanggung jawab');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleteLoading(true);
    try {
      const res = await penanggungJawabService.deletePenanggungJawab(itemToDelete.id);
      if (res.status === 'success') {
        toast.success(res.message || 'Personel & Tanggung Jawab berhasil dihapus');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        fetchPenanggungJawab();
        fetchStats();
      }
    } catch (err: any) {
      console.error('Failed to delete penanggung jawab:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus penanggung jawab');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (item: PenanggungJawab) => {
    const newStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      const res = await penanggungJawabService.updatePenanggungJawab(item.id, {
        status: newStatus,
      });
      if (res.status === 'success') {
        toast.success(`Status ${item.nama} diubah menjadi ${newStatus}`);
        fetchPenanggungJawab();
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  return {
    penanggungJawabList,
    loading,
    isTableLoading,
    isSubmitLoading,
    stats,
    // Filters
    search,
    setSearch,
    filterPeran,
    setFilterPeran,
    filterAreaModul,
    setFilterAreaModul,
    filterLokasi,
    setFilterLokasi,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Modal Tambah/Edit
    isModalOpen,
    setIsModalOpen,
    modalMode,
    selectedItem,
    formValues,
    setFormValues,
    formErrors,
    handleFetchNextKode,
    // Modal Info Peran & Area
    isInfoModalOpen,
    setIsInfoModalOpen,
    // Modal Detail
    isDetailModalOpen,
    setIsDetailModalOpen,
    detailItem,
    // Modal Delete
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
    fetchPenanggungJawab,
  };
}
