import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useGreenhouse from './useGreenhouse';
import useKomoditas from '@/app/hooks/useKomoditas';
import useVarietas from './useVarietas';
import jadwalTanamService from '@/app/services/jadwalTanamService';
import { JadwalTanam, SelectOption } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { Land } from '../types/greenhouse';

export const INITIAL_JADWAL_TANAM_LIST: JadwalTanam[] = [
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0001',
      penanggungJawab: 'Budi Santoso',
      periodeTanamMulai: '2026-06-01',
      periodeTanamSelesai: '2026-09-10',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Berjalan'
    },
    lahanKomoditas: {
      idLahan: 'LH-01',
      namaLahan: 'Lahan A1',
      luasTanam: 5.00,
      komoditas: 'Padi',
      varietas: 'Inpari 32',
      idBenih: 'BN-01',
      jumlahBenihDiperlukan: 125,
      jarakTanam: '25x25 cm',
      sistemTanam: 'Tegel'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-15',
      tanggalTanam: '01/06/2026',
      perkiraanPanen: '10/09/2026',
      siklusTanam: '100 Hari',
      siklusTanamHari: 100,
      metodeTanam: 'Transplanting',
      kepadatanTanam: 160000,
      irigasi: 'Irigasi Teknis',
      sumberAir: 'Sungai'
    },
    status: 'Sedang Berlangsung'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0002',
      penanggungJawab: 'Rina Agustina',
      periodeTanamMulai: '2026-06-02',
      periodeTanamSelesai: '2026-09-15',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Berjalan'
    },
    lahanKomoditas: {
      idLahan: 'LH-02',
      namaLahan: 'Lahan B2',
      luasTanam: 4.50,
      komoditas: 'Jagung',
      varietas: 'Pioneer 21',
      idBenih: 'BN-02',
      jumlahBenihDiperlukan: 90,
      jarakTanam: '75x20 cm',
      sistemTanam: 'Tunggal'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-20',
      tanggalTanam: '02/06/2026',
      perkiraanPanen: '15/09/2026',
      siklusTanam: '105 Hari',
      siklusTanamHari: 105,
      metodeTanam: 'Tugal',
      kepadatanTanam: 66000,
      irigasi: 'Irigasi Pompa',
      sumberAir: 'Sumur Dalam'
    },
    status: 'Sedang Berlangsung'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0003',
      penanggungJawab: 'Budi Santoso',
      periodeTanamMulai: '2026-06-03',
      periodeTanamSelesai: '2026-09-12',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Berjalan'
    },
    lahanKomoditas: {
      idLahan: 'LH-03',
      namaLahan: 'Lahan A2',
      luasTanam: 3.00,
      komoditas: 'Padi',
      varietas: 'Ciherang',
      idBenih: 'BN-03',
      jumlahBenihDiperlukan: 75,
      jarakTanam: '25x25 cm',
      sistemTanam: 'Legowo'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-18',
      tanggalTanam: '03/06/2026',
      perkiraanPanen: '12/09/2026',
      siklusTanam: '100 Hari',
      siklusTanamHari: 100,
      metodeTanam: 'Transplanting',
      kepadatanTanam: 160000,
      irigasi: 'Irigasi Teknis',
      sumberAir: 'Sungai'
    },
    status: 'Sedang Berlangsung'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0004',
      penanggungJawab: 'Dedi Kurniawan',
      periodeTanamMulai: '2026-06-05',
      periodeTanamSelesai: '2026-09-18',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Induk',
      tipeProduksi: 'Kemitraan',
      statusJadwal: 'Direncanakan'
    },
    lahanKomoditas: {
      idLahan: 'LH-04',
      namaLahan: 'Lahan C1',
      luasTanam: 2.50,
      komoditas: 'Kedelai',
      varietas: 'Anjasmoro',
      idBenih: 'BN-04',
      jumlahBenihDiperlukan: 100,
      jarakTanam: '40x15 cm',
      sistemTanam: 'Tunggal'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-25',
      tanggalTanam: '05/06/2026',
      perkiraanPanen: '18/09/2026',
      siklusTanam: '85 Hari',
      siklusTanamHari: 85,
      metodeTanam: 'Tugal',
      kepadatanTanam: 160000,
      irigasi: 'Tadah Hujan',
      sumberAir: 'Embung'
    },
    status: 'Akan Tanam'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0005',
      penanggungJawab: 'Rina Agustina',
      periodeTanamMulai: '2026-06-06',
      periodeTanamSelesai: '2026-09-14',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Direncanakan'
    },
    lahanKomoditas: {
      idLahan: 'LH-05',
      namaLahan: 'Lahan A3',
      luasTanam: 4.00,
      komoditas: 'Padi',
      varietas: 'Mekongga',
      idBenih: 'BN-05',
      jumlahBenihDiperlukan: 100,
      jarakTanam: '25x25 cm',
      sistemTanam: 'Tegel'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-22',
      tanggalTanam: '06/06/2026',
      perkiraanPanen: '14/09/2026',
      siklusTanam: '100 Hari',
      siklusTanamHari: 100,
      metodeTanam: 'Transplanting',
      kepadatanTanam: 160000,
      irigasi: 'Irigasi Teknis',
      sumberAir: 'Sungai'
    },
    status: 'Akan Tanam'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0006',
      penanggungJawab: 'Dedi Kurniawan',
      periodeTanamMulai: '2026-06-07',
      periodeTanamSelesai: '2026-09-20',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Kemitraan',
      statusJadwal: 'Berjalan'
    },
    lahanKomoditas: {
      idLahan: 'LH-06',
      namaLahan: 'Lahan B1',
      luasTanam: 5.50,
      komoditas: 'Jagung',
      varietas: 'Bisi 18',
      idBenih: 'BN-06',
      jumlahBenihDiperlukan: 110,
      jarakTanam: '75x20 cm',
      sistemTanam: 'Tunggal'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-27',
      tanggalTanam: '07/06/2026',
      perkiraanPanen: '20/09/2026',
      siklusTanam: '105 Hari',
      siklusTanamHari: 105,
      metodeTanam: 'Tugal',
      kepadatanTanam: 66000,
      irigasi: 'Irigasi Pompa',
      sumberAir: 'Sumur Dalam'
    },
    status: 'Sedang Berlangsung'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0007',
      penanggungJawab: 'Slamet Riyadi',
      periodeTanamMulai: '2026-06-08',
      periodeTanamSelesai: '2026-08-25',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Penjenis',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Selesai'
    },
    lahanKomoditas: {
      idLahan: 'LH-07',
      namaLahan: 'Lahan C2',
      luasTanam: 2.00,
      komoditas: 'Kacang Hijau',
      varietas: 'Vima 1',
      idBenih: 'BN-07',
      jumlahBenihDiperlukan: 50,
      jarakTanam: '40x15 cm',
      sistemTanam: 'Tunggal'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-28',
      tanggalTanam: '08/06/2026',
      perkiraanPanen: '25/08/2026',
      siklusTanam: '75 Hari',
      siklusTanamHari: 75,
      metodeTanam: 'Tugal',
      kepadatanTanam: 160000,
      irigasi: 'Tadah Hujan',
      sumberAir: 'Embung'
    },
    status: 'Selesai'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0008',
      penanggungJawab: 'Budi Santoso',
      periodeTanamMulai: '2026-06-10',
      periodeTanamSelesai: '2026-09-19',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Direncanakan'
    },
    lahanKomoditas: {
      idLahan: 'LH-08',
      namaLahan: 'Lahan A1',
      luasTanam: 5.00,
      komoditas: 'Padi',
      varietas: 'Situ Bagendit',
      idBenih: 'BN-08',
      jumlahBenihDiperlukan: 125,
      jarakTanam: '25x25 cm',
      sistemTanam: 'Tegel'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-05-30',
      tanggalTanam: '10/06/2026',
      perkiraanPanen: '19/09/2026',
      siklusTanam: '100 Hari',
      siklusTanamHari: 100,
      metodeTanam: 'Transplanting',
      kepadatanTanam: 160000,
      irigasi: 'Irigasi Teknis',
      sumberAir: 'Sungai'
    },
    status: 'Akan Tanam'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0009',
      penanggungJawab: 'Rina Agustina',
      periodeTanamMulai: '2026-06-12',
      periodeTanamSelesai: '2026-09-22',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Sebar',
      tipeProduksi: 'Sendiri',
      statusJadwal: 'Direncanakan'
    },
    lahanKomoditas: {
      idLahan: 'LH-09',
      namaLahan: 'Lahan D1',
      luasTanam: 3.00,
      komoditas: 'Sorgum',
      varietas: 'Numbu',
      idBenih: 'BN-09',
      jumlahBenihDiperlukan: 30,
      jarakTanam: '70x20 cm',
      sistemTanam: 'Tunggal'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-06-01',
      tanggalTanam: '12/06/2026',
      perkiraanPanen: '22/09/2026',
      siklusTanam: '100 Hari',
      siklusTanamHari: 100,
      metodeTanam: 'Tugal',
      kepadatanTanam: 70000,
      irigasi: 'Irigasi Pompa',
      sumberAir: 'Sumur Dalam'
    },
    status: 'Akan Tanam'
  },
  {
    informasiUmum: {
      kodeJadwalTanam: 'JT-2606-0010',
      penanggungJawab: 'Slamet Riyadi',
      periodeTanamMulai: '2026-06-15',
      periodeTanamSelesai: '2026-09-28',
      musimTanam: 'Musim Kemarau 1',
      tujuanProduksi: 'Benih Induk',
      tipeProduksi: 'Kemitraan',
      statusJadwal: 'Selesai'
    },
    lahanKomoditas: {
      idLahan: 'LH-10',
      namaLahan: 'Lahan C3',
      luasTanam: 3.00,
      komoditas: 'Kedelai',
      varietas: 'Dega 1',
      idBenih: 'BN-10',
      jumlahBenihDiperlukan: 120,
      jarakTanam: '40x15 cm',
      sistemTanam: 'Tunggal'
    },
    rencanaTanam: {
      tanggalPersemaian: '2026-06-05',
      tanggalTanam: '15/06/2026',
      perkiraanPanen: '28/09/2026',
      siklusTanam: '85 Hari',
      siklusTanamHari: 85,
      metodeTanam: 'Tugal',
      kepadatanTanam: 160000,
      irigasi: 'Tadah Hujan',
      sumberAir: 'Embung'
    },
    status: 'Selesai'
  }
];

