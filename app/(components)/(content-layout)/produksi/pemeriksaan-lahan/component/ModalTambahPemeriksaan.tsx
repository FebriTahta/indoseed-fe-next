"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ReferensiJadwalTanamItem } from '@/app/types/pemeriksaanLahan';
import { pemeriksaanLahanService } from '@/app/services/pemeriksaanLahanService';
import { parameterService } from '@/app/services/parameterService';
import { MasterParameter, CombinedVarietyParameter, VarietyParameter } from '@/app/types/parameter';
import ModalKatalogMasterParameter from '@/app/(components)/(content-layout)/master/varietas/component/ModalKatalogMasterParameter';
import ModalMasterParameterPopup from '@/app/(components)/(content-layout)/master/varietas/component/ModalMasterParameterPopup';

interface ModalTambahPemeriksaanProps {
  isOpen: boolean;
  onClose: () => void;
  eligibleJadwals: ReferensiJadwalTanamItem[];
  loadingEligible: boolean;
  onSuccess?: () => void;
}

interface TemuanOffTypeItemState {
  id: string;
  no: number;
  parameterId?: string;
  jenisKarakter: string;
  jumlah: number;
  keterangan: string;
  foto: string;
  fotoFile?: File;
}

interface PhotoItem {
  id: string;
  src: string;
  name: string;
  date: string;
  size: string;
  file?: File;
}

interface DokumenItem {
  id: string;
  no: number;
  nama: string;
  tipe: string;
  ukuran: string;
  tanggal: string;
  icon: string;
  iconBg: string;
  file?: File;
  url?: string;
}

interface ParameterHasilItem {
  parameterId: string;
  kode: string;
  nama: string;
  tipeNilai: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
  satuan?: string | null;
  standarText: string;
  varietyParameter?: VarietyParameter | null;
  parameter: MasterParameter;
  options?: Array<{ id?: string; kode: string; nama: string; bobot?: number | string }>;
}

