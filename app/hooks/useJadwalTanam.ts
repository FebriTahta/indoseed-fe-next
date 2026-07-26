import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useKomoditas from '@/app/hooks/useKomoditas'
import useVarietas from './useVarietas';
import jadwalTanamService from '@/app/services/jadwalTanamService';

import { JadwalTanam, InformasiUmum, SelectOption } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

export function useJadwalTanams() {
  const router = useRouter();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();
  const [jadwalTanams, setJadwalTanams] = useState<JadwalTanam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterPeriode, setFilterPeriode] = useState<any>(null);
  const [filterLahan, setFilterLahan] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Viewed Detail State
  const [viewed, setViewed] = useState<InformasiUmum | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'kontak' | 'riwayat' | 'note'>('info');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);

  

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


  const fetchJadwalTanams = useCallback(async () => {
    setLoading(true);
    try {
      const result = await jadwalTanamService.getJadwalTanams();
      if (result.success || result.status === 'success') {
        setJadwalTanams(result.data || []);
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
  const fetchJadwalTanamList = useCallback(async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const result = await jadwalTanamService.getJadwalTanamList({
        page: pageToFetch,
        pageSize,
        search: debouncedSearch || undefined,
        periode: filterPeriode?.value || undefined,
        jenisLahan: filterLahan?.value || undefined,
        komoditas: filterKomoditas?.value || undefined,
        varietas: filterVarietas?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      if (result.status === 'success') {
        setJadwalTanams(result.data || []);
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
  }, [currentPage, pageSize, debouncedSearch, filterPeriode, filterLahan, filterKomoditas, filterVarietas, filterStatus, router]);

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

        await fetchJadwalTanams();
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    const commoditiesOption = {};


    checkAuthAndFetchData();
  }, [router, fetchJadwalTanams]);

  const commodityOptions = useMemo<SelectOption[]>(() => {
    return commodities.map((item: Commodity) => ({
      value: item.kodeKomoditas,
      label: item.namaKomoditas,
    }));
  }, [commodities]);

  const varietasOptions = useMemo<SelectOption[]>(() => {
    return varieties.map((item: Variety) => ({
      value: item.kodeVarietas,
      label: item.namaVarietas,
    }));
  }, [commodities]);

  const handleAdd = () => {
    console.log("Add gudang clicked");
  };

  const handleEdit = (id: string) => {
    console.log("Edit gudang", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete customer", id);
  };

   // Dynamic Statistics
  const stats = useMemo(() => {
    const total = jadwalTanams.length;
    const active = jadwalTanams.filter(g => g.status === 'Aktif').length;
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
  }, [jadwalTanams]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterPeriode(null);
    setFilterLahan(null);
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const handleExportData = () => {
    toast.success('Mengekspor data... File Anda akan segera diunduh.');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Jadwal',
      value: stats.total,
      subtitle: 'Jadwal Tanam',
      icon: 'ri-calendar-schedule-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Total Lahan',
      value: 0,
      subtitle: `Luas total lahan`,
      icon: 'ri-user-follow-fill',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Komoditas',
      value: 0,
      subtitle: `Jenis Komoditas`,
      icon: 'ri-leaf-line',
      bgColor: 'bg-violet-100',
      textColor: 'text-violet-600'
    },
    {
      title: 'Akan Tanam',
      value: 0,
      subtitle: `Dalam 7 hari ke depan`,
      icon: 'ri-calendar-schedule-line',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Sedang Berlangsung',
      value: 0,
      subtitle: `Jadwal Aktif`,
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Selesai',
      value: 0,
      subtitle: `Periode ini`,
      icon: 'ri-seedling-line',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ], [stats]);

  return {
    jadwalTanams,
    loading,
    error,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterLahan,
    setFilterLahan,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
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
    kategoriOptions,
    commodityOptions,
    varietasOptions,
    statusOptions,
    isTableLoading,
    isModalOpen,
    setIsModalOpen,
    handleResetFilters,
    handleExportData,
    handleAdd,
    handleEdit,
    handleDelete,
    statItems
  };
}




export default useJadwalTanams;
