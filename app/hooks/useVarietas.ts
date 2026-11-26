import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import varietyService from '@/app/services/varietyService';
import commodityService from '@/app/services/commodityService';
import { Variety } from '@/app/types/variety';

export function useVarietas() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Total stats calculations
  const [allVarietiesForStats, setAllVarietiesForStats] = useState<Variety[]>([]);

  // Commodities dropdown options
  const [commoditiesOptions, setCommoditiesOptions] = useState<{ value: string, label: string }[]>([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCommodity, setFilterCommodity] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKelompok, setFilterKelompok] = useState<string>('');

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
  const [viewedVariety, setViewedVariety] = useState<Variety | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'karakteristik' | 'ketahanan' | 'riwayat'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [formValues, setFormValues] = useState({
    id: '',
    kodeVarietas: '',
    namaVarietas: '',
    commodityId: '',
    asalPemulia: '',
    tahunRilis: '',
    deskripsi: '',
    umurTanam: '',
    tinggiTanaman: '',
    bentukBiji: '',
    warnaGabah: '',
    potensiHasil: '',
    anjuranDataran: '',
    status: 'Aktif' as Variety['status'],
    image: ''
  });

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Non Aktif' }
  ];

  // API Call: Fetch list of active commodities for selects
  const fetchCommoditiesOptions = useCallback(async () => {
    try {
      const result = await commodityService.getCommodities({ pageSize: 1000, status: 'Aktif' });
      if (result.status === 'success') {
        const options = (result.data || []).map((c: any) => ({
          value: c.id,
          label: c.namaKomoditas
        }));
        setCommoditiesOptions(options);

        // Pre-select first commodity option in form if empty
        if (options.length > 0 && !formValues.commodityId) {
          setFormValues(prev => ({ ...prev, commodityId: options[0].value }));
        }
      }
    } catch (err) {
      console.error('Error fetching commodities options:', err);
    }
  }, [formValues.commodityId]);

  // API Call: Fetch list of varieties
  const fetchVarietiesList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await varietyService.getVarieties({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        commodityId: filterCommodity?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setVarieties(result.data || []);
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
      toast.error('Gagal mengambil data varietas');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterCommodity, filterStatus, router]);

  // API Call: Fetch all records (for stats calculations)
  const fetchAllVarietiesForStats = useCallback(async () => {
    try {
      const result = await varietyService.getVarieties({ pageSize: 100000 });
      if (result.status === 'success') {
        setAllVarietiesForStats(result.data || []);
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

        await fetchCommoditiesOptions();
        await fetchAllVarietiesForStats();
        await fetchVarietiesList(1);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    checkAuthAndInit();
  }, [router, fetchCommoditiesOptions, fetchAllVarietiesForStats, fetchVarietiesList]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchVarietiesList(currentPage);
    }
  }, [debouncedSearch, filterCommodity, filterStatus, currentPage, pageSize, loading, fetchVarietiesList]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = allVarietiesForStats.length;
    const active = allVarietiesForStats.filter(v => v.status === 'Aktif').length;
    const inactive = allVarietiesForStats.filter(v => v.status !== 'Aktif').length;
    const uniqueCommodities = new Set(allVarietiesForStats.map(v => v.commodityId)).size;
    
    // Calculate total brands (each variety has at least 1 brand, or count from JSON metadata)
    let brandsCount = 0;
    allVarietiesForStats.forEach(v => {
      if (v.deskripsi && v.deskripsi.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(v.deskripsi);
          if (parsed.brands && Array.isArray(parsed.brands)) {
            brandsCount += parsed.brands.length;
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      brandsCount += 1;
    });

    return {
      total,
      active,
      inactive,
      commodities: uniqueCommodities,
      totalBrands: brandsCount || total,
    };
  }, [allVarietiesForStats]);

  const statItems = useMemo(() => [
    {
      title: 'Total Varietas',
      value: stats.total,
      subtitle: 'Semua varietas',
      icon: 'ri-seedling-fill',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: 'Varietas aktif',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: 'Varietas non aktif',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Komoditas',
      value: stats.commodities,
      subtitle: 'Jenis komoditas',
      icon: 'ri-grid-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ], [stats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterCommodity(null);
    setFilterStatus(null);
    setFilterKelompok('');
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setImageFile(null);
    setPreviewUrl('');
    const defaultCommodityId = commoditiesOptions.length > 0 ? commoditiesOptions[0].value : '';

    setFormValues({
      id: '',
      kodeVarietas: `VAR-${String(allVarietiesForStats.length + 1).padStart(3, '0')}`,
      namaVarietas: '',
      commodityId: defaultCommodityId,
      asalPemulia: '',
      tahunRilis: '',
      deskripsi: '',
      umurTanam: '',
      tinggiTanaman: '',
      bentukBiji: '',
      warnaGabah: '',
      potensiHasil: '',
      anjuranDataran: '',
      status: 'Aktif',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (variety: Variety) => {
    setModalMode('edit');
    setImageFile(null);
    setPreviewUrl(variety.image || '');

    setFormValues({
      id: variety.id,
      kodeVarietas: variety.kodeVarietas,
      namaVarietas: variety.namaVarietas,
      commodityId: variety.commodityId,
      asalPemulia: variety.asalPemulia || '',
      tahunRilis: variety.tahunRilis ? String(variety.tahunRilis) : '',
      deskripsi: variety.deskripsi || '',
      umurTanam: variety.umurTanam || '',
      tinggiTanaman: variety.tinggiTanaman || '',
      bentukBiji: variety.bentukBiji || '',
      warnaGabah: variety.warnaGabah || '',
      potensiHasil: variety.potensiHasil || '',
      anjuranDataran: variety.anjuranDataran || '',
      status: variety.status,
      image: variety.image || ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaVarietas.trim()) {
      toast.error('Nama varietas harus diisi');
      return;
    }
    if (!formValues.kodeVarietas.trim()) {
      toast.error('Kode varietas harus diisi');
      return;
    }
    if (!formValues.commodityId) {
      toast.error('Komoditas harus dipilih');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('kodeVarietas', formValues.kodeVarietas);
      formData.append('namaVarietas', formValues.namaVarietas);
      formData.append('commodityId', formValues.commodityId);
      formData.append('asalPemulia', formValues.asalPemulia || '');
      if (formValues.tahunRilis) {
        formData.append('tahunRilis', formValues.tahunRilis);
      }
      formData.append('deskripsi', formValues.deskripsi || '');
      formData.append('umurTanam', formValues.umurTanam || '');
      formData.append('tinggiTanaman', formValues.tinggiTanaman || '');
      formData.append('bentukBiji', formValues.bentukBiji || '');
      formData.append('warnaGabah', formValues.warnaGabah || '');
      formData.append('potensiHasil', formValues.potensiHasil || '');
      formData.append('anjuranDataran', formValues.anjuranDataran || '');
      formData.append('status', formValues.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let result;
      if (modalMode === 'add') {
        result = await varietyService.createVariety(formData);
      } else {
        result = await varietyService.updateVariety(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Varietas baru berhasil ditambahkan');
      } else {
        toast.success('Data varietas berhasil diperbarui');
        if (viewedVariety && viewedVariety.id === formValues.id) {
          setViewedVariety(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllVarietiesForStats();
      await fetchVarietiesList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Variety
  const handleDeleteVariety = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data varietas ini?')) {
      try {
        const result = await varietyService.deleteVariety(id);
        if (result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedVariety && viewedVariety.id === id) {
          setViewedVariety(null);
        }
        toast.success('Data varietas berhasil dihapus');
        await fetchAllVarietiesForStats();
        await fetchVarietiesList(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Variety Status
  const handleToggleStatus = async (variety: Variety) => {
    const newStatus: Variety['status'] = variety.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await varietyService.updateVariety(variety.id, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewedVariety(result.data);
      toast.success(`Status varietas berhasil diubah menjadi ${newStatus}`);
      await fetchVarietiesList(currentPage);
      await fetchAllVarietiesForStats();
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
  const handleViewDetail = async (variety: Variety) => {
    setViewedVariety(variety);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const result = await varietyService.getVarietyDetail(variety.id);
      if (result.status === 'success') {
        setViewedVariety(result.data);
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
    varieties,
    isTableLoading,
    stats,
    statItems,
    commoditiesOptions,
    statusOptions,
    search,
    setSearch,
    filterCommodity,
    setFilterCommodity,
    filterStatus,
    setFilterStatus,
    filterKelompok,
    setFilterKelompok,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedVariety,
    setViewedVariety,
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
    handleDeleteVariety,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
    setImageFile,
  };
}
export default useVarietas;
