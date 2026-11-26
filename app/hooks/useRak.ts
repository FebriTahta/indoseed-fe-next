import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import rakService from '@/app/services/rakService';
import gudangService from '@/app/services/gudangService';
import { RakData } from '@/app/types/rak';
import { GudData } from '@/app/types/gudang';
import { toast } from 'react-toastify';

export function useRak() {
  const router = useRouter();
  const [raks, setRaks] = useState<RakData[]>([]);
  const [gudangList, setGudangList] = useState<GudData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const [filterKategori, setFilterKategori] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterGudang, setFilterGudang] = useState<any>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Viewed Detail State
  const [viewed, setViewed] = useState<RakData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'utilisasi' | 'riwayat' | 'note'>('info');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formValues, setFormValues] = useState({
    id: '', // kodeRak
    namaRak: '',
    kodeGudang: '',
    namaGudang: '',
    kategori: 'benih' as RakData['kategori'],
    kapasitas: 1000,
    baris: 'A',
    kolom: '1',
    level: '1',
    status: 'Aktif' as RakData['status'],
    keterangan: '',
  });

  // Options
  const kategoriOptions = [
    { value: 'benih', label: 'Rak Benih' },
    { value: 'packing', label: 'Rak Packing' },
    { value: 'treatment', label: 'Rak Bahan Treatment' },
    { value: 'umum', label: 'Rak Umum' },
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Penuh', label: 'Penuh' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  ];

  const gudangOptions = useMemo(() => {
    return gudangList.map((g) => ({
      value: g.kodeGudang,
      label: `${g.namaGudang} (${g.kodeGudang})`,
    }));
  }, [gudangList]);

  // Fetch Gudang Reference Options
  const fetchGudangs = useCallback(async () => {
    try {
      const result = await gudangService.getGudangs();
      if (result.success || result.status === 'success') {
        setGudangList(result.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch gudang options:', err);
    }
  }, []);

  // API Call: Fetch list with pagination and filters
  const fetchRakList = useCallback(
    async (pageToFetch = currentPage) => {
      setIsTableLoading(true);
      try {
        const result = await rakService.getRakList({
          page: pageToFetch,
          pageSize,
          search: debouncedSearch || undefined,
          kategori: filterKategori?.value || undefined,
          status: filterStatus?.value || undefined,
          kodeGudang: filterGudang?.value || undefined,
        });

        if (result.status === 'success') {
          setRaks(result.data || []);
          setTotalRecords(result.pagination?.totalItems || 0);
          setTotalPages(result.pagination?.totalPages || 0);
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Akses Tidak Sah');
          router.push('/');
          return;
        }
        toast.error('Gagal mengambil data rak');
      } finally {
        setIsTableLoading(false);
        setLoading(false);
      }
    },
    [currentPage, pageSize, debouncedSearch, filterKategori, filterStatus, filterGudang, router]
  );

  // Initial Auth Check and Data Fetch
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        let currentUserRole = '';
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const payload = JSON.parse(jsonPayload);
            const firstRole = payload.roles && payload.roles.length > 0 ? payload.roles[0] : null;
            currentUserRole =
              payload.role ||
              payload.activeRole?.name ||
              (firstRole ? (typeof firstRole === 'object' ? firstRole.name : firstRole) : '');
          } catch (e) {
            console.error('Could not parse token', e);
          }
        }

        if (!token || (currentUserRole !== 'superadmin' && currentUserRole !== 'admin')) {
          setError('Unauthorized access');
          router.push('/');
          return;
        }

        await Promise.all([fetchGudangs(), fetchRakList(1)]);
        setIsInitialized(true);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
        setIsTableLoading(false);
      }
    };

    checkAuthAndFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Re-fetch when pagination or filters change after initialization
  useEffect(() => {
    if (isInitialized) {
      fetchRakList(currentPage);
    }
  }, [isInitialized, currentPage, pageSize, debouncedSearch, filterKategori, filterStatus, filterGudang, fetchRakList]);

  // Open Edit Modal
  const handleOpenEditModal = (rak: RakData) => {
    setModalMode('edit');

    setFormValues({
      id: rak.kodeRak,
      namaRak: rak.namaRak,
      kodeGudang: rak.kodeGudang || '',
      namaGudang: rak.namaGudang || '',
      kategori: rak.kategori,
      kapasitas: rak.kapasitas || 1000,
      baris: rak.baris || 'A',
      kolom: rak.kolom || '1',
      level: rak.level || '1',
      status: rak.status,
      keterangan: rak.keterangan || '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const rak = raks.find((r) => r.kodeRak === id || r.id === id);
    if (!rak) {
      toast.error('Data rak tidak ditemukan');
      return;
    }
    handleOpenEditModal(rak);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Yakin ingin menghapus rak dengan kode ${id}?`)) return;

    try {
      const result = await rakService.deleteRak(id);
      if (result.status === 'success' || result.success) {
        toast.success('Data rak berhasil dihapus');
        if (viewed && (viewed.kodeRak === id || viewed.id === id)) {
          setViewed(null);
        }
        await fetchRakList(currentPage);
      } else {
        toast.error(result.message || 'Gagal menghapus data rak');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
    }
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.id.trim()) {
      toast.error('Kode rak harus diisi');
      return;
    }
    if (!formValues.namaRak.trim()) {
      toast.error('Nama rak harus diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const selectedGudang = gudangList.find((g) => g.kodeGudang === formValues.kodeGudang);

      const payload = {
        kodeRak: formValues.id.trim().toUpperCase(),
        namaRak: formValues.namaRak.trim(),
        kodeGudang: formValues.kodeGudang,
        gudangId: selectedGudang?.id || null,
        namaGudang: selectedGudang?.namaGudang || formValues.namaGudang,
        kategori: formValues.kategori,
        kapasitas: Number(formValues.kapasitas) || 1000,
        baris: formValues.baris || 'A',
        kolom: formValues.kolom || '1',
        level: formValues.level || '1',
        status: formValues.status,
        keterangan: formValues.keterangan || null,
      };

      let result;
      if (modalMode === 'add') {
        result = await rakService.createRak(payload);
      } else {
        result = await rakService.updateRak(formValues.id, payload);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Rak baru berhasil ditambahkan');
      } else {
        toast.success('Data rak berhasil diperbarui');
        if (viewed && (viewed.kodeRak === formValues.id || viewed.id === formValues.id)) {
          setViewed(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchRakList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Toggle Rak Status
  const handleToggleStatus = async (rak: RakData) => {
    const newStatus: RakData['status'] = rak.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const result = await rakService.updateRak(rak.kodeRak, { status: newStatus });
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal mengubah status');
      }

      setViewed(result.data);
      toast.success(`Status rak berhasil diubah menjadi ${newStatus}`);
      await fetchRakList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = totalRecords || raks.length;
    const active = raks.filter((r) => r.status === 'Aktif').length;
    const maintenance = raks.filter((r) => r.status === 'Maintenance').length;
    const penuh = raks.filter((r) => r.status === 'Penuh').length;
    const inactive = raks.filter((r) => r.status === 'Tidak Aktif').length;
    const uniqueGudang = new Set(raks.map((r) => r.kodeGudang).filter(Boolean)).size;

    return {
      total,
      active,
      maintenance: maintenance + penuh,
      inactive,
      uniqueGudang: uniqueGudang || gudangList.length,
    };
  }, [raks, totalRecords, gudangList]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterKategori(null);
    setFilterStatus(null);
    setFilterGudang(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    const defaultGudang = gudangList.length > 0 ? gudangList[0].kodeGudang : '';

    setFormValues({
      id: '',
      namaRak: '',
      kodeGudang: defaultGudang,
      namaGudang: gudangList[0]?.namaGudang || '',
      kategori: 'benih',
      kapasitas: 1000,
      baris: 'A',
      kolom: '1',
      level: '1',
      status: 'Aktif',
      keterangan: '',
    });
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    toast.success('Mengekspor data rak... File Anda akan segera diunduh.');
  };

  const statItems = useMemo(
    () => [
      {
        title: 'Total Rak',
        value: stats.total,
        subtitle: 'Semua Rak Terdaftar',
        icon: 'ri-grid-fill',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600',
      },
      {
        title: 'Rak Aktif',
        value: stats.active,
        subtitle: 'Siap Digunakan',
        icon: 'ri-checkbox-circle-fill',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
      },
      {
        title: 'Maintenance / Penuh',
        value: stats.maintenance,
        subtitle: 'Perhatian Khusus',
        icon: 'ri-error-warning-fill',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
      },
      {
        title: 'Gudang Terhubung',
        value: stats.uniqueGudang,
        subtitle: 'Lokasi Penyimpanan',
        icon: 'ri-building-4-fill',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
      },
    ],
    [stats]
  );

  return {
    raks,
    gudangList,
    gudangOptions,
    loading,
    error,
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    filterGudang,
    setFilterGudang,
    viewed,
    setViewed,
    isDetailLoading,
    setIsDetailLoading,
    activeDetailTab,
    setActiveDetailTab,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    setTotalRecords,
    totalPages,
    setTotalPages,
    kategoriOptions,
    statusOptions,
    isTableLoading,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    setIsSubmitLoading,
    handleResetFilters,
    handleOpenAddModal,
    handleExportData,
    handleEdit,
    handleDelete,
    handleOpenEditModal,
    handleSaveModal,
    handleToggleStatus,
    modalMode,
    setModalMode,
    formValues,
    setFormValues,
    statItems,
  };
}
