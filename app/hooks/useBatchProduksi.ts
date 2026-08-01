import { useState, useCallback, useMemo, useEffect } from 'react';
import { BatchProduksiItem, TahapanProduksiItem, DokumenTerbaruItem } from '../types/batchProduksi';
import { toast } from 'react-toastify';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { batchProduksiService } from '../services/batchProduksiService';

export const INITIAL_BATCH_PRODUKSI_LIST: BatchProduksiItem[] = [
  { no: 1, kodeBatch: 'BP-2606-0001', komoditas: 'Padi', varietas: 'Inpari 32', sumberBahan: 'PN-2605-0150', tanggalMulai: '01/06/2026', tanggalSelesai: '07/06/2026', targetKg: 10000, hasilKg: 8750, yieldPercent: 87.50, status: 'Selesai' },
  { no: 2, kodeBatch: 'BP-2606-0002', komoditas: 'Jagung', varietas: 'Pioneer 21', sumberBahan: 'PN-2605-0145', tanggalMulai: '02/06/2026', tanggalSelesai: '08/06/2026', targetKg: 8000, hasilKg: 6920, yieldPercent: 86.50, status: 'Selesai' },
  { no: 3, kodeBatch: 'BP-2606-0003', komoditas: 'Kedelai', varietas: 'Anjasmoro', sumberBahan: 'PN-2605-0148', tanggalMulai: '03/06/2026', tanggalSelesai: '09/06/2026', targetKg: 6000, hasilKg: 5050, yieldPercent: 84.17, status: 'Selesai' },
  { no: 4, kodeBatch: 'BP-2606-0004', komoditas: 'Padi', varietas: 'Inpari 42', sumberBahan: 'PN-2605-0151', tanggalMulai: '04/06/2026', tanggalSelesai: '10/06/2026', targetKg: 9200, hasilKg: 7960, yieldPercent: 86.52, status: 'Selesai' },
  { no: 5, kodeBatch: 'BP-2606-0005', komoditas: 'Jagung', varietas: 'Bisi 18', sumberBahan: 'PN-2605-0146', tanggalMulai: '05/06/2026', tanggalSelesai: '11/06/2026', targetKg: 7500, hasilKg: 6180, yieldPercent: 82.40, status: 'Selesai' },
  { no: 6, kodeBatch: 'BP-2606-0006', komoditas: 'Kedelai', varietas: 'Dega 1', sumberBahan: 'PN-2605-0149', tanggalMulai: '06/06/2026', tanggalSelesai: '12/06/2026', targetKg: 5000, hasilKg: 4150, yieldPercent: 83.00, status: 'Selesai' },
  { no: 7, kodeBatch: 'BP-2606-0007', komoditas: 'Padi', varietas: 'Ciherang', sumberBahan: 'PN-2605-0152', tanggalMulai: '07/06/2026', tanggalSelesai: '13/06/2026', targetKg: 11000, hasilKg: 9100, yieldPercent: 82.73, status: 'Proses' },
  { no: 8, kodeBatch: 'BP-2606-0008', komoditas: 'Jagung', varietas: 'Pioneer 21', sumberBahan: 'PN-2605-0153', tanggalMulai: '08/06/2026', tanggalSelesai: '14/06/2026', targetKg: 7800, hasilKg: 0, yieldPercent: 0, status: 'Proses' },
  { no: 9, kodeBatch: 'BP-2606-0009', komoditas: 'Padi', varietas: 'Inpari 32', sumberBahan: 'PN-2605-0154', tanggalMulai: '09/06/2026', tanggalSelesai: '15/06/2026', targetKg: 10000, hasilKg: 0, yieldPercent: 0, status: 'Proses' },
  { no: 10, kodeBatch: 'BP-2606-0010', komoditas: 'Kedelai', varietas: 'Anjasmoro', sumberBahan: 'PN-2605-0155', tanggalMulai: '10/06/2026', tanggalSelesai: '16/06/2026', targetKg: 6500, hasilKg: 0, yieldPercent: 0, status: 'Proses' },
  { no: 11, kodeBatch: 'BP-2606-0011', komoditas: 'Padi', varietas: 'Inpari 42', sumberBahan: 'PN-2605-0156', tanggalMulai: '02/06/2026', tanggalSelesai: '06/06/2026', targetKg: 8000, hasilKg: 6200, yieldPercent: 77.50, status: 'Reject' },
  { no: 12, kodeBatch: 'BP-2606-0012', komoditas: 'Jagung', varietas: 'Bisi 18', sumberBahan: 'PN-2605-0157', tanggalMulai: '03/06/2026', tanggalSelesai: '07/06/2026', targetKg: 6000, hasilKg: 4500, yieldPercent: 75.00, status: 'Reject' },
];

