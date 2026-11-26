"use client";
import React, { Fragment, useState } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Commodity } from '@/app/types/commodity';
import { useKomoditas } from '@/app/hooks/useKomoditas';
import ModalKomoditas from './component/ModalKomoditas';
import DetailKomoditasPanel from './component/DetailKomoditasPanel';

export default function KomoditasPage() {
  const {
    loading,
    error,
    commodities,
    isTableLoading,
    stats,
    kelompokTanamanOptions,
    satuanHasilOptions,
    statusOptions,
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedCommodity,
    setViewedCommodity,
    isDetailLoading,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    modalMode,
    formValues,
    setFormValues,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleRegenerateCode,
    handleSaveModal,
    handleDeleteCommodity,
    handleToggleStatus,
    handleToggleViewDetail,
  } = useKomoditas();

  // State for row action dropdown
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveDropdownId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500 font-semibold bg-rose-50 rounded-xl my-6">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <span className="text-xs font-semibold text-gray-500">Memuat data komoditas...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Komoditas - Master Data" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Breadcrumb & Page Header */}
      <div className="pt-2 pb-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-medium">
          <span className="hover:text-gray-700 cursor-pointer">Master Data</span>
          <i className="ri-arrow-right-s-line text-gray-400"></i>
          <span className="text-emerald-700 font-semibold">Komoditas</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
              <i className="ri-leaf-line"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                Komoditas
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Kelola data jenis tanaman yang digunakan dalam proses produksi benih.
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <i className="ri-add-line text-base font-bold"></i>
              <span>Tambah Komoditas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary / Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Komoditas */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 border border-emerald-100">
            <i className="ri-plant-line"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Komoditas</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.total}</h3>
            <span className="text-[11px] text-gray-400 font-medium">Komoditas</span>
          </div>
        </div>

        {/* Card 2: Aktif */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0 border border-emerald-100">
            <i className="ri-checkbox-circle-line"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Aktif</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.active}</h3>
            <span className="text-[11px] text-gray-400 font-medium">Komoditas</span>
          </div>
        </div>

        {/* Card 3: Nonaktif */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl flex-shrink-0 border border-rose-100">
            <i className="ri-close-circle-line"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Nonaktif</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.inactive}</h3>
            <span className="text-[11px] text-gray-400 font-medium">Komoditas</span>
          </div>
        </div>

        {/* Card 4: Total Varietas */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs hover:shadow-sm transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl flex-shrink-0 border border-blue-100">
            <i className="ri-seedling-line"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Varietas</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.totalVarieties}</h3>
            <span className="text-[11px] text-gray-400 font-medium">Varietas Terdaftar</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Filters & Table) + Right (Detail Toggle Panel with equal height) */}
      <div className="grid grid-cols-12 gap-5 items-stretch mb-8">
        {/* Left Column (Table List) */}
        <div
          className={`${
            viewedCommodity ? 'xl:col-span-8 lg:col-span-7 col-span-12' : 'col-span-12'
          } flex flex-col transition-all duration-300`}
        >
          {/* Filters Bar */}
          <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs mb-4">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
              {/* Search */}
              <div className="relative w-full sm:flex-1 min-w-[220px]">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama komoditas atau kode..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50/70 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  <i className="ri-search-line"></i>
                </div>
              </div>

              {/* Select 1: Kelompok Tanaman */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-44">
                  <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                    Kelompok Tanaman
                  </span>
                  <div className="relative">
                    <select
                      value={filterKategori?.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilterKategori(val ? { value: val, label: val } : null);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-2.5 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">Semua</option>
                      {kelompokTanamanOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Select 2: Status */}
                <div className="relative w-full sm:w-36">
                  <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                    Status
                  </span>
                  <div className="relative">
                    <select
                      value={filterStatus?.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFilterStatus(val ? { value: val, label: val } : null);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-2.5 pr-7 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="">Semua</option>
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </div>
                </div>

                {/* Reset button */}
                <div className="self-end pt-4">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-gray-200/80 border border-gray-200 rounded-lg transition-colors flex items-center gap-1.5 h-[32px]"
                    title="Reset Filter"
                  >
                    <i className="ri-refresh-line text-sm"></i>
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-3.5 w-12 text-center">No.</th>
                    <th className="py-3 px-3.5">Kode Komoditas</th>
                    <th className="py-3 px-3.5">Nama Komoditas</th>
                    <th className="py-3 px-3.5">Kelompok Tanaman</th>
                    <th className="py-3 px-3.5">Satuan Hasil</th>
                    <th className="py-3 px-3.5 text-center">Jumlah Varietas</th>
                    <th className="py-3 px-3.5 text-center">Status</th>
                    <th className="py-3 px-3.5 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isTableLoading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs text-gray-500 font-medium">Memuat data tabel...</span>
                        </div>
                      </td>
                    </tr>
                  ) : commodities.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-500">
                        <i className="ri-inbox-line text-3xl text-gray-300 mb-2 block"></i>
                        Tidak ada data komoditas yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    commodities.map((item, index) => {
                      const rowNumber = (currentPage - 1) * pageSize + index + 1;
                      const isSelected = viewedCommodity && viewedCommodity.id === item.id;
                      const isAktif = item.status === 'Aktif';
                      const countVarieties = item._count?.varieties ?? item.varieties?.length ?? 0;

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50/60 transition-colors ${
                            isSelected ? 'bg-emerald-50/50 border-l-4 border-l-emerald-600 font-medium' : ''
                          }`}
                        >
                          <td className="py-3.5 px-3.5 text-center text-gray-500">{rowNumber}</td>
                          <td className="py-3.5 px-3.5">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                              <i className="ri-price-tag-3-line text-[11px] text-emerald-600"></i>
                              {item.kodeKomoditas}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5">
                            {/* HILANGKAN GAMBAR - Sesuai instruksi: nama komoditas rapi tanpa thumbnail */}
                            <span className="font-semibold text-gray-900">{item.namaKomoditas}</span>
                          </td>
                          <td className="py-3.5 px-3.5 text-gray-700">
                            {item.kategori || '-'}
                          </td>
                          <td className="py-3.5 px-3.5 text-gray-700">
                            {item.satuanHasil || 'Kg'}
                          </td>
                          <td className="py-3.5 px-3.5 text-center font-medium text-gray-800">
                            {countVarieties}
                          </td>
                          <td className="py-3.5 px-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                isAktif
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isAktif ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}
                              ></span>
                              {isAktif ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              {/* View / Toggle Detail Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleViewDetail(item)}
                                title={isSelected ? 'Tutup Detail' : 'Lihat Detail'}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70'
                                }`}
                              >
                                <i className="ri-eye-line text-sm"></i>
                              </button>

                              {/* More Dropdown Menu */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdownId(activeDropdownId === item.id ? null : item.id);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center transition-colors"
                                  title="Opsi lainnya"
                                >
                                  <i className="ri-more-2-line text-sm"></i>
                                </button>

                                {activeDropdownId === item.id && (
                                  <div
                                    className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30 text-left animate-in fade-in zoom-in-95"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        handleOpenEditModal(item);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 font-medium transition-colors"
                                    >
                                      <i className="ri-edit-line text-sm text-gray-400"></i>
                                      <span>Edit Data</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        handleToggleStatus(item);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
                                    >
                                      <i
                                        className={`ri-toggle-line text-sm ${
                                          isAktif ? 'text-amber-500' : 'text-emerald-500'
                                        }`}
                                      ></i>
                                      <span>{isAktif ? 'Nonaktifkan' : 'Aktifkan'}</span>
                                    </button>

                                    <div className="my-1 border-t border-gray-100"></div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveDropdownId(null);
                                        handleDeleteCommodity(item.id);
                                      }}
                                      className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
                                    >
                                      <i className="ri-delete-bin-line text-sm"></i>
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

            {/* Pagination Footer */}
            <div className="p-3 px-4 border-t border-gray-200/80 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium">
              <div>
                Menampilkan{' '}
                <span className="font-semibold text-gray-700">
                  {totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </span>{' '}
                -{' '}
                <span className="font-semibold text-gray-700">
                  {Math.min(currentPage * pageSize, totalRecords)}
                </span>{' '}
                dari <span className="font-semibold text-gray-700">{totalRecords}</span> data
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-600 transition-colors"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="w-7 h-7 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-gray-600 transition-colors"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Toggle Panel (tinggi setara dengan table list) */}
        {viewedCommodity && (
          <div className="xl:col-span-4 lg:col-span-5 col-span-12 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
            <DetailKomoditasPanel
              commodity={viewedCommodity}
              onClose={() => setViewedCommodity(null)}
              onEdit={(comm) => handleOpenEditModal(comm)}
              isLoading={isDetailLoading}
            />
          </div>
        )}
      </div>

      {/* Modal Tambah / Ubah Komoditas (Image 2) */}
      <ModalKomoditas
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveModal}
        mode={modalMode}
        isLoading={isSubmitLoading}
        formValues={formValues}
        setFormValues={setFormValues}
        kelompokTanamanOptions={kelompokTanamanOptions}
        satuanHasilOptions={satuanHasilOptions}
        onRegenerateCode={handleRegenerateCode}
      />
    </Fragment>
  );
}
