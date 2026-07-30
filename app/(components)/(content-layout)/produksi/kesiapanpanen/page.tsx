"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import useKesiapanPanen from '@/app/hooks/useKesiapanPanen';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../jadwaltanam/component/FilterRow';
import DataTable from '../../shared/DataTable';
import ParameterKematangan from './component/ParameterKematangan';
import RingkasanKesiapanPanen from './component/RingkasanKesiapanPanen';
import PrediksiPanenChart from './component/PrediksiPanenChart';
import LahanMendekatiSiapPanen from './component/LahanMendekatiSiapPanen';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';

export default function KesiapanPanenPage() {
  const {
    kesiapanList,
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
    handleApplyFilters,
    handleResetFilters,
    statItems
  } = useKesiapanPanen();

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
      widthClass: 'sm:w-40',
      type: 'opsi'
    },
    {
      value: filterVarietas,
      onChange: (val: any) => setFilterVarietas(val),
      options: varietasOptions,
      placeholder: 'Semua Varietas',
      title: 'Varietas',
      widthClass: 'sm:w-40',
      type: 'opsi'
    },
    {
      value: filterLokasi,
      onChange: (val: any) => setFilterLokasi(val),
      options: lokasiOptions,
      placeholder: 'Semua Lokasi',
      title: 'Lokasi / Lahan',
      widthClass: 'sm:w-40',
      type: 'opsi'
    },
    {
      value: filterStatus,
      onChange: (val: any) => setFilterStatus(val),
      options: statusOptions,
      placeholder: 'Semua Status',
      title: 'Status Kesiapan',
      widthClass: 'sm:w-40',
      type: 'opsi'
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No',
    'Kode Lahan',
    'Komoditas',
    'Varietas',
    'Tanggal Tanam',
    'Umur Tanaman (HST)',
    'Prediksi Panen',
    'Status Kesiapan',
    'Rata-rata Yield Est. (Kg/Ha)',
    'Aksi'
  ];

  // Render Table Row
  const renderTableRow = (item: KesiapanPanenItem, index: number) => {
    const renderStatusBadge = (status: string) => {
      switch (status) {
        case 'Siap Panen':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Siap Panen
            </span>
          );
        case 'Akan Siap (3-7 Hari)':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              Akan Siap (3-7 Hari)
            </span>
          );
        case 'Akan Siap (8-14 Hari)':
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Akan Siap (8-14 Hari)
            </span>
          );
        case 'Belum Siap':
        default:
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Belum Siap
            </span>
          );
      }
    };

    return (
      <tr className="border-b border-defaultborder hover:bg-slate-50/60 transition-colors text-xs" key={item.kodeLahan || index}>
        <td className="p-3 text-gray-700 font-medium">{item.no}</td>
        <td className="p-3 font-semibold text-emerald-700 hover:underline cursor-pointer">{item.kodeLahan}</td>
        <td className="p-3 text-gray-700">{item.komoditas}</td>
        <td className="p-3 text-gray-700">{item.varietas}</td>
        <td className="p-3 text-gray-700">{item.tanggalTanam}</td>
        <td className="p-3 text-gray-700 font-medium">{item.umurHst}</td>
        <td className="p-3 text-gray-700 font-medium">{item.prediksiPanen}</td>
        <td className="p-3">{renderStatusBadge(item.statusKesiapan)}</td>
        <td className="p-3 text-gray-700 font-semibold">{item.yieldEst.toLocaleString('id-ID')}</td>
        <td className="p-3">
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-gray-500 hover:text-emerald-700" title="Lihat Detail">
              <i className="ri-eye-line text-sm"></i>
            </button>
            <button className="p-1 text-gray-500 hover:text-emerald-700" title="Edit">
              <i className="ri-pencil-line text-sm"></i>
            </button>
            <button className="p-1 text-gray-500 hover:text-emerald-700" title="Grafik Analytics">
              <i className="ri-bar-chart-line text-sm"></i>
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
        currentpage="Kesiapan Panen"
        activepage="Kesiapan Panen"
        mainpage="Produksi"
        description="Monitor kesiapan panen berdasarkan umur tanaman, parameter kualitas, dan perkiraan hasil untuk memastikan panen tepat waktu."
        customButton={
          <div className="flex items-center gap-2">
            <button className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="ri-add-line text-sm"></i> Tambah Kesiapan Panen Baru
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

      {/* Main Grid: Left side Table & Parameter (8 cols), Right side Widgets (4 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          {/* Daftar Kesiapan Panen Table */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
              <h3 className="box-title text-sm font-bold text-gray-800">Daftar Kesiapan Panen</h3>
            </div>
            <DataTable
              headers={tableHeaders}
              items={kesiapanList}
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
              emptyMessage="Tidak ada data kesiapan panen yang cocok."
              isLoading={loading}
            />
          </div>

          {/* Parameter Kematangan (Rata-rata) */}
          <ParameterKematangan />

          {/* ISO Alert Banner */}
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3.5 mb-6 flex items-center gap-2 text-xs text-emerald-900">
            <i className="ri-information-line text-emerald-600 text-base flex-shrink-0"></i>
            <span>
              Kesiapan panen mengikuti standar ISO 9001:2015 (Klausul 8.5.1 - Pengendalian Produksi) dan praktik GAP (Good Agricultural Practices).
            </span>
          </div>
        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* Ringkasan Kesiapan Panen */}
          <RingkasanKesiapanPanen />

          {/* Prediksi Panen (7 Hari ke Depan) */}
          <PrediksiPanenChart />

          {/* Lahan Mendekati Siap Panen */}
          <LahanMendekatiSiapPanen />
        </div>
      </div>
    </Fragment>
  );
}
