import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useKomoditas from '@/app/hooks/useKomoditas'
import useVarietas from './useVarietas';
import useGreenhouse from './useGreenhouse';
import jadwalTanamService from '@/app/services/jadwalTanamService';

import { JadwalTanam, InformasiUmum, SelectOption, LahanKomoditas, RencanaTanam, CatatanTambahan, InformasiLahan } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { Land } from '../types/greenhouse';
import { sumberAirOptions } from '../types/sumberAir';
import { sistemIrigasiOptions } from '../types/sistemIrigasi';

const formatDateStr = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const now = new Date();
const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const defaultPeriodeMulai = formatDateStr(firstDayOfMonth);
const defaultPeriodeSelesai = formatDateStr(lastDayOfMonth);
const defaultToday = formatDateStr(now);

export function useJadwalTanamAdd() {
  const router = useRouter();
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [informasiUmum, setInformasiUmum] = useState<InformasiUmum>({
    kodeJadwalTanam: "",
    periodeTanam: `${defaultPeriodeMulai} - ${defaultPeriodeSelesai}`,
    periodeTanamMulai: defaultPeriodeMulai,
    periodeTanamSelesai: defaultPeriodeSelesai,
    musimTanam: "Musim Kemarau",
    tujuanProduksi: "Benih Bersertifikat",
    tipeProduksi: "FS (Foundation Seed)",
    statusJadwal: "Draft",
    penanggungJawab: "",
    deskripsi: "",
  });

  const [lahanKomoditas, setLahanKomoditas] = useState<LahanKomoditas>({
    idLahan: '',
    namaLahan: '',
    luasTanam: 0,
    komoditas: '',
    namaKomoditas: '',
    varietas: '',
    namaVarietas: '',
    idBenih: '',
    asalBenih: 'Gudang Benih - Batch BP-2505-001',
    jumlahBenihDiperlukan: 100,
    jarakTanam: '25 cm x 25 cm',
    sistemTanam: 'Jajar Legowo 4:1',
  });

  const [rencanaTanam, setRencanaTanam] = useState<RencanaTanam>({
    tanggalPersemaian: defaultToday,
    tanggalTanam: defaultToday,
    perkiraanPanen: defaultToday,
    siklusTanamHari: 30,
    metodeTanam: 'Langsung',
    kepadatanTanam: 0,
    irigasi: 'Irigasi Terjadwal',
    sumberAir: 'Sumur Bor',
  });

  const [catatanTambahan, setCatatanTambahan] = useState<CatatanTambahan>({
    catatan: '',
    dokumen: null,
    dokumenFiles: [],
  });

  const [informasiLahan, setInformasiLahan] = useState<InformasiLahan>({
    idLahan: '',
    luasTanam: 0,
    statusLahan: '',
    tipeLahan: '',
    koordinat: '',
    ketinggian: 0,
    jenisTanah: '',
    phTanah: 0,
    sumberAir: '',
    jarakSumberAir: 0,
    sistemIrigasi: '',
    ketersediaanAir: '',
  })

  const lahanOptions = useMemo<SelectOption[]>(() => {
    return lands.map((item: Land) => ({
      value: item.kodeLahan || item.id,
      label: item.namaLahan,
    }));
  }, [lands]);

  const commodityOptions = useMemo<SelectOption[]>(() => {
    return commodities.map((item: Commodity) => ({
      value: item.kodeKomoditas,
      label: item.namaKomoditas,
    }));
  }, [commodities]);

  const varietasOptions = useMemo<SelectOption[]>(() => {
    return varieties.map((item: Variety) => ({
      value: item.kodeVarietas,
      label: item.namaVarietas,
    }));
  }, [varieties]);

  const filteredVarietasOptions = useMemo<SelectOption[]>(() => {
    const selectedKomoditas = lahanKomoditas.komoditas;
    if (!selectedKomoditas) {
      return varieties.map((item: Variety) => ({
        value: item.kodeVarietas,
        label: item.namaVarietas,
      }));
    }

    return varieties
      .filter((item: Variety) => {
        return (
          item.commodityId === selectedKomoditas ||
          item.commodity?.id === selectedKomoditas ||
          item.commodity?.kodeKomoditas === selectedKomoditas ||
          item.commodity?.namaKomoditas === selectedKomoditas
        );
      })
      .map((item: Variety) => ({
        value: item.kodeVarietas,
        label: item.namaVarietas,
      }));
  }, [varieties, lahanKomoditas.komoditas]);

  // Options
  const musimTanamOptions: SelectOption[] = [
    { value: '1', label: 'Musim Kemarau 2026' },
    { value: '2', label: 'Musim Hujan 2026' },
    { value: '3', label: 'Musim Kemarau 2027' },
    { value: '4', label: 'Musim Hujan 2027' },
  ];

  const tujuanProduksiOptions: SelectOption[] = [
    { value: '1', label: 'Benih Bersertifikat' },
    { value: '2', label: 'Tambah Stock' },
  ];

  const tipeProduksiOptions: SelectOption[] = [
    { value: '1', label: 'FS (Foundation Seed)' },
    { value: '2', label: ' - ' },
  ];

  const statusJadwalOptions: SelectOption[] = [
    { value: '1', label: 'Draft' },
    { value: '2', label: 'Direncanakan' },
    { value: '3', label: 'Disetujui' },
    { value: '4', label: 'Berjalan' },
    { value: '5', label: 'Selesai' },
    { value: '6', label: 'Dibatalkan' },
  ];

  const kelasBenihHasil: SelectOption[] = [
    { value: '1', label: 'Benih Sertifikat (SS)' },
    { value: '2', label: 'Benih Sertifikat (S)' },
  ];

  const asalBenihOptions: SelectOption[] = [
    { value: '1', label: 'Gudang Benih - Batch BP-2505-001' },
    { value: '2', label: 'Gudang Benih - Batch BP-2505-002' },
  ];

  const jarakTanamOptions: SelectOption[] = [
    { value: '1', label: '25cm x 25cm' },
    { value: '2', label: '30cm x 30cm' },
  ];

  const sistemTanamOptions: SelectOption[] = [
    { value: '1', label: 'Jajar Legowo 4:1' },
    { value: '2', label: 'Jajar Legowo 2:1' },
  ];

  const metodeTanamOptions: SelectOption[] = [
    { value: '1', label: 'Manual' },
    { value: '2', label: 'Otomatis' },
  ];

  const statusLahanOptions: SelectOption[] = [
    { value: '1', label: 'Milik Sendiri' },
    { value: '2', label: 'Sewa' },
  ];

  const tipeLahanOptions: SelectOption[] = [
    { value: '1', label: 'Lahan Terbuka' },
    { value: '2', label: 'Lahan Tertutup' },
  ];

  const jenisTanahOptions: SelectOption[] = [
    { value: '1', label: 'Latosol' },
    { value: '2', label: '...' },
  ];

  const ketersediaanAirOptions: SelectOption[] = [
    { value: '1', label: 'Baik' },
    { value: '2', label: 'Buruk' },
  ];


  // Dynamic Statistics
  const stats = useMemo(() => {
    const infoUmumOption = {
      musimTanam: musimTanamOptions,
      tujuanProduksi: tujuanProduksiOptions,
      tipeProduksi: tipeProduksiOptions,
      statusJadwal: statusJadwalOptions,
    }

    const lahanKomoOption = {
      lahan: lahanOptions,
      lands: lands,
      komoditas: commodityOptions,
      varietas: filteredVarietasOptions,
      allVarietas: varieties,
      asalBenih: asalBenihOptions,
      kelasBenihHasil: kelasBenihHasil,
      jarakTanam: jarakTanamOptions,
      sistemTanam: sistemTanamOptions,
    }

    const rencanaTanamOption = {
      metodeTanam: metodeTanamOptions,
      irigasi: sistemIrigasiOptions,
      sumberAir: sumberAirOptions
    }

    const informasiLahanOption = {
      lahan: lahanOptions,
      statusLahan: statusLahanOptions,
      tipeLahan: tipeLahanOptions,
      jenisTanah: jenisTanahOptions,
      sumberAir: sumberAirOptions,
      sistemIrigasi: sistemIrigasiOptions,
      ketersediaanAir: ketersediaanAirOptions,
    }

    return {
      infoUmumOption,
      lahanKomoOption,
      rencanaTanamOption,
      informasiLahanOption
    };
  }, [lahanOptions, commodityOptions, filteredVarietasOptions]);

  const infoSummary = useMemo(() => {
    const summary = {
      komoditas: lahanKomoditas.namaKomoditas || lahanKomoditas.komoditas,
      varietas: lahanKomoditas.namaVarietas || lahanKomoditas.varietas,
      lahan: lahanKomoditas.namaLahan || lahanKomoditas.idLahan,
      luasTanam: lahanKomoditas.luasTanam,
      periodeTanam: `${informasiUmum.periodeTanamMulai} - ${informasiUmum.periodeTanamSelesai}`,
      perkiraanPanen: rencanaTanam.perkiraanPanen,
      benihDiperlukan: lahanKomoditas.jumlahBenihDiperlukan,
      tujuanProduksi: informasiUmum.tujuanProduksi,
      tipeProduksi: informasiUmum.tipeProduksi,
    }

    const infoBenih = {
      batchBenih: lahanKomoditas.asalBenih,
      asalBenih: lahanKomoditas.asalBenih,
      tanggalProduksi: '?',
      dayaBerkecambah: '95%',
      kemurnian: '98%',
      kadarAir: '12%',
    }

    return {
      summary,
      infoBenih
    }
  }, [informasiUmum, lahanKomoditas, rencanaTanam])

  const handleChangeIU = (
    field: keyof InformasiUmum,
    value: string
  ) => {
    setInformasiUmum(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeLK = (
    field: keyof LahanKomoditas,
    value: any
  ) => {
    setLahanKomoditas(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === 'idLahan') {
        const land = lands.find((item: Land) => item.kodeLahan === value || item.id === value);
        if (land) {
          updated.idLahan = land.kodeLahan || land.id;
          updated.luasTanam = land.luas;
          updated.namaLahan = land.namaLahan || '';
          updated.komoditas = land.commodity?.kodeKomoditas || land.commodityId || '';
          updated.namaKomoditas = land.commodity?.namaKomoditas || '';
          updated.varietas = '';
          updated.namaVarietas = '';

          setInformasiLahan({
            idLahan: land.kodeLahan || land.id,
            luasTanam: land.luas,
            statusLahan: land.status || 'Milik Sendiri',
            tipeLahan: land.jenisLahan || 'Lahan Terbuka',
            koordinat: land.koordinat || '-7.123456, 112.123456',
            ketinggian: 450,
            jenisTanah: 'Latosol',
            phTanah: 6.2,
            sumberAir: 'Sumur Bor',
            jarakSumberAir: 120,
            sistemIrigasi: 'Irigasi Terjadwal',
            ketersediaanAir: 'Baik',
          });
        }
      }

      if (field === 'komoditas') {
        const foundCommodity = commodities.find(
          (c: Commodity) => c.kodeKomoditas === value || c.id === value || c.namaKomoditas === value
        );
        updated.namaKomoditas = foundCommodity ? foundCommodity.namaKomoditas : (value || '');
        updated.varietas = '';
        updated.namaVarietas = '';
      }

      if (field === 'varietas') {
        const foundVariety = varieties.find(
          (v: Variety) => v.kodeVarietas === value || v.id === value || v.namaVarietas === value
        );
        updated.namaVarietas = foundVariety ? foundVariety.namaVarietas : (value || '');
      }

      return updated;
    });

    console.log(`==${field}==>${value}`);
  };

  const handleChangeRT = (
    field: keyof RencanaTanam,
    value: any
  ) => {
    setRencanaTanam(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeCT = (
    field: keyof CatatanTambahan,
    value: any
  ) => {
    setCatatanTambahan(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeIL = (
    field: keyof InformasiLahan,
    value: any
  ) => {
    setInformasiLahan(prev => ({
      ...prev,
      [field]: value,
    }));
  };


  return {
    informasiUmum,
    setInformasiUmum,
    lahanKomoditas,
    setLahanKomoditas,
    rencanaTanam,
    setRencanaTanam,
    catatanTambahan,
    setCatatanTambahan,
    informasiLahan,
    setInformasiLahan,
    lahanOptions,
    commodityOptions,
    filteredVarietasOptions,
    stats,
    infoSummary,
    handleChangeIU,
    handleChangeLK,
    handleChangeRT,
    handleChangeCT,
    handleChangeIL
  };
}




export default useJadwalTanamAdd;
