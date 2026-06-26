"use client"
import React, { useState, useMemo, Fragment } from 'react';
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
  tglDibuat: string;
  dibuatOleh: string;
  keterangan: string;
  image: string;
}

const INITIAL_LANDS: Land[] = [
  {
    id: '1',
    kodeLahan: 'GH-001',
    namaLahan: 'Greenhouse A',
    jenisLahan: 'Greenhouse',
    komoditasUtama: 'Tomat',
    komoditasColor: 'emerald',
    komoditasIcon: 'ri-leaf-line',
    lokasi: 'Bogor',
    luas: 0.80,
    status: 'Aktif',
    detailLokasi: 'Kp. Cikeas, Desa Sukamaju, Kec. Ciawi, Kab. Bogor, Jawa Barat 16720',
    koordinat: '-6.7105, 106.8123',
    petaniMitra: 'Budi Santoso',
    tglDibuat: '12/01/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Greenhouse untuk pembibitan dan produksi tomat unggul.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
  },
  {
    id: '2',
    kodeLahan: 'GH-002',
    namaLahan: 'Greenhouse B',
    jenisLahan: 'Greenhouse',
    komoditasUtama: 'Cabai',
    komoditasColor: 'red',
    komoditasIcon: 'ri-leaf-line',
    lokasi: 'Bogor',
    luas: 0.75,
    status: 'Aktif',
    detailLokasi: 'Kp. Cikeas, Desa Sukamaju, Kec. Ciawi, Kab. Bogor, Jawa Barat 16720',
    koordinat: '-6.7120, 106.8150',
    petaniMitra: 'Joko Susilo',
    tglDibuat: '15/02/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Greenhouse untuk produksi cabai rawit.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
  },
  {
    id: '3',
    kodeLahan: 'LH-001',
    namaLahan: 'Lahan Sawah 1',
    jenisLahan: 'Lahan Terbuka',
    komoditasUtama: 'Padi',
    komoditasColor: 'blue',
    komoditasIcon: 'ri-seedling-line',
    lokasi: 'Subang',
    luas: 2.50,
    status: 'Aktif',
    detailLokasi: 'Kec. Pagaden, Kab. Subang, Jawa Barat',
    koordinat: '-6.3292, 107.7475',
    petaniMitra: 'Maman',
    tglDibuat: '10/03/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Lahan basah sawah padi IR64.',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop'
  },
  {
    id: '4',
    kodeLahan: 'LH-002',
    namaLahan: 'Lahan Sawah 2',
    jenisLahan: 'Lahan Terbuka',
    komoditasUtama: 'Padi',
    komoditasColor: 'blue',
    komoditasIcon: 'ri-seedling-line',
    lokasi: 'Subang',
    luas: 3.20,
    status: 'Aktif',
    detailLokasi: 'Kec. Pagaden, Kab. Subang, Jawa Barat',
    koordinat: '-6.3310, 107.7500',
    petaniMitra: 'Sutisna',
    tglDibuat: '12/03/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Lahan basah sawah padi pandan wangi.',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop'
  },
  {
    id: '6',
    kodeLahan: 'LH-004',
    namaLahan: 'Lahan Kedelai',
    jenisLahan: 'Lahan Terbuka',
    komoditasUtama: 'Kedelai',
    komoditasColor: 'green',
    komoditasIcon: 'ri-leaf-line',
    lokasi: 'Jember',
    luas: 1.50,
    status: 'Aktif',
    detailLokasi: 'Kec. Rambipuji, Kab. Jember, Jawa Timur',
    koordinat: '-8.1844, 113.6680',
    petaniMitra: 'Heri',
    tglDibuat: '20/04/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Lahan tanaman kedelai lokal.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop'
  },
  {
    id: '7',
    kodeLahan: 'GH-003',
    namaLahan: 'Greenhouse C',
    jenisLahan: 'Greenhouse',
    komoditasUtama: 'Melon',
    komoditasColor: 'lime',
    komoditasIcon: 'ri-leaf-line',
    lokasi: 'Bogor',
    luas: 0.60,
    status: 'Maintenance',
    detailLokasi: 'Kec. Ciawi, Kab. Bogor, Jawa Barat',
    koordinat: '-6.7150, 106.8200',
    petaniMitra: 'Andi',
    tglDibuat: '01/05/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Greenhouse melon hidroponik.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
  },
  {
    id: '8',
    kodeLahan: 'LH-005',
    namaLahan: 'Lahan Cabai',
    jenisLahan: 'Lahan Terbuka',
    komoditasUtama: 'Cabai',
    komoditasColor: 'red',
    komoditasIcon: 'ri-leaf-line',
    lokasi: 'Garut',
    luas: 1.10,
    status: 'Aktif',
    detailLokasi: 'Kec. Cikajang, Kab. Garut, Jawa Barat',
    koordinat: '-7.2279, 107.9087',
    petaniMitra: 'Dadang',
    tglDibuat: '10/05/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Lahan cabai merah besar.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop'
  },
  {
    id: '9',
    kodeLahan: 'LH-006',
    namaLahan: 'Lahan Kentang',
    jenisLahan: 'Lahan Terbuka',
    komoditasUtama: 'Kentang',
    komoditasColor: 'yellow',
    komoditasIcon: 'ri-seedling-line',
    lokasi: 'Wonosobo',
    luas: 2.00,
    status: 'Aktif',
    detailLokasi: 'Kec. Kejajar, Kab. Wonosobo, Jawa Tengah',
    koordinat: '-7.2104, 109.9197',
    petaniMitra: 'Teguh',
    tglDibuat: '15/05/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Lahan kentang granola di Dieng.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop'
  },
  {
    id: '10',
    kodeLahan: 'LH-007',
    namaLahan: 'Lahan Bawang',
    jenisLahan: 'Lahan Terbuka',
    komoditasUtama: 'Bawang Merah',
    komoditasColor: 'purple',
    komoditasIcon: 'ri-seedling-line',
    lokasi: 'Brebes',
    luas: 0.90,
    status: 'Tidak Aktif',
    detailLokasi: 'Kec. Wanasari, Kab. Brebes, Jawa Tengah',
    koordinat: '-6.8702, 109.0378',
    petaniMitra: 'Kurniawan',
    tglDibuat: '20/05/2023',
    dibuatOleh: 'Admin',
    keterangan: 'Lahan bawang merah Brebes.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop'
  }
];

