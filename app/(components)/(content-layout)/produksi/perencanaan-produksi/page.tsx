"use client";

import React, { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePerencanaanProduksi } from '@/app/hooks/usePerencanaanProduksi';
import StatCards from './component/StatCards';
import FilterCard from './component/FilterCard';
import DetailPanel from './component/DetailPanel';
import ModalEditRencana from './component/ModalEditRencana';
import ModalDetailRencana from './component/ModalDetailRencana';
import ModalCetakRencana from './component/ModalCetakRencana';
import { PerencanaanProduksi } from '@/app/types/perencanaanProduksi';

export default function PerencanaanProduksiPage() {
  const router = useRouter();
  const {
    items,
    loading,
    error,
    stats,
    selectedItem,
    setSelectedItem,
    // Filters
    search,
    setSearch,
    periode,
    setPeriode,
    status,
    setStatus,
    komoditas,
    setKomoditas,
    komoditasOption,
    varietas,
    setVarietas,
    varietasOption,
    namaPetani,
    setNamaPetani,
    partnersOption,
    handleResetFilters,
    handleApplyFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals
    isTambahModalOpen,
    setIsTambahModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCetakModalOpen,
    setIsCetakModalOpen,
    handleDelete,
    refreshData
  } = usePerencanaanProduksi();

  const [activeActionItem, setActiveActionItem] = useState<PerencanaanProduksi | null>(null);

  const getCommodityEmoji = (namaKomoditas: string) => {
    const lower = (namaKomoditas || '').toLowerCase();
    if (lower.includes('kangkung')) return '🌿';
    if (lower.includes('bayam') || lower.includes('daun')) return '🥬';
    if (lower.includes('tomat') || lower.includes('buah')) return '🍅';
    if (lower.includes('cabe') || lower.includes('cabai')) return '🌶️';
    if (lower.includes('brokoli')) return '🥦';
    if (lower.includes('padi')) return '🌾';
    if (lower.includes('terong')) return '🍆';
    if (lower.includes('buncis')) return '🫛';
    if (lower.includes('wortel')) return '🥕';
    if (lower.includes('jagung')) return '🌽';
    if (lower.includes('kedelai')) return '🫘';
    return '🌱';
  };

  const renderStatusBadge = (statusVal: string) => {
    switch (statusVal) {
      case 'Disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Disetujui
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Proses
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Draft
          </span>
        );
    }
  };

  const handleEditClick = (item: PerencanaanProduksi) => {
    setActiveActionItem(item);
    setIsEditModalOpen(true);
  };

  const handleCetakClick = (item: PerencanaanProduksi) => {
    setActiveActionItem(item);
    setIsCetakModalOpen(true);
  };

  const handleDetailClick = (item: PerencanaanProduksi) => {
    setActiveActionItem(item);
    setIsDetailModalOpen(true);
  };

  return (
    <Fragment>
      {/* Header & Breadcrumb */}
      <div className="mb-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
          <span className="text-emerald-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Produksi
          </span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-700 font-semibold">Perencanaan Produksi</span>
        </nav>

        {/* Page Title with green sprout icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Perencanaan Produksi</h1>
            <p className="text-xs text-gray-500 mt-0.5 font-normal">
              Kelola rencana produksi benih berdasarkan target pasar, kapasitas lahan, dan ketersediaan bahan baku.
            </p>
          </div>
        </div>
      </div>

      {/* 5 Top Stat Cards */}
      <StatCards stats={stats} />

      <div className="grid grid-cols-12 gap-6">
        <div className={selectedItem ? "col-span-12 xl:col-span-8 transition-all duration-300" : "col-span-12 transition-all duration-300"}>

          {/* Cari & Filter Card */}
          <FilterCard
            periode={periode}
            setPeriode={setPeriode}
            status={status}
            setStatus={setStatus}
            komoditas={komoditas}
            setKomoditas={setKomoditas}
            komoditasOption={komoditasOption}
            varietas={varietas}
            setVarietas={setVarietas}
            varietasOption={varietasOption}
            namaPetani={namaPetani}
            setNamaPetani={setNamaPetani}
            namaPetaniOption={partnersOption}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
            onOpenTambah={() => router.push('/produksi/perencanaan-produksi/tambah')}
          />

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden mb-6">
              {/* Table Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-sm font-bold text-gray-800">Daftar Perencanaan Produksi</h3>
                </div>
                <div className="text-[11px] text-gray-400 font-medium">
                  Total: <span className="font-bold text-gray-700">{totalRecords}</span> Rencana
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-600">
                  <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200/70 text-[11px]">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">No.</th>
                      <th className="py-3 px-3">No. Perencanaan</th>
                      <th className="py-3 px-3">Komoditas</th>
                      <th className="py-3 px-3">Varietas</th>
                      <th className="py-3 px-3 text-right">
                        Target Produksi
                        <span className="block text-[10px] font-normal text-gray-400">(kg)</span>
                      </th>
                      <th className="py-3 px-3 text-right">
                        Aktual / Terpenuhi
                        <span className="block text-[10px] font-normal text-emerald-600 font-semibold">(kg & %)</span>
                      </th>
                      <th className="py-3 px-3">Periode</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-gray-400">
                          <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <span>Memuat daftar perencanaan produksi...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-gray-400">
                          Tidak ada data perencanaan produksi yang cocok.
                        </td>
                      </tr>
                    ) : (
                      items.map((row, idx) => {
                        const isSelected = selectedItem?.id === row.id;
                        const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                        const emoji = getCommodityEmoji(row.komoditas);

                        return (
                          <tr
                            key={row.id || idx}
                            onClick={() => setSelectedItem(row)}
                            className={`cursor-pointer transition-colors ${isSelected
                              ? 'bg-emerald-50/60 font-medium'
                              : 'hover:bg-slate-50/80'
                              }`}
                          >
                            <td className="py-3 px-3 text-center font-medium text-gray-500">{rowNumber}</td>
                            <td className="py-3 px-3 font-semibold text-emerald-800">
                              {row.noPerencanaan}
                            </td>
                            <td className="py-3 px-3 text-gray-600">{row.komoditas}</td>
                            <td className="py-3 px-3 text-gray-700">{row.varietas}</td>
                            <td className="py-3 px-3 text-right font-semibold text-gray-900">
                              {row.targetProduksi.toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <span className="font-bold text-emerald-700">
                                {(row.aktualProduksi || 0).toLocaleString('id-ID')}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-1">
                                ({row.produksiTerpenuhi || 0}%)
                              </span>
                            </td>
                            <td className="py-3 px-3 text-gray-600">{row.periode}</td>
                            <td className="py-3 px-3 text-center">
                              {renderStatusBadge(row.status)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedItem((prev) => (prev?.id === row.id ? null : row));
                                }}
                                className={`w-8 h-8 rounded-lg inline-flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-[#078836] text-white shadow-xs'
                                    : 'text-gray-400 hover:text-emerald-700 hover:bg-emerald-50'
                                }`}
                                title={isSelected ? "Tutup detail perencanaan" : "Lihat detail perencanaan di sebelah kanan"}
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="1.75" />
                                  <circle cx="12" cy="12" r="1.75" />
                                  <circle cx="12" cy="19" r="1.75" />
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

              {/* Pagination Controls */}
              <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div>
                  Menampilkan{' '}
                  <span className="font-semibold text-gray-700">
                    {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0}
                  </span>{' '}
                  -{' '}
                  <span className="font-semibold text-gray-700">
                    {Math.min(currentPage * pageSize, totalRecords)}
                  </span>{' '}
                  dari <span className="font-semibold text-gray-700">{totalRecords}</span> data
                </div>

                <div className="flex items-center gap-1">
                  {/* Prev Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${currentPage === pageNum
                        ? 'bg-[#078836] text-white'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Right Column: Detail Perencanaan Produksi Panel */}
        {selectedItem && (
          <div className="col-span-12 xl:col-span-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <DetailPanel
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
              onEdit={handleEditClick}
              onCetak={handleCetakClick}
              onViewDetail={handleDetailClick}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>



      {/* Modals */}
      <ModalEditRencana
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refreshData}
        item={activeActionItem}
      />

      <ModalDetailRencana
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        item={activeActionItem || selectedItem}
        onEdit={(item) => {
          setIsDetailModalOpen(false);
          handleEditClick(item);
        }}
        onCetak={(item) => {
          setIsDetailModalOpen(false);
          handleCetakClick(item);
        }}
      />

      <ModalCetakRencana
        isOpen={isCetakModalOpen}
        onClose={() => setIsCetakModalOpen(false)}
        item={activeActionItem || selectedItem}
      />
    </Fragment>
  );
}
