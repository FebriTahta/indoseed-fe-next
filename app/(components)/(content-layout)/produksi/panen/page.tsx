"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import usePanen from '@/app/hooks/usePanen';
import { PanenItem } from '@/app/types/panen';
import DetailPanenPanel from './component/DetailPanenPanel';
import ModalTambahPanen from './component/ModalTambahPanen';
import RingkasanKomoditasCard from './component/RingkasanKomoditasCard';
import GrafikHasilPanenCard from './component/GrafikHasilPanenCard';
import ModalLihatFoto from './component/ModalLihatFoto';

export default function PanenPage() {
  const {
    panenList,
    isLoading,
    isSaving,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterKomoditas,
    setFilterKomoditas,
    filterPetani,
    setFilterPetani,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    stats,
    ringkasanKomoditas,
    chartData,
    eligibleJadwals,
    selectedDetailPanen,
    handleToggleDetail,
    setSelectedDetailPanen,
    isModalOpen,
    editingItem,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSavePanen,
    handleDeletePanen,
    handleApplyFilters,
    handleResetFilters,
    komoditasOptions,
    statusOptions,
    petaniOptions,
    isFotoModalOpen,
    setIsFotoModalOpen,
  } = usePanen();

  // Active menu dropdown for each row
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  const getCommodityIcon = (komoditas: string) => {
    const k = komoditas.toLowerCase();
    if (k.includes('melon')) {
      return (
        <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs flex-shrink-0">
          🍈
        </span>
      );
    }
    if (k.includes('cabai')) {
      return (
        <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center text-xs flex-shrink-0">
          🌶️
        </span>
      );
    }
    if (k.includes('padi')) {
      return (
        <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center text-xs flex-shrink-0">
          🌾
        </span>
      );
    }
    if (k.includes('tomat')) {
      return (
        <span className="w-6 h-6 rounded-md bg-red-50 text-red-700 flex items-center justify-center text-xs flex-shrink-0">
          🍅
        </span>
      );
    }
    if (k.includes('kangkung')) {
      return (
        <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center text-xs flex-shrink-0">
          🌿
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center text-xs flex-shrink-0">
        🌱
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <i className="ri-check-line text-xs"></i>
            Selesai
          </span>
        );
      case 'Dalam Proses':
      case 'Berlangsung':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <i className="ri-time-line text-xs"></i>
            Dalam Proses
          </span>
        );
      case 'Tertunda':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <i className="ri-error-warning-line text-xs"></i>
            Tertunda
          </span>
        );
      case 'Menunggu':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <i className="ri-time-line text-xs"></i>
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/produksi" className="hover:text-emerald-700 transition-colors">
              Produksi
            </Link>
            <i className="ri-arrow-right-s-line text-xs"></i>
            <span className="text-gray-800 font-semibold">Panen</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-xl shadow-xs">
              <i className="ri-seedling-line"></i>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Panen</h1>
              <p className="text-xs text-gray-500">
                Kelola proses panen mulai dari jadwal panen, realisasi panen, hingga hasil panen per lahan.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <i className="ri-arrow-left-line text-sm"></i>
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          >
            <i className="ri-add-line text-base"></i>
            <span>Tambah Data Panen</span>
          </button>
        </div>
      </div>

      {/* 2. Top 5 KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Jadwal Panen */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block">Total Jadwal Panen</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{stats.totalJadwal}</span>
                <span className="text-xs text-gray-400 font-medium">jadwal</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
              <i className="ri-seedling-line"></i>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <i className="ri-arrow-up-line"></i>
            <span>2 dari bulan lalu</span>
          </div>
        </div>

        {/* Panen Selesai */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block">Panen Selesai</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{stats.selesaiCount}</span>
                <span className="text-xs text-gray-400 font-medium">jadwal</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
              <i className="ri-checkbox-circle-line"></i>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <i className="ri-arrow-up-line"></i>
            <span>3 dari bulan lalu</span>
          </div>
        </div>

        {/* Dalam Proses */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block">Dalam Proses</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{stats.dalamProsesCount}</span>
                <span className="text-xs text-gray-400 font-medium">jadwal</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
              <i className="ri-time-line"></i>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <i className="ri-arrow-up-line"></i>
            <span>1 dari bulan lalu</span>
          </div>
        </div>

        {/* Tertunda */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block">Tertunda</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">{stats.tertundaCount}</span>
                <span className="text-xs text-gray-400 font-medium">jadwal</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center text-lg">
              <i className="ri-error-warning-line"></i>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-rose-600">
            <i className="ri-arrow-down-line"></i>
            <span>1 dari bulan lalu</span>
          </div>
        </div>

        {/* Total Hasil Panen */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-gray-500 block">Total Hasil Panen</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-gray-900">
                  {stats.totalHasilKg.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-gray-400 font-medium">kg</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-lg">
              <i className="ri-scales-3-line"></i>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
            <i className="ri-arrow-up-line"></i>
            <span>18% dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* 2.1 Sub-Cards: Glondong / Buah & OC / Benih (matching Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-xl">
            <i className="ri-plant-line"></i>
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium block">Glondong / Buah</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-gray-900">
                {stats.glondongKg.toLocaleString('id-ID')} kg
              </span>
              <span className="text-[11px] text-gray-400">({stats.glondongJadwal} jadwal)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center text-xl">
            <i className="ri-seedling-line"></i>
          </div>
          <div>
            <span className="text-[11px] text-gray-400 font-medium block">OC / Benih</span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-gray-900">
                {stats.ocKg.toLocaleString('id-ID')} kg
              </span>
              <span className="text-[11px] text-gray-400">({stats.ocJadwal} jadwal)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Row */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Search input */}
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            placeholder="Cari nomor jadwal, petani, lahan, komoditas..."
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-gray-200 bg-gray-50/60 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <i className="ri-search-line text-sm"></i>
          </span>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Komoditas Filter */}
          <select
            value={filterKomoditas}
            onChange={(e) => setFilterKomoditas(e.target.value)}
            className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
          >
            {komoditasOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Petani Mitra Filter */}
          <select
            value={filterPetani}
            onChange={(e) => setFilterPetani(e.target.value)}
            className="h-9 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-emerald-500"
          >
            {petaniOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Filter & Reset Buttons */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="h-9 px-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <i className="ri-filter-3-line text-xs"></i>
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={handleResetFilters}
            className="h-9 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <i className="ri-refresh-line text-xs"></i>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 4. Middle Layout: Daftar Panen Table & Detail Panen Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Column (takes 8 cols if Detail is open, 12 cols if closed) */}
        <div
          className={`${
            selectedDetailPanen ? 'lg:col-span-8' : 'lg:col-span-12'
          } bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-5 space-y-4 transition-all duration-300`}
        >
          {/* Table Header Title */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <i className="ri-file-list-3-line text-base"></i>
              </div>
              <h2 className="text-sm font-bold text-gray-900">Daftar Panen</h2>
            </div>
            <span className="text-xs text-gray-400">
              Total {totalRecords} data panen
            </span>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 w-8">
                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                  </th>
                  <th className="py-2.5 px-2 w-8">No.</th>
                  <th className="py-2.5 px-3">Nomor Panen</th>
                  <th className="py-2.5 px-3">Petani Mitra</th>
                  <th className="py-2.5 px-3">Lahan / Blok</th>
                  <th className="py-2.5 px-3">Komoditas / Varietas</th>
                  <th className="py-2.5 px-3">Rencana Panen</th>
                  <th className="py-2.5 px-3">Aktual Panen</th>
                  <th className="py-2.5 px-3 text-right">Perkiraan Hasil</th>
                  <th className="py-2.5 px-3 text-right">Hasil Aktual</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-400">
                      <i className="ri-loader-4-line animate-spin text-xl block mb-1"></i>
                      Memuat data panen...
                    </td>
                  </tr>
                ) : panenList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-400">
                      Tidak ada data panen yang sesuai kriteria filter.
                    </td>
                  </tr>
                ) : (
                  panenList.map((item, index) => {
                    const isSelected = selectedDetailPanen?.id === item.id;
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-emerald-50/30 transition-colors ${
                          isSelected ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                        </td>
                        <td className="py-3 px-2 text-gray-400 font-medium">{rowNumber}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 font-mono block">
                            {item.kodePanen}
                          </span>
                          {item.kodeJadwalTanam && (
                            <span className="text-[10px] text-gray-400 block font-mono">
                              Ref: {item.kodeJadwalTanam}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-gray-900 block">{item.petani || 'Budi Santoso'}</span>
                          <span className="text-[10px] text-gray-400 block">{item.petaniKode || 'BTN-001'}</span>
                        </td>
                        <td className="py-3 px-3 text-gray-700 font-medium">
                          {item.lahan || 'LHN-001 / Blok 01'}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            {getCommodityIcon(item.komoditas)}
                            <div>
                              <span className="font-bold text-gray-900 block">{item.komoditas}</span>
                              <span className="text-[10px] text-gray-500 block">{item.varietas}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          {item.rencanaPanen
                            ? new Date(item.rencanaPanen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '-'}
                        </td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          {item.status === 'Selesai' && item.tanggalPanen
                            ? new Date(item.tanggalPanen).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-gray-700 whitespace-nowrap">
                          {item.perkiraanHasil ? `${item.perkiraanHasil.toLocaleString('id-ID')} kg` : '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-gray-900 whitespace-nowrap">
                          {item.produksiKg && item.produksiKg > 0 ? `${item.produksiKg.toLocaleString('id-ID')} kg` : '-'}
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-3 px-3 text-center relative">
                          <div className="flex items-center justify-center gap-1">
                            {/* Gambar Mata button for Show/Hide Detail Panen */}
                            <button
                              type="button"
                              onClick={() => handleToggleDetail(item)}
                              title={isSelected ? 'Sembunyikan Detail Panen' : 'Lihat Detail Panen'}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-gray-400 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              <i className="ri-eye-line text-sm"></i>
                            </button>

                            {/* Dropdown 3 dots */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveActionMenuId(
                                    activeActionMenuId === item.id ? null : item.id
                                  )
                                }
                                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                              >
                                <i className="ri-more-fill text-sm"></i>
                              </button>

                              {activeActionMenuId === item.id && (
                                <div className="absolute right-0 top-8 z-20 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-left text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionMenuId(null);
                                      handleOpenEditModal(item);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                                  >
                                    <i className="ri-edit-line text-emerald-600"></i>
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveActionMenuId(null);
                                      handleDeletePanen(item);
                                    }}
                                    className="w-full px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600"
                                  >
                                    <i className="ri-delete-bin-line"></i>
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

          {/* Table Footer: Records count and Pagination */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <span>
              Menampilkan {Math.min(1, panenList.length)} - {panenList.length} dari {totalRecords} data
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
              >
                <i className="ri-arrow-left-s-line text-xs"></i>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg font-semibold text-xs flex items-center justify-center transition-colors ${
                    currentPage === i + 1
                      ? 'bg-emerald-700 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
              >
                <i className="ri-arrow-right-s-line text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Detail Panen Column (Only shown when selectedDetailPanen != null) */}
        {selectedDetailPanen && (
          <div className="lg:col-span-4 sticky top-6">
            <DetailPanenPanel
              item={selectedDetailPanen}
              onClose={() => setSelectedDetailPanen(null)}
              onOpenFotoModal={() => setIsFotoModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* 5. Bottom Section: Ringkasan Panen per Komoditas (Left) & Grafik Hasil Panen (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Ringkasan Panen per Komoditas (Left) */}
        <div className="lg:col-span-7">
          <RingkasanKomoditasCard data={ringkasanKomoditas} />
        </div>

        {/* Grafik Hasil Panen (Right) */}
        <div className="lg:col-span-5">
          <GrafikHasilPanenCard chartData={chartData} />
        </div>
      </div>

      {/* 6. Modals */}
      <ModalTambahPanen
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePanen}
        isSaving={isSaving}
        eligibleJadwals={eligibleJadwals}
        initialData={editingItem}
        totalRecords={totalRecords}
      />

      <ModalLihatFoto
        isOpen={isFotoModalOpen}
        onClose={() => setIsFotoModalOpen(false)}
        item={selectedDetailPanen}
      />
    </div>
  );
}
