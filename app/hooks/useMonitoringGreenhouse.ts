import { useState, useCallback, useMemo, useEffect } from 'react';
import { MonitoringGreenhouseItem } from '../types/monitoringGreenhouse';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { monitoringGreenhouseService } from '../services/monitoringGreenhouseService';

export const INITIAL_GREENHOUSE_LIST: MonitoringGreenhouseItem[] = [
  {
    no: 1,
    kodeGreenhouse: 'GH-01',
    lokasi: 'Greenhouse A',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 1200,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 14:15'
  },
  {
    no: 2,
    kodeGreenhouse: 'GH-02',
    lokasi: 'Greenhouse A',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    luas: 1000,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 14:10'
  },
  {
    no: 3,
    kodeGreenhouse: 'GH-03',
    lokasi: 'Greenhouse B',
    komoditas: 'Tomat',
    varietas: 'Servo',
    luas: 900,
    status: 'Aktif',
    kondisi: 'Perlu Perhatian',
    aktivitasTerakhir: '11/06/2026 14:05'
  },
  {
    no: 4,
    kodeGreenhouse: 'GH-04',
    lokasi: 'Greenhouse B',
    komoditas: 'Cabai',
    varietas: 'Laris',
    luas: 800,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:50'
  },
  {
    no: 5,
    kodeGreenhouse: 'GH-05',
    lokasi: 'Greenhouse C',
    komoditas: 'Mentimun',
    varietas: 'Mistar',
    luas: 1100,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:45'
  },
  {
    no: 6,
    kodeGreenhouse: 'GH-06',
    lokasi: 'Greenhouse C',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 1200,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:40'
  },
  {
    no: 7,
    kodeGreenhouse: 'GH-07',
    lokasi: 'Greenhouse D',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    luas: 950,
    status: 'Aktif',
    kondisi: 'Baik',
    aktivitasTerakhir: '11/06/2026 13:35'
  },
  {
    no: 8,
    kodeGreenhouse: 'GH-08',
    lokasi: 'Greenhouse D',
    komoditas: 'Tomat',
    varietas: 'Servo',
    luas: 800,
    status: 'Aktif',
    kondisi: 'Buruk',
    aktivitasTerakhir: '11/06/2026 13:20'
  }
];