const generateExtraLands = () => {
  const extra: Land[] = [];
  const komoditasList = [
    { name: 'Padi', color: 'blue', icon: 'ri-seedling-line' },
    { name: 'Jagung', color: 'amber', icon: 'ri-sun-line' },
    { name: 'Kedelai', color: 'green', icon: 'ri-leaf-line' },
    { name: 'Cabai', color: 'red', icon: 'ri-leaf-line' },
    { name: 'Tomat', color: 'emerald', icon: 'ri-leaf-line' }
  ];
  const lokasiList = ['Subang', 'Lamongan', 'Jember', 'Garut', 'Wonosobo', 'Brebes', 'Bogor'];

  for (let i = 11; i <= 32; i++) {
    const jenis: Land['jenisLahan'] = i <= 15 ? 'Greenhouse' : 'Lahan Terbuka';
    const status: Land['status'] = (i === 11 || i === 12) ? 'Tidak Aktif' : 'Aktif';
    const komo = komoditasList[i % komoditasList.length];
    const lok = lokasiList[i % lokasiList.length];
    const code = jenis === 'Greenhouse' ? `GH-${String(i).padStart(3, '0')}` : `LH-${String(i).padStart(3, '0')}`;
    const name = jenis === 'Greenhouse' ? `Greenhouse ${String.fromCharCode(65 + (i - 11 + 3))}` : `Lahan ${komo.name} ${i - 10}`;
    const luas = Number((0.6 + (i % 5) * 0.4).toFixed(2));

    extra.push({
      id: String(i),
      kodeLahan: code,
      namaLahan: name,
      jenisLahan: jenis,
      komoditasUtama: komo.name,
      komoditasColor: komo.color,
      komoditasIcon: komo.icon,
      lokasi: lok,
      luas: luas,
      status: status,
      detailLokasi: `Kec. Sukasari, Kab. ${lok}, Jawa Barat`,
      koordinat: `-6.${1500 + i * 15}, 107.${2000 + i * 20}`,
      petaniMitra: `Mitra Tani ${i}`,
      tglDibuat: '12/01/2023',
      dibuatOleh: 'Admin',
      keterangan: `${jenis} untuk produksi ${komo.name} di area ${lok}.`,
      image: jenis === 'Greenhouse'
        ? 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop'
    });
  }
  return extra;
};

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
  const [lands, setLands] = useState<Land[]>(() => [...INITIAL_LANDS, ...generateExtraLands()]);

  // Filters State
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Viewed Detail State
  const [viewedLand, setViewedLand] = useState<Land | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'kondisi' | 'riwayat' | 'dokumen'>('info');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    petaniMitra: '',
    keterangan: '',
    image: ''
  });

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

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = lands.length;
    const gh = lands.filter(l => l.jenisLahan === 'Greenhouse');
    const lt = lands.filter(l => l.jenisLahan === 'Lahan Terbuka');
    const active = lands.filter(l => l.status === 'Aktif').length;
    const inactive = lands.filter(l => l.status !== 'Aktif').length;

    const ghArea = gh.reduce((sum, item) => sum + item.luas, 0);
    const ltArea = lt.reduce((sum, item) => sum + item.luas, 0);

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
  }, [lands]);

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

  // Filtering Logic
  const filteredLands = useMemo(() => {
    return lands.filter(land => {
      const matchSearch = land.namaLahan.toLowerCase().includes(search.toLowerCase()) ||
        land.kodeLahan.toLowerCase().includes(search.toLowerCase()) ||
        land.petaniMitra.toLowerCase().includes(search.toLowerCase());

      const matchJenis = filterJenis ? land.jenisLahan === filterJenis.value : true;
      const matchStatus = filterStatus ? land.status === filterStatus.value : true;
      const matchKomoditas = filterKomoditas ? land.komoditasUtama === filterKomoditas.value : true;
      const matchLokasi = filterLokasi ? land.lokasi === filterLokasi.value : true;

      return matchSearch && matchJenis && matchStatus && matchKomoditas && matchLokasi;
    });
  }, [lands, search, filterJenis, filterStatus, filterKomoditas, filterLokasi]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredLands.length / pageSize);
  const paginatedLands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLands.slice(start, start + pageSize);
  }, [filteredLands, currentPage, pageSize]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
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
    setFormValues({
      id: '',
      kodeLahan: `GH-${String(lands.length + 1).padStart(3, '0')}`,
      namaLahan: '',
      jenisLahan: 'Greenhouse',
      komoditasUtama: 'Tomat',
      komoditasColor: 'emerald',
      komoditasIcon: 'ri-leaf-line',
      lokasi: 'Bogor',
      luas: 0.5,
      status: 'Aktif',
      detailLokasi: '',
      koordinat: '',
      petaniMitra: '',
      keterangan: '',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (land: Land) => {
    setModalMode('edit');
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
      detailLokasi: land.detailLokasi,
      koordinat: land.koordinat,
      petaniMitra: land.petaniMitra,
      keterangan: land.keterangan,
      image: land.image || ''
    });
    setIsModalOpen(true);
  };

  // Save Modal Data
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.namaLahan.trim()) {
      toast.error('Nama lahan harus diisi');
      return;
    }

    if (modalMode === 'add') {
      const newLand: Land = {
        ...formValues,
        id: String(Date.now()),
        tglDibuat: new Date().toLocaleDateString('id-ID'),
        dibuatOleh: 'Admin',
        image: formValues.image || (formValues.jenisLahan === 'Greenhouse'
          ? 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop')
      };
      setLands(prev => [newLand, ...prev]);
      toast.success('Greenhouse / Lahan baru berhasil ditambahkan');
    } else {
      setLands(prev => prev.map(item => {
        if (item.id === formValues.id) {
          const updated = {
            ...item,
            ...formValues,
            image: formValues.image || item.image
          };
          if (viewedLand && viewedLand.id === item.id) {
            setViewedLand(updated);
          }
          return updated;
        }
        return item;
      }));
      toast.success('Data Greenhouse / Lahan berhasil diperbarui');
    }
    setIsModalOpen(false);
  };

  // Delete Land
  const handleDeleteLand = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data lahan ini?')) {
      setLands(prev => prev.filter(item => item.id !== id));
      if (viewedLand && viewedLand.id === id) {
        setViewedLand(null);
      }
      toast.success('Data lahan berhasil dihapus');
    }
  };

  // Toggle Land Status
  const handleToggleStatus = (land: Land) => {
    const newStatus: Land['status'] = land.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    setLands(prev => prev.map(item => {
      if (item.id === land.id) {
        const updated = { ...item, status: newStatus };
        setViewedLand(updated);
        return updated;
      }
      return item;
    }));
    toast.success(`Status lahan berhasil diubah menjadi ${newStatus}`);
  };

  const handleExportData = () => {
    toast.success('Mengekspor data ke Excel... File Anda akan segera diunduh.');
  };

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterJenis,
      onChange: (val: any) => { setFilterJenis(val); setCurrentPage(1); },
      options: jenisLahanOptions,
      placeholder: 'Jenis Lahan',
      widthClass: 'w-36'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'w-32'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => { setFilterKomoditas(val); setCurrentPage(1); },
      options: komoditasOptions,
      placeholder: 'Komoditas',
      widthClass: 'w-36'
    },
    {
      value: filterLokasi,
      onChange: (val: any) => { setFilterLokasi(val); setCurrentPage(1); },
      options: lokasiOptions,
      placeholder: 'Lokasi',
      widthClass: 'w-32'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Lahan', 'Nama Lahan', 'Jenis Lahan', 'Komoditas Utama', 'Lokasi', 'Luas (Ha)', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Land, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedLand && viewedLand.id === item.id;
    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeLahan}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            <img src={item.image} alt={item.namaLahan} className="w-full h-full object-cover" />
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
            <span className="font-semibold text-gray-700">{item.komoditasUtama}</span>
          </span>
        </td>
        <td className="p-4">{item.lokasi}</td>
        <td className="p-4">{item.luas.toFixed(2)}</td>
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
              onClick={() => { setViewedLand(item); setActiveDetailTab('info'); }}
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
              {viewedLand.komoditasUtama}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Luas</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedLand.luas.toFixed(2)} Ha
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-start">Lokasi</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-start leading-relaxed">
              <span className="mr-2">:</span>
              <span>
                <strong className="text-gray-800">{viewedLand.lokasi}</strong> - {viewedLand.detailLokasi}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Koordinat</div>
            <div className="col-span-8 py-1 font-mono text-gray-700 flex items-center">
              <span className="mr-2 text-gray-700">:</span>{viewedLand.koordinat}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Petani Mitra</div>
            <div className="col-span-8 py-1 font-medium text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedLand.petaniMitra}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedLand.tglDibuat}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedLand.dibuatOleh}
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
            onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
            searchPlaceholder="Cari greenhouse / lahan..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={paginatedLands}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={filteredLands.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data lahan yang cocok dengan filter pencarian."
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
                  jenisLahan: val,
                  image: val === 'Greenhouse'
                    ? 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=500&auto=format&fit=crop'
                    : 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop'
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
            >
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lahan Terbuka">Lahan Terbuka</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas Utama</label>
            <select
              value={formValues.komoditasUtama}
              onChange={(e) => {
                const val = e.target.value;
                const def = KOMODITAS_DEFAULTS[val] || { color: 'green', icon: 'ri-seedling-line' };
                setFormValues(prev => ({
                  ...prev,
                  komoditasUtama: val,
                  komoditasColor: def.color,
                  komoditasIcon: def.icon
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
            >
              <option value="Tomat">Tomat</option>
              <option value="Cabai">Cabai</option>
              <option value="Padi">Padi</option>
              <option value="Jagung">Jagung</option>
              <option value="Kedelai">Kedelai</option>
              <option value="Melon">Melon</option>
              <option value="Bawang Merah">Bawang Merah</option>
              <option value="Kentang">Kentang</option>
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

          {/* <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Preview Tampilan</label>
            <div className="flex items-center gap-3 h-10 border border-defaultborder rounded px-3 bg-gray-50">
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white bg-${formValues.komoditasColor}-500 text-sm`}>
                <i className={formValues.komoditasIcon}></i>
              </span>
              <span className="text-xs text-gray-600 font-semibold truncate">{formValues.komoditasUtama}</span>
            </div>
          </div> */}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">URL Gambar Greenhouse / Lahan</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formValues.image}
              onChange={(e) => setFormValues(prev => ({ ...prev, image: e.target.value }))}
              className="form-control flex-1 border border-defaultborder p-2 rounded text-sm focus:border-emerald-500 font-mono text-xs"
              placeholder="https://images.unsplash.com/..."
            />
            {formValues.image && (
              <div className="w-10 h-10 rounded border border-defaultborder overflow-hidden flex-shrink-0 bg-gray-50">
                <img src={formValues.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Lokasi Wilayah</label>
            <select
              value={formValues.lokasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, lokasi: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
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
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Land['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Petani Mitra</label>
            <input
              type="text"
              value={formValues.petaniMitra}
              onChange={(e) => setFormValues(prev => ({ ...prev, petaniMitra: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Nama Petani"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Koordinat</label>
            <input
              type="text"
              value={formValues.koordinat}
              onChange={(e) => setFormValues(prev => ({ ...prev, koordinat: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="-6.7105, 106.8123"
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
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
