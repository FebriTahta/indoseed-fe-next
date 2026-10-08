"use client";
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import kelompokTaniService from '../services/kelompokTaniService';
import penanggungJawabService from '../services/penanggungJawabService';
import commodityService from '../services/commodityService';
import { KelompokTani, KelompokTaniStats } from '../types/kelompokTani';
import { PenanggungJawab } from '../types/penanggungJawab';
import { Commodity } from '../types/commodity';

export interface FormKelompokTaniValues {
  id?: string;
  kodeKelompok: string;
  namaKelompok: string;
  ketua: string;
  noHpKetua: string;
  tahunBerdiri: string;
  lokasi: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  komoditasUtama: string;
  commodityId: string;
  jumlahAnggota: number;
  deskripsi: string;
  status: 'Aktif' | 'Nonaktif';
  penanggungJawabId: string;
}

const defaultFormValues: FormKelompokTaniValues = {
  kodeKelompok: '',
  namaKelompok: '',
  ketua: '',
  noHpKetua: '',
  tahunBerdiri: '',
  lokasi: '',
  desa: '',
  kecamatan: '',
  kabupaten: '',
  komoditasUtama: '',
  commodityId: '',
  jumlahAnggota: 0,
  deskripsi: '',
  status: 'Aktif',
  penanggungJawabId: '',
};

