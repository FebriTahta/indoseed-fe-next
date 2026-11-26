import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { KontrakPanen, KontrakPanenFilterParams, KontrakPanenStats, KontrakPanenFormData } from '@/app/types/kontrakPanen';
import { kontrakPanenService } from '@/app/services/kontrakPanenService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';

const defaultFormData: KontrakPanenFormData = {
  noKontrak: '',
  commodityId: '',
  komoditas: '',
  varietyId: '',
  varietas: '',
  harvestTypeId: '',
  tipePanenan: '',
  nilaiKontrak: '',
  feeKelompok: '',
  satuan: 'Kg',
  umurPanen: '',
  periodeMulai: '2026-01-01',
  periodeSelesai: '2026-12-31',
  status: 'Aktif',
  keterangan: '',
};

export const useKontrakPanen = () => {
  const [items, setItems] = useState<KontrakPanen[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<KontrakPanenStats>({ total: 0, aktif: 0, tidakAktif: 0, draft: 0 });

  // Filters
  const [search, setSearch] = useState<string>('');
  const [komoditas, setKomoditas] = useState<string>('all');
  const [varietas, setVarietas] = useState<string>('all');
  const [tipePanenan, setTipePanenan] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  // Master Data Options
  const [commodityList, setCommodityList] = useState<{ id: string; namaKomoditas: string }[]>([]);
  const [varietyList, setVarietyList] = useState<{ id: string; namaVarietas: string; commodityId: string; umurTanam?: string }[]>([]);

  // Harvest Types from Master Tipe Panen for currently selected variety
  const [harvestTypesList, setHarvestTypesList] = useState<any[]>([]);
  const [loadingHarvestTypes, setLoadingHarvestTypes] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [formModalMode, setFormModalMode] = useState<'create' | 'edit'>('create');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Selected item & form state
  const [selectedItem, setSelectedItem] = useState<KontrakPanen | null>(null);
  const [formData, setFormData] = useState<KontrakPanenFormData>(defaultFormData);

  // Fetch Commodities and Varieties for selects
  const fetchMasterOptions = useCallback(async () => {
    try {
      const [commRes, varRes] = await Promise.all([
        commodityService.getCommodities({ pageSize: 100 }),
        varietyService.getVarieties({ pageSize: 100 }),
      ]);
      if (commRes?.data) {
        setCommodityList(commRes.data.map((c: any) => ({ id: c.id, namaKomoditas: c.namaKomoditas })));
      }
      if (varRes?.data) {
        setVarietyList(varRes.data.map((v: any) => ({
          id: v.id,
          namaVarietas: v.namaVarietas,
          commodityId: v.commodityId,
          umurTanam: v.umurTanam,
        })));
      }
    } catch (err) {
      console.error('Error fetching master options:', err);
    }
  }, []);

  useEffect(() => {
    fetchMasterOptions();
  }, [fetchMasterOptions]);

  // Fetch Harvest Types from Master Tipe Panen for a specific variety
  const fetchHarvestTypesForVariety = useCallback(async (varietyId?: string) => {
    if (!varietyId) {
      setHarvestTypesList([]);
      return;
    }
    setLoadingHarvestTypes(true);
    try {
      const res = await kontrakPanenService.getHarvestTypes(varietyId);
      if (res?.success && Array.isArray(res.data)) {
        setHarvestTypesList(res.data);
      } else {
        setHarvestTypesList([]);
      }
    } catch (err) {
      console.error('Error fetching harvest types for variety:', err);
      setHarvestTypesList([]);
    } finally {
      setLoadingHarvestTypes(false);
    }
  }, []);

  // Fetch List Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: KontrakPanenFilterParams = {
        page: currentPage,
        limit: pageSize,
      };

      if (search.trim()) params.search = search.trim();
      if (komoditas && komoditas !== 'all') params.komoditas = komoditas;
      if (varietas && varietas !== 'all') params.varietas = varietas;
      if (tipePanenan && tipePanenan !== 'all') params.tipePanenan = tipePanenan;
      if (status && status !== 'all') params.status = status;

      const res = await kontrakPanenService.getList(params);
      if (res?.success) {
        setItems(res.data);
        setTotalRecords(res.meta.total);
        setTotalPages(res.meta.totalPages || 1);
      }
    } catch (err: any) {
      console.error('Error fetching kontrak panen:', err);
      setError(err.response?.data?.message || 'Gagal memuat data kontrak panen');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, komoditas, varietas, tipePanenan, status]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await kontrakPanenService.getStats();
      if (res?.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [fetchData, fetchStats]);

  const handleResetFilters = () => {
    setSearch('');
    setKomoditas('all');
    setVarietas('all');
    setTipePanenan('all');
    setStatus('all');
    setCurrentPage(1);
  };

  const handleKomoditasFilterChange = (selectedKom: string) => {
    setKomoditas(selectedKom);
    // If selected varietas is not under this commodity, reset to all
    if (selectedKom !== 'all') {
      const commObj = commodityList.find((c) => c.namaKomoditas === selectedKom || c.id === selectedKom);
      if (commObj) {
        const matchingVar = varietyList.find((v) => v.commodityId === commObj.id && (v.namaVarietas === varietas || v.id === varietas));
        if (!matchingVar) {
          setVarietas('all');
        }
      }
    }
    setCurrentPage(1);
  };

  // Open Add Modal
  const handleOpenCreateModal = async () => {
    try {
      const nextNumRes = await kontrakPanenService.getNextNumber();
      const nextNum = nextNumRes?.data?.nextNoKontrak || '';
      setFormData({
        ...defaultFormData,
        noKontrak: nextNum,
      });
    } catch {
      setFormData(defaultFormData);
    }
    setHarvestTypesList([]);
    setFormModalMode('create');
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: KontrakPanen) => {
    setSelectedItem(item);
    setFormData({
      noKontrak: item.noKontrak,
      commodityId: item.commodityId || '',
      komoditas: item.komoditas,
      varietyId: item.varietyId || '',
      varietas: item.varietas,
      harvestTypeId: item.harvestTypeId || '',
      tipePanenan: item.tipePanenan || '',
      nilaiKontrak: item.nilaiKontrak,
      feeKelompok: item.feeKelompok !== null && item.feeKelompok !== undefined ? item.feeKelompok : '',
      satuan: item.satuan || 'Kg',
      umurPanen: item.umurPanen,
      periodeMulai: item.periodeMulai ? item.periodeMulai.split('T')[0] : '2026-01-01',
      periodeSelesai: item.periodeSelesai ? item.periodeSelesai.split('T')[0] : '2026-12-31',
      status: item.status || 'Aktif',
      keterangan: item.keterangan || '',
    });
    
    // Fetch harvest types for the edit item's variety
    if (item.varietyId) {
      fetchHarvestTypesForVariety(item.varietyId);
    } else {
      // Find variety by name if ID was null
      const foundVar = varietyList.find((v) => v.namaVarietas === item.varietas);
      if (foundVar) {
        fetchHarvestTypesForVariety(foundVar.id);
      }
    }

    setFormModalMode('edit');
    setIsFormModalOpen(true);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: KontrakPanen) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Save Form (Create or Edit)
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.komoditas) {
      toast.warning('Silakan pilih komoditas');
      return;
    }
    if (!formData.varietas) {
      toast.warning('Silakan pilih varietas');
      return;
    }
    if (!formData.tipePanenan) {
      toast.warning('Silakan pilih tipe panenan');
      return;
    }
    if (!formData.nilaiKontrak || Number(formData.nilaiKontrak) <= 0) {
      toast.warning('Silakan masukkan harga kontrak yang valid');
      return;
    }
    if (!formData.umurPanen || Number(formData.umurPanen) <= 0) {
      toast.warning('Silakan masukkan umur panen (HST) yang valid');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<KontrakPanen> = {
        noKontrak: formData.noKontrak,
        commodityId: formData.commodityId || null,
        komoditas: formData.komoditas,
        varietyId: formData.varietyId || null,
        varietas: formData.varietas,
        harvestTypeId: formData.harvestTypeId || null,
        tipePanenan: formData.tipePanenan,
        nilaiKontrak: Number(formData.nilaiKontrak),
        feeKelompok: formData.feeKelompok !== '' && formData.feeKelompok !== undefined ? Number(formData.feeKelompok) : 0,
        satuan: formData.satuan,
        umurPanen: Number(formData.umurPanen),
        periodeMulai: formData.periodeMulai ? new Date(formData.periodeMulai).toISOString() : null,
        periodeSelesai: formData.periodeSelesai ? new Date(formData.periodeSelesai).toISOString() : null,
        status: formData.status,
        keterangan: formData.keterangan,
      };

      if (formModalMode === 'create') {
        const res = await kontrakPanenService.create(payload);
        if (res.success) {
          toast.success(res.message || 'Kontrak Panen berhasil ditambahkan');
          setIsFormModalOpen(false);
          fetchData();
          fetchStats();
        }
      } else if (selectedItem) {
        const res = await kontrakPanenService.update(selectedItem.id, payload);
        if (res.success) {
          toast.success(res.message || 'Kontrak Panen berhasil diperbarui');
          setIsFormModalOpen(false);
          if (isDetailModalOpen && selectedItem.id === res.data.id) {
            setSelectedItem(res.data);
          }
          fetchData();
          fetchStats();
        }
      }
    } catch (err: any) {
      console.error('Error saving kontrak panen:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Item
  const handleDelete = async (item: KontrakPanen) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kontrak panen "${item.noKontrak}" (${item.varietas})?`)) {
      return;
    }

    try {
      const res = await kontrakPanenService.delete(item.id);
      if (res.success) {
        toast.success(res.message || 'Kontrak Panen berhasil dihapus');
        if (selectedItem?.id === item.id) {
          setIsDetailModalOpen(false);
          setSelectedItem(null);
        }
        fetchData();
        fetchStats();
      }
    } catch (err: any) {
      console.error('Error deleting kontrak panen:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  return {
    items,
    loading,
    error,
    stats,
    // Filters
    search,
    setSearch,
    komoditas,
    setKomoditas,
    handleKomoditasFilterChange,
    varietas,
    setVarietas,
    tipePanenan,
    setTipePanenan,
    status,
    setStatus,
    handleResetFilters,
    // Master Lists
    commodityList,
    varietyList,
    harvestTypesList,
    loadingHarvestTypes,
    fetchHarvestTypesForVariety,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    // Modals
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isSubmitting,
    selectedItem,
    setSelectedItem,
    formData,
    setFormData,
    // Actions
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleSaveForm,
    handleDelete,
    refreshData: () => {
      fetchData();
      fetchStats();
    },
  };
};
