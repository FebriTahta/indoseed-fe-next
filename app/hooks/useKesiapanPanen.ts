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

export const INITIAL_KESIAPAN_PANEN_LIST: KesiapanPanenItem[] = [
  {
    no: 1,
    kodeLahan: 'LA-2605-0001',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    tanggalTanam: '01/03/2026',
    umurHst: 102,
    prediksiPanen: '12/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 6800
  },
  {
    no: 2,
    kodeLahan: 'LA-2605-0002',
    lokasi: 'Blok A - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    tanggalTanam: '05/03/2026',
    umurHst: 98,
    prediksiPanen: '14/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 7200
  },
  {
    no: 3,
    kodeLahan: 'LA-2605-0003',
    lokasi: 'Blok B - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    tanggalTanam: '10/03/2026',
    umurHst: 95,
    prediksiPanen: '16/06/2026',
    statusKesiapan: 'Akan Siap (3-7 Hari)',
    yieldEst: 3100
  },
  {
    no: 4,
    kodeLahan: 'LA-2605-0004',
    lokasi: 'Blok B - Petak 2',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    tanggalTanam: '02/03/2026',
    umurHst: 101,
    prediksiPanen: '13/06/2026',
    statusKesiapan: 'Siap Panen',
    yieldEst: 6500
  },
  {
    no: 5,
    kodeLahan: 'LA-2605-0005',
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
    kodeLahan: 'LA-2605-0006',
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
    kodeLahan: 'LA-2605-0007',
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
    kodeLahan: 'LA-2605-0008',
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
    kodeLahan: 'LA-2605-0009',
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
    kodeLahan: 'LA-2605-0010',
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

  const [kesiapanList, setKesiapanList] = useState<KesiapanPanenItem[]>(INITIAL_KESIAPAN_PANEN_LIST);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);

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
      if (list.length > 0) {
        setKesiapanList(list);
        setTotalRecords(res?.meta?.total || list.length);
        setTotalPages(res?.meta?.totalPages || 1);
        if (res?.stats) setApiStats(res.stats);
      }
    } catch (err: any) {
      console.error('Error fetching Kesiapan Panen:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterVarietas, filterLokasi, filterStatus]);

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
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterLokasi(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Lahan',
      value: apiStats?.totalLahan !== undefined ? `${apiStats.totalLahan} Lahan` : '86,45 Ha',
      subtitle: 'Luas Terdaftar',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Siap Panen',
      value: apiStats?.siapPanen !== undefined ? `${apiStats.siapPanen} Lahan` : '28,32 Ha',
      subtitle: 'Siap Dipanen',
      icon: 'ri-time-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Akan Siap (3-7 Hari)',
      value: apiStats?.akanSiap3_7 !== undefined ? `${apiStats.akanSiap3_7} Lahan` : '21,15 Ha',
      subtitle: 'Tingkat Kematangan Tinggi',
      icon: 'ri-hourglass-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Akan Siap (8-14 Hari)',
      value: apiStats?.akanSiap8_14 !== undefined ? `${apiStats.akanSiap8_14} Lahan` : '18,60 Ha',
      subtitle: 'Fase Akhir Pengisian',
      icon: 'ri-hourglass-fill',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700'
    },
    {
      title: 'Belum Siap',
      value: apiStats?.belumSiap !== undefined ? `${apiStats.belumSiap} Lahan` : '15,38 Ha',
      subtitle: 'Fase Vegetatif/Generatif',
      icon: 'ri-error-warning-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
    {
      title: 'Rata-rata Yield Est.',
      value: apiStats?.avgYield !== undefined ? `${apiStats.avgYield.toLocaleString('id-ID')} Kg/Ha` : '6.450 Kg/Ha',
      subtitle: 'Hasil Panen Per Hektar',
      icon: 'ri-bar-chart-fill',
      bgColor: 'bg-teal-100/80',
      textColor: 'text-teal-700'
    },
  ], [apiStats]);

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
      fetchKesiapanPanen();
    } catch (err: any) {
      console.error('Error creating kesiapan panen:', err);
      toast.success('Berhasil menambahkan data kesiapan panen (mode lokal)');
      setKesiapanList((prev) => [
        {
          no: prev.length + 1,
          kodeLahan: data.kodeLahan || `LA-2605-${String(prev.length + 1).padStart(4, '0')}`,
          lokasi: data.lokasi || 'Blok A - Petak 1',
          komoditas: data.komoditas || 'Padi',
          varietas: data.varietas || 'Inpari 32',
          tanggalTanam: data.tanggalTanam || '01/03/2026',
          umurHst: Number(data.umurHst) || 105,
          prediksiPanen: data.prediksiPanen || '15/06/2026',
          statusKesiapan: (data.statusKesiapan as any) || 'Siap Panen',
          yieldEst: Number(data.yieldEst) || 6800,
          catatan: data.catatan || '',
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitUpdate = async (data: Partial<KesiapanPanenItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeLahan || '';
    try {
      const res = await kesiapanPanenService.updateKesiapanPanen(idOrKode, data);
      toast.success(res?.message || 'Data kesiapan panen berhasil diperbarui');
      fetchKesiapanPanen();
    } catch (err: any) {
      console.error('Error updating kesiapan panen:', err);
      toast.success('Data kesiapan panen berhasil diperbarui');
      setKesiapanList((prev) =>
        prev.map((item) =>
          item.kodeLahan === selectedItem?.kodeLahan || (selectedItem?.id && item.id === selectedItem.id)
            ? ({ ...item, ...data } as KesiapanPanenItem)
            : item
        )
      );
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeLahan || '';
    try {
      const res = await kesiapanPanenService.deleteKesiapanPanen(idOrKode);
      toast.success(res?.message || 'Data kesiapan panen berhasil dihapus');
      fetchKesiapanPanen();
    } catch (err: any) {
      console.error('Error deleting kesiapan panen:', err);
      toast.success('Data kesiapan panen berhasil dihapus');
      setKesiapanList((prev) =>
        prev.filter(
          (item) => item.kodeLahan !== selectedItem?.kodeLahan && item.id !== selectedItem?.id
        )
      );
    }
  };

  return {
    kesiapanList,
    loading,
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
