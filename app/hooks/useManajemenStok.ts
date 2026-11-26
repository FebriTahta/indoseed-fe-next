import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  StokBenihBersihItem,
  NonBenihStokItem,
  ManajemenStokStats,
  KartuStokItem,
  ManajemenStokTab,
} from '../types/manajemenStok';
import { manajemenStokService } from '../services/manajemenStokService';
import { toast } from 'react-toastify';

export const INITIAL_BENIH_BERSIH: StokBenihBersihItem[] = [
  {
    id: 'stk-001',
    noLot: 'LOT-2026-0015',
    varietas: 'Inpari 32',
    komoditas: 'Padi',
    kelas: 'BS',
    kodeBatch: 'PRD-2406-001',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-LS-01',
    stokFisik: 5000,
    dialokasikan: 500,
    tersedia: 4500,
    statusQc: 'Lolos QC',
    tglMasuk: '12 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-001',
      noPengujian: 'TST-QC-202611-001',
      tanggalPengujian: '10 Nov 2026',
      hasilAkhir: 'Lulus',
      dayaBerkecambah: 96.5,
      kadarAir: 10.8,
      kemurnianFisik: 99.8,
      petugasQc: 'Andi Saputra',
      catatanQc: 'Batch memenuhi standar sertifikasi BPSB benih penjenis.',
    },
  },
  {
    id: 'stk-002',
    noLot: 'LOT-2026-0016',
    varietas: 'Ciherang',
    komoditas: 'Padi',
    kelas: 'BS',
    kodeBatch: 'PRD-2406-002',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-LS-02',
    stokFisik: 3200,
    dialokasikan: 200,
    tersedia: 3000,
    statusQc: 'Lolos QC',
    tglMasuk: '12 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-002',
      noPengujian: 'TST-QC-202611-002',
      tanggalPengujian: '11 Nov 2026',
      hasilAkhir: 'Lulus',
      dayaBerkecambah: 94.2,
      kadarAir: 11.2,
      kemurnianFisik: 99.4,
      petugasQc: 'Dewi Lestari',
      catatanQc: 'Kadar air stabil, daya kecambah vigor sangat baik.',
    },
  },
  {
    id: 'stk-003',
    noLot: 'LOT-2026-0017',
    varietas: 'Cabai Keriting',
    komoditas: 'Cabai',
    kelas: 'BD',
    kodeBatch: 'PRD-2406-003',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-LS-03',
    stokFisik: 850,
    dialokasikan: 100,
    tersedia: 750,
    statusQc: 'Lolos QC',
    tglMasuk: '13 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-003',
      noPengujian: 'TST-QC-202611-003',
      tanggalPengujian: '12 Nov 2026',
      hasilAkhir: 'Lulus',
      dayaBerkecambah: 91.0,
      kadarAir: 7.5,
      kemurnianFisik: 99.1,
      petugasQc: 'Ratna Kusuma',
      catatanQc: 'Siap untuk pengemasan retail pouch aluminium.',
    },
  },
  {
    id: 'stk-004',
    noLot: 'LOT-2026-0018',
    varietas: 'Melon Tavi',
    komoditas: 'Melon',
    kelas: 'BP',
    kodeBatch: 'PRD-2406-004',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-KR-01',
    stokFisik: 1230,
    dialokasikan: 0,
    tersedia: 1230,
    statusQc: 'Karantina',
    tglMasuk: '14 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-004',
      noPengujian: 'TST-QC-202611-004',
      tanggalPengujian: '14 Nov 2026',
      hasilAkhir: 'Dalam Pengujian',
      dayaBerkecambah: 0,
      kadarAir: 8.2,
      kemurnianFisik: 99.0,
      petugasQc: 'Budi Santoso',
      catatanQc: 'Menunggu hasil pengamatan uji perkecambahan hari ke-7.',
    },
  },
  {
    id: 'stk-005',
    noLot: 'LOT-2026-0019',
    varietas: 'Tomat Rapid',
    komoditas: 'Tomat',
    kelas: 'BD',
    kodeBatch: 'PRD-2406-005',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-LS-04',
    stokFisik: 980,
    dialokasikan: 150,
    tersedia: 830,
    statusQc: 'Lolos QC',
    tglMasuk: '15 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-005',
      noPengujian: 'TST-QC-202611-005',
      tanggalPengujian: '14 Nov 2026',
      hasilAkhir: 'Lulus',
      dayaBerkecambah: 95.8,
      kadarAir: 7.8,
      kemurnianFisik: 99.6,
      petugasQc: 'Rina Fitriani',
      catatanQc: 'Keseragaman ukuran benih dan kebersihan prima.',
    },
  },
  {
    id: 'stk-006',
    noLot: 'LOT-2026-0020',
    varietas: 'Kangkung Bima',
    komoditas: 'Kangkung',
    kelas: 'BS',
    kodeBatch: 'PRD-2406-006',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-DT-01',
    stokFisik: 330,
    dialokasikan: 0,
    tersedia: 330,
    statusQc: 'Ditahan',
    tglMasuk: '15 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-006',
      noPengujian: 'TST-QC-202611-006',
      tanggalPengujian: '15 Nov 2026',
      hasilAkhir: 'Tidak Lulus',
      dayaBerkecambah: 68.0,
      kadarAir: 13.5,
      kemurnianFisik: 94.0,
      petugasQc: 'Andi Saputra',
      catatanQc: 'Daya berkecambah di bawah standar minimum 80%. Direkomendasikan pengeringan ulang & sortasi gravitasi.',
    },
  },
  {
    id: 'stk-007',
    noLot: 'LOT-2026-0021',
    varietas: 'Selada Grand Rapids',
    komoditas: 'Selada',
    kelas: 'BP',
    kodeBatch: 'PRD-2406-007',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-LS-05',
    stokFisik: 620,
    dialokasikan: 50,
    tersedia: 570,
    statusQc: 'Lolos QC',
    tglMasuk: '16 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-007',
      noPengujian: 'TST-QC-202611-007',
      tanggalPengujian: '15 Nov 2026',
      hasilAkhir: 'Lulus',
      dayaBerkecambah: 92.5,
      kadarAir: 6.9,
      kemurnianFisik: 99.7,
      petugasQc: 'Dewi Lestari',
      catatanQc: 'Kualitas benih prima, viabilitas terjaga.',
    },
  },
  {
    id: 'stk-008',
    noLot: 'LOT-2026-0022',
    varietas: 'Padi Inpari 42',
    komoditas: 'Padi',
    kelas: 'BS',
    kodeBatch: 'PRD-2406-008',
    gudang: 'Gudang Benih Bersih',
    lokasi: 'GD-BNH-LS-06',
    stokFisik: 1350,
    dialokasikan: 300,
    tersedia: 1050,
    statusQc: 'Lolos QC',
    tglMasuk: '17 Nov 2026',
    qcReference: {
      noPermintaan: 'RQ-QC-202611-008',
      noPengujian: 'TST-QC-202611-008',
      tanggalPengujian: '16 Nov 2026',
      hasilAkhir: 'Lulus',
      dayaBerkecambah: 97.0,
      kadarAir: 10.5,
      kemurnianFisik: 99.9,
      petugasQc: 'Ratna Kusuma',
      catatanQc: 'Sangat cocok untuk kebutuhan benih sebar berlabel biru.',
    },
  },
];

