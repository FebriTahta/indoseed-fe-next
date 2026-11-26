import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import custService from '@/app/services/customerService';
import { CustData } from '@/app/types/customer';
import { toast } from 'react-toastify';

export function useCustomer() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustData[]>([]);
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
  const [viewed, setViewed] = useState<CustData | null>(null);
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
      namaCust: '',
      kategori: 'toko_pertanian' as CustData['kategori'],
      status: 'Aktif' as CustData['status'],
      NPWP: '',
      pic: '',
      kota: '',
      alamat: '',
      kodePos: '',
      noTelepon: '',
      email: '',
      isTop: false,
      isActive: true,
      limitKredit: 0,
      remainKredit: 0
    });

  // Options
  const kategoriOptions = [
    { value: 'petani', label: 'Toko Pertanian' },
    { value: 'koperasi', label: 'Koperasi' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'perusahaan', label: 'Perusahaan' },
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
    { value: 'Maintenance', label: 'Maintenance' }
  ];

  const wilayahOptions = [
    { value: 'NA', label: 'Pilih Wilayah' },
  ];


  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await custService.getCustomers();
      if (result.success || result.status === 'success') {
        setCustomers(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch customer data');
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
  const fetchCustomersList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await custService.getCustomerList({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        jenisLahan: filterKategori?.value || undefined,
        status: filterStatus?.value || undefined,
        commodityId: filterWilayah?.value || undefined
      });

      if (result.status === 'success') {
        setCustomers(result.data || []);
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

        await fetchCustomers();
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router, fetchCustomers]);

  const handleAdd = () => {
    console.log("Add customer clicked");
  };

  const handleEdit = (id: string) => {
    console.log("Edit customer", id);

    const cust = customers.find(c => c.kodeCust === id);

    console.log("Found customer for edit:", cust);

    if (!cust) {
      toast.error('Customer tidak ditemukan');
      return;
    }

    setModalMode('edit');

    setFormValues({
      id: cust.kodeCust,
      namaCust: cust.namaCust,
      kategori: cust.kategori,
      status: cust.status,
      NPWP: cust.NPWP,
      pic: cust.pic,
      kota: cust.kota,
      alamat: cust.alamat,
      kodePos: cust.kodePos,
      noTelepon: cust.noTelepon,
      email: cust.email,
      isTop: cust.isTop,
      isActive: cust.isActive,
      limitKredit: cust.limitKredit,
      remainKredit: cust.remainKredit 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete customer", id);
    toast.success('Data customer berhasil dihapus');
  };

  // Open Edit Modal
  const handleOpenEditModal = (cust: CustData) => {
    setModalMode('edit');

    setFormValues({
      id: cust.kodeCust,
      namaCust: cust.namaCust,
      kategori: cust.kategori,
      status: cust.status,
      NPWP: cust.NPWP,
      pic: cust.pic,
      kota: cust.kota,
      alamat: cust.alamat,
      kodePos: cust.kodePos,
      noTelepon: cust.noTelepon,
      email: cust.email,
      isTop: cust.isTop,
      isActive: cust.isActive,
      limitKredit: cust.limitKredit,
      remainKredit: cust.remainKredit 
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaCust.trim()) {
      toast.error('Nama customer harus diisi');
      return;
    }
    if (!formValues.kategori.trim()) {
      toast.error('Kategori customer harus diisi');
      return;
    }
    
    setIsSubmitLoading(true);
    try {
      const formData = new FormData();

      console.log("=1=> Customer form values:", formValues);

      formData.append('kodeCust', formValues.id);
      formData.append('namaCust', formValues.namaCust);
      formData.append('kategori', formValues.kategori);
      formData.append('status', formValues.status);
      formData.append('NPWP', formValues.NPWP);
      formData.append('pic', formValues.pic);
      formData.append('kota', formValues.kota);
      formData.append('alamat', formValues.alamat);
      formData.append('kodePos', formValues.kodePos);
      formData.append('noTelepon', formValues.noTelepon);
      formData.append('email', formValues.email);
      formData.append('isTop', String(formValues.isTop));
      formData.append('isActive', String(formValues.isActive));
      formData.append('limitKredit', String(formValues.limitKredit));
      formData.append('remainKredit', String(formValues.remainKredit));

      console.log("=2=> Customer form values:", formData);
      
      let result;
      if (modalMode === 'add') {
        result = await custService.createCustomer(formData);
      } else {
        result = await custService.updateCustomer(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Customer baru berhasil ditambahkan');
      } else {
        toast.success('Data Customer berhasil diperbarui');
        if (viewed && viewed.kodeCust === formValues.id) {
          setViewed(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchCustomers();
      await fetchCustomersList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  
  // Toggle Customer Status
  const handleToggleStatus = async (customer: CustData) => {
    const newStatus: CustData['status'] = customer.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await custService.updateCustomer(customer.kodeCust, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewed(result.data);
      toast.success(`Status customer berhasil diubah menjadi ${newStatus}`);
      await fetchCustomersList(currentPage);
      await fetchCustomers();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };


   // Dynamic Statistics
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.isActive).length;
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
  }, [customers]);

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
      namaCust: '',
      kategori: 'toko_pertanian' as CustData['kategori'],
      status: 'Aktif' as CustData['status'],
      NPWP: '',
      pic: '',
      kota: '',
      alamat: '',
      kodePos: '',
      noTelepon: '',
      email: '',
      isTop: false,
      isActive: true,
      limitKredit: 0,
      remainKredit: 0
    });
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    toast.success('Mengekspor data... File Anda akan segera diunduh.');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Customer',
      value: stats.total,
      subtitle: 'Semua Customer',
      icon: 'ri-team-fill',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: `Customer Aktif`,
      icon: 'ri-user-follow-fill',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: `Customer Tidak Aktif`,
      icon: 'ri-user-unfollow-fill',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      title: 'Kategori',
      value: stats.kategori,
      subtitle: `Kategori Customer`,
      icon: 'ri-dashboard-fill',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ], [stats]);

  return {
    customers,
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
    wilayahOptions,
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




export default useCustomer;
