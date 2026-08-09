import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useKomoditas from '@/app/hooks/useKomoditas';
import useVarietas from './useVarietas';
import useGreenhouse from './useGreenhouse';
import jadwalTanamService from '@/app/services/jadwalTanamService';
import { toast } from 'react-toastify';

import {
  InformasiUmum,
  SelectOption,
  LahanKomoditas,
  RencanaTanam,
  CatatanTambahan,
  InformasiLahan,
} from '@/app/types/jadwalTanam';
import { Commodity } from '../types/commodity';
import { Variety } from '../types/variety';
import { Land } from '../types/greenhouse';

const formatDateStr = (dateVal: any) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export function useJadwalTanamEdit(id: string) {
  const router = useRouter();
  const { lands } = useGreenhouse();
  const { commodities } = useKomoditas();
  const { varieties } = useVarietas();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [informasiUmum, setInformasiUmum] = useState<InformasiUmum>({
    kodeJadwalTanam: '',
    periodeTanamMulai: '',
    periodeTanamSelesai: '',
    musimTanam: 'Musim Kemarau',
    tujuanProduksi: 'Benih Bersertifikat',
    tipeProduksi: 'FS (Foundation Seed)',
    statusJadwal: 'Draft',
    penanggungJawab: '',
    deskripsi: '',
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
    tanggalPersemaian: '',
    tanggalTanam: '',
    perkiraanPanen: '',
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
    statusLahan: 'Milik Sendiri',
    tipeLahan: 'Lahan Terbuka',
    koordinat: '',
    ketinggian: 450,
    jenisTanah: 'Latosol',
    phTanah: 6.2,
    sumberAir: 'Sumur Bor',
    jarakSumberAir: 120,
    sistemIrigasi: 'Irigasi Terjadwal',
    ketersediaanAir: 'Baik',
  });

  const [detailRencanaTanam, setDetailRencanaTanam] = useState<any[]>([]);
  const [personilList, setPersonilList] = useState<any[]>([]);
  const [peralatanList, setPeralatanList] = useState<any[]>([]);

  // Fetch Existing Data on Load
  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await jadwalTanamService.getJadwalTanamById(id);
        const item = res?.data?.data || res?.data || res;

        if (item) {
          const pMulai = formatDateStr(item.periodeTanamMulai || item.periodeTanam);
          const pSelesai = formatDateStr(item.periodeTanamSelesai);
          const pStr = pMulai && pSelesai ? `${pMulai} - ${pSelesai}` : pMulai || item.periodeTanam || '';

          setInformasiUmum({
            kodeJadwalTanam: item.kodeJadwalTanam || '',
            periodeTanam: pStr,
            periodeTanamMulai: pMulai,
            periodeTanamSelesai: pSelesai,
            musimTanam: item.musimTanam || 'Musim Kemarau',
            tujuanProduksi: item.tujuanProduksi || 'Benih Bersertifikat',
            tipeProduksi: item.tipeProduksi || 'FS (Foundation Seed)',
            statusJadwal: item.statusJadwal || 'Draft',
            penanggungJawab: item.penanggungJawab || '',
            deskripsi: item.deskripsi || '',
          });

          setLahanKomoditas({
            idLahan: item.greenhouseId || item.greenhouse?.kodeLahan || item.greenhouse?.id || item.idLahan || '',
            namaLahan: item.greenhouse?.namaLahan || item.namaLahan || '',
            luasTanam: Number(item.luasTanam || item.luasTotal || item.greenhouse?.luas || 0),
            komoditas: item.commodityId || item.commodity?.kodeKomoditas || item.commodity?.id || item.komoditas || '',
            namaKomoditas: item.commodity?.namaKomoditas || item.namaKomoditas || '',
            varietas: item.varietyId || item.variety?.kodeVarietas || item.variety?.id || item.varietas || '',
            namaVarietas: item.variety?.namaVarietas || item.namaVarietas || '',
            idBenih: '',
            asalBenih: item.asalBenih || 'Gudang Benih - Batch BP-2505-001',
            jumlahBenihDiperlukan: Number(item.jumlahBenihDiperlukan || 100),
            jarakTanam: item.jarakTanam || '25 cm x 25 cm',
            sistemTanam: item.sistemTanam || 'Jajar Legowo 4:1',
          });

          setRencanaTanam({
            tanggalPersemaian: formatDateStr(item.tanggalPersemaian),
            tanggalTanam: formatDateStr(item.tanggalTanam),
            perkiraanPanen: formatDateStr(item.perkiraanPanen),
            siklusTanamHari: Number(item.siklusTanamHari || 30),
            metodeTanam: item.metodeTanam || 'Langsung',
            kepadatanTanam: Number(item.kepadatanTanam || 0),
            irigasi: item.irigasi || 'Irigasi Terjadwal',
            sumberAir: item.sumberAir || 'Sumur Bor',
          });

          setInformasiLahan({
            idLahan: item.greenhouseId || item.greenhouse?.kodeLahan || '',
            luasTanam: Number(item.luasTanam || item.greenhouse?.luas || 0),
            statusLahan: item.greenhouse?.status || 'Milik Sendiri',
            tipeLahan: item.greenhouse?.jenisLahan || 'Greenhouse',
            koordinat: item.greenhouse?.koordinat || '-7.250445, 112.768845',
            ketinggian: 450,
            jenisTanah: 'Latosol',
            phTanah: 6.2,
            sumberAir: item.sumberAir || 'Sumur Bor',
            jarakSumberAir: 120,
            sistemIrigasi: item.irigasi || 'Irigasi Terjadwal',
            ketersediaanAir: 'Baik',
          });

          setCatatanTambahan({
            catatan: item.catatan || '',
            dokumen: null,
            dokumenFiles: item.dokumen || [],
          });

          const mappedDetailLahan = (item.detailLahan && item.detailLahan.length > 0)
            ? item.detailLahan.map((dl: any, idx: number) => ({
                no: idx + 1,
                idLahan: dl.greenhouseId || dl.greenhouse?.kodeLahan || dl.greenhouse?.id || '',
                lahan: dl.namaLahan || dl.greenhouse?.namaLahan || 'Lahan Utama',
                luas: String(dl.luas || item.luasTanam || 0),
                komoditas: item.commodity?.namaKomoditas || 'Jagung Hibrida',
                varietas: item.variety?.namaVarietas || 'BISI-18',
                tipe: dl.tipeLahan || 'Lahan Terbuka',
                tglTanam: formatDateStr(item.tanggalTanam),
                populasi: '250.000 batang/Ha',
                irigasi: dl.irigasi || item.irigasi || 'Irigasi Terjadwal',
              }))
            : [
                {
                  no: 1,
                  idLahan: item.greenhouseId || item.greenhouse?.kodeLahan || item.greenhouse?.id || '',
                  lahan: item.greenhouse?.namaLahan || item.namaLahan || 'Lahan Green House A1',
                  luas: String(item.luasTanam || item.luasTotal || 2.5),
                  komoditas: item.commodity?.namaKomoditas || 'Jagung Hibrida',
                  varietas: item.variety?.namaVarietas || 'BISI-18',
                  tipe: 'Greenhouse',
                  tglTanam: formatDateStr(item.tanggalTanam),
                  populasi: '250.000 batang/Ha',
                  irigasi: item.irigasi || 'Irigasi Terjadwal',
                }
              ];
          setDetailRencanaTanam(mappedDetailLahan);

          const mappedPersonil = (item.personil && item.personil.length > 0)
            ? item.personil.map((p: any, idx: number) => ({
                no: idx + 1,
                nama: p.nama,
                peran: p.peran,
                kontak: p.kontak || '-',
                keterangan: p.tugas || '-',
              }))
            : [
                { no: 1, nama: item.penanggungJawab || 'Ahmad Subagyo', peran: 'Penanggung Jawab / Koordinator', kontak: '0812-3456-7890', keterangan: 'Pengawasan Utama' },
                { no: 2, nama: 'Budi Santoso', peran: 'Agronomis / Petugas Lapangan', kontak: '0813-9876-5432', keterangan: 'Pemantauan Nutrisi' },
              ];
          setPersonilList(mappedPersonil);

          const mappedPeralatan = (item.peralatan && item.peralatan.length > 0)
            ? item.peralatan.map((eq: any, idx: number) => ({
                no: idx + 1,
                nama: eq.nama,
                kategori: eq.jenis || 'Peralatan',
                jumlah: eq.jumlah || 1,
                satuan: eq.satuan || 'Unit',
                kondisi: eq.kondisi || 'Baik',
              }))
            : [
                { no: 1, nama: 'Hand Sprayer Electrik 16L', kategori: 'Peralatan Proteksi', jumlah: 2, satuan: 'Unit', kondisi: 'Baik' },
                { no: 2, nama: 'pH Meter & Soil Tester Digital', kategori: 'Alat Ukur', jumlah: 1, satuan: 'Unit', kondisi: 'Sangat Baik' },
              ];
          setPeralatanList(mappedPeralatan);
        }
      } catch (err) {
        console.error('Error fetching Jadwal Tanam detail:', err);
        toast.error('Gagal memuat detail jadwal tanam');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const lahanOptions = useMemo<SelectOption[]>(() => {
    return lands.map((item: Land) => ({
      value: item.kodeLahan || item.id,
      label: item.namaLahan,
    }));
  }, [lands]);

  const commodityOptions = useMemo<SelectOption[]>(() => {
    return commodities.map((item: Commodity) => ({
      value: item.kodeKomoditas || item.id,
      label: item.namaKomoditas,
    }));
  }, [commodities]);

  const filteredVarietasOptions = useMemo<SelectOption[]>(() => {
    const selectedKomo = lahanKomoditas.komoditas;
    if (!selectedKomo) {
      return varieties.map((item: Variety) => ({
        value: item.kodeVarietas || item.id,
        label: item.namaVarietas,
      }));
    }
    return varieties
      .filter((v: Variety) => {
        return (
          v.commodityId === selectedKomo ||
          v.commodity?.id === selectedKomo ||
          v.commodity?.kodeKomoditas === selectedKomo ||
          v.commodity?.namaKomoditas === selectedKomo
        );
      })
      .map((item: Variety) => ({
        value: item.kodeVarietas || item.id,
        label: item.namaVarietas,
      }));
  }, [varieties, lahanKomoditas.komoditas]);

  const handleChangeIU = (field: keyof InformasiUmum, value: string) => {
    setInformasiUmum((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeLK = (field: keyof LahanKomoditas, value: any) => {
    setLahanKomoditas((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'idLahan') {
        const land = lands.find((item: Land) => item.kodeLahan === value || item.id === value);
        if (land) {
          updated.idLahan = land.kodeLahan || land.id;
          updated.luasTanam = land.luas;
          updated.namaLahan = land.namaLahan || '';
        }
      }
      return updated;
    });
  };

  const handleChangeRT = (field: keyof RencanaTanam, value: any) => {
    setRencanaTanam((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeCT = (field: keyof CatatanTambahan, value: any) => {
    setCatatanTambahan((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeIL = (field: keyof InformasiLahan, value: any) => {
    setInformasiLahan((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveUpdate = async () => {
    try {
      setIsSubmitting(true);
      const uploadedDocs = (catatanTambahan?.dokumenFiles || []).map((file: any) => ({
        nama: file.name || file.nama || 'Dokumen Rencana Tanam',
        fileUrl: file instanceof File ? URL.createObjectURL(file) : (file.url || file.fileUrl || ''),
        fileType: file.type || file.fileType || 'application/pdf',
      }));

      const payload = {
        kodeJadwalTanam: informasiUmum.kodeJadwalTanam,
        periodeTanam: informasiUmum.periodeTanamMulai,
        periodeTanamMulai: informasiUmum.periodeTanamMulai,
        periodeTanamSelesai: informasiUmum.periodeTanamSelesai,
        musimTanam: informasiUmum.musimTanam,
        tujuanProduksi: informasiUmum.tujuanProduksi,
        tipeProduksi: informasiUmum.tipeProduksi,
        statusJadwal: informasiUmum.statusJadwal,
        penanggungJawab: informasiUmum.penanggungJawab,
        deskripsi: informasiUmum.deskripsi,

        greenhouseId: lahanKomoditas.idLahan,
        commodityId: lahanKomoditas.komoditas,
        varietyId: lahanKomoditas.varietas,
        luasTanam: lahanKomoditas.luasTanam,
        asalBenih: lahanKomoditas.asalBenih,
        jumlahBenihDiperlukan: lahanKomoditas.jumlahBenihDiperlukan,
        jarakTanam: lahanKomoditas.jarakTanam,
        sistemTanam: lahanKomoditas.sistemTanam,

        tanggalPersemaian: rencanaTanam.tanggalPersemaian,
        tanggalTanam: rencanaTanam.tanggalTanam,
        perkiraanPanen: rencanaTanam.perkiraanPanen,
        siklusTanamHari: rencanaTanam.siklusTanamHari,
        metodeTanam: rencanaTanam.metodeTanam,
        kepadatanTanam: rencanaTanam.kepadatanTanam,
        irigasi: rencanaTanam.irigasi,
        sumberAir: rencanaTanam.sumberAir,
        catatan: catatanTambahan.catatan,

        detailRencanaTanam,
        personilList,
        peralatanList,
        dokumenList: uploadedDocs,
      };

      const res = await jadwalTanamService.updateJadwalTanams(id, payload);
      toast.success(res?.message || 'Jadwal Tanam berhasil diperbarui!');
      router.push('/produksi/jadwaltanam');
    } catch (err: any) {
      console.error('Error updating Jadwal Tanam:', err);
      toast.error(err.response?.data?.message || err.message || 'Gagal memperbarui jadwal tanam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    informasiUmum,
    lahanKomoditas,
    rencanaTanam,
    catatanTambahan,
    informasiLahan,
    detailRencanaTanam,
    setDetailRencanaTanam,
    personilList,
    setPersonilList,
    peralatanList,
    setPeralatanList,
    lahanOptions,
    commodityOptions,
    filteredVarietasOptions,
    handleChangeIU,
    handleChangeLK,
    handleChangeRT,
    handleChangeCT,
    handleChangeIL,
    handleSaveUpdate,
  };
}

export default useJadwalTanamEdit;
