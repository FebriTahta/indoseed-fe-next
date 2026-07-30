import { useState, useCallback, useMemo } from 'react';
import { SortasiBatchItem, ProsesSortasiAktifItem } from '../types/sortasi';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

export const INITIAL_SORTASI_BATCH_LIST: SortasiBatchItem[] = [
  {
    no: 1,
    kodeBatch: 'PN-2606-0001',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    alatSortasi: 'Gravity Separator',
    beratMasuk: 10000,
    hasilLulus: 8750,
    hasilTolak: 1250,
    recovery: 87.50,
    tanggalSortasi: '09/06/2026 09:15',
    status: 'Selesai'
  },
  {
    no: 2,
    kodeBatch: 'PN-2606-0002',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    alatSortasi: 'Color Sorter',
    beratMasuk: 8000,
    hasilLulus: 6920,
    hasilTolak: 1080,
    recovery: 86.50,
    tanggalSortasi: '09/06/2026 11:20',
    status: 'Selesai'
  },
  {
    no: 3,
    kodeBatch: 'PN-2606-0003',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    alatSortasi: 'Gravity Separator',
    beratMasuk: 9500,
    hasilLulus: 8200,
    hasilTolak: 1300,
    recovery: 86.32,
    tanggalSortasi: '10/06/2026 08:30',
    status: 'Selesai'
  },
  {
    no: 4,
    kodeBatch: 'PN-2606-0004',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    alatSortasi: 'Vibro Separator',
    beratMasuk: 6000,
    hasilLulus: 5050,
    hasilTolak: 950,
    recovery: 84.17,
    tanggalSortasi: '10/06/2026 13:45',
    status: 'Selesai'
  },
  {
    no: 5,
    kodeBatch: 'PN-2606-0005',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    alatSortasi: 'Gravity Separator',
    beratMasuk: 9200,
    hasilLulus: 7960,
    hasilTolak: 1240,
    recovery: 86.52,
    tanggalSortasi: '11/06/2026 09:00',
    status: 'Selesai'
  },
  {
    no: 6,
    kodeBatch: 'PN-2606-0006',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    alatSortasi: 'Color Sorter',
    beratMasuk: 7500,
    hasilLulus: 6180,
    hasilTolak: 1320,
    recovery: 82.40,
    tanggalSortasi: '11/06/2026 11:10',
    status: 'Selesai'
  },
  {
    no: 7,
    kodeBatch: 'PN-2606-0007',
    komoditas: 'Kedelai',
    varietas: 'Dega 1',
    alatSortasi: 'Vibro Separator',
    beratMasuk: 5000,
    hasilLulus: 4150,
    hasilTolak: 850,
    recovery: 83.00,
    tanggalSortasi: '11/06/2026 14:30',
    status: 'Selesai'
  }
];

export const INITIAL_PROSES_AKTIF_LIST: ProsesSortasiAktifItem[] = [
  {
    kodeBatch: 'PN-2606-0007',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    lokasi: 'DR-01',
    alatSortasi: 'Gravity Separator GS-10',
    operator: 'Slamet Riyadi',
    beratMasuk: 5250,
    step1: 'check',
    step2: 'check',
    step3: 'process',
    step4: 'pending',
    progress: 75,
    status: 'Proses'
  },
  {
    kodeBatch: 'PN-2606-0008',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    lokasi: 'DR-02',
    alatSortasi: 'Color Sorter CS-5',
    operator: 'Rina Agustina',
    beratMasuk: 4800,
    step1: 'check',
    step2: 'check',
    step3: 'process',
    step4: 'pending',
    progress: 66,
    status: 'Proses'
  },
  {
    kodeBatch: 'PN-2606-0009',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    lokasi: 'DR-01',
    alatSortasi: 'Vibro Separator VS-3',
    operator: 'Budi Santoso',
    beratMasuk: 3600,
    step1: 'check',
    step2: 'pending',
    step3: 'pending',
    step4: 'pending',
    progress: 25,
    status: 'Proses'
  }
];

export function useSortasi() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [batchList, setBatchList] = useState<SortasiBatchItem[]>(INITIAL_SORTASI_BATCH_LIST);
  const [filteredList, setFilteredList] = useState<SortasiBatchItem[]>(INITIAL_SORTASI_BATCH_LIST);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterAlat, setFilterAlat] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(24);
  const [totalPages, setTotalPages] = useState(3);

  // Options
  const komoditasOptions = useMemo(() => [
    { value: '', label: 'Semua Komoditas' },
    ...commodities.map((item: Commodity) => ({
      value: item.namaKomoditas,
      label: item.namaKomoditas
    }))
  ], [commodities]);

  const varietasOptions = useMemo(() => [
    { value: '', label: 'Semua Varietas' },
    ...varieties.map((item: Variety) => ({
      value: item.namaVarietas,
      label: item.namaVarietas
    }))
  ], [varieties]);

  const alatOptions = [
    { value: '', label: 'Semua Alat' },
    { value: 'Gravity Separator', label: 'Gravity Separator' },
    { value: 'Color Sorter', label: 'Color Sorter' },
    { value: 'Vibro Separator', label: 'Vibro Separator' },
  ];

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Proses', label: 'Proses' },
    { value: 'Pending', label: 'Pending' },
  ];

  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    ...lands.map((item: Land) => ({
      value: item.namaLahan,
      label: item.namaLahan
    }))
  ], [lands]);

  const handleApplyFilters = useCallback(() => {
    let result = [...INITIAL_SORTASI_BATCH_LIST];

    if (filterKomoditas?.value) {
      result = result.filter(item => item.komoditas === filterKomoditas.value);
    }
    if (filterVarietas?.value) {
      result = result.filter(item => item.varietas === filterVarietas.value);
    }
    if (filterAlat?.value) {
      result = result.filter(item => item.alatSortasi.includes(filterAlat.value));
    }
    if (filterStatus?.value) {
      result = result.filter(item => item.status === filterStatus.value);
    }

    setFilteredList(result);
    setCurrentPage(1);
  }, [filterKomoditas, filterVarietas, filterAlat, filterStatus]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterAlat(null);
    setFilterStatus(null);
    setFilterLokasi(null);
    setFilteredList(INITIAL_SORTASI_BATCH_LIST);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Batch Disortasi',
      value: '24',
      subtitle: 'Batch',
      icon: 'ri-sprout-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Berat Masuk',
      value: '125.650 Kg',
      subtitle: 'Dari 24 Batch',
      icon: 'ri-shopping-bag-3-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Hasil Lulus',
      value: '108.240 Kg',
      subtitle: '86,15% (Recovery)',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Hasil Tolak',
      value: '17.410 Kg',
      subtitle: '13,85% (Reject)',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
    {
      title: 'Sedang Diproses',
      value: '3',
      subtitle: 'Batch',
      icon: 'ri-time-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Selesai Hari Ini',
      value: '5',
      subtitle: 'Batch',
      icon: 'ri-checkbox-circle-fill',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
  ], []);

  return {
    batchList: filteredList,
    prosesAktifList: INITIAL_PROSES_AKTIF_LIST,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterAlat,
    setFilterAlat,
    filterStatus,
    setFilterStatus,
    filterLokasi,
    setFilterLokasi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    komoditasOptions,
    varietasOptions,
    alatOptions,
    statusOptions,
    lokasiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems
  };
}

export default useSortasi;
