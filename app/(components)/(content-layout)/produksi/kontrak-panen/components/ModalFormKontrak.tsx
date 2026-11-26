import React, { useEffect, useMemo, useState } from 'react';
import { KontrakPanenFormData } from '@/app/types/kontrakPanen';

interface ModalFormKontrakProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  formData: KontrakPanenFormData;
  setFormData: React.Dispatch<React.SetStateAction<KontrakPanenFormData>>;
  commodityList: { id: string; namaKomoditas: string }[];
  varietyList: { id: string; namaVarietas: string; commodityId: string; umurTanam?: string }[];
  harvestTypesList: any[];
  loadingHarvestTypes?: boolean;
  onFetchHarvestTypes: (varietyId?: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const standardUmurTanamMap: Record<string, { umur: number; text: string }> = {
  'melon tere f1': { umur: 70, text: '70 - 80 HST' },
  'melon': { umur: 70, text: '70 - 80 HST' },
  'cabai keriting': { umur: 90, text: '90 - 110 HST' },
  'cabai rawit': { umur: 95, text: '90 - 100 HST' },
  'inpari 32': { umur: 115, text: '115 - 125 HST' },
  'padi': { umur: 115, text: '115 - 125 HST' },
  'tomat servo f1': { umur: 85, text: '80 - 85 HST' },
  'tomat': { umur: 85, text: '80 - 85 HST' },
  'bima brebes': { umur: 100, text: '95 - 105 HST' },
  'bawang merah': { umur: 100, text: '95 - 105 HST' },
  'kacang panjang': { umur: 60, text: '55 - 65 HST' },
  'jagung bisi 18': { umur: 100, text: '100 - 105 HST' },
  'jagung': { umur: 100, text: '100 - 105 HST' },
  'kangkung bisi': { umur: 30, text: '25 - 30 HST' },
  'kangkung': { umur: 30, text: '25 - 30 HST' },
};

const resolveUmurTanam = (namaVarietas: string, umurTanamDb?: string | null) => {
  if (umurTanamDb) {
    const rangeMatch = umurTanamDb.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (rangeMatch) {
      return {
        umur: parseInt(rangeMatch[1], 10),
        rawText: umurTanamDb,
      };
    }
    const singleMatch = umurTanamDb.match(/\d+/);
    if (singleMatch) {
      return {
        umur: parseInt(singleMatch[0], 10),
        rawText: umurTanamDb,
      };
    }
  }

  const lower = (namaVarietas || '').toLowerCase().trim();
  for (const [key, val] of Object.entries(standardUmurTanamMap)) {
    if (lower.includes(key) || key.includes(lower)) {
      return {
        umur: val.umur,
        rawText: val.text,
      };
    }
  }

  return null;
};

export default function ModalFormKontrak({
  isOpen,
  mode,
  formData,
  setFormData,
  commodityList,
  varietyList,
  harvestTypesList,
  loadingHarvestTypes = false,
  onFetchHarvestTypes,
  onClose,
  onSubmit,
  isLoading = false,
}: ModalFormKontrakProps) {
  const [autoPriceNotice, setAutoPriceNotice] = useState<string | null>(null);
  const [autoUmurNotice, setAutoUmurNotice] = useState<string | null>(null);

  // 1. Varietas strictly filtered by selected Komoditas
  const filteredVarieties = useMemo(() => {
    if (!formData.commodityId && !formData.komoditas) return [];
    return varietyList.filter((v) => {
      if (formData.commodityId && v.commodityId === formData.commodityId) return true;
      if (formData.komoditas) {
        const comm = commodityList.find((c) => c.namaKomoditas === formData.komoditas);
        if (comm && v.commodityId === comm.id) return true;
      }
      return false;
    });
  }, [varietyList, commodityList, formData.commodityId, formData.komoditas]);

  // When Komoditas changes
  const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIdOrName = e.target.value;
    const found = commodityList.find(
      (c) => c.id === selectedIdOrName || c.namaKomoditas === selectedIdOrName
    );

    const newCommId = found ? found.id : '';
    const newCommName = found ? found.namaKomoditas : selectedIdOrName;

    setFormData((prev) => ({
      ...prev,
      komoditas: newCommName,
      commodityId: newCommId,
      varietas: '',
      varietyId: '',
      harvestTypeId: '',
      tipePanenan: '',
      nilaiKontrak: '',
      umurPanen: '',
    }));
    setAutoPriceNotice(null);
    setAutoUmurNotice(null);
    onFetchHarvestTypes('');
  };

  // When Varietas changes
  const handleVarietyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVarNameOrId = e.target.value;
    const foundVar = varietyList.find(
      (v) => v.id === selectedVarNameOrId || v.namaVarietas === selectedVarNameOrId
    );

    if (!foundVar) {
      setFormData((prev) => ({
        ...prev,
        varietas: selectedVarNameOrId,
        varietyId: '',
        harvestTypeId: '',
        tipePanenan: '',
        nilaiKontrak: '',
        umurPanen: '',
      }));
      setAutoPriceNotice(null);
      setAutoUmurNotice(null);
      onFetchHarvestTypes('');
      return;
    }

    // Auto extract umur panen from umur tanam varietas
    const umurResult = resolveUmurTanam(foundVar.namaVarietas, foundVar.umurTanam);

    let newUmur = formData.umurPanen;
    let notice = null;
    if (umurResult) {
      newUmur = umurResult.umur;
      notice = `Umur panen ${umurResult.umur} HST diambil otomatis dari umur tanam varietas (${umurResult.rawText})`;
    }

    setFormData((prev) => ({
      ...prev,
      varietas: foundVar.namaVarietas,
      varietyId: foundVar.id,
      harvestTypeId: '',
      tipePanenan: '',
      nilaiKontrak: '',
      umurPanen: newUmur,
    }));
    setAutoUmurNotice(notice);
    setAutoPriceNotice(null);

    // Fetch master harvest types for this specific variety
    onFetchHarvestTypes(foundVar.id);
  };

  // When Tipe Panen from Master is selected
  const handleHarvestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVal = e.target.value;
    if (!selectedVal) {
      setFormData((prev) => ({
        ...prev,
        harvestTypeId: '',
        tipePanenan: '',
        nilaiKontrak: '',
      }));
      setAutoPriceNotice(null);
      return;
    }

    // Check if it matches a master harvest type
    const foundHT = harvestTypesList.find(
      (ht) => ht.id === selectedVal || ht.nama === selectedVal || ht.kode === selectedVal
    );

    if (foundHT) {
      const latestPrice =
        foundHT.prices && foundHT.prices.length > 0 ? foundHT.prices[0].harga : null;

      setFormData((prev) => ({
        ...prev,
        harvestTypeId: foundHT.id,
        tipePanenan: foundHT.nama,
        nilaiKontrak: latestPrice !== null && latestPrice !== undefined ? latestPrice : prev.nilaiKontrak,
      }));

      if (latestPrice !== null && latestPrice !== undefined) {
        setAutoPriceNotice(
          `Harga kontrak Rp ${latestPrice.toLocaleString('id-ID')} diambil otomatis dari Master Tipe Panen (${foundHT.nama})`
        );
      } else {
        setAutoPriceNotice(null);
      }
    } else {
      // Fallback manual or standard option
      setFormData((prev) => ({
        ...prev,
        harvestTypeId: '',
        tipePanenan: selectedVal,
      }));
      setAutoPriceNotice(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Box */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h4 className="text-base font-bold text-gray-900 mb-0">
                {mode === 'create' ? 'Tambah Kontrak Panen' : 'Edit Kontrak Panen'}
              </h4>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50/50">
              
              {/* Section 1: Informasi Kontrak */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 pb-2 border-b border-gray-100">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Informasi Kontrak</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* No Kontrak */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      No. Kontrak <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                      placeholder="e.g. KTR-PNH-2026-011"
                      value={formData.noKontrak || ''}
                      onChange={(e) => setFormData({ ...formData, noKontrak: e.target.value })}
                      required
                    />
                  </div>

                  {/* 1. Komoditas Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Komoditas <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={formData.commodityId || formData.komoditas}
                      onChange={handleCommodityChange}
                      required
                    >
                      <option value="">-- Pilih Komoditas --</option>
                      {commodityList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.namaKomoditas}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Varietas Dropdown (Filtered strictly by selected Komoditas) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Varietas <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
                      value={formData.varietyId || formData.varietas}
                      onChange={handleVarietyChange}
                      disabled={!formData.komoditas && !formData.commodityId}
                      required
                    >
                      <option value="">
                        {!formData.komoditas && !formData.commodityId
                          ? '-- Pilih Komoditas Terlebih Dahulu --'
                          : filteredVarieties.length === 0
                          ? '-- Belum ada varietas untuk komoditas ini --'
                          : '-- Pilih Varietas --'}
                      </option>
                      {filteredVarieties.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.namaVarietas} {v.umurTanam ? `(${v.umurTanam})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Tipe Panenan (Diambil dari Master Tipe Panen sesuai varietas yang dipilih) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">
                      Tipe Panenan (Master Tipe Panen) <span className="text-red-500">*</span>
                    </label>
                    {loadingHarvestTypes && (
                      <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <svg className="animate-spin w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        Memuat master tipe panen...
                      </span>
                    )}
                  </div>

                  <select
                    className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2.5 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:bg-gray-100 disabled:text-gray-400 font-medium"
                    value={formData.harvestTypeId || formData.tipePanenan}
                    onChange={handleHarvestTypeChange}
                    disabled={!formData.varietas && !formData.varietyId}
                    required
                  >
                    <option value="">
                      {!formData.varietas && !formData.varietyId
                        ? '-- Pilih Varietas Terlebih Dahulu --'
                        : '-- Pilih Tipe Panen dari Master --'}
                    </option>

                    {/* Master Harvest Types for this variety */}
                    {harvestTypesList && harvestTypesList.length > 0 ? (
                      <optgroup label="Tipe Panen dari Master (Varietas Ini)">
                        {harvestTypesList.map((ht: any) => {
                          const p = ht.prices && ht.prices.length > 0 ? ht.prices[0].harga : null;
                          const formattedP = p !== null ? `Rp ${p.toLocaleString('id-ID')}` : 'Harga belum diatur';
                          return (
                            <option key={ht.id} value={ht.id}>
                              {ht.nama} ({ht.kode}) — Harga Master: {formattedP}
                            </option>
                          );
                        })}
                      </optgroup>
                    ) : null}

                    {/* Fallback standard options if master is not configured yet for variety */}
                    <optgroup label="Opsi Tipe Panen Umum">
                      <option value="Glondong / Fresh">Glondong / Fresh</option>
                      <option value="OC / Benih">OC / Benih</option>
                      <option value="Gelondongan">Gelondongan</option>
                      <option value="Pipil Kering">Pipil Kering</option>
                    </optgroup>
                  </select>

                  {/* Auto-filled price notification */}
                  {autoPriceNotice ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/80 font-medium animate-in fade-in duration-200">
                      <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{autoPriceNotice}</span>
                    </div>
                  ) : harvestTypesList.length === 0 && (formData.varietas || formData.varietyId) && !loadingHarvestTypes ? (
                    <p className="mt-1 text-[11px] text-amber-600 font-normal">
                      ℹ️ Varietas ini belum memiliki tipe panen khusus di Master Tipe Panen. Anda dapat memilih dari opsi umum di atas dan memasukkan harga kontrak secara manual.
                    </p>
                  ) : null}
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    rows={2}
                    className="w-full text-xs rounded-lg border border-gray-200 p-2.5 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Masukkan keterangan atau catatan kontrak panen..."
                    value={formData.keterangan || ''}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 2: Nilai Kontrak */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 pb-2 border-b border-gray-100">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Nilai Kontrak</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Harga Kontrak (Auto-filled from Master Tipe Panen) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Harga Kontrak <span className="text-red-500">*</span>
                      {autoPriceNotice && (
                        <span className="text-[10px] text-emerald-600 font-bold ml-1.5">(Otomatis)</span>
                      )}
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-gray-500 pointer-events-none">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        className={`w-full text-xs rounded-lg border pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-1 font-semibold text-gray-900 ${
                          autoPriceNotice
                            ? 'border-emerald-400 bg-emerald-50/20 focus:border-emerald-500 focus:ring-emerald-500'
                            : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'
                        }`}
                        placeholder="12000"
                        value={formData.nilaiKontrak}
                        onChange={(e) => setFormData({ ...formData, nilaiKontrak: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Fee Kelompok (Inputan tanpa perhitungan apapun) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Fee Kelompok
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-semibold text-gray-500 pointer-events-none">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        className="w-full text-xs rounded-lg border border-gray-200 pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-semibold text-gray-900"
                        placeholder="0"
                        value={formData.feeKelompok !== undefined ? formData.feeKelompok : ''}
                        onChange={(e) => setFormData({ ...formData, feeKelompok: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Satuan */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Satuan <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={formData.satuan}
                      onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                      required
                    >
                      <option value="Kg">Kg</option>
                      <option value="Ton">Ton</option>
                      <option value="Gram">Gram</option>
                      <option value="Kuintal">Kuintal</option>
                    </select>
                  </div>

                  {/* Umur Panen (Auto-filled from Varietas) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Umur Panen <span className="text-red-500">*</span>
                      {autoUmurNotice && (
                        <span className="text-[10px] text-emerald-600 font-bold ml-1.5">(Otomatis dari Varietas)</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="365"
                        className={`w-full text-xs rounded-lg border pl-3 pr-12 py-2 bg-white focus:outline-none focus:ring-1 text-gray-800 font-medium ${
                          autoUmurNotice
                            ? 'border-emerald-400 bg-emerald-50/20 focus:border-emerald-500 focus:ring-emerald-500'
                            : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'
                        }`}
                        placeholder="70"
                        value={formData.umurPanen}
                        onChange={(e) => {
                          setFormData({ ...formData, umurPanen: e.target.value });
                          setAutoUmurNotice(null);
                        }}
                        required
                      />
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-gray-500 pointer-events-none">
                        HST
                      </span>
                    </div>
                    {autoUmurNotice && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/80 font-medium animate-in fade-in duration-200">
                        <svg className="w-3.5 h-3.5 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{autoUmurNotice}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Periode Berlaku */}
              <div className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 pb-2 border-b border-gray-100">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Periode Berlaku</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Berlaku Mulai */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Berlaku Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={formData.periodeMulai}
                      onChange={(e) => setFormData({ ...formData, periodeMulai: e.target.value })}
                      required
                    />
                  </div>

                  {/* Berlaku Sampai */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Berlaku Sampai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={formData.periodeSelesai}
                      onChange={(e) => setFormData({ ...formData, periodeSelesai: e.target.value })}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#078836] hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 focus:outline-none transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Simpan</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
