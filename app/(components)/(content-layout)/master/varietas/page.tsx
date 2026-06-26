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

interface Commodity {
  id: string;
  kodeKomoditas: string;
  namaKomoditas: string;
  kategori: string;
  status: string;
}

interface Variety {
  id: string;
  kodeVarietas: string;
  namaVarietas: string;
  commodityId: string;
  asalPemulia: string;
  tahunRilis: number | null;
  deskripsi: string;
  umurTanam: string;
  tinggiTanaman: string;
  bentukBiji: string;
  warnaGabah: string;
  potensiHasil: string;
  anjuranDataran: string;
  status: 'Aktif' | 'Tidak Aktif';
  image: string;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
  commodity: Commodity;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Serealia': 'success',
  'Legum': 'warning',
  'Umbi': 'primary',
  'Hortikultura': 'danger'
};

const CATEGORY_ICONS: Record<string, string> = {
  'Serealia': 'ri-leaf-line',
  'Legum': 'ri-seedling-line',
  'Umbi': 'ri-plant-line',
  'Hortikultura': 'ri-seedling-fill'
};

export default function VarietasPage() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Total stats calculations
  const [allVarietiesForStats, setAllVarietiesForStats] = useState<Variety[]>([]);

  // Commodities dropdown options
  const [commoditiesOptions, setCommoditiesOptions] = useState<{ value: string, label: string }[]>([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterCommodity, setFilterCommodity] = useState<any>(null);

  // Debounce search input and reset pagination page on change
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State
  const [viewedVariety, setViewedVariety] = useState<Variety | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'karakteristik' | 'ketahanan' | 'riwayat'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const [formValues, setFormValues] = useState({
    id: '',
    kodeVarietas: '',
    namaVarietas: '',
    commodityId: '',
    asalPemulia: '',
    tahunRilis: '',
    deskripsi: '',
    umurTanam: '',
    tinggiTanaman: '',
    bentukBiji: '',
    warnaGabah: '',
    potensiHasil: '',
    anjuranDataran: '',
    status: 'Aktif' as Variety['status'],
    image: ''
  });

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Non Aktif' }
  ];

  // Helper: Authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // API Call: Fetch list of active commodities for selects
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

          // Pre-select first commodity option in form if empty
          if (options.length > 0 && !formValues.commodityId) {
            setFormValues(prev => ({ ...prev, commodityId: options[0].value }));
          }
        }
      }
    } catch (err) {
      console.error('Error fetching commodities options:', err);
    }
  };

  // API Call: Fetch list of varieties
  const fetchVarietiesList = async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(pageToFetch));
      queryParams.append('pageSize', String(pageSize));
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (filterCommodity) queryParams.append('commodityId', filterCommodity.value);
      if (filterStatus) queryParams.append('status', filterStatus.value);

      const response = await fetch(`${baseUrl}/master/variety?${queryParams.toString()}`, {
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
        setVarieties(result.data || []);
        setTotalRecords(result.pagination?.totalItems || 0);
        setTotalPages(result.pagination?.totalPages || 0);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Gagal mengambil data varietas');
    } finally {
      setIsTableLoading(false);
    }
  };

  // API Call: Fetch all records (for stats calculations)
  const fetchAllVarietiesForStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/variety?pageSize=100000`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setAllVarietiesForStats(result.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
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

        await fetchCommoditiesOptions();
        await fetchAllVarietiesForStats();
        await fetchVarietiesList(1);
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
      fetchVarietiesList(currentPage);
    }
  }, [debouncedSearch, filterCommodity, filterStatus, currentPage, pageSize]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = allVarietiesForStats.length;
    const active = allVarietiesForStats.filter(v => v.status === 'Aktif').length;
    const inactive = allVarietiesForStats.filter(v => v.status !== 'Aktif').length;
    const uniqueCommodities = new Set(allVarietiesForStats.map(v => v.commodityId)).size;

    return {
      total,
      active,
      inactive,
      commodities: uniqueCommodities
    };
  }, [allVarietiesForStats]);

  const statItems: StatItem[] = useMemo(() => [
    {
      title: 'Total Varietas',
      value: stats.total,
      subtitle: 'Semua varietas',
      icon: 'ri-seedling-fill',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: 'Varietas aktif',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: 'Varietas non aktif',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Komoditas',
      value: stats.commodities,
      subtitle: 'Komoditas berbeda',
      icon: 'ri-grid-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ], [stats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setFilterCommodity(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setImageFile(null);
    setPreviewUrl('');

    const defaultCommodityId = commoditiesOptions.length > 0 ? commoditiesOptions[0].value : '';

    setFormValues({
      id: '',
      kodeVarietas: `VAR-${String(allVarietiesForStats.length + 1).padStart(3, '0')}`,
      namaVarietas: '',
      commodityId: defaultCommodityId,
      asalPemulia: '',
      tahunRilis: '',
      deskripsi: '',
      umurTanam: '',
      tinggiTanaman: '',
      bentukBiji: '',
      warnaGabah: '',
      potensiHasil: '',
      anjuranDataran: '',
      status: 'Aktif',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (variety: Variety) => {
    setModalMode('edit');
    setImageFile(null);
    setPreviewUrl(variety.image || '');

    setFormValues({
      id: variety.id,
      kodeVarietas: variety.kodeVarietas,
      namaVarietas: variety.namaVarietas,
      commodityId: variety.commodityId,
      asalPemulia: variety.asalPemulia || '',
      tahunRilis: variety.tahunRilis !== null ? String(variety.tahunRilis) : '',
      deskripsi: variety.deskripsi || '',
      umurTanam: variety.umurTanam || '',
      tinggiTanaman: variety.tinggiTanaman || '',
      bentukBiji: variety.bentukBiji || '',
      warnaGabah: variety.warnaGabah || '',
      potensiHasil: variety.potensiHasil || '',
      anjuranDataran: variety.anjuranDataran || '',
      status: variety.status,
      image: variety.image || ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaVarietas.trim()) {
      toast.error('Nama varietas harus diisi');
      return;
    }
    if (!formValues.kodeVarietas.trim()) {
      toast.error('Kode varietas harus diisi');
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
      formData.append('kodeVarietas', formValues.kodeVarietas);
      formData.append('namaVarietas', formValues.namaVarietas);
      formData.append('commodityId', formValues.commodityId);
      formData.append('asalPemulia', formValues.asalPemulia);
      formData.append('tahunRilis', formValues.tahunRilis);
      formData.append('deskripsi', formValues.deskripsi);
      formData.append('umurTanam', formValues.umurTanam);
      formData.append('tinggiTanaman', formValues.tinggiTanaman);
      formData.append('bentukBiji', formValues.bentukBiji);
      formData.append('warnaGabah', formValues.warnaGabah);
      formData.append('potensiHasil', formValues.potensiHasil);
      formData.append('anjuranDataran', formValues.anjuranDataran);
      formData.append('status', formValues.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (modalMode === 'add') {
        response = await fetch(`${baseUrl}/master/variety`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
      } else {
        response = await fetch(`${baseUrl}/master/variety/${formValues.id}`, {
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
        toast.success('Varietas baru berhasil ditambahkan');
      } else {
        toast.success('Data varietas berhasil diperbarui');
        // Update viewed detail panel if currently viewing this variety
        if (viewedVariety && viewedVariety.id === formValues.id) {
          setViewedVariety(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllVarietiesForStats();
      await fetchVarietiesList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Variety
  const handleDeleteVariety = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data varietas ini?')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${baseUrl}/master/variety/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        const result = await response.json();
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedVariety && viewedVariety.id === id) {
          setViewedVariety(null);
        }
        toast.success('Data varietas berhasil dihapus');

        await fetchAllVarietiesForStats();
        await fetchVarietiesList(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Variety Status
  const handleToggleStatus = async (variety: Variety) => {
    const newStatus: Variety['status'] = variety.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

      const formData = new FormData();
      formData.append('status', newStatus);

      const response = await fetch(`${baseUrl}/master/variety/${variety.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      });

      const result = await response.json();
      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewedVariety(result.data);
      toast.success(`Status varietas berhasil diubah menjadi ${newStatus === 'Aktif' ? 'Aktif' : 'Non Aktif'}`);

      await fetchVarietiesList(currentPage);
      await fetchAllVarietiesForStats();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat mengubah status');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleExportData = () => {
    toast.success('Mengekspor data varietas... File Anda akan segera diunduh.');
  };

  // Viewed Detail loading handler
  const handleViewDetail = async (variety: Variety) => {
    setViewedVariety(variety);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/variety/${variety.id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setViewedVariety(result.data);
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
      value: filterCommodity,
      onChange: (val: any) => { setFilterCommodity(val); setCurrentPage(1); },
      options: commoditiesOptions,
      placeholder: 'Komoditas',
      widthClass: 'sm:w-44'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-40'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Varietas', 'Nama Varietas', 'Komoditas', 'Asal / Pemulia', 'Tahun Rilis', 'Status', 'Deskripsi Singkat', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Variety, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedVariety && viewedVariety.id === item.id;
    const categoryColor = CATEGORY_COLORS[item.commodity.kategori] || 'gray';
    const categoryIcon = CATEGORY_ICONS[item.commodity.kategori] || 'ri-seedling-line';

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeVarietas}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.namaVarietas} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-${categoryColor}/10 text-${categoryColor}`}>
                <i className={`${categoryIcon} text-lg`}></i>
              </div>
            )}
          </div>
          <span className="text-gray-800 font-semibold">{item.namaVarietas}</span>
        </td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold bg-${categoryColor}/10 text-${categoryColor}`}>
            {item.commodity.namaKomoditas}
          </span>
        </td>
        <td className="p-4 text-gray-600 font-medium">{item.asalPemulia || '-'}</td>
        <td className="p-4 text-gray-600 font-medium">{item.tahunRilis || '-'}</td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : 'bg-danger/10 text-danger'
            }`}>
            {item.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
          </span>
        </td>
        <td className="p-4 max-w-xs truncate text-gray-500" title={item.deskripsi}>
          {item.deskripsi || '-'}
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleViewDetail(item)}
              className="text-gray-400 hover:text-emerald-600 transition-colors"
              title="Lihat Detail Varietas"
            >
              <i className="ri-eye-line text-lg"></i>
            </button>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Varietas"
            >
              <i className="ri-edit-line text-lg"></i>
            </button>
            <button
              onClick={() => handleDeleteVariety(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Hapus Varietas"
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
    { id: 'karakteristik', label: 'Karakteristik' },
    { id: 'ketahanan', label: 'Ketahanan' },
    { id: 'riwayat', label: 'Riwayat' }
  ];

  const detailActions: DetailAction[] = viewedVariety ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedVariety),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewedVariety.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedVariety),
      icon: 'ri-shut-down-line',
      className: viewedVariety.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedVariety) return null;
    const categoryColor = CATEGORY_COLORS[viewedVariety.commodity.kategori] || 'gray';

    switch (tabId) {
      case 'info':
        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Komoditas</div>
            <div className="col-span-8 py-1 font-semibold text-emerald-600 flex items-center gap-1">
              <span className="mr-2 text-gray-700">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] bg-${categoryColor}/10 text-${categoryColor}`}>
                {viewedVariety.commodity.namaKomoditas}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Asal / Pemulia</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.asalPemulia || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tahun Rilis</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.tahunRilis || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Deskripsi</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-2">:</span>{viewedVariety.deskripsi || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewedVariety.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
                }`}>
                {viewedVariety.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.tglDibuat ? new Date(viewedVariety.tglDibuat).toLocaleDateString('id-ID') + ' ' + new Date(viewedVariety.tglDibuat).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.dibuatOleh || 'Admin'}
            </div>
          </div>
        );
      case 'karakteristik':
        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Umur Tanam</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.umurTanam || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tinggi Tanaman</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.tinggiTanaman || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Bentuk Biji</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.bentukBiji || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Warna Gabah</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.warnaGabah || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Potensi Hasil</div>
            <div className="col-span-8 py-1 text-emerald-600 flex items-center font-bold">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.potensiHasil || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Anjuran Dataran</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.anjuranDataran || '-'}
            </div>
          </div>
        );
      case 'ketahanan':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Informasi Hama & Ketahanan Penyakit:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder bg-gray-50/50">
              <div className="p-3">
                <span className="font-bold text-emerald-600 block mb-1">Ketahanan Hama</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Tahan terhadap Wereng Batang Coklat (WBC) biotipe 1 dan 2, agak tahan terhadap biotipe 3.
                </p>
              </div>
              <div className="p-3">
                <span className="font-bold text-emerald-600 block mb-1">Ketahanan Penyakit</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Tahan terhadap Hawar Daun Bakteri (HDB) patotipe III, rentan patotipe IV dan VIII. Tahan terhadap penyakit Blas ras 033.
                </p>
              </div>
              <div className="p-3">
                <span className="font-bold text-orange-600 block mb-1">Catatan Kritis</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Kurang disarankan ditanam pada lahan endemik tungro. Memerlukan sanitasi lahan yang baik setelah masa panen.
                </p>
              </div>
            </div>
          </div>
        );
      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Riwayat Distribusi Produksi (Musim Terakhir):</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Distribusi Benih Utama - MT I 2025</p>
                  <span className="text-[10px] text-textmuted">Disalurkan ke unit Greenhouse Mitra A & B</span>
                </div>
                <span className="font-bold text-emerald-600">1,250 Kg</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Distribusi Benih Utama - MT II 2024</p>
                  <span className="text-[10px] text-textmuted">Disalurkan ke unit Greenhouse Mitra C</span>
                </div>
                <span className="font-bold text-emerald-600">950 Kg</span>
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
      <Seo title="Varietas" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Varietas"
        activepage="Varietas"
        description="Kelola master data varietas benih"
        customButton={
          <SpkButton
            {...({
              onclickfunc: handleOpenAddModal,
              style: { backgroundColor: '#078836', color: 'white' },
              className: "hover:bg-[#06732d] hover:text-white",
              customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
            } as any)}
          >
            <i className="ri-add-line text-lg"></i> Tambah Varietas
          </SpkButton>
        }
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedVariety ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari varietas..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={varieties}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data varietas yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewedVariety && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Varietas"
              onClose={() => setViewedVariety(null)}
              imageUrl={viewedVariety.image}
              imageAlt={viewedVariety.namaVarietas}
              statusLabel={viewedVariety.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              statusBgClass={viewedVariety.status === 'Aktif' ? 'bg-success' : 'bg-danger'}
              primaryTitle={viewedVariety.namaVarietas}
              secondaryTitle={`Kode Varietas: ${viewedVariety.kodeVarietas}`}
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
        title={modalMode === 'add' ? 'Tambah Varietas Baru' : 'Ubah Data Varietas'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Varietas</label>
            <input
              type="text"
              value={formValues.kodeVarietas}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodeVarietas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="VAR-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Varietas</label>
            <input
              type="text"
              value={formValues.namaVarietas}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaVarietas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Inpari 32"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas</label>
            <select
              value={formValues.commodityId}
              onChange={(e) => setFormValues(prev => ({ ...prev, commodityId: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              required
              disabled={isSubmitLoading}
            >
              <option value="" disabled>Pilih Komoditas</option>
              {commoditiesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Asal / Pemulia</label>
            <input
              type="text"
              value={formValues.asalPemulia}
              onChange={(e) => setFormValues(prev => ({ ...prev, asalPemulia: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: BB Padi"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tahun Rilis</label>
            <input
              type="number"
              value={formValues.tahunRilis}
              onChange={(e) => setFormValues(prev => ({ ...prev, tahunRilis: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 2014"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Umur Tanam</label>
            <input
              type="text"
              value={formValues.umurTanam}
              onChange={(e) => setFormValues(prev => ({ ...prev, umurTanam: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 115 - 120 hari"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Tanaman</label>
            <input
              type="text"
              value={formValues.tinggiTanaman}
              onChange={(e) => setFormValues(prev => ({ ...prev, tinggiTanaman: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 95 - 105 cm"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Bentuk Biji</label>
            <input
              type="text"
              value={formValues.bentukBiji}
              onChange={(e) => setFormValues(prev => ({ ...prev, bentukBiji: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Ramping"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Warna Gabah</label>
            <input
              type="text"
              value={formValues.warnaGabah}
              onChange={(e) => setFormValues(prev => ({ ...prev, warnaGabah: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Kuning bersih"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Potensi Hasil</label>
            <input
              type="text"
              value={formValues.potensiHasil}
              onChange={(e) => setFormValues(prev => ({ ...prev, potensiHasil: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 7 - 8 ton/ha"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Anjuran Dataran</label>
            <input
              type="text"
              value={formValues.anjuranDataran}
              onChange={(e) => setFormValues(prev => ({ ...prev, anjuranDataran: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Rendah - Menengah"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Variety['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Non Aktif</option>
            </select>
          </div>
        </div>
        <div>
          {/* Image file upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Gambar Varietas / Benih (Maks. 5MB)</label>
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
                  <i className="ri-image-line text-lg text-gray-300"></i>
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
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi / Keterangan</label>
          <textarea
            value={formValues.deskripsi}
            onChange={(e) => setFormValues(prev => ({ ...prev, deskripsi: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Keterangan singkat mengenai varietas ini..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
