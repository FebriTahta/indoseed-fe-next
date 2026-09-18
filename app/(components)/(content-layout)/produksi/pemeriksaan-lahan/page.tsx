"use client";

import React, { Fragment, useState } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import usePemeriksaanLahan from '@/app/hooks/usePemeriksaanLahan';
import PemeriksaanStatsWidgets from './component/PemeriksaanStatsWidgets';
import PemeriksaanFilterBar from './component/PemeriksaanFilterBar';
import PemeriksaanDetailPanel from './component/PemeriksaanDetailPanel';
import ModalTambahPemeriksaan from './component/ModalTambahPemeriksaan';
import { PemeriksaanLahanItem } from '@/app/types/pemeriksaanLahan';

export default function PemeriksaanLahanPage() {
  const {
    items,
    stats,
    loading,
    search,
    setSearch,
    filterKomoditas,
    setFilterKomoditas,
    filterStatus,
    setFilterStatus,
    activeTab,
    setActiveTab,
    filterPeriode,
    setFilterPeriode,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    selectedItem,
    isDetailOpen,
    handleOpenDetail,
    handleCloseDetail,
    isAddModalOpen,
    handleOpenAddModal,
    handleCloseAddModal,
    eligibleJadwals,
    loadingEligible,
    refreshData,
  } = usePemeriksaanLahan();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const formatTanggalRow = (dateVal: any) => {
    if (!dateVal) return { date: '-', time: '' };
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return { date: String(dateVal), time: '' };
      const dateStr = d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { date: dateStr, time: timeStr };
    } catch {
      return { date: String(dateVal), time: '' };
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('memenuhi') && !s.includes('tidak')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Memenuhi
        </span>
      );
    }
    if (s.includes('roguing')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Perlu Roguing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
        Tidak Memenuhi
      </span>
    );
  };

  return (
    <Fragment>
      <Seo title="Pemeriksaan Lapangan - SI BENIH" />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Page Header */}
        <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <i className="ri-plant-line"></i> Produksi
          </span>
          <i className="ri-arrow-right-s-line text-xs text-gray-400"></i>
          <span className="text-gray-600">Pemeriksaan Lahan</span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#055127] text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm mt-0.5">
            <i className="ri-plant-line"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Pemeriksaan Lapangan
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola data pemeriksaan lapangan untuk memastikan kemurnian varietas dan mengidentifikasi tanaman off type.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Summary Stat Widgets */}
      <PemeriksaanStatsWidgets stats={stats} />

      {/* Filter Row & Quick Tabs */}
      <PemeriksaanFilterBar
        search={search}
        onSearchChange={setSearch}
        komoditas={filterKomoditas}
        onKomoditasChange={setFilterKomoditas}
        status={filterStatus}
        onStatusChange={setFilterStatus}
        periode={filterPeriode}
        onPeriodeChange={setFilterPeriode}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        stats={stats}
      />

      {/* Main Content Grid: Full Width by default, Split when Detail is opened */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        <div
          className={`transition-all duration-300 ${
            isDetailOpen && selectedItem
              ? 'col-span-12 xl:col-span-7 2xl:col-span-8'
              : 'col-span-12'
          }`}
        >
          <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
            {/* Table Header Card */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="ri-leaf-line text-[#055127] text-base"></i>
                <h3 className="font-bold text-gray-900 text-sm">
                  Daftar Pemeriksaan Lapangan
                </h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {totalRecords} Total Data
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={items.length > 0 && selectedIds.length === items.length}
                        onChange={handleToggleSelectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-2 w-8 text-center">No</th>
                    <th className="py-3 px-3 min-w-[100px]">Tanggal</th>
                    <th className="py-3 px-3 min-w-[110px]">No. Jadwal</th>
                    <th className="py-3 px-3 min-w-[140px]">Komoditas / Varietas</th>
                    <th className="py-3 px-3 min-w-[120px]">Petani</th>
                    <th className="py-3 px-3 min-w-[120px]">Lahan / Blok</th>
                    <th className="py-3 px-3 min-w-[90px]">Fase</th>
                    <th className="py-3 px-3 min-w-[120px]">Petugas QC</th>
                    <th className="py-3 px-3 min-w-[80px]">Kemurnian</th>
                    <th className="py-3 px-3 min-w-[110px] text-center">Status</th>
                    <th className="py-3 px-3 w-14 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <i className="ri-loader-4-line text-2xl animate-spin text-emerald-600"></i>
                          <span>Memuat data pemeriksaan...</span>
                        </div>
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <i className="ri-inbox-line text-3xl text-gray-300"></i>
                          <span>Tidak ada data pemeriksaan yang cocok.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => {
                      const rowNumber = (currentPage - 1) * pageSize + index + 1;
                      const { date, time } = formatTanggalRow(item.tanggalPemeriksaan);
                      const isSelected = selectedItem?.id === item.id;
                      const isChecked = selectedIds.includes(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors hover:bg-emerald-50/30 ${
                            isSelected
                              ? 'bg-emerald-50/50 border-l-4 border-l-emerald-600'
                              : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectOne(item.id)}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-2 text-center text-gray-500 font-medium">
                            {rowNumber}
                          </td>
                          <td className="py-3 px-3 text-gray-700">
                            <span className="font-medium text-gray-800 block">{date}</span>
                            <span className="text-[10px] text-gray-400 block">{time}</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-medium text-gray-700">
                            {item.kodeJadwalTanam}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-gray-900 block">
                              {item.komoditas}
                            </span>
                            <span className="text-gray-500 text-[11px] block">
                              {item.varietas}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-800">
                            {item.petani}
                          </td>
                          <td className="py-3 px-3 text-gray-700">
                            {item.lahan}
                          </td>
                          <td className="py-3 px-3 text-gray-700 font-medium">
                            {item.fase}
                          </td>
                          <td className="py-3 px-3 text-gray-700">
                            {item.petugasQc}
                          </td>
                          <td className="py-3 px-3 font-bold text-gray-900">
                            {String(item.persentaseKemurnian ?? 99).replace('.', ',')}%
                          </td>
                          <td className="py-3 px-3 text-center">
                            {renderStatusBadge(item.status)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(item)}
                              title="Lihat Detail Pemeriksaan"
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#055127] text-white shadow-xs'
                                  : 'text-gray-400 hover:text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              <i className="ri-eye-line text-base"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <div>
                Menampilkan{' '}
                <strong className="text-gray-800">
                  {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </strong>{' '}
                -{' '}
                <strong className="text-gray-800">
                  {Math.min(currentPage * pageSize, totalRecords)}
                </strong>{' '}
                dari <strong className="text-gray-800">{totalRecords}</strong> data
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded font-medium transition-colors ${
                        isActive
                          ? 'bg-[#055127] text-white'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Detail Panel Column (When row eye icon is clicked) */}
        {isDetailOpen && selectedItem && (
          <div className="col-span-12 xl:col-span-5 2xl:col-span-4 sticky top-4">
            <PemeriksaanDetailPanel
              item={selectedItem}
              onClose={handleCloseDetail}
            />
          </div>
        )}
      </div>

      {/* Modal Tambah Pemeriksaan (5-Step Wizard) */}
      <ModalTambahPemeriksaan
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        eligibleJadwals={eligibleJadwals}
        loadingEligible={loadingEligible}
        onSuccess={refreshData}
      />
      </div>
    </Fragment>
  );
}
