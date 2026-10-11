"use client";

import React, { Fragment, useState, useRef, useEffect } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { usePenanggungJawab } from '@/app/hooks/usePenanggungJawab';
import { PenanggungJawab } from '@/app/types/penanggungJawab';

// Pop-up Modals
import ModalTambahEditPersonel from './component/ModalTambahEditPersonel';
import ModalInformasiPeran from './component/ModalInformasiPeran';
import ModalDetailPersonel from './component/ModalDetailPersonel';
import ModalHapusPersonel from './component/ModalHapusPersonel';

export default function MasterPenanggungJawabPage() {
  const {
    penanggungJawabList,
    loading,
    isTableLoading,
    isSubmitLoading,
    stats,
    // Filters
    search,
    setSearch,
    filterPeran,
    setFilterPeran,
    filterAreaModul,
    setFilterAreaModul,
    filterLokasi,
    setFilterLokasi,
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
    isInfoModalOpen,
    setIsInfoModalOpen,
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
  } = usePenanggungJawab();

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

  // Icon mapping for Area / Modul
  const getAreaModulBadge = (area?: string | null) => {
    const val = area || 'Produksi';
    if (val === 'Produksi') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
          <i className="ri-plant-line text-emerald-600 text-sm"></i>
          <span>Produksi</span>
        </span>
      );
    }
    if (val === 'QC & Laboratorium') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
          <i className="ri-flask-line text-cyan-600 text-sm"></i>
          <span>QC & Laboratorium</span>
        </span>
      );
    }
    if (val === 'Gudang') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
          <i className="ri-store-2-line text-amber-600 text-sm"></i>
          <span>Gudang</span>
        </span>
      );
    }
    if (val === 'Pengeringan') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
          <i className="ri-sun-line text-orange-600 text-sm"></i>
          <span>Pengeringan</span>
        </span>
      );
    }
    if (val === 'Inventory') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
          <i className="ri-box-3-line text-purple-600 text-sm"></i>
          <span>Inventory</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
        <i className="ri-apps-line text-gray-500 text-sm"></i>
        <span>{val}</span>
      </span>
    );
  };

  // Icon mapping for Lokasi
  const getLokasiBadge = (lokasi?: string | null) => {
    const val = lokasi || 'Semua Lokasi';
    if (val === 'Semua Lokasi') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
          <i className="ri-global-line text-blue-500 text-sm"></i>
          <span>Semua Lokasi</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-800 font-medium">
        <i className="ri-map-pin-line text-rose-500 text-sm"></i>
        <span>{val}</span>
      </span>
    );
  };

  return (
    <Fragment>
      <Seo title="Personel & Tanggung Jawab" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="space-y-5 pb-8 animate-in fade-in duration-300">
        {/* Breadcrumb & Header Section */}
        <div className="pt-2">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="hover:text-gray-700 cursor-pointer">Master Data</span>
            <i className="ri-arrow-right-s-line text-gray-400"></i>
            <span className="font-semibold text-emerald-800">Personel & Tanggung Jawab</span>
          </div>

          {/* Title & Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl font-bold shadow-2xs">
                <i className="ri-team-line"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Personel & Tanggung Jawab
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kelola data personel dan atur tanggung jawabnya pada setiap area / modul dan lokasi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Button Pop-up Informasi Peran & Area */}
              <button
                type="button"
                onClick={() => setIsInfoModalOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-gray-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs"
                title="Buka panduan informasi peran & area modul"
              >
                <i className="ri-information-line text-sm text-emerald-600 font-bold"></i>
                <span>Informasi Peran & Area</span>
              </button>

              {/* Button Pop-up Tambah Personel */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-[#055127] hover:bg-[#043e1e] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                <i className="ri-add-line text-base font-bold"></i>
                <span>Tambah Personel & Tanggung Jawab</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Personel */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <i className="ri-user-line"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-400 block">Total Personel</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">
                {stats.totalPersonel}
              </span>
            </div>
          </div>

          {/* Card 2: Kepala Produksi */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl shrink-0">
              <i className="ri-vip-crown-line"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-400 block">Kepala Produksi</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">
                {stats.kepalaProduksi}
              </span>
            </div>
          </div>

          {/* Card 3: Penanggung Jawab */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
              <i className="ri-team-line"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-400 block">Penanggung Jawab</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">
                {stats.penanggungJawab}
              </span>
            </div>
          </div>

          {/* Card 4: Aktif */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <i className="ri-checkbox-circle-line"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-400 block">Aktif</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">
                {stats.aktif}
              </span>
            </div>
          </div>

          {/* Card 5: Nonaktif */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center text-xl shrink-0">
              <i className="ri-close-circle-line"></i>
            </div>
            <div>
              <span className="text-[11px] font-medium text-gray-400 block">Nonaktif</span>
              <span className="text-xl font-bold text-gray-900 leading-tight">
                {stats.nonaktif}
              </span>
            </div>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama, kode personel, peran, atau lokasi..."
                className="w-full pl-9 pr-3.5 py-2 bg-gray-50/70 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Peran Dropdown */}
            <div className="lg:col-span-2 relative">
              <label className="text-[10px] text-gray-400 uppercase font-semibold absolute left-3 top-1 pointer-events-none">
                Peran
              </label>
              <select
                value={filterPeran}
                onChange={(e) => {
                  setFilterPeran(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pt-4 pb-1 px-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Semua">Semua</option>
                <option value="Kepala Produksi">Kepala Produksi</option>
                <option value="Penanggung Jawab">Penanggung Jawab</option>
                <option value="Koordinator Lapangan">Koordinator Lapangan</option>
                <option value="Staff QC">Staff QC</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Area / Modul Dropdown */}
            <div className="lg:col-span-2 relative">
              <label className="text-[10px] text-gray-400 uppercase font-semibold absolute left-3 top-1 pointer-events-none">
                Area / Modul
              </label>
              <select
                value={filterAreaModul}
                onChange={(e) => {
                  setFilterAreaModul(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pt-4 pb-1 px-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Semua">Semua</option>
                <option value="Produksi">Produksi</option>
                <option value="QC & Laboratorium">QC & Laboratorium</option>
                <option value="Gudang">Gudang</option>
                <option value="Pengeringan">Pengeringan</option>
                <option value="Inventory">Inventory</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Lokasi Dropdown */}
            <div className="lg:col-span-2 relative">
              <label className="text-[10px] text-gray-400 uppercase font-semibold absolute left-3 top-1 pointer-events-none">
                Lokasi
              </label>
              <select
                value={filterLokasi}
                onChange={(e) => {
                  setFilterLokasi(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pt-4 pb-1 px-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Semua">Semua</option>
                <option value="Semua Lokasi">Semua Lokasi</option>
                <option value="Ngantang">Ngantang</option>
                <option value="Wajak">Wajak</option>
                <option value="Lahan Terbuka Subang">Lahan Terbuka</option>
                <option value="Greenhouse Lamongan">Greenhouse</option>
                <option value="Gudang Utama Kediri">Gudang Utama</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Status Dropdown */}
            <div className="lg:col-span-1 relative">
              <label className="text-[10px] text-gray-400 uppercase font-semibold absolute left-3 top-1 pointer-events-none">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pt-4 pb-1 px-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="Semua">Semua</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>

            {/* Reset Button */}
            <div className="lg:col-span-1">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                title="Reset semua filter"
              >
                <i className="ri-refresh-line text-sm"></i>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-600 font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3.5">Kode Personel</th>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-3.5">Peran</th>
                  <th className="py-3 px-3.5">Area / Modul</th>
                  <th className="py-3 px-3.5">Lokasi Tanggung Jawab</th>
                  <th className="py-3 px-3.5">No. HP</th>
                  <th className="py-3 px-3.5">Email</th>
                  <th className="py-3 px-3 w-24">Status</th>
                  <th className="py-3 px-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {isTableLoading || loading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin text-2xl text-emerald-600"></i>
                        <span className="text-xs">Memuat data personel...</span>
                      </div>
                    </td>
                  </tr>
                ) : penanggungJawabList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <i className="ri-inbox-line text-3xl text-gray-300"></i>
                        <span className="text-xs font-semibold text-gray-600">
                          Tidak ada data personel ditemukan
                        </span>
                        <p className="text-[11px] text-gray-400 max-w-sm">
                          Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  penanggungJawabList.map((item, idx) => {
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                    const isDropdownOpen = activeActionDropdownId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/60 transition-colors group"
                      >
                        {/* No */}
                        <td className="py-3.5 px-3 text-center text-gray-400 font-medium">
                          {rowNumber}
                        </td>

                        {/* Kode Personel */}
                        <td className="py-3.5 px-3.5 font-mono font-semibold text-gray-800 text-xs">
                          {item.kodePersonel || `PJ-${String(rowNumber).padStart(3, '0')}`}
                        </td>

                        {/* Nama */}
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                              {item.nama ? item.nama.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <span>{item.nama}</span>
                          </div>
                        </td>

                        {/* Peran */}
                        <td className="py-3.5 px-3.5">
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${
                              item.peran === 'Kepala Produksi'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}
                          >
                            {item.peran || 'Penanggung Jawab'}
                          </span>
                        </td>

                        {/* Area / Modul */}
                        <td className="py-3.5 px-3.5">
                          {getAreaModulBadge(item.areaModul)}
                        </td>

                        {/* Lokasi Tanggung Jawab */}
                        <td className="py-3.5 px-3.5">
                          {getLokasiBadge(item.lokasi)}
                        </td>

                        {/* No. HP */}
                        <td className="py-3.5 px-3.5 text-gray-700 text-xs">
                          {item.noHp || '-'}
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-3.5 text-gray-600 text-xs truncate max-w-[180px]">
                          {item.email || '-'}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              item.status === 'Aktif'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            ></span>
                            {item.status}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1 relative">
                            {/* View Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDetailModal(item)}
                              className="w-7 h-7 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 flex items-center justify-center transition-colors"
                              title="Lihat Detail Personel"
                            >
                              <i className="ri-eye-line text-sm"></i>
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="w-7 h-7 rounded-lg text-gray-500 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition-colors"
                              title="Edit Data Personel"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </button>

                            {/* More Options Dropdown Toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                setActiveActionDropdownId(
                                  isDropdownOpen ? null : item.id
                                )
                              }
                              className="w-7 h-7 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center transition-colors"
                              title="Menu Lainnya"
                            >
                              <i className="ri-more-2-fill text-sm"></i>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                              <div
                                ref={actionDropdownRef}
                                className="absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 text-xs text-left animate-in fade-in zoom-in-95 duration-150"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionDropdownId(null);
                                    handleOpenDetailModal(item);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <i className="ri-eye-line text-gray-400"></i>
                                  <span>Lihat Detail</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionDropdownId(null);
                                    handleOpenEditModal(item);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <i className="ri-edit-line text-gray-400"></i>
                                  <span>Edit Data</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionDropdownId(null);
                                    handleToggleStatus(item);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <i className="ri-toggle-line text-gray-400"></i>
                                  <span>
                                    Ubah Status ke{' '}
                                    {item.status === 'Aktif' ? 'Nonaktif' : 'Aktif'}
                                  </span>
                                </button>
                                <div className="my-1 border-t border-gray-100"></div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveActionDropdownId(null);
                                    handleOpenDeleteModal(item);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                  <span>Hapus Personel</span>
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

          {/* Table Footer: Count & Pagination */}
          <div className="px-5 py-3.5 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div>
              Menampilkan{' '}
              <strong className="text-gray-800">
                {penanggungJawabList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </strong>{' '}
              -{' '}
              <strong className="text-gray-800">
                {Math.min(currentPage * pageSize, totalRecords)}
              </strong>{' '}
              dari <strong className="text-gray-800">{totalRecords}</strong> data
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                title="Halaman Sebelumnya"
              >
                <i className="ri-arrow-left-s-line text-base"></i>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    pageNum === currentPage
                      ? 'bg-[#055127] text-white shadow-2xs'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                title="Halaman Selanjutnya"
              >
                <i className="ri-arrow-right-s-line text-base"></i>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================
            POPUPS / MODALS
            ================================================================ */}
        {/* Modal 1: Tambah / Edit Personel & Tanggung Jawab */}
        <ModalTambahEditPersonel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modalMode={modalMode}
          formValues={formValues}
          setFormValues={setFormValues}
          formErrors={formErrors}
          isSubmitting={isSubmitLoading}
          onSubmit={handleSaveModal}
          onRefreshKode={handleFetchNextKode}
        />

        {/* Modal 2: Informasi Peran & Area / Modul */}
        <ModalInformasiPeran
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
        />

        {/* Modal 3: Detail Personel */}
        <ModalDetailPersonel
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          item={detailItem}
          onEdit={(item) => handleOpenEditModal(item)}
        />

        {/* Modal 4: Konfirmasi Hapus Personel */}
        <ModalHapusPersonel
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          item={itemToDelete}
          isLoading={isDeleteLoading}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </Fragment>
  );
}