export default function ModalTambahPemeriksaan({
  isOpen,
  onClose,
  eligibleJadwals,
  loadingEligible,
  onSuccess,
}: ModalTambahPemeriksaanProps) {
  // Wizard step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);

  // Form Fields - Step 1
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>('');
  const [tanggalPemeriksaan, setTanggalPemeriksaan] = useState<string>('');
  const [jamPemeriksaan, setJamPemeriksaan] = useState<string>('');
  const [petugasQc, setPetugasQc] = useState<string>('Andi Pratama');
  const [fasePertumbuhan, setFasePertumbuhan] = useState<string>('Vegetatif');
  const [kondisiUmum, setKondisiUmum] = useState<string>('Baik');

  // Kemurnian Inputs
  const [jumlahTanamanDiamati, setJumlahTanamanDiamati] = useState<number>(1000);
  const [tanamanSesuai, setTanamanSesuai] = useState<number>(992);
  const [tanamanOffType, setTanamanOffType] = useState<number>(8);
  const [catatan, setCatatan] = useState<string>('');

  // Step 2 State - Parameter Hasil Pemeriksaan (Katalog Master MONITORING_LAHAN)
  const [loadingParams, setLoadingParams] = useState<boolean>(false);
  const [hasilPemeriksaanParams, setHasilPemeriksaanParams] = useState<ParameterHasilItem[]>([]);
  const [hasilValues, setHasilValues] = useState<Record<string, string>>({});
  const [isParamCatalogOpen, setIsParamCatalogOpen] = useState<boolean>(false);
  const [isParamCreateModalOpen, setIsParamCreateModalOpen] = useState<boolean>(false);
  const [varietyParamsList, setVarietyParamsList] = useState<CombinedVarietyParameter[]>([]);

  // Step 3 State - Temuan Off Type (Katalog Master OFF_TYPE)
  const [loadingOffType, setLoadingOffType] = useState<boolean>(false);
  const [temuanOffTypeList, setTemuanOffTypeList] = useState<TemuanOffTypeItemState[]>([]);
  const [selectedOffTypeIds, setSelectedOffTypeIds] = useState<number[]>([]);
  const [filterKarakter, setFilterKarakter] = useState<string>('Semua Karakter');
  const [filterJumlah, setFilterJumlah] = useState<string>('Semua Jumlah');
  const [filterKeterangan, setFilterKeterangan] = useState<string>('Semua Keterangan');
  const [isOffTypeCatalogOpen, setIsOffTypeCatalogOpen] = useState<boolean>(false);
  const [isOffTypeCreateModalOpen, setIsOffTypeCreateModalOpen] = useState<boolean>(false);

  // Step 4 State - Dokumentasi (default kosong)
  const [photoGallery, setPhotoGallery] = useState<PhotoItem[]>([]);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [supportingDocs, setSupportingDocs] = useState<DokumenItem[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Photo Lightbox/Preview Modal state
  const [viewingPhotoModal, setViewingPhotoModal] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Reset / initialize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      const today = new Date();
      setTanggalPemeriksaan(today.toISOString().split('T')[0]);
      setJamPemeriksaan(today.toTimeString().slice(0, 5));
      setJumlahTanamanDiamati(1000);
      setTanamanSesuai(1000);
      setTanamanOffType(0);
      setCatatan('');
      setPhotoGallery([]);
      setActivePhotoIdx(0);
      setSupportingDocs([]);
      setSelectedOffTypeIds([]);
      // Mekanisme baru: awal list kosong, dipilih dari katalog master parameter
      setHasilPemeriksaanParams([]);
      setHasilValues({});
      setTemuanOffTypeList([]);
    }
  }, [isOpen]);

  // Default eligible selection when opened
  useEffect(() => {
    if (isOpen && eligibleJadwals && eligibleJadwals.length > 0 && !selectedJadwalId) {
      setSelectedJadwalId(eligibleJadwals[0].id);
    }
  }, [isOpen, eligibleJadwals, selectedJadwalId]);

  // Selected Jadwal Tanam metadata
  const selectedJadwal = useMemo(() => {
    return eligibleJadwals.find((j) => j.id === selectedJadwalId) || eligibleJadwals[0] || null;
  }, [eligibleJadwals, selectedJadwalId]);

  const displayKodeJadwal = selectedJadwal?.kodeJadwalTanam || 'JT-2026-0018';
  const displayKomoditas = selectedJadwal?.komoditas || 'Kangkung';
  const displayVarietas = selectedJadwal?.varietas || 'Super Sempit';
  const displayPetani = selectedJadwal?.namaPetani || 'Budi Santoso';
  const displayLahan = selectedJadwal?.lahan || 'Lahan A / Blok 01';
  const displayLuasLahan = selectedJadwal?.luasLahan ? `${selectedJadwal.luasLahan} Ha` : '1,00 Ha';

  // =========================================================================
  // HELPER: Sanitizer Input Angka (tidak bisa 0 didepan jika diikuti angka lain)
  // Contoh: '0' -> 0, '09' -> 9, '00' -> 0, '0125' -> 125, '' -> 0
  // =========================================================================
  const sanitizeNumericInput = (rawVal: string): number => {
    const onlyDigits = rawVal.replace(/\D/g, '');
    if (onlyDigits === '') return 0;
    const stripped = onlyDigits.replace(/^0+(?=\d)/, '');
    const parsed = parseInt(stripped, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Handle auto-sync numbers Kemurnian
  const handleJumlahTanamanChange = (raw: string) => {
    const num = sanitizeNumericInput(raw);
    setJumlahTanamanDiamati(num);
    const sesuai = Math.min(tanamanSesuai, num);
    setTanamanSesuai(sesuai);
    setTanamanOffType(Math.max(0, num - sesuai));
  };

  const handleTanamanSesuaiChange = (raw: string) => {
    const num = sanitizeNumericInput(raw);
    const clamped = Math.min(num, jumlahTanamanDiamati);
    setTanamanSesuai(clamped);
    setTanamanOffType(Math.max(0, jumlahTanamanDiamati - clamped));
  };

  const handleTanamanOffTypeChange = (raw: string) => {
    const num = sanitizeNumericInput(raw);
    const clamped = Math.min(num, jumlahTanamanDiamati);
    setTanamanOffType(clamped);
    setTanamanSesuai(Math.max(0, jumlahTanamanDiamati - clamped));
  };

  // Calculations Kemurnian
  const kemurnianVal = useMemo(() => {
    if (jumlahTanamanDiamati <= 0) return 100.0;
    return parseFloat(((tanamanSesuai / jumlahTanamanDiamati) * 100).toFixed(1));
  }, [jumlahTanamanDiamati, tanamanSesuai]);

  const kemurnianFormatted = String(kemurnianVal).replace('.', ',');
  const offTypePercentFormatted = String((100 - kemurnianVal).toFixed(1)).replace('.', ',');

  const statusPemeriksaan = useMemo(() => {
    if (kemurnianVal >= 98.0) return 'Memenuhi standar';
    if (kemurnianVal >= 95.0) return 'Perlu Roguing';
    return 'Tidak Memenuhi';
  }, [kemurnianVal]);

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffsetKemurnian = circumference - (Math.min(kemurnianVal, 100) / 100) * circumference;

  // =========================================================================
  // STEP 2: Cache Standar Varietas (modul: MONITORING_LAHAN) untuk Parameter yang Dipilih
  // =========================================================================
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    const fetchVarietyStandards = async () => {
      setLoadingParams(true);
      try {
        const varietyId = selectedJadwal?.varietyId || selectedJadwal?.variety?.id;
        if (varietyId) {
          try {
            const res = await parameterService.getVarietyParameters(varietyId, 'MONITORING_LAHAN');
            if (res.status === 'success' && Array.isArray(res.data) && !isCancelled) {
              setVarietyParamsList(res.data);
              return;
            }
          } catch (e) {
            console.warn('Gagal memuat variety parameters:', e);
          }
        }
        if (!isCancelled) {
          setVarietyParamsList([]);
        }
      } catch (err) {
        console.error('Error fetching variety parameters:', err);
      } finally {
        if (!isCancelled) setLoadingParams(false);
      }
    };

    fetchVarietyStandards();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, selectedJadwal]);

  // Update existing items in hasilPemeriksaanParams if varietyParamsList updates
  useEffect(() => {
    if (hasilPemeriksaanParams.length === 0 || varietyParamsList.length === 0) return;
    setHasilPemeriksaanParams((prev) =>
      prev.map((item) => {
        const combined = varietyParamsList.find(
          (vp) => vp.parameter?.id === item.parameterId || vp.parameter?.kode === item.kode
        );
        if (!combined?.varietyParameter) return item;
        const vp = combined.varietyParameter;
        const mp = item.parameter;
        let standarText = item.standarText;
        if (mp.tipeNilai === 'NUMBER') {
          standarText = `${vp.operator || '≥'} ${vp.nilaiNumber ?? (mp.batasLulus ?? 25)} ${mp.satuan || ''}`.trim();
        } else if (mp.tipeNilai === 'RANGE') {
          standarText = `${vp.nilaiMin ?? 0} - ${vp.nilaiMax ?? 100} ${mp.satuan || ''}`.trim();
        } else if (mp.tipeNilai === 'OPTION') {
          standarText = vp.option?.nama || mp.options?.[0]?.nama || '-';
        } else if (mp.tipeNilai === 'TEXT') {
          standarText = vp.nilaiText || 'Baik';
        } else if (mp.tipeNilai === 'BOOLEAN') {
          standarText = vp.nilaiText || 'Ya';
        }
        return { ...item, varietyParameter: vp, standarText };
      })
    );
  }, [varietyParamsList]);

  // Tambah parameter terpilih dari katalog ke Step 2
  const handleAddParamsFromCatalog = (selectedParams: MasterParameter[]) => {
    const newItems: ParameterHasilItem[] = [];
    const newValues: Record<string, string> = { ...hasilValues };

    selectedParams.forEach((mp) => {
      if (hasilPemeriksaanParams.some((p) => p.parameterId === mp.id || p.kode === mp.kode)) {
        return;
      }

      const combined = varietyParamsList.find(
        (item) => item.parameter?.id === mp.id || item.parameter?.kode === mp.kode
      );
      const vp = combined?.varietyParameter || null;

      let standarText = '-';
      if (vp) {
        if (mp.tipeNilai === 'NUMBER') {
          standarText = `${vp.operator || '≥'} ${vp.nilaiNumber ?? (mp.batasLulus ?? 25)} ${mp.satuan || ''}`.trim();
        } else if (mp.tipeNilai === 'RANGE') {
          standarText = `${vp.nilaiMin ?? 0} - ${vp.nilaiMax ?? 100} ${mp.satuan || ''}`.trim();
        } else if (mp.tipeNilai === 'OPTION') {
          standarText = vp.option?.nama || mp.options?.[0]?.nama || '-';
        } else if (mp.tipeNilai === 'TEXT') {
          standarText = vp.nilaiText || 'Baik';
        } else if (mp.tipeNilai === 'BOOLEAN') {
          standarText = vp.nilaiText || 'Ya';
        }
      } else {
        if (mp.tipeNilai === 'NUMBER') {
          standarText = `≥ ${mp.batasLulus ?? 25} ${mp.satuan || ''}`.trim();
        } else if (mp.tipeNilai === 'OPTION') {
          standarText = mp.options?.[0]?.nama || 'Lembab';
        } else if (mp.tipeNilai === 'TEXT') {
          standarText = 'Baik';
        } else if (mp.tipeNilai === 'RANGE') {
          standarText = mp.batasLulus ? `≥ ${mp.batasLulus}` : '-';
        }
      }

      newItems.push({
        parameterId: mp.id,
        kode: mp.kode,
        nama: mp.nama,
        tipeNilai: mp.tipeNilai as any,
        satuan: mp.satuan,
        standarText,
        varietyParameter: vp,
        parameter: mp,
        options: mp.options,
      });

      if (newValues[mp.id] === undefined) {
        if (mp.kode === 'PRM-TG-TNM') newValues[mp.id] = '28';
        else if (mp.kode === 'PRM-KND-DN') newValues[mp.id] = 'Baik';
        else if (mp.kode === 'PRM-KND-TNH') newValues[mp.id] = mp.options?.[0]?.nama || 'Lembab';
        else if (mp.kode === 'PRM-SRG-HM') newValues[mp.id] = 'Ringan';
        else if (mp.tipeNilai === 'OPTION') newValues[mp.id] = mp.options?.[0]?.nama || '';
        else if (mp.tipeNilai === 'NUMBER') newValues[mp.id] = String(vp?.nilaiNumber || mp.batasLulus || 25);
        else if (mp.tipeNilai === 'TEXT') newValues[mp.id] = vp?.nilaiText || 'Baik';
        else if (mp.tipeNilai === 'BOOLEAN') newValues[mp.id] = 'Ya';
        else newValues[mp.id] = '';
      }
    });

    setHasilPemeriksaanParams((prev) => [...prev, ...newItems]);
    setHasilValues(newValues);
    setIsParamCatalogOpen(false);
  };

  // Hapus baris parameter dari Step 2
  const handleRemoveParamItem = (paramId: string) => {
    setHasilPemeriksaanParams((prev) => prev.filter((p) => p.parameterId !== paramId));
    setHasilValues((prev) => {
      const next = { ...prev };
      delete next[paramId];
      return next;
    });
  };

  // Callback setelah master parameter Monitoring Lahan baru berhasil dibuat
  const handleCreateParamSuccess = (newParam: MasterParameter) => {
    handleAddParamsFromCatalog([newParam]);
    setIsParamCreateModalOpen(false);
  };

  // Kalkulasi Status Hasil vs Standar untuk baris parameter
  const calculateRowStatus = (
    item: ParameterHasilItem,
    val: string | undefined
  ): { status: string; isMatch: boolean | null } => {
    if (val === undefined || val === null || String(val).trim() === '') {
      return { status: 'Belum Diisi', isMatch: null };
    }
    const strVal = String(val).trim();
    const vp = item.varietyParameter;
    const mp = item.parameter;

    if (item.tipeNilai === 'NUMBER') {
      const num = parseFloat(strVal);
      if (isNaN(num)) return { status: 'Tidak Sesuai', isMatch: false };
      const target = vp?.nilaiNumber ?? (typeof mp.batasLulus === 'number' ? mp.batasLulus : 25);
      const op = vp?.operator || '>=';
      let ok = false;
      if (op === '>=') ok = num >= target;
      else if (op === '>') ok = num > target;
      else if (op === '<=') ok = num <= target;
      else if (op === '<') ok = num < target;
      else if (op === '=') ok = num === target;
      else ok = num >= target;
      return { status: ok ? 'Sesuai' : 'Tidak Sesuai', isMatch: ok };
    }

    if (item.tipeNilai === 'RANGE') {
      const num = parseFloat(strVal);
      if (isNaN(num)) return { status: 'Tidak Sesuai', isMatch: false };
      const min = vp?.nilaiMin ?? 0;
      const max = vp?.nilaiMax ?? 100;
      const ok = num >= min && num <= max;
      return { status: ok ? 'Sesuai' : 'Tidak Sesuai', isMatch: ok };
    }

    if (item.tipeNilai === 'OPTION') {
      const stdOpt = (vp?.option?.nama || mp.options?.[0]?.nama || '').toLowerCase();
      const chosen = strVal.toLowerCase();
      const badWords = ['buruk', 'berat', 'kering', 'rusak', 'parah'];
      const isBad = badWords.some((b) => chosen.includes(b));
      const ok = stdOpt ? chosen === stdOpt || (!isBad && !stdOpt.includes('kering')) : !isBad;
      return { status: ok ? 'Sesuai' : 'Tidak Sesuai', isMatch: ok };
    }

    if (item.tipeNilai === 'TEXT') {
      const lower = strVal.toLowerCase();
      const badWords = ['berat', 'parah', 'hancur', 'rusak', 'kritis'];
      const isBad = badWords.some((b) => lower.includes(b));
      const stdText = (vp?.nilaiText || '').toLowerCase();
      const ok = stdText ? lower.includes(stdText) : !isBad;
      return { status: ok ? 'Sesuai' : 'Tidak Sesuai', isMatch: ok };
    }

    if (item.tipeNilai === 'BOOLEAN') {
      const ok = strVal === 'Ya' || strVal === 'true';
      return { status: ok ? 'Sesuai' : 'Tidak Sesuai', isMatch: ok };
    }

    return { status: 'Sesuai', isMatch: true };
  };

  // =========================================================================
  // STEP 3: Temuan Off Type (Pilih dari Katalog Master Modul OFF_TYPE & Upload Foto)
  // =========================================================================
  const handleAddOffTypeFromCatalog = (selectedParams: MasterParameter[]) => {
    const newItems: TemuanOffTypeItemState[] = [];
    const currentMaxNo = temuanOffTypeList.reduce((max, t) => Math.max(max, t.no), 0);

    const defaultDescriptions: Record<string, string> = {
      'bentuk daun': 'Daun lebih lebar',
      'warna batang': 'Warna lebih pucat',
      'tinggi tanaman': 'Tinggi lebih pendek',
      'bentuk buah': 'Bentuk tidak seragam',
      'habitus': 'Tipe percabangan berbeda',
      'warna gabah': 'Ujung gabah berbulu ungu',
    };

    selectedParams.forEach((param, idx) => {
      if (
        temuanOffTypeList.some(
          (t) => t.parameterId === param.id || t.jenisKarakter.toLowerCase() === param.nama.toLowerCase()
        )
      ) {
        return;
      }

      const ket =
        param.deskripsi ||
        defaultDescriptions[param.nama.toLowerCase()] ||
        `Karakter ${param.nama.toLowerCase()} menyimpang`;

      newItems.push({
        id: `ot-row-${param.id || Date.now()}-${idx}`,
        no: currentMaxNo + idx + 1,
        parameterId: param.id,
        jenisKarakter: param.nama,
        jumlah: 1, // Default 1 tanaman temuan
        keterangan: ket,
        foto: '',
        fotoFile: undefined,
      });
    });

    setTemuanOffTypeList((prev) => [...prev, ...newItems]);
    setIsOffTypeCatalogOpen(false);
  };

  const handleRemoveOffTypeRow = (rowNo: number) => {
    setTemuanOffTypeList((prev) => {
      const filtered = prev.filter((r) => r.no !== rowNo);
      return filtered.map((r, i) => ({ ...r, no: i + 1 }));
    });
    setSelectedOffTypeIds((prev) => prev.filter((id) => id !== rowNo));
  };

  const handleRemoveSelectedOffTypes = () => {
    if (selectedOffTypeIds.length === 0) return;
    setTemuanOffTypeList((prev) => {
      const filtered = prev.filter((r) => !selectedOffTypeIds.includes(r.no));
      return filtered.map((r, i) => ({ ...r, no: i + 1 }));
    });
    setSelectedOffTypeIds([]);
  };

  // Callback setelah master parameter Off-Type baru berhasil dibuat
  const handleCreateOffTypeSuccess = (newParam: MasterParameter) => {
    handleAddOffTypeFromCatalog([newParam]);
    setIsOffTypeCreateModalOpen(false);
  };

  // Handle Upload 1 Foto per Temuan Off Type
  const handleUploadOffTypePhoto = (rowNo: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setTemuanOffTypeList((prev) =>
      prev.map((row) => (row.no === rowNo ? { ...row, foto: objectUrl, fotoFile: file } : row))
    );
    e.target.value = '';
  };

  const handleRemoveOffTypePhoto = (rowNo: number) => {
    setTemuanOffTypeList((prev) =>
      prev.map((row) => (row.no === rowNo ? { ...row, foto: '', fotoFile: undefined } : row))
    );
  };

  const handleRowJumlahChange = (rowNo: number, rawVal: string) => {
    const num = sanitizeNumericInput(rawVal);
    setTemuanOffTypeList((prev) =>
      prev.map((row) => (row.no === rowNo ? { ...row, jumlah: num } : row))
    );
  };

  const handleRowKeteranganChange = (rowNo: number, val: string) => {
    setTemuanOffTypeList((prev) =>
      prev.map((row) => (row.no === rowNo ? { ...row, keterangan: val } : row))
    );
  };

  // Filtered temuan off type
  const filteredTemuanOffType = useMemo(() => {
    return temuanOffTypeList.filter((item) => {
      if (filterKarakter !== 'Semua Karakter' && item.jenisKarakter !== filterKarakter) return false;
      if (filterJumlah !== 'Semua Jumlah' && String(item.jumlah) !== filterJumlah) return false;
      if (filterKeterangan !== 'Semua Keterangan' && !item.keterangan.toLowerCase().includes(filterKeterangan.toLowerCase())) return false;
      return true;
    });
  }, [temuanOffTypeList, filterKarakter, filterJumlah, filterKeterangan]);

  // Total Off Type plants across rows
  const totalTemuanOffTypeCount = useMemo(() => {
    return temuanOffTypeList.reduce((acc, curr) => acc + (curr.jumlah || 0), 0);
  }, [temuanOffTypeList]);

  // =========================================================================
  // STEP 4: Dokumentasi (Foto Kegiatan maks 6 & Dokumen Pendukung)
  // =========================================================================
  const handleUploadFotoKegiatan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remainingSlots = 6 - photoGallery.length;
    if (remainingSlots <= 0) {
      alert('Maksimal 6 foto kegiatan dokumentasi.');
      return;
    }
    const filesToAdd = files.slice(0, remainingSlots);
    const newItems: PhotoItem[] = filesToAdd.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      src: URL.createObjectURL(file),
      name: file.name,
      date: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      size:
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`,
      file,
    }));

    setPhotoGallery((prev) => [...prev, ...newItems]);
    if (photoGallery.length === 0) {
      setActivePhotoIdx(0);
    }
    e.target.value = '';
  };

  const handleDeleteFotoKegiatan = (indexToRemove: number) => {
    setPhotoGallery((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      if (activePhotoIdx >= next.length) {
        setActivePhotoIdx(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleUploadSupportingDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newDocs: DokumenItem[] = files.map((file, idx) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      let icon = 'ri-file-line';
      let iconBg = 'bg-gray-50 text-gray-600';
      if (['PDF'].includes(ext)) {
        icon = 'ri-file-pdf-line';
        iconBg = 'bg-rose-50 text-rose-600';
      } else if (['XLS', 'XLSX', 'CSV'].includes(ext)) {
        icon = 'ri-file-excel-line';
        iconBg = 'bg-emerald-50 text-emerald-600';
      } else if (['DOC', 'DOCX'].includes(ext)) {
        icon = 'ri-file-word-line';
        iconBg = 'bg-blue-50 text-blue-600';
      } else if (['ZIP', 'RAR', '7Z'].includes(ext)) {
        icon = 'ri-file-zip-line';
        iconBg = 'bg-purple-50 text-purple-600';
      } else if (['JPG', 'JPEG', 'PNG', 'WEBP'].includes(ext)) {
        icon = 'ri-image-line';
        iconBg = 'bg-amber-50 text-amber-600';
      }

      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `doc-${Date.now()}-${idx}`,
        no: supportingDocs.length + idx + 1,
        nama: file.name,
        tipe: ext,
        ukuran: sizeStr,
        tanggal: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        icon,
        iconBg,
        file,
        url: URL.createObjectURL(file),
      };
    });

    setSupportingDocs((prev) => [...prev, ...newDocs]);
    e.target.value = '';
  };

  const handleDeleteSupportingDoc = (id: string) => {
    setSupportingDocs((prev) =>
      prev.filter((d) => d.id !== id).map((d, idx) => ({ ...d, no: idx + 1 }))
    );
  };

  // =========================================================================
  // SUBMISSION: Simpan Pemeriksaan
  // =========================================================================
  const handleSimpanPemeriksaan = async () => {
    try {
      setSaving(true);
      const payload = {
        jadwalTanamId: selectedJadwal?.id || null,
        kodeJadwalTanam: displayKodeJadwal,
        tanggalPemeriksaan: new Date(`${tanggalPemeriksaan}T${jamPemeriksaan}:00`).toISOString(),
        komoditas: displayKomoditas,
        varietas: displayVarietas,
        petani: displayPetani,
        lahan: displayLahan,
        fase: fasePertumbuhan,
        petugasQc,
        persentaseKemurnian: kemurnianVal,
        status: statusPemeriksaan.includes('Memenuhi')
          ? 'Memenuhi'
          : statusPemeriksaan.includes('Roguing')
          ? 'Perlu Roguing'
          : 'Tidak Memenuhi',
        jumlahTanamanDiamati,
        tanamanSesuai,
        tanamanOffType,
        keterangan: statusPemeriksaan,
        catatan:
          catatan ||
          `Kondisi tanaman dalam lahan baik, dengan tingkat kemurnian ${kemurnianFormatted}% dan ketidaksesuaian (off type) sebesar ${offTypePercentFormatted}%. Rekomendasi: Lanjutkan monitoring dan lakukan roguing pada tanaman yang teridentifikasi off type.`,
        temuanOffType: temuanOffTypeList.map((t, idx) => ({
          no: idx + 1,
          jenisKarakter: t.jenisKarakter,
          jumlah: t.jumlah,
          keterangan: t.keterangan,
          foto: t.foto || '',
        })),
        dokumentasi: photoGallery.map((p) => p.src),
        roguingData: {
          status: statusPemeriksaan.includes('Roguing') ? 'Perlu Roguing' : 'Selesai / Terkendali',
          tanggalRencana: '15 Okt 2026',
          petugas: displayPetani,
          catatan: 'Segera lakukan roguing pada tanaman off-type yang teridentifikasi.',
        },
      };

      await pemeriksaanLahanService.create(payload);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      setCurrentStep(1);
    } catch (err: any) {
      console.warn('Gagal menyimpan pemeriksaan lahan:', err?.message || String(err));
      alert('Gagal menyimpan pemeriksaan lahan: ' + (err?.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // Dynamic titles and subtitles per step
  const stepMeta = [
    { title: 'Tambah Pemeriksaan Lahan', subtitle: 'Lakukan pemeriksaan lapangan untuk memastikan kemurnian varietas dan mengidentifikasi tanaman off type.' },
    { title: 'Hasil Pemeriksaan Lahan', subtitle: 'Lihat detail hasil pemeriksaan lapangan yang dilakukan pada lokasi lahan.' },
    { title: 'Temuan Off Type', subtitle: 'Lihat dan kelola seluruh temuan off type yang ditemukan pada pemeriksaan lahan.' },
    { title: 'Dokumentasi', subtitle: 'Lihat dan kelola dokumentasi terkait kegiatan pemeriksaan lahan.' },
    { title: 'Ringkasan Pemeriksaan Lahan', subtitle: 'Ringkasan hasil pemeriksaan lahan untuk memberikan gambaran umum kondisi lahan.' },
  ];

  const currentMeta = stepMeta[currentStep - 1] || stepMeta[0];

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Scrollable Parent Centering Container */}
        <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white text-left shadow-2xl border border-gray-100 my-4 sm:my-8 transform transition-all flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ================================================================
                MODAL HEADER: Dynamic Title & Subtitle + Close Icon
                ================================================================ */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#055127] flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                  <i className="ri-plant-line"></i>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight leading-tight">
                    {currentMeta.title}
                  </h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {currentMeta.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* ================================================================
                STEP WIZARD STEPPER BAR (1 to 5)
                ================================================================ */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-center overflow-x-auto flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 text-xs">
                {[
                  { step: 1, label: 'Informasi Pemeriksaan' },
                  { step: 2, label: 'Hasil Pemeriksaan' },
                  { step: 3, label: 'Temuan Off Type' },
                  { step: 4, label: 'Dokumentasi' },
                  { step: 5, label: 'Ringkasan' },
                ].map((s) => {
                  const isActive = currentStep === s.step;
                  const isPassed = currentStep > s.step;

                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setCurrentStep(s.step)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs font-semibold'
                          : isPassed
                          ? 'text-emerald-700 hover:bg-emerald-50/50'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive
                            ? 'bg-[#055127] text-white'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'border border-gray-300 text-gray-400'
                        }`}
                      >
                        {isPassed ? <i className="ri-check-line text-xs"></i> : s.step}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ================================================================
                MODAL BODY: Switch based on currentStep
                ================================================================ */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-gray-50/30 text-xs">
              {/* -------------------------------------------------------------
                  STEP 1: INFORMASI PEMERIKSAAN & PEMERIKSAAN KEMURNIAN
                  ------------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Card 1: Informasi Pemeriksaan Form */}
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-gray-800 font-bold text-xs">
                      <i className="ri-file-text-line text-[#055127] text-sm"></i>
                      <span>Informasi Pemeriksaan</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {/* Jadwal Tanam Dropdown */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Jadwal Tanam <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={selectedJadwalId}
                          onChange={(e) => setSelectedJadwalId(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        >
                          {loadingEligible ? (
                            <option value="">Memuat data jadwal...</option>
                          ) : eligibleJadwals.length === 0 ? (
                            <option value="">Tidak ada jadwal tanam yang eligible</option>
                          ) : (
                            eligibleJadwals.map((j) => (
                              <option key={j.id} value={j.id}>
                                {j.kodeJadwalTanam} - {j.komoditas} / {j.varietas}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Tanggal & Jam Pemeriksaan */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Tanggal & Jam Pemeriksaan <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={tanggalPemeriksaan}
                            onChange={(e) => setTanggalPemeriksaan(e.target.value)}
                            className="w-full pl-2 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                          <input
                            type="time"
                            value={jamPemeriksaan}
                            onChange={(e) => setJamPemeriksaan(e.target.value)}
                            className="w-full pl-2 pr-1 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Petugas QC */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Petugas QC <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={petugasQc}
                          onChange={(e) => setPetugasQc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        >
                          <option value="Andi Pratama">Andi Pratama</option>
                          <option value="Budi Santoso">Budi Santoso</option>
                          <option value="Siti Rahma">Siti Rahma</option>
                          <option value="Hendra Wijaya">Hendra Wijaya</option>
                        </select>
                      </div>

                      {/* Fase Pertumbuhan */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Fase Pertumbuhan <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={fasePertumbuhan}
                          onChange={(e) => setFasePertumbuhan(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        >
                          <option value="Vegetatif">Vegetatif</option>
                          <option value="Generatif">Generatif</option>
                          <option value="Pembungaan">Pembungaan</option>
                          <option value="Masak Fisiologis">Masak Fisiologis</option>
                        </select>
                      </div>

                      {/* Kondisi Umum */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Kondisi Umum <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={kondisiUmum}
                          onChange={(e) => setKondisiUmum(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        >
                          <option value="Sangat Baik">Sangat Baik</option>
                          <option value="Baik">Baik</option>
                          <option value="Cukup">Cukup</option>
                          <option value="Kurang">Kurang</option>
                        </select>
                      </div>
                    </div>

                    {/* Auto-filled strip: Petani, Lahan, Luas Lahan, Varietas */}
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50/60 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <i className="ri-user-line text-emerald-600 text-sm"></i>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Petani</span>
                          <span className="font-semibold text-gray-800 text-[11px] truncate block">
                            {displayPetani}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <i className="ri-map-pin-line text-emerald-600 text-sm"></i>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Lahan</span>
                          <span className="font-semibold text-gray-800 text-[11px] truncate block">
                            {displayLahan}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <i className="ri-shape-line text-emerald-600 text-sm"></i>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Luas Lahan</span>
                          <span className="font-semibold text-gray-800 text-[11px] truncate block">
                            {displayLuasLahan}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <i className="ri-price-tag-3-line text-emerald-600 text-sm"></i>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Varietas</span>
                          <span className="font-semibold text-gray-800 text-[11px] truncate block">
                            {displayVarietas}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Pemeriksaan Kemurnian with Gauge (No leading zero validation) */}
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                        <i className="ri-leaf-line text-[#055127] text-sm"></i>
                        <span>Pemeriksaan Kemurnian</span>
                      </div>
                      <span className="text-[10px] text-gray-400 italic">
                        Input angka otomatis membersihkan awalan 0 (misal: 09 → 9)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Numeric Inputs */}
                      <div className="md:col-span-7 space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Jumlah Tanaman Diamati <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={jumlahTanamanDiamati === 0 ? '0' : jumlahTanamanDiamati}
                              onChange={(e) => handleJumlahTanamanChange(e.target.value)}
                              className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                              tanaman
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Tanaman Sesuai Varietas <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={tanamanSesuai === 0 ? '0' : tanamanSesuai}
                              onChange={(e) => handleTanamanSesuaiChange(e.target.value)}
                              className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                              tanaman
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                            Tanaman Off Type <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="numeric"
                              value={tanamanOffType === 0 ? '0' : tanamanOffType}
                              onChange={(e) => handleTanamanOffTypeChange(e.target.value)}
                              className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]">
                              tanaman
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Circular Gauge & Calculation Card */}
                      <div className="md:col-span-5 bg-emerald-50/40 rounded-xl p-4 border border-emerald-100 flex flex-col items-center text-center">
                        <span className="text-[11px] font-bold text-gray-700 mb-2">Persentase Kemurnian</span>

                        <div className="relative w-28 h-28 flex items-center justify-center my-1">
                          <svg className="w-28 h-28 transform -rotate-90">
                            <circle
                              cx="56"
                              cy="56"
                              r={radius}
                              stroke="#e5e7eb"
                              strokeWidth="8"
                              fill="transparent"
                            />
                            <circle
                              cx="56"
                              cy="56"
                              r={radius}
                              stroke="#059669"
                              strokeWidth="8"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeOffsetKemurnian}
                              strokeLinecap="round"
                              fill="transparent"
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                              {kemurnianFormatted}%
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                              Kemurnian
                            </span>
                          </div>
                        </div>

                        <div className="text-[11px] text-gray-600 space-y-0.5 mb-2">
                          <span className="text-[10px] text-gray-400 block">Perhitungan:</span>
                          <span className="font-mono text-gray-700 font-medium block">
                            ({tanamanSesuai.toLocaleString('id-ID')} / {jumlahTanamanDiamati.toLocaleString('id-ID')}) × 100%
                          </span>
                          <span className="font-bold text-emerald-800 text-xs block">
                            = {kemurnianFormatted}%
                          </span>
                        </div>

                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <i className="ri-checkbox-circle-fill text-emerald-600 text-xs"></i>
                            {statusPemeriksaan}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Keterangan Tambahan */}
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                      <i className="ri-file-edit-line text-[#055127] text-sm"></i>
                      <span>Keterangan Tambahan</span>
                    </div>
                    <div className="relative">
                      <textarea
                        rows={3}
                        maxLength={500}
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        placeholder="Masukkan catatan tambahan hasil pemeriksaan..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      ></textarea>
                      <span className="absolute right-3 bottom-2.5 text-[10px] text-gray-400">
                        {catatan.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 2: HASIL PEMERIKSAAN (Connect Master Parameter Monitoring Lahan)
                  ------------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Header Meta Strip */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                        <i className="ri-survey-line text-[#055127] text-sm"></i>
                        <span>Hasil Pemeriksaan Lapangan</span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        Referensi Modul: <strong className="text-emerald-700">Monitoring Lahan</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                          <i className="ri-calendar-line"></i>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Tanggal</span>
                          <span className="font-bold text-gray-800 text-xs">
                            {tanggalPemeriksaan ? new Date(tanggalPemeriksaan).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                          <i className="ri-user-star-line"></i>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Petugas QC</span>
                          <span className="font-bold text-gray-800 text-xs">{petugasQc}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                          <i className="ri-plant-line"></i>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Fase Pertumbuhan</span>
                          <span className="font-bold text-gray-800 text-xs">{fasePertumbuhan}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50/70 border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                          <i className="ri-heart-pulse-line"></i>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Kondisi Umum</span>
                          <span className="font-bold text-gray-800 text-xs">{kondisiUmum}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail Hasil Pemeriksaan Table */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2 font-bold text-gray-900 text-xs">
                      <div className="flex items-center gap-2">
                        <i className="ri-table-line text-[#055127] text-sm"></i>
                        <span>Detail Hasil Pemeriksaan Parameter</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {hasilPemeriksaanParams.length} Parameter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsParamCreateModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          title="Tambah master parameter pengamatan baru ke database"
                        >
                          <i className="ri-add-circle-line"></i>
                          <span>+ Parameter Baru</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsParamCatalogOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#055127] hover:bg-[#043e1e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <i className="ri-add-line"></i>
                          <span>Pilih dari Katalog Parameter</span>
                        </button>
                      </div>
                    </div>

                    {loadingParams ? (
                      <div className="p-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin text-base text-emerald-600"></i>
                        <span>Memuat data standar varietas...</span>
                      </div>
                    ) : hasilPemeriksaanParams.length === 0 ? (
                      <div className="p-8 text-center bg-gray-50/40">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl mb-3">
                          <i className="ri-list-check-2"></i>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 mb-1">
                          Belum Ada Parameter Pemeriksaan
                        </h4>
                        <p className="text-[11px] text-gray-500 max-w-sm mx-auto mb-3">
                          Daftar parameter awal kosong. Silakan buka katalog master parameter untuk memilih parameter monitoring lapangan yang akan dinilai.
                        </p>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setIsParamCreateModalOpen(true)}
                            className="px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <i className="ri-add-circle-line"></i>
                            <span>+ Buat Parameter Baru</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsParamCatalogOpen(true)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#055127] hover:bg-[#043e1e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <i className="ri-add-line"></i>
                            <span>Buka Katalog Parameter Lapangan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                          <tr>
                            <th className="py-2.5 px-3 w-10 text-center">No</th>
                            <th className="py-2.5 px-3 w-1/4">Parameter</th>
                            <th className="py-2.5 px-3 w-1/3">Hasil (Input)</th>
                            <th className="py-2.5 px-3">Standar Varietas</th>
                            <th className="py-2.5 px-3 text-center w-28">Status</th>
                            <th className="py-2.5 px-3 text-center w-16">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {hasilPemeriksaanParams.map((item, index) => {
                            const val = hasilValues[item.parameterId] ?? '';
                            const calc = calculateRowStatus(item, val);

                            return (
                              <tr key={item.parameterId} className="hover:bg-gray-50/50">
                                <td className="py-2.5 px-3 text-center text-gray-400 font-medium">
                                  {index + 1}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-gray-800">
                                  <div>{item.nama}</div>
                                  <div className="text-[10px] text-gray-400 font-normal">
                                    Tipe: <span className="font-mono">{item.tipeNilai}</span>
                                    {item.satuan ? ` (${item.satuan})` : ''}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  {/* Render dynamic input based on tipeNilai */}
                                  {item.tipeNilai === 'NUMBER' && (
                                    <div className="relative">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={val}
                                        onChange={(e) => {
                                          const clean = sanitizeNumericInput(e.target.value);
                                          setHasilValues((prev) => ({
                                            ...prev,
                                            [item.parameterId]: String(clean),
                                          }));
                                        }}
                                        placeholder="Masukkan angka..."
                                        className="w-full px-2.5 py-1.5 pr-14 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                      />
                                      {item.satuan && (
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                                          {item.satuan}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {item.tipeNilai === 'OPTION' && (
                                    <select
                                      value={val}
                                      onChange={(e) =>
                                        setHasilValues((prev) => ({
                                          ...prev,
                                          [item.parameterId]: e.target.value,
                                        }))
                                      }
                                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                    >
                                      <option value="">-- Pilih {item.nama} --</option>
                                      {item.options && item.options.length > 0 ? (
                                        item.options.map((opt) => (
                                          <option key={opt.id || opt.kode} value={opt.nama}>
                                            {opt.nama}
                                          </option>
                                        ))
                                      ) : (
                                        <>
                                          <option value="Lembab">Lembab</option>
                                          <option value="Kering">Kering</option>
                                          <option value="Normal">Normal</option>
                                        </>
                                      )}
                                    </select>
                                  )}

                                  {item.tipeNilai === 'TEXT' && (
                                    <input
                                      type="text"
                                      value={val}
                                      onChange={(e) =>
                                        setHasilValues((prev) => ({
                                          ...prev,
                                          [item.parameterId]: e.target.value,
                                        }))
                                      }
                                      placeholder={`Masukkan ${item.nama.toLowerCase()}...`}
                                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                    />
                                  )}

                                  {item.tipeNilai === 'RANGE' && (
                                    <div className="relative">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={val}
                                        onChange={(e) => {
                                          const clean = sanitizeNumericInput(e.target.value);
                                          setHasilValues((prev) => ({
                                            ...prev,
                                            [item.parameterId]: String(clean),
                                          }));
                                        }}
                                        placeholder="Masukkan nilai..."
                                        className="w-full px-2.5 py-1.5 pr-14 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                      />
                                      {item.satuan && (
                                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                                          {item.satuan}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {item.tipeNilai === 'BOOLEAN' && (
                                    <select
                                      value={val}
                                      onChange={(e) =>
                                        setHasilValues((prev) => ({
                                          ...prev,
                                          [item.parameterId]: e.target.value,
                                        }))
                                      }
                                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                    >
                                      <option value="Ya">Ya (Sesuai)</option>
                                      <option value="Tidak">Tidak</option>
                                    </select>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-gray-700 font-medium">
                                  <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-[11px]">
                                    {item.standarText}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  {calc.status === 'Sesuai' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <i className="ri-check-line text-xs"></i>
                                      Sesuai
                                    </span>
                                  ) : calc.status === 'Tidak Sesuai' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                      <i className="ri-close-line text-xs"></i>
                                      Tidak Sesuai
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                                      Belum Diisi
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveParamItem(item.parameterId)}
                                    title="Hapus parameter"
                                    className="w-7 h-7 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700 inline-flex items-center justify-center transition-colors"
                                  >
                                    <i className="ri-delete-bin-line text-sm"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Catatan Pemeriksaan Strip */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
                    <i className="ri-checkbox-circle-fill text-emerald-600 text-base mt-0.5"></i>
                    <div className="text-xs">
                      <span className="font-bold text-emerald-950 block">Keterangan Kalkulasi Status</span>
                      <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                        Status parameter dihitung otomatis membandingkan nilai input <strong>Hasil</strong> terhadap <strong>Standar Karakteristik Varietas</strong> ({displayVarietas}).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 3: TEMUAN OFF TYPE (Master Parameter Modul OFF_TYPE + Upload 1 Foto)
                  ------------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Filter Row & Header Actions */}
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                        <i className="ri-filter-3-line text-[#055127] text-sm"></i>
                        <span>Daftar Temuan Off Type</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {temuanOffTypeList.length} Karakter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedOffTypeIds.length > 0 && (
                          <button
                            type="button"
                            onClick={handleRemoveSelectedOffTypes}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <i className="ri-delete-bin-line"></i>
                            <span>Hapus ({selectedOffTypeIds.length})</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsOffTypeCreateModalOpen(true)}
                          className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          title="Tambah master parameter off-type baru ke database"
                        >
                          <i className="ri-add-circle-line"></i>
                          <span>+ Karakter Off-Type Baru</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOffTypeCatalogOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-[#055127] hover:bg-[#043e1e] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <i className="ri-add-line"></i>
                          <span>Pilih dari Katalog Off-Type</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
                      <div>
                        <select
                          value={filterKarakter}
                          onChange={(e) => setFilterKarakter(e.target.value)}
                          className="w-full px-2.5 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Semua Karakter">Semua Karakter</option>
                          {temuanOffTypeList.map((t) => (
                            <option key={t.id} value={t.jenisKarakter}>
                              {t.jenisKarakter}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <select
                          value={filterJumlah}
                          onChange={(e) => setFilterJumlah(e.target.value)}
                          className="w-full px-2.5 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Semua Jumlah">Semua Jumlah</option>
                          <option value="1">1 Tanaman</option>
                          <option value="2">2 Tanaman</option>
                          <option value="3">3 Tanaman</option>
                          <option value="4">4+ Tanaman</option>
                        </select>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={filterKeterangan === 'Semua Keterangan' ? '' : filterKeterangan}
                          onChange={(e) => setFilterKeterangan(e.target.value || 'Semua Keterangan')}
                          placeholder="Cari keterangan..."
                          className="w-full px-2.5 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setFilterKarakter('Semua Karakter');
                            setFilterJumlah('Semua Jumlah');
                            setFilterKeterangan('Semua Keterangan');
                          }}
                          className="w-full px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <i className="ri-refresh-line text-sm"></i>
                          Reset Filter
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Table Temuan Off Type */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    {loadingOffType ? (
                      <div className="p-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin text-base text-emerald-600"></i>
                        <span>Memuat parameter modul off type...</span>
                      </div>
                    ) : temuanOffTypeList.length === 0 ? (
                      <div className="p-8 text-center bg-gray-50/40">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-xl mb-3">
                          <i className="ri-checkbox-circle-line"></i>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 mb-1">
                          Tidak Ada Temuan Off-Type (Lahan Murni)
                        </h4>
                        <p className="text-[11px] text-gray-500 max-w-sm mx-auto mb-3">
                          Daftar temuan awal kosong (0 tanaman). Jika ditemukan penyimpangan tanaman di lapangan, silakan tambahkan karakter temuan dari katalog master parameter.
                        </p>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setIsOffTypeCreateModalOpen(true)}
                            className="px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <i className="ri-add-circle-line"></i>
                            <span>+ Buat Karakter Off-Type Baru</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsOffTypeCatalogOpen(true)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#055127] hover:bg-[#043e1e] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <i className="ri-add-line"></i>
                            <span>Buka Katalog Temuan Off-Type</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                          <tr>
                            <th className="py-2.5 px-3 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={
                                  temuanOffTypeList.length > 0 &&
                                  selectedOffTypeIds.length === temuanOffTypeList.length
                                }
                                onChange={() => {
                                  if (selectedOffTypeIds.length === temuanOffTypeList.length) {
                                    setSelectedOffTypeIds([]);
                                  } else {
                                    setSelectedOffTypeIds(temuanOffTypeList.map((t) => t.no));
                                  }
                                }}
                                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                            </th>
                            <th className="py-2.5 px-2 w-10 text-center">No</th>
                            <th className="py-2.5 px-3 w-40">Jenis Karakter</th>
                            <th className="py-2.5 px-3 w-28 text-center">Jumlah (Tanaman)</th>
                            <th className="py-2.5 px-3">Keterangan Temuan</th>
                            <th className="py-2.5 px-3 text-center w-28">Foto (Maks 1)</th>
                            <th className="py-2.5 px-3 text-center w-20">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredTemuanOffType.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedOffTypeIds.includes(item.no)}
                                  onChange={() => {
                                    if (selectedOffTypeIds.includes(item.no)) {
                                      setSelectedOffTypeIds(selectedOffTypeIds.filter((id) => id !== item.no));
                                    } else {
                                      setSelectedOffTypeIds([...selectedOffTypeIds, item.no]);
                                    }
                                  }}
                                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-2.5 px-2 text-center text-gray-400 font-medium">{item.no}</td>
                              <td className="py-2.5 px-3 font-semibold text-gray-900">
                                {item.jenisKarakter}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={item.jumlah === 0 ? '0' : item.jumlah}
                                  onChange={(e) => handleRowJumlahChange(item.no, e.target.value)}
                                  className="w-20 px-2 py-1 text-center font-bold text-gray-800 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={item.keterangan || ''}
                                  onChange={(e) => handleRowKeteranganChange(item.no, e.target.value)}
                                  placeholder="Tulis keterangan temuan..."
                                  className="w-full px-2.5 py-1 text-xs text-gray-800 bg-transparent border border-transparent hover:border-gray-200 focus:border-emerald-600 focus:bg-white rounded-md transition-colors"
                                />
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {item.foto ? (
                                  <div className="relative inline-block group">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 inline-block">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={item.foto}
                                        alt={item.jenisKarakter}
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOffTypePhoto(item.no)}
                                      title="Hapus foto"
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                                    >
                                      <i className="ri-close-line"></i>
                                    </button>
                                  </div>
                                ) : (
                                  <label
                                    className="cursor-pointer inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-500 hover:text-emerald-700 text-[11px] font-medium transition-colors"
                                    title="Unggah 1 foto temuan"
                                  >
                                    <i className="ri-upload-2-line text-xs"></i>
                                    <span>Unggah</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleUploadOffTypePhoto(item.no, e)}
                                    />
                                  </label>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    disabled={!item.foto}
                                    onClick={() =>
                                      setViewingPhotoModal({
                                        isOpen: true,
                                        url: item.foto,
                                        title: `Temuan Off Type - ${item.jenisKarakter}`,
                                      })
                                    }
                                    title={item.foto ? 'Lihat Foto' : 'Belum ada foto'}
                                    className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors ${
                                      item.foto
                                        ? 'text-emerald-700 hover:bg-emerald-50 cursor-pointer'
                                        : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                  >
                                    <i className="ri-eye-line text-sm"></i>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOffTypeRow(item.no)}
                                    title="Hapus baris temuan"
                                    className="w-7 h-7 rounded text-rose-500 hover:bg-rose-50 hover:text-rose-700 inline-flex items-center justify-center transition-colors"
                                  >
                                    <i className="ri-delete-bin-line text-sm"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Bottom summary info strip */}
                    <div className="p-3 border-t border-gray-100 bg-emerald-50/40 flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <i className="ri-information-line text-emerald-600 text-sm"></i>
                        <span>
                          Total temuan off type pada tabel: <strong>{totalTemuanOffTypeCount} tanaman</strong> (Step 1 mencatat: <strong>{tanamanOffType} tanaman</strong>).
                        </span>
                      </div>
                      {totalTemuanOffTypeCount !== tanamanOffType && (
                        <button
                          type="button"
                          onClick={() => {
                            setTanamanOffType(totalTemuanOffTypeCount);
                            setTanamanSesuai(Math.max(0, jumlahTanamanDiamati - totalTemuanOffTypeCount));
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                        >
                          Sinkronkan ke Step 1
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 4: DOKUMENTASI (Foto Kegiatan maks 6, preview kanan & Dokumen pendukung)
                  ------------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Foto Kegiatan Section */}
                  <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-gray-800 font-bold text-xs">
                        <i className="ri-camera-line text-[#055127] text-sm"></i>
                        <span>Foto Kegiatan</span>
                        <span className="text-[11px] font-normal text-gray-400">
                          ({photoGallery.length}/6 foto)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadFotoKegiatan}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={photoGallery.length >= 6}
                          onClick={() => photoInputRef.current?.click()}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            photoGallery.length >= 6
                              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <i className="ri-add-line text-sm"></i>
                          Tambah Foto
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Left: Thumbnails List / Grid */}
                      <div className="md:col-span-6">
                        {photoGallery.length === 0 ? (
                          <div
                            onClick={() => photoInputRef.current?.click()}
                            className="h-56 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all"
                          >
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-2 shadow-xs">
                              <i className="ri-image-add-line"></i>
                            </div>
                            <span className="font-bold text-gray-800 text-xs">Belum ada foto kegiatan</span>
                            <span className="text-[11px] text-gray-400 mt-1 max-w-xs">
                              Klik tombol di atas atau area ini untuk mengunggah foto kegiatan pemeriksaan (maks. 6 foto).
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2.5">
                            {photoGallery.map((photo, index) => {
                              const isSelected = activePhotoIdx === index;
                              return (
                                <div
                                  key={photo.id}
                                  onClick={() => setActivePhotoIdx(index)}
                                  className={`aspect-square rounded-lg overflow-hidden border relative cursor-pointer group transition-all ${
                                    isSelected
                                      ? 'ring-2 ring-emerald-600 border-transparent shadow-xs'
                                      : 'border-gray-200 hover:opacity-90'
                                  }`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={photo.src}
                                    alt={photo.name}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/60 text-white text-[9px] font-medium backdrop-blur-[1px]">
                                    {index + 1}/6
                                  </span>

                                  {/* Delete thumbnail action */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFotoKegiatan(index);
                                    }}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <i className="ri-close-line"></i>
                                  </button>

                                  <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-base pointer-events-none">
                                    <i className="ri-zoom-in-line"></i>
                                  </div>
                                </div>
                              );
                            })}

                            {photoGallery.length < 6 && (
                              <button
                                type="button"
                                onClick={() => photoInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/20 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-700 transition-colors"
                              >
                                <i className="ri-add-line text-xl"></i>
                                <span className="text-[10px] font-medium mt-0.5">Tambah</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Large Active Photo Preview */}
                      <div className="md:col-span-6 flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-gray-900 relative min-h-[224px]">
                        {photoGallery.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400 bg-gray-900/90">
                            <i className="ri-image-line text-4xl text-gray-600 mb-2"></i>
                            <span className="text-xs font-semibold text-gray-300">Pratinjau Foto Asli</span>
                            <span className="text-[11px] text-gray-500 mt-1 max-w-xs">
                              Pilih atau unggah foto untuk melihat tampilan penuh di sini.
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="relative aspect-video w-full flex-1 overflow-hidden bg-black flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photoGallery[activePhotoIdx]?.src}
                                alt="Preview Foto Asli"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                                className="max-w-full max-h-full object-contain"
                              />
                              {/* Top bar indicators */}
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                                {activePhotoIdx + 1} / {photoGallery.length}
                              </div>

                              {/* Navigation arrows */}
                              {photoGallery.length > 1 && (
                                <div className="absolute top-2 right-2 flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActivePhotoIdx((prev) =>
                                        prev > 0 ? prev - 1 : photoGallery.length - 1
                                      )
                                    }
                                    className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                  >
                                    <i className="ri-arrow-left-s-line text-xs"></i>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActivePhotoIdx((prev) =>
                                        prev < photoGallery.length - 1 ? prev + 1 : 0
                                      )
                                    }
                                    className="w-6 h-6 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                  >
                                    <i className="ri-arrow-right-s-line text-xs"></i>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Bottom info bar */}
                            <div className="p-2.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
                              <div className="truncate max-w-[240px]">
                                <span className="font-bold text-gray-900 block text-[11px] truncate">
                                  {photoGallery[activePhotoIdx]?.name}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {photoGallery[activePhotoIdx]?.date} • {photoGallery[activePhotoIdx]?.size}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setViewingPhotoModal({
                                      isOpen: true,
                                      url: photoGallery[activePhotoIdx]?.src || '',
                                      title: photoGallery[activePhotoIdx]?.name || 'Foto Kegiatan',
                                    })
                                  }
                                  className="w-7 h-7 rounded text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                                  title="Perbesar foto"
                                >
                                  <i className="ri-fullscreen-line text-sm"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFotoKegiatan(activePhotoIdx)}
                                  className="w-7 h-7 rounded text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                                  title="Hapus foto"
                                >
                                  <i className="ri-delete-bin-line text-sm"></i>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dokumen Pendukung Section */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between font-bold text-gray-900 text-xs">
                      <div className="flex items-center gap-2">
                        <i className="ri-file-text-line text-[#055127] text-sm"></i>
                        <span>Dokumen Pendukung</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={docInputRef}
                          type="file"
                          accept=".pdf,.xlsx,.xls,.docx,.doc,.zip,.jpg,.jpeg,.png"
                          multiple
                          onChange={handleUploadSupportingDoc}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => docInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 transition-colors"
                        >
                          <i className="ri-upload-2-line text-sm"></i>
                          Unggah Dokumen
                        </button>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">No</th>
                          <th className="py-2.5 px-3">Nama Dokumen</th>
                          <th className="py-2.5 px-3 w-20">Tipe File</th>
                          <th className="py-2.5 px-3 w-24">Ukuran</th>
                          <th className="py-2.5 px-3 w-36">Tanggal Upload</th>
                          <th className="py-2.5 px-3 text-center w-20">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {supportingDocs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400">
                              <i className="ri-file-upload-line text-2xl text-gray-300 block mb-1"></i>
                              Belum ada dokumen pendukung. Silakan klik tombol{' '}
                              <strong>Unggah Dokumen</strong> untuk menambahkan.
                            </td>
                          </tr>
                        ) : (
                          supportingDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 text-center text-gray-400 font-medium">
                                {doc.no}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-7 h-7 rounded flex items-center justify-center text-sm ${doc.iconBg}`}
                                  >
                                    <i className={doc.icon}></i>
                                  </div>
                                  <span className="font-semibold text-gray-800 text-[11px]">
                                    {doc.nama}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-gray-600 uppercase font-mono text-[11px]">
                                {doc.tipe}
                              </td>
                              <td className="py-2.5 px-3 text-gray-500 text-[11px]">{doc.ukuran}</td>
                              <td className="py-2.5 px-3 text-gray-500 text-[11px]">{doc.tanggal}</td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  {doc.url && (
                                    <a
                                      href={doc.url}
                                      download={doc.nama}
                                      title="Unduh dokumen"
                                      className="w-6 h-6 rounded text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                                    >
                                      <i className="ri-download-line text-xs"></i>
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSupportingDoc(doc.id)}
                                    title="Hapus dokumen"
                                    className="w-6 h-6 rounded text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                                  >
                                    <i className="ri-delete-bin-line text-xs"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2 text-[11px] text-gray-500">
                      <i className="ri-information-line text-gray-400 text-sm"></i>
                      <span>Format yang didukung: PDF, XLSX, DOCX, ZIP, JPG, PNG (maksimal 10 MB per file).</span>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  STEP 5: RINGKASAN PEMERIKSAAN LAHAN (Gabungan Seluruh Step)
                  ------------------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Top 5 Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="ri-map-2-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Luas Lahan</span>
                        <div className="font-extrabold text-gray-900 text-sm">{displayLuasLahan}</div>
                        <span className="text-[9px] text-gray-400 block -mt-0.5">Total diperiksa</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="ri-plant-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Jumlah Tanaman</span>
                        <div className="font-extrabold text-gray-900 text-sm">
                          {jumlahTanamanDiamati.toLocaleString('id-ID')}
                        </div>
                        <span className="text-[9px] text-gray-400 block -mt-0.5">Tanaman diamati</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="ri-checkbox-circle-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Sesuai Varietas</span>
                        <div className="font-extrabold text-emerald-700 text-sm">
                          {tanamanSesuai.toLocaleString('id-ID')}
                        </div>
                        <span className="text-[9px] text-emerald-600 block -mt-0.5">
                          {kemurnianFormatted}% dari total
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="ri-alert-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Tanaman Off Type</span>
                        <div className="font-extrabold text-rose-600 text-sm">{tanamanOffType}</div>
                        <span className="text-[9px] text-rose-500 block -mt-0.5">
                          {offTypePercentFormatted}% dari total
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-xs flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">
                        <i className="ri-award-line"></i>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Status Mutu</span>
                        <div className="font-extrabold text-emerald-700 text-xs truncate">
                          {statusPemeriksaan}
                        </div>
                        <span className="text-[9px] text-gray-400 block -mt-0.5">Standar sertifikasi</span>
                      </div>
                    </div>
                  </div>

                  {/* Split: Komposisi Tanaman Off Type (Left) & Persentase Kemurnian Gauge (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left: Komposisi Tanaman Off Type */}
                    <div className="lg:col-span-7 bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                      <div className="p-3.5 border-b border-gray-100 flex items-center justify-between font-bold text-gray-900 text-xs">
                        <div className="flex items-center gap-2">
                          <i className="ri-pie-chart-line text-[#055127] text-sm"></i>
                          <span>Komposisi Temuan Off Type (Step 3)</span>
                        </div>
                        <span className="text-[10px] font-normal text-gray-500">
                          Total: {tanamanOffType} tanaman
                        </span>
                      </div>

                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                          <tr>
                            <th className="py-2 px-3 w-10 text-center">No</th>
                            <th className="py-2 px-3">Jenis Karakter</th>
                            <th className="py-2 px-3 text-center w-20">Jumlah</th>
                            <th className="py-2 px-3 text-center w-24">Persentase</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {temuanOffTypeList.filter((t) => t.jumlah > 0).length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-4 text-center text-gray-400">
                                Tidak ada temuan off type (0 tanaman)
                              </td>
                            </tr>
                          ) : (
                            temuanOffTypeList
                              .filter((t) => t.jumlah > 0)
                              .map((row, idx) => {
                                const percent =
                                  tanamanOffType > 0
                                    ? ((row.jumlah / tanamanOffType) * 100).toFixed(1).replace('.', ',')
                                    : '0';
                                return (
                                  <tr key={row.id} className="hover:bg-gray-50/50">
                                    <td className="py-2 px-3 text-center text-gray-400">{idx + 1}</td>
                                    <td className="py-2 px-3 font-medium text-gray-800">
                                      {row.jenisKarakter}
                                    </td>
                                    <td className="py-2 px-3 text-center font-bold text-gray-800">
                                      {row.jumlah}
                                    </td>
                                    <td className="py-2 px-3 text-center text-gray-700 font-semibold">
                                      {percent}%
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                        <tfoot className="bg-sky-50/60 font-bold border-t border-sky-100 text-sky-950">
                          <tr>
                            <td colSpan={2} className="py-2 px-3">
                              Total Off Type
                            </td>
                            <td className="py-2 px-3 text-center">{tanamanOffType}</td>
                            <td className="py-2 px-3 text-center">100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Right: Persentase Kemurnian Gauge */}
                    <div className="lg:col-span-5 bg-white rounded-xl p-4 border border-gray-100 shadow-xs flex flex-col justify-center">
                      <span className="text-[11px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                        <i className="ri-donut-chart-line text-[#055127]"></i>
                        Persentase Kemurnian
                      </span>

                      <div className="flex items-center justify-center gap-5">
                        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                          <svg className="w-28 h-28 transform -rotate-90">
                            <circle cx="56" cy="56" r="42" stroke="#fee2e2" strokeWidth="8" fill="transparent" />
                            <circle
                              cx="56"
                              cy="56"
                              r="42"
                              stroke="#059669"
                              strokeWidth="8"
                              strokeDasharray={2 * Math.PI * 42}
                              strokeDashoffset={2 * Math.PI * 42 * (1 - kemurnianVal / 100)}
                              strokeLinecap="round"
                              fill="transparent"
                              className="transition-all duration-700 ease-out"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-gray-900 leading-tight">
                              {kemurnianFormatted}%
                            </span>
                            <span className="text-[9px] text-gray-400">Kemurnian</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                            <div>
                              <span className="font-bold text-gray-800">Sesuai Varietas</span>
                              <span className="text-[10px] text-gray-500 block">
                                {kemurnianFormatted}% ({tanamanSesuai.toLocaleString('id-ID')} tanaman)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                            <div>
                              <span className="font-bold text-gray-800">Off Type</span>
                              <span className="text-[10px] text-gray-500 block">
                                {offTypePercentFormatted}% ({tanamanOffType} tanaman)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Step 2: Parameter Hasil Pemeriksaan */}
                  <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-3.5 border-b border-gray-100 flex items-center justify-between font-bold text-gray-900 text-xs">
                      <div className="flex items-center gap-2">
                        <i className="ri-list-check-2 text-[#055127] text-sm"></i>
                        <span>Ringkasan Parameter Lapangan (Step 2)</span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 text-[11px] font-semibold">
                        <tr>
                          <th className="py-2 px-3 w-10 text-center">No</th>
                          <th className="py-2 px-3">Parameter</th>
                          <th className="py-2 px-3">Hasil Input</th>
                          <th className="py-2 px-3">Standar Varietas</th>
                          <th className="py-2 px-3 text-center w-28">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {hasilPemeriksaanParams.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-400">
                              Tidak ada parameter lapangan yang dipilih
                            </td>
                          </tr>
                        ) : (
                          hasilPemeriksaanParams.map((item, index) => {
                            const val = hasilValues[item.parameterId] ?? '-';
                            const calc = calculateRowStatus(item, val);
                            return (
                              <tr key={item.parameterId} className="hover:bg-gray-50/50">
                                <td className="py-2 px-3 text-center text-gray-400 font-medium">
                                  {index + 1}
                                </td>
                                <td className="py-2 px-3 font-semibold text-gray-800">{item.nama}</td>
                                <td className="py-2 px-3 font-bold text-gray-900">
                                  {val} {item.satuan && !val.includes(item.satuan) ? item.satuan : ''}
                                </td>
                                <td className="py-2 px-3 text-gray-600 font-mono text-[11px]">
                                  {item.standarText}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {calc.status === 'Sesuai' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <i className="ri-check-line text-xs"></i>
                                      Sesuai
                                    </span>
                                  ) : calc.status === 'Tidak Sesuai' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                      <i className="ri-close-line text-xs"></i>
                                      Tidak Sesuai
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                                      -
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary of Documentation & Catatan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-white border border-gray-100 rounded-xl shadow-xs space-y-2">
                      <span className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <i className="ri-folder-upload-line text-[#055127]"></i>
                        Dokumentasi Tersimpan (Step 4)
                      </span>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <i className="ri-image-line text-emerald-600"></i>
                          <span>{photoGallery.length} Foto Kegiatan</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <i className="ri-file-line text-blue-600"></i>
                          <span>{supportingDocs.length} Dokumen Pendukung</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3">
                      <i className="ri-checkbox-circle-fill text-emerald-600 text-lg mt-0.5"></i>
                      <div className="text-xs space-y-1">
                        <span className="font-bold text-emerald-950 block">Catatan Pemeriksaan & Rekomendasi</span>
                        <p className="text-emerald-900 text-[11px] leading-relaxed">
                          {catatan || (
                            <>
                              Tingkat kemurnian <strong>{kemurnianFormatted}%</strong> ({statusPemeriksaan}).{' '}
                              {statusPemeriksaan.includes('Roguing')
                                ? 'Rekomendasi: Segera jadwalkan dan lakukan roguing pada tanaman off type.'
                                : 'Rekomendasi: Tanaman memenuhi standar kemurnian varietas, lanjutkan monitoring rutin.'}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================================================================
                MODAL FOOTER: Navigation buttons (Batal, Sebelumnya, Selanjutnya, Simpan)
                ================================================================ */}
            <div className="px-6 py-3.5 border-t border-gray-100 bg-white flex items-center justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <i className="ri-close-line text-sm"></i>
                Batal
              </button>

              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <i className="ri-arrow-left-line text-sm"></i>
                  Sebelumnya
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 5))}
                  className="px-5 py-2 bg-[#055127] hover:bg-[#04401f] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Selanjutnya</span>
                  <i className="ri-arrow-right-line text-sm"></i>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSimpanPemeriksaan}
                  className="px-6 py-2 bg-[#055127] hover:bg-[#04401f] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {saving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-sm"></i>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line text-sm"></i>
                      <span>Simpan Pemeriksaan</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          PHOTO PREVIEW / LIGHTBOX MODAL (Untuk Temuan Off Type & Foto Kegiatan)
          ================================================================ */}
      {viewingPhotoModal.isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setViewingPhotoModal({ isOpen: false, url: '', title: '' })}
        >
          <div
            className="bg-gray-950 rounded-2xl border border-gray-800 w-full max-w-2xl overflow-hidden flex flex-col text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <i className="ri-image-line text-emerald-400"></i>
                {viewingPhotoModal.title || 'Pratinjau Foto'}
              </h4>
              <button
                type="button"
                onClick={() => setViewingPhotoModal({ isOpen: false, url: '', title: '' })}
                className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewingPhotoModal.url}
                alt={viewingPhotoModal.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            <div className="p-3 bg-gray-900 border-t border-gray-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingPhotoModal({ isOpen: false, url: '', title: '' })}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Katalog Parameter untuk Step 2 (MONITORING_LAHAN) */}
      <ModalKatalogMasterParameter
        isOpen={isParamCatalogOpen}
        onClose={() => setIsParamCatalogOpen(false)}
        namaModul="MONITORING_LAHAN"
        title="Katalog Parameter Monitoring Lahan"
        subtitle="Pilih parameter pengamatan lapangan yang ingin diperiksa pada lahan ini."
        alreadySelectedIds={hasilPemeriksaanParams.map((p) => p.parameterId)}
        onAddParameters={handleAddParamsFromCatalog}
        onOpenCreateNew={() => {
          setIsParamCatalogOpen(false);
          setIsParamCreateModalOpen(true);
        }}
        zIndex="z-[10000]"
      />

      {/* Modal Katalog Master Parameter untuk Step 3 (OFF_TYPE) */}
      <ModalKatalogMasterParameter
        isOpen={isOffTypeCatalogOpen}
        onClose={() => setIsOffTypeCatalogOpen(false)}
        namaModul="OFF_TYPE"
        title="Katalog Temuan Off-Type"
        subtitle="Pilih karakter penyimpangan (off-type) yang diamati di lapangan."
        alreadySelectedIds={temuanOffTypeList.map((t) => t.parameterId || t.jenisKarakter)}
        onAddParameters={handleAddOffTypeFromCatalog}
        onOpenCreateNew={() => {
          setIsOffTypeCatalogOpen(false);
          setIsOffTypeCreateModalOpen(true);
        }}
        zIndex="z-[10000]"
      />

      {/* Modal Buat Master Parameter Baru untuk Monitoring Lahan (Step 2) */}
      <ModalMasterParameterPopup
        isOpen={isParamCreateModalOpen}
        onClose={() => setIsParamCreateModalOpen(false)}
        defaultNamaModul="MONITORING_LAHAN"
        lockNamaModul={true}
        defaultTipeNilai="NUMBER"
        title="Tambah Master Parameter Monitoring Lahan"
        onSuccess={handleCreateParamSuccess}
        zIndex="z-[10001]"
      />

      {/* Modal Buat Master Parameter Baru untuk Temuan Off-Type (Step 3) */}
      <ModalMasterParameterPopup
        isOpen={isOffTypeCreateModalOpen}
        onClose={() => setIsOffTypeCreateModalOpen(false)}
        defaultNamaModul="OFF_TYPE"
        lockNamaModul={true}
        defaultTipeNilai="TEXT"
        title="Tambah Master Parameter Karakter Off-Type"
        onSuccess={handleCreateOffTypeSuccess}
        zIndex="z-[10001]"
      />
    </>
  );
}
