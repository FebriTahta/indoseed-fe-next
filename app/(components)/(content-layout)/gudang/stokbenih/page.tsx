"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import useStokBenih from '@/app/hooks/useStokBenih';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../produksi/jadwaltanam/component/FilterRow';
import DataTable from '../../shared/DataTable';
import RingkasanStokPerGudangDonut from './component/RingkasanStokPerGudangDonut';
import Top5StokTertinggi from './component/Top5StokTertinggi';
import InformasiGudangWidget from './component/InformasiGudangWidget';
import CatatanPentingBanner from './component/CatatanPentingBanner';
import StokBenihFormModal from './component/StokBenihFormModal';
import StokBenihDetailModal from './component/StokBenihDetailModal';
import StokBenihDeleteModal from './component/StokBenihDeleteModal';
import { StokBenihItem } from '@/app/types/stokBenih';

export default function StokBenihPage() {
  const {
    stokList,
    loading,
    activeTab,
    setActiveTab,
    filterGudang,
    setFilterGudang,
    filterKategori,
    setFilterKategori,
    filterProduk,
    setFilterProduk,
    filterBatch,
    setFilterBatch,
    filterStatus,
    setFilterStatus,
    filterPeriodeExpired,
    setFilterPeriodeExpired,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    gudangOptions,
    kategoriOptions,
    produkOptions,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems,
    topProdukList,
    // Modals & Actions
    isAddModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    isDeleteModalOpen,
    selectedItem,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDetailModal,
    handleOpenDeleteModal,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitUpdate,
    handleSubmitDelete,
  } = useStokBenih();

  // Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterGudang,
      onChange: (val: any) => setFilterGudang(val),
      options: gudangOptions,
      placeholder: 'Semua Gudang',
      title: 'Gudang',
      widthClass: 'sm:w-36',
      type: 'opsi',
    },
    {
      value: filterKategori,
      onChange: (val: any) => setFilterKategori(val),
      options: kategoriOptions,
      placeholder: 'Semua Kategori',
      title: 'Kategori Benih',
      widthClass: 'sm:w-36',
      type: 'opsi',
    },
    {
      value: filterProduk,
      onChange: (val: any) => setFilterProduk(val),
      options: produkOptions,
      placeholder: 'Semua Produk',
      title: 'Produk Benih',
      widthClass: 'sm:w-36',
      type: 'opsi',
    },
    {
      value: filterStatus,
      onChange: (val: any) => setFilterStatus(val),
      options: statusOptions,
      placeholder: 'Semua Status',
      title: 'Status',
      widthClass: 'sm:w-32',
      type: 'opsi',
    },
    {
      value: filterPeriodeExpired,
      onChange: (val: any) => setFilterPeriodeExpired(val),
      options: [],
      placeholder: '20/05/2026 - 20/05/2027',
      title: 'Periode Expired',
      widthClass: 'sm:w-44',
      type: 'date',
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No.',
    'Produk Benih',
    'Batch / Lot',
    'Tanggal Produksi',
    'Expired',
    'Gudang',
    'Stok (Kg)',
    'Reserved (Kg)',
    'Available (Kg)',
    'Daya Tumbuh (%)',
    'Status',
    'Aksi',
  ];

  // Render Table Row
  const renderTableRow = (item: StokBenihItem, index: number) => {
    const available = Math.max(0, (item.stokKg || 0) - (item.reservedKg || 0));

    const renderStatusBadge = (s: string) => {
      switch (s) {
        case 'Aman':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Aman
            </span>
          );
        case 'Exp < 30 Hari':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Exp &lt; 30 Hari
            </span>
          );
        case 'Expired':
        default:
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Expired
            </span>
          );
      }
    };

    return (
      <tr className="border-b border-defaultborder hover:bg-slate-50/60 transition-colors text-xs" key={item.batchLot || index}>
        <td className="p-3 text-gray-700 font-medium">{item.no || index + 1}</td>
        <td className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs flex-shrink-0">
              <i className="ri-seedling-line"></i>
            </div>
            <span className="font-semibold text-gray-900">{item.produkBenih}</span>
          </div>
        </td>
        <td
          onClick={() => handleOpenDetailModal(item)}
          className="p-3 font-semibold text-emerald-700 hover:underline cursor-pointer"
        >
          {item.batchLot}
        </td>
        <td className="p-3 text-gray-700">{item.tanggalProduksi}</td>
        <td className="p-3 text-gray-700">{item.expired}</td>
        <td className="p-3 text-gray-700 font-medium">{item.gudang}</td>
        <td className="p-3 text-gray-900 font-bold">{item.stokKg.toLocaleString('id-ID')}</td>
        <td className="p-3 text-amber-700 font-semibold">{item.reservedKg.toLocaleString('id-ID')}</td>
        <td className="p-3 text-emerald-700 font-bold">{available.toLocaleString('id-ID')}</td>
        <td className="p-3 text-gray-800 font-bold">{item.dayaTumbuh}</td>
        <td className="p-3">{renderStatusBadge(item.status)}</td>
        <td className="p-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleOpenDetailModal(item)}
              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
              title="Lihat Detail"
            >
              <i className="ri-eye-line text-sm"></i>
            </button>
            <button
              onClick={() => handleOpenEditModal(item)}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              title="Edit Data"
            >
              <i className="ri-pencil-line text-sm"></i>
            </button>
            <button
              onClick={() => handleOpenDeleteModal(item)}
              className="p-1 text-gray-500 hover:text-rose-600 transition-colors"
              title="Hapus Data"
            >
              <i className="ri-delete-bin-line text-sm"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Fragment>
      <Pageheader
        title="Gudang & Inventory"
        currentpage="Stok Benih"
        activepage="Stok Benih"
        mainpage="Gudang & Inventory"
        description="Pantau ketersediaan stok benih secara real-time berdasarkan batch dan tanggal kedaluwarsa."
        customButton={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <i className="ri-add-line text-sm"></i> Tambah Stok Benih
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="ri-file-excel-2-line text-xs text-emerald-700"></i> Export Excel
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="ri-file-pdf-2-line text-xs text-rose-600"></i> Export PDF
            </button>
          </div>
        }
      />

      {/* 6 Summary Stat Cards */}
      <StatsWidgets items={statItems} columns={6} />

      {/* Filter Row */}
      <FilterRow
        search={filterBatch}
        onSearchChange={setFilterBatch}
        searchPlaceholder="Cari batch / lot"
        searchTitle="Batch / Lot"
        selectFilters={filterConfig}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Main Grid: Left side (8 cols), Right side Widgets (4 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          {/* Main Table Box with Tabs */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            {/* Tabs Header */}
            <div className="border-b border-defaultborder bg-slate-50/70 px-4 pt-3 flex items-center gap-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('active');
                  setCurrentPage(1);
                }}
                className={`pb-3 border-b-2 transition-colors ${activeTab === 'active'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                Stok Benih Aktif
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('expired');
                  setCurrentPage(1);
                }}
                className={`pb-3 border-b-2 transition-colors ${activeTab === 'expired'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                Stok Expired
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('exp30');
                  setCurrentPage(1);
                }}
                className={`pb-3 border-b-2 transition-colors ${activeTab === 'exp30'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                Exp &lt; 30 Hari
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setCurrentPage(1);
                }}
                className={`pb-3 border-b-2 transition-colors ${activeTab === 'all'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
              >
                Semua Batch
              </button>
            </div>

            {/* Table Content */}
            <DataTable
              headers={tableHeaders}
              items={stokList}
              renderRow={renderTableRow}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalRecords={totalRecords}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              emptyMessage="Tidak ada data stok benih yang cocok."
              isLoading={loading}
            />
          </div>

          {/* Bottom Catatan Penting Banner */}
          <CatatanPentingBanner />
        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* Ringkasan Stok Benih per Gudang Donut Chart */}
          <RingkasanStokPerGudangDonut />

          {/* Top 5 Produk Stok Tertinggi Table */}
          <Top5StokTertinggi items={topProdukList} />

          {/* Informasi Bullets Widget */}
          <InformasiGudangWidget />
        </div>
      </div>

      {/* Create Modal */}
      <StokBenihFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitCreate}
        mode="add"
        gudangOptions={gudangOptions}
        produkOptions={produkOptions}
        kategoriOptions={kategoriOptions}
        statusOptions={statusOptions}
      />

      {/* Edit Modal */}
      <StokBenihFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitUpdate}
        initialData={selectedItem}
        mode="edit"
        gudangOptions={gudangOptions}
        produkOptions={produkOptions}
        kategoriOptions={kategoriOptions}
        statusOptions={statusOptions}
      />

      {/* Detail Modal */}
      <StokBenihDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <StokBenihDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={selectedItem}
      />
    </Fragment>
  );
}
