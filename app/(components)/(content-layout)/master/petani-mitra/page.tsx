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

interface Partner {
  id: string;
  kodePetani: string;
  namaPetani: string;
  kelompokTani: string;
  komoditasUtama: string;
  noKtp: string | null;
  noTelepon: string | null;
  alamat: string | null;
  luasLahan: number;
  pengalaman: number;
  tglBergabung: string;
  status: 'Aktif' | 'Non Aktif' | 'Tidak Aktif';
  image: string | null;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
  greenhouses?: Land[];
}

interface Land {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  jenisLahan: string;
  komoditasUtama: string;
  lokasi: string;
  luas: number;
  status: string;
  petaniMitra: string | null;
  partnerId?: string | null;
  keterangan?: string | null;
  koordinat?: string | null;
  detailLokasi?: string | null;
  commodity?: {
    id: string;
    kodeKomoditas: string;
    namaKomoditas: string;
  } | null;
}

export default function PetaniMitraPage() {
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

  // Debounce search input and reset pagination page on change
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
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

  // Helper: Authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // API Call: Fetch list of partners
  const fetchPartnersList = async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(pageToFetch));
      queryParams.append('pageSize', String(pageSize));
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (filterKelompok) queryParams.append('kelompokTani', filterKelompok.value);
      if (filterKomoditas) queryParams.append('komoditasUtama', filterKomoditas.value);
      if (filterStatus) queryParams.append('status', filterStatus.value);

      const response = await fetch(`${baseUrl}/master/partner?${queryParams.toString()}`, {
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
        setPartners(result.data || []);
        setTotalRecords(result.pagination?.totalItems || 0);
        setTotalPages(result.pagination?.totalPages || 0);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Gagal mengambil data petani mitra');
    } finally {
      setIsTableLoading(false);
    }
  };

  // API Call: Fetch all records (for stats calculations)
  const fetchAllPartnersForStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/partner?pageSize=100000`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setAllPartnersForStats(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  // API Call: Fetch greenhouses for local mapping of lahan dikelola
  const fetchGreenhouses = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/greenhouse?pageSize=1000`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setGreenhouses(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching greenhouses:', err);
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
  }, [router]);

  // Reactive updates on filters change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchPartnersList(currentPage);
    }
  }, [debouncedSearch, filterKelompok, filterKomoditas, filterStatus, currentPage, pageSize]);

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
  const statItems: StatItem[] = useMemo(() => [
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

    // Pre-generate Kode Petani (PM-0XX)
    const nextNum = allPartnersForStats.length + 1;
    const formattedCode = `PM-${String(nextNum).padStart(3, '0')}`;

    // Get today formatted as YYYY-MM-DD
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
      luasLahan: '1.0',
      pengalaman: '5',
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

    const dateStr = partner.tglBergabung ? new Date(partner.tglBergabung).toISOString().split('T')[0] : '';

    setFormValues({
      id: partner.id,
      kodePetani: partner.kodePetani,
      namaPetani: partner.namaPetani,
      kelompokTani: partner.kelompokTani,
      komoditasUtama: partner.komoditasUtama,
      noKtp: partner.noKtp || '',
      noTelepon: partner.noTelepon || '',
      alamat: partner.alamat || '',
      luasLahan: String(partner.luasLahan),
      pengalaman: String(partner.pengalaman),
      tglBergabung: dateStr,
      status: partner.status === 'Tidak Aktif' ? 'Non Aktif' : partner.status,
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
    if (!formValues.kelompokTani.trim()) {
      toast.error('Kelompok tani harus diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

      const formData = new FormData();
      formData.append('kodePetani', formValues.kodePetani);
      formData.append('namaPetani', formValues.namaPetani);
      formData.append('kelompokTani', formValues.kelompokTani);
      formData.append('komoditasUtama', formValues.komoditasUtama);
      formData.append('noKtp', formValues.noKtp);
      formData.append('noTelepon', formValues.noTelepon);
      formData.append('alamat', formValues.alamat);
      formData.append('luasLahan', formValues.luasLahan);
      formData.append('pengalaman', formValues.pengalaman);
      formData.append('tglBergabung', formValues.tglBergabung);
      
      // Normalize 'Non Aktif' status into 'Tidak Aktif' or 'Non Aktif' consistently
      const statusToSend = formValues.status === 'Non Aktif' ? 'Non Aktif' : formValues.status;
      formData.append('status', statusToSend);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (modalMode === 'add') {
        response = await fetch(`${baseUrl}/master/partner`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
      } else {
        response = await fetch(`${baseUrl}/master/partner/${formValues.id}`, {
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
        toast.success('Petani Mitra baru berhasil ditambahkan');
      } else {
        toast.success('Data petani mitra berhasil diperbarui');
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
    if (!window.confirm('Apakah Anda yakin ingin menghapus data petani mitra ini?')) {
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/partner/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Gagal menghapus data');
      }

      toast.success('Petani Mitra berhasil dihapus');
      if (viewedPartner && viewedPartner.id === id) {
        setViewedPartner(null);
      }
      await fetchAllPartnersForStats();
      await fetchPartnersList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
    }
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (partner: Partner) => {
    const newStatus = partner.status === 'Aktif' ? 'Non Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const formData = new FormData();
      formData.append('status', newStatus);

      const response = await fetch(`${baseUrl}/master/partner/${partner.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      });

      const result = await response.json();
      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Gagal mengubah status');
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

  // Export Data Placeholder
  const handleExportData = () => {
    toast.success('Mengekspor data petani mitra... File CSV akan segera diunduh.');
  };

  // File Upload handling
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

  // View Detail Panel
  const handleViewDetail = async (partner: Partner) => {
    setViewedPartner(partner);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/partner/${partner.id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setViewedPartner(result.data);
        }
      }
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterKelompok,
      onChange: (val: any) => { setFilterKelompok(val); setCurrentPage(1); },
      options: kelompokTaniOptions,
      placeholder: 'Kelompok Tani',
      widthClass: 'sm:w-44'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-36'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => { setFilterKomoditas(val); setCurrentPage(1); },
      options: komoditasOptions,
      placeholder: 'Komoditas Utama',
      widthClass: 'sm:w-44'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Petani', 'Nama Petani', 'Kelompok Tani', 'Komoditas Utama', 'Luas Lahan (Ha)', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Partner, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedPartner && viewedPartner.id === item.id;
    const partnerGreenhouses = item.greenhouses || greenhouses.filter(g => g.partnerId === item.id || g.petaniMitra === item.namaPetani);
    const totalLuas = partnerGreenhouses.reduce((sum, g) => sum + Number(g.luas || 0), 0);
    const formattedLuas = totalLuas.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodePetani}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.namaPetani} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                <i className="ri-user-line text-lg"></i>
              </div>
            )}
          </div>
          <span className="text-gray-800 font-semibold">{item.namaPetani}</span>
        </td>
        <td className="p-4 text-gray-600 font-medium">{item.kelompokTani}</td>
        <td className="p-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded">
            <i className="ri-leaf-line"></i>
            {item.komoditasUtama}
          </span>
        </td>
        <td className="p-4 text-gray-600 font-medium">{formattedLuas}</td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : 'bg-danger/10 text-danger'
            }`}>
            {item.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleViewDetail(item)}
              className="text-gray-400 hover:text-emerald-600 transition-colors"
              title="Lihat Detail Petani"
            >
              <i className="ri-eye-line text-lg"></i>
            </button>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Petani"
            >
              <i className="ri-edit-line text-lg"></i>
            </button>
            <button
              onClick={() => handleDeletePartner(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Hapus Petani"
            >
              <i className="ri-trash-line text-lg"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Tabs Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'lahan', label: 'Lahan' },
    { id: 'produksi', label: 'Riwayat Produksi' },
    { id: 'catatan', label: 'Catatan' }
  ];

  const detailActions: DetailAction[] = viewedPartner ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedPartner),
      icon: 'ri-edit-line',
      className: 'bg-emerald-600 text-white hover:bg-emerald-700 font-semibold px-4 py-2 rounded flex items-center justify-center gap-2'
    },
    {
      label: viewedPartner.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedPartner),
      icon: 'ri-shut-down-line',
      className: viewedPartner.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50 font-semibold px-4 py-2 rounded flex items-center justify-center gap-2'
        : 'border border-success text-success hover:bg-emerald-50 font-semibold px-4 py-2 rounded flex items-center justify-center gap-2'
    }
  ] : [];

  // Local helper to filter greenhouses managed by this partner
  const managedLahan = useMemo(() => {
    if (!viewedPartner) return [];
    return greenhouses.filter(g => g.partnerId === viewedPartner.id || g.petaniMitra === viewedPartner.namaPetani);
  }, [viewedPartner, greenhouses]);

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedPartner) return null;

    switch (tabId) {
      case 'info':
        return (
          <div className="grid grid-cols-12 gap-y-3.5 text-xs mt-3 text-gray-700 divide-y divide-gray-100">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Nama Lengkap</div>
            <div className="col-span-8 py-1 font-bold text-gray-800 flex items-center">
              <span className="mr-3 text-gray-400">:</span>{viewedPartner.namaPetani}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1.5 flex items-center">Kelompok Tani</div>
            <div className="col-span-8 py-1.5 font-bold text-emerald-600 flex items-center">
              <span className="mr-3 text-gray-400">:</span>
              <span className="badge rounded font-bold px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700">
                {viewedPartner.kelompokTani}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Komoditas Utama</div>
            <div className="col-span-8 py-1 font-bold text-gray-800 flex items-center">
              <span className="mr-3 text-gray-400">:</span>{viewedPartner.komoditasUtama}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">No. KTP</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center font-mono">
              <span className="mr-3 text-gray-400">:</span>{viewedPartner.noKtp || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">No. Telepon</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center font-mono">
              <span className="mr-3 text-gray-400">:</span>{viewedPartner.noTelepon || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Alamat</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-3 text-gray-400">:</span>
              <span className="flex-1">{viewedPartner.alamat || '-'}</span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Luas Lahan Total</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-3 text-gray-400">:</span>
              {(() => {
                const partnerGreenhouses = viewedPartner.greenhouses || greenhouses.filter(g => g.partnerId === viewedPartner.id || g.petaniMitra === viewedPartner.namaPetani);
                const totalLuas = partnerGreenhouses.reduce((sum, g) => sum + Number(g.luas || 0), 0);
                return totalLuas.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              })()} Ha
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Pengalaman Bertani</div>
            <div className="col-span-8 py-1 text-gray-700 flex items-center">
              <span className="mr-3 text-gray-400">:</span>{viewedPartner.pengalaman} tahun
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Bergabung</div>
            <div className="col-span-8 py-1 text-gray-700 flex items-center">
              <span className="mr-3 text-gray-400">:</span>{viewedPartner.tglBergabung ? new Date(viewedPartner.tglBergabung).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-3 text-gray-400">:</span>
              <span className={`badge rounded font-bold px-2 py-0.5 text-xs ${viewedPartner.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
                }`}>
                {viewedPartner.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              </span>
            </div>
          </div>
        );
      case 'lahan':
        return (
          <div className="space-y-4 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <i className="ri-community-line text-emerald-600 text-sm"></i>
              Daftar Greenhouse/Lahan yang Dikelola ({managedLahan.length}):
            </p>
            {managedLahan.length > 0 ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {managedLahan.map((lahan) => (
                  <div key={lahan.id} className="p-3.5 bg-white border border-defaultborder hover:border-emerald-500/50 rounded-lg shadow-sm hover:shadow transition-all duration-200">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-2 mb-2.5">
                      <div>
                        <h4 className="font-bold text-gray-800 text-[13px]">{lahan.namaLahan}</h4>
                        <span className="text-[10px] text-textmuted font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200/50 mt-0.5 inline-block">{lahan.kodeLahan}</span>
                      </div>
                      <span className={`badge rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        lahan.status === 'Aktif'
                          ? 'bg-success/10 text-success'
                          : lahan.status === 'Maintenance'
                            ? 'bg-danger/10 text-danger'
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        {lahan.status}
                      </span>
                    </div>
                    
                    {/* Grid Details */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-gray-600">
                      <div>
                        <span className="text-textmuted block text-[10px] font-semibold">Jenis Lahan</span>
                        <span className="font-semibold text-gray-800">{lahan.jenisLahan}</span>
                      </div>
                      <div>
                        <span className="text-textmuted block text-[10px] font-semibold">Luas Lahan</span>
                        <span className="font-semibold text-emerald-600">{Number(lahan.luas).toFixed(2)} Ha</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-textmuted block text-[10px] font-semibold">Komoditas Utama</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                          <i className="ri-leaf-line text-emerald-500"></i>
                          {lahan.commodity?.namaKomoditas || lahan.komoditasUtama || '-'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-textmuted block text-[10px] font-semibold">Lokasi</span>
                        <span className="font-medium text-gray-700 leading-relaxed block text-wrap">
                          <strong>{lahan.lokasi}</strong>{lahan.detailLokasi ? ` - ${lahan.detailLokasi}` : ''}
                        </span>
                      </div>
                      {lahan.koordinat && (
                        <div className="col-span-2">
                          <span className="text-textmuted block text-[10px] font-semibold">Koordinat</span>
                          <span className="font-mono text-gray-600 flex items-center gap-1">
                            <i className="ri-map-pin-2-line text-red-500"></i>
                            {lahan.koordinat}
                          </span>
                        </div>
                      )}
                      {lahan.keterangan && (
                        <div className="col-span-2 border-t border-gray-100 pt-2 mt-1">
                          <span className="text-textmuted block text-[10px] font-semibold">Keterangan</span>
                          <p className="text-gray-500 italic mt-0.5 leading-relaxed">{lahan.keterangan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg bg-gray-50/30">
                <i className="ri-treasure-map-line text-3xl mb-1.5 block text-gray-300"></i>
                Belum ada Greenhouse/Lahan yang dihubungkan ke mitra ini.
              </div>
            )}
          </div>
        );
      case 'produksi':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Riwayat Panen & Produksi (2 Musim Terakhir):</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center bg-gray-50/50">
                <div>
                  <p className="font-bold text-gray-800">Panen Padi Unggul Inpari 32 - MT I 2025</p>
                  <span className="text-[10px] text-textmuted">Diserahkan ke Gudang Pusat Lamongan &bull; 10 Mei 2025</span>
                </div>
                <span className="font-bold text-emerald-600">8.40 Ton</span>
              </div>
              <div className="p-3 flex justify-between items-center bg-gray-50/50">
                <div>
                  <p className="font-bold text-gray-800">Panen Jagung Hibrida P-21 - MT II 2024</p>
                  <span className="text-[10px] text-textmuted">Diserahkan ke Gudang Pusat Jember &bull; 12 Nov 2024</span>
                </div>
                <span className="font-bold text-emerald-600">7.20 Ton</span>
              </div>
            </div>
          </div>
        );
      case 'catatan':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Catatan Kinerja & Riwayat Evaluasi:</p>
            <div className="border border-defaultborder rounded p-3 bg-gray-50/50 text-gray-600 leading-relaxed">
              <p className="mb-2"><strong>Evaluasi Musim Tanam I 2025:</strong></p>
              <p className="text-[11px] mb-3">
                Kinerja petani sangat baik. Pemeliharaan lahan di Greenhouse dilakukan secara disiplin. Hasil produktivitas padi melampaui target awal sebesar 12%. Komunikasi dengan tim lapangan sangat kooperatif.
              </p>
              <div className="border-t border-gray-200 pt-2.5 flex justify-between text-[10px] text-textmuted">
                <span>Diperbarui oleh: Supervisor Lapangan</span>
                <span>Tgl: 18/05/2025</span>
              </div>
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
      <Seo title="Petani Mitra" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Petani Mitra"
        activepage="Petani Mitra"
        description="Kelola data petani mitra perusahaan"
        customButton={
          <SpkButton
            {...({
              onclickfunc: handleOpenAddModal,
              style: { backgroundColor: '#078836', color: 'white' },
              className: "hover:bg-[#06732d] hover:text-white",
              customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
            } as any)}
          >
            <i className="ri-add-line text-lg"></i> Tambah Petani Mitra
          </SpkButton>
        }
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedPartner ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari petani mitra..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={partners}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data petani mitra yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel Drawer) */}
        {viewedPartner && (
          <div className="xl:col-span-4 col-span-12 animate-fade-in-right">
            <DetailPanel
              title="Detail Petani Mitra"
              onClose={() => setViewedPartner(null)}
              imageUrl={viewedPartner.image}
              imageAlt={viewedPartner.namaPetani}
              statusLabel={viewedPartner.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              statusBgClass={viewedPartner.status === 'Aktif' ? 'bg-success' : 'bg-danger'}
              primaryTitle={viewedPartner.namaPetani}
              secondaryTitle={`Kode Petani: ${viewedPartner.kodePetani}`}
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
        title={modalMode === 'add' ? 'Tambah Petani Mitra' : 'Edit Data Petani Mitra'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Petani *</label>
            <input
              type="text"
              value={formValues.kodePetani}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodePetani: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="PM-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lengkap *</label>
            <input
              type="text"
              value={formValues.namaPetani}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaPetani: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Budi Santoso"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kelompok Tani *</label>
            <input
              type="text"
              value={formValues.kelompokTani}
              onChange={(e) => setFormValues(prev => ({ ...prev, kelompokTani: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Karya Tani"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas Utama *</label>
            <select
              value={formValues.komoditasUtama}
              onChange={(e) => setFormValues(prev => ({ ...prev, komoditasUtama: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              required
              disabled={isSubmitLoading}
            >
              {komoditasOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">No. KTP</label>
            <input
              type="text"
              value={formValues.noKtp}
              onChange={(e) => setFormValues(prev => ({ ...prev, noKtp: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="3271xxxxxxxxxxxx"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">No. Telepon</label>
            <input
              type="text"
              value={formValues.noTelepon}
              onChange={(e) => setFormValues(prev => ({ ...prev, noTelepon: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="08xxxxxxxxxx"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Luas Lahan (Ha)</label>
            <input
              type="number"
              step="0.01"
              value={formValues.luasLahan}
              onChange={(e) => setFormValues(prev => ({ ...prev, luasLahan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="1.50"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Pengalaman (tahun)</label>
            <input
              type="number"
              value={formValues.pengalaman}
              onChange={(e) => setFormValues(prev => ({ ...prev, pengalaman: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="10"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tgl Bergabung</label>
            <input
              type="date"
              value={formValues.tglBergabung}
              onChange={(e) => setFormValues(prev => ({ ...prev, tglBergabung: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Partner['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>
          </div>
        </div>

        <div>
          {/* Profile image upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Foto Profil Petani (Maks. 5MB)</label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md border border-defaultborder overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center relative group">
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      disabled={isSubmitLoading}
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </>
                ) : (
                  <i className="ri-user-line text-lg text-gray-300"></i>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  className="block w-full text-xs text-gray-500
                    file:mr-3 file:py-1 file:px-2
                    file:rounded-md file:border-0
                    file:text-[10px] file:font-semibold
                    file:bg-emerald-50 file:text-emerald-700
                    hover:file:bg-emerald-100
                    cursor-pointer disabled:opacity-50"
                  disabled={isSubmitLoading}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat Lengkap</label>
          <textarea
            value={formValues.alamat}
            onChange={(e) => setFormValues(prev => ({ ...prev, alamat: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Dusun/Kampung, RT/RW, Desa, Kecamatan, Kabupaten, Provinsi..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