export function useJadwalTanams() {
  const router = useRouter();

  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [jadwalTanams, setJadwalTanams] = useState<JadwalTanam[]>(INITIAL_JADWAL_TANAM_LIST);
  const [filteredTanams, setFilteredTanams] = useState<JadwalTanam[]>(INITIAL_JADWAL_TANAM_LIST);
  const [loading, setLoading] = useState(false);
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
  const [totalRecords, setTotalRecords] = useState(28);
  const [totalPages, setTotalPages] = useState(3);

  // Dropdown Options
  // const lahanOptions = [
  //   { value: '', label: 'Semua Lahan' },
  //   { value: 'Lahan A1', label: 'Lahan A1' },
  //   { value: 'Lahan A2', label: 'Lahan A2' },
  //   { value: 'Lahan A3', label: 'Lahan A3' },
  //   { value: 'Lahan B1', label: 'Lahan B1' },
  //   { value: 'Lahan B2', label: 'Lahan B2' },
  //   { value: 'Lahan C1', label: 'Lahan C1' },
  //   { value: 'Lahan C2', label: 'Lahan C2' },
  //   { value: 'Lahan C3', label: 'Lahan C3' },
  //   { value: 'Lahan D1', label: 'Lahan D1' }
  // ];

  // const komoditasOptions = [
  //   { value: '', label: 'Semua Komoditas' },
  //   { value: 'Padi', label: 'Padi' },
  //   { value: 'Jagung', label: 'Jagung' },
  //   { value: 'Kedelai', label: 'Kedelai' },
  //   { value: 'Kacang Hijau', label: 'Kacang Hijau' },
  //   { value: 'Sorgum', label: 'Sorgum' }
  // ];

  // const varietasOptions = [
  //   { value: '', label: 'Semua Varietas' },
  //   { value: 'Inpari 32', label: 'Inpari 32' },
  //   { value: 'Pioneer 21', label: 'Pioneer 21' },
  //   { value: 'Ciherang', label: 'Ciherang' },
  //   { value: 'Anjasmoro', label: 'Anjasmoro' },
  //   { value: 'Mekongga', label: 'Mekongga' },
  //   { value: 'Bisi 18', label: 'Bisi 18' },
  //   { value: 'Vima 1', label: 'Vima 1' },
  //   { value: 'Situ Bagendit', label: 'Situ Bagendit' },
  //   { value: 'Numbu', label: 'Numbu' },
  //   { value: 'Dega 1', label: 'Dega 1' }
  // ];

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Sedang Berlangsung', label: 'Sedang Berlangsung' },
    { value: 'Akan Tanam', label: 'Akan Tanam' },
    { value: 'Selesai', label: 'Selesai' }
  ];

  // Filtering Logic
  const handleApplyFilters = useCallback(() => {
    let result = [...INITIAL_JADWAL_TANAM_LIST];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.informasiUmum?.kodeJadwalTanam?.toLowerCase().includes(q) ||
        item.lahanKomoditas?.komoditas?.toLowerCase().includes(q) ||
        item.lahanKomoditas?.varietas?.toLowerCase().includes(q) ||
        item.lahanKomoditas?.namaLahan?.toLowerCase().includes(q) ||
        item.informasiUmum?.penanggungJawab?.toLowerCase().includes(q)
      );
    }

    if (filterLahan?.value) {
      result = result.filter(item => item.lahanKomoditas?.namaLahan === filterLahan.value);
    }

    if (filterKomoditas?.value) {
      result = result.filter(item => item.lahanKomoditas?.komoditas === filterKomoditas.value);
    }

    if (filterVarietas?.value) {
      result = result.filter(item => item.lahanKomoditas?.varietas === filterVarietas.value);
    }

    if (filterStatus?.value) {
      result = result.filter(item => item.status === filterStatus.value);
    }

    setFilteredTanams(result);
    setCurrentPage(1);
  }, [search, filterLahan, filterKomoditas, filterVarietas, filterStatus]);

  const handleResetFilters = () => {
    setSearch('');
    setFilterPeriode(null);
    setFilterLahan(null);
    setFilterKomoditas(null);
    setFilterVarietas(null);
    setFilterStatus(null);
    setFilteredTanams(INITIAL_JADWAL_TANAM_LIST);
    setCurrentPage(1);
    toast.info('Filter berhasil direset');
  };

  const handleAdd = () => {
    router.push('/produksi/jadwaltanam/create');
  };

  const statMaster = useMemo(() => {

    const lahanOptions = lands.map((item: Land) => {
      return {
        value: item.kodeLahan,
        label: item.namaLahan
      };
    });

    const komoditasOptions = commodities.map((item: Commodity) => {
      return {
        value: item.kodeKomoditas,
        label: item.namaKomoditas
      };
    });

    const varietasOptions = varieties.map((item: Variety) => {
      return {
        value: item.kodeVarietas,
        label: item.namaVarietas
      };
    });

    const data = {
      lahanOptions,
      komoditasOptions,
      varietasOptions,
    };


    return data;
  }, [lands, commodities, varieties]);

  const statItems = useMemo(() => [
    {
      title: 'Total Jadwal',
      value: 28,
      subtitle: 'Jadwal tanam',
      icon: 'ri-calendar-event-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Lahan',
      value: '42,50 Ha',
      subtitle: 'Luas total lahan',
      icon: 'ri-landscape-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Komoditas',
      value: 8,
      subtitle: 'Jenis komoditas',
      icon: 'ri-plant-line',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700'
    },
    {
      title: 'Akan Tanam',
      value: 7,
      subtitle: 'Dalam 7 hari ke depan',
      icon: 'ri-calendar-schedule-line',
      bgColor: 'bg-orange-100/80',
      textColor: 'text-orange-700'
    },
    {
      title: 'Sedang Berlangsung',
      value: 15,
      subtitle: 'Jadwal aktif',
      icon: 'ri-seedling-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Selesai',
      value: 6,
      subtitle: 'Periode ini',
      icon: 'ri-calendar-check-line',
      bgColor: 'bg-rose-100/80',
      textColor: 'text-rose-700'
    },
  ], []);

  return {
    jadwalTanams: filteredTanams,
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
    statMaster,
    statItems
  };
}

export default useJadwalTanams;
