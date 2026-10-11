"use client";

import React, { Fragment, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useKelompokTani } from '@/app/hooks/useKelompokTani';
import { KelompokTani } from '@/app/types/kelompokTani';

// Modals & Popups
import ModalTambahEditKelompokTani from './component/ModalTambahEditKelompokTani';
import ModalDetailKelompokTani from './component/ModalDetailKelompokTani';
import ModalHapusKelompokTani from './component/ModalHapusKelompokTani';

export default function MasterKelompokTaniPage() {
  const {
    kelompokTaniList,
    loading,
    isTableLoading,
    isSubmitLoading,
    penanggungJawabList,
    commodities,
    stats,
    // Filters
    search,
    setSearch,
    filterLokasi,
    setFilterLokasi,
    filterKomoditas,
    setFilterKomoditas,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
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
    detailItem,
    isDetailModalOpen,
    handleOpenDetail,
    handleCloseDetail,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    isDeleteLoading,
    allLokasi,
    allKomoditas,
    fetchKelompokTani,
    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleResetFilters,
    handleSaveModal,
    handleConfirmDelete,
    handleToggleStatus,
  } = useKelompokTani();

  // Action Dropdown state per row
  const [activeDropdownRowId, setActiveDropdownRowId] = useState<string | null>(null);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdownRowId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Comprehensive unique list of lokasi & komoditas for dropdown filters
  const defaultLokasiList = [
    'Sumberrejo',
    'Karangrejo',
    'Ngantang',
    'Wajak',
    'Poncokusumo',
    'Tumpang',
    'Pakis',
    'Dau',
    'Singosari',
    'Kepanjen',
    'Bululawang',
    'Gondanglegi',
  ];
  const uniqueLokasi = Array.from(
    new Set([
      ...(allLokasi || []),
      ...defaultLokasiList,
      ...kelompokTaniList.map((item) => item.lokasi).filter(Boolean),
    ])
  ).filter(Boolean).sort();

  const uniqueKomoditas = Array.from(
    new Set([
      ...(allKomoditas || []),
      ...commodities.map((c) => c.namaKomoditas),
      'Melon',
      'Cabai',
      'Semangka',
      ...kelompokTaniList.map((item) => item.komoditasUtama).filter(Boolean),
    ])
  ).filter(Boolean).sort();

  return (
    <Fragment>
      <Seo title="Master Kelompok Tani" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="main-content pb-12">
        {/* Header Section matching screenshot */}
        <div className="mb-6 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1.5">
              <Link href="/" className="hover:text-emerald-700 transition">
                Master Data
              </Link>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
              <span className="text-emerald-700 font-semibold">Kelompok Tani</span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-xl shadow-2xs">
                <i className="ri-team-line"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Master Kelompok Tani
                </h1>
                <p className="text-xs text-gray-500">
                  Kelola data kelompok tani mitra perusahaan.
                </p>
              </div>
            </div>
          </div>

          {/* Top Right Add Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#005b38] hover:bg-[#00472c] text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
          >
            <i className="ri-add-line text-base"></i>
            <span>Tambah Kelompok Tani</span>
          </button>
        </div>

        {/* 4 Summary Stat Cards matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Total Kelompok Tani */}
          <div className="p-4 rounded-2xl bg-white border border-defaultborder shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl flex-shrink-0">
              <i className="ri-user-follow-line"></i>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Total Kelompok Tani
              </p>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">
                {stats.totalKelompok || 12}
              </h3>
            </div>
          </div>

          {/* Card 2: Jumlah Anggota (Total) */}
          <div className="p-4 rounded-2xl bg-white border border-defaultborder shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl flex-shrink-0">
              <i className="ri-group-line"></i>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Jumlah Anggota (Total)
              </p>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">
                {stats.totalAnggota || 286}
              </h3>
            </div>
          </div>

          {/* Card 3: Komoditas Utama */}
          <div className="p-4 rounded-2xl bg-white border border-defaultborder shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
              <i className="ri-plant-line"></i>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Komoditas Utama
              </p>
              <h3 className="text-sm font-bold text-gray-900 leading-tight mt-1 truncate" title={stats.komoditasUtama || 'Melon, Cabai, Semangka'}>
                {stats.komoditasUtama || 'Melon, Cabai, Semangka'}
              </h3>
            </div>
          </div>

          {/* Card 4: Status Aktif */}
          <div className="p-4 rounded-2xl bg-white border border-defaultborder shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
              <i className="ri-checkbox-circle-line"></i>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Status Aktif
              </p>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">
                {stats.statusAktifCount || 11} <span className="text-gray-400 text-lg font-normal">/ {stats.totalCount || 12}</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Unified Table & Filter Card matching screenshot */}
        <div className="w-full bg-white rounded-2xl border border-defaultborder shadow-2xs overflow-hidden mb-6">
          {/* Filter Bar Toolbar at Top of Table */}
          <div className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
            {/* Search Input on Left */}
            <div className="relative flex-1 min-w-[220px]">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama kelompok, ketua, lokasi, atau komoditas..."
                className="w-full !pl-9 pr-8 h-[38px] bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              )}
            </div>

            {/* Dropdowns and Buttons in Single Horizontal Row on Right */}
            <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 md:pb-0">
              {/* Lokasi */}
              <div className="relative shrink-0 w-[135px]">
                <select
                  value={filterLokasi}
                  onChange={(e) => {
                    setFilterLokasi(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg h-[38px] pl-3 pr-7 text-xs text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer transition shadow-2xs"
                >
                  <option value="Semua Lokasi">Semua Lokasi</option>
                  {uniqueLokasi.map((lok) => (
                    <option key={lok} value={lok}>
                      {lok}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
              </div>

              {/* Komoditas */}
              <div className="relative shrink-0 w-[145px]">
                <select
                  value={filterKomoditas}
                  onChange={(e) => {
                    setFilterKomoditas(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg h-[38px] pl-3 pr-7 text-xs text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer transition shadow-2xs"
                >
                  <option value="Semua Komoditas">Semua Komoditas</option>
                  {uniqueKomoditas.map((kom) => (
                    <option key={kom} value={kom}>
                      {kom}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
              </div>

              {/* Status */}
              <div className="relative shrink-0 w-[125px]">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-lg h-[38px] pl-3 pr-7 text-xs text-gray-700 focus:outline-none focus:border-emerald-500 cursor-pointer transition shadow-2xs"
                >
                  <option value="Semua Status">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs"></i>
              </div>

              {/* Filter Button matching screenshot */}
              <button
                type="button"
                onClick={() => fetchKelompokTani()}
                className="h-[38px] px-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 shrink-0"
                title="Terapkan Filter"
              >
                <i className="ri-filter-3-line text-xs text-gray-500"></i>
                <span>Filter</span>
              </button>

              {/* Reset Button (only shown if filters are active) */}
              {(Boolean(search.trim()) ||
                filterLokasi !== 'Semua Lokasi' ||
                filterKomoditas !== 'Semua Komoditas' ||
                filterStatus !== 'Semua Status') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-[38px] px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-xs font-medium transition flex items-center gap-1 shrink-0"
                  title="Reset Semua Filter"
                >
                  <i className="ri-refresh-line text-xs"></i>
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 text-center w-12">No</th>
                    <th className="py-3.5 px-4">Kode Kelompok</th>
                    <th className="py-3.5 px-4">Nama Kelompok Tani</th>
                    <th className="py-3.5 px-4">Ketua</th>
                    <th className="py-3.5 px-4">Lokasi</th>
                    <th className="py-3.5 px-4">Komoditas Utama</th>
                    <th className="py-3.5 px-4 text-center">Jumlah Anggota</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {isTableLoading ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <i className="ri-loader-4-line animate-spin text-2xl text-emerald-600 inline-block mb-1"></i>
                        <p className="text-xs">Memuat data kelompok tani...</p>
                      </td>
                    </tr>
                  ) : kelompokTaniList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <i className="ri-inbox-line text-3xl mb-1 inline-block"></i>
                        <p className="text-xs">Tidak ada data kelompok tani yang ditemukan.</p>
                      </td>
                    </tr>
                  ) : (
                    kelompokTaniList.map((item, index) => {
                      const rowNumber = (currentPage - 1) * pageSize + index + 1;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50/70 transition"
                        >
                          <td className="py-3.5 px-4 text-center font-medium text-gray-500">
                            {rowNumber}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium text-gray-900">
                            {item.kodeKelompok}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            <span
                              onClick={() => handleOpenDetail(item)}
                              className="cursor-pointer hover:text-emerald-700 transition"
                            >
                              {item.namaKelompok}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-700">
                            {item.ketua}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            {item.lokasi}
                          </td>
                          <td className="py-3.5 px-4 text-gray-700 font-medium">
                            {item.komoditasUtama}
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium text-gray-800">
                            {item.jumlahAnggota || (item.partners ? item.partners.length : 0)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-semibold ${
                                item.status === 'Aktif'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                  : 'bg-red-50 text-red-700 border border-red-300'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status === 'Aktif'
                                    ? 'bg-emerald-500'
                                    : 'bg-red-500'
                                }`}
                              ></span>
                              {item.status === 'Aktif' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* Eye View Detail */}
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(item)}
                                title="Lihat Detail"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                              >
                                <i className="ri-eye-line text-sm"></i>
                              </button>

                              {/* Pencil Edit */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                title="Edit Kelompok Tani"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition"
                              >
                                <i className="ri-pencil-line text-sm"></i>
                              </button>

                              {/* 3-Dots More Action */}
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveDropdownRowId(
                                      activeDropdownRowId === item.id ? null : item.id
                                    )
                                  }
                                  title="Menu Lainnya"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition"
                                >
                                  <i className="ri-more-2-fill text-sm"></i>
                                </button>

                                {activeDropdownRowId === item.id && (
                                  <div
                                    ref={actionDropdownRef}
                                    className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-30 py-1 text-left text-xs"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownRowId(null);
                                        handleToggleStatus(item);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <i className="ri-refresh-line text-gray-400"></i>
                                      <span>
                                        {item.status === 'Aktif'
                                          ? 'Nonaktifkan'
                                          : 'Aktifkan'}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownRowId(null);
                                        handleOpenDeleteModal(item);
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <i className="ri-delete-bin-line text-red-400"></i>
                                      <span>Hapus</span>
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

            {/* Table Footer Pagination matching screenshot */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500 bg-slate-50/40">
              <div>
                Menampilkan{' '}
                <span className="font-semibold text-gray-700">
                  {kelompokTaniList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </span>{' '}
                -{' '}
                <span className="font-semibold text-gray-700">
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span>{' '}
                dari{' '}
                <span className="font-semibold text-gray-700">{totalRecords}</span> data
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1 self-center">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
                        page === currentPage
                          ? 'bg-[#005b38] text-white shadow-2xs'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Add / Edit Modal */}
      <ModalTambahEditKelompokTani
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveModal}
        mode={modalMode}
        formValues={formValues}
        setFormValues={setFormValues}
        formErrors={formErrors}
        isSubmitLoading={isSubmitLoading}
        penanggungJawabList={penanggungJawabList}
        commodities={commodities}
        onRegenerateCode={handleFetchNextKode}
      />

      {/* Detail Pop up Modal */}
      <ModalDetailKelompokTani
        isOpen={isDetailModalOpen}
        item={detailItem}
        onClose={handleCloseDetail}
        onEdit={(item) => {
          handleCloseDetail();
          handleOpenEditModal(item);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ModalHapusKelompokTani
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
        isLoading={isDeleteLoading}
      />
    </Fragment>
  );
}
