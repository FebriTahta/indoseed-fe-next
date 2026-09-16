import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import harvestTypeService from '@/app/services/harvestTypeService';
import varietyService from '@/app/services/varietyService';
import { HarvestType } from '@/app/types/harvestType';
import { Variety } from '@/app/types/variety';

export function useHarvestType() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [harvestTypes, setHarvestTypes] = useState<HarvestType[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [varieties, setVarieties] = useState<Variety[]>([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterVariety, setFilterVariety] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State
  const [viewedHarvestType, setViewedHarvestType] = useState<HarvestType | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'harga'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [formValues, setFormValues] = useState({
    id: '',
    kode: '',
    nama: '',
    varietyId: '',
    status: 'Aktif' as HarvestType['status'],
    initialPrice: ''
  });

  // Add Price Modal States
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [priceFormValues, setPriceFormValues] = useState({
    harga: '',
    keterangan: ''
  });

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Non Aktif', label: 'Non Aktif' }
  ];

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch list of harvest types
  const fetchHarvestTypes = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await harvestTypeService.getHarvestTypes({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        varietyId: filterVariety?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setHarvestTypes(result.data || []);
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
      toast.error('Gagal mengambil data tipe panen');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterVariety, filterStatus, router]);

  // Fetch varieties for select mapping
  const fetchVarieties = useCallback(async () => {
    try {
      const result = await varietyService.getVarieties({ pageSize: 1000 });
      if (result.status === 'success') {
        setVarieties(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching varieties:', err);
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

        await fetchVarieties();
        await fetchHarvestTypes(1);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data');
        setLoading(false);
      }
    };
    checkAuthAndInit();
  }, [router, fetchVarieties, fetchHarvestTypes]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchHarvestTypes(currentPage);
    }
  }, [debouncedSearch, filterVariety, filterStatus, currentPage, pageSize, loading, fetchHarvestTypes]);

  // Variety Select Options (computed dynamically)
  const varietyOptions = useMemo(() => {
    return varieties.map(v => ({ value: v.id, label: v.namaVarietas }));
  }, [varieties]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterVariety(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormValues({
      id: '',
      kode: '',
      nama: '',
      varietyId: '',
      status: 'Aktif',
      initialPrice: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (harvestType: HarvestType) => {
    setModalMode('edit');
    setFormValues({
      id: harvestType.id,
      kode: harvestType.kode,
      nama: harvestType.nama,
      varietyId: harvestType.varietyId,
      status: harvestType.status,
      initialPrice: ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.nama.trim() || !formValues.kode.trim() || !formValues.varietyId) {
      toast.error('Data yang wajib harus diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const data = {
        kode: formValues.kode,
        nama: formValues.nama,
        varietyId: formValues.varietyId,
        status: formValues.status,
        ...(modalMode === 'add' && formValues.initialPrice ? { initialPrice: Number(formValues.initialPrice) } : {})
      };

      let result;
      if (modalMode === 'add') {
        result = await harvestTypeService.createHarvestType(data);
      } else {
        result = await harvestTypeService.updateHarvestType(formValues.id, data);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Tipe panen baru berhasil ditambahkan');
      } else {
        toast.success('Data tipe panen berhasil diperbarui');
        if (viewedHarvestType && viewedHarvestType.id === formValues.id) {
          handleViewDetail(result.data as any);
        }
      }

      setIsModalOpen(false);
      await fetchHarvestTypes(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Harvest Type
  const handleDeleteHarvestType = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data tipe panen ini?')) {
      try {
        const result = await harvestTypeService.deleteHarvestType(id);
        if (result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedHarvestType && viewedHarvestType.id === id) {
          setViewedHarvestType(null);
        }
        toast.success('Data tipe panen berhasil dihapus');
        await fetchHarvestTypes(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Status
  const handleToggleStatus = async (harvestType: HarvestType) => {
    const newStatus: HarvestType['status'] = harvestType.status === 'Aktif' ? 'Non Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const result = await harvestTypeService.updateHarvestType(harvestType.id, {
        kode: harvestType.kode,
        nama: harvestType.nama,
        varietyId: harvestType.varietyId,
        status: newStatus
      });
      
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewedHarvestType(result.data);
      toast.success(`Status berhasil diubah menjadi ${newStatus}`);
      await fetchHarvestTypes(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Viewed Detail loading handler
  const handleViewDetail = async (harvestType: HarvestType) => {
    setViewedHarvestType(harvestType);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const result = await harvestTypeService.getHarvestTypeDetail(harvestType.id);
      if (result.status === 'success') {
        setViewedHarvestType(result.data);
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Add Price Flow
  const handleOpenAddPrice = () => {
    setPriceFormValues({ harga: '', keterangan: '' });
    setIsAddPriceModalOpen(true);
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewedHarvestType) return;
    if (!priceFormValues.harga) {
      toast.error('Harga wajib diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const result = await harvestTypeService.addHarvestTypePrice(viewedHarvestType.id, {
        harga: Number(priceFormValues.harga),
        keterangan: priceFormValues.keterangan
      });

      if (result.status === 'success') {
        toast.success('Harga baru berhasil ditambahkan ke riwayat');
        setIsAddPriceModalOpen(false);
        // Refresh detail
        handleViewDetail(viewedHarvestType);
        fetchHarvestTypes(currentPage); // update list if price is shown in table
      } else {
        throw new Error(result.message || 'Gagal menyimpan harga');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan harga');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return {
    loading,
    error,
    harvestTypes,
    isTableLoading,
    varieties,
    statusOptions,
    varietyOptions,
    search,
    setSearch,
    filterVariety,
    setFilterVariety,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedHarvestType,
    setViewedHarvestType,
    isDetailLoading,
    activeDetailTab,
    setActiveDetailTab,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    modalMode,
    formValues,
    setFormValues,
    isAddPriceModalOpen,
    setIsAddPriceModalOpen,
    priceFormValues,
    setPriceFormValues,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSaveModal,
    handleDeleteHarvestType,
    handleToggleStatus,
    handleViewDetail,
    handleOpenAddPrice,
    handleSavePrice
  };
}
export default useHarvestType;
