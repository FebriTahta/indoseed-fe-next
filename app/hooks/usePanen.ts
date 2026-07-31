import { useState, useEffect, useCallback, useMemo } from 'react';
import { panenService, PanenItem } from '../services/panenService';
import { toast } from 'react-toastify';

export function usePanen() {
  const [panenList, setPanenList] = useState<PanenItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPanen, setSelectedPanen] = useState<PanenItem | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [filterKomoditas, setFilterKomoditas] = useState('Semua Komoditas');
  const [filterVarietas, setFilterVarietas] = useState('Semua Varietas');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [periodeStart, setPeriodeStart] = useState('2026-06-01');
  const [periodeEnd, setPeriodeEnd] = useState('2026-06-30');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Backend Stats
  const [apiStats, setApiStats] = useState<any>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PanenItem | null>(null);

  const fetchPanens = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await panenService.getPanenList({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        komoditas: filterKomoditas !== 'Semua Komoditas' ? filterKomoditas : undefined,
        varietas: filterVarietas !== 'Semua Varietas' ? filterVarietas : undefined,
        status: filterStatus !== 'Semua Status' ? filterStatus : undefined,
        startDate: periodeStart || undefined,
        endDate: periodeEnd || undefined,
      });

      const list: PanenItem[] = res?.data || [];
      setPanenList(list);
      setTotalRecords(res?.meta?.total || list.length);
      setTotalPages(res?.meta?.totalPages || 1);
      if (res?.stats) setApiStats(res.stats);

      // Auto select first item if none selected
      if (list.length > 0 && !selectedPanen) {
        setSelectedPanSelected(list[0]);
      }
    } catch (err: any) {
      console.error('Error fetching Panen list:', err);
      toast.error(err.response?.data?.message || 'Gagal memuat data panen');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, search, filterKomoditas, filterVarietas, filterStatus, periodeStart, periodeEnd]);

  // Helper setter for auto-select
  const setSelectedPanSelected = (item: PanenItem | null) => {
    setSelectedPanen(item);
  };

  useEffect(() => {
    fetchPanens();
  }, [fetchPanens]);

  // Filter actions
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPanens();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterKomoditas('Semua Komoditas');
    setFilterVarietas('Semua Varietas');
    setFilterStatus('Semua Status');
    setPeriodeStart('2026-06-01');
    setPeriodeEnd('2026-06-30');
    setCurrentPage(1);
  };

  // CRUD actions
  const handleAddPanen = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditPanen = (item: PanenItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeletePanen = async (id: string, kodePanen?: string) => {
    const confirmMessage = kodePanen
      ? `Apakah Anda yakin ingin menghapus data panen "${kodePanen}"?`
      : 'Apakah Anda yakin ingin menghapus data panen ini?';

    if (confirm(confirmMessage)) {
      try {
        const res = await panenService.deletePanen(id);
        toast.success(res?.message || 'Data panen berhasil dihapus');
        if (selectedPanen?.id === id) {
          setSelectedPanen(null);
        }
        fetchPanens();
      } catch (err: any) {
        console.error('Error deleting Panen:', err);
        toast.error(err.response?.data?.message || 'Gagal menghapus data panen');
      }
    }
  };

  const handleSavePanen = async (formData: Partial<PanenItem>) => {
    try {
      if (editingItem) {
        const res = await panenService.updatePanen(editingItem.id, formData);
        toast.success(res?.message || 'Data panen berhasil diperbarui');
      } else {
        const res = await panenService.createPanen(formData);
        toast.success(res?.message || 'Data panen berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchPanens();
    } catch (err: any) {
      console.error('Error saving Panen:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan data panen');
    }
  };

  // Aggregated Stat Items matching the top 7 stat cards
  const statItems = useMemo(() => {
    const totalPanen = apiStats?.totalPanen || totalRecords || panenList.length;
    const totalLuas = apiStats?.totalLuas !== undefined 
      ? apiStats.totalLuas 
      : panenList.reduce((acc, i) => acc + (i.luasHa || 0), 0);
    const totalProduksi = apiStats?.totalProduksi !== undefined 
      ? apiStats.totalProduksi 
      : panenList.reduce((acc, i) => acc + (i.produksiKg || 0), 0);
    const rataHasil = apiStats?.rataHasil !== undefined
      ? apiStats.rataHasil
      : (totalLuas > 0 ? Math.round(totalProduksi / totalLuas) : 0);

    const selesaiCount = apiStats?.selesaiCount !== undefined
      ? apiStats.selesaiCount
      : panenList.filter(i => i.status === 'Selesai').length;

    const berlangsungCount = apiStats?.berlangsungCount !== undefined
      ? apiStats.berlangsungCount
      : panenList.filter(i => i.status === 'Berlangsung' || i.status === 'Sedang Berlangsung').length;

    const belumMulaiCount = apiStats?.belumMulaiCount !== undefined
      ? apiStats.belumMulaiCount
      : panenList.filter(i => i.status === 'Belum Mulai').length;

    return {
      totalPanen,
      totalLuas: `${totalLuas.toFixed(2).replace('.', ',')} Ha`,
      totalProduksi: `${totalProduksi.toLocaleString('id-ID')} Kg`,
      rataHasil: `${rataHasil.toLocaleString('id-ID')} Kg/Ha`,
      selesaiCount,
      berlangsungCount,
      belumMulaiCount,
    };
  }, [apiStats, totalRecords, panenList]);

  // Dynamic Options for filters
  const komoditasOptions = ['Semua Komoditas', 'Padi', 'Jagung', 'Kedelai', 'Kacang Hijau'];
  const varietasOptions = ['Semua Varietas', 'Inpari 32', 'Inpari 42', 'Ciherang', 'Pioneer 21', 'Bisi 18', 'P21', 'Anjasmoro', 'Dega 1', 'Vima 1'];
  const statusOptions = ['Semua Status', 'Selesai', 'Berlangsung', 'Belum Mulai'];

  return {
    panenList,
    isLoading,
    selectedPanen,
    setSelectedPanen,
    search,
    setSearch,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    periodeStart,
    setPeriodeStart,
    periodeEnd,
    setPeriodeEnd,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    statItems,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    handleAddPanen,
    handleEditPanen,
    handleDeletePanen,
    handleSavePanen,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    fetchPanens,
  };
}

export default usePanen;
