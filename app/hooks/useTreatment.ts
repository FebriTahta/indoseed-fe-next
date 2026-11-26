import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  TreatmentBatchItem,
  TreatmentStats,
  ReferensiGudangBahanItem,
} from '../types/treatment';
import { toast } from 'react-toastify';
import { treatmentService } from '../services/treatmentService';

export const INITIAL_TREATMENT_BATCH_LIST: TreatmentBatchItem[] = [
  {
    no: 1,
    kodeBatch: 'TR-2026-06-001',
    tanggalProses: '02 Jun 2026',
    tanggalSelesai: '02 Jun 2026',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-001 / Blok 01',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    metodeTreatment: 'Fungisida',
    bahan: 'Carbendazim',
    jumlahBenih: 200,
    beratAwal: 200,
    beratAkhir: 198.5,
    loss: 0.75,
    dosis: '2.5 ml/kg',
    treatment: 'Fungisida (Carbendazim)',
    operator: 'Admin Produksi',
    status: 'Selesai',
    lokasi: 'Ruang Treatment 1',
    catatan: 'Benih terlihat sehat dan tidak ada kontaminasi. Siap untuk proses pengemasan.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00021',
    tahapanProses: [
      { nama: 'Persiapan', tanggal: '02 Jun', status: 'completed' },
      { nama: 'Perendaman', tanggal: '02 Jun', status: 'completed' },
      { nama: 'Pengeringan', tanggal: '02 Jun', status: 'completed' },
      { nama: 'Selesai', tanggal: '02 Jun', status: 'completed' },
    ],
    riwayatTreatment: [
      { tanggal: '02 Jun 2026 14:35', aktivitas: 'Proses selesai', operator: 'Admin Produksi' },
      { tanggal: '02 Jun 2026 10:20', aktivitas: 'Pengeringan', operator: 'Admin Produksi' },
      { tanggal: '02 Jun 2026 08:10', aktivitas: 'Perendaman', operator: 'Admin Produksi' },
      { tanggal: '02 Jun 2026 07:45', aktivitas: 'Persiapan', operator: 'Admin Produksi' },
    ],
    fotoDokumentasi: [
      'https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format&fit=crop&q=60',
    ],
  },
  {
    no: 2,
    kodeBatch: 'TR-2026-06-002',
    tanggalProses: '03 Jun 2026',
    tanggalSelesai: '03 Jun 2026',
    petani: 'Siti Rahayu',
    petaniKode: 'SRN-002',
    lahan: 'LHN-002 / Blok 02',
    komoditas: 'Cabai',
    varietas: 'Cabai Keriting',
    metodeTreatment: 'Insektisida',
    bahan: 'Imidakloprid',
    jumlahBenih: 150,
    beratAwal: 150,
    beratAkhir: 148.8,
    loss: 0.8,
    dosis: '2.0 ml/kg',
    treatment: 'Insektisida (Imidakloprid)',
    operator: 'Admin Produksi',
    status: 'Selesai',
    lokasi: 'Ruang Treatment 1',
    catatan: 'Perendaman benih cabai berjalan optimal dengan daya rekat baik.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00030',
  },
  {
    no: 3,
    kodeBatch: 'TR-2026-06-003',
    tanggalProses: '04 Jun 2026',
    tanggalSelesai: '04 Jun 2026',
    petani: 'Agus Setiawan',
    petaniKode: 'AGS-003',
    lahan: 'LHN-003 / Blok Utara',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    metodeTreatment: 'Fungisida',
    bahan: 'Mancozeb',
    jumlahBenih: 300,
    beratAwal: 300,
    beratAkhir: 297.6,
    loss: 0.8,
    dosis: '3.0 g/kg',
    treatment: 'Fungisida (Mancozeb)',
    operator: 'Admin Produksi',
    status: 'Selesai',
    lokasi: 'Ruang Treatment 2',
    catatan: 'Benih padi telah dilapisi mancozeb merata untuk proteksi blas.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00024',
  },
  {
    no: 4,
    kodeBatch: 'TR-2026-06-004',
    tanggalProses: '06 Jun 2026',
    tanggalSelesai: '06 Jun 2026',
    petani: 'Dewi Lestari',
    petaniKode: 'DLR-004',
    lahan: 'LHN-004 / Blok 02',
    komoditas: 'Tomat',
    varietas: 'Grand Rapids',
    metodeTreatment: 'ZPT',
    bahan: 'Asam Humat',
    jumlahBenih: 100,
    beratAwal: 100,
    beratAkhir: 99.2,
    loss: 0.8,
    dosis: '1.5 ml/kg',
    treatment: 'ZPT (Asam Humat)',
    operator: 'Admin Produksi',
    status: 'Dalam Proses',
    lokasi: 'Ruang Treatment 1',
    catatan: 'Proses perendaman dengan asam humat sedang berjalan di bak 2.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00032',
  },
  {
    no: 5,
    kodeBatch: 'TR-2026-06-005',
    tanggalProses: '08 Jun 2026',
    tanggalSelesai: '08 Jun 2026',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-005 / Blok 03',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    metodeTreatment: 'Insektisida',
    bahan: 'Thiamethoxam',
    jumlahBenih: 250,
    beratAwal: 250,
    beratAkhir: 247.9,
    loss: 0.84,
    dosis: '2.5 g/kg',
    treatment: 'Insektisida (Thiamethoxam)',
    operator: 'Admin Produksi',
    status: 'Dalam Proses',
    lokasi: 'Ruang Treatment 2',
    catatan: 'Pengeringan benih setelah perlakuan thiamethoxam sedang dilakukan.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00025',
  },
  {
    no: 6,
    kodeBatch: 'TR-2026-06-006',
    tanggalProses: '10 Jun 2026',
    tanggalSelesai: '10 Jun 2026',
    petani: 'Rini Wulandari',
    petaniKode: 'RW-005',
    lahan: 'LHN-006 / Blok 06',
    komoditas: 'Cabai',
    varietas: 'Rawit',
    metodeTreatment: 'Fungisida',
    bahan: 'Propikonazol',
    jumlahBenih: 120,
    beratAwal: 120,
    beratAkhir: 119.0,
    loss: 0.83,
    dosis: '2.0 ml/kg',
    treatment: 'Fungisida (Propikonazol)',
    operator: 'Admin Produksi',
    status: 'Menunggu',
    lokasi: 'Ruang Treatment 1',
    catatan: 'Menunggu antrean perendaman batch cabai rawit.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00026',
  },
  {
    no: 7,
    kodeBatch: 'TR-2026-06-007',
    tanggalProses: '12 Jun 2026',
    tanggalSelesai: '12 Jun 2026',
    petani: 'Endang Sulastri',
    petaniKode: 'ENS-007',
    lahan: 'LHN-007 / Blok 07',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    metodeTreatment: 'Insektisida',
    bahan: 'Emamektin',
    jumlahBenih: 400,
    beratAwal: 400,
    beratAkhir: 396.8,
    loss: 0.8,
    dosis: '2.0 g/kg',
    treatment: 'Insektisida (Emamektin)',
    operator: 'Admin Produksi',
    status: 'Menunggu',
    lokasi: 'Ruang Treatment 2',
    catatan: 'Menunggu bahan perlakuan emamektin disiapkan.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00024',
  },
  {
    no: 8,
    kodeBatch: 'TR-2026-06-008',
    tanggalProses: '15 Jun 2026',
    tanggalSelesai: '15 Jun 2026',
    petani: 'Slamet Riyadi',
    petaniKode: 'SRM-008',
    lahan: 'LHN-008 / Blok 08',
    komoditas: 'Kangkung',
    varietas: 'Bima',
    metodeTreatment: 'Biofungisida',
    bahan: 'Trichoderma',
    jumlahBenih: 100,
    beratAwal: 100,
    beratAkhir: 99.1,
    loss: 0.9,
    dosis: '5.0 g/kg',
    treatment: 'Biofungisida (Trichoderma)',
    operator: 'Admin Produksi',
    status: 'Selesai',
    lokasi: 'Ruang Treatment 1',
    catatan: 'Aplikasi agen hayati Trichoderma berjalan baik dan merata.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00028',
  },
  {
    no: 9,
    kodeBatch: 'TR-2026-06-009',
    tanggalProses: '18 Jun 2026',
    tanggalSelesai: '18 Jun 2026',
    petani: 'Tono Setiawan',
    petaniKode: 'TSW-009',
    lahan: 'LHN-009 / Blok 09',
    komoditas: 'Selada',
    varietas: 'Grand Rapids',
    metodeTreatment: 'ZPT',
    bahan: 'Rootone-F',
    jumlahBenih: 80,
    beratAwal: 80,
    beratAkhir: 79.4,
    loss: 0.75,
    dosis: '1.0 g/kg',
    treatment: 'ZPT (Rootone-F)',
    operator: 'Admin Produksi',
    status: 'Selesai',
    lokasi: 'Ruang Treatment 1',
    catatan: 'Perangsang akar Rootone-F teraplikasikan secara optimal.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00029',
  },
  {
    no: 10,
    kodeBatch: 'TR-2026-06-010',
    tanggalProses: '20 Jun 2026',
    tanggalSelesai: '20 Jun 2026',
    petani: 'Sari Dewi',
    petaniKode: 'SDW-010',
    lahan: 'LHN-010 / Blok 10',
    komoditas: 'Cabai',
    varietas: 'Cabai Keriting',
    metodeTreatment: 'Insektisida',
    bahan: 'Abamektin',
    jumlahBenih: 150,
    beratAwal: 150,
    beratAkhir: 148.7,
    loss: 0.86,
    dosis: '1.5 ml/kg',
    treatment: 'Insektisida (Abamektin)',
    operator: 'Admin Produksi',
    status: 'Dalam Proses',
    lokasi: 'Ruang Treatment 2',
    catatan: 'Proses pelapisan benih cabai dengan abamektin sedang berputar di drum mixer.',
    dibuatOleh: 'Admin Produksi',
    noLot: 'LOT-2026-00030',
  },
];

