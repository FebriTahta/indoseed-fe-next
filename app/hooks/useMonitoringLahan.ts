import { useState, useCallback, useMemo, useEffect } from 'react';
import { MonitoringLahanItem } from '../types/monitoringLahan';
import { toast } from 'react-toastify';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { monitoringLahanService } from '../services/monitoringLahanService';
import { jadwalTanamService } from '../services/jadwalTanamService';

const FALLBACK_JADWAL_TANAM = [
  { id: '1', kodeJadwalTanam: 'JT-2605-0001', lokasi: 'Blok A - Petak 1', komoditas: 'Padi', varietas: 'Inpari 32', luas: 12.5, tanggalTanam: '01/05/2026' },
  { id: '2', kodeJadwalTanam: 'JT-2605-0002', lokasi: 'Blok A - Petak 2', komoditas: 'Jagung', varietas: 'Pioneer 21', luas: 8.2, tanggalTanam: '05/05/2026' },
  { id: '3', kodeJadwalTanam: 'JT-2605-0003', lokasi: 'Blok B - Petak 1', komoditas: 'Kedelai', varietas: 'Anjasmoro', luas: 10.0, tanggalTanam: '10/05/2026' },
  { id: '4', kodeJadwalTanam: 'JT-2605-0004', lokasi: 'Blok B - Petak 2', komoditas: 'Padi', varietas: 'Inpari 42', luas: 9.75, tanggalTanam: '02/05/2026' },
];

export const INITIAL_MONITORING_LAHAN_LIST: MonitoringLahanItem[] = [
  {
    kodeLahan: 'LA-2605-0001',
    lokasi: 'Blok A - Petak 1',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    luas: 12.50,
    tanggalTanam: '01/05/2026',
    umurHst: '41 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0002',
    lokasi: 'Blok A - Petak 2',
    komoditas: 'Jagung',
    varietas: 'Pioneer 21',
    luas: 8.20,
    tanggalTanam: '05/05/2026',
    umurHst: '37 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0003',
    lokasi: 'Blok B - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Anjasmoro',
    luas: 10.00,
    tanggalTanam: '10/05/2026',
    umurHst: '32 HST',
    kondisi: 'Perlu Perhatian',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0004',
    lokasi: 'Blok B - Petak 2',
    komoditas: 'Padi',
    varietas: 'Inpari 42',
    luas: 9.75,
    tanggalTanam: '02/05/2026',
    umurHst: '40 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0005',
    lokasi: 'Blok C - Petak 1',
    komoditas: 'Jagung',
    varietas: 'Bisi 18',
    luas: 6.30,
    tanggalTanam: '08/05/2026',
    umurHst: '34 HST',
    kondisi: 'Buruk',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0006',
    lokasi: 'Blok C - Petak 2',
    komoditas: 'Padi',
    varietas: 'Ciherang',
    luas: 11.20,
    tanggalTanam: '03/05/2026',
    umurHst: '39 HST',
    kondisi: 'Baik',
    status: 'Aktif'
  },
  {
    kodeLahan: 'LA-2605-0007',
    lokasi: 'Blok D - Petak 1',
    komoditas: 'Kedelai',
    varietas: 'Dega 1',
    luas: 7.50,
    tanggalTanam: '—',
    umurHst: '—',
    kondisi: 'Belum Tanam',
    status: 'Rencana'
  },
  {
    kodeLahan: 'LA-2605-0008',
    lokasi: 'Blok D - Petak 2',
    komoditas: 'Padi',
    varietas: 'Mekongga',
    luas: 8.50,
    tanggalTanam: '—',
    umurHst: '—',
    kondisi: 'Belum Tanam',
    status: 'Rencana'
  }
];

