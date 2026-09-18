"use client";

import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useJadwalTanams } from '@/app/hooks/useJadwalTanam';
import { JadwalTanam } from '@/app/types/jadwalTanam';
import ModalRevisiJadwal from './component/ModalRevisiJadwal';

export default function JadwalTanamPage() {
  const router = useRouter();
  const {
    items,
    loading,
    error,
    stats,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterStatus,
    setFilterStatus,
    filterPetani,
    setFilterPetani,
    filterKomoditas,
    setFilterKomoditas,
    partnerList,
    commodityList,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    selectedRowIds,
    handleSelectRow,
    handleSelectAllRows,
    handleResetFilters,
    handleDelete,
    handleUpdateStatus,
    refreshData,
  } = useJadwalTanams();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isRevisiModalOpen, setIsRevisiModalOpen] = useState<boolean>(false);
  const [selectedItemForRevisi, setSelectedItemForRevisi] = useState<JadwalTanam | null>(null);

  const handleOpenRevisiModal = (item?: JadwalTanam) => {
    if (item) {
      setSelectedItemForRevisi(item);
    } else if (selectedRowIds.length > 0) {
      const found = items.find((i) => i.id === selectedRowIds[0]);
      setSelectedItemForRevisi(found || items[0] || null);
    } else {
      setSelectedItemForRevisi(items[0] || null);
    }
    setIsRevisiModalOpen(true);
  };

  const formatDateDisplay = (dateVal: any) => {
    if (!dateVal) return '-';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return String(dateVal);
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('setuju') || s === 'disetujui') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Disetujui
        </span>
      );
    }
    if (s.includes('proses') || s === 'dalam proses') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
          <svg className="w-3.5 h-3.5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3" />
          </svg>
          Dalam Proses
        </span>
      );
    }
    if (s.includes('revisi') || s.includes('ubah')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Revisi
        </span>
      );
    }
    if (s.includes('tolak') || s === 'ditolak') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
          <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
          </svg>
          Ditolak
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
        {status || 'Draft'}
      </span>
    );
  };

  const startEntry = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalRecords);

  return (
    <Fragment>
      <Seo title="Jadwal Tanam | Sistem Informasi Perusahaan Benih" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Breadcrumb & Header Bar */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 mb-2">
            <span>Produksi</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 font-semibold">Jadwal Tanam</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title with Sprout Icon */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200/60">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Jadwal Tanam</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kelola jadwal tanam berdasarkan permintaan petani dan rencana produksi perusahaan.
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenRevisiModal()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 bg-white text-emerald-700 hover:bg-emerald-50/50 text-xs font-semibold transition-colors shadow-2xs"
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Revisi Jadwal Tanam</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/produksi/jadwaltanam/create')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#078836] hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Jadwal Tanam</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Jadwal Tanam */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-sm transition-shadow flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Total Jadwal Tanam
              </span>
              <div className="text-2xl font-black text-gray-900">{stats.total}</div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <span>↑</span>
                <span>{stats.trends?.total || '2 dari bulan lalu'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Dalam Proses */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-sm transition-shadow flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Dalam Proses
              </span>
              <div className="text-2xl font-black text-gray-900">{stats.dalamProses}</div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-sky-600">
                <span>↑</span>
                <span>{stats.trends?.dalamProses || '1 dari bulan lalu'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v5l3 3" />
              </svg>
            </div>
          </div>

          {/* Disetujui */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-sm transition-shadow flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Disetujui
              </span>
              <div className="text-2xl font-black text-gray-900">{stats.disetujui}</div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <span>↑</span>
                <span>{stats.trends?.disetujui || '2 dari bulan lalu'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>

          {/* Revisi / Perubahan */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-sm transition-shadow flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Revisi / Perubahan
              </span>
              <div className="text-2xl font-black text-gray-900">{stats.revisi}</div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                <span>↑</span>
                <span>{stats.trends?.revisi || '1 dari bulan lalu'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Ditolak */}
          <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-sm transition-shadow flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                Ditolak
              </span>
              <div className="text-2xl font-black text-gray-900">{stats.ditolak}</div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                <span>↓</span>
                <span>{stats.trends?.ditolak || '0 dari bulan lalu'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari nomor jadwal, petani, atau komoditas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-800 placeholder-gray-400 bg-white"
              />
            </div>

            {/* Periode Tanam */}
            <div className="w-full sm:w-44">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <select
                  value={filterPeriode}
                  onChange={(e) => setFilterPeriode(e.target.value)}
                  className="w-full pl-8 pr-7 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="all">Pilih periode</option>
                  <option value="2026-07">Jul 2026</option>
                  <option value="2026-08">Agu 2026</option>
                  <option value="2026-09">Sep 2026</option>
                  <option value="2026-10">Okt 2026</option>
                  <option value="2026-11">Nov 2026</option>
                  <option value="2026-12">Des 2026</option>
                </select>
                <span className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="w-full sm:w-40">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Revisi">Revisi</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            {/* Petani Mitra Dropdown */}
            <div className="w-full sm:w-44">
              <select
                value={filterPetani}
                onChange={(e) => setFilterPetani(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Semua Petani</option>
                {partnerList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.namaPetani}
                  </option>
                ))}
              </select>
            </div>

            {/* Komoditas Dropdown */}
            <div className="w-full sm:w-44">
              <select
                value={filterKomoditas}
                onChange={(e) => setFilterKomoditas(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">Semua Komoditas</option>
                {commodityList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.namaKomoditas}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50/80 hover:bg-gray-100 text-gray-700 text-xs font-medium transition-colors shrink-0"
              title="Reset semua filter"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Full-width Main Table (Long Downwards, No Detail Card Below) */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200/90 bg-gray-50/75 text-gray-600 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selectedRowIds.length === items.length}
                      onChange={handleSelectAllRows}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3 font-semibold">No. Jadwal</th>
                  <th className="p-3 font-semibold">Petani Mitra</th>
                  <th className="p-3 font-semibold">Lahan</th>
                  <th className="p-3 font-semibold">Komoditas / Varietas</th>
                  <th className="p-3 font-semibold">Rencana Tanam</th>
                  <th className="p-3 font-semibold">Estimasi Panen</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Keterangan</th>
                  <th className="p-3 font-semibold text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-gray-500">Memuat data jadwal tanam...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-rose-600">
                      {error}
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      Tidak ada data jadwal tanam yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isChecked = selectedRowIds.includes(item.id);
                    const lahanCount = item.detailLahan?.length || 1;
                    const farmerCode = item.kodePetani || item.partner?.kodePetani || '-';
                    const farmerName = item.namaPetani || item.partner?.namaPetani || 'Petani Mandiri';
                    const commodityName = item.komoditas || item.commodity?.namaKomoditas || '-';
                    const varietyName = item.varietas || item.variety?.namaVarietas || '-';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isChecked ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleSelectRow(item.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>

                        {/* No. Jadwal */}
                        <td className="p-3 font-semibold text-gray-900">
                          <button
                            type="button"
                            onClick={() => router.push(`/produksi/jadwaltanam/view/${item.id}`)}
                            className="hover:text-emerald-700 hover:underline text-left font-semibold"
                          >
                            {item.kodeJadwalTanam}
                          </button>
                        </td>

                        {/* Petani Mitra */}
                        <td className="p-3">
                          <div className="font-semibold text-gray-900">{farmerName}</div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">{farmerCode}</div>
                        </td>

                        {/* Lahan */}
                        <td className="p-3 text-gray-800 font-medium">
                          {lahanCount} Lahan
                        </td>

                        {/* Komoditas / Varietas */}
                        <td className="p-3 text-gray-800 font-medium">
                          {commodityName} / {varietyName}
                        </td>

                        {/* Rencana Tanam */}
                        <td className="p-3 text-gray-600">
                          {formatDateDisplay(item.tanggalTanam || item.periodeTanamMulai)}
                        </td>

                        {/* Estimasi Panen */}
                        <td className="p-3 text-gray-600">
                          {formatDateDisplay(item.perkiraanPanen || item.periodeTanamSelesai)}
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleOpenRevisiModal(item)}
                            className="cursor-pointer text-left focus:outline-none"
                            title="Klik untuk membuka Revisi / Info Jadwal"
                          >
                            {renderStatusBadge(item.statusJadwal)}
                          </button>
                        </td>

                        {/* Keterangan */}
                        <td className="p-3 text-gray-500 max-w-xs truncate" title={item.keterangan || item.catatan || '-'}>
                          {item.keterangan || item.catatan || '-'}
                        </td>

                        {/* Aksi */}
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* View Button */}
                            <button
                              type="button"
                              onClick={() => router.push(`/produksi/jadwaltanam/view/${item.id}`)}
                              className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                              title="Lihat Detail (Halaman Baru)"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => router.push(`/produksi/jadwaltanam/edit/${item.id}`)}
                              className="p-1.5 text-gray-500 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                              title="Edit Jadwal Tanam (Halaman Baru)"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            {/* More Options Dropdown */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                title="Opsi Lainnya"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                              </button>

                              {activeActionId === item.id && (
                                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-30 py-1 text-left">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleOpenRevisiModal(item);
                                      setActiveActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-semibold"
                                  >
                                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span>Ajukan Revisi</span>
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                    Ubah Status
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleUpdateStatus(item.id, 'Disetujui');
                                      setActiveActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Setujui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleUpdateStatus(item.id, 'Dalam Proses');
                                      setActiveActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-sky-700 hover:bg-sky-50 flex items-center gap-2"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                    Dalam Proses
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleUpdateStatus(item.id, 'Revisi');
                                      setActiveActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Revisi
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleUpdateStatus(item.id, 'Ditolak');
                                      setActiveActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                    Tolak
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDelete(item.id, item.kodeJadwalTanam);
                                      setActiveActionId(null);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Hapus
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
          </div>

          {/* Footer & Pagination */}
          <div className="p-3.5 border-t border-gray-200/80 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Menampilkan {startEntry} - {endEntry} dari {totalRecords} data
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous */}
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

              {/* Page Numbers */}
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

              {/* Next */}
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

      {/* Modal Revisi Jadwal Tanam */}
      <ModalRevisiJadwal
        isOpen={isRevisiModalOpen}
        onClose={() => setIsRevisiModalOpen(false)}
        item={selectedItemForRevisi}
        availableItems={items}
        onSuccess={() => {
          refreshData();
        }}
      />
    </Fragment>
  );
}
