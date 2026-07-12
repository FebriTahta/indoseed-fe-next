import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import gudangService from '@/app/services/gudangService';
import { GudData } from '@/app/types/gudang';
import { toast } from 'react-toastify';

export function useGudang() {
  const router = useRouter();
  const [gudangs, setGudangs] = useState<GudData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterWilayah, setFilterWilayah] = useState<any>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Viewed Detail State
  const [viewed, setViewed] = useState<GudData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'kontak' | 'riwayat' | 'note'>('info');

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
      id: '',
      namaGudang: '',
      kategori: 'toko_pertanian' as GudData['kategori'],
      alamat: '',
      status: 'Aktif' as GudData['status'],
    });

  // Options
  const kategoriOptions = [
    { value: 'benih', label: 'Gudang Benih' },
    { value: 'packing', label: 'Gudang Packing' },
    { value: 'treatment', label: 'Gudang Bahan Treatment' },
    { value: 'umum', label: 'Gudang Umum' },
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];


  const fetchGudangs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await gudangService.getGudangs();
      if (result.success || result.status === 'success') {
        setGudangs(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch gudang data');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Unauthorized access');
        router.push('/');
        return;
      }
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  
  // API Call: Fetch list of lands
  const fetchGudangsList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await gudangService.getGudangList({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        kategori: filterKategori?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setGudangs(result.data || []);
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
      toast.error('Gagal mengambil data gudang');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterKategori, filterStatus, filterWilayah, router]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
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
          setError('Unauthorized access');
          router.push('/');
          return;
        }

        await fetchGudangs();
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router, fetchGudangs]);

  const handleAdd = () => {
    console.log("Add gudang clicked");
  };

  const handleEdit = (id: string) => {
    console.log("Edit gudang", id);

    const gudang = gudangs.find(g => g.kodeGudang === id);

    console.log("Found gudang for edit:", gudang);

    if (!gudang) {
      toast.error('Gudang tidak ditemukan');
      return;
    }

    setModalMode('edit');

    setFormValues({
      id: gudang.kodeGudang,
      namaGudang: gudang.namaGudang,
      kategori: gudang.kategori,
      alamat: gudang.alamat,
      status: gudang.status 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete customer", id);
  };

  // Open Edit Modal
  const handleOpenEditModal = (gudang: GudData) => {
    setModalMode('edit');

    setFormValues({
      id: gudang.kodeGudang,
      namaGudang: gudang.namaGudang,
      kategori: gudang.kategori,
      alamat: gudang.alamat,
      status: gudang.status,
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaGudang.trim()) {
      toast.error('Nama gudang harus diisi');
      return;
    }
    if (!formValues.kategori.trim()) {
      toast.error('Kategori gudang harus diisi');
      return;
    }
    
    setIsSubmitLoading(true);
    try {
      const formData = new FormData();

      console.log("=1=> Gudang form values:", formValues);

      formData.append('kodeGudang', formValues.id);
      formData.append('namaGudang', formValues.namaGudang);
      formData.append('kategori', formValues.kategori);
      formData.append('status', formValues.status);

      console.log("=2=> Gudang form values:", formData);
      
      let result;
      if (modalMode === 'add') {
        result = await gudangService.createGudang(formData);
      } else {
        result = await gudangService.updateGudang(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Gudang baru berhasil ditambahkan');
      } else {
        toast.success('Data Gudang berhasil diperbarui');
        if (viewed && viewed.kodeGudang === formValues.id) {
          setViewed(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchGudangs();
      await fetchGudangsList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  
  // Toggle Gudang Status
  const handleToggleStatus = async (gudang: GudData) => {
    const newStatus: GudData['status'] = gudang.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await gudangService.updateGudang(gudang.kodeGudang, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewed(result.data);
      toast.success(`Status gudang berhasil diubah menjadi ${newStatus}`);
      await fetchGudangsList(currentPage);
      await fetchGudangs();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };


   // Dynamic Statistics
  const stats = useMemo(() => {
    const total = gudangs.length;
    const active = gudangs.filter(g => g.status === 'Aktif').length;
    const inactive = total - active;
    const activePercent = total > 0 ? ((active / total) * 100).toFixed(2) : '0';
    const inactivePercent = total > 0 ? ((inactive / total) * 100).toFixed(2) : '0';
    const kategori = 4;

    return {
      total,
      active,
      inactive,
      activePercent,
      inactivePercent,
      kategori
    };
  }, [gudangs]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterKategori(null);
    setFilterStatus(null);
    setFilterWilayah(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    

    setFormValues({
      id: '',
      namaGudang: '',
      kategori: 'benih' as GudData['kategori'],
      alamat: '',
      status: 'Aktif' as GudData['status'],
    });
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    toast.success('Mengekspor data... File Anda akan segera diunduh.');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Gudang',
      value: stats.total,
      subtitle: 'Semua Gudang',
      icon: 'ri-team-fill',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: `Gudang Aktif`,
      icon: 'ri-user-follow-fill',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: `Gudang Tidak Aktif`,
      icon: 'ri-user-unfollow-fill',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Kategori',
      value: stats.kategori,
      subtitle: `Kategori Gudang`,
      icon: 'ri-dashboard-fill',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ], [stats]);

  return {
    gudangs,
    loading,
    error,
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    filterWilayah,
    setFilterWilayah,
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
    handleAdd,
    handleEdit,
    handleDelete,
    handleOpenEditModal,
    handleSaveModal,
    handleToggleStatus,
    modalMode,
    setModalMode,
    formValues,
    setFormValues,
    statItems
  };
}




export default useGudang;
