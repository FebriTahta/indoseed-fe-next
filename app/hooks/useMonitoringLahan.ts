import { useState, useCallback, useMemo } from 'react';
import { MonitoringLahanItem } from '../types/monitoringLahan';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

export const INITIAL_MONITORING_LAHAN_LIST: MonitoringLahanItem[] = [
  {
    kodeLahan: 'LA-2605-0001',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 12.50,
    tanggalTanam: '01/05/2026',
    umurHst: '41 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0002',
    lokasi: 'Blok A - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    luas: 8.20,
    tanggalTanam: '05/05/2026',
    umurHst: '37 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0003',
    lokasi: 'Blok B - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    luas: 10.00,
    tanggalTanam: '10/05/2026',
    umurHst: '32 HST',
    kondisi: 'Perlu Perhatian',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0004',
    lokasi: 'Blok B - Petak 2',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    luas: 9.75,
    tanggalTanam: '02/05/2026',
    umurHst: '40 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0005',
    lokasi: 'Blok C - Petak 1',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    luas: 6.30,
    tanggalTanam: '08/05/2026',
    umurHst: '34 HST',
    kondisi: 'Buruk',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0006',
    lokasi: 'Blok C - Petak 2',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    luas: 11.20,
    tanggalTanam: '03/05/2026',
    umurHst: '39 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0007',
    lokasi: 'Blok D - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Dega 1',
    luas: 7.50,
    tanggalTanam: '—',
    umurHst: '—',
    kondisi: 'Belum Tanam',
    status: 'Rencana'
  },
  {
    kodeLahan: 'LA-2605-0008',
    lokasi: 'Blok D - Petak 2',
    komoditas: 'Padi',
    varietas: 'Mekongga',
    luas: 8.50,
    tanggalTanam: '—',
    umurHst: '—',
    kondisi: 'Belum Tanam',
    status: 'Rencana'
  }
];

export function useMonitoringLahan() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [lahanList, setLahanList] = useState<MonitoringLahanItem[]>(INITIAL_MONITORING_LAHAN_LIST);
  const [filteredList, setFilteredList] = useState<MonitoringLahanItem[]>(INITIAL_MONITORING_LAHAN_LIST);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKondisi, setFilterKondisi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(86);
  const [totalPages, setTotalPages] = useState(9);

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
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Rencana', label: 'Rencana' },
    { value: 'Pemeliharaan', label: 'Pemeliharaan' },
  ];

  const kondisiOptions = [
    { value: '', label: 'Semua Kondisi' },
    { value: 'Baik', label: 'Baik' },
    { value: 'Perlu Perhatian', label: 'Perlu Perhatian' },
    { value: 'Buruk', label: 'Buruk' },
    { value: 'Belum Tanam', label: 'Belum Tanam' },
  ];

  const handleApplyFilters = useCallback(() => {
    let result = [...INITIAL_MONITORING_LAHAN_LIST];

    if (filterKomoditas?.value) {
      result = result.filter(item => item.komoditas === filterKomoditas.value);
    }
    if (filterVarietas?.value) {
      result = result.filter(item => item.varietas === filterVarietas.value);
    }
    if (filterLokasi?.value) {
      result = result.filter(item => item.lokasi.includes(filterLokasi.value));
    }
    if (filterStatus?.value) {
      result = result.filter(item => item.status === filterStatus.value);
    }
    if (filterKondisi?.value) {
      result = result.filter(item => item.kondisi === filterKondisi.value);
    }

    setFilteredList(result);
    setCurrentPage(1);
  }, [filterKomoditas, filterVarietas, filterLokasi, filterStatus, filterKondisi]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterLokasi(null);
    setFilterStatus(null);
    setFilterKondisi(null);
    setFilteredList(INITIAL_MONITORING_LAHAN_LIST);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Lahan',
      value: '86,45 Ha',
      subtitle: 'Luas Total',
      icon: 'ri-landscape-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Lahan Aktif',
      value: '68,32 Ha',
      subtitle: '79,06%',
      icon: 'ri-[#078836] ri-seedling-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Dalam Pemeliharaan',
      value: '14 Lahan',
      subtitle: '16,28%',
      icon: 'ri-plant-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Kondisi Baik',
      value: '52 Lahan',
      subtitle: '60,47%',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Perlu Perhatian',
      value: '10 Lahan',
      subtitle: '11,63%',
      icon: 'ri-error-warning-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Kondisi Buruk',
      value: '2 Lahan',
      subtitle: '2,33%',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
  ], []);

  return {
    lahanList: filteredList,
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
    filterKondisi,
    setFilterKondisi,
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
    kondisiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems
  };
}

export default useMonitoringLahan;
