"use client";

import { buttonClass, iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { qcService } from '@/app/services/qcService';
import { TestParameter, TestMethod } from '@/app/types/qc';

/** Parameter terpilih pada form permintaan; selalu bersumber dari master `test_parameters`. */
export interface FormParameterItem {
  parameterId: string;
  kode: string;
  nama: string;
  kategori?: string | null;
  metodeId?: string | null;
  metode?: string | null;
  standar?: string | null;
  satuan?: string | null;
  definisi?: string | null;
  checked: boolean;
}

export const toFormParameter = (p: TestParameter, checked = true): FormParameterItem => ({
  parameterId: p.id,
  kode: p.kode,
  nama: p.nama,
  kategori: p.kategori,
  metodeId: p.metode?.id ?? p.metodeId ?? null,
  metode: p.metode ? `${p.metode.kode} - ${p.metode.nama}` : null,
  standar: p.batasAcuan ? `${p.batasAcuan} ${p.satuan || ''}`.trim() : null,
  satuan: p.satuan,
  definisi: p.definisi,
  checked,
});

interface ManageParameterUjiModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParameters: FormParameterItem[];
  onApply: (updatedList: FormParameterItem[]) => void;
  dbParameters?: TestParameter[];
  onRefreshDb?: () => Promise<void>;
  komoditas?: string;
  varietas?: string;
}

/**
 * Memeriksa apakah suatu Metode Uji relevan untuk Komoditas atau Varietas tertentu:
 * 1. Metode uji terhubung dengan komoditas permintaan pengujian, ATAU
 * 2. Metode uji terhubung dengan varietas permintaan pengujian, ATAU
 * 3. Metode uji memiliki komoditas global DAN varietas global ("Semua Komoditas" & "Semua Varietas")
 */
export function isMethodMatchingCommodityOrVariety(
  metode: TestMethod | undefined | null,
  komoditasPermintaan?: string | null,
  varietasPermintaan?: string | null
): boolean {
  if (!metode) return false;

  const mKom = (metode.komoditas || '').trim().toLowerCase();
  const mVar = (metode.varietas || '').trim().toLowerCase();

  const isGlobalValue = (val: string) => {
    return (
      val === '' ||
      val === 'semua komoditas' ||
      val === 'semua varietas' ||
      val === 'semua' ||
      val === 'global' ||
      val === 'all' ||
      val === '*' ||
      val === '-'
    );
  };

  const isKomoditasGlobal = isGlobalValue(mKom);
  const isVarietasGlobal = isGlobalValue(mVar);

  // Aturan 1: Metode uji yang memiliki komoditas global dan varietas global
  if (isKomoditasGlobal && isVarietasGlobal) {
    return true;
  }

  // Aturan 2: Terhubung dengan komoditas dari permintaan pengujian
  const reqKom = (komoditasPermintaan || '').trim().toLowerCase();
  if (reqKom && reqKom !== '-' && reqKom !== 'benih') {
    const komList = mKom.split(',').map((k) => k.trim());
    if (komList.includes(reqKom) || mKom.includes(reqKom)) {
      return true;
    }
  }

  // Aturan 3: Terhubung dengan varietas dari permintaan pengujian
  const reqVar = (varietasPermintaan || '').trim().toLowerCase();
  if (reqVar && reqVar !== '-' && reqVar !== 'semua varietas') {
    const varList = mVar.split(',').map((v) => v.trim());
    if (varList.includes(reqVar) || mVar.includes(reqVar)) {
      return true;
    }
  }

  return false;
}

