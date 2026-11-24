"use client";

import React, { useState } from 'react';
import useManajemenStok from '@/app/hooks/useManajemenStok';
import KomposisiStokDonut from './component/KomposisiStokDonut';
import RingkasanStatusWidget from './component/RingkasanStatusWidget';
import ManajemenStokDetailModal from './component/ManajemenStokDetailModal';
import KartuStokModal from './component/KartuStokModal';
import LaporanStokModal from './component/LaporanStokModal';
import { ManajemenStokTab, StokBenihBersihItem } from '@/app/types/manajemenStok';

export default function ManajemenStokPage() {
  const {
    activeTab,
    handleTabChange,
    benihList,
    nonBenihList,
    stats,
    loading,
    // Filters
    searchQuery,
    setSearchQuery,
    filterGudang,
    setFilterGudang,
    filterLokasi,
    setFilterLokasi,
    filterStatusQc,
    setFilterStatusQc,
    filterVarietas,
    setFilterVarietas,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    totalRecords,
    totalPages,
    // Selection
    selectedLots,
    handleSelectAll,
    handleSelectRow,
    // Modals
    isDetailModalOpen,
    selectedItem,
    handleOpenDetailModal,
    handleCloseDetailModal,
    isKartuStokModalOpen,
    kartuStokLot,
    kartuStokHistory,
    loadingKartuStok,
    handleOpenKartuStok,
    handleCloseKartuStok,
    isLaporanModalOpen,
    setIsLaporanModalOpen,
    handleExportCsv,
  } = useManajemenStok();

  // Active menu dropdown id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Lolos QC':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <i className="ri-checkbox-circle-fill text-emerald-500 text-xs"></i>
            Lolos QC
          </span>
        );
      case 'Karantina':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <i className="ri-shield-line text-amber-500 text-xs"></i>
            Karantina
          </span>
        );
      case 'Ditahan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <i className="ri-lock-line text-rose-500 text-xs"></i>
            Ditahan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const renderNonBenihStatusBadge = (status: string) => {
    switch (status) {
      case 'Aman':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Aman
          </span>
        );
      case 'Menipis':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Menipis
          </span>
        );
      case 'Kritis':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Kritis
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-5 pb-12 text-xs">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs mb-1">
            <span className="text-[#0d6832] font-semibold">Gudang &amp; Inventori</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-600 font-medium">Manajemen Stok</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-300 text-[#0d6832] flex items-center justify-center font-bold text-2xl shadow-xs">
              <i className="ri-inbox-archive-line"></i>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-tight">Manajemen Stok</h1>
              <p className="text-xs text-gray-500">
                Monitoring saldo, lokasi, kepemilikan, dan status persediaan
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleOpenKartuStok()}
            className="px-3.5 py-2 bg-white border border-[#0d6832] hover:bg-emerald-50 text-[#0d6832] rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <i className="ri-file-list-3-line text-[#0d6832] text-sm"></i>
            Kartu Stok
          </button>
          <button
            type="button"
            onClick={() => setIsLaporanModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-[#0d6832] hover:bg-emerald-50 text-[#0d6832] rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <i className="ri-bar-chart-2-line text-[#0d6832] text-sm"></i>
            Laporan Stok
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-[#0d6832] hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <i className="ri-download-line text-sm"></i>
            Ekspor
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total SKU Aktif */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0 border border-emerald-100">
            <i className="ri-box-3-line"></i>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Total SKU Aktif</span>
            <span className="text-xl font-extrabold text-gray-900 leading-tight">
              {stats.totalSkuAktif} <span className="text-xs font-semibold text-gray-500">SKU</span>
            </span>
          </div>
        </div>

        {/* Card 2: Total Lot Benih Bersih */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 border border-blue-100">
            <i className="ri-file-list-line"></i>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Total Lot Benih Bersih</span>
            <span className="text-xl font-extrabold text-gray-900 leading-tight">
              {stats.totalLotBenihBersih} <span className="text-xs font-semibold text-gray-500">Lot</span>
            </span>
          </div>
        </div>

        {/* Card 3: Stok Minimum */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl flex-shrink-0 border border-amber-100">
            <i className="ri-alert-line"></i>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Stok Minimum</span>
            <span className="text-xl font-extrabold text-gray-900 leading-tight">
              {stats.stokMinimum} <span className="text-xs font-semibold text-gray-500">SKU</span>
            </span>
          </div>
        </div>

        {/* Card 4: Stok Ditahan */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl flex-shrink-0 border border-rose-100">
            <i className="ri-lock-line"></i>
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-medium block">Stok Ditahan</span>
            <span className="text-xl font-extrabold text-gray-900 leading-tight">
              {stats.stokDitahan} <span className="text-xs font-semibold text-gray-500">Item / Lot</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'benih-bersih', label: 'Benih Bersih' },
          { key: 'packing-internal', label: 'Packing Internal' },
          { key: 'packing-customer', label: 'Packing Customer' },
          { key: 'bahan-treatment', label: 'Bahan Treatment' },
          { key: 'barang-umum', label: 'Barang Umum' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key as ManajemenStokTab)}
              className={`px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0d6832] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200/80'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              placeholder="Cari no, lot, varietas, batch, atau lokasi..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Dropdown Filters with stacked label layout */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {/* Gudang */}
            <div className="relative bg-white border border-gray-200 rounded-lg px-2.5 py-1 min-w-[145px] text-left">
              <span className="block text-[10px] text-gray-400 font-medium leading-none mb-0.5">Gudang</span>
              <div className="flex items-center justify-between">
                <select
                  value={filterGudang}
                  onChange={(e) => setFilterGudang(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-800 appearance-none focus:outline-none cursor-pointer pr-4"
                >
                  <option value="Semua Gudang">Semua Gudang</option>
                  <option value="Gudang Benih Bersih">Gudang Benih Bersih</option>
                  <option value="Gudang Packing">Gudang Packing</option>
                  <option value="Gudang Bahan Treatment">Gudang Bahan Treatment</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 bottom-1.5 text-gray-400 pointer-events-none text-xs"></i>
              </div>
            </div>

            {/* Lokasi */}
            <div className="relative bg-white border border-gray-200 rounded-lg px-2.5 py-1 min-w-[125px] text-left">
              <span className="block text-[10px] text-gray-400 font-medium leading-none mb-0.5">Lokasi</span>
              <div className="flex items-center justify-between">
                <select
                  value={filterLokasi}
                  onChange={(e) => setFilterLokasi(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-800 appearance-none focus:outline-none cursor-pointer pr-4"
                >
                  <option value="Semua Lokasi">Semua Lokasi</option>
                  <option value="GD-BNH-LS-01">GD-BNH-LS-01</option>
                  <option value="GD-BNH-LS-02">GD-BNH-LS-02</option>
                  <option value="GD-BNH-LS-03">GD-BNH-LS-03</option>
                  <option value="GD-BNH-KR-01">GD-BNH-KR-01</option>
                  <option value="GD-BNH-LS-04">GD-BNH-LS-04</option>
                  <option value="GD-BNH-DT-01">GD-BNH-DT-01</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 bottom-1.5 text-gray-400 pointer-events-none text-xs"></i>
              </div>
            </div>

            {/* Status QC (khusus Benih Bersih) */}
            {activeTab === 'benih-bersih' && (
              <div className="relative bg-white border border-gray-200 rounded-lg px-2.5 py-1 min-w-[125px] text-left">
                <span className="block text-[10px] text-gray-400 font-medium leading-none mb-0.5">Status QC</span>
                <div className="flex items-center justify-between">
                  <select
                    value={filterStatusQc}
                    onChange={(e) => setFilterStatusQc(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-gray-800 appearance-none focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Lolos QC">Lolos QC</option>
                    <option value="Karantina">Karantina</option>
                    <option value="Ditahan">Ditahan</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 bottom-1.5 text-gray-400 pointer-events-none text-xs"></i>
                </div>
              </div>
            )}

            {/* Varietas */}
            {activeTab === 'benih-bersih' && (
              <div className="relative bg-white border border-gray-200 rounded-lg px-2.5 py-1 min-w-[125px] text-left">
                <span className="block text-[10px] text-gray-400 font-medium leading-none mb-0.5">Varietas</span>
                <div className="flex items-center justify-between">
                  <select
                    value={filterVarietas}
                    onChange={(e) => setFilterVarietas(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-gray-800 appearance-none focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="Semua Varietas">Semua Varietas</option>
                    <option value="Inpari 32">Inpari 32</option>
                    <option value="Ciherang">Ciherang</option>
                    <option value="Cabai Keriting">Cabai Keriting</option>
                    <option value="Melon Tavi">Melon Tavi</option>
                    <option value="Tomat Rapid">Tomat Rapid</option>
                    <option value="Kangkung Bima">Kangkung Bima</option>
                    <option value="Selada Grand Rapids">Selada Grand Rapids</option>
                    <option value="Padi Inpari 42">Padi Inpari 42</option>
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-2 bottom-1.5 text-gray-400 pointer-events-none text-xs"></i>
                </div>
              </div>
            )}

            {/* Reset & Filter Buttons */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <i className="ri-refresh-line text-sm text-gray-500"></i>
              Reset
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="px-3.5 py-2 bg-[#0d6832] hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <i className="ri-filter-3-line text-sm"></i>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Table: Daftar Stok */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Label */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <i className="ri-inbox-archive-line text-lg text-[#0d6832]"></i>
            <h3 className="font-bold text-sm text-gray-900">
              {activeTab === 'benih-bersih'
                ? 'Daftar Stok Benih Bersih'
                : activeTab === 'packing-internal'
                ? 'Daftar Stok Packing Internal'
                : activeTab === 'packing-customer'
                ? 'Daftar Stok Packing Customer'
                : activeTab === 'bahan-treatment'
                ? 'Daftar Stok Bahan Treatment'
                : 'Daftar Stok Barang Umum'}
            </h3>
          </div>
          {selectedLots.length > 0 && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {selectedLots.length} lot terpilih
            </span>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {activeTab === 'benih-bersih' ? (
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead className="bg-slate-50/80 text-gray-700 text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={benihList.length > 0 && selectedLots.length === benihList.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-3">No. Lot</th>
                  <th className="px-3 py-3">Varietas</th>
                  <th className="px-3 py-3 text-center">Kelas</th>
                  <th className="px-3 py-3">Batch Produksi</th>
                  <th className="px-3 py-3">Gudang / Lokasi</th>
                  <th className="px-3 py-3 text-right">Stok Fisik (kg)</th>
                  <th className="px-3 py-3 text-right">Dialokasikan (kg)</th>
                  <th className="px-3 py-3 text-right">Tersedia (kg)</th>
                  <th className="px-3 py-3 text-center">Status QC</th>
                  <th className="px-3 py-3">Tgl Masuk</th>
                  <th className="px-3 py-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      <i className="ri-loader-4-line animate-spin text-2xl text-emerald-600 mb-2 block"></i>
                      Memuat data stok benih bersih...
                    </td>
                  </tr>
                ) : benihList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      Tidak ada data stok yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  benihList.map((item) => {
                    const isSelected = selectedLots.includes(item.noLot);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(item.noLot)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 font-semibold">
                          <button
                            type="button"
                            onClick={() => handleOpenDetailModal(item)}
                            className="text-left font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {item.noLot}
                          </button>
                        </td>
                        <td className="px-3 py-3 font-medium text-gray-800">{item.varietas}</td>
                        <td className="px-3 py-3 text-center font-medium text-gray-700">
                          {item.kelas}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-gray-700">{item.kodeBatch}</td>
                        <td className="px-3 py-3 font-medium text-gray-700">{item.lokasi}</td>
                        <td className="px-3 py-3 text-right font-bold text-gray-900">
                          {item.stokFisik.toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-3 text-right text-gray-600">
                          {item.dialokasikan > 0 ? item.dialokasikan.toLocaleString('id-ID') : '0'}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-gray-900">
                          {item.tersedia.toLocaleString('id-ID')}
                        </td>
                        <td className="px-3 py-3 text-center">{renderStatusBadge(item.statusQc)}</td>
                        <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{item.tglMasuk}</td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5 relative">
                            {/* Eye Detail button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetailModal(item)}
                              title="Lihat Detail Lot & QC"
                              className="w-7 h-7 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"
                            >
                              <i className="ri-eye-line text-sm"></i>
                            </button>

                            {/* Dropdown Options */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenuId(activeMenuId === item.id ? null : item.id)
                                }
                                className="w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 flex items-center justify-center transition-colors"
                              >
                                <i className="ri-more-fill text-sm"></i>
                              </button>

                              {activeMenuId === item.id && (
                                <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 animate-fade-in text-left">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleOpenDetailModal(item);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <i className="ri-eye-line text-gray-400"></i> Detail Lot & QC
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleOpenKartuStok(item);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <i className="ri-file-list-3-line text-gray-400"></i> Kartu Stok
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      alert(`Alokasi order penjualan untuk lot ${item.noLot}`);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                  >
                                    <i className="ri-share-box-line text-gray-400"></i> Alokasikan Order
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          ) : (
            /* Other Tabs Table (Packing, Bahan Treatment, Barang Umum) */
            <table className="w-full text-left text-xs text-gray-600 border-collapse">
              <thead className="bg-slate-50/80 text-gray-700 text-[11px] font-bold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Kode Barang</th>
                  <th className="px-3 py-3">Nama Barang</th>
                  <th className="px-3 py-3">Kategori</th>
                  <th className="px-3 py-3 text-center">Satuan</th>
                  <th className="px-3 py-3">Gudang / Lokasi</th>
                  <th className="px-3 py-3 text-right">Stok Fisik</th>
                  <th className="px-3 py-3 text-right">Dialokasikan</th>
                  <th className="px-3 py-3 text-right">Tersedia</th>
                  <th className="px-3 py-3 text-center">Status Stok</th>
                  <th className="px-3 py-3">Tgl Masuk</th>
                  <th className="px-3 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nonBenihList.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-gray-400">
                      Tidak ada data stok pada tab ini.
                    </td>
                  </tr>
                ) : (
                  nonBenihList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-gray-800">{item.kodeBarang}</td>
                      <td className="px-3 py-3 font-medium text-gray-900">{item.namaBarang}</td>
                      <td className="px-3 py-3 text-gray-600">{item.kategori}</td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                          {item.satuan}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-700">{item.lokasi}</td>
                      <td className="px-3 py-3 text-right font-bold text-gray-900">
                        {item.stokFisik.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-3 text-right text-gray-600">
                        {item.dialokasikan.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-3 text-right font-extrabold text-emerald-700">
                        {item.tersedia.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-3 text-center">{renderNonBenihStatusBadge(item.statusStok)}</td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{item.tglMasuk}</td>
                      <td className="px-3 py-3 text-gray-500 text-[11px]">{item.keterangan || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-semibold text-gray-800">{benihList.length}</span> dari{' '}
            <span className="font-semibold text-gray-800">{totalRecords}</span> data
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <span className="w-7 h-7 rounded-lg bg-[#0d6832] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              {currentPage}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: 2 Cards (Komposisi Stok Benih & Ringkasan Status Benih) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <KomposisiStokDonut data={stats.komposisi} />
        <RingkasanStatusWidget data={stats.ringkasanStatus} />
      </div>

      {/* Modals */}
      <ManajemenStokDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        item={selectedItem}
        onOpenKartuStok={(item) => handleOpenKartuStok(item)}
      />

      <KartuStokModal
        isOpen={isKartuStokModalOpen}
        onClose={handleCloseKartuStok}
        lot={kartuStokLot}
        history={kartuStokHistory}
        loading={loadingKartuStok}
      />

      <LaporanStokModal
        isOpen={isLaporanModalOpen}
        onClose={() => setIsLaporanModalOpen(false)}
        stats={stats}
        onExportCsv={handleExportCsv}
      />
    </div>
  );
}

