"use client";

import React, { Fragment, useState, useRef, useEffect } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePeran } from '@/app/hooks/usePeran';
import { Peran } from '@/app/types/peran';

// Pop-up Modals
import ModalTambahEditPeran from './component/ModalTambahEditPeran';
import ModalDetailPeran from './component/ModalDetailPeran';
import ModalHapusPeran from './component/ModalHapusPeran';

export default function MasterPeranPage() {
  const {
    peranList,
    loading,
    isTableLoading,
    isSubmitLoading,
    stats,
    // Filters
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
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
  } = usePeran();

  // Active Dropdown Action Row ID
  const [activeActionDropdownId, setActiveActionDropdownId] = useState<string | null>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(e.target as Node)
      ) {
        setActiveActionDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCsv = () => {
    const headers = ['Kode Peran', 'Nama Peran', 'Kategori', 'Deskripsi', 'Jumlah Personel', 'Status'];
    const rows = peranList.map((p) => [
      `"${p.kodePeran}"`,
      `"${p.namaPeran}"`,
      `"${p.kategori}"`,
      `"${(p.deskripsi || '-').replace(/"/g, '""')}"`,
      p._count?.penanggungJawabs || 0,
      `"${p.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Peran_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case 'Manajerial':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Quality Control':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Logistik':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Operasional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <Fragment>
      <Seo title="Master Peran - PT. Indoseed Agri Makmur" />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 sm:p-6 space-y-6">
        {/* Breadcrumb & Header Title */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Master Data</span>
            <i className="ri-arrow-right-s-line text-xs"></i>
            <span className="font-semibold text-emerald-800">Master Peran</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Peran &amp; Tanggung Jawab
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Kelola data peran jabatan, hak wewenang, dan penugasan personel operasional
          </p>
        </div>

        {/* 4 Summary / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Peran */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Total Peran</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPeran}</h3>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Semua peran terdaftar</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-700 border border-gray-100 flex items-center justify-center text-xl">
              <i className="ri-id-card-line"></i>
            </div>
          </div>

          {/* Peran Aktif */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Peran Aktif</p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1">{stats.aktif}</h3>
              <span className="text-[11px] text-emerald-600 mt-0.5 block">Siap ditugaskan</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl">
              <i className="ri-checkbox-circle-line"></i>
            </div>
          </div>

          {/* Peran Nonaktif */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Peran Nonaktif</p>
              <h3 className="text-2xl font-bold text-gray-600 mt-1">{stats.nonaktif}</h3>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Arsip / Ditangguhkan</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-500 border border-gray-200 flex items-center justify-center text-xl">
              <i className="ri-pause-circle-line"></i>
            </div>
          </div>

          {/* Personel Terhubung */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs hover:shadow-sm transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500">Personel Terhubung</p>
              <h3 className="text-2xl font-bold text-indigo-700 mt-1">{stats.totalPersonelAssigned}</h3>
              <span className="text-[11px] text-indigo-600 mt-0.5 block">Personel aktif memiliki peran</span>
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
                  placeholder="Cari kode, nama peran, deskripsi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Filter Kategori */}
              <div className="min-w-[150px]">
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Manajerial">Manajerial</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Logistik">Logistik</option>
                  <option value="Administrasi">Administrasi</option>
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
                Tambah Peran
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
                    <th className="py-3 px-4">KODE PERAN</th>
                    <th className="py-3 px-4">NAMA PERAN</th>
                    <th className="py-3 px-4">KATEGORI / DIVISI</th>
                    <th className="py-3 px-4">DESKRIPSI TANGGUNG JAWAB</th>
                    <th className="py-3 px-4 text-center">PERSONEL TERKAIT</th>
                    <th className="py-3 px-4 text-center">STATUS</th>
                    <th className="py-3 px-4 text-center w-24">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isTableLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        <i className="ri-loader-4-line animate-spin text-2xl mb-2 block"></i>
                        Memuat data peran...
                      </td>
                    </tr>
                  ) : peranList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        <i className="ri-inbox-line text-3xl mb-1 block"></i>
                        Tidak ada data peran ditemukan
                      </td>
                    </tr>
                  ) : (
                    peranList.map((row, idx) => {
                      const rowNo = (currentPage - 1) * pageSize + idx + 1;
                      const countPersonel = row._count?.penanggungJawabs || row.penanggungJawabs?.length || 0;

                      return (
                        <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 text-center text-gray-400 font-medium">{rowNo}</td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                            {row.kodePeran}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            {row.namaPeran}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getKategoriBadge(row.kategori)}`}>
                              {row.kategori}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={row.deskripsi || ''}>
                            {row.deskripsi || '-'}
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
                                title="Edit Peran"
                                className="w-7 h-7 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition-colors"
                              >
                                <i className="ri-edit-line text-sm"></i>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(row)}
                                title="Hapus Peran"
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
                  {peranList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span>{' '}
                dari <span className="font-semibold text-gray-700">{totalRecords}</span> peran
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
        <ModalTambahEditPeran
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

        <ModalDetailPeran
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          item={detailItem}
          onEdit={handleOpenEditModal}
        />

        <ModalHapusPeran
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
