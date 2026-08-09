import { useState, useCallback, useMemo, useEffect } from 'react';
import { KesiapanPanenItem } from '../types/kesiapanPanen';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { kesiapanPanenService } from '../services/kesiapanPanenService';
import { jadwalTanamService } from '../services/jadwalTanamService';

const FALLBACK_JADWAL_TANAM = [
  {
    id: 'jt-1',
    kodeJadwalTanam: 'JT-2606-0001',
    informasiUmum: { kodeJadwalTanam: 'JT-2606-0001' },
    lahanKomoditas: {
      namaLahan: 'Blok A - Petak 1',
      namaKomoditas: 'Padi',
      namaVarietas: 'Inpari 32',
    },
    rencanaTanam: {
      tanggalTanam: '01/03/2026',
      perkiraanPanen: '15/06/2026',
    },
  },
  {
    id: 'jt-2',
    kodeJadwalTanam: 'JT-2606-0002',
    informasiUmum: { kodeJadwalTanam: 'JT-2606-0002' },
    lahanKomoditas: {
      namaLahan: 'Blok A - Petak 2',
      namaKomoditas: 'Jagung',
      namaVarietas: 'Pioneer 21',
    },
    rencanaTanam: {
      tanggalTanam: '05/03/2026',
      perkiraanPanen: '18/06/2026',
    },
  },
  {
    id: 'jt-3',
    kodeJadwalTanam: 'JT-2606-0003',
    informasiUmum: { kodeJadwalTanam: 'JT-2606-0003' },
    lahanKomoditas: {
      namaLahan: 'Blok B - Petak 1',
      namaKomoditas: 'Kedelai',
      namaVarietas: 'Anjasmoro',
    },
    rencanaTanam: {
      tanggalTanam: '10/03/2026',
      perkiraanPanen: '20/06/2026',
    },
  },
  {
    id: 'jt-4',
    kodeJadwalTanam: 'JT-2606-0004',
    informasiUmum: { kodeJadwalTanam: 'JT-2606-0004' },
    lahanKomoditas: {
      namaLahan: 'Blok C - Petak 1',
      namaKomoditas: 'Padi',
      namaVarietas: 'Inpari 42',
    },
    rencanaTanam: {
      tanggalTanam: '15/03/2026',
      perkiraanPanen: '25/06/2026',
    },
  },
];

export const INITIAL_KESIAPAN_PANEN_LIST: KesiapanPanenItem[] = [
  {
    no: 1,
    kodeLahan: 'KP-2605-0001',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    tanggalTanam: '01/03/2026',
    umurHst: 102,
    prediksiPanen: '12/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 6800,
    luasHa: 5.0
  },
  {
    no: 2,
    kodeLahan: 'KP-2605-0002',
    lokasi: 'Blok A - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    tanggalTanam: '05/03/2026',
    umurHst: 98,
    prediksiPanen: '14/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 7200,
    luasHa: 4.5
  },
  {
    no: 3,
    kodeLahan: 'KP-2605-0003',
    lokasi: 'Blok B - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    tanggalTanam: '10/03/2026',
    umurHst: 95,
    prediksiPanen: '16/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 3100,
    luasHa: 3.8
  },
  {
    no: 4,
    kodeLahan: 'KP-2605-0004',
    lokasi: 'Blok B - Petak 2',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    tanggalTanam: '02/03/2026',
    umurHst: 101,
    prediksiPanen: '13/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 6500,
    luasHa: 5.2
  },
  {
    no: 5,
    kodeLahan: 'KP-2605-0005',
    lokasi: 'Blok C - Petak 1',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    tanggalTanam: '06/03/2026',
    umurHst: 97,
    prediksiPanen: '15/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 6900
  },
  {
    no: 6,
    kodeLahan: 'KP-2605-0006',
    lokasi: 'Blok C - Petak 2',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    tanggalTanam: '03/03/2026',
    umurHst: 100,
    prediksiPanen: '17/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 6700
  },
  {
    no: 7,
    kodeLahan: 'KP-2605-0007',
    lokasi: 'Blok D - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Dega 1',
    tanggalTanam: '12/03/2026',
    umurHst: 93,
    prediksiPanen: '18/06/2026',
    statusKesiapan: 'Akan Siap (8-14 Hari)',
    yieldEst: 3300
  },
  {
    no: 8,
    kodeLahan: 'KP-2605-0008',
    lokasi: 'Blok D - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    tanggalTanam: '08/03/2026',
    umurHst: 95,
    prediksiPanen: '19/06/2026',
    statusKesiapan: 'Akan Siap (8-14 Hari)',
    yieldEst: 6400
  },
  {
    no: 9,
    kodeLahan: 'KP-2605-0009',
    lokasi: 'Blok E - Petak 1',
    komoditas: 'Padi',
    varietas: 'Mekongga',
    tanggalTanam: '04/03/2026',
    umurHst: 99,
    prediksiPanen: '20/06/2026',
    statusKesiapan: 'Belum Siap',
    yieldEst: 6100
  },
  {
    no: 10,
    kodeLahan: 'KP-2605-0010',
    lokasi: 'Blok E - Petak 2',
    komoditas: 'Padi',
    varietas: 'Sintanur',
    tanggalTanam: '07/03/2026',
    umurHst: 96,
    prediksiPanen: '21/06/2026',
    statusKesiapan: 'Belum Siap',
    yieldEst: 6200
  }
];

