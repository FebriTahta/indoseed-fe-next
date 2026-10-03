"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Seo from '@/shared/layouts-components/seo/seo';
import commodityService from '@/app/services/commodityService';
import varietyService from '@/app/services/varietyService';
import { Commodity } from '@/app/types/commodity';
import {
  VarietyBrand,
  VarietyCharacteristicItem,
  VarietyProductionParam,
  VarietyQCParamItem,
  VarietyPackagingItem,
  VarietyDocItem,
} from '@/app/types/variety';

import ModalTambahMerkVarietas from '../component/ModalTambahMerkVarietas';
import ModalTambahParameterKarakteristik from '../component/ModalTambahParameterKarakteristik';
import ModalTambahParameterQC from '../component/ModalTambahParameterQC';
import ModalTambahKemasan from '../component/ModalTambahKemasan';
import ModalTambahDokumen from '../component/ModalTambahDokumen';
import ModalMasterParameterPopup from '../component/ModalMasterParameterPopup';
import ModalEditNilaiKarakteristik from '../component/ModalEditNilaiKarakteristik';
import parameterService from '@/app/services/parameterService';
import { MasterParameter } from '@/app/types/parameter';
import { parseVarietyData, serializeVarietyMetadata } from '../varietyHelper';

function TambahVarietasForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = Boolean(editId);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    'info' | 'brands' | 'karakteristik' | 'produksi' | 'qc' | 'inventory' | 'dokumen'
  >('info');

  // Loading States
  const [isLoadingMaster, setIsLoadingMaster] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Master Commodities
  const [commodities, setCommodities] = useState<Commodity[]>([]);

  // ===================== Form State - Tab 1: Informasi Benih =====================
  const [kodeVarietas, setKodeVarietas] = useState('ME-01');
  const [commodityId, setCommodityId] = useState('');
  const [kelompokTanaman, setKelompokTanaman] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Tidak Aktif'>('Aktif');
  const [tglMulaiDigunakan, setTglMulaiDigunakan] = useState('2025-01-01');
  const [namaInternal, setNamaInternal] = useState('');
  const [kategoriBenih, setKategoriBenih] = useState('Hibrida');
  const [sumberBenih, setSumberBenih] = useState('Benih Pokok (Foundation Seed)');
  const [deskripsi, setDeskripsi] = useState('');

  // ===================== Form State - Tab 2: Nama / Merk Varietas =====================
  const [brands, setBrands] = useState<VarietyBrand[]>([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<VarietyBrand | null>(null);

  // ===================== Form State - Tab 3: Karakteristik =====================
  const [karakteristikList, setKarakteristikList] = useState<VarietyCharacteristicItem[]>([]);
  const [ketahananPenyakit, setKetahananPenyakit] = useState('');
  const [toleransiCuaca, setToleransiCuaca] = useState('');
  const [catatanKarakteristik, setCatatanKarakteristik] = useState('');
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<VarietyCharacteristicItem | null>(null);
  const [isCharMasterModalOpen, setIsCharMasterModalOpen] = useState(false);
  const [isCharEditModalOpen, setIsCharEditModalOpen] = useState(false);
  const [selectedCharItem, setSelectedCharItem] = useState<VarietyCharacteristicItem | null>(null);

  // ===================== Form State - Tab 4: Produksi =====================
  const [produksiParam, setProduksiParam] = useState<VarietyProductionParam>({
    umurPanen: '65 - 75',
    satuanUmurPanen: 'HST',
    jarakTanam: '60 x 50',
    satuanJarakTanam: 'cm',
    populasiTanaman: '30.000',
    satuanPopulasi: 'tanaman/ha',
    kebutuhanBenih: '0,5 - 1',
    satuanKebutuhanBenih: 'kg/ha',
    musimTanam: 'Keduanya',
    targetProduksi: '500',
    satuanTargetProduksi: 'kg/ha',
    perkiraanHasil: '300 - 500',
    satuanPerkiraanHasil: 'kg/ha',
    tingkatKeberhasilan: '90',
    satuanProduksi: 'Kg',
    jarakIsolasi: '500',
    satuanJarakIsolasi: 'meter',
    sumberBenihAwal: 'Benih Pokok (Foundation Seed)',
    standarProduksi: 'SNI 01-8493-2018',
    catatanProduksi: '',
  });

  // ===================== Form State - Tab 5: QC & Standar =====================
  const [qcStatus, setQcStatus] = useState<'Wajib QC' | 'Tidak Wajib'>('Wajib QC');
  const [qcMetode, setQcMetode] = useState('ISTA - Germination Test');
  const [qcFrekuensi, setQcFrekuensi] = useState('Per Lot');
  const [qcSampling, setQcSampling] = useState('Wajib');
  const [qcMasaBerlaku, setQcMasaBerlaku] = useState('12');
  const [qcParameters, setQcParameters] = useState<VarietyQCParamItem[]>([]);
  const [qcStandarAcuan, setQcStandarAcuan] = useState('Standar Internal Perusahaan');
  const [qcNoDokumen, setQcNoDokumen] = useState('SOP-QC-001');
  const [qcCatatan, setQcCatatan] = useState('Parameter mengikuti standar mutu benih melon perusahaan.');
  const [isQcModalOpen, setIsQcModalOpen] = useState(false);
  const [editingQcParam, setEditingQcParam] = useState<VarietyQCParamItem | null>(null);
  const [isQcMasterModalOpen, setIsQcMasterModalOpen] = useState(false);

  // ===================== Form State - Tab 6: Inventory (Image 2) =====================
  const [invKelolaStok, setInvKelolaStok] = useState<'Ya' | 'Tidak'>('Ya');
  const [invSatuanStok, setInvSatuanStok] = useState('Kg');
  const [invSatuanKemasan, setInvSatuanKemasan] = useState('Sachet');
  const [invKonversiJumlah, setInvKonversiJumlah] = useState('1');
  const [invKonversiSatuanAwal, setInvKonversiSatuanAwal] = useState('Sachet');
  const [invKonversiNilai, setInvKonversiNilai] = useState('10');
  const [invKonversiSatuanAkhir, setInvKonversiSatuanAkhir] = useState('Gram');
  const [invMetodeStok, setInvMetodeStok] = useState('FIFO');
  const [invMinStok, setInvMinStok] = useState('50');
  const [invMaxStok, setInvMaxStok] = useState('500');
  const [invStatus, setInvStatus] = useState('Aktif');
  const [invWajibLot, setInvWajibLot] = useState<'Ya' | 'Tidak'>('Ya');
  const [invWajibTglProduksi, setInvWajibTglProduksi] = useState<'Ya' | 'Tidak'>('Ya');
  const [invWajibTglKadaluarsa, setInvWajibTglKadaluarsa] = useState<'Ya' | 'Tidak'>('Tidak');
  const [invWajibNoSertifikat, setInvWajibNoSertifikat] = useState<'Ya' | 'Tidak'>('Tidak');
  const [invTraceabilityLot, setInvTraceabilityLot] = useState<'Aktif' | 'Tidak Aktif'>('Aktif');
  const [invMasaBerlaku, setInvMasaBerlaku] = useState('12');
  const [invCatatan, setInvCatatan] = useState('');
  const [invKemasanList, setInvKemasanList] = useState<VarietyPackagingItem[]>([
    { id: '1', kemasan: 'Sachet', isi: '10', satuan: 'Gram', status: 'Aktif' },
    { id: '2', kemasan: 'Pack', isi: '100', satuan: 'Gram', status: 'Aktif' },
    { id: '3', kemasan: 'Box', isi: '1', satuan: 'Kg', status: 'Aktif' },
  ]);
  const [isKemasanModalOpen, setIsKemasanModalOpen] = useState(false);
  const [editingKemasan, setEditingKemasan] = useState<VarietyPackagingItem | null>(null);

  // ===================== Form State - Tab 7: Dokumen (Image 3) =====================
  const [documents, setDocuments] = useState<VarietyDocItem[]>([]);


  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Form State - Tambah Dokumen Baru (Image 3 Bottom)
  const [docUploadFile, setDocUploadFile] = useState<File | null>(null);
  const [docJenis, setDocJenis] = useState('Sertifikat Benih');
  const [docNama, setDocNama] = useState('');
  const [docBerlaku, setDocBerlaku] = useState('Semua');
  const [docNomor, setDocNomor] = useState('');
  const [docTanggal, setDocTanggal] = useState('');
  const [docKeterangan, setDocKeterangan] = useState('');
  const [docCatatan, setDocCatatan] = useState('');
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Image Upload State for Main Variety
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const getDefaultValueForType = (mp: MasterParameter): string => {
    if (mp.tipeNilai === 'NUMBER') return mp.batasLulus ? String(mp.batasLulus) : '0';
    if (mp.tipeNilai === 'RANGE') return '15 - 20';
    if (mp.tipeNilai === 'OPTION' && mp.options && mp.options.length > 0) return mp.options[0].nama;
    if (mp.tipeNilai === 'BOOLEAN') return 'Ya';
    return '-';
  };

  // Fetch initial master data & existing variety if edit mode
  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoadingMaster(true);
        const [commRes, varParamRes, qcParamRes] = await Promise.all([
          commodityService.getCommodities({ pageSize: 1000, status: 'Aktif' }),
          parameterService.getParameters({ namaModul: 'VARIETAS', status: 'Aktif', pageSize: 100 }),
          parameterService.getParameters({ namaModul: 'QC', status: 'Aktif', pageSize: 100 }),
        ]);

        if (commRes.status === 'success' && commRes.data) {
          setCommodities(commRes.data);
          if (!isEditMode && commRes.data.length > 0) {
            setCommodityId(commRes.data[0].id);
            setKelompokTanaman(commRes.data[0].kategori || '');
          }
        }

        if (!isEditMode) {
          if (varParamRes.status === 'success' && varParamRes.data && varParamRes.data.length > 0) {
            setKarakteristikList(
              varParamRes.data.map((mp: MasterParameter, idx: number) => ({
                id: mp.id || String(idx + 1),
                parameterId: mp.id,
                kode: mp.kode,
                parameter: mp.nama,
                tipeNilai: mp.tipeNilai,
                nilai: getDefaultValueForType(mp),
                satuan: mp.satuan || '-',
                keterangan: mp.deskripsi || '-',
                isUsed: true,
                options: mp.options || [],
              }))
            );
          }
          if (qcParamRes.status === 'success' && qcParamRes.data && qcParamRes.data.length > 0) {
            setQcParameters(
              qcParamRes.data.map((mp: MasterParameter, idx: number) => ({
                id: mp.id || String(idx + 1),
                parameterId: mp.id,
                kode: mp.kode,
                parameter: mp.nama,
                tipeNilai: mp.tipeNilai,
                nilaiMinimal: mp.batasLulus ? String(mp.batasLulus) : '-',
                nilaiMaksimal: '-',
                satuan: mp.satuan || '%',
                keterangan: mp.deskripsi || 'Standar Mutu',
                isUsed: true,
              }))
            );
          }
        }

        if (editId) {
          const varRes = await varietyService.getVarietyDetail(editId);
          if (varRes.status === 'success' && varRes.data) {
            const v = parseVarietyData(varRes.data);
            setKodeVarietas(v.kodeVarietas || '');
            setCommodityId(v.commodityId || '');
            setKelompokTanaman(v.commodity?.kategori || '');
            setStatus(v.status || 'Aktif');
            setDeskripsi(v.deskripsi || '');
            setPreviewUrl(v.image || '');
            if (v.brands && v.brands.length > 0) setBrands(v.brands);
            if (v.tglMulaiDigunakan) setTglMulaiDigunakan(v.tglMulaiDigunakan);
            if (v.namaInternal) setNamaInternal(v.namaInternal);
            if (v.kategoriBenih) setKategoriBenih(v.kategoriBenih);
            if (v.sumberBenih) setSumberBenih(v.sumberBenih);
            if (v.karakteristikList) {
              setKarakteristikList(
                v.karakteristikList.map((k) => ({
                  ...k,
                  isUsed: k.isUsed !== false,
                }))
              );
            }
            if (v.ketahananPenyakit) setKetahananPenyakit(v.ketahananPenyakit);
            if (v.toleransiCuaca) setToleransiCuaca(v.toleransiCuaca);
            if (v.catatanKarakteristik) setCatatanKarakteristik(v.catatanKarakteristik);
            if (v.produksiParam) setProduksiParam(v.produksiParam);

            // Load QC
            if (v.qcConfig) {
              if (v.qcConfig.statusQc) setQcStatus(v.qcConfig.statusQc);
              if (v.qcConfig.metodePengujian) setQcMetode(v.qcConfig.metodePengujian);
              if (v.qcConfig.frekuensiPengujian) setQcFrekuensi(v.qcConfig.frekuensiPengujian);
              if (v.qcConfig.sampling) setQcSampling(v.qcConfig.sampling);
              if (v.qcConfig.masaBerlakuHasilUji) setQcMasaBerlaku(v.qcConfig.masaBerlakuHasilUji);
              if (v.qcConfig.parameters) {
                setQcParameters(
                  v.qcConfig.parameters.map((p) => ({
                    ...p,
                    isUsed: p.isUsed !== false,
                  }))
                );
              }
              if (v.qcConfig.standarAcuan) setQcStandarAcuan(v.qcConfig.standarAcuan);
              if (v.qcConfig.noDokumenReferensi) setQcNoDokumen(v.qcConfig.noDokumenReferensi);
              if (v.qcConfig.catatanQc) setQcCatatan(v.qcConfig.catatanQc);
            }

            // Load Inventory
            if (v.inventoryConfig) {
              if (v.inventoryConfig.kelolaStok) setInvKelolaStok(v.inventoryConfig.kelolaStok);
              if (v.inventoryConfig.satuanStok) setInvSatuanStok(v.inventoryConfig.satuanStok);
              if (v.inventoryConfig.satuanKemasan) setInvSatuanKemasan(v.inventoryConfig.satuanKemasan);
              if (v.inventoryConfig.konversiJumlah) setInvKonversiJumlah(v.inventoryConfig.konversiJumlah);
              if (v.inventoryConfig.konversiSatuanAwal) setInvKonversiSatuanAwal(v.inventoryConfig.konversiSatuanAwal);
              if (v.inventoryConfig.konversiNilai) setInvKonversiNilai(v.inventoryConfig.konversiNilai);
              if (v.inventoryConfig.konversiSatuanAkhir) setInvKonversiSatuanAkhir(v.inventoryConfig.konversiSatuanAkhir);
              if (v.inventoryConfig.metodeStok) setInvMetodeStok(v.inventoryConfig.metodeStok);
              if (v.inventoryConfig.minimumStok) setInvMinStok(v.inventoryConfig.minimumStok);
              if (v.inventoryConfig.maksimumStok) setInvMaxStok(v.inventoryConfig.maksimumStok);
              if (v.inventoryConfig.statusInventory) setInvStatus(v.inventoryConfig.statusInventory);
              if (v.inventoryConfig.wajibNomorLot) setInvWajibLot(v.inventoryConfig.wajibNomorLot);
              if (v.inventoryConfig.wajibTanggalProduksi) setInvWajibTglProduksi(v.inventoryConfig.wajibTanggalProduksi);
              if (v.inventoryConfig.wajibTanggalKadaluarsa) setInvWajibTglKadaluarsa(v.inventoryConfig.wajibTanggalKadaluarsa);
              if (v.inventoryConfig.wajibNomorSertifikat) setInvWajibNoSertifikat(v.inventoryConfig.wajibNomorSertifikat);
              if (v.inventoryConfig.traceabilityLot) setInvTraceabilityLot(v.inventoryConfig.traceabilityLot);
              if (v.inventoryConfig.masaBerlakuHasilUji) setInvMasaBerlaku(v.inventoryConfig.masaBerlakuHasilUji);
              if (v.inventoryConfig.catatan) setInvCatatan(v.inventoryConfig.catatan);
              if (v.inventoryConfig.kemasanList) setInvKemasanList(v.inventoryConfig.kemasanList);
            }

            // Load Documents
            if (v.documents && v.documents.length > 0) {
              setDocuments(v.documents);
            }
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        toast.error('Gagal memuat data master varietas');
      } finally {
        setIsLoadingMaster(false);
      }
    };

    initData();
  }, [editId, isEditMode]);

  // Selected Commodity Object
  const selectedCommodity = useMemo(() => {
    return commodities.find((c) => c.id === commodityId);
  }, [commodities, commodityId]);

  const handleCommodityChange = (newCommId: string) => {
    setCommodityId(newCommId);
    const comm = commodities.find((c) => c.id === newCommId);
    if (comm && comm.kategori) {
      setKelompokTanaman(comm.kategori);
    }
  };

  // ==================== Brands Handlers ====================
  const handleOpenAddBrand = () => {
    setEditingBrand(null);
    setIsBrandModalOpen(true);
  };

  const handleOpenEditBrand = (brand: VarietyBrand) => {
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = (brand: VarietyBrand) => {
    if (editingBrand) {
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? brand : b)));
      toast.success('Nama / merk berhasil diperbarui');
    } else {
      setBrands((prev) => [...prev, brand]);
      toast.success('Nama / merk berhasil ditambahkan');
    }
  };

  const handleDeleteBrand = (brandId: string) => {
    if (brands.length <= 1) {
      toast.warning('Setidaknya harus ada 1 nama/merk varietas');
      return;
    }
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    toast.info('Nama / merk dihapus dari daftar');
  };

  // ==================== Characteristic Handlers ====================
  const handleToggleCharUsed = (id: string) => {
    setKarakteristikList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isUsed: c.isUsed === false ? true : false } : c))
    );
  };

  const handleOpenEditChar = (item: VarietyCharacteristicItem) => {
    setSelectedCharItem(item);
    setIsCharEditModalOpen(true);
  };

  const handleSaveEditChar = (updatedItem: VarietyCharacteristicItem) => {
    setKarakteristikList((prev) =>
      prev.map((c) => (c.id === updatedItem.id ? updatedItem : c))
    );
    toast.success('Nilai standart karakteristik diperbarui');
  };

  const handleCharMasterSuccess = (newParam: MasterParameter) => {
    const newItem: VarietyCharacteristicItem = {
      id: newParam.id || String(Date.now()),
      parameterId: newParam.id,
      kode: newParam.kode,
      parameter: newParam.nama,
      tipeNilai: newParam.tipeNilai,
      nilai: getDefaultValueForType(newParam),
      satuan: newParam.satuan || '-',
      keterangan: newParam.deskripsi || '-',
      isUsed: true,
      options: newParam.options || [],
    };
    setKarakteristikList((prev) => [...prev, newItem]);
    toast.success(`Parameter '${newParam.nama}' ditambahkan ke Master Parameter & Varietas`);
  };

  // ==================== QC Parameter Handlers ====================
  const handleToggleQcUsed = (id: string) => {
    setQcParameters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isUsed: p.isUsed === false ? true : false } : p))
    );
  };

  const handleOpenEditQcParam = (item: VarietyQCParamItem) => {
    setEditingQcParam(item);
    setIsQcModalOpen(true);
  };

  const handleSaveQcParam = (item: VarietyQCParamItem) => {
    setQcParameters((prev) => prev.map((p) => (p.id === item.id ? item : p)));
    toast.success('Parameter mutu QC diperbarui');
  };

  const handleQcMasterSuccess = (newParam: MasterParameter) => {
    const newQc: VarietyQCParamItem = {
      id: newParam.id || String(Date.now()),
      parameterId: newParam.id,
      kode: newParam.kode,
      parameter: newParam.nama,
      tipeNilai: newParam.tipeNilai,
      nilaiMinimal: newParam.batasLulus ? String(newParam.batasLulus) : '-',
      nilaiMaksimal: '-',
      satuan: newParam.satuan || '%',
      keterangan: newParam.deskripsi || 'Standar Mutu',
      isUsed: true,
    };
    setQcParameters((prev) => [...prev, newQc]);
    toast.success(`Parameter QC '${newParam.nama}' ditambahkan ke Master Parameter & QC Varietas`);
  };

  const handleSaveDocFromModal = (newDoc: VarietyDocItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // ==================== Kemasan Handlers ====================
  const handleOpenAddKemasan = () => {
    setEditingKemasan(null);
    setIsKemasanModalOpen(true);
  };

  const handleOpenEditKemasan = (item: VarietyPackagingItem) => {
    setEditingKemasan(item);
    setIsKemasanModalOpen(true);
  };

  const handleSaveKemasan = (item: VarietyPackagingItem) => {
    if (editingKemasan) {
      setInvKemasanList((prev) => prev.map((k) => (k.id === item.id ? item : k)));
      toast.success('Kemasan diperbarui');
    } else {
      setInvKemasanList((prev) => [...prev, item]);
      toast.success('Kemasan ditambahkan');
    }
  };

  const handleDeleteKemasan = (id: string) => {
    setInvKemasanList((prev) => prev.filter((k) => k.id !== id));
    toast.info('Kemasan dihapus');
  };

  // ==================== Document Upload Handlers ====================
  const handleDocFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file melebihi 10MB!');
      return;
    }
    setDocUploadFile(file);
    if (!docNama) {
      setDocNama(file.name.replace(/\.[^/.]+$/, ''));
    }
    toast.info(`File ${file.name} dipilih`);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNama.trim()) {
      toast.error('Nama dokumen harus diisi');
      return;
    }

    const newDoc: VarietyDocItem = {
      id: String(Date.now()),
      namaDokumen: docNama.trim(),
      jenisDokumen: docJenis,
      berlakuUntuk: docBerlaku,
      nomorDokumen: docNomor.trim() || `DOC-00${documents.length + 1}/${kodeVarietas}/2026`,
      tanggalDokumen: docTanggal ? new Date(docTanggal).toLocaleDateString('id-ID') : '23/09/2026',
      fileName: docUploadFile ? docUploadFile.name : `${docNama.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      fileSize: docUploadFile ? `${(docUploadFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      fileType: 'pdf',
      keterangan: docKeterangan,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    toast.success('Dokumen baru berhasil ditambahkan');

    // Reset Form
    setDocNama('');
    setDocNomor('');
    setDocTanggal('');
    setDocKeterangan('');
    setDocUploadFile(null);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    toast.info('Dokumen dihapus');
  };

  // Badge helpers for documents
  const getDocBadgeColor = (jenis: string) => {
    switch (jenis) {
      case 'Sertifikat Benih':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Spesifikasi Teknis':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Dokumen Sumber Benih':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Dokumen Legal':
      case 'Dokumen Legal / Registrasi':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBerlakuBadgeColor = (berlaku: string) => {
    if (berlaku === 'Semua') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (berlaku === 'Tere') return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  // ==================== Submit Master Varietas ====================
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!kodeVarietas.trim()) {
      toast.error('Kode benih harus diisi');
      setActiveTab('info');
      return;
    }
    if (!commodityId) {
      toast.error('Komoditas harus dipilih');
      setActiveTab('info');
      return;
    }
    if (brands.length === 0) {
      toast.error('Setidaknya masukkan 1 nama/merk varietas');
      setActiveTab('brands');
      return;
    }

    setIsSubmitLoading(true);
    try {
      const primaryBrandName = brands.map((b) => b.namaMerk).join(', ');

      const serializedMeta = serializeVarietyMetadata({
        deskripsiText: deskripsi,
        brands,
        kategoriBenih,
        sumberBenih,
        namaInternal,
        tglMulaiDigunakan,
        karakteristikList,
        ketahananPenyakit,
        toleransiCuaca,
        catatanKarakteristik,
        produksiParam,
        qcConfig: {
          statusQc: qcStatus,
          metodePengujian: qcMetode,
          frekuensiPengujian: qcFrekuensi,
          sampling: qcSampling,
          masaBerlakuHasilUji: qcMasaBerlaku,
          parameters: qcParameters,
          standarAcuan: qcStandarAcuan,
          noDokumenReferensi: qcNoDokumen,
          catatanQc: qcCatatan,
        },
        inventoryConfig: {
          kelolaStok: invKelolaStok,
          satuanStok: invSatuanStok,
          satuanKemasan: invSatuanKemasan,
          konversiJumlah: invKonversiJumlah,
          konversiSatuanAwal: invKonversiSatuanAwal,
          konversiNilai: invKonversiNilai,
          konversiSatuanAkhir: invKonversiSatuanAkhir,
          metodeStok: invMetodeStok,
          minimumStok: invMinStok,
          maksimumStok: invMaxStok,
          statusInventory: invStatus,
          wajibNomorLot: invWajibLot,
          wajibTanggalProduksi: invWajibTglProduksi,
          wajibTanggalKadaluarsa: invWajibTglKadaluarsa,
          wajibNomorSertifikat: invWajibNoSertifikat,
          traceabilityLot: invTraceabilityLot,
          masaBerlakuHasilUji: invMasaBerlaku,
          catatan: invCatatan,
          kemasanList: invKemasanList,
        },
        documents,
      });

      const formData = new FormData();
      formData.append('kodeVarietas', kodeVarietas.trim());
      formData.append('namaVarietas', primaryBrandName);
      formData.append('commodityId', commodityId);
      formData.append('asalPemulia', sumberBenih);
      formData.append('deskripsi', serializedMeta);
      formData.append('status', status);

      const umurPanenItem = karakteristikList.find((k) => k.parameter.toLowerCase().includes('umur'));
      if (umurPanenItem) formData.append('umurTanam', `${umurPanenItem.nilai} ${umurPanenItem.satuan}`);

      const potensiItem = karakteristikList.find((k) => k.parameter.toLowerCase().includes('potensi'));
      if (potensiItem) formData.append('potensiHasil', `${potensiItem.nilai} ${potensiItem.satuan}`);

      const bentukItem = karakteristikList.find((k) => k.parameter.toLowerCase().includes('bentuk'));
      if (bentukItem) formData.append('bentukBiji', bentukItem.nilai);

      const warnaItem = karakteristikList.find((k) => k.parameter.toLowerCase().includes('kulit'));
      if (warnaItem) formData.append('warnaGabah', warnaItem.nilai);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      let res;
      if (isEditMode && editId) {
        res = await varietyService.updateVariety(editId, formData);
      } else {
        res = await varietyService.createVariety(formData);
      }

      if (res.status === 'error') {
        throw new Error(res.message || 'Gagal menyimpan varietas');
      }

      toast.success(
        isEditMode
          ? 'Data varietas / kode benih berhasil diperbarui!'
          : 'Varietas / kode benih baru berhasil disimpan!'
      );

      setTimeout(() => {
        router.push('/master/varietas');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const navTabs = [
    { id: 'info', label: 'Informasi Benih', icon: 'ri-leaf-line' },
    { id: 'brands', label: 'Nama / Merk Varietas', icon: 'ri-price-tag-3-line' },
    { id: 'karakteristik', label: 'Karakteristik', icon: 'ri-list-check-2' },
    { id: 'produksi', label: 'Produksi', icon: 'ri-seedling-line' },
    { id: 'qc', label: 'QC & Standar', icon: 'ri-shield-check-line' },
    { id: 'inventory', label: 'Inventory', icon: 'ri-archive-line' },
    { id: 'dokumen', label: 'Dokumen', icon: 'ri-file-text-line' },
  ];

  return (
    <div className="pb-12">
      <Seo
        title={`${isEditMode ? 'Edit' : 'Tambah'
          } Varietas / Kode Benih - Master Data`}
      />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 mb-2 font-medium">
        <Link href="/master/varietas" className="hover:text-gray-700">
          Master Data
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <Link href="/master/varietas" className="hover:text-gray-700">
          Varietas / Kode Benih
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <span className="text-emerald-700 font-semibold">
          {isEditMode ? 'Edit Varietas / Kode Benih' : 'Tambah Varietas / Kode Benih'}
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-200/80 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/master/varietas')}
            className="w-10 h-10 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 flex items-center justify-center text-lg transition-colors flex-shrink-0"
            title="Kembali ke Daftar Varietas"
          >
            <i className="ri-arrow-left-line"></i>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {isEditMode ? 'Edit Varietas / Kode Benih' : 'Tambah Varietas / Kode Benih'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Lengkapi informasi kode benih, nama/merk varietas, komoditas, dan informasi pendukung lainnya.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => router.push('/master/varietas')}
            className="px-4 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <i className="ri-close-line text-sm"></i>
            <span>Batal</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isSubmitLoading}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
          >
            {isSubmitLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <i className="ri-save-line text-sm"></i>
            )}
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Full Width, No Sidebar as requested) */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs p-1.5 mb-6 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${isActive
                    ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <i className={`${tab.icon} text-sm ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}></i>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT (FULL WIDTH - SIDEBAR KANAN DIHILANGKAN SESUAI INSTRUKSI) */}
      <div className="space-y-6">
        {/* ======================= TAB 1: INFORMASI BENIH ======================= */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Sub-card 1: Informasi Kode Benih */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                  <i className="ri-leaf-line"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Informasi Kode Benih</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9.5">
                Data identitas utama kode benih yang akan digunakan pada sistem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Kode Benih */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Kode Benih <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={kodeVarietas}
                    onChange={(e) => setKodeVarietas(e.target.value)}
                    placeholder="ME-01"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl font-mono text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                  <span className="block text-[11px] text-gray-400 mt-1">
                    Kode unik untuk identitas benih
                  </span>
                </div>

                {/* Komoditas */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Komoditas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={commodityId}
                      onChange={(e) => handleCommodityChange(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="" disabled>
                        Pilih Komoditas
                      </option>
                      {commodities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.namaKomoditas}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Kelompok Tanaman (Read-only, dari Master Komoditas) */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Kelompok Tanaman <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={kelompokTanaman || selectedCommodity?.kategori || '-'}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-gray-100/70 border border-gray-200 rounded-xl text-xs text-gray-700 cursor-not-allowed font-medium focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" title="Diambil otomatis dari master komoditas">
                      <i className="ri-lock-line"></i>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Otomatis diambil dari referensi Master Komoditas.
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Tanggal Mulai Digunakan */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Tanggal Mulai Digunakan
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tglMulaiDigunakan}
                      onChange={(e) => setTglMulaiDigunakan(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Nama Internal / Nama Teknis */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-gray-700">
                      Nama Internal / Nama Teknis
                    </label>
                    <span className="text-[11px] text-gray-400 font-normal">(Opsional)</span>
                  </div>
                  <input
                    type="text"
                    value={namaInternal}
                    onChange={(e) => setNamaInternal(e.target.value)}
                    placeholder="Contoh: Melon Export 01"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Sub-card 2: Informasi Kategori Benih */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                  <i className="ri-shield-keyhole-line"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Informasi Kategori Benih</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9.5">
                Lengkapi kategori dan sumber benih sesuai dengan jenisnya.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Kategori Benih */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Kategori Benih <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={kategoriBenih}
                      onChange={(e) => setKategoriBenih(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Hibrida">Hibrida</option>
                      <option value="Bersari Bebas (OP)">Bersari Bebas (OP)</option>
                      <option value="Inbrida">Inbrida</option>
                      <option value="Komposit">Komposit</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Sumber Benih */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Sumber Benih <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={sumberBenih}
                      onChange={(e) => setSumberBenih(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Benih Pokok (Foundation Seed)">Benih Pokok (Foundation Seed)</option>
                      <option value="Benih Penjenis (Breeder Seed)">Benih Penjenis (Breeder Seed)</option>
                      <option value="Benih Dasar (Basic Seed)">Benih Dasar (Basic Seed)</option>
                      <option value="Benih Sebar (Extension Seed)">Benih Sebar (Extension Seed)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-gray-700">Deskripsi</label>
                    <span className="text-[11px] text-gray-400">{deskripsi.length}/500</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Masukkan deskripsi singkat mengenai kode benih..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Sub-card 3: Nama / Merk Varietas Terkait */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                    <i className="ri-price-tag-3-line"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Nama / Merk Varietas Terkait</h3>
                    <p className="text-xs text-gray-500">
                      Satu kode benih dapat digunakan untuk beberapa nama/merk varietas.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('brands')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  <i className="ri-add-line font-bold"></i>
                  <span>Lihat / Kelola Nama / Merk</span>
                </button>
              </div>

              {/* Alert Info */}
              <div className="p-3 mb-4 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center gap-2.5 text-xs text-blue-800">
                <i className="ri-information-line text-base text-blue-600 flex-shrink-0"></i>
                <span>
                  Kode benih ini dapat digunakan untuk beberapa nama/merk varietas dengan karakteristik yang sama.
                </span>
              </div>

              {/* Mini Table */}
              <div className="overflow-x-auto border border-gray-200/70 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70">
                    <tr>
                      <th className="py-2.5 px-3.5 w-12 text-center">No</th>
                      <th className="py-2.5 px-3.5">Nama / Merk</th>
                      <th className="py-2.5 px-3.5">Tipe</th>
                      <th className="py-2.5 px-3.5 text-center">Status</th>
                      <th className="py-2.5 px-3.5">Keterangan</th>
                      <th className="py-2.5 px-3.5 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {brands.map((brand, idx) => (
                      <tr key={brand.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 px-3.5 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-2.5 px-3.5 font-semibold text-gray-900">{brand.namaMerk}</td>
                        <td className="py-2.5 px-3.5 text-gray-600">{brand.tipe}</td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${brand.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${brand.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                            ></span>
                            {brand.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-gray-500">{brand.keterangan || '-'}</td>
                        <td className="py-2.5 px-3.5 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditBrand(brand)}
                              className="w-7 h-7 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                              title="Edit"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBrand(brand.id)}
                              className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                              title="Hapus"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: NAMA / MERK VARIETAS (Image 3) ======================= */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            {/* Top Card: Ringkasan Kode Benih */}
            <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-3">
                <i className="ri-seedling-line text-emerald-600 text-base"></i>
                <h4 className="text-xs font-bold text-gray-900">Ringkasan Kode Benih</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Kode Benih</span>
                  <span className="font-mono font-bold text-gray-900 text-sm">{kodeVarietas}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Komoditas</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCommodity?.namaKomoditas || 'Melon'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Kelompok Tanaman</span>
                  <span className="font-medium text-gray-700">{kelompokTanaman}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                    ></span>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Section: Daftar Nama / Merk Varietas */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                    <i className="ri-plant-line"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Daftar Nama / Merk Varietas</h3>
                    <p className="text-xs text-gray-500">
                      Kelola nama/merk varietas yang terkait dengan kode benih ini.
                    </p>
                  </div>
                </div>

                {/* Button: + Tambah Nama / Merk (Opens POPUP Modal!) */}
                <button
                  type="button"
                  onClick={handleOpenAddBrand}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all"
                >
                  <i className="ri-add-line font-bold text-sm"></i>
                  <span>Tambah Nama / Merk</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-gray-200/70 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70">
                    <tr>
                      <th className="py-3 px-3.5 w-12 text-center">No</th>
                      <th className="py-3 px-3.5">Nama / Merk</th>
                      <th className="py-3 px-3.5">Tipe</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3.5">Keterangan</th>
                      <th className="py-3 px-3.5 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {brands.map((brand, idx) => (
                      <tr key={brand.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-3.5 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-3 px-3.5 font-semibold text-gray-900">{brand.namaMerk}</td>
                        <td className="py-3 px-3.5 text-gray-600">{brand.tipe}</td>
                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${brand.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${brand.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                            ></span>
                            {brand.status}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-gray-500">{brand.keterangan || '-'}</td>
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditBrand(brand)}
                              className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                            >
                              <i className="ri-edit-line text-xs"></i>
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBrand(brand.id)}
                              className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                              title="Hapus"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 3: KARAKTERISTIK ======================= */}
        {activeTab === 'karakteristik' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                  <i className="ri-list-check-2"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Karakteristik</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9.5">
                Masukkan karakteristik berdasarkan komoditas yang dipilih. Parameter dapat disesuaikan dengan kebutuhan.
              </p>

              {/* Komoditas Selection (Read-Only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-6">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5 text-xs">
                    Komoditas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={selectedCommodity?.namaKomoditas || 'Melon'}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-gray-100/70 border border-gray-200 rounded-xl text-xs text-gray-700 font-semibold cursor-not-allowed focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" title="Terkunci sesuai tab Informasi Benih">
                      <i className="ri-lock-line"></i>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Komoditas terkunci otomatis sesuai yang dipilih pada Tab Informasi Benih.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center gap-2.5 text-xs text-blue-800">
                  <i className="ri-information-line text-base text-blue-600 flex-shrink-0"></i>
                  <span>
                    Parameter karakteristik diambil dari Master Parameter modul VARIETAS. Gunakan tombol &quot;Tambah Parameter Lainnya&quot; untuk menambahkan definisi baru ke Master Parameter.
                  </span>
                </div>
              </div>

              {/* Table Karakteristik */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-plant-line text-emerald-600 text-sm"></i>
                  <h4 className="text-xs font-bold text-gray-900">
                    Karakteristik Berdasarkan Komoditas ({selectedCommodity?.namaKomoditas || 'Melon'})
                  </h4>
                </div>

                <div className="overflow-x-auto border border-gray-200/70 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70">
                      <tr>
                        <th className="py-3 px-3.5 w-12 text-center">No</th>
                        <th className="py-3 px-3.5">Parameter</th>
                        <th className="py-3 px-3.5">Nilai Standart</th>
                        <th className="py-3 px-3.5">Satuan</th>
                        <th className="py-3 px-3.5">Keterangan</th>
                        <th className="py-3 px-3.5 text-center">Status</th>
                        <th className="py-3 px-3.5 text-center w-20">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {karakteristikList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-gray-400">
                            Belum ada parameter karakteristik modul VARIETAS. Klik tombol di bawah untuk menambahkan.
                          </td>
                        </tr>
                      ) : (
                        karakteristikList.map((item, idx) => (
                          <tr
                            key={item.id}
                            className={`transition-colors ${item.isUsed !== false ? 'hover:bg-gray-50/60' : 'bg-gray-50/40 text-gray-400'
                              }`}
                          >
                            <td className="py-3 px-3.5 text-center text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-3.5 font-semibold text-gray-900">
                              <div className="flex items-center gap-1.5">
                                <i className="ri-checkbox-blank-circle-line text-emerald-600 text-xs"></i>
                                <span>{item.parameter}</span>
                                {item.kode && (
                                  <span className="text-[10px] font-mono text-gray-400 font-normal">({item.kode})</span>
                                )}
                              </div>
                              {item.tipeNilai && (
                                <span className="inline-block mt-0.5 ml-4 px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                                  {item.tipeNilai}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3.5 font-semibold text-gray-800">{item.nilai || '-'}</td>
                            <td className="py-3 px-3.5 text-gray-600">{item.satuan}</td>
                            <td className="py-3 px-3.5 text-gray-500">{item.keterangan || '-'}</td>
                            <td className="py-3 px-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleCharUsed(item.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${item.isUsed !== false
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                  }`}
                                title="Klik untuk toggle flag Dipakai / Tidak Dipakai"
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${item.isUsed !== false ? 'bg-emerald-500' : 'bg-gray-400'
                                    }`}
                                ></span>
                                <span>{item.isUsed !== false ? 'Dipakai' : 'Tidak Dipakai'}</span>
                              </button>
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleOpenEditChar(item)}
                                className="w-7 h-7 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors mx-auto"
                                title="Edit Nilai Standart"
                              >
                                <i className="ri-edit-line text-sm"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Button: + Tambah Parameter Lainnya */}
                <button
                  type="button"
                  onClick={() => setIsCharMasterModalOpen(true)}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  <i className="ri-add-line font-bold"></i>
                  <span>Tambah Parameter Lainnya</span>
                </button>
              </div>

              {/* Karakteristik Tambahan */}
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <i className="ri-shield-cross-line text-emerald-600 text-sm"></i>
                  <h4 className="text-xs font-bold text-gray-900">Karakteristik Tambahan</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Ketahanan Penyakit
                    </label>
                    <input
                      type="text"
                      value={ketahananPenyakit}
                      onChange={(e) => setKetahananPenyakit(e.target.value)}
                      placeholder="Contoh: Fusarium, Virus Kuning, Antraknosa..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1.5">
                      Toleransi Cuaca
                    </label>
                    <input
                      type="text"
                      value={toleransiCuaca}
                      onChange={(e) => setToleransiCuaca(e.target.value)}
                      placeholder="Contoh: Panas, Hujan, Kering..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-semibold text-gray-700">Catatan Karakteristik</label>
                      <span className="text-[11px] text-gray-400">{catatanKarakteristik.length}/500</span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={catatanKarakteristik}
                      onChange={(e) => setCatatanKarakteristik(e.target.value)}
                      placeholder="Masukkan catatan tambahan karakteristik..."
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: PRODUKSI ======================= */}
        {activeTab === 'produksi' && (
          <div className="space-y-6">
            {/* Section 1: Parameter Budidaya */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                  <i className="ri-plant-line"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Parameter Budidaya</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9.5">
                Parameter budidaya yang berlaku untuk kode benih ini.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Umur Panen */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Umur Panen <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.umurPanen}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, umurPanen: e.target.value }))
                      }
                      placeholder="65 - 75"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <select
                      value={produksiParam.satuanUmurPanen}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, satuanUmurPanen: e.target.value }))
                      }
                      className="bg-gray-50 text-gray-600 px-3 py-2.5 text-xs border-l border-gray-200 focus:outline-none cursor-pointer"
                    >
                      <option value="HST">HST</option>
                      <option value="Hari">Hari</option>
                    </select>
                  </div>
                </div>

                {/* Jarak Tanam */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Jarak Tanam <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.jarakTanam}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, jarakTanam: e.target.value }))
                      }
                      placeholder="60 x 50"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <select
                      value={produksiParam.satuanJarakTanam}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, satuanJarakTanam: e.target.value }))
                      }
                      className="bg-gray-50 text-gray-600 px-3 py-2.5 text-xs border-l border-gray-200 focus:outline-none cursor-pointer"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                    </select>
                  </div>
                </div>

                {/* Populasi Tanaman */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Populasi Tanaman <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.populasiTanaman}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, populasiTanaman: e.target.value }))
                      }
                      placeholder="30.000"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      tanaman/ha
                    </span>
                  </div>
                </div>

                {/* Kebutuhan Benih */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Kebutuhan Benih <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.kebutuhanBenih}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, kebutuhanBenih: e.target.value }))
                      }
                      placeholder="0,5 - 1"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      kg/ha
                    </span>
                  </div>
                </div>

                {/* Musim Tanam */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Musim Tanam <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={produksiParam.musimTanam}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, musimTanam: e.target.value }))
                      }
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Keduanya">Keduanya</option>
                      <option value="Kemarau">Kemarau</option>
                      <option value="Penghujan">Penghujan</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Parameter Produksi Benih */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                  <i className="ri-speed-up-line"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Parameter Produksi Benih</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9.5">
                Informasi target dan hasil produksi benih.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Target Produksi Benih */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Target Produksi Benih <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.targetProduksi}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, targetProduksi: e.target.value }))
                      }
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      kg/ha
                    </span>
                  </div>
                </div>

                {/* Perkiraan Hasil Benih */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Perkiraan Hasil Benih
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.perkiraanHasil}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, perkiraanHasil: e.target.value }))
                      }
                      placeholder="300 - 500"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      kg/ha
                    </span>
                  </div>
                </div>

                {/* Tingkat Keberhasilan Produksi */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <label className="font-semibold text-gray-700">Tingkat Keberhasilan Produksi</label>
                    <i className="ri-information-line text-gray-400 text-xs" title="Persentase keberhasilan"></i>
                  </div>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.tingkatKeberhasilan}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({
                          ...prev,
                          tingkatKeberhasilan: e.target.value,
                        }))
                      }
                      placeholder="90"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      %
                    </span>
                  </div>
                </div>

                {/* Satuan Produksi */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Satuan Produksi
                  </label>
                  <div className="relative">
                    <select
                      value={produksiParam.satuanProduksi}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, satuanProduksi: e.target.value }))
                      }
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Gram">Gram</option>
                      <option value="Ton">Ton</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Persyaratan Produksi */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
                  <i className="ri-checkbox-circle-line"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Persyaratan Produksi</h3>
              </div>
              <p className="text-xs text-gray-500 mb-5 ml-9.5">
                Persyaratan yang harus dipenuhi dalam produksi benih.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Jarak Isolasi */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Jarak Isolasi <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="text"
                      value={produksiParam.jarakIsolasi}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, jarakIsolasi: e.target.value }))
                      }
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <select
                      value={produksiParam.satuanJarakIsolasi}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({
                          ...prev,
                          satuanJarakIsolasi: e.target.value,
                        }))
                      }
                      className="bg-gray-50 text-gray-600 px-3 py-2.5 text-xs border-l border-gray-200 focus:outline-none cursor-pointer"
                    >
                      <option value="meter">meter</option>
                      <option value="km">km</option>
                    </select>
                  </div>
                </div>

                {/* Sumber Benih Awal */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Sumber Benih Awal <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={produksiParam.sumberBenihAwal}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, sumberBenihAwal: e.target.value }))
                      }
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Benih Pokok (Foundation Seed)">Benih Pokok (Foundation Seed)</option>
                      <option value="Benih Penjenis (Breeder Seed)">Benih Penjenis (Breeder Seed)</option>
                      <option value="Benih Dasar (Basic Seed)">Benih Dasar (Basic Seed)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Standar Produksi */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Standar Produksi
                  </label>
                  <div className="relative">
                    <select
                      value={produksiParam.standarProduksi}
                      onChange={(e) =>
                        setProduksiParam((prev) => ({ ...prev, standarProduksi: e.target.value }))
                      }
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="SNI 01-8493-2018">SNI 01-8493-2018</option>
                      <option value="SNI 01-6233-2000">SNI 01-6233-2000</option>
                      <option value="Standar Mutu Internal">Standar Mutu Internal</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Catatan Produksi */}
                <div className="col-span-1 md:col-span-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-gray-700">Catatan Produksi</label>
                    <span className="text-[11px] text-gray-400">
                      {(produksiParam.catatanProduksi || '').length}/500
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={produksiParam.catatanProduksi || ''}
                    onChange={(e) =>
                      setProduksiParam((prev) => ({ ...prev, catatanProduksi: e.target.value }))
                    }
                    placeholder="Masukkan catatan khusus terkait produksi benih..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: QC & STANDAR (Image 1) ======================= */}
        {activeTab === 'qc' && (
          <div className="space-y-6">
            {/* Sub-card 1: QC & Standar Status & Method */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                  <i className="ri-shield-check-line"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">QC & Standar</h3>
                  <p className="text-xs text-gray-500">
                    Standar mutu dan parameter pengujian untuk Kode Benih {kodeVarietas}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 text-xs">
                {/* Status QC */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">Status QC</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQcStatus('Wajib QC')}
                      className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${qcStatus === 'Wajib QC'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-checkbox-circle-fill text-xs"></i>
                      <span>Wajib QC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setQcStatus('Tidak Wajib')}
                      className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${qcStatus === 'Tidak Wajib'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Tidak Wajib</span>
                    </button>
                  </div>
                </div>

                {/* Metode Pengujian */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Metode Pengujian <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={qcMetode}
                      onChange={(e) => setQcMetode(e.target.value)}
                      className="w-full pl-3 pr-7 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="ISTA - Germination Test">ISTA - Germination Test</option>
                      <option value="Uji Tetrazolium (TZ)">Uji Tetrazolium (TZ)</option>
                      <option value="Metode Cepat Kertas (BP/TP)">Metode Cepat Kertas (BP/TP)</option>
                      <option value="SNI Pengujian Mutu Benih">SNI Pengujian Mutu Benih</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Frekuensi Pengujian */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Frekuensi Pengujian <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={qcFrekuensi}
                      onChange={(e) => setQcFrekuensi(e.target.value)}
                      className="w-full pl-3 pr-7 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Per Lot">Per Lot</option>
                      <option value="Per Batch">Per Batch</option>
                      <option value="Per Musim Panen">Per Musim Panen</option>
                      <option value="Per Pengiriman">Per Pengiriman</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Sampling */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Sampling <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={qcSampling}
                      onChange={(e) => setQcSampling(e.target.value)}
                      className="w-full pl-3 pr-7 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Wajib">Wajib</option>
                      <option value="Opsional">Opsional</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Masa Berlaku Hasil Uji */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Masa Berlaku Hasil Uji
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <div className="pl-3 py-2 flex items-center text-gray-400">
                      <i className="ri-calendar-line text-xs"></i>
                    </div>
                    <input
                      type="number"
                      value={qcMasaBerlaku}
                      onChange={(e) => setQcMasaBerlaku(e.target.value)}
                      placeholder="12"
                      className="w-full px-2 py-2 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2 text-xs border-l border-gray-200 flex items-center">
                      bulan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-card 2: Standar Mutu Benih (Table) */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                  <i className="ri-settings-5-line"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Standar Mutu Benih</h3>
                  <p className="text-xs text-gray-500">
                    Parameter mutu benih yang harus dipenuhi sesuai standar.
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto border border-gray-200/70 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70">
                    <tr>
                      <th className="py-3 px-3.5 w-12 text-center">No</th>
                      <th className="py-3 px-3.5">Parameter</th>
                      <th className="py-3 px-3.5">Nilai Minimal</th>
                      <th className="py-3 px-3.5">Nilai Maksimal</th>
                      <th className="py-3 px-3.5">Satuan</th>
                      <th className="py-3 px-3.5">Keterangan</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3.5 text-center w-20">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {qcParameters.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-gray-400">
                          Belum ada parameter QC. Klik tombol di bawah untuk menambahkan.
                        </td>
                      </tr>
                    ) : (
                      qcParameters.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={`transition-colors ${item.isUsed !== false ? 'hover:bg-gray-50/60' : 'bg-gray-50/40 text-gray-400'
                            }`}
                        >
                          <td className="py-3 px-3.5 text-center text-gray-500">{idx + 1}</td>
                          <td className="py-3 px-3.5 font-semibold text-gray-900">
                            <div className="flex items-center gap-1.5">
                              <span>{item.parameter}</span>
                              {item.kode && (
                                <span className="text-[10px] font-mono text-gray-400 font-normal">({item.kode})</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-gray-700">{item.nilaiMinimal}</td>
                          <td className="py-3 px-3.5 text-gray-700">{item.nilaiMaksimal}</td>
                          <td className="py-3 px-3.5 text-gray-600">{item.satuan}</td>
                          <td className="py-3 px-3.5 text-gray-600">{item.keterangan}</td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleQcUsed(item.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${item.isUsed !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                }`}
                              title="Klik untuk toggle flag Dipakai / Tidak Dipakai"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${item.isUsed !== false ? 'bg-emerald-500' : 'bg-gray-400'
                                  }`}
                              ></span>
                              <span>{item.isUsed !== false ? 'Dipakai' : 'Tidak Dipakai'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenEditQcParam(item)}
                              className="w-7 h-7 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors mx-auto"
                              title="Edit Parameter QC"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => setIsQcMasterModalOpen(true)}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors"
              >
                <i className="ri-add-line font-bold"></i>
                <span>Tambah Parameter QC</span>
              </button>
            </div>

            {/* Sub-card 3: Standar / Acuan */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                  <i className="ri-file-shield-line"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Standar / Acuan</h3>
                  <p className="text-xs text-gray-500">
                    Standar yang digunakan sebagai acuan pengujian dan sertifikasi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Standar Acuan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={qcStandarAcuan}
                      onChange={(e) => setQcStandarAcuan(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Standar Internal Perusahaan">Standar Internal Perusahaan</option>
                      <option value="SNI 01-8493-2018">SNI 01-8493-2018</option>
                      <option value="ISTA Rules">ISTA Rules</option>
                      <option value="BPSB Provinsi">BPSB Provinsi</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    No. Dokumen / Referensi
                  </label>
                  <input
                    type="text"
                    value={qcNoDokumen}
                    onChange={(e) => setQcNoDokumen(e.target.value)}
                    placeholder="SOP-QC-001"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-gray-700">Catatan QC</label>
                    <span className="text-[11px] text-gray-400">{qcCatatan.length}/500</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={qcCatatan}
                    onChange={(e) => setQcCatatan(e.target.value)}
                    placeholder="Catatan standar mutu QC..."
                    className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 6: INVENTORY (Image 2) ======================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Sub-card 1: Pengaturan Persediaan */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                  <i className="ri-archive-line"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Pengaturan Persediaan</h3>
                  <p className="text-xs text-gray-500">
                    Pengaturan cara pengelolaan stok dan satuan penyimpanan untuk kode benih ini.
                  </p>
                </div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
                {/* Kelola Stok */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Kelola Stok <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvKelolaStok('Ya')}
                      className={`w-[150px] py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invKelolaStok === 'Ya'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-checkbox-circle-fill text-xs"></i>
                      <span>Ya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvKelolaStok('Tidak')}
                      className={`w-[150px] py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invKelolaStok === 'Tidak'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Tidak</span>
                    </button>
                  </div>
                </div>

                {/* Satuan Stok */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Satuan Stok <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={invSatuanStok}
                      onChange={(e) => setInvSatuanStok(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Gram">Gram</option>
                      <option value="Ton">Ton</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Satuan Kemasan */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Satuan Kemasan <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={invSatuanKemasan}
                      onChange={(e) => setInvSatuanKemasan(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Sachet">Sachet</option>
                      <option value="Pack">Pack</option>
                      <option value="Box">Box</option>
                      <option value="Kaleng">Kaleng</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Konversi Kemasan */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Konversi Kemasan <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-700 text-xs">1</span>
                    <select
                      value={invKonversiSatuanAwal}
                      onChange={(e) => setInvKonversiSatuanAwal(e.target.value)}
                      className="px-2 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Sachet">Sachet</option>
                      <option value="Pack">Pack</option>
                      <option value="Box">Box</option>
                    </select>
                    <span className="text-gray-500 font-bold">=</span>
                    <input
                      type="text"
                      value={invKonversiNilai}
                      onChange={(e) => setInvKonversiNilai(e.target.value)}
                      className="w-14 px-2 py-2 text-center bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none"
                    />
                    <select
                      value={invKonversiSatuanAkhir}
                      onChange={(e) => setInvKonversiSatuanAkhir(e.target.value)}
                      className="px-2 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Gram">Gram</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
                {/* Metode Stok */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Metode Stok <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={invMetodeStok}
                      onChange={(e) => setInvMetodeStok(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="FIFO">FIFO</option>
                      <option value="FEFO">FEFO</option>
                      <option value="LIFO">LIFO</option>
                      <option value="Average">Average</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Minimum Stok */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Minimum Stok <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="number"
                      value={invMinStok}
                      onChange={(e) => setInvMinStok(e.target.value)}
                      placeholder="50"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      Kg
                    </span>
                  </div>
                </div>

                {/* Maksimum Stok */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Maksimum Stok <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="number"
                      value={invMaxStok}
                      onChange={(e) => setInvMaxStok(e.target.value)}
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      Kg
                    </span>
                  </div>
                </div>

                {/* Status Inventory */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Status Inventory <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={invStatus}
                      onChange={(e) => setInvStatus(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-card 2: Pengaturan Batch / Lot */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                  <i className="ri-barcode-box-line"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Pengaturan Batch / Lot</h3>
                  <p className="text-xs text-gray-500">
                    Aturan pencatatan batch/lot dan traceability untuk kode benih ini.
                  </p>
                </div>
              </div>

              {/* Row 1: 4 Toggle Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
                {/* Wajib Nomor Lot / Batch */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Wajib Nomor Lot / Batch <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvWajibLot('Ya')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibLot === 'Ya'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-checkbox-circle-fill text-xs"></i>
                      <span>Ya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvWajibLot('Tidak')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibLot === 'Tidak'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Tidak</span>
                    </button>
                  </div>
                </div>

                {/* Wajib Tanggal Produksi */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Wajib Tanggal Produksi <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvWajibTglProduksi('Ya')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibTglProduksi === 'Ya'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-checkbox-circle-fill text-xs"></i>
                      <span>Ya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvWajibTglProduksi('Tidak')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibTglProduksi === 'Tidak'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Tidak</span>
                    </button>
                  </div>
                </div>

                {/* Wajib Tanggal Kadaluarsa */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Wajib Tanggal Kadaluarsa <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvWajibTglKadaluarsa('Ya')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibTglKadaluarsa === 'Ya'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Ya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvWajibTglKadaluarsa('Tidak')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibTglKadaluarsa === 'Tidak'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-close-circle-fill text-xs"></i>
                      <span>Tidak</span>
                    </button>
                  </div>
                </div>

                {/* Wajib Nomor Sertifikat */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Wajib Nomor Sertifikat
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvWajibNoSertifikat('Ya')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibNoSertifikat === 'Ya'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Ya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvWajibNoSertifikat('Tidak')}
                      className={`w-[150px] py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invWajibNoSertifikat === 'Tidak'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-close-circle-fill text-xs"></i>
                      <span>Tidak</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                {/* Traceability Lot */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Traceability Lot <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvTraceabilityLot('Aktif')}
                      className={`w-[150px] py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invTraceabilityLot === 'Aktif'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <i className="ri-checkbox-circle-fill text-xs"></i>
                      <span>Aktif</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInvTraceabilityLot('Tidak Aktif')}
                      className={`w-[150px] py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${invTraceabilityLot === 'Tidak Aktif'
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      <span>Tidak Aktif</span>
                    </button>
                  </div>
                </div>

                {/* Masa Berlaku Hasil Uji */}
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    Masa Berlaku Hasil Uji
                  </label>
                  <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                    <input
                      type="number"
                      value={invMasaBerlaku}
                      onChange={(e) => setInvMasaBerlaku(e.target.value)}
                      placeholder="12"
                      className="w-full px-3.5 py-2.5 text-xs text-gray-800 focus:outline-none"
                    />
                    <span className="bg-gray-50 text-gray-500 px-3 py-2.5 text-xs border-l border-gray-200 flex items-center">
                      bulan
                    </span>
                  </div>
                </div>

                {/* Catatan */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-gray-700">Catatan</label>
                    <span className="text-[11px] text-gray-400">{invCatatan.length}/500</span>
                  </div>
                  <input
                    type="text"
                    maxLength={500}
                    value={invCatatan}
                    onChange={(e) => setInvCatatan(e.target.value)}
                    placeholder="Contoh: Nomor lot mengikuti kode produksi..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Sub-card 3: Jenis Kemasan */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                    <i className="ri-inbox-archive-line"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Jenis Kemasan</h3>
                    <p className="text-xs text-gray-500">
                      Jenis dan ukuran kemasan yang digunakan untuk kode benih ini.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddKemasan}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all"
                >
                  <i className="ri-add-line font-bold"></i>
                  <span>Tambah Jenis Kemasan</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-gray-200/70 rounded-xl mb-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70">
                    <tr>
                      <th className="py-3 px-3.5 w-12 text-center">No</th>
                      <th className="py-3 px-3.5">Kemasan</th>
                      <th className="py-3 px-3.5">Isi</th>
                      <th className="py-3 px-3.5">Satuan</th>
                      <th className="py-3 px-3.5 text-center">Status</th>
                      <th className="py-3 px-3.5 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invKemasanList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-3.5 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-3 px-3.5 font-semibold text-gray-900">{item.kemasan}</td>
                        <td className="py-3 px-3.5 text-gray-700">{item.isi}</td>
                        <td className="py-3 px-3.5 text-gray-600">{item.satuan}</td>
                        <td className="py-3 px-3.5 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${item.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${item.status === 'Aktif' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                            ></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditKemasan(item)}
                              className="w-7 h-7 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                              title="Edit"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteKemasan(item.id)}
                              className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors"
                              title="Hapus"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Info Note */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-center gap-2.5 text-xs text-blue-800">
                <i className="ri-information-line text-base text-blue-600 flex-shrink-0"></i>
                <span>
                  Pengaturan inventory akan digunakan pada proses gudang, stok, batch produksi dan traceability lot.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 7: DOKUMEN (Image 3) ======================= */}
        {activeTab === 'dokumen' && (
          <div className="space-y-6">
            {/* Header / Intro */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base border border-emerald-100">
                    <i className="ri-file-text-line"></i>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Dokumen</h3>
                    <p className="text-xs text-gray-500">
                      Dokumen pendukung kode benih dan nama/merk varietas.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all"
                >
                  <i className="ri-upload-2-line font-bold"></i>
                  <span>Upload Dokumen</span>
                </button>
              </div>

              {/* Table of Documents (Full Height) */}
              <div>
                <div className="text-xs font-bold text-gray-900 mb-3">Daftar Dokumen</div>
                <div className="overflow-x-auto border border-gray-200/70 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70">
                      <tr>
                        <th className="py-3 px-3.5 w-12 text-center">No</th>
                        <th className="py-3 px-3.5">Nama Dokumen</th>
                        <th className="py-3 px-3.5">Jenis Dokumen</th>
                        <th className="py-3 px-3.5">Berlaku Untuk</th>
                        <th className="py-3 px-3.5">Nomor Dokumen</th>
                        <th className="py-3 px-3.5">Tanggal Dokumen</th>
                        <th className="py-3 px-3.5">File</th>
                        <th className="py-3 px-3.5 text-center w-24">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {documents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-gray-400">
                            Belum ada dokumen yang diunggah. Klik tombol &quot;Upload Dokumen&quot; di atas.
                          </td>
                        </tr>
                      ) : (
                        documents.map((doc, idx) => (
                          <tr key={doc.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-3.5 text-center text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-3.5 font-semibold text-gray-900">{doc.namaDokumen}</td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getDocBadgeColor(
                                  doc.jenisDokumen
                                )}`}
                              >
                                {doc.jenisDokumen}
                              </span>
                            </td>
                            <td className="py-3 px-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getBerlakuBadgeColor(
                                  doc.berlakuUntuk
                                )}`}
                              >
                                {doc.berlakuUntuk}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 font-mono text-[11px] text-gray-700">
                              {doc.nomorDokumen}
                            </td>
                            <td className="py-3 px-3.5 text-gray-600">{doc.tanggalDokumen}</td>
                            <td className="py-3 px-3.5">
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="w-6 h-6 rounded bg-rose-50 text-rose-600 flex items-center justify-center text-xs flex-shrink-0 border border-rose-100">
                                  <i className="ri-file-pdf-line"></i>
                                </div>
                                <span className="font-medium truncate max-w-[140px] text-[11px]">
                                  {doc.fileName}
                                </span>
                                <span className="text-[10px] text-gray-400">({doc.fileSize})</span>
                              </div>
                            </td>
                            <td className="py-3 px-3.5 text-center">
                              <div className="inline-flex items-center gap-1.5 text-gray-500">
                                <button
                                  type="button"
                                  className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
                                  title="Lihat"
                                >
                                  <i className="ri-eye-line text-xs"></i>
                                </button>
                                <button
                                  type="button"
                                  className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
                                  title="Download"
                                >
                                  <i className="ri-download-line text-xs"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDocument(doc.id)}
                                  className="w-6 h-6 rounded hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center"
                                  title="Hapus"
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
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODALS */}
      <ModalTambahMerkVarietas
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onSave={handleSaveBrand}
        editingBrand={editingBrand}
      />

      {/* Modal Tambah Master Parameter (Karakteristik Varietas) */}
      <ModalMasterParameterPopup
        isOpen={isCharMasterModalOpen}
        onClose={() => setIsCharMasterModalOpen(false)}
        defaultNamaModul="VARIETAS"
        lockNamaModul={true}
        defaultTipeNilai="NUMBER"
        onSuccess={handleCharMasterSuccess}
      />

      {/* Modal Edit Nilai Standart Karakteristik */}
      <ModalEditNilaiKarakteristik
        isOpen={isCharEditModalOpen}
        onClose={() => setIsCharEditModalOpen(false)}
        item={selectedCharItem}
        onSave={handleSaveEditChar}
      />

      {/* Modal Tambah Master Parameter QC (Otomatis Modul QC & Tipe RANGE) */}
      <ModalMasterParameterPopup
        isOpen={isQcMasterModalOpen}
        onClose={() => setIsQcMasterModalOpen(false)}
        defaultNamaModul="QC"
        lockNamaModul={true}
        defaultTipeNilai="RANGE"
        lockTipeNilai={true}
        title="Tambah Master Parameter QC"
        onSuccess={handleQcMasterSuccess}
      />

      {/* Modal Edit Parameter QC */}
      <ModalTambahParameterQC
        isOpen={isQcModalOpen}
        onClose={() => setIsQcModalOpen(false)}
        onSave={handleSaveQcParam}
        editingItem={editingQcParam}
      />

      <ModalTambahKemasan
        isOpen={isKemasanModalOpen}
        onClose={() => setIsKemasanModalOpen(false)}
        onSave={handleSaveKemasan}
        editingItem={editingKemasan}
      />

      {/* Modal Tambah Dokumen (Popup) */}
      <ModalTambahDokumen
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSave={handleSaveDocFromModal}
        availableBrands={brands.map((b) => b.namaMerk)}
      />
    </div>
  );
}

export default function TambahVarietasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <TambahVarietasForm />
    </Suspense>
  );
}