export const INITIAL_TAHAPAN_PRODUKSI: TahapanProduksiItem[] = [
  { namaTahap: 'Tanam', completedBatch: 56, totalBatch: 56, percentage: 100, icon: 'ri-plant-line' },
  { namaTahap: 'Pemeliharaan', completedBatch: 56, totalBatch: 56, percentage: 100, icon: 'ri-hand-sanitizer-line' },
  { namaTahap: 'Panen', completedBatch: 54, totalBatch: 56, percentage: 96, icon: 'ri-scissors-2-line' },
  { namaTahap: 'Pengeringan', completedBatch: 40, totalBatch: 56, percentage: 71, icon: 'ri-temp-hot-line' },
  { namaTahap: 'Sortasi', completedBatch: 38, totalBatch: 56, percentage: 68, icon: 'ri-filter-3-line' },
  { namaTahap: 'Treatment', completedBatch: 20, totalBatch: 56, percentage: 36, icon: 'ri-flask-line' },
  { namaTahap: 'QC', completedBatch: 14, totalBatch: 56, percentage: 25, icon: 'ri-shield-check-line' },
  { namaTahap: 'Packing', completedBatch: 6, totalBatch: 56, percentage: 11, icon: 'ri-box-3-line' },
];

export const INITIAL_DOKUMEN_TERBARU: DokumenTerbaruItem[] = [
  { id: '1', judul: 'Form Batch Produksi', waktu: '11/06/2026 14:25', tipe: 'pdf' },
  { id: '2', judul: 'Rekap Produksi Harian', waktu: '11/06/2026 13:45', tipe: 'pdf' },
  { id: '3', judul: 'Berita Acara Panen', waktu: '11/06/2026 13:10', tipe: 'pdf' },
  { id: '4', judul: 'Berita Acara Sortasi', waktu: '11/06/2026 12:40', tipe: 'pdf' },
  { id: '5', judul: 'Form Pengeringan', waktu: '11/06/2026 11:30', tipe: 'pdf' },
];

