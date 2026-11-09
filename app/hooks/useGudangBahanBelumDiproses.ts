import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  gudangBahanBelumDiprosesService,
  GudangBahanListResponse,
} from '../services/gudangBahanBelumDiprosesService';
import {
  GudangBahanItem,
  GudangBahanStats,
  ReferensiPanenItem,
  CreateGudangBahanPayload,
} from '../types/gudangBahanBelumDiproses';
import { toast } from 'react-toastify';

export const INITIAL_GUDANG_BAHAN_LIST: GudangBahanItem[] = [
  {
    id: 'gb-01',
    no: 1,
    noLot: 'LOT-2026-00021',
    sumberPanen: 'PN-2026-0007',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-001 / Blok 01',
    tanggalPanen: '2026-06-02',
    tanggalMasuk: '2026-06-03',
    beratMasuk: 850,
    kadarAir: 28.5,
    lokasi: 'Zona A',
    lokasiDetail: 'Gudang Produksi / Zona A',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
    foto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    riwayatFlow: [
      { tahap: 'Panen', status: 'completed', tanggal: '02 Jun 2026 08:00', keterangan: 'PN-2026-0007' },
      { tahap: 'Penerimaan Hasil Panen', status: 'completed', tanggal: '03 Jun 2026 09:15', keterangan: 'LOT-2026-00021' },
      { tahap: 'Masuk Gudang Bahan Belum Diproses', status: 'active', tanggal: '03 Jun 2026 10:20', keterangan: 'Zona A' },
      { tahap: 'Pengeringan', status: 'pending', keterangan: '(Belum dilakukan)' },
      { tahap: 'Sortasi', status: 'pending', keterangan: '(Belum dilakukan)' },
      { tahap: 'Treatment', status: 'pending', keterangan: '(Belum dilakukan)' },
      { tahap: 'QC / Pengujian', status: 'pending', keterangan: '(Belum dilakukan)' },
      { tahap: 'Release', status: 'pending', keterangan: '(Belum dilakukan)' },
    ],
  },
  {
    id: 'gb-02',
    no: 2,
    noLot: 'LOT-2026-00022',
    sumberPanen: 'PN-2026-0008',
    komoditas: 'Cabai',
    varietas: 'Cabai Keriting',
    petani: 'Siti Rahayu',
    petaniKode: 'SRN-002',
    lahan: 'LHN-002 / Blok 02',
    tanggalPanen: '2026-06-04',
    tanggalMasuk: '2026-06-05',
    beratMasuk: 620,
    kadarAir: 26.7,
    lokasi: 'Zona A',
    lokasiDetail: 'Gudang Produksi / Zona A',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-03',
    no: 3,
    noLot: 'LOT-2026-00023',
    sumberPanen: 'PN-2026-0009',
    komoditas: 'Tomat',
    varietas: 'Grand Rapids',
    petani: 'Ahmad Dahlan',
    petaniKode: 'AD-003',
    lahan: 'LHN-003 / Blok Barat',
    tanggalPanen: '2026-06-05',
    tanggalMasuk: '2026-06-06',
    beratMasuk: 1200,
    kadarAir: 30.1,
    lokasi: 'Zona B',
    lokasiDetail: 'Gudang Produksi / Zona B',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Sangat Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-04',
    no: 4,
    noLot: 'LOT-2026-00024',
    sumberPanen: 'PN-2026-0010',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    petani: 'Agus Setiawan',
    petaniKode: 'AGS-004',
    lahan: 'LHN-004 / Blok Sawah 2',
    tanggalPanen: '2026-06-07',
    tanggalMasuk: '2026-06-08',
    beratMasuk: 980,
    kadarAir: 25.6,
    lokasi: 'Zona C',
    lokasiDetail: 'Gudang Produksi / Zona C',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-05',
    no: 5,
    noLot: 'LOT-2026-00025',
    sumberPanen: 'PN-2026-0011',
    komoditas: 'Melon',
    varietas: 'Melon Tere F1',
    petani: 'Dewi Lestari',
    petaniKode: 'DWL-005',
    lahan: 'LHN-005 / Blok 03',
    tanggalPanen: '2026-06-09',
    tanggalMasuk: '2026-06-10',
    beratMasuk: 750,
    kadarAir: 29.8,
    lokasi: 'Zona A',
    lokasiDetail: 'Gudang Produksi / Zona A',
    status: 'Dalam Pengeringan',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-06',
    no: 6,
    noLot: 'LOT-2026-00026',
    sumberPanen: 'PN-2026-0012',
    komoditas: 'Cabai',
    varietas: 'Rawit',
    petani: 'Rini Wulandari',
    petaniKode: 'RW-006',
    lahan: 'LHN-006 / Blok 04',
    tanggalPanen: '2026-06-11',
    tanggalMasuk: '2026-06-12',
    beratMasuk: 540,
    kadarAir: 27.2,
    lokasi: 'Zona B',
    lokasiDetail: 'Gudang Produksi / Zona B',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-07',
    no: 7,
    noLot: 'LOT-2026-00027',
    sumberPanen: 'PN-2026-0013',
    komoditas: 'Tomat',
    varietas: 'TSW-009',
    petani: 'Hendra Wijaya',
    petaniKode: 'HW-007',
    lahan: 'LHN-007 / Blok 05',
    tanggalPanen: '2026-06-13',
    tanggalMasuk: '2026-06-14',
    beratMasuk: 1100,
    kadarAir: 28.9,
    lokasi: 'Zona C',
    lokasiDetail: 'Gudang Produksi / Zona C',
    status: 'Dalam Pengeringan',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-08',
    no: 8,
    noLot: 'LOT-2026-00028',
    sumberPanen: 'PN-2026-0014',
    komoditas: 'Kangkung',
    varietas: 'Bima',
    petani: 'Supriyanto',
    petaniKode: 'SUP-008',
    lahan: 'LHN-008 / Blok Timur',
    tanggalPanen: '2026-06-15',
    tanggalMasuk: '2026-06-16',
    beratMasuk: 670,
    kadarAir: 25.4,
    lokasi: 'Zona A',
    lokasiDetail: 'Gudang Produksi / Zona A',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Sangat Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-09',
    no: 9,
    noLot: 'LOT-2026-00029',
    sumberPanen: 'PN-2026-0015',
    komoditas: 'Selada',
    varietas: 'Grand Rapids',
    petani: 'Fajar Ramadhan',
    petaniKode: 'FJR-009',
    lahan: 'LHN-009 / GreenHouse 01',
    tanggalPanen: '2026-06-17',
    tanggalMasuk: '2026-06-18',
    beratMasuk: 420,
    kadarAir: 24.7,
    lokasi: 'Zona B',
    lokasiDetail: 'Gudang Produksi / Zona B',
    status: 'Dalam Pengeringan',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-10',
    no: 10,
    noLot: 'LOT-2026-00030',
    sumberPanen: 'PN-2026-0016',
    komoditas: 'Cabai',
    varietas: 'Keriting',
    petani: 'Joko Susilo',
    petaniKode: 'JKS-010',
    lahan: 'LHN-010 / Blok Selatan',
    tanggalPanen: '2026-06-19',
    tanggalMasuk: '2026-06-20',
    beratMasuk: 780,
    kadarAir: 26.3,
    lokasi: 'Zona C',
    lokasiDetail: 'Gudang Produksi / Zona C',
    status: 'Bahan Belum Diproses',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-11',
    no: 11,
    noLot: 'LOT-2026-00031',
    sumberPanen: 'PN-2026-0017',
    komoditas: 'Melon',
    varietas: 'Melon Action 434',
    petani: 'Budi Santoso',
    petaniKode: 'BTN-001',
    lahan: 'LHN-001 / Blok 02',
    tanggalPanen: '2026-06-21',
    tanggalMasuk: '2026-06-22',
    beratMasuk: 700,
    kadarAir: 28.0,
    lokasi: 'Zona A',
    lokasiDetail: 'Gudang Produksi / Zona A',
    status: 'Dalam Pengeringan',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
  {
    id: 'gb-12',
    no: 12,
    noLot: 'LOT-2026-00032',
    sumberPanen: 'PN-2026-0018',
    komoditas: 'Tomat',
    varietas: 'Servo F1',
    petani: 'Ahmad Dahlan',
    petaniKode: 'AD-003',
    lahan: 'LHN-003 / Blok Timur',
    tanggalPanen: '2026-06-23',
    tanggalMasuk: '2026-06-24',
    beratMasuk: 640,
    kadarAir: 29.0,
    lokasi: 'Zona B',
    lokasiDetail: 'Gudang Produksi / Zona B',
    status: 'Menunggu Sortasi',
    kondisiFisik: 'Baik',
    petugasPenerima: 'Admin Gudang',
  },
];

export const INITIAL_STATS: GudangBahanStats = {
  totalLot: 12,
  totalLotDelta: 2,
  totalBeratMasuk: 8450,
  totalBeratMasukDeltaPercent: 12,
  rataRataKadarAir: 27.5,
  kadarAirDeltaPercent: -3.2,
  lokasiCount: 3,
  lokasiNames: 'A, B, C (Zona Gudang)',
  statusDistribution: {
    'Bahan Belum Diproses': 7,
    'Dalam Pengeringan': 4,
    'Menunggu Sortasi': 1,
  },
  stockChartData: [
    { komoditas: 'Melon', masuk: 1600, keluar: 250 },
    { komoditas: 'Cabai', masuk: 950, keluar: 150 },
    { komoditas: 'Tomat', masuk: 900, keluar: 200 },
    { komoditas: 'Padi', masuk: 980, keluar: 350 },
    { komoditas: 'Kangkung', masuk: 670, keluar: 120 },
    { komoditas: 'Selada', masuk: 720, keluar: 180 },
  ],
  kadarAirTrend: [
    { date: '1 Jun', value: 28.2 },
    { date: '5 Jun', value: 27.9 },
    { date: '10 Jun', value: 27.5 },
    { date: '15 Jun', value: 27.8 },
    { date: '20 Jun', value: 27.1 },
    { date: '25 Jun', value: 26.8 },
    { date: '30 Jun', value: 27.5 },
  ],
};

export default function useGudangBahanBelumDiproses() {
  const [items, setItems] = useState<GudangBahanItem[]>(INITIAL_GUDANG_BAHAN_LIST);
  const [stats, setStats] = useState<GudangBahanStats>(INITIAL_STATS);
  const [referensiPanen, setReferensiPanen] = useState<ReferensiPanenItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua Komoditas');
  const [filterVarietas, setFilterVarietas] = useState<string>('Semua Varietas');
  const [filterStatus, setFilterStatus] = useState<string>('Semua Status');
  const [filterTanggal, setFilterTanggal] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const [totalRecords, setTotalRecords] = useState<number>(12);

  // Selected item for detail panel on right side
  const [selectedItem, setSelectedItem] = useState<GudangBahanItem | null>(INITIAL_GUDANG_BAHAN_LIST[0]);

  // Selected checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GudangBahanItem | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await gudangBahanBelumDiprosesService.getList({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        komoditas: filterKomoditas !== 'Semua Komoditas' ? filterKomoditas : undefined,
        varietas: filterVarietas !== 'Semua Varietas' ? filterVarietas : undefined,
        status: filterStatus !== 'Semua Status' ? filterStatus : undefined,
        startDate: filterTanggal || undefined,
      });

      if (res && res.data) {
        setItems(res.data);
        setTotalRecords(res.meta?.total || res.data.length);
        if (res.stats) {
          setStats(res.stats);
        }
        // If current selected item not in list or null, select first
        if (res.data.length > 0) {
          setSelectedItem((prev) => {
            if (!prev) return res.data[0];
            const found = res.data.find((it) => it.id === prev.id || it.noLot === prev.noLot);
            return found || res.data[0];
          });
        }
      }
    } catch (err: any) {
      console.warn('Using initial fallback data for Gudang Bahan:', err?.message);
      // Filter client-side on fallback
      let filtered = [...INITIAL_GUDANG_BAHAN_LIST];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (it) =>
            it.noLot.toLowerCase().includes(q) ||
            it.sumberPanen.toLowerCase().includes(q) ||
            it.komoditas.toLowerCase().includes(q) ||
            it.varietas.toLowerCase().includes(q) ||
            (it.petani && it.petani.toLowerCase().includes(q))
        );
      }
      if (filterKomoditas !== 'Semua Komoditas') {
        filtered = filtered.filter((it) => it.komoditas === filterKomoditas);
      }
      if (filterVarietas !== 'Semua Varietas') {
        filtered = filtered.filter((it) => it.varietas === filterVarietas);
      }
      if (filterStatus !== 'Semua Status') {
        filtered = filtered.filter((it) => it.status === filterStatus);
      }
      setItems(filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize));
      setTotalRecords(filtered.length);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, search, filterKomoditas, filterVarietas, filterStatus, filterTanggal]);

  // Fetch referensi panen for create modal
  const fetchPanenRef = useCallback(async () => {
    try {
      const res = await gudangBahanBelumDiprosesService.getReferensiPanen();
      if (res && res.data) {
        setReferensiPanen(res.data);
      }
    } catch (e) {
      console.warn('Failed to fetch referensi panen:', e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchPanenRef();
  }, [fetchPanenRef]);

  // Filter options
  const komoditasOptions = useMemo(() => {
    const list = Array.from(new Set(INITIAL_GUDANG_BAHAN_LIST.map((it) => it.komoditas)));
    return ['Semua Komoditas', ...list];
  }, []);

  const varietasOptions = useMemo(() => {
    let source = INITIAL_GUDANG_BAHAN_LIST;
    if (filterKomoditas !== 'Semua Komoditas') {
      source = source.filter((it) => it.komoditas === filterKomoditas);
    }
    const list = Array.from(new Set(source.map((it) => it.varietas)));
    return ['Semua Varietas', ...list];
  }, [filterKomoditas]);

  const statusOptions = ['Semua Status', 'Bahan Belum Diproses', 'Dalam Pengeringan', 'Menunggu Sortasi'];

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterKomoditas('Semua Komoditas');
    setFilterVarietas('Semua Varietas');
    setFilterStatus('Semua Status');
    setFilterTanggal('');
    setCurrentPage(1);
  };

  const handleSelectLot = (item: GudangBahanItem) => {
    setSelectedItem(item);
  };

  const handleToggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((it) => it.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleOpenAddModal = async () => {
    await fetchPanenRef();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: GudangBahanItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveCreate = async (payload: CreateGudangBahanPayload) => {
    setIsSaving(true);
    try {
      await gudangBahanBelumDiprosesService.create(payload);
      toast.success('Penerimaan bahan berhasil ditambahkan');
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      // Fallback local add
      const newItem: GudangBahanItem = {
        id: `gb-${Date.now()}`,
        no: items.length + 1,
        noLot: payload.noLot || `LOT-2026-000${21 + items.length}`,
        sumberPanen: payload.sumberPanen,
        komoditas: payload.komoditas,
        varietas: payload.varietas,
        petani: payload.petani || 'Budi Santoso',
        petaniKode: payload.petaniKode || 'BTN-001',
        lahan: payload.lahan || 'LHN-001 / Blok 01',
        tanggalPanen: payload.tanggalPanen || '2026-06-02',
        tanggalMasuk: payload.tanggalMasuk || new Date().toISOString().split('T')[0],
        beratMasuk: payload.beratMasuk || 0,
        kadarAir: payload.kadarAir || 0,
        lokasi: payload.lokasi || 'Zona A',
        lokasiDetail: payload.lokasiDetail || `Gudang Produksi / ${payload.lokasi || 'Zona A'}`,
        status: payload.status || 'Bahan Belum Diproses',
        kondisiFisik: payload.kondisiFisik || 'Baik',
        petugasPenerima: payload.petugasPenerima || 'Admin Gudang',
        catatan: payload.catatan,
        foto: payload.foto || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
        riwayatFlow: [
          { tahap: 'Panen', status: 'completed', tanggal: payload.tanggalPanen || '2026-06-02', keterangan: payload.sumberPanen },
          { tahap: 'Penerimaan Hasil Panen', status: 'completed', tanggal: payload.tanggalMasuk, keterangan: payload.noLot },
          { tahap: 'Masuk Gudang Bahan Belum Diproses', status: 'active', tanggal: payload.tanggalMasuk, keterangan: payload.lokasi },
          { tahap: 'Pengeringan', status: 'pending', keterangan: '(Belum dilakukan)' },
          { tahap: 'Sortasi', status: 'pending', keterangan: '(Belum dilakukan)' },
          { tahap: 'Treatment', status: 'pending', keterangan: '(Belum dilakukan)' },
          { tahap: 'QC / Pengujian', status: 'pending', keterangan: '(Belum dilakukan)' },
          { tahap: 'Release', status: 'pending', keterangan: '(Belum dilakukan)' },
        ],
      };
      setItems((prev) => [newItem, ...prev]);
      setSelectedItem(newItem);
      toast.success('Penerimaan bahan berhasil ditambahkan');
      setIsAddModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUpdate = async (id: string, payload: Partial<CreateGudangBahanPayload>) => {
    setIsSaving(true);
    try {
      await gudangBahanBelumDiprosesService.update(id, payload);
      toast.success('Data lot berhasil diperbarui');
      setIsEditModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? ({ ...it, ...payload } as GudangBahanItem) : it))
      );
      if (selectedItem?.id === id) {
        setSelectedItem((prev) => (prev ? ({ ...prev, ...payload } as GudangBahanItem) : null));
      }
      toast.success('Data lot berhasil diperbarui');
      setIsEditModalOpen(false);
      setEditingItem(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data lot ini?')) return;
    try {
      await gudangBahanBelumDiprosesService.delete(id);
      toast.success('Data lot berhasil dihapus');
      fetchData();
    } catch (err: any) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(items.find((it) => it.id !== id) || null);
      }
      toast.success('Data lot berhasil dihapus');
    }
  };

  const handleTransferToPengeringan = async (item: GudangBahanItem) => {
    try {
      await gudangBahanBelumDiprosesService.updateStatus(item.id, 'Dalam Pengeringan');
      toast.success(`Lot ${item.noLot} dialihkan ke status Dalam Pengeringan`);
      fetchData();
    } catch (e) {
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: 'Dalam Pengeringan' } : it))
      );
      if (selectedItem?.id === item.id) {
        setSelectedItem((prev) => (prev ? { ...prev, status: 'Dalam Pengeringan' } : null));
      }
      toast.success(`Lot ${item.noLot} dialihkan ke status Dalam Pengeringan`);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  return {
    items,
    stats,
    referensiPanen,
    isLoading,
    isSaving,
    // Filters
    search,
    setSearch,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    filterTanggal,
    setFilterTanggal,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Selection
    selectedItem,
    handleSelectLot,
    selectedIds,
    handleToggleSelectId,
    handleSelectAll,
    // Modals
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isMapModalOpen,
    setIsMapModalOpen,
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    editingItem,
    handleOpenAddModal,
    handleOpenEditModal,
    // Actions
    handleSaveCreate,
    handleSaveUpdate,
    handleDelete,
    handleTransferToPengeringan,
    fetchData,
  };
}
