"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Variety, VarietyCharacteristicItem } from '@/app/types/variety';
import { parseVarietyData, getCommodityIcon } from '../varietyHelper';

interface DetailVarietasPanelProps {
  variety: Variety;
  onClose: () => void;
  onEdit?: (variety: Variety, targetTab?: string) => void;
  isLoading?: boolean;
}

type ActiveSectionType = 'karakteristik' | 'produksi' | 'qc' | 'inventory' | 'dokumen';

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

  // Active section state for the detail info area
  const [activeSection, setActiveSection] = useState<ActiveSectionType>('karakteristik');

  // Reset to 'karakteristik' whenever the viewed variety changes
  useEffect(() => {
    setActiveSection('karakteristik');
  }, [variety.id]);

  const handleEditClick = (targetTab: string = activeSection) => {
    if (onEdit) {
      onEdit(parsed, targetTab);
    } else {
      router.push(`/master/varietas/tambah?id=${parsed.id}&tab=${targetTab}`);
    }
  };

  // Helper for matching icons based on characteristic parameter name
  const getParamIcon = (paramName: string) => {
    const p = (paramName || '').toLowerCase();
    if (p.includes('umur') || p.includes('panen')) return 'ri-calendar-line';
    if (p.includes('potensi') || p.includes('hasil')) return 'ri-plant-line';
    if (p.includes('bobot') || p.includes('berat')) return 'ri-scales-3-line';
    if (p.includes('manis') || p.includes('brix')) return 'ri-pie-chart-line';
    if (p.includes('bentuk')) return 'ri-shape-line';
    if (p.includes('kulit')) return 'ri-drop-line';
    if (p.includes('daging')) return 'ri-sun-line';
    if (
      p.includes('diameter') ||
      p.includes('ukuran') ||
      p.includes('panjang') ||
      p.includes('tinggi')
    ) {
      return 'ri-ruler-line';
    }
    if (p.includes('warna')) return 'ri-palette-line';
    if (p.includes('rasa') || p.includes('aroma')) return 'ri-heart-line';
    if (p.includes('tahan') || p.includes('resist')) return 'ri-shield-line';
    return 'ri-checkbox-blank-circle-line';
  };

  // 1. Karakteristik: HANYA parameter yang DIPILIH, DIISI, dan AKTIF
  const activeAndFilledCharacteristics = useMemo(() => {
    const list = parsed.karakteristikList || [];
    const filtered = list.filter((item) => {
      // Aktif (isUsed !== false dan status bukan Tidak Aktif / Nonaktif)
      const isActive =
        item.isUsed !== false &&
        item.status !== 'Tidak Aktif' &&
        item.status !== 'Nonaktif' &&
        (item as any).isActive !== false;

      // Diisi (nilai bukan null, undefined, '', atau '-')
      if (item.nilai === undefined || item.nilai === null) return false;
      const valStr = String(item.nilai).trim();
      const isFilled =
        valStr !== '' &&
        valStr !== '-' &&
        valStr.toLowerCase() !== 'null' &&
        valStr.toLowerCase() !== 'undefined';

      return isActive && isFilled;
    });

    if (filtered.length > 0) return filtered;

    // Fallback bila varietas lama belum punya karakteristikList terstruktur di metadata
    const fallbacks: VarietyCharacteristicItem[] = [];
    if (parsed.umurTanam && parsed.umurTanam.trim() !== '' && parsed.umurTanam !== '-') {
      fallbacks.push({
        id: 'fb-umur',
        parameter: 'Umur Panen',
        nilai: parsed.umurTanam,
        satuan: 'HST',
        isUsed: true,
      });
    }
    if (parsed.potensiHasil && parsed.potensiHasil.trim() !== '' && parsed.potensiHasil !== '-') {
      fallbacks.push({
        id: 'fb-potensi',
        parameter: 'Potensi Hasil',
        nilai: parsed.potensiHasil,
        satuan: 'Ton/Ha',
        isUsed: true,
      });
    }
    if (parsed.tinggiTanaman && parsed.tinggiTanaman.trim() !== '' && parsed.tinggiTanaman !== '-') {
      fallbacks.push({
        id: 'fb-tinggi',
        parameter: 'Tinggi Tanaman',
        nilai: parsed.tinggiTanaman,
        satuan: 'cm',
        isUsed: true,
      });
    }
    if (parsed.bentukBiji && parsed.bentukBiji.trim() !== '' && parsed.bentukBiji !== '-') {
      fallbacks.push({
        id: 'fb-bentuk',
        parameter: 'Bentuk Buah',
        nilai: parsed.bentukBiji,
        satuan: '-',
        isUsed: true,
      });
    }
    if (parsed.warnaGabah && parsed.warnaGabah.trim() !== '' && parsed.warnaGabah !== '-') {
      fallbacks.push({
        id: 'fb-warna',
        parameter: 'Warna Kulit',
        nilai: parsed.warnaGabah,
        satuan: '-',
        isUsed: true,
      });
    }
    return fallbacks;
  }, [parsed]);

  // 2. Produksi Detail Items (hanya yang terisi)
  const produksiItems = useMemo(() => {
    const prod = parsed.produksiParam || {};
    const items: { label: string; value: string; icon: string }[] = [];

    const umur = prod.umurPanen || parsed.umurTanam;
    if (umur && umur !== '-') {
      items.push({
        label: 'Umur Panen',
        value: `${umur} ${prod.satuanUmurPanen || 'HST'}`,
        icon: 'ri-calendar-line',
      });
    }

    const hasil = prod.perkiraanHasil || parsed.potensiHasil;
    if (hasil && hasil !== '-') {
      items.push({
        label: 'Perkiraan Hasil',
        value: `${hasil} ${prod.satuanPerkiraanHasil && !hasil.includes(prod.satuanPerkiraanHasil) ? prod.satuanPerkiraanHasil : ''}`.trim(),
        icon: 'ri-plant-line',
      });
    }

    const target = prod.targetProduksi;
    if (target && target !== '-') {
      items.push({
        label: 'Target Produksi',
        value: `${target} ${prod.satuanTargetProduksi || 'kg/ha'}`,
        icon: 'ri-focus-2-line',
      });
    }

    if (prod.populasiTanaman && prod.populasiTanaman !== '-') {
      items.push({
        label: 'Populasi Tanaman',
        value: `${prod.populasiTanaman} ${prod.satuanPopulasi || 'tanaman/ha'}`,
        icon: 'ri-community-line',
      });
    }

    if (prod.kebutuhanBenih && prod.kebutuhanBenih !== '-') {
      items.push({
        label: 'Kebutuhan Benih',
        value: `${prod.kebutuhanBenih} ${prod.satuanKebutuhanBenih || 'kg/ha'}`,
        icon: 'ri-copper-coin-line',
      });
    }

    if (prod.jarakTanam && prod.jarakTanam !== '-') {
      items.push({
        label: 'Jarak Tanam',
        value: `${prod.jarakTanam} ${prod.satuanJarakTanam || 'cm'}`,
        icon: 'ri-ruler-2-line',
      });
    }

    if (prod.musimTanam && prod.musimTanam !== '-') {
      items.push({
        label: 'Musim Tanam',
        value: prod.musimTanam,
        icon: 'ri-sun-cloudy-line',
      });
    }

    if (prod.tingkatKeberhasilan && prod.tingkatKeberhasilan !== '-') {
      items.push({
        label: 'Tingkat Keberhasilan',
        value: `${prod.tingkatKeberhasilan}%`,
        icon: 'ri-percent-line',
      });
    }

    if (prod.jarakIsolasi && prod.jarakIsolasi !== '-') {
      items.push({
        label: 'Jarak Isolasi',
        value: `${prod.jarakIsolasi} ${prod.satuanJarakIsolasi || 'meter'}`,
        icon: 'ri-compass-3-line',
      });
    }

    const sumber = prod.sumberBenihAwal || parsed.sumberBenih;
    if (sumber && sumber !== '-') {
      items.push({
        label: 'Sumber Benih Awal',
        value: sumber,
        icon: 'ri-seedling-line',
      });
    }

    if (prod.standarProduksi && prod.standarProduksi !== '-') {
      items.push({
        label: 'Standar Produksi',
        value: prod.standarProduksi,
        icon: 'ri-award-line',
      });
    }

    return items;
  }, [parsed]);

  // 3. QC & Standar Detail Items (hanya yang aktif/terisi)
  const qcItems = useMemo(() => {
    const qc = parsed.qcConfig || {};
    const items: { label: string; value: string; icon: string }[] = [];

    if (qc.statusQc) {
      items.push({
        label: 'Status QC',
        value: qc.statusQc,
        icon: 'ri-shield-check-line',
      });
    }

    if (qc.metodePengujian && qc.metodePengujian !== '-') {
      items.push({
        label: 'Metode Pengujian',
        value: qc.metodePengujian,
        icon: 'ri-flask-line',
      });
    }

    if (qc.frekuensiPengujian && qc.frekuensiPengujian !== '-') {
      items.push({
        label: 'Frekuensi Pengujian',
        value: qc.frekuensiPengujian,
        icon: 'ri-repeat-line',
      });
    }

    if (qc.sampling && qc.sampling !== '-') {
      items.push({
        label: 'Sampling',
        value: qc.sampling,
        icon: 'ri-test-tube-line',
      });
    }

    if (qc.masaBerlakuHasilUji && qc.masaBerlakuHasilUji !== '-') {
      items.push({
        label: 'Masa Berlaku Hasil Uji',
        value: `${qc.masaBerlakuHasilUji} Bulan`,
        icon: 'ri-time-line',
      });
    }

    if (qc.standarAcuan && qc.standarAcuan !== '-') {
      items.push({
        label: 'Standar Acuan',
        value: qc.standarAcuan,
        icon: 'ri-book-read-line',
      });
    }

    if (qc.noDokumenReferensi && qc.noDokumenReferensi !== '-') {
      items.push({
        label: 'No. SOP Referensi',
        value: qc.noDokumenReferensi,
        icon: 'ri-file-shield-line',
      });
    }

    // QC Parameters terdaftar
    if (qc.parameters && qc.parameters.length > 0) {
      qc.parameters
        .filter((p) => p.isUsed !== false && (p.nilaiMinimal || p.nilaiMaksimal))
        .forEach((p) => {
          let val = '';
          if (p.nilaiMinimal && p.nilaiMaksimal) {
            val = `${p.nilaiMinimal} - ${p.nilaiMaksimal}`;
          } else if (p.nilaiMinimal) {
            val = `Min. ${p.nilaiMinimal}`;
          } else if (p.nilaiMaksimal) {
            val = `Maks. ${p.nilaiMaksimal}`;
          }
          if (p.satuan && p.satuan !== '-') val += ` ${p.satuan}`;
          items.push({
            label: p.parameter,
            value: val || '-',
            icon: 'ri-check-double-line',
          });
        });
    }

    return items;
  }, [parsed]);

  // 4. Inventory Detail Items
  const inventoryItems = useMemo(() => {
    const inv = parsed.inventoryConfig || {};
    const items: { label: string; value: string; icon: string }[] = [];

    if (inv.kelolaStok) {
      items.push({
        label: 'Kelola Stok',
        value: inv.kelolaStok,
        icon: 'ri-stock-line',
      });
    }

    if (inv.metodeStok && inv.metodeStok !== '-') {
      items.push({
        label: 'Metode Stok',
        value: inv.metodeStok,
        icon: 'ri-arrow-left-right-line',
      });
    }

    if (inv.minimumStok || inv.maksimumStok) {
      const min = inv.minimumStok || '0';
      const max = inv.maksimumStok || '-';
      items.push({
        label: 'Batas Min / Maks Stok',
        value: `${min} - ${max} ${inv.satuanStok || 'Kg'}`,
        icon: 'ri-scales-line',
      });
    }

    if (inv.satuanStok && inv.satuanStok !== '-') {
      items.push({
        label: 'Satuan Stok Utama',
        value: inv.satuanStok,
        icon: 'ri-scales-3-line',
      });
    }

    if (inv.statusInventory) {
      items.push({
        label: 'Status Inventory',
        value: inv.statusInventory,
        icon: 'ri-checkbox-circle-line',
      });
    }

    if (inv.traceabilityLot) {
      items.push({
        label: 'Traceability Lot',
        value: inv.traceabilityLot,
        icon: 'ri-qr-code-line',
      });
    }

    if (inv.wajibNomorLot) {
      items.push({
        label: 'Wajib No. Lot',
        value: inv.wajibNomorLot,
        icon: 'ri-hashtag',
      });
    }

    if (inv.kemasanList && inv.kemasanList.length > 0) {
      const activePackages = inv.kemasanList.filter((k) => k.status === 'Aktif');
      if (activePackages.length > 0) {
        items.push({
          label: 'Kemasan Terdaftar',
          value: activePackages.map((k) => `${k.kemasan} (${k.isi} ${k.satuan})`).join(', '),
          icon: 'ri-box-3-line',
        });
      }
    }

    return items;
  }, [parsed]);

  // 5. Dokumen List
  const documentsList = useMemo(() => {
    return parsed.documents || [];
  }, [parsed]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white border border-gray-200/80 rounded-xl shadow-2xs p-6 items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs text-gray-500 font-medium">Memuat detail varietas...</span>
      </div>
    );
  }

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
              onClick={() => handleEditClick('brands')}
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

        {/* Section 3: Tempat Peletakan Info Detail (Karakteristik Utama / Produksi / QC & Standar / Inventory / Dokumen) */}
        <div className="pt-4">
          {/* Section 3 Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
              {activeSection === 'karakteristik' && (
                <>
                  <i className="ri-file-list-3-line text-emerald-600"></i>
                  <span>Karakteristik Utama</span>
                </>
              )}
              {activeSection === 'produksi' && (
                <>
                  <i className="ri-seedling-line text-emerald-600"></i>
                  <span>Informasi Produksi</span>
                </>
              )}
              {activeSection === 'qc' && (
                <>
                  <i className="ri-shield-check-line text-emerald-600"></i>
                  <span>QC & Standar Mutu</span>
                </>
              )}
              {activeSection === 'inventory' && (
                <>
                  <i className="ri-archive-line text-emerald-600"></i>
                  <span>Informasi Inventory</span>
                </>
              )}
              {activeSection === 'dokumen' && (
                <>
                  <i className="ri-file-text-line text-emerald-600"></i>
                  <span>Dokumen Varietas</span>
                </>
              )}
            </div>

            {/* Jika salah satu selain karakteristik dipilih, sediakan juga pintasan kembali di header */}
            {activeSection !== 'karakteristik' && (
              <button
                type="button"
                onClick={() => setActiveSection('karakteristik')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 transition-colors"
                title="Kembali ke Karakteristik Utama"
              >
                <i className="ri-arrow-left-line text-xs"></i>
                <span>Karakteristik</span>
              </button>
            )}
          </div>

          {/* Section 3 Content Body */}
          <div className="space-y-2 text-xs">
            {/* View A: Karakteristik Utama (Hanya parameter yang dipilih, diisi, dan aktif) */}
            {activeSection === 'karakteristik' && (
              <>
                {activeAndFilledCharacteristics.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-3 text-center">
                    Belum ada parameter karakteristik yang dipilih, diisi, dan aktif.
                  </p>
                ) : (
                  activeAndFilledCharacteristics.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-gray-500 min-w-0 pr-2">
                        <i
                          className={`${getParamIcon(item.parameter)} text-gray-400 text-xs flex-shrink-0`}
                        ></i>
                        <span className="truncate">{item.parameter}</span>
                      </div>
                      <span className="font-medium text-gray-800 text-right flex-shrink-0">
                        {item.nilai} {item.satuan && item.satuan !== '-' ? item.satuan : ''}
                      </span>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={() => handleEditClick('karakteristik')}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat Detail Karakteristik</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )}

            {/* View B: Detail Produksi */}
            {activeSection === 'produksi' && (
              <>
                {produksiItems.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-3 text-center">
                    Belum ada informasi parameter produksi yang diisi.
                  </p>
                ) : (
                  produksiItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-gray-500 min-w-0 pr-2">
                        <i className={`${item.icon} text-gray-400 text-xs flex-shrink-0`}></i>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="font-medium text-gray-800 text-right flex-shrink-0">
                        {item.value}
                      </span>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={() => handleEditClick('produksi')}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat Detail Produksi</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )}

            {/* View C: Detail QC & Standar */}
            {activeSection === 'qc' && (
              <>
                {qcItems.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-3 text-center">
                    Belum ada parameter QC & standar yang diatur.
                  </p>
                ) : (
                  qcItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-gray-500 min-w-0 pr-2">
                        <i className={`${item.icon} text-gray-400 text-xs flex-shrink-0`}></i>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="font-medium text-gray-800 text-right flex-shrink-0">
                        {item.value}
                      </span>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={() => handleEditClick('qc')}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat Detail QC & Standar</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )}

            {/* View D: Detail Inventory */}
            {activeSection === 'inventory' && (
              <>
                {inventoryItems.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-3 text-center">
                    Belum ada informasi konfigurasi inventory.
                  </p>
                ) : (
                  inventoryItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-2 text-gray-500 min-w-0 pr-2">
                        <i className={`${item.icon} text-gray-400 text-xs flex-shrink-0`}></i>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="font-medium text-gray-800 text-right flex-shrink-0">
                        {item.value}
                      </span>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={() => handleEditClick('inventory')}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat Detail Inventory</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )}

            {/* View E: Detail Dokumen */}
            {activeSection === 'dokumen' && (
              <>
                {documentsList.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-3 text-center">
                    Belum ada dokumen yang dilampirkan.
                  </p>
                ) : (
                  documentsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70 border border-gray-200/70 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <i className="ri-file-text-line text-emerald-600 text-base flex-shrink-0"></i>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">{doc.namaDokumen}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {doc.nomorDokumen || '-'} &bull; {doc.jenisDokumen || 'Dokumen'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">
                        {doc.fileSize || '-'}
                      </span>
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={() => handleEditClick('dokumen')}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60 rounded-xl border border-emerald-200/60 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat Detail Dokumen</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Section 4: Tombol Kategori Di Bawahnya */}
        {/* Jika salah satu dipilih, tombol karakteristik akan muncul di deretan tombol ini */}
        <div className="pt-4">
          <div
            className={`grid ${
              activeSection === 'karakteristik' ? 'grid-cols-4' : 'grid-cols-5'
            } gap-1.5 sm:gap-2 transition-all`}
          >
            {/* Tombol Karakteristik: HANYA muncul jika salah satu selain karakteristik dipilih */}
            {activeSection !== 'karakteristik' && (
              <button
                type="button"
                onClick={() => setActiveSection('karakteristik')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 hover:text-emerald-900 transition-all text-center gap-1 shadow-2xs group"
                title="Tampilkan Karakteristik Utama"
              >
                <i className="ri-file-list-3-line text-base text-emerald-600 group-hover:scale-110 transition-transform"></i>
                <span className="text-[9.5px] font-bold leading-tight truncate max-w-full">
                  Karakteristik
                </span>
              </button>
            )}

            {/* Tombol Produksi */}
            <button
              type="button"
              onClick={() => setActiveSection('produksi')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center gap-1 transition-all ${
                activeSection === 'produksi'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-semibold'
                  : 'bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700'
              }`}
              title="Lihat Informasi Produksi"
            >
              <i
                className={`ri-seedling-line text-base ${
                  activeSection === 'produksi' ? 'text-white' : 'text-emerald-600'
                }`}
              ></i>
              <span className="text-[9.5px] font-semibold leading-tight truncate max-w-full">
                Produksi
              </span>
            </button>

            {/* Tombol QC & Standar */}
            <button
              type="button"
              onClick={() => setActiveSection('qc')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center gap-1 transition-all ${
                activeSection === 'qc'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-semibold'
                  : 'bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700'
              }`}
              title="Lihat QC & Standar"
            >
              <i
                className={`ri-shield-check-line text-base ${
                  activeSection === 'qc' ? 'text-white' : 'text-emerald-600'
                }`}
              ></i>
              <span className="text-[9.5px] font-semibold leading-tight truncate max-w-full">
                QC & Standar
              </span>
            </button>

            {/* Tombol Inventory */}
            <button
              type="button"
              onClick={() => setActiveSection('inventory')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center gap-1 transition-all ${
                activeSection === 'inventory'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-semibold'
                  : 'bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700'
              }`}
              title="Lihat Informasi Inventory"
            >
              <i
                className={`ri-archive-line text-base ${
                  activeSection === 'inventory' ? 'text-white' : 'text-emerald-600'
                }`}
              ></i>
              <span className="text-[9.5px] font-semibold leading-tight truncate max-w-full">
                Inventory
              </span>
            </button>

            {/* Tombol Dokumen */}
            <button
              type="button"
              onClick={() => setActiveSection('dokumen')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center gap-1 transition-all ${
                activeSection === 'dokumen'
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-semibold'
                  : 'bg-gray-50 hover:bg-emerald-50 border border-gray-200/70 hover:border-emerald-200 text-gray-600 hover:text-emerald-700'
              }`}
              title="Lihat Dokumen Varietas"
            >
              <i
                className={`ri-file-text-line text-base ${
                  activeSection === 'dokumen' ? 'text-white' : 'text-emerald-600'
                }`}
              ></i>
              <span className="text-[9.5px] font-semibold leading-tight truncate max-w-full">
                Dokumen
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2.5 flex-shrink-0">
        <button
          type="button"
          onClick={() => handleEditClick(activeSection)}
          className="flex-1 py-2 px-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
        >
          <i className="ri-edit-line text-sm"></i>
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => handleEditClick(activeSection)}
          className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <i className="ri-file-list-line text-sm"></i>
          <span>Lihat Detail</span>
        </button>
      </div>
    </div>
  );
}
