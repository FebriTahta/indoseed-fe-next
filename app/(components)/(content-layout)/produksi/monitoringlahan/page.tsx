"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import useMonitoringLahan from '@/app/hooks/useMonitoringLahan';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../jadwaltanam/component/FilterRow';
import DataTable from '../../shared/DataTable';
import PetaSebaranLahan from './component/PetaSebaranLahan';
import RingkasanKondisiLahan from './component/RingkasanKondisiLahan';
import ParameterMonitoring from './component/ParameterMonitoring';
import AktivitasTerbaru from './component/AktivitasTerbaru';
import MonitoringLahanFormModal from './component/MonitoringLahanFormModal';
import MonitoringLahanDetailModal from './component/MonitoringLahanDetailModal';
import MonitoringLahanDeleteModal from './component/MonitoringLahanDeleteModal';
import { MonitoringLahanItem } from '@/app/types/monitoringLahan';

export default function MonitoringLahanPage() {
  const {
    lahanList,
    loading,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterLokasi,
    setFilterLokasi,
    filterStatus,
    setFilterStatus,
    filterKondisi,
    setFilterKondisi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    komoditasOptions,
    varietasOptions,
    lokasiOptions,
    statusOptions,
    kondisiOptions,
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
  } = useMonitoringLahan();

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
      value: filterLokasi,
      onChange: (val: any) => setFilterLokasi(val),
      options: lokasiOptions,
      placeholder: 'Semua Lokasi',
      title: 'Lokasi',
      widthClass: 'sm:w-36',
      type: 'opsi'
    },
    {
      value: filterStatus,
      onChange: (val: any) => setFilterStatus(val),
      options: statusOptions,
      placeholder: 'Semua Status',
      title: 'Status Lahan',
      widthClass: 'sm:w-32',
      type: 'opsi'
    },
    {
      value: filterKondisi,
      onChange: (val: any) => setFilterKondisi(val),
      options: kondisiOptions,
      placeholder: 'Semua Kondisi',
      title: 'Kondisi',
      widthClass: 'sm:w-32',
      type: 'opsi'
    },
  ];

  // Table Headers
  const tableHeaders = [
    'Kode Lahan',
    'Lokasi',
    'Komoditas',
    'Varietas',
    'Luas (Ha)',
    'Tanggal Tanam',
    'Umur (HST)',
    'Kondisi',
    'Status',
    'Aksi'
  ];

  // Render Table Row
  const renderTableRow = (item: MonitoringLahanItem, index: number) => {
    const renderKondisiBadge = (k: string) => {
      switch (k) {
        case 'Baik':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Baik
            </span>
          );
        case 'Perlu Perhatian':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Perlu Perhatian
            </span>
          );
        case 'Buruk':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Buruk
            </span>
          );
        case 'Belum Tanam':
        default:
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              Belum Tanam
            </span>
          );
      }
    };

    const renderStatusBadge = (s: string) => {
      if (s === 'Aktif') {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        );
      }
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
          {s}
        </span>
      );
    };

    return (
      <tr className="border-b border-defaultborder hover:bg-slate-50/60 transition-colors text-xs" key={item.kodeLahan || index}>
        <td
          onClick={() => handleOpenDetailModal(item)}
          className="p-3 font-semibold text-emerald-700 hover:underline cursor-pointer"
        >
          {item.kodeLahan}
        </td>
        <td className="p-3 text-gray-700 font-medium">{item.lokasi}</td>
        <td className="p-3 text-gray-700">{item.komoditas}</td>
        <td className="p-3 text-gray-700">{item.varietas}</td>
        <td className="p-3 text-gray-700 font-medium">{item.luas ? item.luas.toFixed(2).replace('.', ',') : '-'}</td>
        <td className="p-3 text-gray-700">{item.tanggalTanam}</td>
        <td className="p-3 text-gray-700">{item.umurHst}</td>
        <td className="p-3">{renderKondisiBadge(item.kondisi)}</td>
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
        currentpage="Monitoring Lahan"
        activepage="Monitoring Lahan"
        mainpage="Produksi"
        description="Pantau kondisi dan aktivitas seluruh lahan secara real-time untuk memastikan kualitas produksi benih."
        customButton={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <i className="ri-add-line text-sm"></i> Tambah Monitoring Baru
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors">
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

      {/* Main Grid: Left side Map & Table (8 cols), Right side Widgets (4 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          {/* Peta Sebaran Lahan */}
          <PetaSebaranLahan />

          {/* Daftar Lahan Table */}
          <div className="box border border-defaultborder/60 bg-white shadow-xs rounded-lg overflow-hidden mb-6">
            <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
              <h3 className="box-title text-sm font-bold text-gray-800">Daftar Lahan</h3>
            </div>
            <DataTable
              headers={tableHeaders}
              items={lahanList}
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
              emptyMessage="Tidak ada data monitoring lahan yang cocok."
              isLoading={loading}
            />
          </div>

          {/* ISO Alert Banner */}
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3.5 mb-6 flex items-center gap-2 text-xs text-emerald-900">
            <i className="ri-information-line text-emerald-600 text-base flex-shrink-0"></i>
            <span>
              Monitoring lahan mengikuti standar ISO 9001:2015 (Klausul 8.5.1 - Pengendalian Produksi) dan ISO 22005:2018 (Traceability - Klausul 4.3.3).
            </span>
          </div>
        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* Ringkasan Kondisi Lahan */}
          <RingkasanKondisiLahan />

          {/* Parameter Monitoring */}
          <ParameterMonitoring />

          {/* Aktivitas Terbaru */}
          <AktivitasTerbaru />
        </div>
      </div>

      {/* Create Modal */}
      <MonitoringLahanFormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitCreate}
        mode="add"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        lokasiOptions={lokasiOptions}
      />

      {/* Edit Modal */}
      <MonitoringLahanFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitUpdate}
        initialData={selectedItem}
        mode="edit"
        komoditasOptions={komoditasOptions}
        varietasOptions={varietasOptions}
        lokasiOptions={lokasiOptions}
      />

      {/* Detail Modal */}
      <MonitoringLahanDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        item={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      <MonitoringLahanDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={selectedItem}
      />
    </Fragment>
  );
}
