"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Commodity } from '@/app/types/commodity';
import { Variety } from '@/app/types/variety';

export interface LahanItem {
  id?: string;
  kodeLahan?: string;
  namaLahan: string;
  luas: number;
  komoditas?: string;
  commodityId?: string;
  varietas?: string;
  varietyId?: string;
  latitude: number;
  longitude: number;
  status: 'Aktif' | 'Non Aktif';
  detailLokasi?: string;
}

const ModalLeafletMapWithNoSSR = dynamic(
  () => import('./ModalLeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">
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
  const [luas, setLuas] = useState<number | ''>('');
  const [selectedCommodityId, setSelectedCommodityId] = useState('');
  const [selectedVarietyId, setSelectedVarietyId] = useState('');
  const [status, setStatus] = useState<'Aktif' | 'Non Aktif'>('Aktif');
  const [detailLokasi, setDetailLokasi] = useState('');

  // Default coordinate near Central Java / Wonogiri or existing
  const [latitude, setLatitude] = useState(-7.635200);
  const [longitude, setLongitude] = useState(110.841200);
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setNamaLahan(initialData.namaLahan || '');
      setLuas(initialData.luas || '');
      setSelectedCommodityId(initialData.commodityId || '');
      setSelectedVarietyId(initialData.varietyId || '');
      setStatus(initialData.status || 'Aktif');
      setDetailLokasi(initialData.detailLokasi || '');
      setLatitude(initialData.latitude || -7.635200);
      setLongitude(initialData.longitude || 110.841200);
    } else {
      setNamaLahan('');
      setLuas('');
      setSelectedCommodityId('');
      setSelectedVarietyId('');
      setStatus('Aktif');
      setDetailLokasi('');
      setLatitude(-7.635200);
      setLongitude(110.841200);
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Filter varieties by selected commodity if chosen
  const filteredVarieties = useMemo(() => {
    if (!selectedCommodityId) return varieties;
    return varieties.filter((v) => v.commodityId === selectedCommodityId);
  }, [varieties, selectedCommodityId]);

  // Use browser geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung geolokasi');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        console.error('Error getting location:', err);
        alert('Gagal mendapatkan lokasi saat ini. Pastikan izin lokasi aktif.');
        setIsLocating(false);
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
    const selectedVar = varieties.find((v) => v.id === selectedVarietyId);

    const lahanData: LahanItem = {
      id: initialData?.id || undefined,
      kodeLahan: initialData?.kodeLahan || undefined,
      namaLahan: namaLahan.trim(),
      luas: Number(luas),
      komoditas: selectedComm ? selectedComm.namaKomoditas : undefined,
      commodityId: selectedCommodityId || undefined,
      varietas: selectedVar ? selectedVar.namaVarietas : undefined,
      varietyId: selectedVarietyId || undefined,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status,
      detailLokasi: detailLokasi.trim() || undefined,
    };

    onSave(lahanData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-defaultborder">
        {/* Header */}
        <div className="px-6 py-4 border-b border-defaultborder flex justify-between items-center bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center text-xl shadow-xs">
              <i className="ri-map-pin-add-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                {initialData ? 'Edit Data Lahan' : 'Tambah Lahan Petani'}
              </h3>
              <p className="text-xs text-gray-500">
                Tentukan data lahan dan titik koordinat pada peta.
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Lahan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Nama Lahan / Blok <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={namaLahan}
                onChange={(e) => {
                  setNamaLahan(e.target.value);
                  if (errors.namaLahan) setErrors((prev) => ({ ...prev, namaLahan: '' }));
                }}
                className={`form-control w-full border ${
                  errors.namaLahan ? 'border-danger focus:border-danger' : 'border-defaultborder focus:border-emerald-500'
                } p-2.5 rounded-lg text-sm transition`}
                placeholder="Contoh: Lahan 01 / Blok A"
              />
              {errors.namaLahan && (
                <span className="text-[11px] text-danger mt-1 block">{errors.namaLahan}</span>
              )}
            </div>

            {/* Luas Lahan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Luas Lahan (m²) <span className="text-danger">*</span>
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
                  className={`form-control w-full border ${
                    errors.luas ? 'border-danger focus:border-danger' : 'border-defaultborder focus:border-emerald-500'
                  } p-2.5 pr-12 rounded-lg text-sm transition`}
                  placeholder="Contoh: 1200"
                />
                <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-semibold pointer-events-none">
                  m²
                </span>
              </div>
              {errors.luas && (
                <span className="text-[11px] text-danger mt-1 block">{errors.luas}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Komoditas - Opsional */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Komoditas <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <select
                value={selectedCommodityId}
                onChange={(e) => {
                  setSelectedCommodityId(e.target.value);
                  setSelectedVarietyId(''); // reset variety if commodity changed
                }}
                className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-sm bg-white cursor-pointer focus:border-emerald-500 transition"
              >
                <option value="">-- Pilih Komoditas --</option>
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

            {/* Varietas - Opsional */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Varietas <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <select
                value={selectedVarietyId}
                onChange={(e) => setSelectedVarietyId(e.target.value)}
                className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-sm bg-white cursor-pointer focus:border-emerald-500 transition"
              >
                <option value="">-- Pilih Varietas --</option>
                {filteredVarieties.map((v: any) => {
                  const name = v.namaVarietas || v.nama || v.label || '';
                  const id = v.id || v.value || name;
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status Lahan */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Status Lahan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="form-select w-full border border-defaultborder p-2.5 rounded-lg text-sm bg-white cursor-pointer focus:border-emerald-500 transition"
              >
                <option value="Aktif">Aktif</option>
                <option value="Non Aktif">Non Aktif</option>
              </select>
            </div>
          </div>

          {/* Interactive Map (Point Only) */}
          <div>
            <div className="flex flex-wrap justify-between items-center mb-1.5 gap-2">
              <label className="block text-xs font-bold text-gray-700">
                Peta Titik Koordinat Lahan <span className="text-gray-400 font-normal">(Klik peta atau geser pin)</span>
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition shadow-2xs"
              >
                {isLocating ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-crosshair-2-line text-emerald-600"></i>
                )}
                <span>Gunakan Lokasi Saya</span>
              </button>
            </div>

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

          {/* Manual Coordinates input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Latitude (Garis Lintang)
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                className="form-control w-full border border-defaultborder p-2 rounded-lg text-xs font-mono bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Longitude (Garis Bujur)
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                className="form-control w-full border border-defaultborder p-2 rounded-lg text-xs font-mono bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Detail Lokasi / Alamat */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Keterangan / Alamat Lahan <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              value={detailLokasi}
              onChange={(e) => setDetailLokasi(e.target.value)}
              rows={2}
              className="form-control w-full border border-defaultborder p-2.5 rounded-lg text-xs focus:border-emerald-500 transition"
              placeholder="Patokan lokasi, nama dusun, atau blok persawahan..."
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-defaultborder flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-2 shadow-xs"
            >
              <i className="ri-check-line text-sm"></i>
              <span>{initialData ? 'Simpan Perubahan' : 'Tambah Lahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
