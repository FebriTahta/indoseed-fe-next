"use client";

import React, { Fragment, useState } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePersetujuanProduksi } from '@/app/hooks/usePersetujuanProduksi';
import { PersetujuanProduksi } from '@/app/types/persetujuanProduksi';
import ModalDetailPersetujuan from './component/ModalDetailPersetujuan';

export default function PersetujuanProduksiPage() {
  const {
    items,
    loading,
    error,
    stats,
    search,
    setSearch,
    filterJenis,
    setFilterJenis,
    filterPengaju,
    setFilterPengaju,
    filterStatus,
    setFilterStatus,
    filterPeriode,
    setFilterPeriode,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    handleResetFilters,
    handleApprove,
    handleReject,
    refreshData,
  } = usePersetujuanProduksi();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<PersetujuanProduksi | null>(null);

  const handleOpenDetail = (item: PersetujuanProduksi) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const formatDateTimeDisplay = (dateVal: any) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      const dateStr = d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dateStr} ${timeStr}`;
    } catch {
      return String(dateVal);
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('setuju') || s === 'disetujui') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Disetujui
        </span>
      );
    }
    if (s.includes('tolak') || s === 'ditolak') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          Ditolak
        </span>
      );
    }
    // Default to Menunggu / Proses
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Menunggu
      </span>
    );
  };

  const startEntry = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalRecords);

  return (
    <Fragment>
      <Seo title="Persetujuan Produksi | Sistem Informasi Perusahaan Benih" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Breadcrumb & Header Bar */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-2">
            <span>Produksi</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 font-semibold">Persetujuan Produksi</span>
          </nav>

          <div className="flex items-center gap-3">
            {/* Green Checklist Briefcase Icon */}
            <div className="w-12 h-12 rounded-xl bg-[#078836] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Persetujuan Produksi
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Kelola pengajuan yang membutuhkan verifikasi dan persetujuan.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Stat KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Menunggu Persetujuan */}
          <div
            onClick={() => setFilterStatus('Proses')}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
              filterStatus === 'Proses'
                ? 'border-amber-400 ring-2 ring-amber-100 shadow-sm'
                : 'border-gray-200/80 shadow-2xs hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-gray-500 block">Menunggu Persetujuan</span>
                <div className="text-2xl font-black text-gray-900">{stats.menunggu}</div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">
              <span>Lihat detail</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2: Disetujui */}
          <div
            onClick={() => setFilterStatus('Disetujui')}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
              filterStatus === 'Disetujui'
                ? 'border-emerald-400 ring-2 ring-emerald-100 shadow-sm'
                : 'border-gray-200/80 shadow-2xs hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-gray-500 block">Disetujui</span>
                <div className="text-2xl font-black text-gray-900">{stats.disetujui}</div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">
              <span>Lihat detail</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3: Ditolak */}
          <div
            onClick={() => setFilterStatus('Ditolak')}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
              filterStatus === 'Ditolak'
                ? 'border-rose-400 ring-2 ring-rose-100 shadow-sm'
                : 'border-gray-200/80 shadow-2xs hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-gray-500 block">Ditolak</span>
                <div className="text-2xl font-black text-gray-900">{stats.ditolak}</div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">
              <span>Lihat detail</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 4: Semua */}
          <div
            onClick={() => setFilterStatus('all')}
            className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
              filterStatus === 'all'
                ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm'
                : 'border-gray-200/80 shadow-2xs hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-gray-500 block">Semua</span>
                <div className="text-2xl font-black text-gray-900">{stats.total}</div>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">
              <span>Lihat detail</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Jenis Pengajuan Dropdown */}
            <div className="w-full sm:w-52">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Jenis Pengajuan
              </label>
              <div className="relative">
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="Jadwal Tanam">Jadwal Tanam</option>
                  <option value="Revisi Jadwal Tanam">Revisi Jadwal Tanam</option>
                  <option value="Perubahan Target Produksi">Perubahan Target Produksi</option>
                  <option value="Batch Produksi">Batch Produksi</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Periode Dropdown */}
            <div className="w-full sm:w-56">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Periode
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <select
                  value={filterPeriode}
                  onChange={(e) => setFilterPeriode(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="all">Semua Periode</option>
                  <option value="2026-06">01/06/2026 - 30/06/2026</option>
                  <option value="2026-07">01/07/2026 - 31/07/2026</option>
                  <option value="2026-08">01/08/2026 - 31/08/2026</option>
                  <option value="2026-09">01/09/2026 - 30/09/2026</option>
                  <option value="2026-10">01/10/2026 - 31/10/2026</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Pengaju Dropdown */}
            <div className="w-full sm:w-52">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Pengaju
              </label>
              <div className="relative">
                <select
                  value={filterPengaju}
                  onChange={(e) => setFilterPengaju(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="all">Semua Pengaju</option>
                  <option value="Petugas Produksi">Petugas Produksi</option>
                  <option value="Supervisor Produksi">Supervisor Produksi</option>
                  <option value="Manager Produksi">Manager Produksi</option>
                  <option value="Petani Mitra">Petani Mitra</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Search Input */}
            <div className="flex-1 min-w-[240px]">
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                Pencarian
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari nomor pengajuan, judul, atau komoditas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            {/* Reset Filter Button */}
            <div className="self-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium transition-colors"
                title="Reset filter"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width Table: Daftar Pengajuan Persetujuan (Melebar Dari Kiri Ke Kanan) */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 m-0">
              Daftar Pengajuan Persetujuan
            </h2>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200/90 bg-gray-50/75 text-gray-600 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3 font-semibold">No. Pengajuan</th>
                  <th className="p-3 font-semibold">Jenis</th>
                  <th className="p-3 font-semibold">Judul / Kegiatan</th>
                  <th className="p-3 font-semibold">Pengaju</th>
                  <th className="p-3 font-semibold">Tanggal</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-gray-500">Memuat data pengajuan persetujuan...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-rose-600">
                      {error}
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-gray-500">
                      Tidak ada data pengajuan persetujuan yang cocok.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenDetail(item)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        {/* No */}
                        <td className="p-3 text-center text-gray-500 font-medium">
                          {rowNumber}
                        </td>

                        {/* No. Pengajuan */}
                        <td className="p-3 font-semibold text-gray-900 font-mono">
                          {item.noPengajuan}
                        </td>

                        {/* Jenis */}
                        <td className="p-3 text-gray-800 font-medium">
                          {item.jenis}
                        </td>

                        {/* Judul / Kegiatan */}
                        <td className="p-3 font-medium text-gray-900">
                          {item.judul}
                        </td>

                        {/* Pengaju */}
                        <td className="p-3 text-gray-700">
                          {item.pengaju}
                        </td>

                        {/* Tanggal */}
                        <td className="p-3 text-gray-500 font-mono text-[11px]">
                          {formatDateTimeDisplay(item.tanggalPengajuan)}
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          {renderStatusBadge(item.status)}
                        </td>

                        {/* Aksi */}
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(item)}
                            className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white inline-flex items-center justify-center transition-colors border border-emerald-200/80 shadow-2xs"
                            title="Lihat Detail Pengajuan"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="p-3.5 border-t border-gray-200/80 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Menampilkan {startEntry} - {endEntry} dari {totalRecords} data
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous Button */}
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#078836] text-white shadow-xs'
                      : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up / Modal Detail Pengajuan Persetujuan */}
      <ModalDetailPersetujuan
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedItem}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Fragment>
  );
}
