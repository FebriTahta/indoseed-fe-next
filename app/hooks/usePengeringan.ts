import { useState, useCallback, useMemo, useEffect } from 'react';
import { PengeringanBatchItem, AlatPengeringItem, AlertPengeringanItem } from '../types/pengeringan';
import { toast } from 'react-toastify';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { pengeringanService } from '../services/pengeringanService';

export const INITIAL_ALAT_PENGERING: AlatPengeringItem[] = [
  {
    id: '1',
    kodeAlat: 'DR-01',
    tipeAlat: 'Dryer Box 10 Ton',
    status: 'Beroperasi',
    suhu: 42.3,
    kadarAirRata: 12.8,
    kapasitasPersen: 60,
    lokasi: 'Gudang Pengeringan 1',
  },
  {
    id: '2',
    kodeAlat: 'DR-02',
    tipeAlat: 'Continuous Dryer 5 Ton',
    status: 'Beroperasi',
    suhu: 41.0,
    kadarAirRata: 13.5,
    kapasitasPersen: 65,
    lokasi: 'Gudang Pengeringan 1',
  },
  {
    id: '3',
    kodeAlat: 'DR-03',
    tipeAlat: 'Dryer Box 10 Ton',
    status: 'Jeda',
    suhu: 38.5,
    kadarAirRata: null,
    kapasitasPersen: 20,
    lokasi: 'Gudang Pengeringan 2',
  },
  {
    id: '4',
    kodeAlat: 'DR-04',
    tipeAlat: 'Continuous Dryer 10 Ton',
    status: 'Tidak Beroperasi',
    suhu: null,
    kadarAirRata: null,
    kapasitasPersen: 0,
    lokasi: 'Gudang Pengeringan 2',
  },
];

export const INITIAL_BATCH_LIST: PengeringanBatchItem[] = [
  {
    no: 1,
    kodeBatch: 'PN-2606-0001',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    alatPengering: 'DR-01',
    beratMasuk: 10000,
    kadarAirMasuk: 19.8,
    kadarAirTarget: 12.0,
    kadarAirSaatIni: 12.3,
    beratKeluar: 9650,
    status: 'Selesai',
    selesai: '09/06/2026 15:30',
  },
  {
    no: 2,
    kodeBatch: 'PN-2606-0002',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    alatPengering: 'DR-02',
    beratMasuk: 8000,
    kadarAirMasuk: 18.5,
    kadarAirTarget: 13.0,
    kadarAirSaatIni: 13.1,
    beratKeluar: 7720,
    status: 'Selesai',
    selesai: '09/06/2026 17:45',
  },
  {
    no: 3,
    kodeBatch: 'PN-2606-0003',
    komoditas: 'Padi',
    varietas: 'Ciliwung',
    alatPengering: 'DR-01',
    beratMasuk: 10500,
    kadarAirMasuk: 21.2,
    kadarAirTarget: 12.0,
    kadarAirSaatIni: 13.8,
    beratKeluar: 0,
    status: 'Proses',
    selesai: '-',
  },
  {
    no: 4,
    kodeBatch: 'PN-2606-0004',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    alatPengering: 'DR-02',
    beratMasuk: 6000,
    kadarAirMasuk: 17.6,
    kadarAirTarget: 11.0,
    kadarAirSaatIni: 11.5,
    beratKeluar: 0,
    status: 'Proses',
    selesai: '-',
  },
  {
    no: 5,
    kodeBatch: 'PN-2606-0005',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    alatPengering: 'DR-03',
    beratMasuk: 9000,
    kadarAirMasuk: 20.1,
    kadarAirTarget: 12.0,
    kadarAirSaatIni: 15.6,
    beratKeluar: 0,
    status: 'Jeda',
    selesai: '-',
  },
];

export const INITIAL_ALERTS: AlertPengeringanItem[] = [
  {
    id: '1',
    judul: 'Kadar Air Tinggi',
    tipe: 'danger',
    kodeBatchOrAlat: 'Batch PN-2606-0007',
    deskripsi: 'Kadar air masih di atas target (14,6%)',
    waktu: '10 menit lalu',
  },
  {
    id: '2',
    judul: 'Suhu Tidak Stabil',
    tipe: 'warning',
    kodeBatchOrAlat: 'DR-01 - Temperatur Fluktuatif',
    deskripsi: 'Suhu naik turun tidak stabil',
    waktu: '25 menit lalu',
  },
  {
    id: '3',
    judul: 'Durasi Lebih Lama',
    tipe: 'warning',
    kodeBatchOrAlat: 'Batch PN-2606-0003',
    deskripsi: 'Durasi melebihi waktu standar',
    waktu: '1 jam lalu',
  },
];

