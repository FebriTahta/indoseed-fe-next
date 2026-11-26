import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import commodityService from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { Commodity } from '@/app/types/commodity';

export function useKomoditas() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Total stats calculations
  const [allCommoditiesForStats, setAllCommoditiesForStats] = useState<Commodity[]>([]);
  const [totalVarietiesCount, setTotalVarietiesCount] = useState(0);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State (Right Toggle Panel)
  const [viewedCommodity, setViewedCommodity] = useState<Commodity | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Modal States (Tambah & Ubah)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formValues, setFormValues] = useState({
    id: '',
    kodeKomoditas: '',
    namaKomoditas: '',
    kategori: 'Buah',
    satuanHasil: 'Kg',
    deskripsi: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif' | 'Tidak Aktif',
  });

  // Options
  const kelompokTanamanOptions = useMemo(() => [
    { value: 'Buah', label: 'Buah' },
    { value: 'Sayuran', label: 'Sayuran' },
    { value: 'Palawija', label: 'Palawija' },
    { value: 'Perkebunan', label: 'Perkebunan' },
    { value: 'Tanaman Pangan', label: 'Tanaman Pangan' },
    { value: 'Tanaman Hias', label: 'Tanaman Hias' },
    { value: 'Hortikultura', label: 'Hortikultura' },
  ], []);

  const satuanHasilOptions = useMemo(() => [
    { value: 'Kg', label: 'Kg' },
    { value: 'Ton', label: 'Ton' },
    { value: 'Gram', label: 'Gram' },
    { value: 'Kuintal', label: 'Kuintal' },
    { value: 'Ikat', label: 'Ikat' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Nonaktif', label: 'Nonaktif' },
  ], []);

  // API Call: Fetch list of commodities
  const fetchCommoditiesList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await commodityService.getCommodities({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        kategori: filterKategori?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setCommodities(result.data || []);
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
      toast.error('Gagal mengambil data komoditas');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterKategori, filterStatus, router]);

  // API Call: Fetch all records (for stats calculations)
  const fetchAllCommoditiesForStats = useCallback(async () => {
    try {
      const result = await commodityService.getCommodities({ pageSize: 100000 });
      if (result.status === 'success') {
        setAllCommoditiesForStats(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // API Call: Fetch total varieties count
  const fetchTotalVarieties = useCallback(async () => {
    try {
      const res = await varietyService.getVarieties({ pageSize: 1 });
      if (res.status === 'success' && res.pagination) {
        setTotalVarietiesCount(res.pagination.totalItems);
      }
    } catch (err) {
      console.error('Error fetching total varieties:', err);
    }
  }, []);

  // Auth Guard & Setup on Load
  useEffect(() => {
    const checkAuthAndInit = async () => {
      try {
        const token = localStorage.getItem('token');
        let currentUserRole = '';
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            const firstRole = payload.roles && payload.roles.length > 0 ? payload.roles[0] : null;
            currentUserRole = payload.role || payload.activeRole?.name || (firstRole ? (typeof firstRole === 'object' ? firstRole.name : firstRole) : "");
          } catch (e) {
            console.error("Could not parse token", e);
          }
        }

        if (!token || (currentUserRole !== 'superadmin' && currentUserRole !== 'admin')) {
          setError('Akses Tidak Sah');
          router.push('/');
          return;
        }

        await Promise.all([
          fetchAllCommoditiesForStats(),
          fetchTotalVarieties(),
          fetchCommoditiesList(1),
        ]);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    checkAuthAndInit();
  }, [router, fetchAllCommoditiesForStats, fetchTotalVarieties, fetchCommoditiesList]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchCommoditiesList(currentPage);
    }
  }, [debouncedSearch, filterKategori, filterStatus, currentPage, pageSize, loading, fetchCommoditiesList]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = allCommoditiesForStats.length;
    const active = allCommoditiesForStats.filter(c => c.status === 'Aktif').length;
    const inactive = allCommoditiesForStats.filter(c => c.status !== 'Aktif').length;

    // sum of varieties from commodities as fallback or use totalVarietiesCount
    const sumVarieties = allCommoditiesForStats.reduce((acc, curr) => acc + (curr._count?.varieties || curr.varieties?.length || 0), 0);
    const totalVarieties = Math.max(totalVarietiesCount, sumVarieties);

    return {
      total,
      active,
      inactive,
      totalVarieties,
    };
  }, [allCommoditiesForStats, totalVarietiesCount]);

  const statItems = useMemo(() => [
    {
      title: 'Total Komoditas',
      value: stats.total,
      subtitle: 'Komoditas',
      icon: 'ri-plant-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: 'Komoditas',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Nonaktif',
      value: stats.inactive,
      subtitle: 'Komoditas',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
    {
      title: 'Total Varietas',
      value: stats.totalVarieties,
      subtitle: 'Varietas Terdaftar',
      icon: 'ri-seedling-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
  ], [stats]);

  // Generate Next Auto Commodity Code (e.g. KMD-011)
  const generateNextKodeKomoditas = useCallback(() => {
    let maxNum = 0;
    allCommoditiesForStats.forEach(c => {
      const match = c.kodeKomoditas?.match(/(?:KMD|KOM)-?(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    return `KMD-${String(maxNum + 1).padStart(3, '0')}`;
  }, [allCommoditiesForStats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterKategori(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal (Refer to Image 2)
  const handleOpenAddModal = () => {
    setModalMode('add');
    const nextCode = generateNextKodeKomoditas();
    setFormValues({
      id: '',
      kodeKomoditas: nextCode,
      namaKomoditas: '',
      kategori: 'Buah',
      satuanHasil: 'Kg',
      deskripsi: '',
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (commodity: Commodity) => {
    setModalMode('edit');
    setFormValues({
      id: commodity.id,
      kodeKomoditas: commodity.kodeKomoditas,
      namaKomoditas: commodity.namaKomoditas,
      kategori: commodity.kategori || 'Buah',
      satuanHasil: commodity.satuanHasil || 'Kg',
      deskripsi: commodity.deskripsi || '',
      status: (commodity.status === 'Aktif' ? 'Aktif' : 'Nonaktif') as any,
    });
    setIsModalOpen(true);
  };

  // Regenerate Auto Code
  const handleRegenerateCode = () => {
    const nextCode = generateNextKodeKomoditas();
    setFormValues(prev => ({ ...prev, kodeKomoditas: nextCode }));
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaKomoditas.trim()) {
      toast.error('Nama komoditas harus diisi');
      return;
    }
    if (!formValues.kodeKomoditas.trim()) {
      toast.error('Kode komoditas harus diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const payload = {
        kodeKomoditas: formValues.kodeKomoditas,
        namaKomoditas: formValues.namaKomoditas,
        kategori: formValues.kategori,
        satuanHasil: formValues.satuanHasil,
        deskripsi: formValues.deskripsi || '',
        status: formValues.status,
      };

      let result;
      if (modalMode === 'add') {
        result = await commodityService.createCommodity(payload);
      } else {
        result = await commodityService.updateCommodity(formValues.id, payload);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Komoditas baru berhasil ditambahkan');
      } else {
        toast.success('Data komoditas berhasil diperbarui');
        if (viewedCommodity && viewedCommodity.id === formValues.id) {
          setViewedCommodity(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllCommoditiesForStats();
      await fetchCommoditiesList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Commodity
  const handleDeleteCommodity = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data komoditas ini?')) {
      try {
        const result = await commodityService.deleteCommodity(id);
        if (result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedCommodity && viewedCommodity.id === id) {
          setViewedCommodity(null);
        }
        toast.success('Data komoditas berhasil dihapus');
        await fetchAllCommoditiesForStats();
        await fetchCommoditiesList(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Commodity Status
  const handleToggleStatus = async (commodity: Commodity) => {
    const newStatus: Commodity['status'] = commodity.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const result = await commodityService.updateCommodity(commodity.id, { status: newStatus });
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal mengubah status');
      }

      setViewedCommodity(result.data);
      toast.success(`Status komoditas berhasil diubah menjadi ${newStatus}`);
      await fetchCommoditiesList(currentPage);
      await fetchAllCommoditiesForStats();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Toggle View Detail panel on right
  const handleToggleViewDetail = async (commodity: Commodity) => {
    if (viewedCommodity && viewedCommodity.id === commodity.id) {
      setViewedCommodity(null);
      return;
    }
    setViewedCommodity(commodity);
    setIsDetailLoading(true);
    try {
      const result = await commodityService.getCommodityDetail(commodity.id);
      if (result.status === 'success') {
        setViewedCommodity(result.data);
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return {
    loading,
    error,
    commodities,
    isTableLoading,
    stats,
    statItems,
    kelompokTanamanOptions,
    satuanHasilOptions,
    statusOptions,
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
    viewedCommodity,
    setViewedCommodity,
    isDetailLoading,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    modalMode,
    formValues,
    setFormValues,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleRegenerateCode,
    handleSaveModal,
    handleDeleteCommodity,
    handleToggleStatus,
    handleToggleViewDetail,
  };
}
export default useKomoditas;