export const INITIAL_STATS: ManajemenStokStats = {
  totalSkuAktif: 128,
  totalLotBenihBersih: 24,
  stokMinimum: 7,
  stokDitahan: 3,
  komposisi: {
    totalStok: 12860,
    lolosQc: { kg: 10000, percent: 77.8 },
    karantina: { kg: 1230, percent: 9.6 },
    ditahan: { kg: 330, percent: 2.6 },
    dialokasikan: { kg: 1300, percent: 10.1 },
  },
  ringkasanStatus: {
    belumDiproses: 8450,
    karantina: 1230,
    lolosQc: 10000,
  },
};

export default function useManajemenStok() {
  const [activeTab, setActiveTab] = useState<ManajemenStokTab>('benih-bersih');
  const [benihList, setBenihList] = useState<StokBenihBersihItem[]>(INITIAL_BENIH_BERSIH);
  const [nonBenihList, setNonBenihList] = useState<NonBenihStokItem[]>([]);
  const [stats, setStats] = useState<ManajemenStokStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filterGudang, setFilterGudang] = useState('Gudang Benih Bersih');
  const [filterLokasi, setFilterLokasi] = useState('Semua Lokasi');
  const [filterStatusQc, setFilterStatusQc] = useState('Semua Status');
  const [filterVarietas, setFilterVarietas] = useState('Semua Varietas');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Checkbox Selection
  const [selectedLots, setSelectedLots] = useState<string[]>([]);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StokBenihBersihItem | null>(null);

  const [isKartuStokModalOpen, setIsKartuStokModalOpen] = useState(false);
  const [kartuStokLot, setKartuStokLot] = useState<string>('');
  const [kartuStokHistory, setKartuStokHistory] = useState<KartuStokItem[]>([]);
  const [loadingKartuStok, setLoadingKartuStok] = useState(false);

  const [isLaporanModalOpen, setIsLaporanModalOpen] = useState(false);

  // Guard ref
  const isFetchingRef = useRef(false);

  const fetchStokData = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await manajemenStokService.getManajemenStokList({
        page: currentPage,
        limit: pageSize,
        tab: activeTab,
        search: appliedSearch || undefined,
        gudang: filterGudang !== 'Semua Gudang' ? filterGudang : undefined,
        lokasi: filterLokasi !== 'Semua Lokasi' ? filterLokasi : undefined,
        statusQc: filterStatusQc !== 'Semua Status' ? filterStatusQc : undefined,
        varietas: filterVarietas !== 'Semua Varietas' ? filterVarietas : undefined,
      });

      if (res && res.status === 'success') {
        if (activeTab === 'benih-bersih') {
          setBenihList(res.data || []);
          if (res.stats) {
            setStats(res.stats);
          }
        } else {
          setNonBenihList(res.data || []);
        }
        if (res.meta) {
          setTotalRecords(res.meta.total || 0);
          setTotalPages(res.meta.totalPages || 1);
        }
      }
    } catch (err) {
      console.warn('Backend API manajemen-stok offline or error, using initial data:', err);
      // Client-side fallback filter
      if (activeTab === 'benih-bersih') {
        let filtered = [...INITIAL_BENIH_BERSIH];
        if (appliedSearch) {
          const q = appliedSearch.toLowerCase();
          filtered = filtered.filter(
            (it) =>
              it.noLot.toLowerCase().includes(q) ||
              it.varietas.toLowerCase().includes(q) ||
              it.kodeBatch.toLowerCase().includes(q)
          );
        }
        if (filterStatusQc && filterStatusQc !== 'Semua Status') {
          filtered = filtered.filter((it) => it.statusQc === filterStatusQc);
        }
        if (filterVarietas && filterVarietas !== 'Semua Varietas') {
          filtered = filtered.filter((it) => it.varietas === filterVarietas);
        }
        setBenihList(filtered);
        setTotalRecords(filtered.length);
        setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [activeTab, appliedSearch, currentPage, pageSize, filterGudang, filterLokasi, filterStatusQc, filterVarietas]);

  useEffect(() => {
    fetchStokData();
  }, [fetchStokData]);

  // Handle Tab Change
  const handleTabChange = (tab: ManajemenStokTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedLots([]);
  };

  // Filter handlers
  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setFilterGudang('Gudang Benih Bersih');
    setFilterLokasi('Semua Lokasi');
    setFilterStatusQc('Semua Status');
    setFilterVarietas('Semua Varietas');
    setCurrentPage(1);
  };

  // Select all checkboxes
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLots(benihList.map((b) => b.noLot));
    } else {
      setSelectedLots([]);
    }
  };

  const handleSelectRow = (noLot: string) => {
    setSelectedLots((prev) =>
      prev.includes(noLot) ? prev.filter((l) => l !== noLot) : [...prev, noLot]
    );
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: StokBenihBersihItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  // Open Kartu Stok
  const handleOpenKartuStok = async (itemOrLot?: StokBenihBersihItem | string) => {
    const lot = typeof itemOrLot === 'string' ? itemOrLot : itemOrLot?.noLot || benihList[0]?.noLot || 'LOT-2026-0015';
    setKartuStokLot(lot);
    setIsKartuStokModalOpen(true);
    setLoadingKartuStok(true);

    try {
      const res = await manajemenStokService.getKartuStok(lot);
      if (res && res.data) {
        setKartuStokHistory(res.data);
      } else {
        throw new Error('No data');
      }
    } catch {
      // Fallback local history
      const matched = benihList.find((b) => b.noLot === lot);
      setKartuStokHistory([
        {
          tanggal: matched?.tglMasuk || '12 Nov 2026',
          noTransaksi: `TR-IN-${matched?.kodeBatch || 'PRD-2406-001'}`,
          jenisTransaksi: 'Penerimaan Hasil QC (Lolos)',
          masukKg: matched?.stokFisik || 5000,
          keluarKg: 0,
          sisaKg: matched?.stokFisik || 5000,
          keterangan: `Stok masuk dari Batch Produksi ${matched?.kodeBatch || 'PRD-2406-001'} setelah dinyatakan ${matched?.statusQc || 'Lolos QC'}`,
          petugas: 'Admin Gudang',
        },
        ...(matched && matched.dialokasikan > 0
          ? [
              {
                tanggal: '18 Nov 2026',
                noTransaksi: `SO-ALC-0024`,
                jenisTransaksi: 'Alokasi Order Sales',
                masukKg: 0,
                keluarKg: matched.dialokasikan,
                sisaKg: matched.tersedia,
                keterangan: `Reserved untuk Sales Order Penjualan`,
                petugas: 'Staff Inventory',
              },
            ]
          : []),
      ]);
    } finally {
      setLoadingKartuStok(false);
    }
  };

  const handleCloseKartuStok = () => {
    setIsKartuStokModalOpen(false);
    setKartuStokHistory([]);
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (activeTab === 'benih-bersih') {
      const headers = ['No. Lot', 'Varietas', 'Kelas', 'Batch Produksi', 'Gudang / Lokasi', 'Stok Fisik (kg)', 'Dialokasikan (kg)', 'Tersedia (kg)', 'Status QC', 'Tgl Masuk'];
      const rows = benihList.map((b) => [
        b.noLot,
        b.varietas,
        b.kelas,
        b.kodeBatch,
        b.lokasi,
        b.stokFisik,
        b.dialokasikan,
        b.tersedia,
        b.statusQc,
        b.tglMasuk,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Manajemen_Stok_Benih_Bersih_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Data stok berhasil diekspor ke CSV');
    } else {
      toast.info('Ekspor data berhasil');
    }
  };

  return {
    activeTab,
    handleTabChange,
    benihList,
    nonBenihList,
    stats,
    loading,
    // Filters
    searchQuery,
    setSearchQuery,
    filterGudang,
    setFilterGudang,
    filterLokasi,
    setFilterLokasi,
    filterStatusQc,
    setFilterStatusQc,
    filterVarietas,
    setFilterVarietas,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Selection
    selectedLots,
    handleSelectAll,
    handleSelectRow,
    // Modals
    isDetailModalOpen,
    selectedItem,
    handleOpenDetailModal,
    handleCloseDetailModal,
    isKartuStokModalOpen,
    kartuStokLot,
    kartuStokHistory,
    loadingKartuStok,
    handleOpenKartuStok,
    handleCloseKartuStok,
    isLaporanModalOpen,
    setIsLaporanModalOpen,
    handleExportCsv,
    fetchStokData,
  };
}

