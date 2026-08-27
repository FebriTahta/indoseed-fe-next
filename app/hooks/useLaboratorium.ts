import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import laboratoriumService from '@/app/services/laboratoriumService';
import { LaboratoriumData } from '@/app/types/laboratorium';
import { toast } from 'react-toastify';

export function useLaboratorium() {
  const router = useRouter();
  const [laboratoriums, setLaboratoriums] = useState<LaboratoriumData[]>([]);
  const [allLaboratoriumsForStats, setAllLaboratoriumsForStats] = useState<LaboratoriumData[]>([]);
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

  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Viewed Detail State
  const [viewed, setViewed] = useState<LaboratoriumData | null>(null);
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
    namaLaboratorium: '',
    deskripsi: '',
    alamat: '',
    telepon: '',
    nomorAkreditasi: '',
    lembagaAkreditasi: '',
    tanggalAkreditasi: '',
    tanggalBerlakuAkreditasi: '',
    ruangLingkupPengujian: '',
    status: 'Aktif' as LaboratoriumData['status'],
  });

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  ];

  const fetchAllLaboratoriumsForStats = useCallback(async () => {
    setLoading(true);
    try {
      const result = await laboratoriumService.getLaboratoriums();
      if (result.success || result.status === 'success') {
        setAllLaboratoriumsForStats(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch laboratorium data');
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

  const fetchLaboratoriumsList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await laboratoriumService.getLaboratoriumList({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setLaboratoriums(result.data || []);
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
      toast.error('Gagal mengambil data laboratorium');
    } finally {
      setIsTableLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filterStatus, router]);

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

        await fetchAllLaboratoriumsForStats();
        await fetchLaboratoriumsList(1);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router, fetchAllLaboratoriumsForStats, fetchLaboratoriumsList]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchLaboratoriumsList(currentPage);
    }
  }, [debouncedSearch, filterStatus, currentPage, pageSize, loading, fetchLaboratoriumsList]);

  const handleEdit = (id: string) => {
    const lab = laboratoriums.find(l => l.kodeLaboratorium === id);
    if (!lab) {
      toast.error('Laboratorium tidak ditemukan');
      return;
    }

    setModalMode('edit');
    setFormValues({
      id: lab.kodeLaboratorium,
      namaLaboratorium: lab.namaLaboratorium,
      deskripsi: lab.deskripsi || '',
      alamat: lab.alamat || '',
      telepon: lab.telepon || '',
      nomorAkreditasi: lab.nomorAkreditasi || '',
      lembagaAkreditasi: lab.lembagaAkreditasi || '',
      tanggalAkreditasi: lab.tanggalAkreditasi || '',
      tanggalBerlakuAkreditasi: lab.tanggalBerlakuAkreditasi || '',
      ruangLingkupPengujian: lab.ruangLingkupPengujian || '',
      status: lab.status 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete laboratorium", id);
    toast.success('Data laboratorium berhasil dihapus');
  };

  const handleOpenEditModal = (lab: LaboratoriumData) => {
    setModalMode('edit');
    setFormValues({
      id: lab.kodeLaboratorium,
      namaLaboratorium: lab.namaLaboratorium,
      deskripsi: lab.deskripsi || '',
      alamat: lab.alamat || '',
      telepon: lab.telepon || '',
      nomorAkreditasi: lab.nomorAkreditasi || '',
      lembagaAkreditasi: lab.lembagaAkreditasi || '',
      tanggalAkreditasi: lab.tanggalAkreditasi || '',
      tanggalBerlakuAkreditasi: lab.tanggalBerlakuAkreditasi || '',
      ruangLingkupPengujian: lab.ruangLingkupPengujian || '',
      status: lab.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.id.trim()) {
      toast.error('Kode laboratorium harus diisi');
      return;
    }
    if (!formValues.namaLaboratorium.trim()) {
      toast.error('Nama laboratorium harus diisi');
      return;
    }
    
    setIsSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('kodeLaboratorium', formValues.id);
      formData.append('namaLaboratorium', formValues.namaLaboratorium);
      if (formValues.deskripsi) formData.append('deskripsi', formValues.deskripsi);
      if (formValues.alamat) formData.append('alamat', formValues.alamat);
      if (formValues.telepon) formData.append('telepon', formValues.telepon);
      if (formValues.nomorAkreditasi) formData.append('nomorAkreditasi', formValues.nomorAkreditasi);
      if (formValues.lembagaAkreditasi) formData.append('lembagaAkreditasi', formValues.lembagaAkreditasi);
      if (formValues.tanggalAkreditasi) formData.append('tanggalAkreditasi', formValues.tanggalAkreditasi);
      if (formValues.tanggalBerlakuAkreditasi) formData.append('tanggalBerlakuAkreditasi', formValues.tanggalBerlakuAkreditasi);
      if (formValues.ruangLingkupPengujian) formData.append('ruangLingkupPengujian', formValues.ruangLingkupPengujian);
      formData.append('status', formValues.status);

      let result;
      if (modalMode === 'add') {
        result = await laboratoriumService.createLaboratorium(formData);
      } else {
        result = await laboratoriumService.updateLaboratorium(formValues.id, formData);
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Laboratorium baru berhasil ditambahkan');
      } else {
        toast.success('Data Laboratorium berhasil diperbarui');
        if (viewed && viewed.kodeLaboratorium === formValues.id) {
          setViewed(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllLaboratoriumsForStats();
      await fetchLaboratoriumsList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (lab: LaboratoriumData) => {
    const newStatus: LaboratoriumData['status'] = lab.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);

      const result = await laboratoriumService.updateLaboratorium(lab.kodeLaboratorium, formData);
      if (result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewed(result.data);
      toast.success(`Status laboratorium berhasil diubah menjadi ${newStatus}`);
      await fetchLaboratoriumsList(currentPage);
      await fetchAllLaboratoriumsForStats();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = allLaboratoriumsForStats.length;
    const active = allLaboratoriumsForStats.filter(l => l.status === 'Aktif').length;
    const inactive = total - active;
    const activePercent = total > 0 ? ((active / total) * 100).toFixed(2) : '0';
    const inactivePercent = total > 0 ? ((inactive / total) * 100).toFixed(2) : '0';

    return { total, active, inactive, activePercent, inactivePercent };
  }, [allLaboratoriumsForStats]);

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormValues({
      id: '',
      namaLaboratorium: '',
      deskripsi: '',
      alamat: '',
      telepon: '',
      nomorAkreditasi: '',
      lembagaAkreditasi: '',
      tanggalAkreditasi: '',
      tanggalBerlakuAkreditasi: '',
      ruangLingkupPengujian: '',
      status: 'Aktif',
    });
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    toast.success('Mengekspor data... File Anda akan segera diunduh.');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Laboratorium',
      value: stats.total,
      subtitle: 'Semua Laboratorium',
      icon: 'ri-flask-fill',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: `Laboratorium Aktif`,
      icon: 'ri-check-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: `Laboratorium Tidak Aktif`,
      icon: 'ri-close-line',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    }
  ], [stats]);

  return {
    laboratoriums,
    loading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
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
    statItems
  };
}

export default useLaboratorium;
