import { useState, useCallback, useMemo } from 'react';
import { KesiapanPanenItem } from '../types/kesiapanPanen';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

export const INITIAL_KESIAPAN_PANEN_LIST: KesiapanPanenItem[] = [
  {
    no: 1,
    kodeLahan: 'LA-2605-0001',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    tanggalTanam: '01/03/2026',
    umurHst: 102,
    prediksiPanen: '12/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 1320
  },
  {
    no: 2,
    kodeLahan: 'LA-2605-0002',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    tanggalTanam: '05/03/2026',
    umurHst: 98,
    prediksiPanen: '14/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 1180
  },
  {
    no: 3,
    kodeLahan: 'LA-2605-0003',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    tanggalTanam: '10/03/2026',
    umurHst: 95,
    prediksiPanen: '16/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 1210
  },
  {
    no: 4,
    kodeLahan: 'LA-2605-0004',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    tanggalTanam: '02/03/2026',
    umurHst: 101,
    prediksiPanen: '13/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 1290
  },
  {
    no: 5,
    kodeLahan: 'LA-2605-0005',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    tanggalTanam: '06/03/2026',
    umurHst: 97,
    prediksiPanen: '15/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 1150
  },
  {
    no: 6,
    kodeLahan: 'LA-2605-0006',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    tanggalTanam: '03/03/2026',
    umurHst: 100,
    prediksiPanen: '17/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 1210
  },
  {
    no: 7,
    kodeLahan: 'LA-2605-0007',
    komoditas: 'Kedelai',
    varietas: 'Dega 1',
    tanggalTanam: '12/03/2026',
    umurHst: 93,
    prediksiPanen: '18/06/2026',
    statusKesiapan: 'Akan Siap (8-14 Hari)',
    yieldEst: 1080
  },
  {
    no: 8,
    kodeLahan: 'LA-2605-0008',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    tanggalTanam: '08/03/2026',
    umurHst: 95,
    prediksiPanen: '19/06/2026',
    statusKesiapan: 'Akan Siap (8-14 Hari)',
    yieldEst: 1160
  },
  {
    no: 9,
    kodeLahan: 'LA-2605-0009',
    komoditas: 'Padi',
    varietas: 'Mekongga',
    tanggalTanam: '04/03/2026',
    umurHst: 99,
    prediksiPanen: '20/06/2026',
    statusKesiapan: 'Belum Siap',
    yieldEst: 1050
  },
  {
    no: 10,
    kodeLahan: 'LA-2605-0010',
    komoditas: 'Padi',
    varietas: 'Sintanur',
    tanggalTanam: '07/03/2026',
    umurHst: 96,
    prediksiPanen: '21/06/2026',
    statusKesiapan: 'Belum Siap',
    yieldEst: 1020
  }
];

export function useKesiapanPanen() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [kesiapanList, setKesiapanList] = useState<KesiapanPanenItem[]>(INITIAL_KESIAPAN_PANEN_LIST);
  const [filteredList, setFilteredList] = useState<KesiapanPanenItem[]>(INITIAL_KESIAPAN_PANEN_LIST);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(28);
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

  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    ...lands.map((item: Land) => ({
      value: item.namaLahan,
      label: item.namaLahan
    }))
  ], [lands]);

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Siap Panen', label: 'Siap Panen' },
    { value: 'Akan Siap (3-7 Hari)', label: 'Akan Siap (3-7 Hari)' },
    { value: 'Akan Siap (8-14 Hari)', label: 'Akan Siap (8-14 Hari)' },
    { value: 'Belum Siap', label: 'Belum Siap' },
  ];

  const handleApplyFilters = useCallback(() => {
    let result = [...INITIAL_KESIAPAN_PANEN_LIST];

    if (filterKomoditas?.value) {
      result = result.filter(item => item.komoditas === filterKomoditas.value);
    }
    if (filterVarietas?.value) {
      result = result.filter(item => item.varietas === filterVarietas.value);
    }
    if (filterLokasi?.value) {
      result = result.filter(item => item.kodeLahan.includes(filterLokasi.value));
    }
    if (filterStatus?.value) {
      result = result.filter(item => item.statusKesiapan === filterStatus.value);
    }

    setFilteredList(result);
    setCurrentPage(1);
  }, [filterKomoditas, filterVarietas, filterLokasi, filterStatus]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterLokasi(null);
    setFilterStatus(null);
    setFilteredList(INITIAL_KESIAPAN_PANEN_LIST);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Lahan',
      value: '86,45 Ha',
      subtitle: 'Luas Terdaftar',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Siap Panen',
      value: '28,32 Ha',
      subtitle: '32,72% dari total',
      icon: 'ri-time-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Akan Siap (3-7 Hari)',
      value: '21,15 Ha',
      subtitle: '24,45% dari total',
      icon: 'ri-hourglass-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Akan Siap (8-14 Hari)',
      value: '18,60 Ha',
      subtitle: '21,47% dari total',
      icon: 'ri-hourglass-fill',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700'
    },
    {
      title: 'Belum Siap',
      value: '15,38 Ha',
      subtitle: '17,76% dari total',
      icon: 'ri-error-warning-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
    {
      title: 'Rata-rata Yield Est.',
      value: '1.245 Kg/Ha',
      subtitle: 'Dari target 1.100 Kg/Ha',
      icon: 'ri-bar-chart-fill',
      bgColor: 'bg-teal-100/80',
      textColor: 'text-teal-700'
    },
  ], []);

  return {
    kesiapanList: filteredList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterLokasi,
    setFilterLokasi,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    komoditasOptions,
    varietasOptions,
    lokasiOptions,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems
  };
}

export default useKesiapanPanen;
