"use client"
import React, { useState, useMemo, Fragment, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import DetailPanel, { TabConfig, DetailAction } from '../../shared/DetailPanel';
import CrudModal from '../../shared/CrudModal';

interface Land {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  jenisLahan: 'Greenhouse' | 'Lahan Terbuka';
  komoditasUtama: string;
  komoditasColor: string;
  komoditasIcon: string;
  lokasi: string;
  luas: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Maintenance';
  detailLokasi: string;
  koordinat: string;
  petaniMitra: string;
  commodityId: string | null;
  partnerId: string | null;
  tglDibuat: string;
  dibuatOleh: string;
  keterangan: string;
  image: string;
  commodity?: {
    id: string;
    kodeKomoditas: string;
    namaKomoditas: string;
  } | null;
  partner?: {
    id: string;
    kodePetani: string;
    namaPetani: string;
  } | null;
}

const KOMODITAS_DEFAULTS: Record<string, { color: string; icon: string }> = {
  'Tomat': { color: 'emerald', icon: 'ri-leaf-line' },
  'Cabai': { color: 'red', icon: 'ri-leaf-line' },
  'Padi': { color: 'blue', icon: 'ri-seedling-line' },
  'Jagung': { color: 'amber', icon: 'ri-sun-line' },
  'Kedelai': { color: 'green', icon: 'ri-leaf-line' },
  'Melon': { color: 'lime', icon: 'ri-focus-2-line' },
  'Bawang Merah': { color: 'purple', icon: 'ri-seedling-line' },
  'Kentang': { color: 'yellow', icon: 'ri-seedling-line' }
};

export default function GreenhousePage() {
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

  // Debounce search input and reset pagination page on change
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
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

  // Helper: Authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // API Call: Fetch list of lands
  const fetchLandsList = async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(pageToFetch));
      queryParams.append('pageSize', String(pageSize));
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (filterJenis) queryParams.append('jenisLahan', filterJenis.value);
      if (filterStatus) queryParams.append('status', filterStatus.value);
      if (filterKomoditas) queryParams.append('commodityId', filterKomoditas.value);
      if (filterLokasi) queryParams.append('lokasi', filterLokasi.value);

      const response = await fetch(`${baseUrl}/master/greenhouse?${queryParams.toString()}`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        setError('Akses Tidak Sah');
        router.push('/');
        return;
      }

      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server');
      }

      const result = await response.json();
      if (result.status === 'success') {
        setLands(result.data || []);
        setTotalRecords(result.pagination?.totalItems || 0);
        setTotalPages(result.pagination?.totalPages || 0);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Gagal mengambil data greenhouse / lahan');
    } finally {
      setIsTableLoading(false);
    }
  };

  // API Call: Fetch all records (for stats calculations)
  const fetchAllLandsForStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/greenhouse?pageSize=100000`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setAllLandsForStats(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const fetchCommoditiesOptions = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/commodity?pageSize=1000&status=Aktif`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          const options = (result.data || []).map((c: any) => ({
            value: c.id,
            label: c.namaKomoditas
          }));
          setCommoditiesOptions(options);
        }
      }
    } catch (err) {
      console.error('Error fetching commodities:', err);
    }
  };



  const fetchPartnersOptions = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/partner?pageSize=1000&status=Aktif`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          const options = (result.data || []).map((p: any) => ({
            value: p.id,
            label: p.namaPetani
          }));
          setPartnersOptions(options);
        }
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
    }
  };

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
  }, [router]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchLandsList(currentPage);
    }
  }, [debouncedSearch, filterJenis, filterStatus, filterKomoditas, filterLokasi, currentPage, pageSize]);

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

  const statItems: StatItem[] = useMemo(() => [
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

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

      let response;
      if (modalMode === 'add') {
        response = await fetch(`${baseUrl}/master/greenhouse`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
      } else {
        response = await fetch(`${baseUrl}/master/greenhouse/${formValues.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: formData
        });
      }

      const result = await response.json();

      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Gagal menyimpan data');
      }

      if (modalMode === 'add') {
        toast.success('Greenhouse / Lahan baru berhasil ditambahkan');
      } else {
        toast.success('Data Greenhouse / Lahan berhasil diperbarui');
        // Update viewed land detail if currently viewing this greenhouse
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
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${baseUrl}/master/greenhouse/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        const result = await response.json();
        if (!response.ok || result.status === 'error') {
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

      const formData = new FormData();
      formData.append('status', newStatus);

      const response = await fetch(`${baseUrl}/master/greenhouse/${land.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      });

      const result = await response.json();
      if (!response.ok || result.status === 'error') {
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
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/greenhouse/${land.id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setViewedLand(result.data);
        }
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

    // Validate size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Ukuran gambar melebihi batas 5MB!');
      e.target.value = '';
      return;
    }

    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format gambar tidak valid. Hanya JPG, PNG, GIF, dan WEBP.');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setFormValues(prev => ({ ...prev, image: '' }));
  };

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterJenis,
      onChange: (val: any) => { setFilterJenis(val); setCurrentPage(1); },
      options: jenisLahanOptions,
      placeholder: 'Jenis Lahan',
      widthClass: 'sm:w-44'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-40'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => { setFilterKomoditas(val); setCurrentPage(1); },
      options: commoditiesOptions,
      placeholder: 'Komoditas',
      widthClass: 'sm:w-40'
    },
    {
      value: filterLokasi,
      onChange: (val: any) => { setFilterLokasi(val); setCurrentPage(1); },
      options: lokasiOptions,
      placeholder: 'Lokasi',
      widthClass: 'sm:w-36'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Lahan', 'Nama Lahan', 'Jenis Lahan', 'Komoditas Utama', 'Petani Mitra', 'Lokasi', 'Luas (Ha)', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Land, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedLand && viewedLand.id === item.id;
    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeLahan}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            {item.image ? (
              <img src={item.image} alt={item.namaLahan} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <i className="ri-image-line text-lg"></i>
              </div>
            )}
          </div>
          <span className="text-gray-800">{item.namaLahan}</span>
        </td>
        <td className="p-4">
          <span className={`font-semibold ${item.jenisLahan === 'Greenhouse' ? 'text-emerald-600' : 'text-blue-500'}`}>
            {item.jenisLahan}
          </span>
        </td>
        <td className="p-4">
          <span className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white bg-${item.komoditasColor}-500 text-xs`}>
              <i className={item.komoditasIcon}></i>
            </span>
            <span className="font-semibold text-gray-700">{item.commodity?.namaKomoditas || item.komoditasUtama}</span>
          </span>
        </td>
        <td className="p-4 font-medium text-gray-700">{item.partner?.namaPetani || item.petaniMitra || '-'}</td>
        <td className="p-4">{item.lokasi}</td>
        <td className="p-4">{Number(item.luas).toFixed(2)}</td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : item.status === 'Maintenance'
              ? 'bg-danger/10 text-danger'
              : 'bg-gray-100 text-gray-500'
            }`}>
            {item.status}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleViewDetail(item)}
              className="text-gray-400 hover:text-emerald-600 transition-colors"
              title="Lihat Detail Lahan"
            >
              <i className="ri-eye-line text-lg"></i>
            </button>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Lahan"
            >
              <i className="ri-edit-line text-lg"></i>
            </button>
            <button
              onClick={() => handleDeleteLand(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Hapus Lahan"
            >
              <i className="ri-trash-line text-lg"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'kondisi', label: 'Kondisi' },
    { id: 'riwayat', label: 'Riwayat' },
    { id: 'dokumen', label: 'Dokumen' }
  ];

  const detailActions: DetailAction[] = viewedLand ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedLand),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewedLand.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedLand),
      icon: 'ri-shut-down-line',
      className: viewedLand.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedLand) return null;
    switch (tabId) {
      case 'info':
        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Jenis Lahan</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedLand.jenisLahan}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Komoditas Utama</div>
            <div className="col-span-8 py-1 font-semibold text-emerald-600 flex items-center gap-1">
              <span className="mr-2 text-gray-700">:</span>
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white bg-${viewedLand.komoditasColor}-500 text-[10px]`}>
                <i className={viewedLand.komoditasIcon}></i>
              </span>
              {viewedLand.commodity?.namaKomoditas || viewedLand.komoditasUtama}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Luas</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{Number(viewedLand.luas).toFixed(2)} Ha
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-start">Lokasi</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-start leading-relaxed">
              <span className="mr-2">:</span>
              <span>
                <strong className="text-gray-800">{viewedLand.lokasi}</strong> - {viewedLand.detailLokasi || '-'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Koordinat</div>
            <div className="col-span-8 py-1 font-mono text-gray-700 flex items-center">
              <span className="mr-2 text-gray-700">:</span>{viewedLand.koordinat || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Petani Mitra</div>
            <div className="col-span-8 py-1 font-medium text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedLand.partner?.namaPetani || viewedLand.petaniMitra || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedLand.tglDibuat ? new Date(viewedLand.tglDibuat).toLocaleDateString('id-ID') : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedLand.dibuatOleh || 'Admin'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewedLand.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : viewedLand.status === 'Maintenance'
                  ? 'bg-danger/10 text-danger'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                {viewedLand.status}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Keterangan</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-2">:</span>{viewedLand.keterangan || '-'}
            </div>
          </div>
        );
      case 'kondisi':
        return (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-temp-hot-line text-lg text-red-500"></i> Suhu Udara
              </span>
              <span className="text-sm font-bold text-gray-800">27.8 °C</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-contrast-drop-line text-lg text-blue-500"></i> Kelembapan Udara
              </span>
              <span className="text-sm font-bold text-gray-800">72%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-flask-line text-lg text-purple-500"></i> Keasaman Tanah (pH)
              </span>
              <span className="text-sm font-bold text-gray-800">6.4 pH</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-pin-distance-line text-lg text-emerald-500"></i> Sistem Irigasi
              </span>
              <span className="text-xs font-semibold bg-success/15 text-success rounded px-2 py-0.5">Otomatis - Aktif</span>
            </div>
          </div>
        );
      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Musim Panen Terakhir:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Musim Tanam II - Ceri</p>
                  <span className="text-[10px] text-textmuted">Hasil panen melimpah</span>
                </div>
                <span className="font-bold text-emerald-600">950 Kg</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Musim Tanam I - Roma</p>
                  <span className="text-[10px] text-textmuted">Panen akhir tahun 2025</span>
                </div>
                <span className="font-bold text-emerald-600">1.2 Ton</span>
              </div>
            </div>
          </div>
        );
      case 'dokumen':
        return (
          <div className="space-y-3 py-1">
            <div className="p-2.5 border border-defaultborder/60 hover:bg-gray-50 rounded flex items-center justify-between gap-3 text-xs cursor-pointer group">
              <div className="flex items-center gap-2 overflow-hidden">
                <i className="ri-file-pdf-fill text-red-500 text-lg flex-shrink-0"></i>
                <span className="truncate font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Sertifikat Lahan Prima 1.pdf</span>
              </div>
              <i className="ri-download-line text-textmuted group-hover:text-emerald-600 text-sm"></i>
            </div>
            <div className="p-2.5 border border-defaultborder/60 hover:bg-gray-50 rounded flex items-center justify-between gap-3 text-xs cursor-pointer group">
              <div className="flex items-center gap-2 overflow-hidden">
                <i className="ri-file-pdf-fill text-red-500 text-lg flex-shrink-0"></i>
                <span className="truncate font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">SOP Budidaya Tomat.pdf</span>
              </div>
              <i className="ri-download-line text-textmuted group-hover:text-emerald-600 text-sm"></i>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Auth loading / error states
  if (error) {
    return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <span className="text-sm font-semibold text-gray-600">Memeriksa autentikasi...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Greenhouse / Lahan" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Greenhouse / Lahan"
        activepage="Greenhouse / Lahan"
        description="Kelola data greenhouse dan lahan produksi"
        customButton={
          <SpkButton
            {...({
              onclickfunc: handleOpenAddModal,
              style: { backgroundColor: '#078836', color: 'white' },
              className: "hover:bg-[#06732d] hover:text-white",
              customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
            } as any)}
          >
            <i className="ri-add-line text-lg"></i> Tambah Greenhouse / Lahan
          </SpkButton>
        }
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedLand ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari greenhouse / lahan..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={lands}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data lahan yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewedLand && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Lahan"
              onClose={() => setViewedLand(null)}
              imageUrl={viewedLand.image}
              imageAlt={viewedLand.namaLahan}
              statusLabel={viewedLand.status}
              statusBgClass={
                viewedLand.status === 'Aktif'
                  ? 'bg-success'
                  : viewedLand.status === 'Maintenance'
                    ? 'bg-danger'
                    : 'bg-gray-500'
              }
              primaryTitle={viewedLand.namaLahan}
              secondaryTitle={viewedLand.kodeLahan}
              tabs={detailTabs}
              activeTab={activeDetailTab}
              onTabChange={setActiveDetailTab}
              renderTabContent={renderDetailTabContent}
              actions={detailActions}
              isLoading={isDetailLoading}
            />
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Greenhouse / Lahan Baru' : 'Ubah Data Greenhouse / Lahan'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Lahan</label>
            <input
              type="text"
              value={formValues.kodeLahan}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodeLahan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="GH-XXX atau LH-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lahan</label>
            <input
              type="text"
              value={formValues.namaLahan}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaLahan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Greenhouse D"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Jenis Lahan</label>
            <select
              value={formValues.jenisLahan}
              onChange={(e) => {
                const val = e.target.value as Land['jenisLahan'];
                setFormValues(prev => ({
                  ...prev,
                  jenisLahan: val
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lahan Terbuka">Lahan Terbuka</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas</label>
            <select
              value={formValues.commodityId}
              onChange={(e) => {
                const val = e.target.value;
                const selectedCommodity = commoditiesOptions.find(c => c.value === val);
                const commodityName = selectedCommodity ? selectedCommodity.label : '';
                const def = KOMODITAS_DEFAULTS[commodityName] || { color: 'green', icon: 'ri-seedling-line' };
                setFormValues(prev => ({
                  ...prev,
                  commodityId: val,
                  komoditasUtama: commodityName,
                  komoditasColor: def.color,
                  komoditasIcon: def.icon
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
              required
            >
              <option value="" disabled>Pilih Komoditas</option>
              {commoditiesOptions.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Warna Penanda</label>
            <select
              value={formValues.komoditasColor}
              onChange={(e) => setFormValues(prev => ({ ...prev, komoditasColor: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="emerald">Emerald (Hijau Emerald)</option>
              <option value="green">Green (Hijau)</option>
              <option value="lime">Lime (Hijau Muda)</option>
              <option value="red">Red (Merah)</option>
              <option value="blue">Blue (Biru)</option>
              <option value="amber">Amber (Oranye/Kuning)</option>
              <option value="yellow">Yellow (Kuning)</option>
              <option value="purple">Purple (Ungu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Icon Penanda</label>
            <select
              value={formValues.komoditasIcon}
              onChange={(e) => setFormValues(prev => ({ ...prev, komoditasIcon: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="ri-leaf-line">Daun (ri-leaf-line)</option>
              <option value="ri-seedling-line">Kecambah (ri-seedling-line)</option>
              <option value="ri-sun-line">Matahari (ri-sun-line)</option>
              <option value="ri-focus-2-line">Target (ri-focus-2-line)</option>
              <option value="ri-water-flash-line">Air (ri-water-flash-line)</option>
              <option value="ri-plant-line">Tanaman (ri-plant-line)</option>
              <option value="ri-home-3-line">Greenhouse (ri-home-3-line)</option>
            </select>
          </div>
        </div>

        {/* Beautiful image file upload with size limit */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Gambar Greenhouse / Lahan (Maks. 5MB)</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md border border-defaultborder overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center relative group">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    disabled={isSubmitLoading}
                  >
                    <i className="ri-delete-bin-line text-lg"></i>
                  </button>
                </>
              ) : (
                <i className="ri-image-line text-2xl text-gray-300"></i>  
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="block w-full text-xs text-gray-500
                  file:mr-4 file:py-1.5 file:px-3
                  file:rounded-md file:border-0
                  file:text-xs file:font-semibold
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100
                  cursor-pointer disabled:opacity-50"
                disabled={isSubmitLoading}
              />
              <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG, GIF, WEBP. Maksimal ukuran file 5MB.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Lokasi Wilayah</label>
            <select
              value={formValues.lokasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, lokasi: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Bogor">Bogor</option>
              <option value="Subang">Subang</option>
              <option value="Lamongan">Lamongan</option>
              <option value="Jember">Jember</option>
              <option value="Garut">Garut</option>
              <option value="Wonosobo">Wonosobo</option>
              <option value="Brebes">Brebes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Luas Lahan (Ha)</label>
            <input
              type="number"
              step="0.01"
              value={formValues.luas}
              onChange={(e) => setFormValues(prev => ({ ...prev, luas: Number(e.target.value) }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="0.80"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Land['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Petani Mitra</label>
          <select
            value={formValues.partnerId}
            onChange={(e) => {
              const val = e.target.value;
              const partner = partnersOptions.find(p => p.value === val);
              setFormValues(prev => ({
                ...prev,
                partnerId: val,
                petaniMitra: partner ? partner.label : ''
              }));
            }}
            className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
            disabled={isSubmitLoading}
          >
            <option value="">Pilih Petani Mitra (Opsional)</option>
            {partnersOptions.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Latitude (Lat)</label>
            <input
              type="text"
              value={formValues.latitude}
              onChange={(e) => setFormValues(prev => ({ ...prev, latitude: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="-6.7105"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Longitude (Long)</label>
            <input
              type="text"
              value={formValues.longitude}
              onChange={(e) => setFormValues(prev => ({ ...prev, longitude: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="106.8123"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat Lengkap / Detail Lokasi</label>
          <textarea
            value={formValues.detailLokasi}
            onChange={(e) => setFormValues(prev => ({ ...prev, detailLokasi: e.target.value }))}
            rows={2}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Masukkan alamat jalan, dusun, desa, kecamatan..."
            disabled={isSubmitLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Keterangan Tambahan</label>
          <textarea
            value={formValues.keterangan}
            onChange={(e) => setFormValues(prev => ({ ...prev, keterangan: e.target.value }))}
            rows={2}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Catatan tambahan mengenai lahan ini..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
