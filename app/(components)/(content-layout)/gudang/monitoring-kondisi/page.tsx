"use client";

import React, { useState } from 'react';
import useMonitoringGudang from '@/app/hooks/useMonitoringGudang';
import TrenSuhuRhChart from './component/TrenSuhuRhChart';
import DistribusiStatusDonut from './component/DistribusiStatusDonut';
import PeringatanTindakanCard from './component/PeringatanTindakanCard';
import InputPengukuranModal from './component/InputPengukuranModal';
import DetailMonitoringModal from './component/DetailMonitoringModal';
import LaporanMonitoringModal from './component/LaporanMonitoringModal';
import { MonitoringTab, MonitoringGudangItem } from '@/app/types/monitoringGudang';

export default function MonitoringKondisiGudangPage() {
  const {
    activeTab,
    handleTabChange,
    items,
    stats,
    alerts,
    trenData,
    gudangOptions,
    loading,
    isSubmitting,
    // Filters
    searchQuery,
    setSearchQuery,
    filterGudang,
    setFilterGudang,
    filterZona,
    setFilterZona,
    filterStatus,
    setFilterStatus,
    filterRange,
    setFilterRange,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals
    isInputModalOpen,
    setIsInputModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isLaporanModalOpen,
    setIsLaporanModalOpen,
    selectedItem,
    editingItem,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleDeleteItem,
    handleAlertAction,
    // Form
    formData,
    setFormData,
    handleSubmitForm,
  } = useMonitoringGudang();

  // Active menu dropdown id for table action dropdown
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Normal
          </span>
        );
      case 'Perlu Perhatian':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Perlu Perhatian
          </span>
        );
      case 'Tidak Sesuai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Tidak Sesuai
          </span>
        );
      case 'Sensor Offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Sensor Offline
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

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const formatNumberWithComma = (num: number | null) => {
    if (num === null || num === undefined) return '-';
    return String(num).replace('.', ',');
  };

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="p-4 sm:p-6 space-y-5 bg-[#f8fafc] min-h-screen">
      {/* 1. Breadcrumb & Date Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <i className="ri-home-4-line text-sm text-gray-400"></i>
          <span>&gt;</span>
          <span>Gudang &amp; Inventory</span>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">Monitoring Kondisi Gudang</span>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200/90 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs">
            <i className="ri-calendar-line text-gray-400 text-sm"></i>
            <span>14 Nov 2026 – 20 Nov 2026</span>
            <i className="ri-arrow-down-s-line text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* 2. Page Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Monitoring Kondisi Gudang
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Pemantauan suhu, kelembapan, dan kondisi penyimpanan gudang
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Button Input Pengukuran */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0d6832] hover:bg-[#0a5227] transition-all shadow-xs"
          >
            <i className="ri-add-line text-sm"></i>
            Input Pengukuran
          </button>

          {/* Button Laporan Monitoring */}
          <button
            type="button"
            onClick={() => setIsLaporanModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0d6832] bg-white border border-[#0d6832] hover:bg-emerald-50 transition-all shadow-xs"
          >
            <i className="ri-file-chart-line text-sm"></i>
            Laporan Monitoring
          </button>
        </div>
      </div>

      {/* 3. Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Zona Dipantau */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs hover:shadow-sm transition-shadow flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <i className="ri-stack-line text-xl"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Zona Dipantau</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{stats.totalZona} Zona</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-1">
              <span>▲ +0%</span>
              <span className="text-gray-400 font-normal">(tetap dari periode sebelumnya)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Normal */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs hover:shadow-sm transition-shadow flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <i className="ri-checkbox-circle-line text-xl"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Normal</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{stats.normal} Zona</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-1">
              <span>▲ +8%</span>
              <span className="text-gray-400 font-normal">(dari 12 zona)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Perlu Perhatian */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs hover:shadow-sm transition-shadow flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
            <i className="ri-alert-line text-xl"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Perlu Perhatian</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{stats.perluPerhatian} Zona</div>
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium mt-1">
              <span>▲ +50%</span>
              <span className="text-gray-400 font-normal">(dari 2 zona)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Sensor Offline / Tidak Sesuai */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-2xs hover:shadow-sm transition-shadow flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
            <i className="ri-close-circle-line text-xl"></i>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 block">Sensor Offline / Tidak Sesuai</span>
            <div className="text-xl font-bold text-gray-900 mt-0.5">{stats.offlineOrTidakSesuai} Zona</div>
            <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-1">
              <span>▲ +100%</span>
              <span className="text-gray-400 font-normal">(dari 1 zona)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('monitoring')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === 'monitoring'
              ? 'bg-[#0d6832] text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <i className="ri-pulse-line text-sm"></i>
          Monitoring
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('input')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === 'input'
              ? 'bg-[#0d6832] text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <i className="ri-edit-line text-sm"></i>
          Input
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('peringatan')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === 'peringatan'
              ? 'bg-[#0d6832] text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <i className="ri-notification-3-line text-sm"></i>
          Peringatan
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('riwayat')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === 'riwayat'
              ? 'bg-[#0d6832] text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <i className="ri-time-line text-sm"></i>
          Riwayat
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('pengaturan')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeTab === 'pengaturan'
              ? 'bg-[#0d6832] text-white shadow-2xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
        >
          <i className="ri-settings-3-line text-sm"></i>
          Pengaturan
        </button>
      </div>

      {/* 5. Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-3.5 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Input */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-4 relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Cari gudang, zona, atau sensor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#0d6832] focus:ring-[#0d6832] shadow-2xs"
            />
          </div>

          {/* Dropdown Gudang */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <select
              value={filterGudang}
              onChange={(e) => setFilterGudang(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-gray-300 focus:border-[#0d6832] focus:ring-[#0d6832] shadow-2xs bg-white text-gray-700"
            >
              <option value="all">Semua Gudang</option>
              {gudangOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.namaGudang}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown Zona */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <select
              value={filterZona}
              onChange={(e) => setFilterZona(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-gray-300 focus:border-[#0d6832] focus:ring-[#0d6832] shadow-2xs bg-white text-gray-700"
            >
              <option value="all">Semua Zona</option>
              <option value="Zona A">Zona A</option>
              <option value="Zona B">Zona B</option>
              <option value="Zona C">Zona C</option>
              <option value="Zona D">Zona D</option>
            </select>
          </div>

          {/* Dropdown Status */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-gray-300 focus:border-[#0d6832] focus:ring-[#0d6832] shadow-2xs bg-white text-gray-700"
            >
              <option value="all">Semua Status</option>
              <option value="Normal">Normal</option>
              <option value="Perlu Perhatian">Perlu Perhatian</option>
              <option value="Tidak Sesuai">Tidak Sesuai</option>
              <option value="Sensor Offline">Sensor Offline</option>
            </select>
          </div>

          {/* Dropdown Periode */}
          <div className="sm:col-span-1 md:col-span-1 lg:col-span-1">
            <select
              value={filterRange}
              onChange={(e) => setFilterRange(e.target.value)}
              className="w-full py-2 px-2 text-xs rounded-lg border border-gray-300 focus:border-[#0d6832] focus:ring-[#0d6832] shadow-2xs bg-white text-gray-700"
            >
              <option value="7days">7 Hari Terakhir</option>
              <option value="30days">30 Hari</option>
              <option value="all">Semua</option>
            </select>
          </div>

          {/* Filter & Reset Buttons */}
          <div className="sm:col-span-2 md:col-span-2 lg:col-span-1 flex items-center gap-1.5 justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filter"
              className="px-2.5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium shadow-2xs"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              title="Terapkan Filter"
              className="px-3 py-2 rounded-lg bg-[#0d6832] text-white hover:bg-[#0a5227] text-xs font-semibold flex items-center gap-1 shadow-2xs"
            >
              <i className="ri-filter-3-line text-xs"></i>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* 6. Table Section: Monitoring Zona Gudang */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 tracking-tight">
            Monitoring Zona Gudang
          </h2>
          <span className="text-xs text-gray-400">
            Terakhir diperbarui: 20 Nov 2026, 15:42 WIB
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200/70 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Gudang / Zona</th>
                <th className="py-3 px-3">Sensor</th>
                <th className="py-3 px-3">Suhu Terakhir</th>
                <th className="py-3 px-3">RH Terakhir</th>
                <th className="py-3 px-3">Batas Suhu</th>
                <th className="py-3 px-3">Batas RH</th>
                <th className="py-3 px-3">Waktu Pengukuran</th>
                <th className="py-3 px-3">Sumber Data</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    <i className="ri-loader-4-line animate-spin text-2xl mb-2 block"></i>
                    Memuat data monitoring...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400">
                    <i className="ri-inbox-line text-3xl mb-1 block"></i>
                    Tidak ada data monitoring ditemukan
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Gudang / Zona */}
                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                      {row.namaGudang} – {row.zona}
                    </td>

                    {/* Sensor */}
                    <td className="py-3 px-3 font-mono text-gray-600 whitespace-nowrap">
                      {row.sensor || '-'}
                    </td>

                    {/* Suhu Terakhir */}
                    <td className="py-3 px-3 font-semibold text-gray-800 whitespace-nowrap">
                      {row.suhu !== null ? `${formatNumberWithComma(row.suhu)}°C` : '-'}
                    </td>

                    {/* RH Terakhir */}
                    <td className="py-3 px-3 font-semibold text-gray-800 whitespace-nowrap">
                      {row.rh !== null ? `${row.rh}%` : '-'}
                    </td>

                    {/* Batas Suhu */}
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                      {row.suhuMin}–{row.suhuMax}°C
                    </td>

                    {/* Batas RH */}
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                      {row.rhMin}–{row.rhMax}%
                    </td>

                    {/* Waktu Pengukuran */}
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap text-[11px]">
                      {formatDateDisplay(row.waktuPengukuran)}
                    </td>

                    {/* Sumber Data */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-gray-700 font-medium">
                        {row.sumberData}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {renderStatusBadge(row.status)}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3 whitespace-nowrap text-center relative">
                      <div className="inline-flex items-center gap-1">
                        {/* Eye Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(row)}
                          title="Lihat Detail"
                          className="p-1 rounded-md text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <i className="ri-eye-line text-sm"></i>
                        </button>

                        {/* Dropdown Menu Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === row.id ? null : row.id)
                            }
                            title="Menu Aksi"
                            className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <i className="ri-more-fill text-sm"></i>
                          </button>

                          {activeMenuId === row.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleOpenEditModal(row);
                                }}
                                className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <i className="ri-edit-line text-gray-400"></i>
                                Edit Data
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleOpenCreateModal();
                                }}
                                className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <i className="ri-add-circle-line text-emerald-600"></i>
                                Ukur Baru
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleDeleteItem(row.id);
                                }}
                                className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <i className="ri-delete-bin-line text-rose-500"></i>
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-semibold text-gray-700">{items.length > 0 ? startIdx : 0}–{endIdx}</span> dari{' '}
            <span className="font-semibold text-gray-700">{totalRecords}</span> data
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-md text-xs font-semibold transition-all ${currentPage === page
                    ? 'bg-[#0d6832] text-white shadow-2xs'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* 7. Bottom Section (3 Cards): Tren Suhu & Kelembapan, Distribusi Status Zona, Peringatan & Tindakan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Tren Suhu & Kelembapan */}
        <div>
          <TrenSuhuRhChart location={trenData.location} series={trenData.series} />
        </div>

        {/* Card 2: Distribusi Status Zona */}
        <div>
          <DistribusiStatusDonut stats={stats} />
        </div>

        {/* Card 3: Peringatan & Tindakan */}
        <div>
          <PeringatanTindakanCard alerts={alerts} onActionClick={handleAlertAction} />
        </div>
      </div>

      {/* 8. Bottom ISO Advisory Banner */}
      <div className="bg-[#f0fdf4] border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900 shadow-2xs">
        <i className="ri-information-line text-emerald-600 text-base mt-0.5 flex-shrink-0"></i>
        <span className="leading-relaxed">
          Jika kondisi gudang berada di luar batas, lakukan tindakan koreksi dan evaluasi dampaknya terhadap lot benih atau material terkait sesuai prosedur ISO.
        </span>
      </div>

      {/* Modals */}
      <InputPengukuranModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleSubmitForm}
        formData={formData}
        setFormData={setFormData}
        gudangOptions={gudangOptions}
        editingItem={editingItem}
        isSubmitting={isSubmitting}
      />

      <DetailMonitoringModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={selectedItem}
        onEdit={handleOpenEditModal}
      />

      <LaporanMonitoringModal
        isOpen={isLaporanModalOpen}
        onClose={() => setIsLaporanModalOpen(false)}
        items={items}
        stats={stats}
      />
    </div>
  );
}
