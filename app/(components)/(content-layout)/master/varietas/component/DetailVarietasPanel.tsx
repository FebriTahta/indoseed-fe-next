"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Variety } from '@/app/types/variety';
import { parseVarietyData, getCommodityIcon } from '../varietyHelper';

interface DetailVarietasPanelProps {
  variety: Variety;
  onClose: () => void;
  onEdit?: (variety: Variety) => void;
  isLoading?: boolean;
}

export default function DetailVarietasPanel({
  variety,
  onClose,
  onEdit,
  isLoading = false,
}: DetailVarietasPanelProps) {
  const router = useRouter();
  const parsed = parseVarietyData(variety);
  const isAktif = parsed.status === 'Aktif';
  const commIcon = getCommodityIcon(parsed.commodity?.namaKomoditas);
  const kelompok = parsed.commodity?.kategori || 'Buah';

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(parsed);
    } else {
      router.push(`/master/varietas/tambah?id=${parsed.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white border border-gray-200/80 rounded-xl shadow-2xs p-6 items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs text-gray-500 font-medium">Memuat detail varietas...</span>
      </div>
    );
  }

  // Characteristics list to show (first 7 items)
  const characteristics = parsed.karakteristikList || [];
  const charIcons: Record<string, string> = {
    'Umur Panen': 'ri-calendar-line',
    'Potensi Hasil': 'ri-plant-line',
    'Bobot Buah': 'ri-scales-3-line',
    'Tingkat Kemanisan (Brix)': 'ri-pie-chart-line',
    'Bentuk Buah': 'ri-shape-line',
    'Warna Kulit': 'ri-drop-line',
    'Warna Daging': 'ri-sun-line',
    'Diameter Buah': 'ri-ruler-line',
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-semibold border border-emerald-100">
            <i className="ri-plant-line"></i>
          </div>
          <h2 className="text-sm font-bold text-gray-900">
            Detail Varietas / Kode Benih
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          title="Tutup Detail"
        >
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 divide-y divide-gray-100">
        {/* Top Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-emerald-50 border-2 border-emerald-100 flex-shrink-0 flex items-center justify-center shadow-xs">
            {parsed.image ? (
              <img
                src={parsed.image}
                alt={parsed.namaVarietas}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-lime-100 to-emerald-200 flex items-center justify-center text-emerald-700 text-2xl font-bold">
                <i className={commIcon.icon}></i>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-base font-bold text-gray-900 tracking-tight">
                {parsed.kodeVarietas}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isAktif
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAktif ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
                {parsed.status}
              </span>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-1.5">
              {parsed.commodity?.namaKomoditas || 'Melon'}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded text-[10px] font-medium">
              <i className="ri-leaf-line text-[10px]"></i>
              {kelompok}
            </span>
          </div>
        </div>

        {/* Section 1: Informasi Benih */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-900">
            <i className="ri-information-line text-emerald-600"></i>
            <span>Informasi Benih</span>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Kode Benih</span>
              <span className="font-mono font-bold text-gray-800">
                {parsed.kodeVarietas}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Komoditas</span>
              <span className="font-semibold text-gray-800">
                {parsed.commodity?.namaKomoditas || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Kelompok Tanaman</span>
              <span className="font-medium text-gray-700">{kelompok}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isAktif
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAktif ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                ></span>
                {parsed.status}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Nama / Merk Varietas */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              <i className="ri-price-tag-3-line text-emerald-600"></i>
              <span>Nama / Merk Varietas</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                {parsed.brands?.length || 1} brand
              </span>
            </div>
            <button
              type="button"
              onClick={handleEditClick}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-2">
            {(parsed.brands && parsed.brands.length > 0
              ? parsed.brands
              : [
                  {
                    id: '1',
                    namaMerk: parsed.namaVarietas,
                    tipe: 'Merk',
                    status: parsed.status,
                  },
                ]
            ).map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-2.5 bg-gray-50/70 hover:bg-gray-100/70 border border-gray-200/70 rounded-xl text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                    <i className="ri-record-circle-line"></i>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {brand.namaMerk}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      brand.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {brand.status}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-gray-200/80 text-gray-600 text-[10px] font-medium">
                    {brand.tipe || 'Merk'}
                  </span>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Karakteristik Utama */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-900">
            <i className="ri-file-list-3-line text-emerald-600"></i>
            <span>Karakteristik Utama</span>
          </div>

          <div className="space-y-2 text-xs">
            {characteristics.slice(0, 7).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-0.5"
              >
                <div className="flex items-center gap-2 text-gray-500">
                  <i
                    className={`${
                      charIcons[item.parameter] || 'ri-checkbox-blank-circle-line'
                    } text-gray-400 text-xs`}
                  ></i>
                  <span>{item.parameter}</span>
                </div>
                <span className="font-medium text-gray-800">
                  {item.nilai} {item.satuan !== '-' ? item.satuan : ''}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleEditClick}
            className="w-full mt-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Lihat Detail Karakteristik</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>

        {/* Section 4: Quick Category Links */}
        <div className="pt-4">
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleEditClick}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700 transition-all text-center gap-1"
            >
              <i className="ri-seedling-line text-base text-emerald-600"></i>
              <span className="text-[10px] font-semibold">Produksi</span>
            </button>

            <button
              type="button"
              onClick={handleEditClick}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700 transition-all text-center gap-1"
            >
              <i className="ri-shield-check-line text-base text-emerald-600"></i>
              <span className="text-[10px] font-semibold">QC & Standar</span>
            </button>

            <button
              type="button"
              onClick={handleEditClick}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700 transition-all text-center gap-1"
            >
              <i className="ri-archive-line text-base text-emerald-600"></i>
              <span className="text-[10px] font-semibold">Inventory</span>
            </button>

            <button
              type="button"
              onClick={handleEditClick}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700 transition-all text-center gap-1"
            >
              <i className="ri-file-text-line text-base text-emerald-600"></i>
              <span className="text-[10px] font-semibold">Dokumen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2.5 flex-shrink-0">
        <button
          type="button"
          onClick={handleEditClick}
          className="flex-1 py-2 px-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i className="ri-edit-line text-sm"></i>
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={handleEditClick}
          className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <i className="ri-file-list-line text-sm"></i>
          <span>Lihat Detail</span>
        </button>
      </div>
    </div>
  );
}
