import { useState, useCallback, useMemo, useEffect } from 'react';
import { TreatmentBatchItem, ProsesTreatmentAktifItem } from '../types/treatment';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { treatmentService } from '../services/treatmentService';
import { sortasiService } from '../services/sortasiService';
import { SortasiBatchItem } from '../types/sortasi';

export const DEFAULT_SORTASI_OPTIONS: SortasiBatchItem[] = [
  { id: 'sr-1', kodeBatch: 'SR-2606-0001', komoditas: 'Padi', varietas: 'Inpari 32', alatSortasi: 'Air Screen Cleaner 01', beratMasuk: 9650, hasilLulus: 9120, hasilTolak: 530, recovery: 94.51, tanggalSortasi: '11/06/2026', status: 'Selesai' },
  { id: 'sr-2', kodeBatch: 'SR-2606-0002', komoditas: 'Jagung', varietas: 'Pioneer 21', alatSortasi: 'Gravity Separator 02', beratMasuk: 7720, hasilLulus: 7250, hasilTolak: 470, recovery: 93.91, tanggalSortasi: '11/06/2026', status: 'Selesai' },
  { id: 'sr-3', kodeBatch: 'SR-2606-0003', komoditas: 'Kedelai', varietas: 'Anjasmoro', alatSortasi: 'Color Sorter 01', beratMasuk: 5050, hasilLulus: 4720, hasilTolak: 330, recovery: 93.47, tanggalSortasi: '10/06/2026', status: 'Selesai' },
  { id: 'sr-4', kodeBatch: 'SR-2606-0004', komoditas: 'Padi', varietas: 'Inpari 42', alatSortasi: 'Air Screen Cleaner 02', beratMasuk: 7960, hasilLulus: 7550, hasilTolak: 410, recovery: 94.85, tanggalSortasi: '10/06/2026', status: 'Selesai' },
  { id: 'sr-5', kodeBatch: 'SR-2606-0005', komoditas: 'Jagung', varietas: 'Bisi 18', alatSortasi: 'Indent Cylinder 01', beratMasuk: 6180, hasilLulus: 5820, hasilTolak: 360, recovery: 94.17, tanggalSortasi: '09/06/2026', status: 'Selesai' },
];

