"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';
import uploadService from '@/app/services/uploadService';

export interface LahanItem {
  id?: string;
  kodeLahan?: string;
  namaLahan: string;
  jenisLahan?: 'Greenhouse' | 'Lahan Terbuka';
  luas: number;
  komoditas?: string;
  commodityId?: string;
  varietas?: string;
  varietyId?: string;
  latitude: number;
  longitude: number;
  status: 'Aktif' | 'Non Aktif';
  detailLokasi?: string;
  // Uploads
  dokumenFile?: File;
  dokumenUrl?: string;
  dokumenNama?: string;
  dokumenSize?: string;
  fotoFile?: File;
  fotoUrl?: string;
  fotoNama?: string;
}

const ModalLeafletMapWithNoSSR = dynamic(
  () => import('./ModalLeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[270px] bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs">
        <div className="flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-lg text-emerald-400"></i>
          <span>Memuat Peta Lokasi Lahan...</span>
        </div>
      </div>
    ),
  }
);

interface ModalTambahLahanProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lahan: LahanItem) => void;
  initialData?: LahanItem | null;
  commodities: Commodity[];
  varieties: Variety[];
}

export default function ModalTambahLahan({
  isOpen,
  onClose,
  onSave,
  initialData,
  commodities,
  varieties,
}: ModalTambahLahanProps) {
  const [namaLahan, setNamaLahan] = useState('');
  const [jenisLahan, setJenisLahan] = useState<'Greenhouse' | 'Lahan Terbuka'>('Lahan Terbuka');
  const [luas, setLuas] = useState<number | ''>('');
  const [selectedCommodityId, setSelectedCommodityId] = useState('');
  const [selectedVarietyCode, setSelectedVarietyCode] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Non Aktif'>('Aktif');
  const [detailLokasi, setDetailLokasi] = useState('');

  // Coordinates & GPS
  const [latitude, setLatitude] = useState(-7.635200);
  const [longitude, setLongitude] = useState(110.841200);
  const [accuracy, setAccuracy] = useState<number>(5);

  // Dokumen Lahan
  const [dokumenFile, setDokumenFile] = useState<File | null>(null);
  const [dokumenUrl, setDokumenUrl] = useState('');
  const [dokumenNama, setDokumenNama] = useState('');
  const [dokumenSize, setDokumenSize] = useState('');
  const [isUploadingDokumen, setIsUploadingDokumen] = useState(false);

  // Foto Lahan
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoNama, setFotoNama] = useState('');
  const [isUploadingFoto, setIsUploadingFoto] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const docInputRef = useRef<HTMLInputElement>(null);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setNamaLahan(initialData.namaLahan || '');
      setJenisLahan((initialData.jenisLahan as any) || 'Lahan Terbuka');
      setLuas(initialData.luas || '');
      setSelectedCommodityId(initialData.commodityId || '');
      const foundVar = varieties.find(
        (v) =>
          (initialData.varietas && (v.kodeVarietas === initialData.varietas || v.namaVarietas === initialData.varietas)) ||
          (initialData.varietyId && (v.id === initialData.varietyId || v.kodeVarietas === initialData.varietyId))
      );
      setSelectedVarietyCode(foundVar?.kodeVarietas || initialData.varietas || initialData.varietyId || '');
      setStatus(initialData.status || 'Aktif');
      setDetailLokasi(initialData.detailLokasi || '');
      setLatitude(initialData.latitude || -7.635200);
      setLongitude(initialData.longitude || 110.841200);

      // Dokumen
      setDokumenFile(initialData.dokumenFile || null);
      setDokumenUrl(initialData.dokumenUrl || '');
      setDokumenNama(initialData.dokumenNama || '');
      setDokumenSize(initialData.dokumenSize || '');

      // Foto
      setFotoFile(initialData.fotoFile || null);
      setFotoUrl(initialData.fotoUrl || '');
      setFotoNama(initialData.fotoNama || '');
    } else {
      setNamaLahan('');
      setJenisLahan('Lahan Terbuka');
      setLuas('');
      setSelectedCommodityId('');
      setSelectedVarietyCode('');
      setStatus('Aktif');
      setDetailLokasi('');
      setLatitude(-7.635200);
      setLongitude(110.841200);
      setAccuracy(5);

      setDokumenFile(null);
      setDokumenUrl('');
      setDokumenNama('');
      setDokumenSize('');

      setFotoFile(null);
      setFotoUrl('');
      setFotoNama('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Filter varieties by selected commodity if chosen
  const filteredVarieties = useMemo(() => {
    if (!selectedCommodityId) return varieties;
    return varieties.filter((v) => v.commodityId === selectedCommodityId);
  }, [varieties, selectedCommodityId]);

  // Handle Dokumen Lahan upload
  const handleSelectDokumen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeKB = (file.size / 1024).toFixed(0);
    const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

    setDokumenFile(file);
    setDokumenNama(file.name);
    setDokumenSize(displaySize);

    // Attempt upload to server in background
    try {
      setIsUploadingDokumen(true);
      const res = await uploadService.uploadFile(file, 'lahan/dokumen');
      if (res?.data?.fileUrl) {
        setDokumenUrl(res.data.fileUrl);
      }
    } catch (err) {
      console.warn('Upload dokumen server error, keeping local reference:', err);
    } finally {
      setIsUploadingDokumen(false);
    }
  };

  const handleRemoveDokumen = () => {
    setDokumenFile(null);
    setDokumenUrl('');
    setDokumenNama('');
    setDokumenSize('');
    if (docInputRef.current) docInputRef.current.value = '';
  };

  // Handle Foto Lahan upload
  const handleSelectFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoFile(file);
    setFotoNama(file.name);

    // Immediate local preview URL
    const localUrl = URL.createObjectURL(file);
    setFotoUrl(localUrl);

    // Attempt upload to server in background
    try {
      setIsUploadingFoto(true);
      const res = await uploadService.uploadFile(file, 'lahan/foto');
      if (res?.data?.fileUrl) {
        setFotoUrl(res.data.fileUrl);
      }
    } catch (err) {
      console.warn('Upload foto server error, keeping local preview:', err);
    } finally {
      setIsUploadingFoto(false);
    }
  };

  const handleRemoveFoto = () => {
    setFotoFile(null);
    setFotoUrl('');
    setFotoNama('');
    if (fotoInputRef.current) fotoInputRef.current.value = '';
  };

  // Use browser geolocation
  const handlePilihLokasiDiPeta = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung geolokasi');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        if (pos.coords.accuracy) {
          setAccuracy(Math.round(pos.coords.accuracy));
        }
      },
      (err) => {
        console.error('Error getting location:', err);
        alert('Gagal mendapatkan lokasi saat ini. Pastikan izin lokasi aktif.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!namaLahan.trim()) {
      newErrors.namaLahan = 'Nama lahan wajib diisi';
    }
    if (luas === '' || Number(luas) <= 0) {
      newErrors.luas = 'Luas lahan harus lebih besar dari 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedComm = commodities.find((c) => c.id === selectedCommodityId);
    const selectedVar = varieties.find(
      (v) => v.kodeVarietas === selectedVarietyCode || v.id === selectedVarietyCode
    );

    const lahanData: LahanItem = {
      id: initialData?.id || undefined,
      kodeLahan: initialData?.kodeLahan || undefined,
      namaLahan: namaLahan.trim(),
      jenisLahan,
      luas: Number(luas),
      komoditas: selectedComm ? (selectedComm.namaKomoditas || (selectedComm as any).nama) : undefined,
      commodityId: selectedCommodityId || undefined,
      varietas: selectedVar ? (selectedVar.kodeVarietas || selectedVar.namaVarietas) : (selectedVarietyCode || undefined),
      varietyId: selectedVar ? selectedVar.id : undefined,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status,
      detailLokasi: detailLokasi.trim() || undefined,
      // Uploaded docs and photos
      dokumenFile: dokumenFile || undefined,
      dokumenUrl: dokumenUrl || undefined,
      dokumenNama: dokumenNama || undefined,
      dokumenSize: dokumenSize || undefined,
      fotoFile: fotoFile || undefined,
      fotoUrl: fotoUrl || undefined,
      fotoNama: fotoNama || undefined,
    };

    onSave(lahanData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
              <i className="ri-seedling-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {initialData ? 'Edit Data Lahan' : 'Tambah Lahan Petani'}
              </h3>
              <p className="text-xs text-gray-500">
                Lengkapi informasi lahan yang dimiliki atau dikelola oleh petani mitra.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-2.5 bg-gray-50/70 border-b border-gray-100 flex items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <i className="ri-file-text-line text-emerald-600"></i>
            <span>1. Informasi Lahan</span>
          </div>
        </div>

        {/* Content Form - Two Column Layout matching Image 2 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* =========================================================
                LEFT COLUMN: Informasi Lahan
               ========================================================= */}
            <div className="space-y-4">
              {/* Section Title */}
              <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <i className="ri-community-line text-emerald-600"></i>
                <span>Informasi Lahan</span>
              </div>

              {/* Nama Lahan */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Lahan <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={namaLahan}
                  onChange={(e) => {
                    setNamaLahan(e.target.value);
                    if (errors.namaLahan) setErrors((prev) => ({ ...prev, namaLahan: '' }));
                  }}
                  placeholder="Masukkan nama lahan"
                  className={`w-full border ${
                    errors.namaLahan ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-emerald-500'
                  } rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none transition`}
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Contoh: Lahan 1 / Blok A
                </span>
                {errors.namaLahan && (
                  <span className="text-[11px] text-danger mt-0.5 block">{errors.namaLahan}</span>
                )}
              </div>

              {/* Jenis Lahan */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Jenis Lahan <span className="text-danger">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                      jenisLahan === 'Greenhouse'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-2xs font-semibold'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="jenisLahan"
                      value="Greenhouse"
                      checked={jenisLahan === 'Greenhouse'}
                      onChange={() => setJenisLahan('Greenhouse')}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 text-xs">
                      <i className="ri-building-line text-emerald-600 text-sm"></i>
                      <span>Greenhouse</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                      jenisLahan === 'Lahan Terbuka'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-2xs font-semibold'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="jenisLahan"
                      value="Lahan Terbuka"
                      checked={jenisLahan === 'Lahan Terbuka'}
                      onChange={() => setJenisLahan('Lahan Terbuka')}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5 text-xs">
                      <i className="ri-landscape-line text-emerald-600 text-sm"></i>
                      <span>Lahan Terbuka</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Row: Luas Lahan & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Luas Lahan <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={luas}
                      onChange={(e) => {
                        setLuas(e.target.value === '' ? '' : parseFloat(e.target.value));
                        if (errors.luas) setErrors((prev) => ({ ...prev, luas: '' }));
                      }}
                      placeholder="Masukkan luas lahan"
                      className={`w-full border ${
                        errors.luas ? 'border-danger focus:border-danger' : 'border-gray-200 focus:border-emerald-500'
                      } rounded-lg p-2.5 pr-10 text-xs text-gray-800 focus:outline-none transition`}
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-semibold pointer-events-none">
                      m²
                    </span>
                  </div>
                  {errors.luas && (
                    <span className="text-[11px] text-danger mt-1 block">{errors.luas}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="Aktif">● Aktif</option>
                    <option value="Non Aktif">● Non Aktif</option>
                  </select>
                </div>
              </div>

              {/* Row: Komoditas & Varietas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Komoditas
                  </label>
                  <select
                    value={selectedCommodityId}
                    onChange={(e) => {
                      setSelectedCommodityId(e.target.value);
                      setSelectedVarietyCode('');
                    }}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                  >
                    <option value="">Pilih komoditas</option>
                    {commodities.map((c: any) => {
                      const name = c.namaKomoditas || c.nama || c.label || '';
                      const id = c.id || c.value || name;
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Varietas
                  </label>
                  <select
                    value={selectedVarietyCode}
                    onChange={(e) => setSelectedVarietyCode(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-white focus:outline-none focus:border-emerald-500 transition cursor-pointer font-mono"
                  >
                    <option value="">Pilih varietas (kode benih)</option>
                    {filteredVarieties.map((v: any) => {
                      const kodeBenih = v.kodeVarietas || v.namaVarietas || v.id;
                      return (
                        <option key={v.id || kodeBenih} value={kodeBenih}>
                          {kodeBenih}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Informasi Tambahan Header */}
              <div className="pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                  <i className="ri-information-line text-emerald-600"></i>
                  <span>Informasi tambahan (opsional)</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Informasi ini dapat dilengkapi nanti jika diperlukan.
                </p>
              </div>

              {/* Row with Two Upload Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Upload Dokumen Lahan */}
                <div>
                  <span className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <i className="ri-file-text-line text-emerald-600"></i>
                    <span>Dokumen Lahan (Opsional)</span>
                  </span>
                  <input
                    type="file"
                    ref={docInputRef}
                    onChange={handleSelectDokumen}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <div className="border border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-3.5 bg-gray-50/40 hover:bg-emerald-50/20 text-center flex flex-col items-center justify-center min-h-[148px] transition relative">
                    {dokumenNama ? (
                      <div className="w-full flex flex-col items-center">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-1.5 shadow-2xs">
                          <i className="ri-file-text-line"></i>
                        </div>
                        <span className="text-xs font-semibold text-gray-800 truncate max-w-[140px]" title={dokumenNama}>
                          {dokumenNama}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          {dokumenSize || (isUploadingDokumen ? 'Mengupload...' : 'Tersimpan')}
                        </span>
                        {isUploadingDokumen && (
                          <i className="ri-loader-4-line animate-spin text-emerald-600 text-xs mt-1"></i>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => docInputRef.current?.click()}
                            className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 rounded transition"
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveDokumen}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                            title="Hapus Dokumen"
                          >
                            <i className="ri-delete-bin-line text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <i className="ri-upload-cloud-2-line text-3xl text-emerald-600 mb-1"></i>
                        <span className="text-xs font-bold text-gray-800">
                          Upload Dokumen Lahan
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5 mb-2.5">
                          (Sertifikat, Surat Sewa, dll)
                        </span>
                        <button
                          type="button"
                          onClick={() => docInputRef.current?.click()}
                          disabled={isUploadingDokumen}
                          className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition cursor-pointer"
                        >
                          Pilih File
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Upload Foto Lahan */}
                <div>
                  <span className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <i className="ri-image-line text-emerald-600"></i>
                    <span>Foto Lahan (Opsional)</span>
                  </span>
                  <input
                    type="file"
                    ref={fotoInputRef}
                    onChange={handleSelectFoto}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="border border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-3.5 bg-gray-50/40 hover:bg-emerald-50/20 text-center flex flex-col items-center justify-center min-h-[148px] transition relative">
                    {fotoUrl ? (
                      <div className="w-full flex flex-col items-center">
                        <img
                          src={fotoUrl}
                          alt="Foto Lahan"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-2xs mb-1.5"
                        />
                        <span className="text-xs font-semibold text-gray-800 truncate max-w-[140px]" title={fotoNama}>
                          {fotoNama || 'Foto Lahan'}
                        </span>
                        {isUploadingFoto && (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                            <i className="ri-loader-4-line animate-spin"></i> Mengupload...
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => fotoInputRef.current?.click()}
                            className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 rounded transition"
                          >
                            Ganti
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveFoto}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                            title="Hapus Foto"
                          >
                            <i className="ri-delete-bin-line text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <i className="ri-camera-line text-3xl text-emerald-600 mb-1"></i>
                        <span className="text-xs font-bold text-gray-800">
                          Upload Foto Lahan
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5 mb-2.5">
                          (Kondisi lahan, akses, dll)
                        </span>
                        <button
                          type="button"
                          onClick={() => fotoInputRef.current?.click()}
                          disabled={isUploadingFoto}
                          className="px-3 py-1 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold transition cursor-pointer"
                        >
                          Pilih Foto
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================
                RIGHT COLUMN: Lokasi Lahan
               ========================================================= */}
            <div className="space-y-3 flex flex-col">
              {/* Section Title */}
              <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <i className="ri-map-pin-2-line text-emerald-600"></i>
                <span>Lokasi Lahan</span>
              </div>

              {/* Satellite Map */}
              <div className="flex-1">
                <ModalLeafletMapWithNoSSR
                  latitude={latitude}
                  longitude={longitude}
                  onChange={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  heightClass="h-[270px]"
                />
              </div>

              {/* Button: Pilih Lokasi di Peta */}
              <button
                type="button"
                onClick={handlePilihLokasiDiPeta}
                className="w-full py-2 px-4 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <i className="ri-map-pin-line text-sm text-emerald-600"></i>
                <span>Pilih Lokasi di Peta</span>
              </button>

              {/* Coordinates and GPS Accuracy Card */}
              <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium mb-0.5">Latitude</span>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-mono font-semibold text-gray-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-gray-500 font-medium mb-0.5">Longitude</span>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-mono font-semibold text-gray-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 flex items-center gap-1.5 text-[11px] text-gray-600">
                  <i className="ri-crosshair-2-line text-emerald-600 text-xs"></i>
                  <span className="font-medium text-gray-500">Akurasi GPS</span>
                  <span className="font-semibold text-gray-700 ml-auto">± {accuracy} meter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <i className="ri-close-line text-sm"></i>
              <span>Batal</span>
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs"
            >
              <i className="ri-save-line text-sm"></i>
              <span>Simpan Lahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
