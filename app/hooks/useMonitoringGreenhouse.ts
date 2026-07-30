import { useState, useCallback, useMemo } from 'react';
import { MonitoringGreenhouseItem } from '../types/monitoringGreenhouse';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

export const INITIAL_GREENHOUSE_LIST: MonitoringGreenhouseItem[] = [
  {
    no: 1,
    kodeGreenhouse: 'GH-01',
    lokasi: 'Greenhouse A',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 1200,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 14:15'
  },
  {
    no: 2,
    kodeGreenhouse: 'GH-02',
    lokasi: 'Greenhouse A',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    luas: 1000,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 14:10'
  },
  {
    no: 3,
    kodeGreenhouse: 'GH-03',
    lokasi: 'Greenhouse B',
    komoditas: 'Tomat',
    varietas: 'Servo',
    luas: 900,
    status: 'Aktif',
    kondisi: 'Perlu Perhatian',
    aktivitasTerakhir: '11/06/2026 14:05'
  },
  {
    no: 4,
    kodeGreenhouse: 'GH-04',
    lokasi: 'Greenhouse B',
    komoditas: 'Cabai',
    varietas: 'Laris',
    luas: 800,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:50'
  },
  {
    no: 5,
    kodeGreenhouse: 'GH-05',
    lokasi: 'Greenhouse C',
    komoditas: 'Mentimun',
    varietas: 'Mistar',
    luas: 1100,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:45'
  },
  {
    no: 6,
    kodeGreenhouse: 'GH-06',
    lokasi: 'Greenhouse C',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 1200,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:40'
  },
  {
    no: 7,
    kodeGreenhouse: 'GH-07',
    lokasi: 'Greenhouse D',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    luas: 950,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:35'
  },
  {
    no: 8,
    kodeGreenhouse: 'GH-08',
    lokasi: 'Greenhouse D',
    komoditas: 'Tomat',
    varietas: 'Servo',
    luas: 800,
    status: 'Aktif',
    kondisi: 'Buruk',
    aktivitasTerakhir: '11/06/2026 13:20'
  }
];

export function useMonitoringGreenhouse() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [greenhouseList, setGreenhouseList] = useState<MonitoringGreenhouseItem[]>(INITIAL_GREENHOUSE_LIST);
  const [filteredList, setFilteredList] = useState<MonitoringGreenhouseItem[]>(INITIAL_GREENHOUSE_LIST);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKondisi, setFilterKondisi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(18);
  const [totalPages, setTotalPages] = useState(2);

  // Options
  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    ...lands.map((item: Land) => ({
      value: item.namaLahan,
      label: item.namaLahan
    }))
  ], [lands]);

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

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
    { value: 'Rencana', label: 'Rencana' },
  ];

  const kondisiOptions = [
    { value: '', label: 'Semua Kondisi' },
    { value: 'Baik', label: 'Baik' },
    { value: 'Perlu Perhatian', label: 'Perlu Perhatian' },
    { value: 'Buruk', label: 'Buruk' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  ];

  const handleApplyFilters = useCallback(() => {
    let result = [...INITIAL_GREENHOUSE_LIST];

    if (filterLokasi?.value) {
      result = result.filter(item => item.lokasi === filterLokasi.value);
    }
    if (filterKomoditas?.value) {
      result = result.filter(item => item.komoditas === filterKomoditas.value);
    }
    if (filterVarietas?.value) {
      result = result.filter(item => item.varietas === filterVarietas.value);
    }
    if (filterStatus?.value) {
      result = result.filter(item => item.status === filterStatus.value);
    }
    if (filterKondisi?.value) {
      result = result.filter(item => item.kondisi === filterKondisi.value);
    }

    setFilteredList(result);
    setCurrentPage(1);
  }, [filterLokasi, filterKomoditas, filterVarietas, filterStatus, filterKondisi]);

  const handleResetFilters = () => {
    setFilterLokasi(null);
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterStatus(null);
    setFilterKondisi(null);
    setFilteredList(INITIAL_GREENHOUSE_LIST);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Greenhouse',
      value: '18',
      subtitle: 'Unit',
      icon: 'ri-home-wifi-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Greenhouse Aktif',
      value: '15',
      subtitle: 'Unit (83,33%)',
      icon: 'ri-wifi-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Dalam Produksi',
      value: '12',
      subtitle: 'Unit (66,67%)',
      icon: 'ri-plant-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Kondisi Baik',
      value: '13',
      subtitle: 'Unit (72,22%)',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Perlu Perhatian',
      value: '2',
      subtitle: 'Unit (11,11%)',
      icon: 'ri-error-warning-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Kondisi Buruk',
      value: '1',
      subtitle: 'Unit (5,56%)',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
  ], []);

  return {
    greenhouseList: filteredList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterLokasi,
    setFilterLokasi,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    filterKondisi,
    setFilterKondisi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    lokasiOptions,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    kondisiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems
  };
}

export default useMonitoringGreenhouse;