export function useKelompokTani() {
  const [kelompokTaniList, setKelompokTaniList] = useState<KelompokTani[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  // References list
  const [penanggungJawabList, setPenanggungJawabList] = useState<PenanggungJawab[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [filterLokasi, setFilterLokasi] = useState<string>('Semua Lokasi');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua Komoditas');
  const [filterStatus, setFilterStatus] = useState<string>('Semua Status');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Stats
  const [stats, setStats] = useState<KelompokTaniStats>({
    totalKelompok: 0,
    totalAnggota: 0,
    komoditasUtama: 'Melon, Cabai, Semangka',
    statusAktifCount: 0,
    totalCount: 0,
  });
  const [allLokasi, setAllLokasi] = useState<string[]>([]);
  const [allKomoditas, setAllKomoditas] = useState<string[]>([]);

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<KelompokTani | null>(null);

  // Detail Pop up Modal State
  const [detailItem, setDetailItem] = useState<KelompokTani | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Delete Confirm Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<KelompokTani | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  // Form State
  const [formValues, setFormValues] = useState<FormKelompokTaniValues>(defaultFormValues);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch Master Options
  const fetchMasterReferences = useCallback(async () => {
    try {
      const [pjRes, comRes] = await Promise.all([
        penanggungJawabService.getPenanggungJawab({ pageSize: 100, status: 'Aktif' }).catch(() => null),
        commodityService.getCommodities({ pageSize: 100 }).catch(() => null),
      ]);

      if (pjRes && pjRes.data) {
        setPenanggungJawabList(Array.isArray(pjRes.data) ? pjRes.data : []);
      }
      if (comRes && comRes.data) {
        setCommodities(Array.isArray(comRes.data) ? comRes.data : []);
      }
    } catch (err) {
      console.error('Error fetching master references:', err);
    }
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await kelompokTaniService.getStats();
      if (res.status === 'success' && res.data) {
        setStats(res.data);
        if (res.data.allLokasi && res.data.allLokasi.length > 0) {
          setAllLokasi(res.data.allLokasi);
        }
        if (res.data.allKomoditas && res.data.allKomoditas.length > 0) {
          setAllKomoditas(res.data.allKomoditas);
        }
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  // Fetch List
  const fetchKelompokTani = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const res = await kelompokTaniService.getKelompokTani({
        search: search.trim() || undefined,
        lokasi: filterLokasi === 'Semua Lokasi' ? undefined : filterLokasi,
        komoditasUtama: filterKomoditas === 'Semua Komoditas' ? undefined : filterKomoditas,
        status: filterStatus === 'Semua Status' ? undefined : filterStatus,
        page: currentPage,
        pageSize,
      });

      if (res.status === 'success') {
        const items = res.data || [];
        setKelompokTaniList(items);

        if (res.pagination) {
          setTotalRecords(res.pagination.totalItems);
          setTotalPages(res.pagination.totalPages);
        }

        if (res.stats) {
          setStats(res.stats);
          if (res.stats.allLokasi && res.stats.allLokasi.length > 0) {
            setAllLokasi(res.stats.allLokasi);
          }
          if (res.stats.allKomoditas && res.stats.allKomoditas.length > 0) {
            setAllKomoditas(res.stats.allKomoditas);
          }
        }

        // Keep detailItem in sync if already selected WITHOUT causing infinite re-render loops
        setDetailItem((prev) => {
          if (!prev) return null;
          const fresh = items.find((x) => x.id === prev.id);
          return fresh ? { ...prev, ...fresh } : prev;
        });
      }
    } catch (err) {
      console.error('Failed to fetch kelompok tani:', err);
      toast.error('Gagal memuat data kelompok tani');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [search, filterLokasi, filterKomoditas, filterStatus, currentPage, pageSize]);

  // Initial Load
  useEffect(() => {
    fetchMasterReferences();
    fetchStats();
  }, [fetchMasterReferences, fetchStats]);

  // Load list when filters change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchKelompokTani();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchKelompokTani]);

  // Handle Fetch Next Kode
  const handleFetchNextKode = useCallback(async () => {
    try {
      const res = await kelompokTaniService.getNextKode();
      if (res.status === 'success' && res.data?.kodeKelompok) {
        setFormValues((prev) => ({
          ...prev,
          kodeKelompok: res.data.kodeKelompok,
        }));
      }
    } catch (err) {
      console.error('Failed to get next kode:', err);
    }
  }, []);

  // Open Add Modal
  const handleOpenAddModal = async () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormErrors({});
    setFormValues(defaultFormValues);
    setIsModalOpen(true);

    try {
      const res = await kelompokTaniService.getNextKode();
      if (res.status === 'success' && res.data?.kodeKelompok) {
        setFormValues((prev) => ({
          ...prev,
          kodeKelompok: res.data.kodeKelompok,
        }));
      }
    } catch {
      setFormValues((prev) => ({ ...prev, kodeKelompok: 'KT-001' }));
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: KelompokTani) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormErrors({});

    setFormValues({
      id: item.id,
      kodeKelompok: item.kodeKelompok || '',
      namaKelompok: item.namaKelompok || '',
      ketua: item.ketua || '',
      noHpKetua: item.noHpKetua || '',
      tahunBerdiri: item.tahunBerdiri || '',
      lokasi: item.lokasi || '',
      desa: item.desa || '',
      kecamatan: item.kecamatan || '',
      kabupaten: item.kabupaten || '',
      komoditasUtama: item.komoditasUtama || '',
      commodityId: item.commodityId || '',
      jumlahAnggota: item.jumlahAnggota || (item.partners ? item.partners.length : 0),
      deskripsi: item.deskripsi || '',
      status: (item.status === 'Aktif' ? 'Aktif' : 'Nonaktif') as 'Aktif' | 'Nonaktif',
      penanggungJawabId: item.penanggungJawabId || '',
    });

    setIsModalOpen(true);
  };

  // Open Detail Modal Popup
  const handleOpenDetail = useCallback(async (item: KelompokTani) => {
    setDetailItem(item);
    setIsDetailModalOpen(true);
    try {
      const res = await kelompokTaniService.getKelompokTaniById(item.id);
      if (res.status === 'success' && res.data) {
        setDetailItem(res.data);
        return;
      }
    } catch {}
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setDetailItem(null);
  }, []);

  // Open Delete Modal
  const handleOpenDeleteModal = (item: KelompokTani) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterLokasi('Semua Lokasi');
    setFilterKomoditas('Semua Komoditas');
    setFilterStatus('Semua Status');
    setCurrentPage(1);
  };

  // Validate Form
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formValues.namaKelompok.trim()) {
      errors.namaKelompok = 'Nama kelompok tani wajib diisi';
    }
    if (!formValues.ketua.trim()) {
      errors.ketua = 'Nama ketua kelompok wajib diisi';
    }
    if (!formValues.lokasi.trim()) {
      errors.lokasi = 'Lokasi wajib diisi';
    }
    if (!formValues.komoditasUtama.trim()) {
      errors.komoditasUtama = 'Komoditas utama wajib diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save Modal (Create / Update)
  const handleSaveModal = async () => {
    if (!validateForm()) {
      toast.warn('Mohon lengkapi data yang bertanda bintang (*)');
      return;
    }

    setIsSubmitLoading(true);
    try {
      if (modalMode === 'create') {
        const res = await kelompokTaniService.createKelompokTani({
          kodeKelompok: formValues.kodeKelompok.trim() || undefined,
          namaKelompok: formValues.namaKelompok.trim(),
          ketua: formValues.ketua.trim(),
          noHpKetua: formValues.noHpKetua.trim() || null,
          tahunBerdiri: formValues.tahunBerdiri.trim() || null,
          lokasi: formValues.lokasi.trim(),
          desa: formValues.desa.trim() || null,
          kecamatan: formValues.kecamatan.trim() || null,
          kabupaten: formValues.kabupaten.trim() || null,
          komoditasUtama: formValues.komoditasUtama.trim(),
          commodityId: formValues.commodityId || null,
          jumlahAnggota: Number(formValues.jumlahAnggota) || 0,
          deskripsi: formValues.deskripsi.trim() || null,
          status: formValues.status,
          penanggungJawabId: formValues.penanggungJawabId || null,
        });

        if (res.status === 'success') {
          toast.success('Kelompok tani berhasil ditambahkan');
          setIsModalOpen(false);
          await fetchKelompokTani();
          await fetchStats();
        } else {
          toast.error(res.message || 'Gagal menambahkan kelompok tani');
        }
      } else if (modalMode === 'edit' && selectedItem) {
        const res = await kelompokTaniService.updateKelompokTani(selectedItem.id, {
          kodeKelompok: formValues.kodeKelompok.trim() || undefined,
          namaKelompok: formValues.namaKelompok.trim(),
          ketua: formValues.ketua.trim(),
          noHpKetua: formValues.noHpKetua.trim() || null,
          tahunBerdiri: formValues.tahunBerdiri.trim() || null,
          lokasi: formValues.lokasi.trim(),
          desa: formValues.desa.trim() || null,
          kecamatan: formValues.kecamatan.trim() || null,
          kabupaten: formValues.kabupaten.trim() || null,
          komoditasUtama: formValues.komoditasUtama.trim(),
          commodityId: formValues.commodityId || null,
          jumlahAnggota: Number(formValues.jumlahAnggota) || 0,
          deskripsi: formValues.deskripsi.trim() || null,
          status: formValues.status,
          penanggungJawabId: formValues.penanggungJawabId || null,
        });

        if (res.status === 'success') {
          toast.success('Kelompok tani berhasil diperbarui');
          setIsModalOpen(false);
          await fetchKelompokTani();
          await fetchStats();
        } else {
          toast.error(res.message || 'Gagal memperbarui kelompok tani');
        }
      }
    } catch (err: any) {
      console.error('Failed to save kelompok tani:', err);
      toast.error(err.response?.data?.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleteLoading(true);
    try {
      const res = await kelompokTaniService.deleteKelompokTani(itemToDelete.id);
      if (res.status === 'success') {
        toast.success(`Kelompok tani '${itemToDelete.namaKelompok}' berhasil dihapus`);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        if (detailItem?.id === itemToDelete.id) {
          setDetailItem(null);
        }
        await fetchKelompokTani();
        await fetchStats();
      } else {
        toast.error(res.message || 'Gagal menghapus kelompok tani');
      }
    } catch (err: any) {
      console.error('Failed to delete kelompok tani:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus kelompok tani');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (item: KelompokTani) => {
    const newStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    try {
      const res = await kelompokTaniService.updateKelompokTani(item.id, {
        status: newStatus,
      });

      if (res.status === 'success') {
        toast.success(`Status ${item.namaKelompok} diubah menjadi ${newStatus}`);
        await fetchKelompokTani();
        await fetchStats();
      }
    } catch (err: any) {
      console.error('Failed to toggle status:', err);
      toast.error('Gagal memperbarui status');
    }
  };

  return {
    kelompokTaniList,
    loading,
    isTableLoading,
    isSubmitLoading,
    penanggungJawabList,
    commodities,
    stats,
    // Filters
    search,
    setSearch,
    filterLokasi,
    setFilterLokasi,
    filterKomoditas,
    setFilterKomoditas,
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
    detailItem,
    isDetailModalOpen,
    setIsDetailModalOpen,
    handleOpenDetail,
    handleCloseDetail,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    isDeleteLoading,
    allLokasi,
    allKomoditas,
    fetchKelompokTani,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleResetFilters,
    handleSaveModal,
    handleConfirmDelete,
    handleToggleStatus,
  };
}
