import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  panenService,
  PanenItem,
  PanenStats,
  RingkasanKomoditasItem,
  ChartPanenData,
  ReferensiJadwalTanamPanen,
} from '../services/panenService';
import { toast } from 'react-toastify';

export const INITIAL_PANEN_LIST: PanenItem[] = [
  {
    id: 'pn-18',
    kodePanen: 'PN-2026-06-0018',
    kodeJadwalTanam: 'JT-2026-0018',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-001 / Blok 01',
    blokLahan: 'Blok 01',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    rencanaPanen: '2026-09-30',
    tanggalPanen: '2026-09-28',
    luasHa: 1.00,
    perkiraanHasil: 1500,
    produksiKg: 1480,
    jumlahBuah: 1520,
    beratBruto: 1520,
    beratNetto: 1480,
    kondisiHasil: 'Baik',
    status: 'Selesai',
    statusPengolahan: 'Menunggu Pengolahan',
    catatan: 'Kondisi tanaman sehat dan hasil panen sesuai standar.',
    penanggungJawab: 'Admin Produksi',
    dokumentasi: [
      { url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60', caption: 'Lahan Panen', date: '28 Sep 2026', size: '1.4 MB' },
      { url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60', caption: 'Kualitas Buah', date: '28 Sep 2026', size: '2.1 MB' },
      { url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60', caption: 'Pemetikan Buah', date: '28 Sep 2026', size: '1.8 MB' },
      { url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60', caption: 'Penimbangan', date: '28 Sep 2026', size: '1.9 MB' },
    ],
  },
  {
    id: 'pn-17',
    kodePanen: 'PN-2026-06-0017',
    kodeJadwalTanam: 'JT-2026-0017',
    petani: 'Siti Rahayu',
    petaniKode: 'SRN-002',
    lahan: 'LHN-002 / Blok 02',
    blokLahan: 'Blok 02',
    jenisHasil: 'OC / Benih',
    komoditas: 'Cabai',
    varietas: 'Cabai Keriting',
    rencanaPanen: '2026-11-01',
    tanggalPanen: '2026-11-01',
    luasHa: 1.20,
    perkiraanHasil: 2000,
    produksiKg: 0,
    jumlahBuah: 0,
    beratBruto: 0,
    beratNetto: 0,
    kondisiHasil: 'Baik',
    status: 'Dalam Proses',
    statusPengolahan: 'Belum Diproses',
    catatan: 'Tanaman dalam masa pematangan buah akhir.',
    penanggungJawab: 'Siti Rahayu',
    dokumentasi: [],
  },
  {
    id: 'pn-16',
    kodePanen: 'PN-2026-06-0016',
    kodeJadwalTanam: 'JT-2026-0016',
    petani: 'Agus Setiawan',
    petaniKode: 'AGS-003',
    lahan: 'LHN-003 / Blok Utara',
    blokLahan: 'Blok Utara',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    rencanaPanen: '2026-10-04',
    tanggalPanen: '2026-10-04',
    luasHa: 2.00,
    perkiraanHasil: 3500,
    produksiKg: 0,
    jumlahBuah: 0,
    beratBruto: 0,
    beratNetto: 0,
    kondisiHasil: 'Baik',
    status: 'Dalam Proses',
    statusPengolahan: 'Belum Diproses',
    catatan: 'Padi mulai menguning rata.',
    penanggungJawab: 'Agus Setiawan',
    dokumentasi: [],
  },
  {
    id: 'pn-15',
    kodePanen: 'PN-2026-06-0015',
    kodeJadwalTanam: 'JT-2026-0015',
    petani: 'Dewi Lestari',
    petaniKode: 'DLR-004',
    lahan: 'LHN-004 / Blok 02',
    blokLahan: 'Blok 02',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Tomat',
    varietas: 'Grand Rapids',
    rencanaPanen: '2026-10-08',
    tanggalPanen: '2026-10-07',
    luasHa: 1.50,
    perkiraanHasil: 2000,
    produksiKg: 1950,
    jumlahBuah: 3200,
    beratBruto: 2000,
    beratNetto: 1950,
    kondisiHasil: 'Baik',
    status: 'Selesai',
    statusPengolahan: 'Selesai',
    catatan: 'Hasil panen tomat merah segar dan seragam.',
    penanggungJawab: 'Dewi Lestari',
    dokumentasi: [
      { url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60', caption: 'Panen Tomat', date: '07 Okt 2026', size: '1.2 MB' },
    ],
  },
  {
    id: 'pn-14',
    kodePanen: 'PN-2026-06-0014',
    kodeJadwalTanam: 'JT-2026-0014',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-005 / Blok 03',
    blokLahan: 'Blok 03',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    rencanaPanen: '2026-10-10',
    tanggalPanen: '2026-10-10',
    luasHa: 1.80,
    perkiraanHasil: 2500,
    produksiKg: 0,
    jumlahBuah: 0,
    beratBruto: 0,
    beratNetto: 0,
    kondisiHasil: 'Cukup',
    status: 'Tertunda',
    statusPengolahan: 'Belum Diproses',
    catatan: 'Curah hujan tinggi, panen ditunda 3 hari untuk menjaga kualitas buah.',
    penanggungJawab: 'Budi Santoso',
    dokumentasi: [],
  },
  {
    id: 'pn-13',
    kodePanen: 'PN-2026-06-0013',
    kodeJadwalTanam: 'JT-2026-0013',
    petani: 'Rini Wulandari',
    petaniKode: 'RW-005',
    lahan: 'LHN-006 / Blok 06',
    blokLahan: 'Blok 06',
    jenisHasil: 'OC / Benih',
    komoditas: 'Cabai',
    varietas: 'Cabai Rawit',
    rencanaPanen: '2026-11-12',
    tanggalPanen: '2026-11-12',
    luasHa: 1.00,
    perkiraanHasil: 1500,
    produksiKg: 0,
    jumlahBuah: 0,
    beratBruto: 0,
    beratNetto: 0,
    kondisiHasil: 'Baik',
    status: 'Dalam Proses',
    statusPengolahan: 'Belum Diproses',
    catatan: 'Cabai rawit fase pematangan.',
    penanggungJawab: 'Rini Wulandari',
    dokumentasi: [],
  },
  {
    id: 'pn-12',
    kodePanen: 'PN-2026-06-0012',
    kodeJadwalTanam: 'JT-2026-0012',
    petani: 'Endang Sulastri',
    petaniKode: 'ENS-007',
    lahan: 'LHN-007 / Blok 07',
    blokLahan: 'Blok 07',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    rencanaPanen: '2026-10-20',
    tanggalPanen: '2026-10-20',
    luasHa: 2.50,
    perkiraanHasil: 4000,
    produksiKg: 0,
    jumlahBuah: 0,
    beratBruto: 0,
    beratNetto: 0,
    kondisiHasil: 'Baik',
    status: 'Dalam Proses',
    statusPengolahan: 'Belum Diproses',
    catatan: 'Monitoring pengisian bulir padi.',
    penanggungJawab: 'Endang Sulastri',
    dokumentasi: [],
  },
  {
    id: 'pn-11',
    kodePanen: 'PN-2026-06-0011',
    kodeJadwalTanam: 'JT-2026-0011',
    petani: 'Slamet Riyadi',
    petaniKode: 'SRM-008',
    lahan: 'LHN-008 / Blok 08',
    blokLahan: 'Blok 08',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Kangkung',
    varietas: 'Bima',
    rencanaPanen: '2026-10-25',
    tanggalPanen: '2026-10-25',
    luasHa: 0.80,
    perkiraanHasil: 1200,
    produksiKg: 0,
    jumlahBuah: 0,
    beratBruto: 0,
    beratNetto: 0,
    kondisiHasil: 'Baik',
    status: 'Menunggu',
    statusPengolahan: 'Belum Diproses',
    catatan: 'Menunggu kesiapan vegetatif akhir.',
    penanggungJawab: 'Slamet Riyadi',
    dokumentasi: [],
  },
  {
    id: 'pn-10',
    kodePanen: 'PN-2026-06-0010',
    kodeJadwalTanam: 'JT-2026-0010',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-001 / Blok 02',
    blokLahan: 'Blok 02',
    jenisHasil: 'Glondong / Buah',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    rencanaPanen: '2026-09-20',
    tanggalPanen: '2026-09-18',
    luasHa: 1.20,
    perkiraanHasil: 2000,
    produksiKg: 2000,
    jumlahBuah: 1980,
    beratBruto: 2050,
    beratNetto: 2000,
    kondisiHasil: 'Sangat Baik',
    status: 'Selesai',
    statusPengolahan: 'Selesai',
    catatan: 'Kualitas buah manis Brix 14+.',
    penanggungJawab: 'Budi Santoso',
    dokumentasi: [],
  },
  {
    id: 'pn-09',
    kodePanen: 'PN-2026-06-0009',
    kodeJadwalTanam: 'JT-2026-0009',
    petani: 'Agus Setiawan',
    petaniKode: 'AGS-003',
    lahan: 'LHN-003 / Blok Selatan',
    blokLahan: 'Blok Selatan',
    jenisHasil: 'OC / Benih',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    rencanaPanen: '2026-09-22',
    tanggalPanen: '2026-09-21',
    luasHa: 2.00,
    perkiraanHasil: 3100,
    produksiKg: 3100,
    jumlahBuah: 0,
    beratBruto: 3200,
    beratNetto: 3100,
    kondisiHasil: 'Baik',
    status: 'Selesai',
    statusPengolahan: 'Selesai',
    catatan: 'Hasil panen benih padi lolos sortasi awal.',
    penanggungJawab: 'Agus Setiawan',
    dokumentasi: [],
  },
];

export const INITIAL_STATS: PanenStats = {
  totalJadwal: 10,
  selesaiCount: 6,
  dalamProsesCount: 2,
  tertundaCount: 1,
  totalHasilKg: 12450,
  glondongKg: 8250,
  glondongJadwal: 6,
  ocKg: 4200,
  ocJadwal: 4,
};

export const INITIAL_RINGKASAN: RingkasanKomoditasItem[] = [
  { no: 1, komoditas: 'Melon', varietas: 'Melon Tere F1', jumlahJadwal: 3, selesai: 2, dalamProses: 1, tertunda: 0, totalHasilKg: 3480 },
  { no: 2, komoditas: 'Cabai', varietas: 'Cabai Keriting', jumlahJadwal: 2, selesai: 1, dalamProses: 1, tertunda: 0, totalHasilKg: 1950 },
  { no: 3, komoditas: 'Padi', varietas: 'Inpari 32', jumlahJadwal: 2, selesai: 1, dalamProses: 1, tertunda: 0, totalHasilKg: 3100 },
  { no: 4, komoditas: 'Tomat', varietas: 'Grand Rapids', jumlahJadwal: 1, selesai: 1, dalamProses: 0, tertunda: 0, totalHasilKg: 1950 },
  { no: 5, komoditas: 'Kangkung', varietas: 'Bima', jumlahJadwal: 1, selesai: 1, dalamProses: 0, tertunda: 0, totalHasilKg: 1200 },
];

export const INITIAL_CHART_DATA: ChartPanenData = {
  categories: ['23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun'],
  series: [
    { name: 'Melon', data: [1200, 1500, 1100, 1800, 1400, 2100, 1950] },
    { name: 'Cabai', data: [800, 950, 850, 1200, 1100, 1450, 1300] },
    { name: 'Padi', data: [1500, 1800, 1400, 2000, 1750, 2300, 2200] },
    { name: 'Tomat', data: [600, 800, 750, 900, 850, 1100, 1050] },
    { name: 'Kangkung', data: [400, 550, 450, 650, 600, 750, 700] },
  ],
};

export default function usePanen() {
  const [panenList, setPanenList] = useState<PanenItem[]>(INITIAL_PANEN_LIST);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [filterPeriode, setFilterPeriode] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua Komoditas');
  const [filterVarietas, setFilterVarietas] = useState<string>('Semua Varietas');
  const [filterStatus, setFilterStatus] = useState<string>('Semua Status');
  const [filterPetani, setFilterPetani] = useState<string>('Semua Petani');
  const [filterJenisHasil, setFilterJenisHasil] = useState<string>('Semua Jenis');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [totalRecords, setTotalRecords] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(2);

  // Stats & Summaries
  const [stats, setStats] = useState<PanenStats>(INITIAL_STATS);
  const [ringkasanKomoditas, setRingkasanKomoditas] = useState<RingkasanKomoditasItem[]>(INITIAL_RINGKASAN);
  const [chartData, setChartData] = useState<ChartPanenData>(INITIAL_CHART_DATA);

  // Eligible Jadwal Tanam for Create Modal
  const [eligibleJadwals, setEligibleJadwals] = useState<ReferensiJadwalTanamPanen[]>([]);

  // Selected Item for Detail Show/Hide panel (default hidden)
  const [selectedDetailPanen, setSelectedDetailPanen] = useState<PanenItem | null>(null);

  // Modal Create/Edit
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<PanenItem | null>(null);

  // Lightbox / Detail Foto Modal
  const [isFotoModalOpen, setIsFotoModalOpen] = useState<boolean>(false);

  // Fetch list data
  const fetchPanenList = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await panenService.getPanenList({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        komoditas: filterKomoditas !== 'Semua Komoditas' ? filterKomoditas : undefined,
        varietas: filterVarietas !== 'Semua Varietas' ? filterVarietas : undefined,
        status: filterStatus !== 'Semua Status' ? filterStatus : undefined,
        petani: filterPetani !== 'Semua Petani' ? filterPetani : undefined,
        jenisHasil: filterJenisHasil !== 'Semua Jenis' ? filterJenisHasil : undefined,
      });

      if (res && res.data && res.data.length > 0) {
        setPanenList(res.data);
        if (res.meta) {
          setTotalRecords(res.meta.total || res.data.length);
          setTotalPages(res.meta.totalPages || 1);
        }
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.warn('Using initial panen list due to network/api error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, search, filterKomoditas, filterVarietas, filterStatus, filterPetani, filterJenisHasil]);

  // Fetch Stats, Ringkasan, Chart, Eligible
  const fetchAuxiliaryData = useCallback(async () => {
    try {
      const [statsRes, ringkasanRes, chartRes, eligibleRes] = await Promise.allSettled([
        panenService.getStats(),
        panenService.getRingkasanKomoditas(),
        panenService.getChartData('7_hari'),
        panenService.getReferensiJadwalTanam(),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        setStats(statsRes.value.data);
      }
      if (ringkasanRes.status === 'fulfilled' && ringkasanRes.value.data) {
        setRingkasanKomoditas(ringkasanRes.value.data);
      }
      if (chartRes.status === 'fulfilled' && chartRes.value.data) {
        setChartData(chartRes.value.data);
      }
      if (eligibleRes.status === 'fulfilled' && eligibleRes.value.data) {
        setEligibleJadwals(eligibleRes.value.data);
      }
    } catch (e) {
      console.warn('Auxiliary data fetch fallback:', e);
    }
  }, []);

  useEffect(() => {
    fetchPanenList();
  }, [fetchPanenList]);

  useEffect(() => {
    fetchAuxiliaryData();
  }, [fetchAuxiliaryData]);

  // Filter options
  const komoditasOptions = useMemo(() => [
    { label: 'Semua Komoditas', value: 'Semua Komoditas' },
    { label: 'Melon', value: 'Melon' },
    { label: 'Cabai', value: 'Cabai' },
    { label: 'Padi', value: 'Padi' },
    { label: 'Tomat', value: 'Tomat' },
    { label: 'Kangkung', value: 'Kangkung' },
  ], []);

  const statusOptions = useMemo(() => [
    { label: 'Semua Status', value: 'Semua Status' },
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Dalam Proses', value: 'Dalam Proses' },
    { label: 'Tertunda', value: 'Tertunda' },
    { label: 'Menunggu', value: 'Menunggu' },
  ], []);

  const petaniOptions = useMemo(() => [
    { label: 'Semua Petani', value: 'Semua Petani' },
    { label: 'Budi Santoso', value: 'Budi Santoso' },
    { label: 'Siti Rahayu', value: 'Siti Rahayu' },
    { label: 'Agus Setiawan', value: 'Agus Setiawan' },
    { label: 'Dewi Lestari', value: 'Dewi Lestari' },
    { label: 'Rini Wulandari', value: 'Rini Wulandari' },
    { label: 'Endang Sulastri', value: 'Endang Sulastri' },
    { label: 'Slamet Riyadi', value: 'Slamet Riyadi' },
  ], []);

  const jenisHasilOptions = useMemo(() => [
    { label: 'Semua Jenis', value: 'Semua Jenis' },
    { label: 'Glondong / Buah', value: 'Glondong / Buah' },
    { label: 'OC / Benih', value: 'OC / Benih' },
  ], []);

  // Show / Hide Detail Panen toggle
  const handleToggleDetail = (item: PanenItem) => {
    if (selectedDetailPanen && selectedDetailPanen.id === item.id) {
      // If currently showing this item, toggle to hide
      setSelectedDetailPanen(null);
    } else {
      // Show this item
      setSelectedDetailPanen(item);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPanenList();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterPeriode(null);
    setFilterKomoditas('Semua Komoditas');
    setFilterVarietas('Semua Varietas');
    setFilterStatus('Semua Status');
    setFilterPetani('Semua Petani');
    setFilterJenisHasil('Semua Jenis');
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PanenItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSavePanen = async (payload: any): Promise<boolean> => {
    setIsSaving(true);
    try {
      if (editingItem) {
        await panenService.updatePanen(editingItem.id, payload);
        toast.success('Data panen berhasil diperbarui');
      } else {
        await panenService.createPanen(payload);
        toast.success('Data panen baru berhasil disimpan');
      }
      handleCloseModal();
      await fetchPanenList();
      await fetchAuxiliaryData();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data panen');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePanen = async (item: PanenItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data panen ${item.kodePanen}?`)) {
      try {
        await panenService.deletePanen(item.id);
        toast.success('Data panen berhasil dihapus');
        if (selectedDetailPanen?.id === item.id) {
          setSelectedDetailPanen(null);
        }
        await fetchPanenList();
        await fetchAuxiliaryData();
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Gagal menghapus data panen');
      }
    }
  };

  return {
    panenList,
    isLoading,
    isSaving,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    filterPetani,
    setFilterPetani,
    filterJenisHasil,
    setFilterJenisHasil,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    stats,
    ringkasanKomoditas,
    chartData,
    eligibleJadwals,
    selectedDetailPanen,
    setSelectedDetailPanen,
    handleToggleDetail,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSavePanen,
    handleDeletePanen,
    handleApplyFilters,
    handleResetFilters,
    komoditasOptions,
    statusOptions,
    petaniOptions,
    jenisHasilOptions,
    isFotoModalOpen,
    setIsFotoModalOpen,
    fetchPanenList,
  };
}