export function useKesiapanPanen() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [kesiapanList, setKesiapanList] = useState<KesiapanPanenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Filter states
  const getInitialPeriodStr = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const [filterPeriode, setFilterPeriode] = useState(getInitialPeriodStr());
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KesiapanPanenItem | null>(null);

  const fetchKesiapanPanen = useCallback(async () => {
    setLoading(true);
    try {
      const res = await kesiapanPanenService.getKesiapanPanenList({
        page: currentPage,
        limit: pageSize,
        komoditas: filterKomoditas?.value || undefined,
        varietas: filterVarietas?.value || undefined,
        lokasi: filterLokasi?.value || undefined,
        status: filterStatus?.value || undefined,
      });

      const list = res?.data || [];
      setKesiapanList(list);
      setTotalRecords(res?.meta?.total ?? list.length);
      setTotalPages(res?.meta?.totalPages ?? 1);
      if (res?.stats) setApiStats(res.stats);
    } catch (err: any) {
      console.error('Error fetching Kesiapan Panen:', err);
      toast.error(err.response?.data?.message || 'Gagal memuat data kesiapan panen dari server');
      setKesiapanList([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterVarietas, filterLokasi, filterStatus]);

  const [jadwalTanamOptions, setJadwalTanamOptions] = useState<any[]>(FALLBACK_JADWAL_TANAM);

  useEffect(() => {
    const fetchJadwalTanamList = async () => {
      try {
        const res = await jadwalTanamService.getJadwalTanamList({ pageSize: 1000 });
        const list = res?.data || (res as any)?.data?.data || [];
        if (list && list.length > 0) {
          setJadwalTanamOptions(list);
        }
      } catch (err) {
        console.error('Error fetching jadwal tanam list:', err);
      }
    };
    fetchJadwalTanamList();
  }, []);

  useEffect(() => {
    fetchKesiapanPanen();
  }, [fetchKesiapanPanen]);

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

  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    ...lands.map((item: Land) => ({
      value: item.namaLahan,
      label: item.namaLahan
    }))
  ], [lands]);

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Siap Panen', label: 'Siap Panen' },
    { value: 'Akan Siap (3-7 Hari)', label: 'Akan Siap (3-7 Hari)' },
    { value: 'Akan Siap (8-14 Hari)', label: 'Akan Siap (8-14 Hari)' },
    { value: 'Belum Siap', label: 'Belum Siap' },
  ];

  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchKesiapanPanen();
  }, [fetchKesiapanPanen]);

  const handleResetFilters = () => {
    setFilterPeriode(getInitialPeriodStr());
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterLokasi(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => {
    const totalCount = kesiapanList.length;
    const siapCount = kesiapanList.filter((i) => i.statusKesiapan === 'Siap Panen').length;
    const akan3_7Count = kesiapanList.filter((i) => i.statusKesiapan === 'Akan Siap (3-7 Hari)').length;
    const akan8_14Count = kesiapanList.filter((i) => i.statusKesiapan === 'Akan Siap (8-14 Hari)').length;
    const belumCount = kesiapanList.filter((i) => i.statusKesiapan === 'Belum Siap').length;

    const totalYieldSum = kesiapanList.reduce((acc, i) => acc + (i.yieldEst || 0), 0);
    const avgYieldVal = totalCount > 0 ? Math.round(totalYieldSum / totalCount) : 0;

    const totalVal = apiStats?.totalLahan !== undefined ? `${apiStats.totalLahan} Lahan` : `${totalCount} Lahan`;
    const siapVal = apiStats?.siapPanen !== undefined ? `${apiStats.siapPanen} Lahan` : `${siapCount} Lahan`;
    const akan3_7Val = apiStats?.akanSiap3_7 !== undefined ? `${apiStats.akanSiap3_7} Lahan` : `${akan3_7Count} Lahan`;
    const akan8_14Val = apiStats?.akanSiap8_14 !== undefined ? `${apiStats.akanSiap8_14} Lahan` : `${akan8_14Count} Lahan`;
    const belumVal = apiStats?.belumSiap !== undefined ? `${apiStats.belumSiap} Lahan` : `${belumCount} Lahan`;
    const yieldVal = apiStats?.avgYield !== undefined ? `${apiStats.avgYield.toLocaleString('id-ID')} Kg/Ha` : `${avgYieldVal.toLocaleString('id-ID')} Kg/Ha`;

    return [
      {
        title: 'Total Lahan',
        value: totalVal,
        subtitle: 'Luas Terdaftar',
        icon: 'ri-seedling-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Siap Panen',
        value: siapVal,
        subtitle: 'Siap Dipanen',
        icon: 'ri-time-line',
        bgColor: 'bg-blue-100/80',
        textColor: 'text-blue-700'
      },
      {
        title: 'Akan Siap (3-7 Hari)',
        value: akan3_7Val,
        subtitle: 'Tingkat Kematangan Tinggi',
        icon: 'ri-hourglass-line',
        bgColor: 'bg-amber-100/80',
        textColor: 'text-amber-700'
      },
      {
        title: 'Akan Siap (8-14 Hari)',
        value: akan8_14Val,
        subtitle: 'Fase Akhir Pengisian',
        icon: 'ri-hourglass-fill',
        bgColor: 'bg-purple-100/80',
        textColor: 'text-purple-700'
      },
      {
        title: 'Belum Siap',
        value: belumVal,
        subtitle: 'Fase Vegetatif/Generatif',
        icon: 'ri-error-warning-line',
        bgColor: 'bg-rose-100/80',
        textColor: 'text-rose-700'
      },
      {
        title: 'Rata-rata Yield Est.',
        value: yieldVal,
        subtitle: 'Hasil Panen Per Hektar',
        icon: 'ri-bar-chart-fill',
        bgColor: 'bg-teal-100/80',
        textColor: 'text-teal-700'
      }
    ];
  }, [kesiapanList, apiStats]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: KesiapanPanenItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (item: KesiapanPanenItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (item: KesiapanPanenItem) => {
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

  const handleSubmitCreate = async (data: Partial<KesiapanPanenItem>) => {
    try {
      const res = await kesiapanPanenService.createKesiapanPanen(data);
      toast.success(res?.message || 'Data kesiapan panen berhasil ditambahkan');
      handleCloseModals();
      fetchKesiapanPanen();
    } catch (err: any) {
      console.error('Error creating kesiapan panen:', err);
      toast.error(err.response?.data?.message || 'Gagal menambahkan data kesiapan panen');
    }
  };

  const handleSubmitUpdate = async (data: Partial<KesiapanPanenItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeLahan || '';
    try {
      const res = await kesiapanPanenService.updateKesiapanPanen(idOrKode, data);
      toast.success(res?.message || 'Data kesiapan panen berhasil diperbarui');
      handleCloseModals();
      fetchKesiapanPanen();
    } catch (err: any) {
      console.error('Error updating kesiapan panen:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui data kesiapan panen');
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeLahan || '';
    try {
      const res = await kesiapanPanenService.deleteKesiapanPanen(idOrKode);
      toast.success(res?.message || 'Data kesiapan panen berhasil dihapus');
      handleCloseModals();
      fetchKesiapanPanen();
    } catch (err: any) {
      console.error('Error deleting kesiapan panen:', err);
      toast.error(err.response?.data?.message || 'Gagal menghapus data kesiapan panen');
    }
  };

  return {
    kesiapanList,
    loading,
    apiStats,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterLokasi,
    setFilterLokasi,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    komoditasOptions,
    varietasOptions,
    lokasiOptions,
    statusOptions,
    jadwalTanamOptions,
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

export default useKesiapanPanen;
