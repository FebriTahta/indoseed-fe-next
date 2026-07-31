import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useGreenhouse from './useGreenhouse';
import useKomoditas from '@/app/hooks/useKomoditas';
import useVarietas from './useVarietas';
import jadwalTanamService from '@/app/services/jadwalTanamService';
import { JadwalTanam } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { Land } from '../types/greenhouse';

const mapBackendToJadwalTanam = (item: any): JadwalTanam => {
  const formatDateStr = (dateVal: any) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return String(dateVal);
    }
  };

  const formatDateIso = (dateVal: any) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toISOString().split('T')[0];
    } catch (e) {
      return String(dateVal);
    }
  };

  const namaLahan = item.greenhouse?.namaLahan || (item.detailLahan && item.detailLahan.length > 0 ? item.detailLahan[0].namaLahan : '') || item.greenhouseId || 'Lahan 1';
  const namaKomoditas = item.commodity?.namaKomoditas || item.commodityId || 'Padi';
  const namaVarietas = item.variety?.namaVarietas || item.varietyId || 'Inpari 32';

  return {
    informasiUmum: {
      kodeJadwalTanam: item.kodeJadwalTanam || '',
      penanggungJawab: item.penanggungJawab || '-',
      periodeTanamMulai: formatDateIso(item.periodeTanamMulai),
      periodeTanamSelesai: formatDateIso(item.periodeTanamSelesai),
      musimTanam: item.musimTanam || 'Musim Kemarau',
      tujuanProduksi: item.tujuanProduksi || 'Benih Bersertifikat',
      tipeProduksi: item.tipeProduksi || 'FS (Foundation Seed)',
      statusJadwal: item.statusJadwal || 'Draft',
      deskripsi: item.deskripsi || '',
    },
    lahanKomoditas: {
      idLahan: item.greenhouseId || '',
      namaLahan,
      luasTanam: Number(item.luasTanam || 0),
      komoditas: namaKomoditas,
      varietas: namaVarietas,
      idBenih: '',
      asalBenih: item.asalBenih || 'Gudang Benih - Batch BP-2505-001',
      jumlahBenihDiperlukan: Number(item.jumlahBenihDiperlukan || 100),
      jarakTanam: item.jarakTanam || '25 cm x 25 cm',
      sistemTanam: item.sistemTanam || 'Jajar Legowo 4:1',
    },
    rencanaTanam: {
      tanggalPersemaian: formatDateStr(item.tanggalPersemaian),
      tanggalTanam: formatDateStr(item.tanggalTanam),
      perkiraanPanen: formatDateStr(item.perkiraanPanen),
      siklusTanamHari: Number(item.siklusTanamHari || 30),
      metodeTanam: item.metodeTanam || 'Langsung',
      kepadatanTanam: Number(item.kepadatanTanam || 0),
      irigasi: item.irigasi || 'Irigasi Terjadwal',
      sumberAir: item.sumberAir || 'Sumur Bor',
    },
    status: item.statusJadwal || 'Draft',
    catatan: item.catatan || '',
    id: item.id,
    personil: item.personil || [],
    peralatan: item.peralatan || [],
    dokumen: (item.dokumen && item.dokumen.length > 0) ? item.dokumen : [
      {
        nama: 'Dokumen SOP Tanam & Standar ISO 9001:2015.pdf',
        fileUrl: '/sample-sop.pdf',
        fileSize: 245000,
        fileType: 'application/pdf'
      }
    ],
    detailLahan: item.detailLahan || [],
  };
};