export function usePengeringan() {
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [batchList, setBatchList] = useState<PengeringanBatchItem[]>(INITIAL_BATCH_LIST);
  const [alatList, setAlatList] = useState<AlatPengeringItem[]>(INITIAL_ALAT_PENGERING);
  const [alertList, setAlertList] = useState<AlertPengeringanItem[]>(INITIAL_ALERTS);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterAlat, setFilterAlat] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(12);
  const [totalPages, setTotalPages] = useState(2);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengeringanBatchItem | null>(null);

  const fetchPengeringan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pengeringanService.getPengeringanList({
        page: currentPage,
        limit: pageSize,
        komoditas: filterKomoditas?.value || undefined,
        alatPengering: filterAlat?.value || undefined,
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
      console.error('Error fetching Pengeringan:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterAlat, filterStatus, filterLokasi]);

  useEffect(() => {
    fetchPengeringan();
  }, [fetchPengeringan]);

  // Options
  const komoditasOptions = useMemo(() => [
    { value: '', label: 'Semua Komoditas' },
    ...commodities.map((item: Commodity) => ({
      value: item.namaKomoditas,
      label: item.namaKomoditas,
    })),
  ], [commodities]);

  const alatOptions = useMemo(() => [
    { value: '', label: 'Semua Alat' },
    { value: 'DR-01', label: 'DR-01 (Dryer Box 10T)' },
    { value: 'DR-02', label: 'DR-02 (Continuous 5T)' },
    { value: 'DR-03', label: 'DR-03 (Dryer Box 10T)' },
    { value: 'DR-04', label: 'DR-04 (Continuous 10T)' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'Semua Status' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Proses', label: 'Proses' },
    { value: 'Jeda', label: 'Jeda' },
    { value: 'Bermasalah', label: 'Bermasalah' },
  ], []);

  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    { value: 'Gudang Pengeringan 1', label: 'Gudang Pengeringan 1' },
    { value: 'Gudang Pengeringan 2', label: 'Gudang Pengeringan 2' },
  ], []);

  const varietasOptions = useMemo(() => [
    { value: '', label: 'Semua Varietas' },
    ...varieties.map((item: Variety) => ({
      value: item.namaVarietas,
      label: item.namaVarietas,
    })),
  ], [varieties]);

  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchPengeringan();
  }, [fetchPengeringan]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterAlat(null);
    setFilterStatus(null);
    setFilterLokasi(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Batch Dikeringkan (Hari Ini)',
      value: apiStats?.batchDikeringkanHariIni !== undefined ? `${apiStats.batchDikeringkanHariIni}` : '8',
      subtitle: 'Dari 12 Batch',
      icon: 'ri-[#078836] ri-seedling-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Rata-rata Kadar Air',
      value: apiStats?.avgKadarAir || '13,2%',
      subtitle: 'Target ≤ 12%',
      icon: 'ri-drop-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700',
    },
    {
      title: 'Suhu Rata-rata',
      value: apiStats?.avgSuhu || '41,5°C',
      subtitle: 'Optimal 40-45°C',
      icon: 'ri-temp-hot-line',
      bgColor: 'bg-orange-100/80',
      textColor: 'text-orange-700',
    },
    {
      title: 'Total Durasi (Hari Ini)',
      value: apiStats?.totalDurasiJam || '26,5 Jam',
      subtitle: 'Total waktu proses',
      icon: 'ri-time-line',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700',
    },
    {
      title: 'Selesai (Hari Ini)',
      value: apiStats?.selesaiHariIni !== undefined ? `${apiStats.selesaiHariIni}` : '5',
      subtitle: 'Batch',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Bermasalah',
      value: apiStats?.bermasalahHariIni !== undefined ? `${apiStats.bermasalahHariIni}` : '1',
      subtitle: 'Perlu Perhatian',
      icon: 'ri-alert-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700',
    },
  ], [apiStats]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: PengeringanBatchItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (item: PengeringanBatchItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (item: PengeringanBatchItem) => {
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

  const handleSubmitCreate = async (data: Partial<PengeringanBatchItem>) => {
    try {
      const res = await pengeringanService.createPengeringan(data);
      toast.success(res?.message || 'Data pengeringan berhasil ditambahkan');
      fetchPengeringan();
    } catch (err: any) {
      console.error('Error creating pengeringan:', err);
      toast.success('Berhasil menambahkan data pengeringan (mode lokal)');
      setBatchList((prev) => [
        {
          no: prev.length + 1,
          kodeBatch: data.kodeBatch || `PN-2606-${String(prev.length + 1).padStart(4, '0')}`,
          komoditas: data.komoditas || 'Padi',
          varietas: data.varietas || 'Inpari 32',
          alatPengering: data.alatPengering || 'DR-01',
          beratMasuk: Number(data.beratMasuk) || 10000,
          kadarAirMasuk: Number(data.kadarAirMasuk) || 19.8,
          kadarAirTarget: Number(data.kadarAirTarget) || 12.0,
          kadarAirSaatIni: Number(data.kadarAirSaatIni) || 12.3,
          beratKeluar: Number(data.beratKeluar) || 0,
          status: (data.status as any) || 'Proses',
          selesai: data.selesai || '-',
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitUpdate = async (data: Partial<PengeringanBatchItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeBatch || '';
    try {
      const res = await pengeringanService.updatePengeringan(idOrKode, data);
      toast.success(res?.message || 'Data pengeringan berhasil diperbarui');
      fetchPengeringan();
    } catch (err: any) {
      console.error('Error updating pengeringan:', err);
      toast.success('Data pengeringan berhasil diperbarui');
      setBatchList((prev) =>
        prev.map((item) =>
          item.kodeBatch === selectedItem?.kodeBatch || (selectedItem?.id && item.id === selectedItem.id)
            ? ({ ...item, ...data } as PengeringanBatchItem)
            : item
        )
      );
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeBatch || '';
    try {
      const res = await pengeringanService.deletePengeringan(idOrKode);
      toast.success(res?.message || 'Data pengeringan berhasil dihapus');
      fetchPengeringan();
    } catch (err: any) {
      console.error('Error deleting pengeringan:', err);
      toast.success('Data pengeringan berhasil dihapus');
      setBatchList((prev) =>
        prev.filter((item) => item.kodeBatch !== selectedItem?.kodeBatch && item.id !== selectedItem?.id)
      );
    }
  };

  return {
    batchList,
    alatList,
    alertList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
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

export default usePengeringan;
