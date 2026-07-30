import { useState, useMemo } from 'react';
import useGreenhouse from './useGreenhouse';
import useKomoditas from './useKomoditas';
import useVarietas from './useVarietas';
import { Land } from '../types/greenhouse';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import {
  TraceabilityStep,
  ActivityTimelineItem,
  DistributionInfo,
  SupportDocument,
  BatchInfoData
} from '../types/traceability';

export function useTraceability() {
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [searchQuery, setSearchQuery] = useState('BP-2606-0005');
  const [filterKomoditas, setFilterKomoditas] = useState<any>(null);
  const [filterVarietas, setFilterVarietas] = useState<any>(null);
  const [filterPeriode, setFilterPeriode] = useState('01/06/2026 - 30/06/2026');
  const [filterLokasi, setFilterLokasi] = useState<any>(null);

  const batchInfo: BatchInfoData = {
    kodeBatch: 'BP-2606-0005',
    lotNo: 'LOT-2606-0005-01',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    kelasBenih: 'Benih Pokok',
    totalProduksi: '8.750 Kg',
    tanggalProduksi: '01/06/2026',
    tanggalExpired: '31/05/2028',
    statusBatch: 'Aktif!',
    deskripsi: 'Benih diproduksi sesuai standar ISO 9001:2015 dan ISO 22005:2018 (Traceability).'
  };

  const flowSteps: TraceabilityStep[] = [
    { stage: 1, name: '1. Sumber Bahan', code: 'LA-2606-0150', date: '01/02/2026', detail1: 'Budi Santoso', detail2: 'Tgl Tanam', icon: 'ri-leaf-line' },
    { stage: 2, name: '2. Panen', code: 'PH-2606-0075', date: '15/05/2026', detail1: '12.500 Kg', detail2: 'Berat', icon: 'ri-plant-line' },
    { stage: 3, name: '3. Pengeringan', code: 'DR-2606-0042', date: '16/05/2026', detail1: '12,6%', detail2: 'Kadar Air', icon: 'ri-sun-line' },
    { stage: 4, name: '4. Sortasi', code: 'SO-2606-0031', date: '20/05/2026', detail1: '11.200 Kg', detail2: 'Berat Bersih', icon: 'ri-filter-3-line' },
    { stage: 5, name: '5. Treatment', code: 'TR-2606-0020', date: '21/05/2026', detail1: 'Fungisida + Insektisida', detail2: 'Metoda', icon: 'ri-flask-line' },
    { stage: 6, name: '6. Quality Control', code: 'QC-2606-0018', date: '22/05/2026', detail1: 'Lulus', detail2: 'Status', icon: 'ri-shield-check-line' },
    { stage: 7, name: '7. Packing', code: 'PK-2606-0090', date: '23/05/2026', detail1: '5 Kg', detail2: 'Kemasan', icon: 'ri-box-3-line' },
    { stage: 8, name: '8. Gudang', code: 'Gudang Jadi', date: '24/05/2026', detail1: 'GJ-02-03', detail2: 'Rak', icon: 'ri-store-2-line' },
    { stage: 9, name: '9. Distribusi', code: 'DO-2606-0234', date: '25/05/2026', detail1: 'JNE Cargo', detail2: 'Transporter', icon: 'ri-truck-line' },
  ];

  const timelineActivities: ActivityTimelineItem[] = [
    { stageName: 'Tanam', dateTime: '01/02/2026 07:30', actor: 'Budi Santoso', location: 'Lahan LA-2606-0150', note: 'Penanaman benih', icon: 'ri-leaf-line' },
    { stageName: 'Panen', dateTime: '15/05/2026 08:10', actor: 'Tim Panen 1', location: 'Lahan LA-2606-0150', note: 'Panen manual', icon: 'ri-plant-line' },
    { stageName: 'Pengeringan', dateTime: '16/05/2026 09:20', actor: 'Dewi Lestari', location: 'Unit Pengering DR-01', note: 'Kadar air 12,6%', icon: 'ri-sun-line' },
    { stageName: 'Sortasi', dateTime: '20/05/2026 10:15', actor: 'Rina Agustina', location: 'Sortasi Line 2', note: 'Grading & cleaning', icon: 'ri-filter-3-line' },
    { stageName: 'Treatment', dateTime: '21/05/2026 11:05', actor: 'Slamet Riyadi', location: 'Treatment Room 1', note: 'Fungisida + Insektisida', icon: 'ri-flask-line' },
    { stageName: 'QC', dateTime: '22/05/2026 13:25', actor: 'Laboratorium QC', location: 'Lab QC', note: 'Lulus semua parameter', icon: 'ri-shield-check-line' },
    { stageName: 'Packing', dateTime: '23/05/2026 14:40', actor: 'Tim Packing', location: 'Packing Line 1', note: 'Kemasan 5 Kg', icon: 'ri-box-3-line' },
    { stageName: 'Gudang', dateTime: '24/05/2026 15:30', actor: 'Warehouse Team', location: 'Gudang Jadi', note: 'Rak GJ-02-03', icon: 'ri-store-2-line' },
    { stageName: 'Distribusi', dateTime: '25/05/2026 16:10', actor: 'Logistik', location: '—', note: 'DO-2606-0234', icon: 'ri-truck-line' },
    { stageName: 'Customer', dateTime: '27/05/2026 10:45', actor: 'Toko Tani Makmur', location: '—', note: 'Diterima dengan baik', icon: 'ri-user-heart-line' },
  ];

  const distributionInfo: DistributionInfo = {
    customer: 'Toko Tani Makmur',
    alamat: 'Jl. Raya Sukamaju No. 45, Kec. Sukamaju, Kab. Bogor',
    noDo: 'DO-2606-0234',
    tanggalKirim: '25/05/2026',
    tanggalTerima: '27/05/2026',
    transporter: 'JNE Cargo',
    noResi: 'CGK26050234567'
  };

  const supportDocuments: SupportDocument[] = [
    { name: 'Sertifikat QC BP-2606-0005.pdf', size: '245 KB' },
    { name: 'Hasil Uji Laboratorium.pdf', size: '312 KB' },
    { name: 'Sertifikat Treatment.pdf', size: '190 KB' },
    { name: 'Berita Acara Produksi.pdf', size: '267 KB' },
    { name: 'Surat Jalan DO-2606-0234.pdf', size: '156 KB' },
  ];

  const statItems = useMemo(() => [
    {
      title: 'Batch Terdeteksi',
      value: 'BP-2606-0005',
      subtitle: 'Kode Batch',
      icon: 'ri-file-text-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Komoditas',
      value: 'Padi',
      subtitle: 'Inpari 32',
      icon: 'ri-sprout-line',
      bgColor: 'bg-amber-100/80',
      textColor: 'text-amber-700'
    },
    {
      title: 'Tanggal Produksi',
      value: '01/06/2026',
      subtitle: 'Mulai Produksi',
      icon: 'ri-calendar-event-line',
      bgColor: 'bg-blue-100/80',
      textColor: 'text-blue-700'
    },
    {
      title: 'Status Traceability',
      value: 'Lengkap',
      subtitle: '100% Terdokumentasi',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-emerald-100/80',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Lokasi Saat Ini',
      value: 'Gudang Jadi',
      subtitle: 'Rak GJ-02-03',
      icon: 'ri-map-pin-line',
      bgColor: 'bg-purple-100/80',
      textColor: 'text-purple-700'
    },
    {
      title: 'Pemilik Saat Ini',
      value: 'Toko Tani Makmur',
      subtitle: 'Customer',
      icon: 'ri-user-follow-line',
      bgColor: 'bg-teal-100/80',
      textColor: 'text-teal-700'
    },
  ], []);

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

  return {
    searchQuery,
    setSearchQuery,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterPeriode,
    setFilterPeriode,
    filterLokasi,
    setFilterLokasi,
    batchInfo,
    flowSteps,
    timelineActivities,
    distributionInfo,
    supportDocuments,
    statItems,
    komoditasOptions,
    varietasOptions,
    lokasiOptions
  };
}

export default useTraceability;
