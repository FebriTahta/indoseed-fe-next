"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { qcService } from '@/app/services/qcService';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { TestParameter, TestMethod } from '@/app/types/qc';

export interface FormParameterItem {
  id: string; // db id or unique identifier
  parameterId?: string;
  kode: string;
  parameter: string;
  kategori?: string;
  metode: string;
  metodeKode?: string;
  metodeNama?: string;
  standar: string;
  satuan?: string;
  checked: boolean;
  definisi?: string;
  keterangan?: string;
  isCustom?: boolean;
}

interface ManageParameterUjiModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedParameters: FormParameterItem[];
  onApply: (updatedList: FormParameterItem[]) => void;
  dbParameters?: TestParameter[];
  onRefreshDb?: () => Promise<void>;
}

export default function ManageParameterUjiModal({
  isOpen,
  onClose,
  selectedParameters,
  onApply,
  dbParameters: initialDbParameters,
  onRefreshDb,
}: ManageParameterUjiModalProps) {
  const [dbParameters, setDbParameters] = useState<TestParameter[]>(initialDbParameters || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Tab mode in modal: "pilih" (select from DB) or "tambah-baru" (create new in DB)
  const [activeTab, setActiveTab] = useState<'pilih' | 'tambah-baru'>('pilih');
  
  // State for creating new parameter in DB
  const [methods, setMethods] = useState<TestMethod[]>([]);
  const [newParamData, setNewParamData] = useState({
    kode: '',
    nama: '',
    kategori: 'Fisiologis',
    satuan: '%',
    batasAcuan: '',
    metodeId: '',
    definisi: '',
    keterangan: '',
    status: 'Aktif',
  });
  const [isCreatingParam, setIsCreatingParam] = useState<boolean>(false);

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

  // Load methods for dropdown in "tambah-baru"
  const loadMethods = async () => {
    try {
      const res = await qcService.getMethods();
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setMethods(list);
    } catch (error) {
      console.error('Error loading methods:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Sync initial selection from parent
      const currentIds = new Set<string>();
      selectedParameters.forEach((p) => {
        const idKey = p.parameterId || p.id || p.kode;
        currentIds.add(idKey);
      });
      setSelectedIds(currentIds);
      setSearch('');
      setSelectedCategory('Semua');
      setActiveTab('pilih');

      if (!initialDbParameters || initialDbParameters.length === 0) {
        loadParametersFromDb();
      } else {
        setDbParameters(initialDbParameters);
      }
      loadMethods();
    }
  }, [isOpen, selectedParameters, initialDbParameters]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    dbParameters.forEach((p) => {
      if (p.kategori) set.add(p.kategori);
    });
    return ['Semua', ...Array.from(set)];
  }, [dbParameters]);

  // Filtered parameters
  const filteredParameters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dbParameters.filter((p) => {
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
  }, [dbParameters, search, selectedCategory]);

  const toggleSelect = (param: TestParameter) => {
    const idKey = param.id || param.kode;
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
        const idKey = p.id || p.kode;
        next.add(idKey);
      });
      return next;
    });
  };

  const handleDeselectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredParameters.forEach((p) => {
        const idKey = p.id || p.kode;
        next.delete(idKey);
      });
      return next;
    });
  };

  // Select core standard parameters (Daya Tumbuh, Kadar Air, Kemurnian, Vigor)
  const handleSelectCoreStandards = () => {
    const coreCodes = ['P001', 'P002', 'P003', 'P004', 'P007', 'P010'];
    const next = new Set(selectedIds);
    dbParameters.forEach((p) => {
      if (coreCodes.includes(p.kode) || ['Daya Tumbuh', 'Kadar Air', 'Kemurnian', 'Vigor'].some(k => p.nama.toLowerCase().includes(k.toLowerCase()))) {
        next.add(p.id || p.kode);
      }
    });
    setSelectedIds(next);
    toast.info('Parameter standar mutu utama terpilih');
  };

  // Handle saving a brand new parameter into DB
  const handleCreateNewParameter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParamData.kode.trim() || !newParamData.nama.trim() || !newParamData.metodeId) {
      toast.error('Kode, Nama Parameter, dan Metode Uji Terkait wajib diisi');
      return;
    }

    setIsCreatingParam(true);
    try {
      const res = await qcService.createParameter({
        kode: newParamData.kode.trim().toUpperCase(),
        nama: newParamData.nama.trim(),
        kategori: newParamData.kategori,
        satuan: newParamData.satuan,
        batasAcuan: newParamData.batasAcuan,
        metodeId: newParamData.metodeId || undefined,
        definisi: newParamData.definisi,
        keterangan: newParamData.keterangan,
        status: newParamData.status,
      });

      toast.success(`Parameter ${newParamData.nama} berhasil ditambahkan ke database!`);

      // Refresh list
      await loadParametersFromDb();
      if (onRefreshDb) await onRefreshDb();

      // Automatically select the new parameter
      const createdItem: any = (res as any)?.data || res;
      if (createdItem && createdItem.id) {
        setSelectedIds(prev => new Set([...prev, createdItem.id]));
      }

      // Reset form and return to select tab
      setNewParamData({
        kode: '',
        nama: '',
        kategori: 'Fisiologis',
        satuan: '%',
        batasAcuan: '',
        metodeId: '',
        definisi: '',
        keterangan: '',
        status: 'Aktif',
      });
      setActiveTab('pilih');
    } catch (error: any) {
      console.error('Error creating parameter in DB:', error);
      toast.error(error?.response?.data?.message || 'Gagal menambahkan parameter ke database');
    } finally {
      setIsCreatingParam(false);
    }
  };

  // Apply changes to parent form
  const handleApply = () => {
    const updatedList: FormParameterItem[] = [];

    // Map all selected parameters from DB
    dbParameters.forEach((dbP) => {
      const idKey = dbP.id || dbP.kode;
      if (selectedIds.has(idKey)) {
        const existing = selectedParameters.find(
          (sp) => sp.parameterId === dbP.id || sp.kode === dbP.kode || sp.id === dbP.id
        );

        // Standard and Method are strictly derived from master DB data (locked)
        const standardDisplay = dbP.batasAcuan ? `${dbP.batasAcuan} ${dbP.satuan || ''}`.trim() : '-';
        const metodeDisplay = dbP.metode
          ? `${dbP.metode.kode ? `${dbP.metode.kode} - ` : ''}${dbP.metode.nama}`
          : '-';

        updatedList.push({
          id: dbP.id || `param-${dbP.kode}`,
          parameterId: dbP.id,
          kode: dbP.kode,
          parameter: dbP.nama,
          kategori: dbP.kategori || 'Umum',
          metode: metodeDisplay,
          metodeKode: dbP.metode?.kode,
          metodeNama: dbP.metode?.nama,
          standar: standardDisplay,
          satuan: dbP.satuan,
          checked: existing !== undefined ? existing.checked : true,
          definisi: dbP.definisi,
          keterangan: dbP.keterangan,
        });
      }
    });

    // Also preserve any custom non-db parameters if previously added
    selectedParameters.forEach((sp) => {
      if (sp.isCustom && selectedIds.has(sp.id)) {
        updatedList.push(sp);
      }
    });

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
                <i className="ri-database-2-line text-xl"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-gray-800">
                    Kelola & Pilih Parameter Pengujian
                  </h4>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Database Master
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Pilih parameter uji dari database atau tambahkan parameter baru untuk permintaan ini.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <i className="ri-close-line text-2xl" />
            </button>
          </div>

          {/* Nav Tabs within Modal */}
          <div className="px-6 pt-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('pilih')}
                className={`pb-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'pilih'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="ri-checkbox-multiple-line"></i>
                Pilih dari Database ({dbParameters.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tambah-baru')}
                className={`pb-2.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'tambah-baru'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="ri-add-circle-line"></i>
                Tambah Parameter Baru ke DB
              </button>
            </div>

            <div className="text-xs text-gray-500 pb-2 hidden sm:block">
              <span className="font-semibold text-emerald-700">{selectedIds.size}</span> parameter dipilih
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {activeTab === 'pilih' ? (
              <>
                {/* Search & Filter Toolbar */}
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
                        onClick={handleSelectCoreStandards}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
                        title="Pilih parameter penting seperti Daya Tumbuh, Kadar Air, Kemurnian, Vigor"
                      >
                        <i className="ri-star-line text-emerald-600"></i>
                        Standar Utama
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectAllVisible}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllVisible}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Batal Pilih
                      </button>
                      <button
                        type="button"
                        onClick={loadParametersFromDb}
                        disabled={isLoading}
                        className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border border-gray-200 transition-colors"
                        title="Segarkan data dari database"
                      >
                        <i className={`ri-refresh-line ${isLoading ? 'animate-spin' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-gray-400 mr-1 font-medium">Kategori:</span>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
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
                              <i className="ri-search-line text-3xl mb-2 inline-block text-gray-300"></i>
                              <p className="text-sm font-medium text-gray-600">Tidak ada parameter yang sesuai</p>
                              <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredParameters.map((p) => {
                            const idKey = p.id || p.kode;
                            const isSelected = selectedIds.has(idKey);
                            const categoryColor =
                              p.kategori === 'Fisiologis'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : p.kategori === 'Fisik'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : p.kategori === 'Kesehatan'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200';

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
                                      className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors inline-flex items-center gap-1 border border-rose-200"
                                      title="Batalkan pilihan parameter ini"
                                    >
                                      <i className="ri-close-line"></i> Batal
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => toggleSelect(p)}
                                      className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1 border border-emerald-200"
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
              </>
            ) : (
              /* Tab: Tambah Parameter Baru ke Database */
              <form onSubmit={handleCreateNewParameter} className="space-y-4">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
                  <i className="ri-information-line text-base text-amber-600 mt-0.5"></i>
                  <div>
                    <p className="font-semibold">Simpan ke Master Database</p>
                    <p className="text-amber-700">
                      Parameter yang ditambahkan di sini akan disimpan permanen ke database master QC dan langsung terpilih untuk permintaan pengujian ini.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Kode Parameter <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: P013 atau QA-01"
                      value={newParamData.kode}
                      onChange={(e) => setNewParamData({ ...newParamData, kode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nama Parameter <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Daya Simpan, Indeks Vigor, dll."
                      value={newParamData.nama}
                      onChange={(e) => setNewParamData({ ...newParamData, nama: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori</label>
                    <select
                      value={newParamData.kategori}
                      onChange={(e) => setNewParamData({ ...newParamData, kategori: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                    >
                      <option value="Fisiologis">Fisiologis</option>
                      <option value="Fisik">Fisik</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Genetik">Genetik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Metode Uji Terkait <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={newParamData.metodeId}
                      onChange={(e) => setNewParamData({ ...newParamData, metodeId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                    >
                      <option value="">-- Pilih Metode Uji Terkait (Wajib) --</option>
                      {methods.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.kode} - {m.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Batas Acuan / Standar</label>
                    <input
                      type="text"
                      placeholder="Contoh: >= 85, <= 12, atau Bebas"
                      value={newParamData.batasAcuan}
                      onChange={(e) => setNewParamData({ ...newParamData, batasAcuan: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Satuan</label>
                    <input
                      type="text"
                      placeholder="Contoh: %, gram, butir, -"
                      value={newParamData.satuan}
                      onChange={(e) => setNewParamData({ ...newParamData, satuan: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Definisi / Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    placeholder="Penjelasan ringkas mengenai parameter ini..."
                    value={newParamData.definisi}
                    onChange={(e) => setNewParamData({ ...newParamData, definisi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pilih')}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingParam}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isCreatingParam ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i> Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className="ri-save-line"></i> Simpan ke Database
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center gap-2"
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
