import { useState, useCallback, useMemo } from 'react';
import { TreatmentBatchItem, ProsesTreatmentAktifItem } from '../types/treatment';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

export const INITIAL_RIWAYAT_TREATMENT_LIST: TreatmentBatchItem[] = [
  {
    no: 1,
    kodeBatch: 'PN-2606-0005',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    treatment: 'Seed Coating (Protect+)',
    dosis: '2,5 ml/Kg',
    operator: 'Slamet Riyadi',
    beratAwal: 8750,
    beratAkhir: 8360,
    loss: 4.46,
    tanggalSelesai: '10/06/2026 07:50',
    status: 'Selesai'
  },
  {
    no: 2,
    kodeBatch: 'PN-2606-0006',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    treatment: 'Fungisida (Maxim XL)',
    dosis: '2 ml/Kg',
    operator: 'Rina Agustina',
    beratAwal: 7500,
    beratAkhir: 7170,
    loss: 4.40,
    tanggalSelesai: '09/06/2026 16:10',
    status: 'Selesai'
  },
  {
    no: 3,
    kodeBatch: 'PN-2606-0007',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    treatment: 'Insektisida (Actara 25 WG)',
    dosis: '1,5 g/Kg',
    operator: 'Budi Santoso',
    beratAwal: 5000,
    beratAkhir: 4800,
    loss: 4.00,
    tanggalSelesai: '09/06/2026 11:20',
    status: 'Selesai'
  },
  {
    no: 4,
    kodeBatch: 'PN-2606-0008',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    treatment: 'Bio Treatment (Trichoderma)',
    dosis: '3 g/Kg',
    operator: 'Dewi Lestari',
    beratAwal: 9000,
    beratAkhir: 8610,
    loss: 4.33,
    tanggalSelesai: '08/06/2026 14:30',
    status: 'Selesai'
  },
  {
    no: 5,
    kodeBatch: 'PN-2606-0009',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    treatment: 'Seed Coating (Protect+)',
    dosis: '2,5 ml/Kg',
    operator: 'Slamet Riyadi',
    beratAwal: 8300,
    beratAkhir: 7930,
    loss: 4.46,
    tanggalSelesai: '08/06/2026 10:20',
    status: 'Selesai'
  }
];

export const INITIAL_PROSES_TREATMENT_AKTIF_LIST: ProsesTreatmentAktifItem[] = [
  {
    kodeBatch: 'PN-2606-0001',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    lokasi: 'DR-01',
    treatment: 'Seed Coating (Protect+)',
    dosis: '2,5 ml / Kg Benih',
    operator: 'Slamet Riyadi',
    beratAwal: 10000,
    beratAkhir: 9560,
    loss: 4.40,
    mulai: '10/06/2026 09:15',
    selesaiEstimasi: '10/06/2026 11:00',
    progress: 75,
    status: 'Proses'
  },
  {
    kodeBatch: 'PN-2606-0002',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    lokasi: 'DR-02',
    treatment: 'Fungisida (Maxim XL)',
    dosis: '2 ml / Kg Benih',
    operator: 'Rina Agustina',
    beratAwal: 8000,
    beratAkhir: 7680,
    loss: 4.00,
    mulai: '10/06/2026 10:20',
    selesaiEstimasi: '10/06/2026 12:00',
    progress: 60,
    status: 'Proses'
  },
  {
    kodeBatch: 'PN-2606-0003',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    lokasi: 'DR-01',
    treatment: 'Insektisida (Actara 25 WG)',
    dosis: '1,5 g / Kg Benih',
    operator: 'Budi Santoso',
    beratAwal: 6000,
    beratAkhir: 5760,
    loss: 4.00,
    mulai: '10/06/2026 08:30',
    selesaiEstimasi: '10/06/2026 10:00',
    progress: 90,
    status: 'Proses'
  },
  {
    kodeBatch: 'PN-2606-0004',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    lokasi: 'DR-03',
    treatment: 'Bio Treatment (Trichoderma)',
    dosis: '3 g / Kg Benih',
    operator: 'Dewi Lestari',
    beratAwal: 9200,
    beratAkhir: 8820,
    loss: 4.13,
    mulai: '11/06/2026 09:00',
    selesaiEstimasi: '11/06/2026 10:30',
    progress: 20,
    status: 'Proses'
  }
];

export function useTreatment() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [batchList, setBatchList] = useState<TreatmentBatchItem[]>(INITIAL_RIWAYAT_TREATMENT_LIST);
  const [filteredList, setFilteredList] = useState<TreatmentBatchItem[]>(INITIAL_RIWAYAT_TREATMENT_LIST);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterJenisTreatment, setFilterJenisTreatment] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(22);
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

  const jenisTreatmentOptions = [
    { value: '', label: 'Semua Treatment' },
    { value: 'Seed Coating', label: 'Seed Coating' },
    { value: 'Fungisida', label: 'Fungisida' },
    { value: 'Insektisida', label: 'Insektisida' },
    { value: 'Bio Treatment', label: 'Bio Treatment' },
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
    let result = [...INITIAL_RIWAYAT_TREATMENT_LIST];

    if (filterKomoditas?.value) {
      result = result.filter(item => item.komoditas === filterKomoditas.value);
    }
    if (filterVarietas?.value) {
      result = result.filter(item => item.varietas === filterVarietas.value);
    }
    if (filterJenisTreatment?.value) {
      result = result.filter(item => item.treatment.includes(filterJenisTreatment.value));
    }
    if (filterStatus?.value) {
      result = result.filter(item => item.status === filterStatus.value);
    }

    setFilteredList(result);
    setCurrentPage(1);
  }, [filterKomoditas, filterVarietas, filterJenisTreatment, filterStatus]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterJenisTreatment(null);
    setFilterStatus(null);
    setFilterLokasi(null);
    setFilteredList(INITIAL_RIWAYAT_TREATMENT_LIST);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Batch Treatment',
      value: '22',
      subtitle: 'Batch',
      icon: 'ri-sprout-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Benih Diproses',
      value: '98.450 Kg',
      subtitle: 'Dari 22 Batch',
      icon: 'ri-flask-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Sedang Diproses',
      value: '4',
      subtitle: 'Batch',
      icon: 'ri-time-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Selesai Hari Ini',
      value: '6',
      subtitle: 'Batch',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Berat Awal',
      value: '102.800 Kg',
      subtitle: '—',
      icon: 'ri-scales-3-line',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700'
    },
    {
      title: 'Rata-rata Loss',
      value: '4,23%',
      subtitle: 'Dari Berat Awal',
      icon: 'ri-line-chart-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
  ], []);

  return {
    batchList: filteredList,
    prosesAktifList: INITIAL_PROSES_TREATMENT_AKTIF_LIST,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterJenisTreatment,
    setFilterJenisTreatment,
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
    jenisTreatmentOptions,
    statusOptions,
    lokasiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems
  };
}

export default useTreatment;
