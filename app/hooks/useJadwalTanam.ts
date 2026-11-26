import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import jadwalTanamService from '@/app/services/jadwalTanamService';
import { partnerService } from '@/app/services/partnerService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { penanggungJawabService } from '@/app/services/penanggungJawabService';
import { JadwalTanam, JadwalTanamStats } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';

export function useJadwalTanams() {
  const router = useRouter();

  const [items, setItems] = useState<JadwalTanam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stats
  const [stats, setStats] = useState<JadwalTanamStats>({
    total: 0,
    dalamProses: 0,
    disetujui: 0,
    revisi: 0,
    ditolak: 0,
    trends: {
      total: '+2 dari bulan lalu',
      dalamProses: '+1 dari bulan lalu',
      disetujui: '+2 dari bulan lalu',
      revisi: '+1 dari bulan lalu',
      ditolak: '-0 dari bulan lalu',
    },
  });

  // Filters State
  const [search, setSearch] = useState('');
  const [filterPeriode, setFilterPeriode] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPenanggungJawab, setFilterPenanggungJawab] = useState<string>('all');
  const [filterPetani, setFilterPetani] = useState<string>('all');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('all');
  const [filterVarietas, setFilterVarietas] = useState<string>('all');

  // Master Data Options
  const [penanggungJawabList, setPenanggungJawabList] = useState<any[]>([]);
  const [partnerList, setPartnerList] = useState<any[]>([]);
  const [commodityList, setCommodityList] = useState<any[]>([]);
  const [varietyList, setVarietyList] = useState<any[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selected checkbox rows
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Load master options once
  useEffect(() => {
    async function loadMasters() {
      try {
        const [pjRes, partRes, commRes, varRes] = await Promise.all([
          penanggungJawabService.getPenanggungJawab({ status: 'Aktif', pageSize: 100 }).catch(() => ({ data: [] })),
          partnerService.getPartners({ pageSize: 100, status: 'Aktif' }).catch(() => ({ data: [] })),
          commodityService.getCommodities({ status: 'Aktif' }).catch(() => ({ data: [] })),
          varietyService.getVarieties({ status: 'Aktif' }).catch(() => ({ data: [] })),
        ]);
        setPenanggungJawabList(pjRes.data || []);
        setPartnerList(partRes.data || []);
        setCommodityList(commRes.data || []);
        setVarietyList(varRes.data || []);
      } catch (err) {
        console.error('Error loading filter master data:', err);
      }
    }
    loadMasters();
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await jadwalTanamService.getJadwalTanamStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Fetch Items
  const fetchJadwalTanams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {
        page: currentPage,
        pageSize: pageSize,
      };

      if (search.trim()) params.search = search.trim();
      if (filterStatus && filterStatus !== 'all' && filterStatus !== 'Semua Status') {
        params.statusJadwal = filterStatus;
      }
      if (filterPenanggungJawab && filterPenanggungJawab !== 'all' && filterPenanggungJawab !== 'Semua Penanggung Jawab') {
        params.penanggungJawab = filterPenanggungJawab;
      }
      if (filterPetani && filterPetani !== 'all' && filterPetani !== 'Semua Petani') {
        params.partnerId = filterPetani;
      }
      if (filterKomoditas && filterKomoditas !== 'all' && filterKomoditas !== 'Semua Komoditas') {
        params.commodityId = filterKomoditas;
      }
      if (filterVarietas && filterVarietas !== 'all' && filterVarietas !== 'Semua Varietas') {
        params.varietyId = filterVarietas;
      }
      if (filterPeriode && filterPeriode !== 'all' && filterPeriode !== 'Pilih periode') {
        params.periodeTanam = filterPeriode;
      }

      const res = await jadwalTanamService.getJadwalTanamList(params);
      const dataItems = res.data || [];
      const pagination = (res as any).pagination || {};

      setItems(dataItems);
      setTotalRecords(pagination.total ?? dataItems.length);
      setTotalPages(pagination.totalPages ?? (Math.ceil((pagination.total || dataItems.length) / pageSize) || 1));
    } catch (err: any) {
      console.error('Error loading jadwal tanam:', err);
      setError(err.response?.data?.message || 'Gagal memuat data jadwal tanam');
      setItems([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, search, filterStatus, filterPenanggungJawab, filterPetani, filterKomoditas, filterVarietas, filterPeriode]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchJadwalTanams();
  }, [fetchJadwalTanams]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchJadwalTanams();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterPeriode('all');
    setFilterStatus('all');
    setFilterPenanggungJawab('all');
    setFilterPetani('all');
    setFilterKomoditas('all');
    setFilterVarietas('all');
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const handleDelete = async (id: string, kodeJadwal?: string) => {
    if (!id) return;
    const confirmMessage = kodeJadwal
      ? `Apakah Anda yakin ingin menghapus Jadwal Tanam (${kodeJadwal})?`
      : 'Apakah Anda yakin ingin menghapus Jadwal Tanam ini?';

    if (window.confirm(confirmMessage)) {
      try {
        await jadwalTanamService.deleteJadwalTanam(id);
        toast.success('Jadwal Tanam berhasil dihapus!');
        fetchJadwalTanams();
        fetchStats();
      } catch (err: any) {
        console.error('Error deleting Jadwal Tanam:', err);
        toast.error(err.response?.data?.message || 'Gagal menghapus Jadwal Tanam');
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, keterangan?: string) => {
    try {
      await jadwalTanamService.updateStatusJadwalTanam(id, newStatus, keterangan);
      toast.success(`Status berhasil diubah menjadi ${newStatus}`);
      fetchJadwalTanams();
      fetchStats();
    } catch (err: any) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  // Selection toggle
  const handleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllRows = () => {
    if (selectedRowIds.length === items.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(items.map((i) => i.id));
    }
  };

  return {
    items,
    loading,
    error,
    stats,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterStatus,
    setFilterStatus,
    filterPenanggungJawab,
    setFilterPenanggungJawab,
    filterPetani,
    setFilterPetani,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    penanggungJawabList,
    partnerList,
    commodityList,
    varietyList,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    selectedRowIds,
    handleSelectRow,
    handleSelectAllRows,
    handleApplyFilters,
    handleResetFilters,
    handleDelete,
    handleUpdateStatus,
    refreshData: () => {
      fetchJadwalTanams();
      fetchStats();
    },
  };
}

export default useJadwalTanams;
