"use client";

import React, { useState } from 'react';
import useBatchProduksi from '@/app/hooks/useBatchProduksi';
import { BatchProduksiItem } from '@/app/types/batchProduksi';
import ProduksiPerKomoditasDonut from './component/ProduksiPerKomoditasDonut';
import TrenProduksiChart from './component/TrenProduksiChart';
import StatusBatchProduksiBar from './component/StatusBatchProduksiBar';
import DetailBatchCard from './component/DetailBatchCard';
import BatchProduksiFormModal from './component/BatchProduksiFormModal';
import BatchProduksiDetailModal from './component/BatchProduksiDetailModal';
import BatchProduksiDeleteModal from './component/BatchProduksiDeleteModal';

export default function BatchProduksiPage() {
  const {
    batchList,
    selectedBatch,
    setSelectedBatch,
    referensiGudangBahanList,
    loading,
    stats,
    // Filters
    searchQuery,
    setSearchQuery,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    handleApplyFilters,
    handleResetFilters,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    isDeleteModalOpen,
    selectedItem,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleOpenDeleteModal,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitUpdate,
    handleSubmitDelete,
  } = useBatchProduksi();

  // Active dropdown menu for row action
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Checkbox selection
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowIds(batchList.map((b) => b.kodeBatch));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleSelectRow = (kode: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(kode) ? prev.filter((k) => k !== kode) : [...prev, kode]
    );
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Selesai
          </span>
        );
      case 'Dalam Proses':
      case 'Proses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Dalam Proses
          </span>
        );
      case 'Tertunda':
      case 'Reject':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Tertunda
          </span>
        );
      case 'Persiapan':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Persiapan
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* 1. Header & Breadcrumb */}
      <div>
        <nav className="flex items-center gap-1 text-[11px] text-gray-500 mb-2">
          <span>Produksi</span>
          <i className="ri-arrow-right-s-line text-xs"></i>
          <span className="text-emerald-700 font-semibold">Batch Produksi</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            <i className="ri-flask-line"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Batch Produksi</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola proses produksi benih dari awal hingga siap disalurkan, termasuk informasi batch, varietas, dan status produksi.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top 5 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Batch */}
        <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-[11px] font-medium block">Total Batch</span>
            <span className="text-xl font-bold text-gray-900 block leading-tight">{stats.totalBatch}</span>
            <span className="text-emerald-600 font-medium text-[10px] flex items-center gap-0.5">
              <i className="ri-arrow-up-line"></i> {stats.totalBatchDelta} dari bulan lalu
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
            <i className="ri-flask-line"></i>
          </div>
        </div>

        {/* Dalam Proses */}
        <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-[11px] font-medium block">Dalam Proses</span>
            <span className="text-xl font-bold text-gray-900 block leading-tight">{stats.dalamProses}</span>
            <span className="text-emerald-600 font-medium text-[10px] flex items-center gap-0.5">
              <i className="ri-arrow-up-line"></i> {stats.dalamProsesDelta} dari bulan lalu
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-lg flex-shrink-0">
            <i className="ri-plant-line"></i>
          </div>
        </div>

        {/* Selesai */}
        <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-[11px] font-medium block">Selesai</span>
            <span className="text-xl font-bold text-gray-900 block leading-tight">{stats.selesaiCount}</span>
            <span className="text-emerald-600 font-medium text-[10px] flex items-center gap-0.5">
              <i className="ri-arrow-up-line"></i> {stats.selesaiDelta} dari bulan lalu
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
            <i className="ri-checkbox-circle-line"></i>
          </div>
        </div>

        {/* Tertunda */}
        <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-[11px] font-medium block">Tertunda</span>
            <span className="text-xl font-bold text-gray-900 block leading-tight">{stats.tertundaCount}</span>
            <span className="text-rose-600 font-medium text-[10px] flex items-center gap-0.5">
              <i className="ri-arrow-down-line"></i> {Math.abs(stats.tertundaDelta)} dari bulan lalu
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-lg flex-shrink-0">
            <i className="ri-alert-line"></i>
          </div>
        </div>

        {/* Total Produksi Benih */}
        <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl p-3.5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-400 text-[11px] font-medium block">Total Produksi Benih</span>
            <span className="text-xl font-bold text-gray-900 block leading-tight">{stats.totalProduksiBenih}</span>
            <span className="text-emerald-600 font-medium text-[10px] flex items-center gap-0.5">
              <i className="ri-arrow-up-line"></i> {stats.totalProduksiDeltaPercent}% dari bulan lalu
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-lg flex-shrink-0">
            <i className="ri-calendar-event-line"></i>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] max-w-sm flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              placeholder="Cari nomor batch, varietas, komoditas, atau lokasi..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Select Komoditas */}
          <div className="w-[140px]">
            <select
              value={filterKomoditas}
              onChange={(e) => {
                setFilterKomoditas(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {komoditasOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Select Varietas */}
          <div className="w-[140px]">
            <select
              value={filterVarietas}
              onChange={(e) => {
                setFilterVarietas(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {varietasOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Select Status */}
          <div className="w-[130px]">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <i className="ri-equalizer-line text-xs"></i> Filter
          </button>

          {(searchQuery || filterKomoditas || filterVarietas || filterStatus) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Reset
            </button>
          )}
        </div>

        {/* Right Action: + Tambah Batch Produksi */}
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap"
        >
          <i className="ri-add-line text-sm"></i> Tambah Batch Produksi
        </button>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Table + 3 Bottom Cards */}
        <div className="xl:col-span-8 col-span-12 space-y-5">
          {/* Table Card */}
          <div className="bg-white border border-gray-200/80 shadow-xs rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="ri-file-list-3-line text-emerald-600 text-sm"></i>
                <h3 className="font-bold text-xs text-gray-800">Daftar Batch Produksi</h3>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-gray-500 font-medium border-b border-gray-200 text-[11px]">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length === batchList.length && batchList.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="py-2.5 px-2 w-8">No.</th>
                    <th className="py-2.5 px-3">No. Batch</th>
                    <th className="py-2.5 px-3">Komoditas</th>
                    <th className="py-2.5 px-3">Varietas</th>
                    <th className="py-2.5 px-3">Lahan / Greenhouse</th>
                    <th className="py-2.5 px-3">Tanggal Mulai</th>
                    <th className="py-2.5 px-3">Tanggal Selesai</th>
                    <th className="py-2.5 px-3">Target Produksi (kg)</th>
                    <th className="py-2.5 px-3">Realisasi (kg)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-gray-400">
                        <i className="ri-loader-4-line animate-spin text-xl text-emerald-600 inline-block mr-2"></i>
                        Memuat data batch produksi...
                      </td>
                    </tr>
                  ) : batchList.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-gray-400">
                        Tidak ada data batch produksi yang cocok.
                      </td>
                    </tr>
                  ) : (
                    batchList.map((item, index) => {
                      const isSelected = selectedBatch?.kodeBatch === item.kodeBatch;
                      const isChecked = selectedRowIds.includes(item.kodeBatch);

                      return (
                        <tr
                          key={item.kodeBatch || index}
                          onClick={() => setSelectedBatch(item)}
                          className={`cursor-pointer transition-colors text-[11px] ${
                            isSelected
                              ? 'bg-emerald-50/40 font-medium'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleSelectRow(item.kodeBatch)}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </td>
                          <td className="py-2.5 px-2 text-gray-500">{item.no || index + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-700">
                            {item.kodeBatch}
                          </td>
                          <td className="py-2.5 px-3 text-gray-700">{item.komoditas}</td>
                          <td className="py-2.5 px-3 text-gray-700">{item.varietas}</td>
                          <td className="py-2.5 px-3 text-gray-600 font-medium">
                            {item.lokasi || item.lahan || 'GH-001'}
                          </td>
                          <td className="py-2.5 px-3 text-gray-600">{item.tanggalMulai}</td>
                          <td className="py-2.5 px-3 text-gray-600">{item.tanggalSelesai || '-'}</td>
                          <td className="py-2.5 px-3 text-gray-700 font-medium">
                            {item.targetKg ? item.targetKg.toLocaleString('id-ID') : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-gray-700 font-semibold">
                            {item.hasilKg !== undefined && item.hasilKg > 0
                              ? item.hasilKg.toLocaleString('id-ID')
                              : '0'}
                          </td>
                          <td className="py-2.5 px-3">{renderStatusBadge(item.status)}</td>
                          <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2 relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedBatch(item);
                                  handleOpenDetailModal(item);
                                }}
                                className="text-gray-400 hover:text-emerald-700 transition-colors"
                                title="Lihat Detail"
                              >
                                <i className="ri-eye-line text-sm"></i>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenuId(activeMenuId === item.kodeBatch ? null : item.kodeBatch)
                                }
                                className="text-gray-400 hover:text-gray-700 transition-colors"
                                title="Aksi"
                              >
                                <i className="ri-more-line text-sm"></i>
                              </button>

                              {/* Dropdown Menu */}
                              {activeMenuId === item.kodeBatch && (
                                <div
                                  className="absolute right-0 top-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-28 text-left text-[11px]"
                                  onMouseLeave={() => setActiveMenuId(null)}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleOpenEditModal(item);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 text-gray-700 flex items-center gap-1.5"
                                  >
                                    <i className="ri-pencil-line text-blue-600"></i> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleOpenDeleteModal(item);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-slate-50 text-rose-600 flex items-center gap-1.5"
                                  >
                                    <i className="ri-delete-bin-line"></i> Hapus
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>
                Menampilkan {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, totalRecords)} dari {totalRecords} data
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-xs"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-6 h-6 rounded text-xs font-semibold flex items-center justify-center transition-colors ${
                      currentPage === pg
                        ? 'bg-emerald-700 text-white'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-xs"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Bottom Cards under table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Produksi per Komoditas */}
            <ProduksiPerKomoditasDonut
              totalKg={stats.totalProduksiBenih}
              data={stats.komoditasBreakdown}
            />

            {/* 2. Tren Produksi Batch */}
            <TrenProduksiChart data={stats.trenProduksi} />

            {/* 3. Status Batch Produksi */}
            <StatusBatchProduksiBar distribution={stats.statusDistribution} />
          </div>
        </div>

        {/* Right Column (4 cols): Detail Batch Produksi Card */}
        <div className="xl:col-span-4 col-span-12 sticky top-20">
          <DetailBatchCard
            item={selectedBatch}
            onViewTahapan={() => selectedBatch && handleOpenDetailModal(selectedBatch)}
          />
        </div>
      </div>

      {/* Modals */}
      <BatchProduksiFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitCreate}
        mode="add"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        referensiGudangBahanList={referensiGudangBahanList}
      />

      <BatchProduksiFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitUpdate}
        initialData={selectedItem}
        mode="edit"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        referensiGudangBahanList={referensiGudangBahanList}
      />

      <BatchProduksiDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />

      <BatchProduksiDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={selectedItem}
      />
    </div>
  );
}
