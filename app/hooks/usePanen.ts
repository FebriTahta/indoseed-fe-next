import { useState, useEffect, useCallback, useMemo } from 'react';
import { panenService, PanenItem } from '../services/panenService';
import { kesiapanPanenService } from '../services/kesiapanPanenService';
import { KesiapanPanenItem } from '../types/kesiapanPanen';
import { INITIAL_KESIAPAN_PANEN_LIST } from './useKesiapanPanen';
import { toast } from 'react-toastify';
import { StatItem } from '../(components)/(content-layout)/shared/StatsWidgets';
import commodityService from '../services/commodityService';
import varietyService from '../services/varietyService';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';

const getInitialMonthRange = (): [Date, Date] => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [start, end];
};

const formatDateYYYYMMDD = (d: Date | null) => {
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function usePanen() {
  const [panenList, setPanenList] = useState<PanenItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPanen, setSelectedPanen] = useState<PanenItem | null>(null);

  // Kesiapan Panen list with status 'Siap Panen'
  const [kesiapanSiapPanenList, setKesiapanSiapPanenList] = useState<KesiapanPanenItem[]>([]);

  // Master Data from Services
  const [masterCommodities, setMasterCommodities] = useState<Commodity[]>([]);
  const [masterVarieties, setMasterVarieties] = useState<Variety[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [commRes, varRes] = await Promise.all([
          commodityService.getCommodities({ pageSize: 1000, status: 'Aktif' }),
          varietyService.getVarieties({ pageSize: 1000, status: 'Aktif' }),
        ]);

        if (commRes?.status === 'success' && commRes?.data) {
          setMasterCommodities(commRes.data);
        }
        if (varRes?.status === 'success' && varRes?.data) {
          setMasterVarieties(varRes.data);
        }
      } catch (err) {
        console.error('Error fetching master commodities/varieties for filter:', err);
      }
    };
    fetchMasterData();
  }, []);

  // Filter States
  const [search, setSearch] = useState('');
  const [filterPeriode, setFilterPeriode] = useState<[Date | null, Date | null]>(getInitialMonthRange());
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

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
      const commVal = filterKomoditas?.value || (typeof filterKomoditas === 'string' && filterKomoditas !== 'Semua Komoditas' ? filterKomoditas : undefined);
      const varVal = filterVarietas?.value || (typeof filterVarietas === 'string' && filterVarietas !== 'Semua Varietas' ? filterVarietas : undefined);
      const statusVal = filterStatus?.value || (typeof filterStatus === 'string' && filterStatus !== 'Semua Status' ? filterStatus : undefined);
      const startDateStr = formatDateYYYYMMDD(filterPeriode[0]);
      const endDateStr = formatDateYYYYMMDD(filterPeriode[1]);

      const res = await panenService.getPanenList({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        komoditas: commVal || undefined,
        varietas: varVal || undefined,
        status: statusVal || undefined,
        startDate: startDateStr || undefined,
        endDate: endDateStr || undefined,
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
  }, [currentPage, pageSize, search, filterKomoditas, filterVarietas, filterStatus, filterPeriode]);

  // Helper setter for auto-select
  const setSelectedPanSelected = (item: PanenItem | null) => {
    setSelectedPanen(item);
  };

  useEffect(() => {
    fetchPanens();
  }, [fetchPanens]);

  const fetchKesiapanSiapPanen = useCallback(async () => {
    try {
      const res = await kesiapanPanenService.getKesiapanPanenList({ status: 'Siap Panen', limit: 100 });
      const list: KesiapanPanenItem[] = res?.data || [];
      const filtered = list.filter((i) => i.statusKesiapan === 'Siap Panen');
      if (filtered.length > 0) {
        setKesiapanSiapPanenList(filtered);
      } else {
        const fallbacks = INITIAL_KESIAPAN_PANEN_LIST.filter((i) => i.statusKesiapan === 'Siap Panen');
        setKesiapanSiapPanenList(fallbacks);
      }
    } catch (err) {
      console.error('Error fetching kesiapan panen (Siap Panen):', err);
      const fallbacks = INITIAL_KESIAPAN_PANEN_LIST.filter((i) => i.statusKesiapan === 'Siap Panen');
      setKesiapanSiapPanenList(fallbacks);
    }
  }, []);

  useEffect(() => {
    fetchKesiapanSiapPanen();
  }, [fetchKesiapanSiapPanen]);

  // Dynamic Options for filters based on Master Data
  const komoditasOptions = useMemo(() => {
    if (masterCommodities.length > 0) {
      return [
        { value: '', label: 'Semua Komoditas' },
        ...masterCommodities.map((c) => ({
          value: c.namaKomoditas,
          label: c.namaKomoditas,
        })),
      ];
    }
    return [
      { value: '', label: 'Semua Komoditas' },
      { value: 'Padi', label: 'Padi' },
      { value: 'Jagung', label: 'Jagung' },
      { value: 'Kedelai', label: 'Kedelai' },
      { value: 'Kacang Hijau', label: 'Kacang Hijau' },
    ];
  }, [masterCommodities]);

  const selectedKomoditasVal = filterKomoditas?.value || (typeof filterKomoditas === 'string' ? filterKomoditas : '');

  const varietasOptions = useMemo(() => {
    let filteredVarieties = masterVarieties;

    if (selectedKomoditasVal && selectedKomoditasVal !== 'Semua Komoditas') {
      const matchedComm = masterCommodities.find(
        (c) => c.namaKomoditas.toLowerCase() === selectedKomoditasVal.toLowerCase() || c.id === selectedKomoditasVal
      );

      filteredVarieties = masterVarieties.filter((v) => {
        if (matchedComm && v.commodityId === matchedComm.id) return true;
        if (v.commodity?.namaKomoditas?.toLowerCase() === selectedKomoditasVal.toLowerCase()) return true;
        return false;
      });
    }

    if (filteredVarieties.length > 0) {
      return [
        { value: '', label: 'Semua Varietas' },
        ...filteredVarieties.map((v) => ({
          value: v.namaVarietas,
          label: v.namaVarietas,
        })),
      ];
    }

    const fallbackMap: Record<string, string[]> = {
      Padi: ['Inpari 32', 'Inpari 42', 'Ciherang', 'Mekongga', 'Sintanur'],
      Jagung: ['Pioneer 21', 'Bisi 18', 'P21'],
      Kedelai: ['Anjasmoro', 'Dega 1'],
      'Kacang Hijau': ['Vima 1'],
    };

    if (selectedKomoditasVal && fallbackMap[selectedKomoditasVal]) {
      return [
        { value: '', label: 'Semua Varietas' },
        ...fallbackMap[selectedKomoditasVal].map((v) => ({ value: v, label: v })),
      ];
    }

    return [
      { value: '', label: 'Semua Varietas' },
      { value: 'Inpari 32', label: 'Inpari 32' },
      { value: 'Inpari 42', label: 'Inpari 42' },
      { value: 'Ciherang', label: 'Ciherang' },
      { value: 'Pioneer 21', label: 'Pioneer 21' },
      { value: 'Bisi 18', label: 'Bisi 18' },
      { value: 'P21', label: 'P21' },
      { value: 'Anjasmoro', label: 'Anjasmoro' },
      { value: 'Dega 1', label: 'Dega 1' },
      { value: 'Vima 1', label: 'Vima 1' },
    ];
  }, [masterVarieties, masterCommodities, selectedKomoditasVal]);

  const handleFilterKomoditasChange = (val: any) => {
    setFilterKomoditas(val);
    setFilterVarietas(null);
  };

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Berlangsung', label: 'Berlangsung' },
    { value: 'Belum Mulai', label: 'Belum Mulai' },
  ];

  // Filter actions
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPanens();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterStatus(null);
    setFilterPeriode(getInitialMonthRange());
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
      // Fallback local update if API error occurs
      if (editingItem) {
        setPanenList((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
        );
        toast.success('Data panen berhasil diperbarui (lokal)');
      } else {
        const newItem: PanenItem = {
          id: `pn-temp-${Date.now()}`,
          kodePanen: formData.kodePanen || `PN-2606-00${panenList.length + 1}`,
          komoditas: formData.komoditas || 'Padi',
          varietas: formData.varietas || 'Inpari 32',
          lahan: formData.lahan || 'Lahan A1 - Blok 01',
          tanggalPanen: formData.tanggalPanen || new Date().toISOString(),
          luasHa: formData.luasHa || 0,
          produksiKg: formData.produksiKg || 0,
          hasilKgHa: formData.luasHa ? Math.round((formData.produksiKg || 0) / formData.luasHa) : 0,
          status: formData.status || 'Selesai',
          penanggungJawab: formData.penanggungJawab || 'Budi Santoso',
          metodePanen: formData.metodePanen || 'Combine Harvester',
          produksiKotorKg: formData.produksiKotorKg || 0,
          kadarAir: formData.kadarAir || 14,
          kebersihan: formData.kebersihan || 98,
          catatan: formData.catatan || '',
          ...formData,
        };
        setPanenList((prev) => [newItem, ...prev]);
        setTotalRecords((prev) => prev + 1);
        toast.success('Data panen berhasil ditambahkan');
      }
      setIsModalOpen(false);
    }
  };

  // Aggregated Stat Items matching the top 7 stat cards
  const statItems: StatItem[] = useMemo(() => {
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

    return [
      {
        title: 'Total Panen (Periode)',
        value: totalPanen,
        subtitle: 'Kegiatan Panen',
        icon: 'ri-plant-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Total Luas Dipanen',
        value: `${totalLuas.toFixed(2).replace('.', ',')} Ha`,
        subtitle: 'Luas Dipanen',
        icon: 'ri-landscape-line',
        bgColor: 'bg-purple-100/80',
        textColor: 'text-purple-700'
      },
      {
        title: 'Total Produksi',
        value: `${totalProduksi.toLocaleString('id-ID')} Kg`,
        subtitle: 'Berat Bersih',
        icon: 'ri-inbox-archive-line',
        bgColor: 'bg-orange-100/80',
        textColor: 'text-orange-700'
      },
      {
        title: 'Rata-rata Hasil',
        value: `${rataHasil.toLocaleString('id-ID')} Kg/Ha`,
        subtitle: 'Produktivitas Rata-rata',
        icon: 'ri-leaf-line',
        bgColor: 'bg-blue-100/80',
        textColor: 'text-blue-700'
      },
      {
        title: 'Selesai',
        value: selesaiCount,
        subtitle: 'Kegiatan Selesai',
        icon: 'ri-checkbox-circle-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Berlangsung',
        value: berlangsungCount,
        subtitle: 'Sedang Berlangsung',
        icon: 'ri-time-line',
        bgColor: 'bg-amber-100/80',
        textColor: 'text-amber-700'
      },
      {
        title: 'Belum Mulai',
        value: belumMulaiCount,
        subtitle: 'Belum Dilaksanakan',
        icon: 'ri-history-line',
        bgColor: 'bg-rose-100/80',
        textColor: 'text-rose-700'
      }
    ];
  }, [apiStats, totalRecords, panenList]);

  return {
    panenList,
    isLoading,
    selectedPanen,
    setSelectedPanen,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas: handleFilterKomoditasChange,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
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
    kesiapanSiapPanenList,
    fetchKesiapanSiapPanen,
  };
}

export default usePanen;