export const DEFAULT_TREATMENT_STATS: TreatmentStats = {
  totalBatch: 12,
  totalBatchDelta: 2,
  totalBenihDiproses: '1.250 kg',
  totalBenihDeltaPercent: 18,
  batchSelesai: 10,
  batchSelesaiDelta: 3,
  dalamProses: 2,
  dalamProsesDelta: -1,
  batchBermasalah: 0,
  batchBermasalahDelta: 0,
  grafikProsesTreatment: [
    { komoditas: 'Melon', selesai: 380, dalamProses: 250, menunggu: 0 },
    { komoditas: 'Cabai', selesai: 150, dalamProses: 150, menunggu: 120 },
    { komoditas: 'Padi', selesai: 300, dalamProses: 0, menunggu: 400 },
    { komoditas: 'Tomat', selesai: 120, dalamProses: 100, menunggu: 0 },
    { komoditas: 'Kangkung', selesai: 100, dalamProses: 0, menunggu: 0 },
    { komoditas: 'Selada', selesai: 80, dalamProses: 0, menunggu: 0 },
  ],
  chartMetodeTreatment: [
    { nama: 'Fungisida', count: 5, persentase: 41.7, color: '#10B981' },
    { nama: 'Insektisida', count: 4, persentase: 33.3, color: '#0EA5E9' },
    { nama: 'ZPT', count: 2, persentase: 16.7, color: '#F59E0B' },
    { nama: 'Biofungisida', count: 1, persentase: 8.3, color: '#6366F1' },
  ],
  chartBahanTerbanyak: [
    { nama: 'Carbendazim', persentase: 20 },
    { nama: 'Imidakloprid', persentase: 15 },
    { nama: 'Mancozeb', persentase: 12 },
    { nama: 'Thiamethoxam', persentase: 10 },
    { nama: 'Propikonazol', persentase: 8 },
  ],
};