export default function ManageParameterUjiModal({
  isOpen,
  onClose,
  selectedParameters,
  onApply,
  dbParameters: initialDbParameters,
  onRefreshDb,
  komoditas,
  varietas,
}: ManageParameterUjiModalProps) {
  const [dbParameters, setDbParameters] = useState<TestParameter[]>(initialDbParameters || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Load / refresh DB parameters
  const loadParametersFromDb = async () => {
    setIsLoading(true);
    try {
      const res = await qcService.getParameters();
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setDbParameters(list);
    } catch (error) {
      console.error('Error fetching test parameters from database:', error);
      toast.error('Gagal memuat parameter dari database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Sinkronisasi pilihan yang sedang aktif dari parent form
      const currentIds = new Set<string>();
      selectedParameters.forEach((p) => currentIds.add(p.parameterId));
      setSelectedIds(currentIds);
      setSearch('');
      setSelectedCategory('Semua');

      if (!initialDbParameters || initialDbParameters.length === 0) {
        loadParametersFromDb();
      } else {
        setDbParameters(initialDbParameters);
      }
    }
  }, [isOpen, selectedParameters, initialDbParameters]);

  // Parameter yang relevan berdasarkan komoditas/varietas permintaan atau metode uji global
  const applicableParameters = useMemo(() => {
    return dbParameters.filter(
      (p) => p.status !== 'Nonaktif' && isMethodMatchingCommodityOrVariety(p.metode, komoditas, varietas)
    );
  }, [dbParameters, komoditas, varietas]);

  // Kategori yang tersedia berdasarkan parameter yang lolos filter komoditas/varietas
  const categories = useMemo(() => {
    const set = new Set<string>();
    applicableParameters.forEach((p) => {
      if (p.kategori) set.add(p.kategori);
    });
    return ['Semua', ...Array.from(set)];
  }, [applicableParameters]);

  // Parameter terfilter berdasarkan pencarian dan kategori
  const filteredParameters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applicableParameters.filter((p) => {
      const matchSearch =
        !q ||
        p.nama.toLowerCase().includes(q) ||
        p.kode.toLowerCase().includes(q) ||
        (p.kategori || '').toLowerCase().includes(q) ||
        (p.metode?.nama || '').toLowerCase().includes(q) ||
        (p.metode?.kode || '').toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === 'Semua' || p.kategori === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [applicableParameters, search, selectedCategory]);

  const toggleSelect = (param: TestParameter) => {
    const idKey = param.id;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(idKey)) {
        next.delete(idKey);
      } else {
        next.add(idKey);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredParameters.forEach((p) => {
        const idKey = p.id;
        next.add(idKey);
      });
      return next;
    });
  };

  const handleDeselectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredParameters.forEach((p) => {
        const idKey = p.id;
        next.delete(idKey);
      });
      return next;
    });
  };

  // Terapkan parameter yang dipilih ke form permintaan pengujian
  const handleApply = () => {
    const checkedMap = new Map(selectedParameters.map((sp) => [sp.parameterId, sp.checked]));
    const updatedList = dbParameters
      .filter((p) => selectedIds.has(p.id))
      .map((p) => toFormParameter(p, checkedMap.get(p.id) ?? true));

    onApply(updatedList);
    toast.success(`${updatedList.length} parameter pengujian berhasil diterapkan`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-slide-down flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shadow-emerald-200">
                <i className="ri-flask-line text-xl"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800">
                    Pilih Parameter Pengujian
                  </h4>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Database Master QC
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Parameter yang ditampilkan otomatis disaring berdasarkan komoditas/varietas permintaan atau metode uji global.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={iconButtonClass("gray")}
            >
              <i className="ri-close-line" />
            </button>
          </div>

          {/* Subheader Banner: Konteks Komoditas & Varietas */}
          <div className="px-6 py-2.5 border-b border-gray-100 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                <i className="ri-plant-line"></i> {komoditas || 'Semua Komoditas'}
              </span>
              {varietas && varietas !== '-' && (
                <span className="inline-flex items-center gap-1 font-medium text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                  Varietas: {varietas}
                </span>
              )}
              <span className="text-gray-500 hidden md:inline">
                &bull; Menampilkan parameter spesifik dan metode uji standar global
              </span>
            </div>

            <div className="text-xs text-gray-600 flex items-center gap-1.5 self-end sm:self-auto">
              <span className="font-semibold text-emerald-700">{selectedIds.size}</span>
              <span>dipilih dari</span>
              <strong className="text-gray-800">{applicableParameters.length}</strong>
              <span>tersedia</span>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {/* Search & Action Bar */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kode (P001), nama parameter, metode uji, atau kategori..."
                    className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <i className="ri-close-circle-fill"></i>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">

                  <button
                    type="button"
                    onClick={handleSelectAllVisible}
                    className={buttonClass("secondary")}
                  >
                    Pilih Semua
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllVisible}
                    className={buttonClass("secondary")}
                  >
                    Batal Pilih
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await loadParametersFromDb();
                      if (onRefreshDb) await onRefreshDb();
                    }}
                    disabled={isLoading}
                    className={iconButtonClass("gray", "!w-9 !h-9")}
                    title="Segarkan data dari database"
                  >
                    <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-gray-400 mr-1 font-medium">Kategori:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={buttonClass(selectedCategory === cat ? 'primary' : 'secondary', 'sm')}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Table of Database Parameters */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[380px]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/80 text-gray-600 text-xs font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">Pilih</th>
                      <th className="px-4 py-3 w-24">Kode</th>
                      <th className="px-4 py-3">Nama Parameter</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Metode Uji Terkait</th>
                      <th className="px-4 py-3">Batas Acuan / Standar</th>
                      <th className="px-4 py-3 w-20 text-center">Status</th>
                      <th className="px-4 py-3 w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                          <i className="ri-loader-4-line text-2xl animate-spin text-emerald-600 inline-block mb-2"></i>
                          <p className="text-xs">Memuat parameter dari database...</p>
                        </td>
                      </tr>
                    ) : filteredParameters.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                          <i className="ri-flask-line text-3xl mb-2 inline-block text-gray-300"></i>
                          <p className="text-sm font-medium text-gray-600">Tidak ada parameter yang sesuai</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {applicableParameters.length === 0
                              ? `Tidak ditemukan parameter dengan metode uji yang terhubung dengan komoditas "${komoditas || '-'}" atau metode uji global.`
                              : 'Tidak ada parameter yang cocok dengan kata kunci pencarian atau kategori yang dipilih.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredParameters.map((p) => {
                        const idKey = p.id;
                        const isSelected = selectedIds.has(idKey);
                        const categoryColor =
                          p.kategori === 'Fisiologis'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : p.kategori === 'Fisik'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : p.kategori === 'Kesehatan'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200';

                        const isMetodeGlobal =
                          !p.metode?.komoditas ||
                          p.metode.komoditas.toLowerCase() === 'semua komoditas';

                        return (
                          <tr
                            key={idKey}
                            onClick={() => toggleSelect(p)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-emerald-50/60 hover:bg-emerald-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(p)}
                                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                                {p.kode}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-semibold text-gray-900">{p.nama}</div>
                              {p.definisi && (
                                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5" title={p.definisi}>
                                  {p.definisi}
                                </p>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-md border ${categoryColor}`}>
                                {p.kategori || 'Umum'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {p.metode ? (
                                <div>
                                  <span className="font-medium text-gray-800 text-xs">
                                    {p.metode.kode ? `${p.metode.kode} - ` : ''}{p.metode.nama}
                                  </span>
                                  <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                                    <span
                                      className={`inline-block px-1.5 py-0.2 rounded font-medium ${
                                        isMetodeGlobal
                                          ? 'bg-gray-100 text-gray-600'
                                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      }`}
                                    >
                                      {isMetodeGlobal ? 'Metode Global' : p.metode.komoditas}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-800 text-xs">
                              {p.batasAcuan ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded">
                                  {p.batasAcuan} {p.satuan || ''}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  p.status === 'Aktif'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {p.status || 'Aktif'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              {isSelected ? (
                                <button
                                  type="button"
                                  onClick={() => toggleSelect(p)}
                                  className={buttonClass("danger", "sm")}
                                  title="Batalkan pilihan parameter ini"
                                >
                                  <i className="ri-close-line"></i> Batal
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => toggleSelect(p)}
                                  className={buttonClass("outline", "sm")}
                                  title="Tambahkan parameter ini"
                                >
                                  <i className="ri-add-line"></i> Tambah
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Counter status footer note */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <span>
                Menampilkan <strong className="text-gray-700">{filteredParameters.length}</strong> parameter di tabel
              </span>
              <span>
                Total dipilih: <strong className="text-emerald-700">{selectedIds.size} parameter</strong>
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>
                <strong>{selectedIds.size}</strong> parameter akan digunakan dalam permintaan ini
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={buttonClass("secondary")}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                className={buttonClass("primary")}
              >
                <i className="ri-check-line text-lg"></i>
                Terapkan Parameter ({selectedIds.size})
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
