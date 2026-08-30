import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import supplierService from '@/app/services/supplierService';
import { SupplierData } from '@/app/types/supplier';
import { toast } from 'react-toastify';

export function useSupplier() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
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
  const [filterWilayah, setFilterWilayah] = useState<any>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Viewed Detail State
  const [viewed, setViewed] = useState<SupplierData | null>(null);
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
      namaSupplier: '',
      kategori: 'toko_pertanian' as SupplierData['kategori'],
      alamat: '',
      status: 'Aktif' as SupplierData['status'],
    });

  // Options
  const kategoriOptions = [
    { value: 'benih', label: 'Supplier Benih' },
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];


  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await supplierService.getSuppliers();
      if (result.success || result.status === 'success') {
        setSuppliers(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch supplier data');
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

  
  // API Call: Fetch list of suppliers
  const fetchSuppliersList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await supplierService.getSupplierList({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        kategori: filterKategori?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setSuppliers(result.data || []);
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
      toast.error('Gagal mengambil data supplier');
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

        await fetchSuppliers();
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router, fetchSuppliers]);

  const handleAdd = () => {
    console.log("Add supplier clicked");
  };

  const handleEdit = (id: string) => {
    console.log("Edit supplier", id);

    const supplier = suppliers.find(s => s.kodeSupplier === id);

    console.log("Found supplier for edit:", supplier);

    if (!supplier) {
      toast.error('Supplier tidak ditemukan');
      return;
    }

    setModalMode('edit');

    setFormValues({
      id: supplier.kodeSupplier,
      namaSupplier: supplier.namaSupplier,
      kategori: supplier.kategori,
      alamat: supplier.alamat,
      status: supplier.status 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete supplier", id);
    toast.success('Data supplier berhasil dihapus');
  };

  // Open Edit Modal
  const handleOpenEditModal = (supplier: SupplierData) => {
    setModalMode('edit');

    setFormValues({
      id: supplier.kodeSupplier,
      namaSupplier: supplier.namaSupplier,
      kategori: supplier.kategori,
      alamat: supplier.alamat,
      status: supplier.status,
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaSupplier.trim()) {
      toast.error('Nama supplier harus diisi');
      return;
    }
    if (!formValues.kategori.trim()) {
      toast.error('Kategori supplier harus diisi');
      return;
    }
    
    setIsSubmitLoading(true);
    try {
      const formData = new FormData();

      console.log("=1=> Supplier form values:", formValues);

      formData.append('kodeSupplier', formValues.id);
      formData.append('namaSupplier', formValues.namaSupplier);
      formData.append('kategori', formValues.kategori);
      formData.append('status', formValues.status);

      console.log("=2=> Supplier form values:", formData);
      
      let result;
      if (modalMode === 'add') {
        result = await supplierService.createSupplier(formData);
      } else {
        result = await supplierService.updateSupplier(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Supplier baru berhasil ditambahkan');
      } else {
        toast.success('Data Supplier berhasil diperbarui');
        if (viewed && viewed.kodeSupplier === formValues.id) {
          setViewed(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchSuppliers();
      await fetchSuppliersList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  
  // Toggle Supplier Status
  const handleToggleStatus = async (supplier: SupplierData) => {
    const newStatus: SupplierData['status'] = supplier.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await supplierService.updateSupplier(supplier.kodeSupplier, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewed(result.data);
      toast.success(`Status supplier berhasil diubah menjadi ${newStatus}`);
      await fetchSuppliersList(currentPage);
      await fetchSuppliers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };


   // Dynamic Statistics
  const stats = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'Aktif').length;
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
  }, [suppliers]);

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
      namaSupplier: '',
      kategori: 'benih' as SupplierData['kategori'],
      alamat: '',
      status: 'Aktif' as SupplierData['status'],
    });
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    toast.success('Mengekspor data... File Anda akan segera diunduh.');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Supplier',
      value: stats.total,
      subtitle: 'Semua Supplier',
      icon: 'ri-team-fill',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: `Supplier Aktif`,
      icon: 'ri-user-follow-fill',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: `Supplier Tidak Aktif`,
      icon: 'ri-user-unfollow-fill',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Kategori',
      value: stats.kategori,
      subtitle: `Kategori Supplier`,
      icon: 'ri-dashboard-fill',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ], [stats]);

  return {
    suppliers,
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




export default useSupplier;