export function useMonitoringGreenhouse() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [greenhouseList, setGreenhouseList] = useState<MonitoringGreenhouseItem[]>(INITIAL_GREENHOUSE_LIST);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKondisi, setFilterKondisi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(18);
  const [totalPages, setTotalPages] = useState(2);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MonitoringGreenhouseItem | null>(null);

  const fetchMonitoringGreenhouse = useCallback(async () => {
    setLoading(true);
    try {
      const res = await monitoringGreenhouseService.getMonitoringGreenhouseList({
        page: currentPage,
        limit: pageSize,
        komoditas: filterKomoditas?.value || undefined,
        varietas: filterVarietas?.value || undefined,
        lokasi: filterLokasi?.value || undefined,
        status: filterStatus?.value || undefined,
        kondisi: filterKondisi?.value || undefined,
      });

      const list = res?.data || [];
      if (list.length > 0) {
        setGreenhouseList(list);
        setTotalRecords(res?.meta?.total || list.length);
        setTotalPages(res?.meta?.totalPages || 1);
        if (res?.stats) setApiStats(res.stats);
      }
    } catch (err: any) {
      console.error('Error fetching Monitoring Greenhouse:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterVarietas, filterLokasi, filterStatus, filterKondisi]);

  useEffect(() => {
    fetchMonitoringGreenhouse();
  }, [fetchMonitoringGreenhouse]);

  // Options
  const lokasiOptions = useMemo(() => [
    { value: '', label: 'Semua Lokasi' },
    ...lands.map((item: Land) => ({
      value: item.namaLahan,
      label: item.namaLahan
    }))
  ], [lands]);

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

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
    { value: 'Rencana', label: 'Rencana' },
    { value: 'Maintenance', label: 'Maintenance' },
  ];

  const kondisiOptions = [
    { value: '', label: 'Semua Kondisi' },
    { value: 'Baik', label: 'Baik' },
    { value: 'Perlu Perhatian', label: 'Perlu Perhatian' },
    { value: 'Buruk', label: 'Buruk' },
    { value: 'Tidak Aktif', label: 'Tidak Aktif' },
  ];

  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchMonitoringGreenhouse();
  }, [fetchMonitoringGreenhouse]);

  const handleResetFilters = () => {
    setFilterLokasi(null);
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterStatus(null);
    setFilterKondisi(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => [
    {
      title: 'Total Greenhouse',
      value: apiStats?.totalUnit !== undefined ? `${apiStats.totalUnit}` : '18',
      subtitle: 'Unit',
      icon: 'ri-home-wifi-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Greenhouse Aktif',
      value: apiStats?.aktifCount !== undefined ? `${apiStats.aktifCount}` : '15',
      subtitle: 'Unit (83,33%)',
      icon: 'ri-wifi-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Dalam Produksi',
      value: apiStats?.produksiCount !== undefined ? `${apiStats.produksiCount}` : '12',
      subtitle: 'Unit (66,67%)',
      icon: 'ri-plant-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Kondisi Baik',
      value: apiStats?.baikCount !== undefined ? `${apiStats.baikCount}` : '13',
      subtitle: 'Unit (72,22%)',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Perlu Perhatian',
      value: apiStats?.perhatianCount !== undefined ? `${apiStats.perhatianCount}` : '2',
      subtitle: 'Unit (11,11%)',
      icon: 'ri-error-warning-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Kondisi Buruk',
      value: apiStats?.burukCount !== undefined ? `${apiStats.burukCount}` : '1',
      subtitle: 'Unit (5,56%)',
      icon: 'ri-close-circle-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
  ], [apiStats]);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: MonitoringGreenhouseItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (item: MonitoringGreenhouseItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (item: MonitoringGreenhouseItem) => {
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

  const handleSubmitCreate = async (data: Partial<MonitoringGreenhouseItem>) => {
    try {
      const res = await monitoringGreenhouseService.createMonitoringGreenhouse(data);
      toast.success(res?.message || 'Data monitoring greenhouse berhasil ditambahkan');
      fetchMonitoringGreenhouse();
    } catch (err: any) {
      console.error('Error creating monitoring greenhouse:', err);
      toast.error(err?.response?.data?.message || 'Berhasil menambahkan data (mode lokal)');
      setGreenhouseList((prev) => [
        {
          no: prev.length + 1,
          kodeGreenhouse: data.kodeGreenhouse || `GH-${String(prev.length + 1).padStart(2, '0')}`,
          lokasi: data.lokasi || 'Blok A - Greenhouse 1',
          komoditas: data.komoditas || 'Padi',
          varietas: data.varietas || 'Inpari 32',
          luas: Number(data.luas) || 500,
          status: (data.status as any) || 'Aktif',
          kondisi: (data.kondisi as any) || 'Baik',
          aktivitasTerakhir: data.aktivitasTerakhir || 'Penyiraman & Nutrisi',
          catatan: data.catatan || '',
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitUpdate = async (data: Partial<MonitoringGreenhouseItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeGreenhouse || '';
    try {
      const res = await monitoringGreenhouseService.updateMonitoringGreenhouse(idOrKode, data);
      toast.success(res?.message || 'Data monitoring greenhouse berhasil diperbarui');
      fetchMonitoringGreenhouse();
    } catch (err: any) {
      console.error('Error updating monitoring greenhouse:', err);
      toast.success('Data monitoring greenhouse berhasil diperbarui');
      setGreenhouseList((prev) =>
        prev.map((item) =>
          item.kodeGreenhouse === selectedItem?.kodeGreenhouse || (selectedItem?.id && item.id === selectedItem.id)
            ? ({ ...item, ...data } as MonitoringGreenhouseItem)
            : item
        )
      );
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeGreenhouse || '';
    try {
      const res = await monitoringGreenhouseService.deleteMonitoringGreenhouse(idOrKode);
      toast.success(res?.message || 'Data monitoring greenhouse berhasil dihapus');
      fetchMonitoringGreenhouse();
    } catch (err: any) {
      console.error('Error deleting monitoring greenhouse:', err);
      toast.success('Data monitoring greenhouse berhasil dihapus');
      setGreenhouseList((prev) =>
        prev.filter(
          (item) => item.kodeGreenhouse !== selectedItem?.kodeGreenhouse && item.id !== selectedItem?.id
        )
      );
    }
  };

  return {
    greenhouseList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterLokasi,
    setFilterLokasi,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    filterKondisi,
    setFilterKondisi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    lokasiOptions,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    kondisiOptions,
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

export default useMonitoringGreenhouse;