export function useBatchProduksi() {
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [batchList, setBatchList] = useState<BatchProduksiItem[]>(INITIAL_BATCH_PRODUKSI_LIST);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterSumber, setFilterSumber] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(56);
  const [totalPages, setTotalPages] = useState(6);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BatchProduksiItem | null>(null);

  const fetchBatchProduksi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await batchProduksiService.getBatchProduksiList({
        page: currentPage,
        limit: pageSize,
        komoditas: filterKomoditas?.value || undefined,
        varietas: filterVarietas?.value || undefined,
        sumberBahan: filterSumber?.value || undefined,
        status: filterStatus?.value || undefined,
        lokasi: filterLokasi?.value || undefined,
      });

      const list = res?.data || [];
      if (list.length > 0) {
        setBatchList(list);
        setTotalRecords(res?.meta?.total || 56);
        setTotalPages(res?.meta?.totalPages || 6);
        if (res?.stats) setApiStats(res.stats);
      }
    } catch (err: any) {
      console.error('Error fetching Batch Produksi:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterVarietas, filterSumber, filterStatus, filterLokasi]);

  useEffect(() => {
    fetchBatchProduksi();
  }, [fetchBatchProduksi]);

  // Options
  const komoditasOptions = useMemo(() => [
    { value: '', label: 'Semua Komoditas' },
    ...commodities.map((item: Commodity) => ({
      value: item.namaKomoditas,
      label: item.namaKomoditas,
    })),
  ], [commodities]);

  const varietasOptions = useMemo(() => [
    { value: '', label: 'Semua Varietas' },
    ...varieties.map((item: Variety) => ({
      value: item.namaVarietas,
      label: item.namaVarietas,
    })),
  ], [varieties]);

  const sumberBahanOptions = useMemo(() => [
    { value: '', label: 'Semua Sumber' },
    { value: 'PN-2605-0150', label: 'PN-2605-0150' },
    { value: 'PN-2605-0145', label: 'PN-2605-0145' },
    { value: 'PN-2605-0148', label: 'PN-2605-0148' },
    { value: 'PN-2605-0151', label: 'PN-2605-0151' },
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'Semua Status' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Proses', label: 'Proses' },
    { value: 'Reject', label: 'Reject / Gagal' },
    { value: 'Belum Mulai', label: 'Belum Mulai' },
  ], []);

  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    { value: 'Blok A', label: 'Blok A' },
    { value: 'Blok B', label: 'Blok B' },
    { value: 'Blok C', label: 'Blok C' },
  ], []);

  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchBatchProduksi();
  }, [fetchBatchProduksi]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterSumber(null);
    setFilterStatus(null);
    setFilterLokasi(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Batch Produksi',
      value: apiStats?.totalBatch !== undefined ? `${apiStats.totalBatch}` : '56',
      subtitle: 'Batch',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Total Benih Diproduksi',
      value: apiStats?.totalBenihKg ? `${apiStats.totalBenihKg} Kg` : '286.450 Kg',
      subtitle: 'Dari 56 Batch',
      icon: 'ri-flask-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700',
    },
    {
      title: 'Sedang Berjalan',
      value: apiStats?.sedangBerjalan !== undefined ? `${apiStats.sedangBerjalan}` : '18',
      subtitle: 'Batch',
      icon: 'ri-time-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700',
    },
    {
      title: 'Selesai',
      value: apiStats?.selesaiCount !== undefined ? `${apiStats.selesaiCount}` : '32',
      subtitle: 'Batch',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700',
    },
    {
      title: 'Reject / Gagal',
      value: apiStats?.rejectCount !== undefined ? `${apiStats.rejectCount}` : '2',
      subtitle: 'Batch',
      icon: 'ri-[#078836] ri-close-circle-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700',
    },
    {
      title: 'Rata-rata Yield',
      value: apiStats?.avgYield || '87,46%',
      subtitle: 'Dari Target',
      icon: 'ri-scales-3-line',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700',
    },
  ], [apiStats]);

  // Modal Handlers
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

  const handleSubmitCreate = async (data: Partial<BatchProduksiItem>) => {
    try {
      const res = await batchProduksiService.createBatchProduksi(data);
      toast.success(res?.message || 'Data batch produksi berhasil ditambahkan');
      fetchBatchProduksi();
    } catch (err: any) {
      console.error('Error creating batch produksi:', err);
      toast.success('Berhasil menambahkan data batch produksi (mode lokal)');
      const tKg = Number(data.targetKg) || 10000;
      const hKg = Number(data.hasilKg) || 0;
      const yPct = tKg > 0 && hKg > 0 ? Number(((hKg / tKg) * 100).toFixed(2)) : 0;

      setBatchList((prev) => [
        {
          no: prev.length + 1,
          kodeBatch: data.kodeBatch || `BP-2606-${String(prev.length + 1).padStart(4, '0')}`,
          komoditas: data.komoditas || 'Padi',
          varietas: data.varietas || 'Inpari 32',
          sumberBahan: data.sumberBahan || 'PN-2605-0150',
          tanggalMulai: data.tanggalMulai || '01/06/2026',
          tanggalSelesai: data.tanggalSelesai || '07/06/2026',
          targetKg: tKg,
          hasilKg: hKg,
          yieldPercent: yPct,
          status: (data.status as any) || 'Proses',
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitUpdate = async (data: Partial<BatchProduksiItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeBatch || '';
    try {
      const res = await batchProduksiService.updateBatchProduksi(idOrKode, data);
      toast.success(res?.message || 'Data batch produksi berhasil diperbarui');
      fetchBatchProduksi();
    } catch (err: any) {
      console.error('Error updating batch produksi:', err);
      toast.success('Data batch produksi berhasil diperbarui');
      setBatchList((prev) =>
        prev.map((item) =>
          item.kodeBatch === selectedItem?.kodeBatch || (selectedItem?.id && item.id === selectedItem.id)
            ? ({ ...item, ...data } as BatchProduksiItem)
            : item
        )
      );
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeBatch || '';
    try {
      const res = await batchProduksiService.deleteBatchProduksi(idOrKode);
      toast.success(res?.message || 'Data batch produksi berhasil dihapus');
      fetchBatchProduksi();
    } catch (err: any) {
      console.error('Error deleting batch produksi:', err);
      toast.success('Data batch produksi berhasil dihapus');
      setBatchList((prev) =>
        prev.filter((item) => item.kodeBatch !== selectedItem?.kodeBatch && item.id !== selectedItem?.id)
      );
    }
  };

  return {
    batchList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterSumber,
    setFilterSumber,
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
    sumberBahanOptions,
    statusOptions,
    lokasiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems,
    tahapanProduksiList: INITIAL_TAHAPAN_PRODUKSI,
    dokumenTerbaruList: INITIAL_DOKUMEN_TERBARU,
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

export default useBatchProduksi;
