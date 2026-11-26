import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { BatchProduksiItem, ReferensiGudangBahanItem, BatchProduksiStats } from '../types/batchProduksi';
import { toast } from 'react-toastify';
import { batchProduksiService } from '../services/batchProduksiService';

export const INITIAL_28_BATCH_PRODUKSI: BatchProduksiItem[] = [
  { no: 1, kodeBatch: 'BP-2026-06-001', komoditas: 'Melon', varietas: 'Melon Tere F1', lokasi: 'GH-001', sumberBahan: 'LOT-2026-00021', tanggalMulai: '01 Jun 2026', tanggalSelesai: '18 Jun 2026', targetKg: 500, hasilKg: 480, yieldPercent: 96.0, status: 'Selesai', catatan: 'Batch Melon Tere F1 greenhouse utama telah memenuhi standar sertifikasi.' },
  { no: 2, kodeBatch: 'BP-2026-06-002', komoditas: 'Cabai', varietas: 'Cabai Keriting', lokasi: 'LH-002', sumberBahan: 'LOT-2026-00022', tanggalMulai: '03 Jun 2026', tanggalSelesai: '-', targetKg: 300, hasilKg: 120, yieldPercent: 40.0, status: 'Dalam Proses', catatan: 'Proses produksi benih cabai sedang berjalan di lahan terbuka.' },
  { no: 3, kodeBatch: 'BP-2026-06-003', komoditas: 'Tomat', varietas: 'Grand Rapids', lokasi: 'GH-003', sumberBahan: 'LOT-2026-00023', tanggalMulai: '04 Jun 2026', tanggalSelesai: '20 Jun 2026', targetKg: 400, hasilKg: 380, yieldPercent: 95.0, status: 'Selesai', catatan: 'Produksi benih tomat selesai dengan kemurnian 99%.' },
  { no: 4, kodeBatch: 'BP-2026-06-004', komoditas: 'Padi', varietas: 'Inpari 32', lokasi: 'LH-004', sumberBahan: 'LOT-2026-00024', tanggalMulai: '06 Jun 2026', tanggalSelesai: '-', targetKg: 600, hasilKg: 250, yieldPercent: 41.7, status: 'Dalam Proses', catatan: 'Padi Inpari 32 sedang dalam tahap pengolahan.' },
  { no: 5, kodeBatch: 'BP-2026-06-005', komoditas: 'Selada', varietas: 'Grand Rapids', lokasi: 'GH-002', sumberBahan: 'LOT-2026-00029', tanggalMulai: '08 Jun 2026', tanggalSelesai: '24 Jun 2026', targetKg: 200, hasilKg: 180, yieldPercent: 90.0, status: 'Selesai', catatan: 'Benih selada siap untuk pengujian daya berkecambah.' },
  { no: 6, kodeBatch: 'BP-2026-06-006', komoditas: 'Cabai', varietas: 'Rawit', lokasi: 'LH-005', sumberBahan: 'LOT-2026-00026', tanggalMulai: '10 Jun 2026', tanggalSelesai: '-', targetKg: 250, hasilKg: 0, yieldPercent: 0, status: 'Tertunda', catatan: 'Tertunda menunggu verifikasi hasil uji kadar air bahan.' },
  { no: 7, kodeBatch: 'BP-2026-06-007', komoditas: 'Kangkung', varietas: 'Bima', lokasi: 'GH-001', sumberBahan: 'LOT-2026-00028', tanggalMulai: '12 Jun 2026', tanggalSelesai: '28 Jun 2026', targetKg: 300, hasilKg: 270, yieldPercent: 90.0, status: 'Selesai', catatan: 'Benih kangkung bima lulus uji fisik dan vigor.' },
  { no: 8, kodeBatch: 'BP-2026-06-008', komoditas: 'Tomat', varietas: 'Tsw-009', lokasi: 'LH-006', sumberBahan: 'LOT-2026-00027', tanggalMulai: '14 Jun 2026', tanggalSelesai: '-', targetKg: 350, hasilKg: 200, yieldPercent: 57.1, status: 'Dalam Proses', catatan: 'Benih tomat Tsw-009 dalam proses formulasi.' },
  { no: 9, kodeBatch: 'BP-2026-06-009', komoditas: 'Melon', varietas: 'Melon Tere F1', lokasi: 'GH-003', sumberBahan: 'LOT-2026-00025', tanggalMulai: '16 Jun 2026', tanggalSelesai: '02 Jul 2026', targetKg: 500, hasilKg: 0, yieldPercent: 0, status: 'Persiapan', catatan: 'Persiapan alokasi unit produksi dan wadah steril.' },
  { no: 10, kodeBatch: 'BP-2026-06-010', komoditas: 'Cabai', varietas: 'Cabai Keriting', lokasi: 'LH-007', sumberBahan: 'LOT-2026-00030', tanggalMulai: '18 Jun 2026', tanggalSelesai: '-', targetKg: 400, hasilKg: 0, yieldPercent: 0, status: 'Persiapan', catatan: 'Pemeriksaan kelengkapan administrasi dan batch record.' },
  { no: 11, kodeBatch: 'BP-2026-06-011', komoditas: 'Melon', varietas: 'Melon Tere F1', lokasi: 'GH-002', sumberBahan: 'LOT-2026-00021', tanggalMulai: '02 Jun 2026', tanggalSelesai: '19 Jun 2026', targetKg: 450, hasilKg: 440, yieldPercent: 97.8, status: 'Selesai', catatan: 'Selesai sertifikasi dan uji kemurnian.' },
  { no: 12, kodeBatch: 'BP-2026-06-012', komoditas: 'Tomat', varietas: 'Grand Rapids', lokasi: 'GH-004', sumberBahan: 'LOT-2026-00023', tanggalMulai: '05 Jun 2026', tanggalSelesai: '-', targetKg: 350, hasilKg: 100, yieldPercent: 28.6, status: 'Dalam Proses', catatan: 'Dalam tahap pengujian internal.' },
  { no: 13, kodeBatch: 'BP-2026-06-013', komoditas: 'Cabai', varietas: 'Cabai Keriting', lokasi: 'LH-003', sumberBahan: 'LOT-2026-00022', tanggalMulai: '07 Jun 2026', tanggalSelesai: '25 Jun 2026', targetKg: 320, hasilKg: 300, yieldPercent: 93.8, status: 'Selesai', catatan: 'Batch cabai SS lulus pengujian.' },
  { no: 14, kodeBatch: 'BP-2026-06-014', komoditas: 'Cabai', varietas: 'Rawit', lokasi: 'LH-001', sumberBahan: 'LOT-2026-00026', tanggalMulai: '09 Jun 2026', tanggalSelesai: '-', targetKg: 280, hasilKg: 150, yieldPercent: 53.6, status: 'Dalam Proses', catatan: 'Proses sortasi akhir dan penimbangan.' },
  { no: 15, kodeBatch: 'BP-2026-06-015', komoditas: 'Melon', varietas: 'Melon Tere F1', lokasi: 'GH-004', sumberBahan: 'LOT-2026-00025', tanggalMulai: '11 Jun 2026', tanggalSelesai: '26 Jun 2026', targetKg: 480, hasilKg: 460, yieldPercent: 95.8, status: 'Selesai', catatan: 'Batch produksi benih melon F1 super.' },
  { no: 16, kodeBatch: 'BP-2026-06-016', komoditas: 'Padi', varietas: 'Inpari 32', lokasi: 'LH-005', sumberBahan: 'LOT-2026-00024', tanggalMulai: '13 Jun 2026', tanggalSelesai: '-', targetKg: 320, hasilKg: 0, yieldPercent: 0, status: 'Tertunda', catatan: 'Tertunda perbaikan mesin pembersih benih.' },
  { no: 17, kodeBatch: 'BP-2026-06-017', komoditas: 'Padi', varietas: 'Inpari 32', lokasi: 'LH-002', sumberBahan: 'LOT-2026-00024', tanggalMulai: '15 Jun 2026', tanggalSelesai: '-', targetKg: 500, hasilKg: 220, yieldPercent: 44.0, status: 'Dalam Proses', catatan: 'Pengeringan lanjutan dan pembersihan gabah.' },
  { no: 18, kodeBatch: 'BP-2026-06-018', komoditas: 'Cabai', varietas: 'Cabai Keriting', lokasi: 'LH-006', sumberBahan: 'LOT-2026-00022', tanggalMulai: '17 Jun 2026', tanggalSelesai: '03 Jul 2026', targetKg: 200, hasilKg: 200, yieldPercent: 100.0, status: 'Selesai', catatan: '100% target benih terwujud.' },
  { no: 19, kodeBatch: 'BP-2026-06-019', komoditas: 'Tomat', varietas: 'Grand Rapids', lokasi: 'GH-001', sumberBahan: 'LOT-2026-00023', tanggalMulai: '19 Jun 2026', tanggalSelesai: '-', targetKg: 320, hasilKg: 140, yieldPercent: 43.8, status: 'Dalam Proses', catatan: 'Proses penanganan benih tomat steril.' },
  { no: 20, kodeBatch: 'BP-2026-06-020', komoditas: 'Tomat', varietas: 'Tsw-009', lokasi: 'LH-002', sumberBahan: 'LOT-2026-00027', tanggalMulai: '21 Jun 2026', tanggalSelesai: '08 Jul 2026', targetKg: 380, hasilKg: 360, yieldPercent: 94.7, status: 'Selesai', catatan: 'Selesai evaluasi laboratorium QC.' },
  { no: 21, kodeBatch: 'BP-2026-06-021', komoditas: 'Melon', varietas: 'Melon Tere F1', lokasi: 'GH-005', sumberBahan: 'LOT-2026-00021', tanggalMulai: '22 Jun 2026', tanggalSelesai: '-', targetKg: 450, hasilKg: 200, yieldPercent: 44.4, status: 'Dalam Proses', catatan: 'Sedang berjalan pemisahan benih berbobot.' },
  { no: 22, kodeBatch: 'BP-2026-06-022', komoditas: 'Selada', varietas: 'Grand Rapids', lokasi: 'GH-005', sumberBahan: 'LOT-2026-00029', tanggalMulai: '23 Jun 2026', tanggalSelesai: '09 Jul 2026', targetKg: 180, hasilKg: 170, yieldPercent: 94.4, status: 'Selesai', catatan: 'Benih selada hidroponik siap rilis.' },
  { no: 23, kodeBatch: 'BP-2026-06-023', komoditas: 'Padi', varietas: 'Inpari 32', lokasi: 'LH-008', sumberBahan: 'LOT-2026-00024', tanggalMulai: '24 Jun 2026', tanggalSelesai: '10 Jul 2026', targetKg: 520, hasilKg: 250, yieldPercent: 48.1, status: 'Selesai', catatan: 'Batch padi ES tersertifikasi BPSB.' },
  { no: 24, kodeBatch: 'BP-2026-06-024', komoditas: 'Cabai', varietas: 'Rawit', lokasi: 'LH-004', sumberBahan: 'LOT-2026-00026', tanggalMulai: '25 Jun 2026', tanggalSelesai: '-', targetKg: 300, hasilKg: 110, yieldPercent: 36.7, status: 'Dalam Proses', catatan: 'Perlakuan benih protektif sedang berjalan.' },
  { no: 25, kodeBatch: 'BP-2026-06-025', komoditas: 'Melon', varietas: 'Melon Tere F1', lokasi: 'GH-001', sumberBahan: 'LOT-2026-00021', tanggalMulai: '26 Jun 2026', tanggalSelesai: '12 Jul 2026', targetKg: 100, hasilKg: 80, yieldPercent: 80.0, status: 'Selesai', catatan: 'Cadangan batch varietas melon unggul.' },
  { no: 26, kodeBatch: 'BP-2026-06-026', komoditas: 'Tomat', varietas: 'Grand Rapids', lokasi: 'GH-002', sumberBahan: 'LOT-2026-00023', tanggalMulai: '27 Jun 2026', tanggalSelesai: '-', targetKg: 260, hasilKg: 90, yieldPercent: 34.6, status: 'Dalam Proses', catatan: 'Monitoring suhu ruang produksi.' },
  { no: 27, kodeBatch: 'BP-2026-06-027', komoditas: 'Cabai', varietas: 'Cabai Keriting', lokasi: 'LH-001', sumberBahan: 'LOT-2026-00022', tanggalMulai: '28 Jun 2026', tanggalSelesai: '14 Jul 2026', targetKg: 20, hasilKg: 20, yieldPercent: 100.0, status: 'Selesai', catatan: 'Rilis sertifikasi akhir.' },
  { no: 28, kodeBatch: 'BP-2026-06-028', komoditas: 'Padi', varietas: 'Inpari 32', lokasi: 'LH-003', sumberBahan: 'LOT-2026-00024', tanggalMulai: '29 Jun 2026', tanggalSelesai: '-', targetKg: 350, hasilKg: 160, yieldPercent: 45.7, status: 'Dalam Proses', catatan: 'Penyusunan laporan akhir batch.' },
];