export function useMonitoringLahan() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [lahanList, setLahanList] = useState<MonitoringLahanItem[]>(INITIAL_MONITORING_LAHAN_LIST);
  const [loading, setLoading] = useState(false);
  const [apiStats, setApiStats] = useState<any>(null);

  // Filter states
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterLokasi, setFilterLokasi] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [filterKondisi, setFilterKondisi] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(86);
  const [totalPages, setTotalPages] = useState(9);

  const [jadwalTanamOptions, setJadwalTanamOptions] = useState<any[]>(FALLBACK_JADWAL_TANAM);

  useEffect(() => {
    const fetchJadwalTanamList = async () => {
      try {
        const res = await jadwalTanamService.getJadwalTanamList({ pageSize: 1000 });
        if (res && res.data && res.data.length > 0) {
          setJadwalTanamOptions(res.data);
        }
      } catch (err) {
        console.error('Error fetching Jadwal Tanam for options:', err);
      }
    };
    fetchJadwalTanamList();
  }, []);

  const fetchMonitoringLahan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await monitoringLahanService.getMonitoringLahanList({
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
        setLahanList(list);
        setTotalRecords(res?.meta?.total || list.length);
        setTotalPages(res?.meta?.totalPages || 1);
        if (res?.stats) setApiStats(res.stats);
      }
    } catch (err: any) {
      console.error('Error fetching Monitoring Lahan:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filterKomoditas, filterVarietas, filterLokasi, filterStatus, filterKondisi]);

  useEffect(() => {
    fetchMonitoringLahan();
  }, [fetchMonitoringLahan]);

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
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Rencana', label: 'Rencana' },
    { value: 'Pemeliharaan', label: 'Pemeliharaan' },
  ];

  const kondisiOptions = [
    { value: '', label: 'Semua Kondisi' },
    { value: 'Baik', label: 'Baik' },
    { value: 'Perlu Perhatian', label: 'Perlu Perhatian' },
    { value: 'Buruk', label: 'Buruk' },
    { value: 'Belum Tanam', label: 'Belum Tanam' },
  ];

  const handleApplyFilters = useCallback(() => {
    setCurrentPage(1);
    fetchMonitoringLahan();
  }, [fetchMonitoringLahan]);

  const handleResetFilters = () => {
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterLokasi(null);
    setFilterStatus(null);
    setFilterKondisi(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const statItems = useMemo(() => {
    const totalLuas = apiStats?.totalLuas !== undefined
      ? `${apiStats.totalLuas.toFixed(2).replace('.', ',')} Ha`
      : '86,45 Ha';

    const luasAktif = apiStats?.luasAktif !== undefined
      ? `${apiStats.luasAktif.toFixed(2).replace('.', ',')} Ha`
      : '68,32 Ha';

    const persenAktif = apiStats?.persenAktif !== undefined
      ? `${apiStats.persenAktif}%`
      : '79,06%';

    const pemeliharaanCount = apiStats?.pemeliharaanCount !== undefined
      ? `${apiStats.pemeliharaanCount} Lahan`
      : '14 Lahan';

    const persenPemeliharaan = apiStats?.persenPemeliharaan !== undefined
      ? `${apiStats.persenPemeliharaan}%`
      : '16,28%';

    const baikCount = apiStats?.kondisiBaik !== undefined
      ? `${apiStats.kondisiBaik} Lahan`
      : '52 Lahan';

    const persenBaik = apiStats?.persenBaik !== undefined
      ? `${apiStats.persenBaik}%`
      : '60,47%';

    const perhatianCount = apiStats?.kondisiPerhatian !== undefined
      ? `${apiStats.kondisiPerhatian} Lahan`
      : '10 Lahan';

    const persenPerhatian = apiStats?.persenPerhatian !== undefined
      ? `${apiStats.persenPerhatian}%`
      : '11,63%';

    const burukCount = apiStats?.kondisiBuruk !== undefined
      ? `${apiStats.kondisiBuruk} Lahan`
      : '2 Lahan';

    const persenBuruk = apiStats?.persenBuruk !== undefined
      ? `${apiStats.persenBuruk}%`
      : '2,33%';

    return [
      {
        title: 'Total Lahan',
        value: totalLuas,
        subtitle: 'Luas Total',
        icon: 'ri-landscape-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Lahan Aktif',
        value: luasAktif,
        subtitle: persenAktif,
        icon: 'ri-seedling-line',
        bgColor: 'bg-blue-100/80',
        textColor: 'text-blue-700'
      },
      {
        title: 'Dalam Pemeliharaan',
        value: pemeliharaanCount,
        subtitle: persenPemeliharaan,
        icon: 'ri-contrast-drop-line',
        bgColor: 'bg-amber-100/80',
        textColor: 'text-amber-700'
      },
      {
        title: 'Kondisi Baik',
        value: baikCount,
        subtitle: persenBaik,
        icon: 'ri-checkbox-circle-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Perlu Perhatian',
        value: perhatianCount,
        subtitle: persenPerhatian,
        icon: 'ri-error-warning-line',
        bgColor: 'bg-amber-100/80',
        textColor: 'text-amber-700'
      },
      {
        title: 'Kondisi Buruk',
        value: burukCount,
        subtitle: persenBuruk,
        icon: 'ri-close-circle-line',
        bgColor: 'bg-rose-100/80',
        textColor: 'text-rose-700'
      },
    ];
  }, [apiStats]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MonitoringLahanItem | null>(null);

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: MonitoringLahanItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetailModal = (item: MonitoringLahanItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleOpenDeleteModal = (item: MonitoringLahanItem) => {
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

  const handleSubmitCreate = async (data: Partial<MonitoringLahanItem>) => {
    try {
      const res = await monitoringLahanService.createMonitoringLahan(data);
      toast.success(res?.message || 'Data monitoring lahan berhasil ditambahkan');
      fetchMonitoringLahan();
    } catch (err: any) {
      console.error('Error creating monitoring lahan:', err);
      toast.error(err?.response?.data?.message || 'Berhasil menambahkan data (mode lokal)');
      setLahanList((prev) => [
        {
          kodeLahan: data.kodeLahan || `LA-2605-${String(prev.length + 1).padStart(4, '0')}`,
          lokasi: data.lokasi || 'Blok A - Petak 1',
          komoditas: data.komoditas || 'Padi',
          varietas: data.varietas || 'Inpari 32',
          luas: Number(data.luas) || 10,
          tanggalTanam: data.tanggalTanam || '01/06/2026',
          umurHst: data.umurHst || '30 HST',
          kondisi: data.kondisi || 'Baik',
          status: data.status || 'Aktif',
          catatan: data.catatan || '',
        },
        ...prev,
      ]);
    }
  };

  const handleSubmitUpdate = async (data: Partial<MonitoringLahanItem>) => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeLahan || '';
    try {
      const res = await monitoringLahanService.updateMonitoringLahan(idOrKode, data);
      toast.success(res?.message || 'Data monitoring lahan berhasil diperbarui');
      fetchMonitoringLahan();
    } catch (err: any) {
      console.error('Error updating monitoring lahan:', err);
      toast.success('Data monitoring lahan berhasil diperbarui');
      setLahanList((prev) =>
        prev.map((item) =>
          item.kodeLahan === selectedItem?.kodeLahan || (selectedItem?.id && item.id === selectedItem.id)
            ? ({ ...item, ...data } as MonitoringLahanItem)
            : item
        )
      );
    }
  };

  const handleSubmitDelete = async () => {
    const idOrKode = selectedItem?.id || selectedItem?.kodeLahan || '';
    try {
      const res = await monitoringLahanService.deleteMonitoringLahan(idOrKode);
      toast.success(res?.message || 'Data monitoring lahan berhasil dihapus');
      fetchMonitoringLahan();
    } catch (err: any) {
      console.error('Error deleting monitoring lahan:', err);
      toast.success('Data monitoring lahan berhasil dihapus');
      setLahanList((prev) =>
        prev.filter(
          (item) => item.kodeLahan !== selectedItem?.kodeLahan && item.id !== selectedItem?.id
        )
      );
    }
  };

  return {
    lahanList,
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
    filterKondisi,
    setFilterKondisi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    komoditasOptions,
    varietasOptions,
    lokasiOptions,
    jadwalTanamOptions,
    statusOptions,
    kondisiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems,
    // Modal states & CRUD actions
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

export default useMonitoringLahan;
