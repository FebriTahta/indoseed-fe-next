import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import commodityService from '@/app/services/commodityService';
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
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State
  const [viewedCommodity, setViewedCommodity] = useState<Commodity | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'riwayat'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formValues, setFormValues] = useState({
    id: '',
    kodeKomoditas: '',
    namaKomoditas: '',
    kategori: 'Serealia',
    deskripsi: '',
    status: 'Aktif' as Commodity['status'],
    image: ''
  });

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Options
  const kategoriOptions = [
    { value: 'Serealia', label: 'Serealia' },
    { value: 'Legum', label: 'Legum' },
    { value: 'Umbi', label: 'Umbi' },
    { value: 'Hortikultura', label: 'Hortikultura' }
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Non Aktif' }
  ];

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

        await fetchAllCommoditiesForStats();
        await fetchCommoditiesList(1);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    checkAuthAndInit();
  }, [router, fetchAllCommoditiesForStats, fetchCommoditiesList]);

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
    const uniqueCategories = new Set(allCommoditiesForStats.map(c => c.kategori)).size;

    return {
      total,
      active,
      inactive,
      categories: uniqueCategories
    };
  }, [allCommoditiesForStats]);

  const statItems = useMemo(() => [
    {
      title: 'Total Komoditas',
      value: stats.total,
      subtitle: 'Semua komoditas',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: 'Komoditas aktif',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: 'Komoditas non aktif',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Kategori',
      value: stats.categories,
      subtitle: 'Kategori komoditas',
      icon: 'ri-grid-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ], [stats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterKategori(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setImageFile(null);
    setPreviewUrl('');
    setFormValues({
      id: '',
      kodeKomoditas: `KOM-${String(allCommoditiesForStats.length + 1).padStart(3, '0')}`,
      namaKomoditas: '',
      kategori: 'Serealia',
      deskripsi: '',
      status: 'Aktif',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (commodity: Commodity) => {
    setModalMode('edit');
    setImageFile(null);
    setPreviewUrl(commodity.image || '');
    setFormValues({
      id: commodity.id,
      kodeKomoditas: commodity.kodeKomoditas,
      namaKomoditas: commodity.namaKomoditas,
      kategori: commodity.kategori,
      deskripsi: commodity.deskripsi || '',
      status: commodity.status,
      image: commodity.image || ''
    });
    setIsModalOpen(true);
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
      const formData = new FormData();
      formData.append('kodeKomoditas', formValues.kodeKomoditas);
      formData.append('namaKomoditas', formValues.namaKomoditas);
      formData.append('kategori', formValues.kategori);
      formData.append('deskripsi', formValues.deskripsi || '');
      formData.append('status', formValues.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let result;
      if (modalMode === 'add') {
        result = await commodityService.createCommodity(formData);
      } else {
        result = await commodityService.updateCommodity(formValues.id, formData);
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
    const newStatus: Commodity['status'] = commodity.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await commodityService.updateCommodity(commodity.id, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
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

  const handleExportData = () => {
    toast.success('Mengekspor data... File Anda akan segera diunduh.');
  };

  // Viewed Detail loading handler
  const handleViewDetail = async (commodity: Commodity) => {
    setViewedCommodity(commodity);
    setActiveDetailTab('info');
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

  // File Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Ukuran gambar melebihi batas 5MB!');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setFormValues(prev => ({ ...prev, image: '' }));
  };

  return {
    loading,
    error,
    commodities,
    isTableLoading,
    stats,
    statItems,
    kategoriOptions,
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
    activeDetailTab,
    setActiveDetailTab,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    modalMode,
    formValues,
    setFormValues,
    previewUrl,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSaveModal,
    handleDeleteCommodity,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
  };
}
export default useKomoditas;