export default function useTreatment() {
  const [batchList, setBatchList] = useState<TreatmentBatchItem[]>(INITIAL_TREATMENT_BATCH_LIST);
  const [stats, setStats] = useState<TreatmentStats>(DEFAULT_TREATMENT_STATS);
  const [referensiGudangBahan, setReferensiGudangBahan] = useState<ReferensiGudangBahanItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Selection
  const [selectedDetailItem, setSelectedDetailItem] = useState<TreatmentBatchItem | null>(
    INITIAL_TREATMENT_BATCH_LIST[0]
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter States
  const [search, setSearch] = useState<string>('');
  const [filterPeriode, setFilterPeriode] = useState<string>('Semua Periode');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua Komoditas');
  const [filterStatus, setFilterStatus] = useState<string>('Semua Status');
  const [filterMetode, setFilterMetode] = useState<string>('Semua Metode');

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(2);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);
  const [itemToEdit, setItemToEdit] = useState<TreatmentBatchItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TreatmentBatchItem | null>(null);

  // Fetch Treatment list & stats
  const fetchTreatmentData = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: pageSize,
      };

      if (search) params.search = search;
      if (filterKomoditas && filterKomoditas !== 'Semua Komoditas') params.komoditas = filterKomoditas;
      if (filterStatus && filterStatus !== 'Semua Status') params.status = filterStatus;
      if (filterMetode && filterMetode !== 'Semua Metode') params.metodeTreatment = filterMetode;

      const res = await treatmentService.getTreatmentList(params);
      if (res && res.status === 'success') {
        const data = res.data || [];
        setBatchList(data);
        if (res.meta) {
          setTotalRecords(res.meta.total || data.length);
          setTotalPages(res.meta.totalPages || Math.ceil(data.length / pageSize));
        }
        if (res.stats) {
          setStats(res.stats);
        }

        // Keep current selected item updated or set to first item
        setSelectedDetailItem((prev) => {
          if (!prev && data.length > 0) return data[0];
          const found = data.find((d: TreatmentBatchItem) => d.id === prev?.id || d.kodeBatch === prev?.kodeBatch);
          return found || (data.length > 0 ? data[0] : null);
        });
      }
    } catch (error) {
      console.warn('Failed to fetch from treatment API, using initial sample data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, filterKomoditas, filterStatus, filterMetode]);

  // Fetch Referensi Gudang Bahan Belum Diproses (Status: 'Sudah Sortasi')
  const fetchReferensiGudangBahan = useCallback(async () => {
    try {
      const res = await treatmentService.getReferensiGudangBahan();
      if (res && res.status === 'success') {
        setReferensiGudangBahan(res.data || []);
      }
    } catch (error) {
      console.warn('Failed to fetch referensi gudang bahan:', error);
    }
  }, []);

  useEffect(() => {
    fetchTreatmentData();
  }, [fetchTreatmentData]);

  useEffect(() => {
    fetchReferensiGudangBahan();
  }, [fetchReferensiGudangBahan]);

  // Handle single item selection for Right Detail Panel
  const handleSelectBatch = useCallback((item: TreatmentBatchItem) => {
    setSelectedDetailItem(item);
  }, []);

  // Handle row checkbox selection
  const handleToggleSelectId = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(batchList.map((item) => item.id || item.kodeBatch));
      } else {
        setSelectedIds([]);
      }
    },
    [batchList]
  );

  // Filter options
  const komoditasOptions = useMemo(() => {
    const defaultList = ['Melon', 'Cabai', 'Padi', 'Tomat', 'Kangkung', 'Selada'];
    return ['Semua Komoditas', ...defaultList];
  }, []);

  const statusOptions = useMemo(() => {
    return ['Semua Status', 'Selesai', 'Dalam Proses', 'Menunggu'];
  }, []);

  const periodeOptions = useMemo(() => {
    return ['Semua Periode', 'Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Tahun Ini'];
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch('');
    setFilterPeriode('Semua Periode');
    setFilterKomoditas('Semua Komoditas');
    setFilterStatus('Semua Status');
    setFilterMetode('Semua Metode');
    setCurrentPage(1);
  }, []);

  // Modal open/close handlers
  const handleOpenAddModal = useCallback(() => {
    setItemToEdit(null);
    setIsAddModalOpen(true);
    fetchReferensiGudangBahan();
  }, [fetchReferensiGudangBahan]);

  const handleOpenEditModal = useCallback((item: TreatmentBatchItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
    fetchReferensiGudangBahan();
  }, [fetchReferensiGudangBahan]);

  const handleOpenDeleteModal = useCallback((item: TreatmentBatchItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

  const handleOpenDocModal = useCallback((item?: TreatmentBatchItem) => {
    if (item) setSelectedDetailItem(item);
    setIsDocModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDocModalOpen(false);
    setItemToEdit(null);
    setItemToDelete(null);
  }, []);

  // Submit Create Treatment
  const handleSubmitCreate = useCallback(
    async (payload: Partial<TreatmentBatchItem>) => {
      try {
        setIsSaving(true);
        const res = await treatmentService.createTreatment(payload);
        if (res && res.status === 'success') {
          toast.success(res.message || 'Proses treatment berhasil ditambahkan!');
          handleCloseModals();
          fetchTreatmentData();
          fetchReferensiGudangBahan();
        } else {
          toast.error(res?.message || 'Gagal menambahkan treatment.');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message || 'Terjadi kesalahan sistem.');
      } finally {
        setIsSaving(false);
      }
    },
    [fetchTreatmentData, fetchReferensiGudangBahan, handleCloseModals]
  );

  // Submit Update Treatment
  const handleSubmitUpdate = useCallback(
    async (payload: Partial<TreatmentBatchItem>) => {
      if (!itemToEdit?.id && !itemToEdit?.kodeBatch) return;
      try {
        setIsSaving(true);
        const targetId = itemToEdit.id || itemToEdit.kodeBatch;
        const res = await treatmentService.updateTreatment(targetId, payload);
        if (res && res.status === 'success') {
          toast.success(res.message || 'Data treatment berhasil diperbarui!');
          handleCloseModals();
          fetchTreatmentData();
          fetchReferensiGudangBahan();
        } else {
          toast.error(res?.message || 'Gagal memperbarui data treatment.');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || error.message || 'Terjadi kesalahan.');
      } finally {
        setIsSaving(false);
      }
    },
    [itemToEdit, fetchTreatmentData, fetchReferensiGudangBahan, handleCloseModals]
  );

  // Submit Delete Treatment
  const handleSubmitDelete = useCallback(async () => {
    if (!itemToDelete?.id && !itemToDelete?.kodeBatch) return;
    try {
      setIsSaving(true);
      const targetId = itemToDelete.id || itemToDelete.kodeBatch;
      const res = await treatmentService.deleteTreatment(targetId);
      if (res && res.status === 'success') {
        toast.success(res.message || 'Data treatment berhasil dihapus!');
        handleCloseModals();
        fetchTreatmentData();
      } else {
        toast.error(res?.message || 'Gagal menghapus data treatment.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Terjadi kesalahan.');
    } finally {
      setIsSaving(false);
    }
  }, [itemToDelete, fetchTreatmentData, handleCloseModals]);

  return {
    batchList,
    stats,
    referensiGudangBahan,
    loading,
    isSaving,
    // Selection
    selectedDetailItem,
    handleSelectBatch,
    selectedIds,
    handleToggleSelectId,
    handleSelectAll,
    // Filters
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterStatus,
    setFilterStatus,
    filterMetode,
    setFilterMetode,
    komoditasOptions,
    statusOptions,
    periodeOptions,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Modals
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isDocModalOpen,
    itemToEdit,
    itemToDelete,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenDocModal,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitUpdate,
    handleSubmitDelete,
  };
}
