"use client";

import React, { Fragment, useState } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKontrakPanen } from '@/app/hooks/useKontrakPanen';
import { KontrakPanen } from '@/app/types/kontrakPanen';
import ModalFormKontrak from './components/ModalFormKontrak';
import ModalDetailKontrak from './components/ModalDetailKontrak';
import ModalImportKontrak from './components/ModalImportKontrak';

export default function KontrakPanenPage() {
  const {
    items,
    loading,
    error,
    stats,
    // Filters
    search,
    setSearch,
    komoditas,
    setKomoditas,
    handleKomoditasFilterChange,
    varietas,
    setVarietas,
    tipePanenan,
    setTipePanenan,
    status,
    setStatus,
    handleResetFilters,
    // Master lists
    commodityList,
    varietyList,
    harvestTypesList,
    loadingHarvestTypes,
    fetchHarvestTypesForVariety,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isSubmitting,
    selectedItem,
    formData,
    setFormData,
    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleSaveForm,
    handleDelete,
    refreshData,
  } = useKontrakPanen();

  const formatDateRange = (start?: string | null, end?: string | null) => {
    if (!start && !end) return '-';
    const fmt = (dStr?: string | null) => {
      if (!dStr) return '';
      try {
        const d = new Date(dStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch {
        return dStr;
      }
    };
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const renderTipePanenanBadge = (tipe: string) => {
    if (tipe === 'Glondong / Fresh') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Glondong / Fresh
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
        OC / Benih
      </span>
    );
  };

  const renderStatusBadge = (st: string) => {
    switch (st) {
      case 'Aktif':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Aktif
          </span>
        );
      case 'Tidak Aktif':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Tidak Aktif
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            {st || 'Draft'}
          </span>
        );
    }
  };

  // Distinct commodities for filter
  const commodityFilterOptions = Array.from(new Set([
    ...commodityList.map((c) => c.namaKomoditas),
    'Melon', 'Cabai', 'Padi', 'Tomat', 'Bawang Merah', 'Kacang Panjang'
  ])).filter(Boolean);

  // Distinct varieties for filter (dependent on selected komoditas)
  const varietyFilterOptions = React.useMemo(() => {
    if (komoditas === 'all') {
      return Array.from(new Set([
        ...varietyList.map((v) => v.namaVarietas),
        ...items.map((i) => i.varietas),
        'Melon Tere F1', 'Cabai Keriting', 'Inpari 32', 'Tomat Servo F1', 'Cabai Rawit', 'Bima Brebes', 'Kacang Panjang'
      ])).filter(Boolean);
    }
    const commObj = commodityList.find((c) => c.namaKomoditas === komoditas || c.id === komoditas);
    if (commObj) {
      const matched = varietyList.filter((v) => v.commodityId === commObj.id).map((v) => v.namaVarietas);
      if (matched.length > 0) return matched;
    }
    return Array.from(new Set(items.filter((i) => i.komoditas === komoditas).map((i) => i.varietas))).filter(Boolean);
  }, [komoditas, varietyList, commodityList, items]);

  return (
    <Fragment>
      <Seo title="Kontrak Panen | Sistem Informasi Perusahaan Benih" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Breadcrumb & Header Bar */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
            <span className="text-emerald-700 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Master Data Produksi
            </span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 font-bold">Kontrak Panen</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Kontrak Panen</h1>
                <p className="text-xs text-gray-500 mt-0.5 font-normal">
                  Kelola kontrak hasil panen berdasarkan komoditas, varietas, tipe panenan, nilai kontrak dan umur panen.
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Import Data</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#078836] hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Kontrak Panen</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 items-center">
            
            {/* Komoditas */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Komoditas</label>
              <select
                className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700"
                value={komoditas}
                onChange={(e) => handleKomoditasFilterChange(e.target.value)}
              >
                <option value="all">Semua Komoditas</option>
                {commodityFilterOptions.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Varietas */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Varietas</label>
              <select
                className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700"
                value={varietas}
                onChange={(e) => {
                  setVarietas(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Semua Varietas</option>
                {varietyFilterOptions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            {/* Tipe Panenan */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tipe Panenan</label>
              <select
                className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700"
                value={tipePanenan}
                onChange={(e) => {
                  setTipePanenan(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Semua Tipe Panenan</option>
                <option value="Glondong / Fresh">Glondong / Fresh</option>
                <option value="OC / Benih">OC / Benih</option>
              </select>
            </div>

            {/* Status */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Status</label>
              <select
                className="w-full text-xs rounded-lg border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="lg:col-span-3">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">Pencarian</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="w-full text-xs rounded-lg border border-gray-200 pl-9 pr-3 py-2 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-700"
                  placeholder="Cari nomor kontrak / nama varietas..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="lg:col-span-1 flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors mt-5"
                title="Reset semua filter"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
            </div>

          </div>
        </div>

        {/* Full-width Data Table (Memanjang ke bawah) */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-600">
              <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200/70 text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No.</th>
                  <th className="py-3 px-3">No. Kontrak</th>
                  <th className="py-3 px-3">Komoditas</th>
                  <th className="py-3 px-3">Varietas</th>
                  <th className="py-3 px-3">Tipe Panenan</th>
                  <th className="py-3 px-3 text-right">Nilai Kontrak</th>
                  <th className="py-3 px-3 text-right">Fee Kelompok</th>
                  <th className="py-3 px-3 text-center">Satuan</th>
                  <th className="py-3 px-3 text-center">Umur Panen</th>
                  <th className="py-3 px-3">Periode Berlaku</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Memuat data kontrak panen...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      Tidak ada data kontrak panen yang sesuai kriteria.
                    </td>
                  </tr>
                ) : (
                  items.map((row, idx) => {
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;

                    return (
                      <tr
                        key={row.id || idx}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        {/* No */}
                        <td className="py-3 px-3 text-center font-medium text-gray-500">
                          {rowNumber}
                        </td>

                        {/* No Kontrak */}
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">
                          {row.noKontrak}
                        </td>

                        {/* Komoditas */}
                        <td className="py-3 px-3 font-semibold text-gray-800">
                          {row.komoditas}
                        </td>

                        {/* Varietas */}
                        <td className="py-3 px-3 text-gray-800 font-medium">
                          {row.varietas}
                        </td>

                        {/* Tipe Panenan */}
                        <td className="py-3 px-3">
                          {renderTipePanenanBadge(row.tipePanenan)}
                        </td>

                        {/* Nilai Kontrak */}
                        <td className="py-3 px-3 text-right font-bold text-gray-900">
                          Rp {row.nilaiKontrak.toLocaleString('id-ID')}
                        </td>

                        {/* Fee Kelompok */}
                        <td className="py-3 px-3 text-right font-semibold text-gray-800">
                          {row.feeKelompok !== null && row.feeKelompok !== undefined
                            ? `Rp ${Number(row.feeKelompok).toLocaleString('id-ID')}`
                            : '-'}
                        </td>

                        {/* Satuan */}
                        <td className="py-3 px-3 text-center font-medium text-gray-600">
                          {row.satuan}
                        </td>

                        {/* Umur Panen */}
                        <td className="py-3 px-3 text-center font-bold text-gray-800">
                          {row.umurPanen} HST
                        </td>

                        {/* Periode Berlaku */}
                        <td className="py-3 px-3 text-gray-600 font-medium">
                          {formatDateRange(row.periodeMulai, row.periodeSelesai)}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center">
                          {renderStatusBadge(row.status)}
                        </td>

                        {/* Aksi */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* View Button (Eye) */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetailModal(row)}
                              className="w-7 h-7 rounded-lg inline-flex items-center justify-center text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Lihat Detail Kontrak"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Edit Button (Pencil) */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(row)}
                              className="w-7 h-7 rounded-lg inline-flex items-center justify-center text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title="Edit Kontrak Panen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            {/* Delete Button (Trash) */}
                            <button
                              type="button"
                              onClick={() => handleDelete(row)}
                              className="w-7 h-7 rounded-lg inline-flex items-center justify-center text-gray-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Hapus Kontrak Panen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Controls */}
          <div className="px-5 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Menampilkan{' '}
              <span className="font-semibold text-gray-800">
                {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </span>{' '}
              -{' '}
              <span className="font-semibold text-gray-800">
                {Math.min(currentPage * pageSize, totalRecords)}
              </span>{' '}
              dari <span className="font-semibold text-gray-800">{totalRecords}</span> data
            </div>

            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#078836] text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Modal Tambah / Edit Kontrak Panen */}
      <ModalFormKontrak
        isOpen={isFormModalOpen}
        mode={formModalMode}
        formData={formData}
        setFormData={setFormData}
        commodityList={commodityList}
        varietyList={varietyList}
        harvestTypesList={harvestTypesList}
        loadingHarvestTypes={loadingHarvestTypes}
        onFetchHarvestTypes={fetchHarvestTypesForVariety}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveForm}
        isLoading={isSubmitting}
      />

      {/* Modal Detail Kontrak Panen */}
      <ModalDetailKontrak
        isOpen={isDetailModalOpen}
        item={selectedItem}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(item) => {
          setIsDetailModalOpen(false);
          handleOpenEditModal(item);
        }}
      />

      {/* Modal Import Data */}
      <ModalImportKontrak
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={refreshData}
      />

    </Fragment>
  );
}
