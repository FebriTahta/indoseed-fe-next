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
  deskripsi: string;
  status: 'Aktif' | 'Tidak Aktif';
  image: string;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
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

export default function KomoditasPage() {
  const router = useRouter();

  // Page Auth & Initial Load States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Main list states
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Total stats calculations
  const [allCommoditiesForStats, setAllCommoditiesForStats] = useState<Commodity[]>([]);

  // Filters State
  const [search, setSearch] = useState('');
  const [filterKategori, setFilterKategori] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Viewed Detail State
  const [viewedCommodity, setViewedCommodity] = useState<Commodity | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'riwayat'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [formValues, setFormValues] = useState({
    id: '',
    kodeKomoditas: '',
    namaKomoditas: '',
    kategori: 'Serealia',
    deskripsi: '',
    status: 'Aktif' as Commodity['status'],
    image: ''
  });

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Options
  const kategoriOptions = [
    { value: 'Serealia', label: 'Serealia' },
    { value: 'Legum', label: 'Legum' },
    { value: 'Umbi', label: 'Umbi' },
    { value: 'Hortikultura', label: 'Hortikultura' }
  ];

  const statusOptions = [
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Non Aktif' }
  ];

  // Helper: Authorization headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // API Call: Fetch list of commodities
  const fetchCommoditiesList = async (pageToFetch = currentPage) => {
    setIsTableLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(pageToFetch));
      queryParams.append('pageSize', String(pageSize));
      if (search) queryParams.append('search', search);
      if (filterKategori) queryParams.append('kategori', filterKategori.value);
      if (filterStatus) queryParams.append('status', filterStatus.value);

      const response = await fetch(`${baseUrl}/master/commodity?${queryParams.toString()}`, {
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
        setCommodities(result.data || []);
        setTotalRecords(result.pagination?.totalItems || 0);
        setTotalPages(result.pagination?.totalPages || 0);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Gagal mengambil data komoditas');
    } finally {
      setIsTableLoading(false);
    }
  };

  // API Call: Fetch all records (for stats calculations)
  const fetchAllCommoditiesForStats = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/commodity?pageSize=100000`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setAllCommoditiesForStats(result.data || []);
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

        await fetchAllCommoditiesForStats();
        await fetchCommoditiesList(1);
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
      fetchCommoditiesList(currentPage);
    }
  }, [search, filterKategori, filterStatus, currentPage, pageSize]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = allCommoditiesForStats.length;
    const active = allCommoditiesForStats.filter(c => c.status === 'Aktif').length;
    const inactive = allCommoditiesForStats.filter(c => c.status !== 'Aktif').length;
    const uniqueCategories = new Set(allCommoditiesForStats.map(c => c.kategori)).size;

    return {
      total,
      active,
      inactive,
      categories: uniqueCategories
    };
  }, [allCommoditiesForStats]);

  const statItems: StatItem[] = useMemo(() => [
    {
      title: 'Total Komoditas',
      value: stats.total,
      subtitle: 'Semua komoditas',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Aktif',
      value: stats.active,
      subtitle: 'Komoditas aktif',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Non Aktif',
      value: stats.inactive,
      subtitle: 'Komoditas non aktif',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Kategori',
      value: stats.categories,
      subtitle: 'Kategori komoditas',
      icon: 'ri-grid-line',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ], [stats]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setFilterKategori(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setImageFile(null);
    setPreviewUrl('');
    setFormValues({
      id: '',
      kodeKomoditas: `KOM-${String(allCommoditiesForStats.length + 1).padStart(3, '0')}`,
      namaKomoditas: '',
      kategori: 'Serealia',
      deskripsi: '',
      status: 'Aktif',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (commodity: Commodity) => {
    setModalMode('edit');
    setImageFile(null);
    setPreviewUrl(commodity.image || '');

    setFormValues({
      id: commodity.id,
      kodeKomoditas: commodity.kodeKomoditas,
      namaKomoditas: commodity.namaKomoditas,
      kategori: commodity.kategori,
      deskripsi: commodity.deskripsi || '',
      status: commodity.status,
      image: commodity.image || ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data (Create & Update)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaKomoditas.trim()) {
      toast.error('Nama komoditas harus diisi');
      return;
    }
    if (!formValues.kodeKomoditas.trim()) {
      toast.error('Kode komoditas harus diisi');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

      const formData = new FormData();
      formData.append('kodeKomoditas', formValues.kodeKomoditas);
      formData.append('namaKomoditas', formValues.namaKomoditas);
      formData.append('kategori', formValues.kategori);
      formData.append('deskripsi', formValues.deskripsi || '');
      formData.append('status', formValues.status);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (modalMode === 'add') {
        response = await fetch(`${baseUrl}/master/commodity`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
      } else {
        response = await fetch(`${baseUrl}/master/commodity/${formValues.id}`, {
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
        toast.success('Komoditas baru berhasil ditambahkan');
      } else {
        toast.success('Data komoditas berhasil diperbarui');
        // Update viewed detail panel if currently viewing this commodity
        if (viewedCommodity && viewedCommodity.id === formValues.id) {
          setViewedCommodity(result.data);
        }
      }

      setIsModalOpen(false);
      await fetchAllCommoditiesForStats();
      await fetchCommoditiesList(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // Delete Commodity
  const handleDeleteCommodity = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data komoditas ini?')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${baseUrl}/master/commodity/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        const result = await response.json();
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Gagal menghapus data');
        }

        if (viewedCommodity && viewedCommodity.id === id) {
          setViewedCommodity(null);
        }
        toast.success('Data komoditas berhasil dihapus');

        await fetchAllCommoditiesForStats();
        await fetchCommoditiesList(currentPage);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Terjadi kesalahan saat menghapus data');
      }
    }
  };

  // Toggle Commodity Status
  const handleToggleStatus = async (commodity: Commodity) => {
    const newStatus: Commodity['status'] = commodity.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setIsDetailLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

      const formData = new FormData();
      formData.append('status', newStatus);

      const response = await fetch(`${baseUrl}/master/commodity/${commodity.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      });

      const result = await response.json();
      if (!response.ok || result.status === 'error') {
        throw new Error(result.message || 'Gagal merubah status');
      }

      setViewedCommodity(result.data);
      toast.success(`Status komoditas berhasil diubah menjadi ${newStatus === 'Aktif' ? 'Aktif' : 'Non Aktif'}`);

      await fetchCommoditiesList(currentPage);
      await fetchAllCommoditiesForStats();
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
  const handleViewDetail = async (commodity: Commodity) => {
    setViewedCommodity(commodity);
    setActiveDetailTab('info');
    setIsDetailLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/master/commodity/${commodity.id}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setViewedCommodity(result.data);
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
      value: filterKategori,
      onChange: (val: any) => { setFilterKategori(val); setCurrentPage(1); },
      options: kategoriOptions,
      placeholder: 'Kategori',
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
  const tableHeaders = ['No', 'Kode Komoditas', 'Nama Komoditas', 'Kategori', 'Deskripsi', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Commodity, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedCommodity && viewedCommodity.id === item.id;
    const categoryColor = CATEGORY_COLORS[item.kategori] || 'gray';
    const categoryIcon = CATEGORY_ICONS[item.kategori] || 'ri-seedling-line';

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeKomoditas}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.namaKomoditas} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-${categoryColor}/10 text-${categoryColor}`}>
                <i className={`${categoryIcon} text-lg`}></i>
              </div>
            )}
          </div>
          <span className="text-gray-800 font-semibold">{item.namaKomoditas}</span>
        </td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold bg-${categoryColor}/10 text-${categoryColor}`}>
            {item.kategori}
          </span>
        </td>
        <td className="p-4 max-w-xs truncate text-gray-500" title={item.deskripsi}>
          {item.deskripsi || '-'}
        </td>
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
              title="Lihat Detail Komoditas"
            >
              <i className="ri-eye-line text-lg"></i>
            </button>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Komoditas"
            >
              <i className="ri-edit-line text-lg"></i>
            </button>
            <button
              onClick={() => handleDeleteCommodity(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Hapus Komoditas"
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
    { id: 'riwayat', label: 'Riwayat' }
  ];

  const detailActions: DetailAction[] = viewedCommodity ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedCommodity),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewedCommodity.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedCommodity),
      icon: 'ri-shut-down-line',
      className: viewedCommodity.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-55'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedCommodity) return null;
    switch (tabId) {
      case 'info':
        const categoryColor = CATEGORY_COLORS[viewedCommodity.kategori] || 'gray';
        const categoryIcon = CATEGORY_ICONS[viewedCommodity.kategori] || 'ri-seedling-line';

        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kode Komoditas</div>
            <div className="col-span-8 py-1 font-mono text-gray-800 flex items-center">
              <span className="mr-2 text-gray-700">:</span>{viewedCommodity.kodeKomoditas}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Nama Komoditas</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.namaKomoditas}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kategori</div>
            <div className="col-span-8 py-1 font-semibold text-emerald-600 flex items-center gap-1">
              <span className="mr-2 text-gray-700">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] bg-${categoryColor}/10 text-${categoryColor}`}>
                {viewedCommodity.kategori}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Deskripsi</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-2">:</span>{viewedCommodity.deskripsi || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewedCommodity.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
                }`}>
                {viewedCommodity.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.tglDibuat ? new Date(viewedCommodity.tglDibuat).toLocaleDateString('id-ID') + ' ' + new Date(viewedCommodity.tglDibuat).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.dibuatOleh || 'Admin'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Diubah</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.tglDiubah ? new Date(viewedCommodity.tglDiubah).toLocaleDateString('id-ID') + ' ' + new Date(viewedCommodity.tglDiubah).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Diubah Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.diubahOleh || 'Admin'}
            </div>

            {/* <div className="col-span-12 py-2">
              <p className="font-semibold text-textmuted mb-2">Gambar / Ikon</p>
              <div className="w-20 h-20 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                {viewedCommodity.image ? (
                  <img src={viewedCommodity.image} alt={viewedCommodity.namaKomoditas} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-${categoryColor}/10 text-${categoryColor}`}>
                    <i className={`${categoryIcon} text-2xl`}></i>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        );
      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Riwayat Produktivitas Musim:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Diisi Apa Ini</p>
                  <span className="text-[10px] text-textmuted">Hasil panen di seluruh unit greenhouse memuaskan</span>
                </div>
                <span className="font-bold text-emerald-600">850 Kg</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Musim Tanam Genap 2024</p>
                  <span className="text-[10px] text-textmuted">Suhu rata-rata stabil, produktivitas normal</span>
                </div>
                <span className="font-bold text-emerald-600">780 Kg</span>
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
      <Seo title="Komoditas" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Komoditas"
        activepage="Komoditas"
        description="Kelola master data komoditas perusahaan"
        customButton={
          <SpkButton
            {...({
              onclickfunc: handleOpenAddModal,
              style: { backgroundColor: '#078836', color: 'white' },
              className: "hover:bg-[#06732d] hover:text-white",
              customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
            } as any)}
          >
            <i className="ri-add-line text-lg"></i> Tambah Komoditas
          </SpkButton>
        }
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedCommodity ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
            searchPlaceholder="Cari komoditas..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={commodities}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data komoditas yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewedCommodity && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Komoditas"
              onClose={() => setViewedCommodity(null)}
              imageUrl={viewedCommodity.image}
              imageAlt={viewedCommodity.namaKomoditas}
              statusLabel={viewedCommodity.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              statusBgClass={viewedCommodity.status === 'Aktif' ? 'bg-success' : 'bg-danger'}
              primaryTitle={viewedCommodity.namaKomoditas}
              secondaryTitle={viewedCommodity.kodeKomoditas}
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
        title={modalMode === 'add' ? 'Tambah Komoditas Baru' : 'Ubah Data Komoditas'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Komoditas</label>
            <input
              type="text"
              value={formValues.kodeKomoditas}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodeKomoditas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="KOM-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Komoditas</label>
            <input
              type="text"
              value={formValues.namaKomoditas}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaKomoditas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Padi"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori</label>
            <select
              value={formValues.kategori}
              onChange={(e) => setFormValues(prev => ({ ...prev, kategori: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Serealia">Serealia</option>
              <option value="Legum">Legum</option>
              <option value="Umbi">Umbi</option>
              <option value="Hortikultura">Hortikultura</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Commodity['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Non Aktif</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea
            value={formValues.deskripsi}
            onChange={(e) => setFormValues(prev => ({ ...prev, deskripsi: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Keterangan mengenai komoditas ini..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