export function useJadwalTanams() {
  const router = useRouter();

  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [jadwalTanams, setJadwalTanams] = useState<JadwalTanam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [filterPeriode, setFilterPeriode] = useState<any>(null);
  const [filterLahan, setFilterLahan] = useState<any>(null);
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<any>(null);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Draft', label: 'Draft' },
    { value: 'Sedang Berlangsung', label: 'Sedang Berlangsung' },
    { value: 'Akan Tanam', label: 'Akan Tanam' },
    { value: 'Selesai', label: 'Selesai' }
  ];

  const fetchJadwalTanams = useCallback(async () => {
    setIsTableLoading(true);
    setLoading(true);
    try {
      const res = await jadwalTanamService.getJadwalTanamList({
        page: currentPage,
        pageSize: pageSize,
        search: search.trim() || undefined,
        statusJadwal: filterStatus?.value || undefined,
        commodityId: filterKomoditas?.value || undefined,
        varietyId: filterVarietas?.value || undefined,
        greenhouseId: filterLahan?.value || undefined,
      });

      if (res && res.data) {
        const mapped = res.data.map(mapBackendToJadwalTanam);
        setJadwalTanams(mapped);
        if (res.pagination) {
          setTotalRecords(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err: any) {
      console.error('Error fetching Jadwal Tanam:', err);
      setError('Gagal mengambil data jadwal tanam');
    } finally {
      setIsTableLoading(false);
      setLoading(false);
    }
  }, [currentPage, pageSize, search, filterStatus, filterKomoditas, filterVarietas, filterLahan]);

  useEffect(() => {
    fetchJadwalTanams();
  }, [fetchJadwalTanams]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchJadwalTanams();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterPeriode(null);
    setFilterLahan(null);
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterStatus(null);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const handleAdd = () => {
    router.push('/produksi/jadwaltanam/create');
  };

  const handleDelete = async (id: string, kodeJadwal?: string) => {
    if (!id) return;
    const confirmMessage = kodeJadwal
      ? `Apakah Anda yakin ingin menghapus Jadwal Tanam (${kodeJadwal})?`
      : 'Apakah Anda yakin ingin menghapus Jadwal Tanam ini?';

    if (confirm(confirmMessage)) {
      try {
        const res = await jadwalTanamService.deleteJadwalTanam(id);
        toast.success(res?.message || 'Jadwal Tanam berhasil dihapus!');
        fetchJadwalTanams();
      } catch (err: any) {
        console.error('Error deleting Jadwal Tanam:', err);
        toast.error(err.response?.data?.message || 'Gagal menghapus Jadwal Tanam');
      }
    }
  };

  const statMaster = useMemo(() => {
    const lahanOptions = lands.map((item: Land) => ({
      value: item.id || item.kodeLahan,
      label: item.namaLahan
    }));

    const komoditasOptions = commodities.map((item: Commodity) => ({
      value: item.id || item.kodeKomoditas,
      label: item.namaKomoditas
    }));

    const varietasOptions = varieties.map((item: Variety) => ({
      value: item.id || item.kodeVarietas,
      label: item.namaVarietas
    }));

    return {
      lahanOptions,
      komoditasOptions,
      varietasOptions,
    };
  }, [lands, commodities, varieties]);

  const statItems = useMemo(() => {
    const totalLuas = jadwalTanams.reduce((acc, item) => acc + (Number(item.lahanKomoditas?.luasTanam) || 0), 0);
    const uniqueKomoditas = new Set(jadwalTanams.map(i => i.lahanKomoditas?.komoditas).filter(Boolean)).size;
    const akanTanamCount = jadwalTanams.filter(i => i.status === 'Akan Tanam' || i.informasiUmum?.statusJadwal === 'Draft').length;
    const berlangsungCount = jadwalTanams.filter(i => i.status === 'Sedang Berlangsung' || i.informasiUmum?.statusJadwal === 'Sedang Berlangsung' || i.informasiUmum?.statusJadwal === 'Berjalan').length;
    const selesaiCount = jadwalTanams.filter(i => i.status === 'Selesai' || i.informasiUmum?.statusJadwal === 'Selesai').length;

    return [
      {
        title: 'Total Jadwal',
        value: totalRecords,
        subtitle: 'Jadwal tanam',
        icon: 'ri-calendar-event-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Total Lahan',
        value: `${totalLuas.toFixed(2).replace('.', ',')} Ha`,
        subtitle: 'Luas total lahan',
        icon: 'ri-landscape-line',
        bgColor: 'bg-blue-100/80',
        textColor: 'text-blue-700'
      },
      {
        title: 'Komoditas',
        value: uniqueKomoditas,
        subtitle: 'Jenis komoditas',
        icon: 'ri-plant-line',
        bgColor: 'bg-purple-100/80',
        textColor: 'text-purple-700'
      },
      {
        title: 'Akan Tanam',
        value: akanTanamCount,
        subtitle: 'Dalam 7 hari ke depan',
        icon: 'ri-calendar-schedule-line',
        bgColor: 'bg-orange-100/80',
        textColor: 'text-orange-700'
      },
      {
        title: 'Sedang Berlangsung',
        value: berlangsungCount,
        subtitle: 'Jadwal aktif',
        icon: 'ri-seedling-line',
        bgColor: 'bg-emerald-100/80',
        textColor: 'text-emerald-700'
      },
      {
        title: 'Selesai',
        value: selesaiCount,
        subtitle: 'Periode ini',
        icon: 'ri-calendar-check-line',
        bgColor: 'bg-rose-100/80',
        textColor: 'text-rose-700'
      },
    ];
  }, [jadwalTanams, totalRecords]);

  return {
    jadwalTanams,
    loading,
    error,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterLahan,
    setFilterLahan,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    setTotalRecords,
    totalPages,
    setTotalPages,
    statusOptions,
    lahanOptions: statMaster.lahanOptions,
    komoditasOptions: statMaster.komoditasOptions,
    varietasOptions: statMaster.varietasOptions,
    isTableLoading,
    handleApplyFilters,
    handleResetFilters,
    handleAdd,
    handleDelete,
    statMaster,
    statItems
  };
}

export default useJadwalTanams;