export function useBatchProduksi() {
  const [batchList, setBatchList] = useState<BatchProduksiItem[]>(INITIAL_28_BATCH_PRODUKSI);
  const [selectedBatch, setSelectedBatch] = useState<BatchProduksiItem | null>(INITIAL_28_BATCH_PRODUKSI[0]);
  const [referensiGudangBahanList, setReferensiGudangBahanList] = useState<ReferensiGudangBahanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<BatchProduksiStats | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('');
  const [filterVarietas, setFilterVarietas] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(28);
  const [totalPages, setTotalPages] = useState(3);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BatchProduksiItem | null>(null);

  // In-flight and deduplication refs
  const isFetchingRef = useRef(false);
  const prevParamsRef = useRef<string>('');
  const hasFetchedRefGudang = useRef(false);

  // Fetch Referensi Gudang Bahan Belum Diproses (Sudah Treatment)
  const fetchReferensiGudangBahan = useCallback(async () => {
    try {
      const res = await batchProduksiService.getReferensiGudangBahan();
      const list = res?.data || [];
      if (list.length > 0) {
        setReferensiGudangBahanList(list);
      }
    } catch (err) {
      console.error('Error fetching referensi gudang bahan:', err);
    }
  }, []);

  useEffect(() => {
    if (hasFetchedRefGudang.current) return;
    hasFetchedRefGudang.current = true;
    fetchReferensiGudangBahan();
  }, [fetchReferensiGudangBahan]);

  // Fetch Batch Produksi list with deduplication and in-flight guard
  const fetchBatchProduksi = useCallback(async (force = false) => {
    if (isFetchingRef.current && !force) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await batchProduksiService.getBatchProduksiList({
        page: currentPage,
        limit: pageSize,
        search: appliedSearch || undefined,
        komoditas: filterKomoditas || undefined,
        varietas: filterVarietas || undefined,
        status: filterStatus || undefined,
      });

      const list = res?.data || [];
      setBatchList(list);
      setTotalRecords(res?.meta?.total ?? list.length);
      setTotalPages(res?.meta?.totalPages || 1);
      if (res?.stats) setApiStats(res.stats);

      // Keep selectedBatch updated cleanly without re-triggering fetch
      setSelectedBatch((prev) => {
        if (list.length === 0) return null;
        if (!prev) return list[0];
        const found = list.find(
          (b: BatchProduksiItem) =>
            (prev.id && b.id === prev.id) || b.kodeBatch === prev.kodeBatch
        );
        return found || list[0];
      });
    } catch (err: any) {
      console.error('Error fetching Batch Produksi:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, appliedSearch, filterKomoditas, filterVarietas, filterStatus]);

  // Strict deduplication: Only trigger fetch if parameters actually change
  useEffect(() => {
    const currentParams = `${currentPage}_${pageSize}_${appliedSearch}_${filterKomoditas}_${filterVarietas}_${filterStatus}`;
    if (prevParamsRef.current === currentParams) {
      return;
    }
    prevParamsRef.current = currentParams;

    fetchBatchProduksi();
  }, [currentPage, pageSize, appliedSearch, filterKomoditas, filterVarietas, filterStatus, fetchBatchProduksi]);

  // Filter handlers
  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedSearch(searchQuery);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setAppliedSearch('');
    setFilterKomoditas('');
    setFilterVarietas('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  // Standard static options tailored to modules & records
  const komoditasOptions = useMemo(() => [
    { value: '', label: 'Semua Komoditas' },
    { value: 'Melon', label: 'Melon' },
    { value: 'Cabai', label: 'Cabai' },
    { value: 'Tomat', label: 'Tomat' },
    { value: 'Padi', label: 'Padi' },
    { value: 'Selada', label: 'Selada' },
    { value: 'Kangkung', label: 'Kangkung' },
  ], []);

  const varietasOptions = useMemo(() => [
    { value: '', label: 'Semua Varietas' },
    { value: 'Melon Tere F1', label: 'Melon Tere F1' },
    { value: 'Cabai Keriting', label: 'Cabai Keriting' },
    { value: 'Rawit', label: 'Rawit' },
    { value: 'Grand Rapids', label: 'Grand Rapids' },
    { value: 'Inpari 32', label: 'Inpari 32' },
    { value: 'Tsw-009', label: 'Tsw-009' },
    { value: 'Bima', label: 'Bima' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'Semua Status' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Dalam Proses', label: 'Dalam Proses' },
    { value: 'Tertunda', label: 'Tertunda' },
    { value: 'Persiapan', label: 'Persiapan' },
  ], []);

  // Stats matching screenshot
  const stats: BatchProduksiStats = useMemo(() => {
    return {
      totalBatch: apiStats?.totalBatch ?? 28,
      totalBatchDelta: apiStats?.totalBatchDelta ?? 3,
      dalamProses: apiStats?.dalamProses ?? 12,
      dalamProsesDelta: apiStats?.dalamProsesDelta ?? 2,
      selesaiCount: apiStats?.selesaiCount ?? 14,
      selesaiDelta: apiStats?.selesaiDelta ?? 4,
      tertundaCount: apiStats?.tertundaCount ?? 2,
      tertundaDelta: apiStats?.tertundaDelta ?? -1,
      totalProduksiBenih: apiStats?.totalProduksiBenih ?? '2.480 kg',
      totalProduksiDeltaPercent: apiStats?.totalProduksiDeltaPercent ?? 15,
      komoditasBreakdown: apiStats?.komoditasBreakdown ?? [
        { name: 'Melon', kg: 980, percent: 39.5, color: '#06b6d4' },
        { name: 'Cabai', kg: 620, percent: 25.0, color: '#0ea5e9' },
        { name: 'Tomat', kg: 480, percent: 19.4, color: '#f59e0b' },
        { name: 'Padi', kg: 250, percent: 10.1, color: '#eab308' },
        { name: 'Selada', kg: 150, percent: 6.0, color: '#ef4444' },
      ],
      trenProduksi: apiStats?.trenProduksi ?? [
        { minggu: 'Minggu 1', target: 350, realisasi: 300 },
        { minggu: 'Minggu 2', target: 450, realisasi: 420 },
        { minggu: 'Minggu 3', target: 700, realisasi: 650 },
        { minggu: 'Minggu 4', target: 750, realisasi: 680 },
      ],
      statusDistribution: apiStats?.statusDistribution ?? {
        selesai: { count: 14, percent: 50 },
        dalamProses: { count: 12, percent: 43 },
        tertunda: { count: 2, percent: 7 },
        persiapan: { count: 2, percent: 7 },
      },
    };
  }, [apiStats]);

  // Modal Open / Close Handlers
  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: BatchProduksiItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (item: BatchProduksiItem) => {
    setSelectedItem(item);
    setSelectedBatch(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (item: BatchProduksiItem) => {
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

  // CRUD Submissions
  const handleSubmitCreate = async (data: Partial<BatchProduksiItem>) => {
    try {
      await batchProduksiService.createBatchProduksi(data);
      toast.success('Batch produksi berhasil ditambahkan!');
      handleCloseModals();
      prevParamsRef.current = '';
      fetchBatchProduksi(true);
      fetchReferensiGudangBahan();
    } catch (err: any) {
      console.error('Error creating batch produksi:', err);
      toast.error(err?.response?.data?.message || 'Gagal menambahkan batch produksi');
    }
  };

  const handleSubmitUpdate = async (data: Partial<BatchProduksiItem>) => {
    if (!selectedItem?.id && !selectedItem?.kodeBatch) return;
    try {
      const id = selectedItem.id || selectedItem.kodeBatch;
      await batchProduksiService.updateBatchProduksi(id, data);
      toast.success('Batch produksi berhasil diperbarui!');
      handleCloseModals();
      prevParamsRef.current = '';
      fetchBatchProduksi(true);
    } catch (err: any) {
      console.error('Error updating batch produksi:', err);
      toast.error(err?.response?.data?.message || 'Gagal memperbarui batch produksi');
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectedItem?.id && !selectedItem?.kodeBatch) return;
    try {
      const id = selectedItem.id || selectedItem.kodeBatch;
      await batchProduksiService.deleteBatchProduksi(id);
      toast.success('Batch produksi berhasil dihapus!');
      handleCloseModals();
      prevParamsRef.current = '';
      fetchBatchProduksi(true);
    } catch (err: any) {
      console.error('Error deleting batch produksi:', err);
      toast.error(err?.response?.data?.message || 'Gagal menghapus batch produksi');
    }
  };

  return {
    batchList,
    selectedBatch,
    setSelectedBatch,
    referensiGudangBahanList,
    loading,
    stats,
    // Filters
    searchQuery,
    setSearchQuery,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    handleApplyFilters,
    handleResetFilters,
    komoditasOptions,
    varietasOptions,
    statusOptions,
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

export default useBatchProduksi;
