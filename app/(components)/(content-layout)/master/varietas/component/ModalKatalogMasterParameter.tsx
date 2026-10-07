"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import parameterService from '@/app/services/parameterService';
import { MasterParameter, PARAMETER_MODUL_OPTIONS } from '@/app/types/parameter';

interface ModalKatalogMasterParameterProps {
  isOpen: boolean;
  onClose: () => void;
  namaModul?: string; // 'QC' | 'VARIETAS' | 'MONITORING_LAHAN' | 'OFF_TYPE' | 'ALL'
  title?: string;
  subtitle?: string;
  alreadySelectedIds?: string[]; // Parameter IDs or codes already present in the parent form/table
  onAddParameters: (selectedParameters: MasterParameter[]) => void;
  onOpenCreateNew?: () => void; // Optional callback to open modal for adding new master parameter
  zIndex?: string; // Optional z-index class, e.g. 'z-[10000]'
}

const TIPE_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  NUMBER: { label: 'NUMBER', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  RANGE: { label: 'RANGE', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  OPTION: { label: 'OPTION', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  TEXT: { label: 'TEXT', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  BOOLEAN: { label: 'BOOLEAN', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
};

export default function ModalKatalogMasterParameter({
  isOpen,
  onClose,
  namaModul = 'ALL',
  title,
  subtitle,
  alreadySelectedIds = [],
  onAddParameters,
  onOpenCreateNew,
  zIndex = 'z-50',
}: ModalKatalogMasterParameterProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [parameters, setParameters] = useState<MasterParameter[]>([]);
  const [search, setSearch] = useState<string>('');
  const [filterTipe, setFilterTipe] = useState<string>('ALL');
  const [filterModul, setFilterModul] = useState<string>(namaModul);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Set of already selected IDs/codes (lowercased/trimmed for robust lookup)
  const existingSet = useMemo(() => {
    return new Set(alreadySelectedIds.map((id) => (id || '').trim().toLowerCase()));
  }, [alreadySelectedIds]);

  // Fetch parameters from Master
  const fetchParameters = useCallback(async () => {
    setLoading(true);
    try {
      const queryModul = filterModul && filterModul !== 'ALL' ? filterModul : undefined;
      const res = await parameterService.getParameters({
        namaModul: queryModul,
        status: 'Aktif',
        pageSize: 200,
      });

      if (res.status === 'success' && Array.isArray(res.data)) {
        setParameters(res.data);
      } else {
        setParameters([]);
      }
    } catch (err: any) {
      console.error('Error fetching master parameters for catalog:', err);
      toast.error('Gagal memuat katalog master parameter');
      setParameters([]);
    } finally {
      setLoading(false);
    }
  }, [filterModul]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFilterTipe('ALL');
      setFilterModul(namaModul);
      setSelectedIds(new Set());
      fetchParameters();
    }
  }, [isOpen, namaModul, fetchParameters]);

  // Check if a parameter is already added in the parent list
  const isAlreadyAdded = useCallback(
    (param: MasterParameter) => {
      const idKey = (param.id || '').trim().toLowerCase();
      const kodeKey = (param.kode || '').trim().toLowerCase();
      const namaKey = (param.nama || '').trim().toLowerCase();
      return (
        existingSet.has(idKey) ||
        existingSet.has(kodeKey) ||
        existingSet.has(namaKey)
      );
    },
    [existingSet]
  );

  // Filtered parameters by search and type
  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parameters.filter((param) => {
      const matchSearch =
        !q ||
        param.nama.toLowerCase().includes(q) ||
        param.kode.toLowerCase().includes(q) ||
        (param.deskripsi || '').toLowerCase().includes(q);

      const matchTipe = filterTipe === 'ALL' || param.tipeNilai === filterTipe;

      return matchSearch && matchTipe;
    });
  }, [parameters, search, filterTipe]);

  // Available parameters (that can be checked, i.e., not already in parent list)
  const selectableAvailableList = useMemo(() => {
    return filteredList.filter((p) => !isAlreadyAdded(p));
  }, [filteredList, isAlreadyAdded]);

  // Toggle selection for one parameter
  const toggleSelect = (paramId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(paramId)) {
        next.delete(paramId);
      } else {
        next.add(paramId);
      }
      return next;
    });
  };

  // Select all visible selectable parameters
  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      selectableAvailableList.forEach((p) => next.add(p.id));
      return next;
    });
  };

  // Deselect all visible
  const handleDeselectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      selectableAvailableList.forEach((p) => next.delete(p.id));
      return next;
    });
  };

  // Apply selected items
  const handleApply = () => {
    if (selectedIds.size === 0) {
      toast.warning('Pilih minimal 1 parameter untuk ditambahkan');
      return;
    }

    const chosen = parameters.filter((p) => selectedIds.has(p.id));
    onAddParameters(chosen);
    onClose();
  };

  if (!isOpen) return null;

  const defaultTitle =
    title ||
    (namaModul === 'QC'
      ? 'Katalog Master Parameter QC'
      : namaModul === 'VARIETAS'
      ? 'Katalog Master Parameter Karakteristik'
      : 'Katalog Master Parameter');

  const defaultSubtitle =
    subtitle ||
    (namaModul === 'QC'
      ? 'Pilih parameter standar mutu pengujian yang ingin diterapkan pada varietas ini.'
      : namaModul === 'VARIETAS'
      ? 'Pilih parameter karakteristik morfologi & agronomi yang ingin diterapkan.'
      : 'Pilih parameter dari database master untuk dimasukkan ke dalam daftar.');

  return (
    <div className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shadow-xs">
              <i className="ri-folder-shared-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{defaultTitle}</span>
                {namaModul && namaModul !== 'ALL' && (
                  <span className="text-[11px] font-semibold bg-emerald-800/80 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Modul {namaModul}
                  </span>
                )}
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5 line-clamp-1">{defaultSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            title="Tutup Katalog"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Toolbar: Search, Filters & Quick Actions */}
        <div className="px-6 py-3.5 bg-gray-50/90 border-b border-gray-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Left: Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, kode, atau deskripsi parameter..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-circle-fill text-sm"></i>
              </button>
            )}
          </div>

          {/* Right Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Modul (hanya tampil jika namaModul === 'ALL') */}
            {namaModul === 'ALL' && (
              <div className="relative">
                <select
                  value={filterModul}
                  onChange={(e) => setFilterModul(e.target.value)}
                  className="pl-3 pr-7 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs"
                >
                  <option value="ALL">Semua Modul</option>
                  {PARAMETER_MODUL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            )}

            {/* Filter Tipe Nilai */}
            <div className="relative">
              <select
                value={filterTipe}
                onChange={(e) => setFilterTipe(e.target.value)}
                className="pl-3 pr-7 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="ALL">Semua Tipe Nilai</option>
                <option value="NUMBER">NUMBER</option>
                <option value="RANGE">RANGE</option>
                <option value="OPTION">OPTION</option>
                <option value="TEXT">TEXT</option>
                <option value="BOOLEAN">BOOLEAN</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Tombol Buat Master Baru jika belum ada */}
            {onOpenCreateNew && (
              <button
                type="button"
                onClick={onOpenCreateNew}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 font-semibold rounded-xl transition-all shadow-2xs hover:border-emerald-400"
                title="Buat definisi parameter baru di database Master"
              >
                <i className="ri-add-line font-bold"></i>
                <span className="hidden sm:inline">Definisi Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Selection Status Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <span>
              Menampilkan <strong>{filteredList.length}</strong> dari <strong>{parameters.length}</strong> parameter
            </span>
            {selectedIds.size > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                <i className="ri-checkbox-circle-fill text-xs text-emerald-600"></i>
                {selectedIds.size} dipilih
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={selectableAvailableList.length === 0}
              className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-50 rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Pilih Semua ({selectableAvailableList.length})
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={handleDeselectAll}
              disabled={selectedIds.size === 0}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Batal Pilihan
            </button>
          </div>
        </div>

        {/* Parameter List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-gray-500 space-y-3">
              <i className="ri-loader-4-line text-4xl animate-spin text-emerald-600"></i>
              <p className="text-sm font-medium">Memuat katalog master parameter...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center text-2xl mx-auto">
                <i className="ri-search-eye-line"></i>
              </div>
              <p className="text-sm font-semibold text-gray-700">Tidak ada parameter yang sesuai</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau filter tipe nilai di atas.
              </p>
              {onOpenCreateNew && (
                <button
                  type="button"
                  onClick={onOpenCreateNew}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
                >
                  <i className="ri-add-line font-bold"></i>
                  <span>Buat Parameter Baru</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredList.map((param) => {
                const alreadyAdded = isAlreadyAdded(param);
                const isChecked = selectedIds.has(param.id);
                const badge = TIPE_BADGES[param.tipeNilai] || TIPE_BADGES.NUMBER;

                return (
                  <div
                    key={param.id}
                    onClick={() => {
                      if (!alreadyAdded) toggleSelect(param.id);
                    }}
                    className={`relative p-4 rounded-xl border transition-all select-none ${
                      alreadyAdded
                        ? 'bg-gray-50/70 border-gray-200 opacity-60 cursor-not-allowed'
                        : isChecked
                        ? 'bg-emerald-50/50 border-emerald-500 shadow-xs ring-1 ring-emerald-500 cursor-pointer'
                        : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-2xs cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox input */}
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          disabled={alreadyAdded}
                          checked={alreadyAdded || isChecked}
                          onChange={() => {
                            if (!alreadyAdded) toggleSelect(param.id);
                          }}
                          className={`w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 transition-all ${
                            alreadyAdded ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }`}
                        />
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[11px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 shrink-0">
                              {param.kode}
                            </span>
                            <span className="font-bold text-xs text-gray-900 truncate">
                              {param.nama}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {/* Modul & Standar Acuan */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500 mt-1">
                          {param.namaModul && (
                            <span className="flex items-center gap-1 text-gray-600">
                              <i className="ri-apps-line text-emerald-600"></i>
                              <span>Modul: <strong>{param.namaModul}</strong></span>
                            </span>
                          )}

                          {param.satuan && (
                            <span className="flex items-center gap-1">
                              <i className="ri-ruler-line text-gray-400"></i>
                              <span>Satuan: <strong>{param.satuan}</strong></span>
                            </span>
                          )}

                          {param.batasLulus !== null && param.batasLulus !== undefined && (
                            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50/70 px-1.5 py-0.2 rounded font-medium">
                              <i className="ri-check-line text-emerald-600 font-bold"></i>
                              <span>Batas: {param.batasLulus} {param.satuan || ''}</span>
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {param.deskripsi && (
                          <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-1 italic">
                            {param.deskripsi}
                          </p>
                        )}

                        {/* Options preview if OPTION */}
                        {param.tipeNilai === 'OPTION' && param.options && param.options.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {param.options.slice(0, 4).map((opt) => (
                              <span
                                key={opt.kode || opt.nama}
                                className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded"
                              >
                                {opt.nama}
                              </span>
                            ))}
                            {param.options.length > 4 && (
                              <span className="text-[10px] text-gray-400">
                                +{param.options.length - 4} lainnya
                              </span>
                            )}
                          </div>
                        )}

                        {/* Already added notice */}
                        {alreadyAdded && (
                          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                            <i className="ri-check-double-line"></i>
                            <span>Sudah ada di daftar formulir</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {selectedIds.size > 0 ? (
              <span className="font-medium text-emerald-800">
                <strong>{selectedIds.size}</strong> parameter siap ditambahkan
              </span>
            ) : (
              <span>Centang parameter di atas yang ingin dimasukkan ke dalam daftar.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={selectedIds.size === 0}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
            >
              <i className="ri-add-line text-sm font-bold"></i>
              <span>Tambahkan ({selectedIds.size}) ke List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
