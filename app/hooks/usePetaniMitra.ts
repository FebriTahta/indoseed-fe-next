import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import partnerService from '@/app/services/partnerService';
import greenhouseService from '@/app/services/greenhouseService';
import { Partner } from '@/app/types/partner';
import { Land } from '@/app/types/greenhouse';

export function usePetaniMitra() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Total stats calculations
  const [allPartnersForStats, setAllPartnersForStats] = useState<Partner[]>([]);

  // Greenhouses list for assignments display
  const [greenhouses, setGreenhouses] = useState<Land[]>([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterKelompok, setFilterKelompok] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State
  const [viewedPartner, setViewedPartner] = useState<Partner | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'lahan' | 'produksi' | 'catatan'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [formValues, setFormValues] = useState({
    id: '',
    kodePetani: '',
    namaPetani: '',
    kelompokTani: '',
    komoditasUtama: 'Padi',
    noKtp: '',
    noTelepon: '',
    alamat: '',
    luasLahan: '',
    pengalaman: '',
    tglBergabung: '',
    status: 'Aktif' as Partner['status'],
    image: ''
  });

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Non Aktif', label: 'Non Aktif' }
  ];

  const komoditasOptions = [
    { value: 'Padi', label: 'Padi' },
    { value: 'Jagung', label: 'Jagung' },
    { value: 'Kedelai', label: 'Kedelai' },
    { value: 'Kacang Tanah', label: 'Kacang Tanah' },
    { value: 'Cabai', label: 'Cabai' },
    { value: 'Kacang Hijau', label: 'Kacang Hijau' }
  ];

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // API Call: Fetch list of partners
  const fetchPartnersList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await partnerService.getPartners({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        kelompokTani: filterKelompok?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setPartners(result.data || []);
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
      toast.error('Gagal mengambil data petani mitra');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterKelompok, filterStatus, router]);

  // API Call: Fetch all records (for stats calculations)
  const fetchAllPartnersForStats = useCallback(async () => {
    try {
      const result = await partnerService.getPartners({ pageSize: 100000 });
      if (result.status === 'success') {
        setAllPartnersForStats(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  // API Call: Fetch greenhouses for local mapping of lahan dikelola
  const fetchGreenhouses = useCallback(async () => {
    try {
      const result = await greenhouseService.getLands({ pageSize: 1000 });
      if (result.status === 'success') {
        setGreenhouses(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching greenhouses:', err);
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

        await fetchAllPartnersForStats();
        await fetchGreenhouses();
        await fetchPartnersList(1);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    checkAuthAndInit();
  }, [router, fetchAllPartnersForStats, fetchGreenhouses, fetchPartnersList]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchPartnersList(currentPage);
    }
  }, [debouncedSearch, filterKelompok, filterKomoditas, filterStatus, currentPage, pageSize, loading, fetchPartnersList]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = allPartnersForStats.length;
    const active = allPartnersForStats.filter(p => p.status === 'Aktif').length;
    const inactive = allPartnersForStats.filter(p => p.status !== 'Aktif').length;
    const uniqueKelompok = new Set(allPartnersForStats.map(p => p.kelompokTani).filter(Boolean)).size;

    return {
      total,
      active,
      inactive,
      kelompok: uniqueKelompok
    };
  }, [allPartnersForStats]);

  // Stats Widgets Config
  const statItems = useMemo(() => [
    {
      title: 'Total Petani Mitra',
      value: stats.total,
      subtitle: 'Semua petani mitra',
      icon: 'ri-group-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: 'Petani mitra aktif',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: 'Petani mitra non aktif',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Kelompok',
      value: stats.kelompok,
      subtitle: 'Kelompok tani',
      icon: 'ri-grid-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ], [stats]);

  // Kelompok Tani Select Options (computed dynamically)
  const kelompokTaniOptions = useMemo(() => {
    const groups = Array.from(new Set(allPartnersForStats.map(p => p.kelompokTani).filter(Boolean)));
    return groups.map(g => ({ value: g, label: g }));
  }, [allPartnersForStats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterKelompok(null);
    setFilterKomoditas(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setImageFile(null);
    setPreviewUrl('');

    const nextNum = allPartnersForStats.length + 1;
    const formattedCode = `PM-${String(nextNum).padStart(3, '0')}`;
    const todayStr = new Date().toISOString().split('T')[0];

    setFormValues({
      id: '',
      kodePetani: formattedCode,
      namaPetani: '',
      kelompokTani: '',
      komoditasUtama: 'Padi',
      noKtp: '',
      noTelepon: '',
      alamat: '',
      luasLahan: '',
      pengalaman: '',
      tglBergabung: todayStr,
      status: 'Aktif',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (partner: Partner) => {
    setModalMode('edit');
    setImageFile(null);
    setPreviewUrl(partner.image || '');

    setFormValues({
      id: partner.id,
      kodePetani: partner.kodePetani,
      namaPetani: partner.namaPetani,
      kelompokTani: partner.kelompokTani || '',
      komoditasUtama: partner.komoditasUtama || 'Padi',
      noKtp: partner.noKtp || '',
      noTelepon: partner.noTelepon || '',
      alamat: partner.alamat || '',
      luasLahan: String(partner.luasLahan || 0),
      pengalaman: String(partner.pengalaman || 0),
      tglBergabung: partner.tglBergabung ? partner.tglBergabung.split('T')[0] : '',
      status: partner.status,
      image: partner.image || ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaPetani.trim()) {
      toast.error('Nama petani harus diisi');
      return;
    }
    if (!formValues.kodePetani.trim()) {
      toast.error('Kode petani harus diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('kodePetani', formValues.kodePetani);
      formData.append('namaPetani', formValues.namaPetani);
      formData.append('kelompokTani', formValues.kelompokTani);
      formData.append('komoditasUtama', formValues.komoditasUtama);
      formData.append('noKtp', formValues.noKtp || '');
      formData.append('noTelepon', formValues.noTelepon || '');
      formData.append('alamat', formValues.alamat || '');
      formData.append('luasLahan', String(formValues.luasLahan || 0));
      formData.append('pengalaman', String(formValues.pengalaman || 0));
      if (formValues.tglBergabung) {
        formData.append('tglBergabung', new Date(formValues.tglBergabung).toISOString());
      }
      formData.append('status', formValues.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let result;
      if (modalMode === 'add') {
        result = await partnerService.createPartner(formData);
      } else {
        result = await partnerService.updatePartner(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Petani Mitra baru berhasil ditambahkan');
      } else {
        toast.success('Data Petani Mitra berhasil diperbarui');
        if (viewedPartner && viewedPartner.id === formValues.id) {
          setViewedPartner(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllPartnersForStats();
      await fetchPartnersList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Partner
  const handleDeletePartner = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data petani ini?')) {
      try {
        const result = await partnerService.deletePartner(id);
        if (result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedPartner && viewedPartner.id === id) {
          setViewedPartner(null);
        }
        toast.success('Data petani berhasil dihapus');
        await fetchAllPartnersForStats();
        await fetchPartnersList(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Partner Status
  const handleToggleStatus = async (partner: Partner) => {
    const newStatus: Partner['status'] = partner.status === 'Aktif' ? 'Non Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await partnerService.updatePartner(partner.id, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewedPartner(result.data);
      toast.success(`Status petani berhasil diubah menjadi ${newStatus}`);
      await fetchPartnersList(currentPage);
      await fetchAllPartnersForStats();
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
  const handleViewDetail = async (partner: Partner) => {
    setViewedPartner(partner);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const result = await partnerService.getPartnerDetail(partner.id);
      if (result.status === 'success') {
        setViewedPartner(result.data);
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
    partners,
    isTableLoading,
    greenhouses,
    stats,
    statItems,
    kelompokTaniOptions,
    statusOptions,
    komoditasOptions,
    search,
    setSearch,
    filterKelompok,
    setFilterKelompok,
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
    viewedPartner,
    setViewedPartner,
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
    handleDeletePartner,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
    setImageFile,
  };
}
export default usePetaniMitra;
