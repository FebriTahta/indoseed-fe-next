"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import useSortasi from '@/app/hooks/useSortasi';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../jadwaltanam/component/FilterRow';
import DataTable from '../../shared/DataTable';
import ProsesSortasiAktif from './component/ProsesSortasiAktif';
import RingkasanHariIni from './component/RingkasanHariIni';
import ParameterSortasiStandar from './component/ParameterSortasiStandar';
import KomposisiHasilSortasi from './component/KomposisiHasilSortasi';
import DokumentasiTerbaru from './component/DokumentasiTerbaru';
import SortasiFormModal from './component/SortasiFormModal';
import SortasiDetailModal from './component/SortasiDetailModal';
import SortasiDeleteModal from './component/SortasiDeleteModal';
import { SortasiBatchItem } from '@/app/types/sortasi';

export default function SortasiPage() {
  const {
    batchList,
    prosesAktifList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterAlat,
    setFilterAlat,
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
    alatOptions,
    statusOptions,
    lokasiOptions,
    handleApplyFilters,
    handleResetFilters,
    statItems,
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
  } = useSortasi();

  // Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterPeriode,
      onChange: (val: any) => setFilterPeriode(val),
      options: [],
      placeholder: 'Periode',
      title: 'Periode',
      widthClass: 'sm:w-44',
      type: 'date'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => setFilterKomoditas(val),
      options: komoditasOptions,
      placeholder: 'Semua Komoditas',
      title: 'Komoditas',
      widthClass: 'sm:w-36',
      type: 'opsi'
    },
    {
      value: filterVarietas,
      onChange: (val: any) => setFilterVarietas(val),
      options: varietasOptions,
      placeholder: 'Semua Varietas',
      title: 'Varietas',
      widthClass: 'sm:w-36',
      type: 'opsi'
    },
    {
      value: filterAlat,
      onChange: (val: any) => setFilterAlat(val),
      options: alatOptions,
      placeholder: 'Semua Alat',
      title: 'Alat Sortasi',
      widthClass: 'sm:w-36',
      type: 'opsi'
    },
    {
      value: filterStatus,
      onChange: (val: any) => setFilterStatus(val),
      options: statusOptions,
      placeholder: 'Semua Status',
      title: 'Status',
      widthClass: 'sm:w-32',
      type: 'opsi'
    },
    {
      value: filterLokasi,
      onChange: (val: any) => setFilterLokasi(val),
      options: lokasiOptions,
      placeholder: 'Semua Lokasi',
      title: 'Lokasi',
      widthClass: 'sm:w-32',
      type: 'opsi'
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No',
    'Kode Batch',
    'Komoditas',
    'Varietas',
    'Alat Sortasi',
    'Berat Masuk (Kg)',
    'Hasil Lulus (Kg)',
    'Hasil Tolak (Kg)',
    'Recovery (%)',
    'Tanggal Sortasi',
    'Status',
    'Aksi'
  ];

  // Render Table Row
  const renderTableRow = (item: SortasiBatchItem, index: number) => {
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
        <td className="p-3 text-gray-700 font-medium">{item.alatSortasi}</td>
        <td className="p-3 text-gray-800 font-bold">{item.beratMasuk ? item.beratMasuk.toLocaleString('id-ID') : '-'}</td>
        <td className="p-3 text-emerald-700 font-bold">{item.hasilLulus ? item.hasilLulus.toLocaleString('id-ID') : '-'}</td>
        <td className="p-3 text-rose-600 font-bold">{item.hasilTolak ? item.hasilTolak.toLocaleString('id-ID') : '-'}</td>
        <td className="p-3 text-gray-800 font-bold">{item.recovery ? `${item.recovery.toFixed(2).replace('.', ',')}%` : '-'}</td>
        <td className="p-3 text-gray-700">{item.tanggalSortasi}</td>
        <td className="p-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {item.status}
          </span>
        </td>
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
        currentpage="Sortasi"
        activepage="Sortasi"
        mainpage="Produksi"
        description="Kelola proses sortasi benih untuk memisahkan dan mengklasifikasikan benih sesuai standar mutu."
        customButton={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <i className="ri-add-line text-sm"></i> Mulai Sortasi Baru
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

      {/* Main Grid: Left side Active Process & Table (8 cols), Right side Widgets (4 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          {/* Proses Sortasi Aktif */}
          <ProsesSortasiAktif items={prosesAktifList} />

          {/* Daftar Batch Sortasi Table */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
              <h3 className="box-title text-sm font-bold text-gray-800">Daftar Batch Sortasi</h3>
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
              emptyMessage="Tidak ada data batch sortasi yang cocok."
              isLoading={loading}
            />
          </div>

          {/* ISO Alert Banner */}
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3.5 mb-6 flex items-center gap-2 text-xs text-emerald-900">
            <i className="ri-information-line text-emerald-600 text-base flex-shrink-0"></i>
            <span>
              Proses sortasi mengikuti standar ISO 9001:2015 (Klausul 8.5.1 - Pengendalian Produksi) dan ISO 22005:2018 (Traceability). Pastikan alat sortasi terkalibrasi dan parameter sesuai standar.
            </span>
          </div>
        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* Ringkasan Hari Ini */}
          <RingkasanHariIni />

          {/* Parameter Sortasi Standar */}
          <ParameterSortasiStandar />

          {/* Komposisi Hasil Sortasi */}
          <KomposisiHasilSortasi />

          {/* Dokumentasi Terbaru */}
          <DokumentasiTerbaru />
        </div>
      </div>

      {/* Create Modal */}
      <SortasiFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitCreate}
        mode="add"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        alatOptions={alatOptions}
        lokasiOptions={lokasiOptions}
      />

      {/* Edit Modal */}
      <SortasiFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitUpdate}
        initialData={selectedItem}
        mode="edit"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        alatOptions={alatOptions}
        lokasiOptions={lokasiOptions}
      />

      {/* Detail Modal */}
      <SortasiDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <SortasiDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={selectedItem}
      />
    </Fragment>
  );
}
