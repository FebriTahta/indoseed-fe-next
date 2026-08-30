"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import useBatchProduksi from '@/app/hooks/useBatchProduksi';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../jadwaltanam/component/FilterRow';
import DataTable from '../../shared/DataTable';
import RingkasanBatchDonut from './component/RingkasanBatchDonut';
import PerformaProduksiChart from './component/PerformaProduksiChart';
import TahapanProduksiProgress from './component/TahapanProduksiProgress';
import DokumentasiTerbaru from './component/DokumentasiTerbaru';
import BatchProduksiFormModal from './component/BatchProduksiFormModal';
import BatchProduksiDetailModal from './component/BatchProduksiDetailModal';
import BatchProduksiDeleteModal from './component/BatchProduksiDeleteModal';
import { BatchProduksiItem } from '@/app/types/batchProduksi';

export default function BatchProduksiPage() {
  const {
    batchList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterSumber,
    setFilterSumber,
    filterStatus,
    setFilterStatus,
    filterLokasi,
    setFilterLokasi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    komoditasOptions,
    varietasOptions,
    sumberBahanOptions,
    statusOptions,
    lokasiOptions,
    treatmentOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems,
    tahapanProduksiList,
    dokumenTerbaruList,
    // Modal & CRUD actions
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
  } = useBatchProduksi();

  // Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterPeriode,
      onChange: (val: any) => setFilterPeriode(val),
      options: [],
      placeholder: 'Periode',
      title: 'Periode',
      widthClass: 'sm:w-44',
      type: 'date',
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => setFilterKomoditas(val),
      options: komoditasOptions,
      placeholder: 'Semua Komoditas',
      title: 'Komoditas',
      widthClass: 'sm:w-36',
      type: 'opsi',
    },
    {
      value: filterVarietas,
      onChange: (val: any) => setFilterVarietas(val),
      options: varietasOptions,
      placeholder: 'Semua Varietas',
      title: 'Varietas',
      widthClass: 'sm:w-36',
      type: 'opsi',
    },
    {
      value: filterSumber,
      onChange: (val: any) => setFilterSumber(val),
      options: sumberBahanOptions,
      placeholder: 'Semua Sumber',
      title: 'Sumber Bahan',
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
      value: filterLokasi,
      onChange: (val: any) => setFilterLokasi(val),
      options: lokasiOptions,
      placeholder: 'Semua Lokasi',
      title: 'Lokasi',
      widthClass: 'sm:w-32',
      type: 'opsi',
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No',
    'Kode Batch Produksi',
    'Komoditas',
    'Varietas',
    'Sumber Bahan',
    'Tanggal Mulai',
    'Tanggal Selesai',
    'Target (Kg)',
    'Hasil (Kg)',
    'Yield (%)',
    'Status',
    'Aksi',
  ];

  // Render Table Row
  const renderTableRow = (item: BatchProduksiItem, index: number) => {
    const renderStatusBadge = (s: string) => {
      switch (s) {
        case 'Selesai':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Selesai
            </span>
          );
        case 'Proses':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Proses
            </span>
          );
        case 'Reject':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Reject
            </span>
          );
        case 'Belum Mulai':
        default:
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              Belum Mulai
            </span>
          );
      }
    };

    return (
      <tr className="border-b border-defaultborder hover:bg-slate-50/60 transition-colors text-xs" key={item.kodeBatch || index}>
        <td className="p-3 text-gray-700 font-medium">{item.no || index + 1}</td>
        <td
          onClick={() => handleOpenDetailModal(item)}
          className="p-3 font-semibold text-emerald-700 hover:underline cursor-pointer"
        >
          {item.kodeBatch}
        </td>
        <td className="p-3 text-gray-700">{item.komoditas}</td>
        <td className="p-3 text-gray-700">{item.varietas}</td>
        <td className="p-3 text-gray-700 font-medium">{item.sumberBahan}</td>
        <td className="p-3 text-gray-700">{item.tanggalMulai}</td>
        <td className="p-3 text-gray-700">{item.tanggalSelesai}</td>
        <td className="p-3 text-gray-700 font-medium">{item.targetKg ? item.targetKg.toLocaleString('id-ID') : '-'}</td>
        <td className="p-3 text-gray-700 font-semibold">{item.hasilKg ? item.hasilKg.toLocaleString('id-ID') : '-'}</td>
        <td className="p-3 text-gray-700 font-bold text-emerald-800">
          {item.yieldPercent && item.yieldPercent > 0 ? `${item.yieldPercent.toLocaleString('id-ID')}%` : '-'}
        </td>
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
        title="Produksi"
        currentpage="Batch Produksi"
        activepage="Batch Produksi"
        mainpage="Produksi"
        description="Kelola batch produksi benih secara terintegrasi mulai dari sumber bahan hingga menjadi batch siap untuk QC."
        customButton={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <i className="ri-add-line text-sm"></i> Buat Batch Produksi Baru
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="ri-download-line text-xs"></i> Export Laporan <i className="ri-arrow-down-s-line text-xs"></i>
            </button>
          </div>
        }
      />

      {/* 6 Summary Stat Cards */}
      <StatsWidgets items={statItems} columns={6} />

      {/* Filter Row */}
      <FilterRow
        selectFilters={filterConfig}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Main Grid: Left side (8 cols), Right side (4 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          {/* Daftar Batch Produksi Table */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
              <h3 className="box-title text-sm font-bold text-gray-800">Daftar Batch Produksi</h3>
              <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
                Lihat Semua
              </button>
            </div>
            <DataTable
              headers={tableHeaders}
              items={batchList}
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
              emptyMessage="Tidak ada data batch produksi yang cocok."
              isLoading={loading}
            />
          </div>

          {/* ISO Alert Banner */}
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3.5 mb-6 flex items-center gap-2 text-xs text-emerald-900">
            <i className="ri-information-line text-emerald-600 text-base flex-shrink-0"></i>
            <span>
              Proses batch produksi mengikuti standar ISO 9001:2015 (Klausul 8.5.1 - Pengendalian Produksi) dan ISO 22005:2018 (Traceability). Pastikan setiap tahapan produksi terdokumentasi dengan baik.
            </span>
          </div>
        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* Ringkasan Batch Produksi Donut Chart */}
          <RingkasanBatchDonut />

          {/* Performa Produksi (30 Hari Terakhir) Line Chart */}
          <PerformaProduksiChart />

          {/* Tahapan Produksi Progress */}
          <TahapanProduksiProgress items={tahapanProduksiList} />

          {/* Dokumentasi Terbaru PDF Cards */}
          <DokumentasiTerbaru items={dokumenTerbaruList} />
        </div>
      </div>

      {/* Create Modal */}
      <BatchProduksiFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitCreate}
        mode="add"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        sumberBahanOptions={sumberBahanOptions}
        lokasiOptions={lokasiOptions}
        treatmentOptions={treatmentOptions}
      />

      {/* Edit Modal */}
      <BatchProduksiFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitUpdate}
        initialData={selectedItem}
        mode="edit"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        sumberBahanOptions={sumberBahanOptions}
        lokasiOptions={lokasiOptions}
        treatmentOptions={treatmentOptions}
      />

      {/* Detail Modal */}
      <BatchProduksiDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <BatchProduksiDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={selectedItem}
      />
    </Fragment>
  );
}