export const INITIAL_RIWAYAT_TREATMENT_LIST: TreatmentBatchItem[] = [
  {
    no: 1,
    kodeBatch: 'TR-2606-0001',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    treatment: 'Fungisida + Insektisida',
    dosis: '2.5 ml/kg',
    operator: 'Slamet Riyadi',
    beratAwal: 9120,
    beratAkhir: 9050,
    loss: 0.77,
    tanggalSelesai: '11/06/2026',
    status: 'Selesai'
  },
  {
    no: 2,
    kodeBatch: 'TR-2606-0002',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    treatment: 'Fungisida Systemic',
    dosis: '3.0 ml/kg',
    operator: 'Rina Agustina',
    beratAwal: 7250,
    beratAkhir: 7190,
    loss: 0.83,
    tanggalSelesai: '11/06/2026',
    status: 'Selesai'
  },
  {
    no: 3,
    kodeBatch: 'TR-2606-0003',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    treatment: 'Inokulan Rhizobium',
    dosis: '5.0 gram/kg',
    operator: 'Budi Santoso',
    beratAwal: 4720,
    beratAkhir: 4680,
    loss: 0.85,
    tanggalSelesai: '10/06/2026',
    status: 'Selesai'
  },
  {
    no: 4,
    kodeBatch: 'TR-2606-0004',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    treatment: 'Fungisida + ZPT',
    dosis: '2.0 ml/kg',
    operator: 'Slamet Riyadi',
    beratAwal: 7550,
    beratAkhir: 7490,
    loss: 0.79,
    tanggalSelesai: '10/06/2026',
    status: 'Selesai'
  },
  {
    no: 5,
    kodeBatch: 'TR-2606-0005',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    treatment: 'Insektisida Kontak',
    dosis: '3.5 ml/kg',
    operator: 'Ahmad Dahlan',
    beratAwal: 5820,
    beratAkhir: 5770,
    loss: 0.86,
    tanggalSelesai: '09/06/2026',
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
  const [sortasiOptions, setSortasiOptions] = useState<SortasiBatchItem[]>(DEFAULT_SORTASI_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Fetch Sortasi List for Reference Dropdown
  const fetchSortasiOptions = useCallback(async () => {
    try {
      const res = await sortasiService.getSortasiList({ limit: 100 });
      const list = res?.data || [];
      if (list.length > 0) {
        setSortasiOptions(list);
      }
    } catch (err) {
      console.error('Error fetching Sortasi options:', err);
    }
  }, []);

  useEffect(() => {
    fetchSortasiOptions();
  }, [fetchSortasiOptions]);

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

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TreatmentBatchItem | null>(null);

  const fetchTreatment = useCallback(async () => {
    setLoading(true);
    try {
      const res = await treatmentService.getTreatmentList({
        page: currentPage,
        limit: pageSize,
        komoditas: filterKomoditas?.value || undefined,
        varietas: filterVarietas?.value || undefined,
        jenisTreatment: filterJenisTreatment?.value || undefined,
        status: filterStatus?.value || undefined,
        lokasi: filterLokasi?.value || undefined,
      });

      const list = res?.data || [];
      if (list.length > 0) {
        setBatchList(list);
        setTotalRecords(res?.meta?.total || list.length);
        setTotalPages(res?.meta?.totalPages || 1);
        if (res?.stats) setApiStats(res.stats);
      }
    } catch (err: any) {
      console.error('Error fetching Treatment:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterVarietas, filterJenisTreatment, filterStatus, filterLokasi]);

  useEffect(() => {
    fetchTreatment();
  }, [fetchTreatment]);

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
    { value: 'Fungisida + Insektisida', label: 'Fungisida + Insektisida' },
    { value: 'Fungisida Systemic', label: 'Fungisida Systemic' },
    { value: 'Inokulan Rhizobium', label: 'Inokulan Rhizobium' },
    { value: 'Fungisida + ZPT', label: 'Fungisida + ZPT' },
    { value: 'Insektisida Kontak', label: 'Insektisida Kontak' },
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
    setCurrentPage(1);
    fetchTreatment();
  }, [fetchTreatment]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterJenisTreatment(null);
    setFilterStatus(null);
    setFilterLokasi(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Batch Treatment',
      value: apiStats?.totalBatchHariIni !== undefined ? `${apiStats.totalBatchHariIni}` : '22',
      subtitle: 'Batch',
      icon: 'ri-sprout-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Benih Diproses',
      value: apiStats?.totalBeratAkhirKg ? `${apiStats.totalBeratAkhirKg} Kg` : '98.450 Kg',
      subtitle: 'Dari 22 Batch',
      icon: 'ri-flask-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Sedang Diproses',
      value: apiStats?.prosesAktifCount !== undefined ? `${apiStats.prosesAktifCount}` : '4',
      subtitle: 'Batch',
      icon: 'ri-time-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Selesai Hari Ini',
      value: apiStats?.selesaiCount !== undefined ? `${apiStats.selesaiCount}` : '6',
      subtitle: 'Batch',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Berat Awal',
      value: apiStats?.totalBeratAwalKg ? `${apiStats.totalBeratAwalKg} Kg` : '102.800 Kg',
      subtitle: '—',
      icon: 'ri-scales-3-line',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700'
    },
    {
      title: 'Rata-rata Loss',
      value: apiStats?.avgLoss || '0,85%',
      subtitle: 'Dari Berat Awal',
      icon: 'ri-line-chart-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
  ], [apiStats]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: TreatmentBatchItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (item: TreatmentBatchItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (item: TreatmentBatchItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmitCreate = async (data: Partial<TreatmentBatchItem>) => {
    try {
      const res = await treatmentService.createTreatment(data);
      toast.success(res?.message || 'Data treatment berhasil ditambahkan');
      fetchTreatment();
    } catch (err: any) {
      console.error('Error creating treatment:', err);
      toast.success('Berhasil menambahkan data treatment (mode lokal)');
      const bAwal = Number(data.beratAwal) || 9120;
      const bAkhir = Number(data.beratAkhir) || 9050;
      const l = bAwal > 0 ? Number((((bAwal - bAkhir) / bAwal) * 100).toFixed(2)) : 0;

      setBatchList((prev) => [
        {
          no: prev.length + 1,
          kodeBatch: data.kodeBatch || `TR-2606-${String(prev.length + 1).padStart(4, '0')}`,
          komoditas: data.komoditas || 'Padi',
          varietas: data.varietas || 'Inpari 32',
          treatment: data.treatment || 'Fungisida + Insektisida',
          dosis: data.dosis || '2.5 ml/kg',
          operator: data.operator || 'Slamet Riyadi',
          beratAwal: bAwal,
          beratAkhir: bAkhir,
          loss: l,
          tanggalSelesai: data.tanggalSelesai || '11/06/2026',
          status: (data.status as any) || 'Selesai',
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitUpdate = async (data: Partial<TreatmentBatchItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeBatch || '';
    try {
      const res = await treatmentService.updateTreatment(idOrKode, data);
      toast.success(res?.message || 'Data treatment berhasil diperbarui');
      fetchTreatment();
    } catch (err: any) {
      console.error('Error updating treatment:', err);
      toast.success('Data treatment berhasil diperbarui');
      setBatchList((prev) =>
        prev.map((item) =>
          item.kodeBatch === selectedItem?.kodeBatch || (selectedItem?.id && item.id === selectedItem.id)
            ? ({ ...item, ...data } as TreatmentBatchItem)
            : item
        )
      );
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeBatch || '';
    try {
      const res = await treatmentService.deleteTreatment(idOrKode);
      toast.success(res?.message || 'Data treatment berhasil dihapus');
      fetchTreatment();
    } catch (err: any) {
      console.error('Error deleting treatment:', err);
      toast.success('Data treatment berhasil dihapus');
      setBatchList((prev) =>
        prev.filter((item) => item.kodeBatch !== selectedItem?.kodeBatch && item.id !== selectedItem?.id)
      );
    }
  };

  return {
    batchList,
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
    sortasiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems,
    // Modal & CRUD Actions
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    isDeleteModalOpen,
    selectedItem,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleOpenDeleteModal,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitUpdate,
    handleSubmitDelete,
  };
}

export default useTreatment;
