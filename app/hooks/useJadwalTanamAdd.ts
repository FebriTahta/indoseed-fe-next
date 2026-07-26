import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useKomoditas from '@/app/hooks/useKomoditas'
import useVarietas from './useVarietas';
import jadwalTanamService from '@/app/services/jadwalTanamService';

import { JadwalTanam, InformasiUmum, SelectOption, LahanKomoditas, RencanaTanam, CatatanTambahan, InformasiLahan } from '@/app/types/jadwalTanam';
import { toast } from 'react-toastify';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { sumberAirOptions } from '../types/sumberAir';
import { sistemIrigasiOptions } from '../types/sistemIrigasi';

export function useJadwalTanamAdd() {
  const router = useRouter();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [informasiUmum, setInformasiUmum] = useState<InformasiUmum>({
    kodeJadwalTanam: "",
    periodeTanamMulai: "",
    periodeTanamSelesai: "",
    musimTanam: "",
    tujuanProduksi: "",
    tipeProduksi: "",
    statusJadwal: "Draft",
    penanggungJawab: "",
    deskripsi: "",
  });

  const [lahanKomoditas, setLahanKomoditas] = useState<LahanKomoditas>({
    idLahan: '',
    namaLahan: '',
    luasTanam: 0,
    komoditas: '',
    varietas: '',
    idBenih: '',
    asalBenih: '',
    jumlahBenihDiperlukan: 0,
    jarakTanam: '',
    sistemTanam: '',
  });

  const [rencanaTanam, setRencanaTanam] = useState<RencanaTanam>({
    tanggalPersemaian: '',
    tanggalTanam: '',
    perkiraanPanen: '',
    siklusTanamHari: 0,
    metodeTanam: '',
    kepadatanTanam: 0,
    irigasi: '',
    sumberAir: '',
  });

  const [catatanTambahan, setCatatanTambahan] = useState<CatatanTambahan>({
    catatan: '',
    dokumen: null,
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

  // Options
  const musimTanamOptions : SelectOption[] = [
    { value: '1', label: 'Musim Kemarau 2026' },
    { value: '2', label: 'Musim Hujan 2026' },
    { value: '3', label: 'Musim Kemarau 2027' },
    { value: '4', label: 'Musim Hujan 2027' },
  ];

  const tujuanProduksiOptions : SelectOption[] = [
    { value: '1', label: 'Benih Bersertifikat' },
    { value: '2', label: 'Tambah Stock' },
  ];

  const tipeProduksiOptions : SelectOption[] = [
    { value: '1', label: 'FS (Foundation Seed)' },
    { value: '2', label: ' - ' },
  ];

  const statusJadwalOptions : SelectOption[] = [
    { value: '1', label: 'Draft' },
    { value: '2', label: 'Direncanakan' },
    { value: '3', label: 'Disetujui' },
    { value: '4', label: 'Berjalan' },
    { value: '5', label: 'Selesai' },
    { value: '6', label: 'Dibatalkan' },
  ];

  const kelasBenihHasil : SelectOption[] = [
    { value: '1', label: 'Benih Sertifikat (SS)' },
    { value: '2', label: 'Benih Sertifikat (S)' },
  ];

  const lahanOptions : SelectOption[] = [
    { value: '1', label: 'Lahan A1 - Blok 01' },
    { value: '2', label: 'Lahan A1 - Blok 02' },
  ];

  const asalBenihOptions : SelectOption[] = [
    { value: '1', label: 'Gudang Benih - Batch BP-2505-001' },
    { value: '2', label: 'Gudang Benih - Batch BP-2505-002' },
  ];

  const jarakTanamOptions : SelectOption[] = [
    { value: '1', label: '25cm x 25cm' },
    { value: '2', label: '30cm x 30cm' },
  ];

  const sistemTanamOptions : SelectOption[] = [
    { value: '1', label: 'Jajar Legowo 4:1' },
    { value: '2', label: 'Jajar Legowo 2:1' },
  ];

  const metodeTanamOptions : SelectOption[] = [
    { value: '1', label: 'Manual' },
    { value: '2', label: 'Otomatis' },
  ];

  const statusLahanOptions : SelectOption[] = [
    { value: '1', label: 'Milik Sendiri' },
    { value: '2', label: 'Sewa' },
  ];

  const tipeLahanOptions : SelectOption[] = [
    { value: '1', label: 'Lahan Terbuka' },
    { value: '2', label: 'Lahan Tertutup' },
  ];

  const jenisTanahOptions : SelectOption[] = [
    { value: '1', label: 'Latosol' },
    { value: '2', label: '...' },
  ];

  const ketersediaanAirOptions : SelectOption[] = [
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
      komoditas: commodityOptions,
      varietas: varietasOptions,
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
  }, []);

  const infoSummary = useMemo(() => {
    const summary = {
      komoditas: lahanKomoditas.komoditas,
      varietas: lahanKomoditas.varietas,
      lahan: lahanKomoditas.idLahan,
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

    return{
      summary,
      infoBenih
    }
  }, [informasiUmum,lahanKomoditas, rencanaTanam])

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
    value: string
  ) => {
    setInformasiUmum(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeRT = (
    field: keyof RencanaTanam,
    value: string
  ) => {
    setInformasiUmum(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeCT = (
    field: keyof CatatanTambahan,
    value: string
  ) => {
    setInformasiUmum(prev => ({
      ...prev,
      [field]: value,
    }));
  };

   const handleChangeIL = (
    field: keyof InformasiLahan,
    value: string
  ) => {
    setInformasiUmum(prev => ({
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
    commodityOptions,
    varietasOptions,
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
