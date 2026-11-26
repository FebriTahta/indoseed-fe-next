import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import greenhouseService from '@/app/services/greenhouseService';
import commodityService from '@/app/services/commodityService';
import partnerService from '@/app/services/partnerService';
import { Land } from '@/app/types/greenhouse';

export const KOMODITAS_DEFAULTS: Record<string, { color: string; icon: string }> = {
  'Tomat': { color: 'emerald', icon: 'ri-leaf-line' },
  'Cabai': { color: 'red', icon: 'ri-leaf-line' },
  'Padi': { color: 'blue', icon: 'ri-seedling-line' },
  'Jagung': { color: 'amber', icon: 'ri-sun-line' },
  'Kedelai': { color: 'green', icon: 'ri-leaf-line' },
  'Melon': { color: 'lime', icon: 'ri-focus-2-line' },
  'Bawang Merah': { color: 'purple', icon: 'ri-seedling-line' },
  'Kentang': { color: 'yellow', icon: 'ri-seedling-line' }
};

export function useGreenhouse() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [lands, setLands] = useState<Land[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Total stats calculations
  const [allLandsForStats, setAllLandsForStats] = useState<Land[]>([]);

  // Dynamic relation lists
  const [commoditiesOptions, setCommoditiesOptions] = useState<{ value: string; label: string }[]>([]);
  const [partnersOptions, setPartnersOptions] = useState<{ value: string; label: string }[]>([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State
  const [viewedLand, setViewedLand] = useState<Land | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'kondisi' | 'riwayat' | 'dokumen'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formValues, setFormValues] = useState({
    id: '',
    kodeLahan: '',
    namaLahan: '',
    jenisLahan: 'Greenhouse' as Land['jenisLahan'],
    komoditasUtama: 'Tomat',
    komoditasColor: 'emerald',
    komoditasIcon: 'ri-leaf-line',
    lokasi: 'Bogor',
    luas: 0.5,
    status: 'Aktif' as Land['status'],
    detailLokasi: '',
    koordinat: '',
    latitude: '',
    longitude: '',
    petaniMitra: '',
    keterangan: '',
    image: '',
    commodityId: '',
    partnerId: ''
  });

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Options
  const jenisLahanOptions = [
    { value: 'Greenhouse', label: 'Greenhouse' },
    { value: 'Lahan Terbuka', label: 'Lahan Terbuka' }
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];

  const komoditasOptions = [
    { value: 'Tomat', label: 'Tomat' },
    { value: 'Cabai', label: 'Cabai' },
    { value: 'Padi', label: 'Padi' },
    { value: 'Jagung', label: 'Jagung' },
    { value: 'Kedelai', label: 'Kedelai' },
    { value: 'Melon', label: 'Melon' },
    { value: 'Bawang Merah', label: 'Bawang Merah' },
    { value: 'Kentang', label: 'Kentang' }
  ];

  const lokasiOptions = [
    { value: 'Bogor', label: 'Bogor' },
    { value: 'Subang', label: 'Subang' },
    { value: 'Lamongan', label: 'Lamongan' },
    { value: 'Jember', label: 'Jember' },
    { value: 'Garut', label: 'Garut' },
    { value: 'Wonosobo', label: 'Wonosobo' },
    { value: 'Brebes', label: 'Brebes' }
  ];

  // API Call: Fetch list of lands
  const fetchLandsList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await greenhouseService.getLands({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        jenisLahan: filterJenis?.value || undefined,
        status: filterStatus?.value || undefined,
        commodityId: filterKomoditas?.value || undefined,
        lokasi: filterLokasi?.value || undefined,
      });

      if (result.status === 'success') {
        setLands(result.data || []);
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
      toast.error('Gagal mengambil data greenhouse / lahan');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterJenis, filterStatus, filterKomoditas, filterLokasi, router]);

  // API Call: Fetch all records (for stats calculations)
  const fetchAllLandsForStats = useCallback(async () => {
    try {
      const result = await greenhouseService.getLands({ pageSize: 100000 });
      if (result.status === 'success') {
        setAllLandsForStats(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  const fetchCommoditiesOptions = useCallback(async () => {
    try {
      const result = await commodityService.getCommodities({ pageSize: 1000, status: 'Aktif' });
      if (result.status === 'success') {
        const options = (result.data || []).map((c: any) => ({
          value: c.id,
          label: c.namaKomoditas
        }));
        setCommoditiesOptions(options);
      }
    } catch (err) {
      console.error('Error fetching commodities:', err);
    }
  }, []);

  const fetchPartnersOptions = useCallback(async () => {
    try {
      const result = await partnerService.getPartners({ pageSize: 1000, status: 'Aktif' });
      if (result.status === 'success') {
        const options = (result.data || []).map((p: any) => ({
          value: p.id,
          label: p.namaPetani
        }));
        setPartnersOptions(options);
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
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
          fetchAllLandsForStats(),
          fetchCommoditiesOptions(),
          fetchPartnersOptions(),
          fetchLandsList(1)
        ]);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    checkAuthAndInit();
  }, [router, fetchAllLandsForStats, fetchCommoditiesOptions, fetchPartnersOptions, fetchLandsList]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchLandsList(currentPage);
    }
  }, [debouncedSearch, filterJenis, filterStatus, filterKomoditas, filterLokasi, currentPage, pageSize, loading, fetchLandsList]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = allLandsForStats.length;
    const gh = allLandsForStats.filter(l => l.jenisLahan === 'Greenhouse');
    const lt = allLandsForStats.filter(l => l.jenisLahan === 'Lahan Terbuka');
    const active = allLandsForStats.filter(l => l.status === 'Aktif').length;
    const inactive = allLandsForStats.filter(l => l.status !== 'Aktif').length;

    const ghArea = gh.reduce((sum, item) => sum + Number(item.luas || 0), 0);
    const ltArea = lt.reduce((sum, item) => sum + Number(item.luas || 0), 0);

    const activePercent = total > 0 ? ((active / total) * 100).toFixed(1) : '0';
    const inactivePercent = total > 0 ? ((inactive / total) * 100).toFixed(1) : '0';

    return {
      total,
      ghCount: gh.length,
      ghArea: ghArea.toFixed(2),
      ltCount: lt.length,
      ltArea: ltArea.toFixed(2),
      active,
      activePercent,
      inactive,
      inactivePercent
    };
  }, [allLandsForStats]);

  const statItems = useMemo(() => [
    {
      title: 'Total Lahan',
      value: stats.total,
      subtitle: 'Semua Lahan',
      icon: 'ri-landscape-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Greenhouse',
      value: stats.ghCount,
      subtitle: `Luas total ${stats.ghArea} Ha`,
      icon: 'ri-home-3-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Lahan Terbuka',
      value: stats.ltCount,
      subtitle: `Luas total ${stats.ltArea} Ha`,
      icon: 'ri-sun-line',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Lahan Aktif',
      value: stats.active,
      subtitle: `${stats.activePercent}% dari total lahan`,
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Tidak Aktif',
      value: stats.inactive,
      subtitle: `${stats.inactivePercent}% dari total lahan`,
      icon: 'ri-close-circle-line',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ], [stats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterJenis(null);
    setFilterStatus(null);
    setFilterKomoditas(null);
    setFilterLokasi(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setImageFile(null);
    setPreviewUrl('');
    const defaultCommodityId = commoditiesOptions.length > 0 ? commoditiesOptions[0].value : '';
    const defaultCommodityName = commoditiesOptions.length > 0 ? commoditiesOptions[0].label : 'Tomat';
    const def = KOMODITAS_DEFAULTS[defaultCommodityName] || { color: 'emerald', icon: 'ri-leaf-line' };

    setFormValues({
      id: '',
      kodeLahan: `GH-${String(allLandsForStats.length + 1).padStart(3, '0')}`,
      namaLahan: '',
      jenisLahan: 'Greenhouse',
      komoditasUtama: defaultCommodityName,
      komoditasColor: def.color,
      komoditasIcon: def.icon,
      lokasi: 'Bogor',
      luas: 0.5,
      status: 'Aktif',
      detailLokasi: '',
      koordinat: '',
      latitude: '',
      longitude: '',
      petaniMitra: '',
      keterangan: '',
      image: '',
      commodityId: defaultCommodityId,
      partnerId: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (land: Land) => {
    setModalMode('edit');
    setImageFile(null);
    setPreviewUrl(land.image || '');

    let lat = '';
    let lng = '';
    if (land.koordinat) {
      const parts = land.koordinat.split(',');
      if (parts.length === 2) {
        lat = parts[0].trim();
        lng = parts[1].trim();
      } else {
        lat = land.koordinat.trim();
      }
    }

    setFormValues({
      id: land.id,
      kodeLahan: land.kodeLahan,
      namaLahan: land.namaLahan,
      jenisLahan: land.jenisLahan,
      komoditasUtama: land.komoditasUtama,
      komoditasColor: land.komoditasColor || 'emerald',
      komoditasIcon: land.komoditasIcon || 'ri-leaf-line',
      lokasi: land.lokasi,
      luas: land.luas,
      status: land.status,
      detailLokasi: land.detailLokasi || '',
      koordinat: land.koordinat || '',
      latitude: lat,
      longitude: lng,
      petaniMitra: land.petaniMitra || '',
      keterangan: land.keterangan || '',
      image: land.image || '',
      commodityId: land.commodityId || '',
      partnerId: land.partnerId || ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaLahan.trim()) {
      toast.error('Nama lahan harus diisi');
      return;
    }
    if (!formValues.kodeLahan.trim()) {
      toast.error('Kode lahan harus diisi');
      return;
    }
    if (!formValues.commodityId) {
      toast.error('Komoditas harus dipilih');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('kodeLahan', formValues.kodeLahan);
      formData.append('namaLahan', formValues.namaLahan);
      formData.append('jenisLahan', formValues.jenisLahan);
      formData.append('commodityId', formValues.commodityId);
      if (formValues.partnerId) {
        formData.append('partnerId', formValues.partnerId);
      }
      formData.append('komoditasColor', formValues.komoditasColor);
      formData.append('komoditasIcon', formValues.komoditasIcon);
      formData.append('lokasi', formValues.lokasi);
      formData.append('luas', String(formValues.luas));
      formData.append('status', formValues.status);
      formData.append('detailLokasi', formValues.detailLokasi || '');

      let combinedKoordinat = '';
      if (formValues.latitude.trim() && formValues.longitude.trim()) {
        combinedKoordinat = `${formValues.latitude.trim()}, ${formValues.longitude.trim()}`;
      } else if (formValues.latitude.trim()) {
        combinedKoordinat = formValues.latitude.trim();
      } else if (formValues.longitude.trim()) {
        combinedKoordinat = formValues.longitude.trim();
      }
      formData.append('koordinat', combinedKoordinat);
      formData.append('keterangan', formValues.keterangan || '');

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let result;
      if (modalMode === 'add') {
        result = await greenhouseService.createLand(formData);
      } else {
        result = await greenhouseService.updateLand(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Greenhouse / Lahan baru berhasil ditambahkan');
      } else {
        toast.success('Data Greenhouse / Lahan berhasil diperbarui');
        if (viewedLand && viewedLand.id === formValues.id) {
          setViewedLand(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllLandsForStats();
      await fetchLandsList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Land
  const handleDeleteLand = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data lahan ini?')) {
      try {
        const result = await greenhouseService.deleteLand(id);
        if (result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedLand && viewedLand.id === id) {
          setViewedLand(null);
        }
        toast.success('Data lahan berhasil dihapus');
        await fetchAllLandsForStats();
        await fetchLandsList(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Land Status
  const handleToggleStatus = async (land: Land) => {
    const newStatus: Land['status'] = land.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await greenhouseService.updateLand(land.id, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewedLand(result.data);
      toast.success(`Status lahan berhasil diubah menjadi ${newStatus}`);
      await fetchLandsList(currentPage);
      await fetchAllLandsForStats();
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
  const handleViewDetail = async (land: Land) => {
    setViewedLand(land);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const result = await greenhouseService.getLandDetail(land.id);
      if (result.status === 'success') {
        setViewedLand(result.data);
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
    lands,
    isTableLoading,
    stats,
    statItems,
    commoditiesOptions,
    partnersOptions,
    jenisLahanOptions,
    statusOptions,
    komoditasOptions,
    lokasiOptions,
    search,
    setSearch,
    filterJenis,
    setFilterJenis,
    filterStatus,
    setFilterStatus,
    filterKomoditas,
    setFilterKomoditas,
    filterLokasi,
    setFilterLokasi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedLand,
    setViewedLand,
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
    handleDeleteLand,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
    setImageFile,
  };
}
export default useGreenhouse;
