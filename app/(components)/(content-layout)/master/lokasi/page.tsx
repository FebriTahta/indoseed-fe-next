"use client";

import React, { Fragment, useState, useRef, useEffect } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useLokasi } from '@/app/hooks/useLokasi';
import { Lokasi } from '@/app/types/lokasi';

// Pop-up Modals
import ModalTambahEditLokasi from './component/ModalTambahEditLokasi';
import ModalDetailLokasi from './component/ModalDetailLokasi';
import ModalHapusLokasi from './component/ModalHapusLokasi';

export default function MasterLokasiPage() {
  const {
    lokasiList,
    loading,
    isTableLoading,
    isSubmitLoading,
    stats,
    // Filters
    search,
    setSearch,
    filterTipeLokasi,
    setFilterTipeLokasi,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formValues,
    setFormValues,
    formErrors,
    handleFetchNextKode,
    isDetailModalOpen,
    setIsDetailModalOpen,
    detailItem,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    isDeleteLoading,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleOpenDeleteModal,
    handleResetFilters,
    handleSaveModal,
    handleConfirmDelete,
    handleToggleStatus,
  } = useLokasi();

  const handleExportCsv = () => {
    const headers = [
      'Kode Lokasi',
      'Nama Lokasi',
      'Tipe Lokasi',
      'Kota',
      'Provinsi',
      'Luas Area (Ha)',
      'PIC Utama',
      'Jumlah Personel',
      'Status',
    ];

    const rows = lokasiList.map((l) => [
      `"${l.kodeLokasi}"`,
      `"${l.namaLokasi}"`,
      `"${l.tipeLokasi}"`,
      `"${l.kota || '-'}"`,
      `"${l.provinsi || '-'}"`,
      l.luasArea || 0,
      `"${l.penanggungJawabUtama || '-'}"`,
      l._count?.penanggungJawabs || 0,
      `"${l.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Lokasi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTipeBadge = (tipe: string) => {
    switch (tipe) {
      case 'Greenhouse':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Kebun / Lahan':
        return 'bg-lime-50 text-lime-700 border-lime-200';
      case 'Gudang & Fasilitas':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Laboratorium / QC':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Kantor & Operasional':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Fragment>
      <Seo title="Master Lokasi - PT. Indoseed Agri Makmur" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Breadcrumb & Header Title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Master Data</span>
            <i className="ri-arrow-right-s-line text-xs"></i>
            <span className="font-semibold text-emerald-800">Master Lokasi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Lokasi &amp; Fasilitas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Kelola data unit lokasi kebun, lahan kemitraan, greenhouse, gudang, dan kantor operasional
          </p>
        </div>

        {/* 4 Summary / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Lokasi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Lokasi</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalLokasi}</h3>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Semua fasilitas terdaftar</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 flex items-center justify-center text-xl">
              <i className="ri-map-pin-2-line"></i>
            </div>
          </div>

          {/* Lokasi Aktif */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Lokasi Aktif</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{stats.aktif}</h3>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">Beroperasi aktif</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl">
              <i className="ri-checkbox-circle-line"></i>
            </div>
          </div>

          {/* Lokasi Nonaktif */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Lokasi Nonaktif</p>
              <h3 className="text-2xl font-bold text-gray-600 mt-1">{stats.nonaktif}</h3>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Sementara non-aktif</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center text-xl">
              <i className="ri-pause-circle-line"></i>
            </div>
          </div>

          {/* Personel Terhubung */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Personel Bertugas</p>
              <h3 className="text-2xl font-bold text-indigo-700 mt-1">{stats.totalPersonelAssigned}</h3>
              <span className="text-[11px] text-indigo-600 mt-0.5 block">Personel terhubung ke lokasi</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-xl">
              <i className="ri-team-line"></i>
            </div>
          </div>
        </div>

        {/* Action Header & Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search Input */}
              <div className="relative min-w-[240px] max-w-sm flex-1">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Cari kode, nama lokasi, kota, alamat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Filter Tipe Lokasi */}
              <div className="min-w-[160px]">
                <select
                  value={filterTipeLokasi}
                  onChange={(e) => setFilterTipeLokasi(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Semua">Semua Tipe Lokasi</option>
                  <option value="Kebun / Lahan">Kebun / Lahan</option>
                  <option value="Greenhouse">Greenhouse</option>
                  <option value="Gudang & Fasilitas">Gudang &amp; Fasilitas</option>
                  <option value="Laboratorium / QC">Laboratorium / QC</option>
                  <option value="Kantor & Operasional">Kantor &amp; Operasional</option>
                </select>
              </div>

              {/* Filter Status */}
              <div className="min-w-[130px]">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* Reset Filter Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
              >
                Reset Filter
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <i className="ri-download-2-line text-sm"></i>
                Export Data
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <i className="ri-add-line text-sm font-bold"></i>
                Tambah Lokasi
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-100">
                    <th className="py-3 px-4 w-12 text-center">NO</th>
                    <th className="py-3 px-4">KODE LOKASI</th>
                    <th className="py-3 px-4">NAMA LOKASI</th>
                    <th className="py-3 px-4">TIPE LOKASI</th>
                    <th className="py-3 px-4">WILAYAH / KOTA</th>
                    <th className="py-3 px-4">LUAS AREA</th>
                    <th className="py-3 px-4 text-center">PERSONEL BERTUGAS</th>
                    <th className="py-3 px-4 text-center">STATUS</th>
                    <th className="py-3 px-4 text-center w-24">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isTableLoading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <i className="ri-loader-4-line animate-spin text-2xl mb-2 block"></i>
                        Memuat data lokasi...
                      </td>
                    </tr>
                  ) : lokasiList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <i className="ri-inbox-line text-3xl mb-1 block"></i>
                        Tidak ada data lokasi ditemukan
                      </td>
                    </tr>
                  ) : (
                    lokasiList.map((row, idx) => {
                      const rowNo = (currentPage - 1) * pageSize + idx + 1;
                      const countPersonel =
                        row._count?.penanggungJawabs || row.penanggungJawabs?.length || 0;

                      return (
                        <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 text-center text-gray-400 font-medium">
                            {rowNo}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                            {row.kodeLokasi}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            {row.namaLokasi}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getTipeBadge(
                                row.tipeLokasi
                              )}`}
                            >
                              {row.tipeLokasi}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-700">
                            {row.kota ? `${row.kota}, ${row.provinsi || ''}` : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 font-medium">
                            {row.luasArea ? `${row.luasArea} Ha` : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md text-[11px]">
                              <i className="ri-user-line text-xs"></i>
                              {countPersonel} Orang
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(row)}
                              title="Klik untuk ubah status"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all ${row.status === 'Aktif'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                                }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${row.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'
                                  }`}
                              ></span>
                              {row.status}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenDetailModal(row)}
                                title="Lihat Detail"
                                className="w-7 h-7 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                              >
                                <i className="ri-eye-line text-sm"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(row)}
                                title="Edit Lokasi"
                                className="w-7 h-7 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition-colors"
                              >
                                <i className="ri-edit-line text-sm"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(row)}
                                title="Hapus Lokasi"
                                className="w-7 h-7 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                              >
                                <i className="ri-delete-bin-line text-sm"></i>
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

            {/* Table Footer & Pagination */}
            <div className="px-5 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <div>
                Menampilkan{' '}
                <span className="font-semibold text-gray-700">
                  {lokasiList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span>{' '}
                dari <span className="font-semibold text-gray-700">{totalRecords}</span> lokasi
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
                        ? 'bg-emerald-700 text-white shadow-2xs'
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
        </div>

        {/* Modals */}
        <ModalTambahEditLokasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modalMode={modalMode}
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          isSubmitLoading={isSubmitLoading}
          onSave={handleSaveModal}
          onFetchNextKode={handleFetchNextKode}
        />

        <ModalDetailLokasi
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          item={detailItem}
          onEdit={handleOpenEditModal}
        />

        <ModalHapusLokasi
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          item={itemToDelete}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleteLoading}
        />
      </div>
    </Fragment>
  );
}
