"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import useTraceability from '@/app/hooks/useTraceability';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../jadwaltanam/component/FilterRow';
import AlurTraceabilityFlow from './component/AlurTraceabilityFlow';
import InformasiBatchCard from './component/InformasiBatchCard';
import TimelineAktivitas from './component/TimelineAktivitas';
import IdentitasProdukCard from './component/IdentitasProdukCard';
import InformasiDistribusiCard from './component/InformasiDistribusiCard';
import DokumenPendukungTraceability from './component/DokumenPendukungTraceability';

export default function TraceabilityPage() {
  const {
    searchQuery,
    setSearchQuery,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterPeriode,
    setFilterPeriode,
    filterLokasi,
    setFilterLokasi,
    handleApplyFilters,
    handleResetFilters,
    batchInfo,
    flowSteps,
    timelineActivities,
    distributionInfo,
    supportDocuments,
    statItems,
    komoditasOptions,
    varietasOptions,
    lokasiOptions
  } = useTraceability();

  // Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
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
      value: filterPeriode,
      onChange: (val: any) => setFilterPeriode(val),
      options: [],
      placeholder: 'Periode Produksi',
      title: 'Periode Produksi',
      widthClass: 'sm:w-44',
      type: 'date'
    },
    {
      value: filterLokasi,
      onChange: (val: any) => setFilterLokasi(val),
      options: lokasiOptions,
      placeholder: 'Semua Lokasi',
      title: 'Lokasi Saat Ini',
      widthClass: 'sm:w-36',
      type: 'opsi'
    },
  ];

  return (
    <Fragment>
      <Pageheader
        title="Produksi"
        currentpage="Traceability"
        activepage="Traceability"
        mainpage="Produksi"
        description="Lacak seluruh perjalanan benih secara menyeluruh dari sumber hingga ke pelanggan."
        customButton={
          <div className="flex items-center gap-2">
            <button className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="ri-qr-scan-line text-sm"></i> Scan QR / Barcode
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
              <i className="ri-download-line text-xs"></i> Export Laporan <i className="ri-arrow-down-s-line text-xs"></i>
            </button>
          </div>
        }
      />

      {/* 6 Summary Stat Cards */}
      <StatsWidgets items={statItems} columns={6} />

      {/* Filter Row with Search Box & Filter Dropdowns */}
      <FilterRow
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="BP-2606-0005"
        searchTitle="Cari Batch / Lot / Barcode"
        selectFilters={filterConfig}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Full-width 9-Stage Process Flow */}
      <AlurTraceabilityFlow steps={flowSteps} />

      {/* Main Grid: Left side (8 cols) & Right side Widgets (4 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column (8 cols on xl) */}
        <div className="xl:col-span-8 col-span-12 space-y-6">
          {/* Sub-grid for Informasi Batch (4 cols) & Timeline Aktivitas (8 cols) */}
          <div className="grid grid-cols-12 gap-6">
            <div className="xl:col-span-4 col-span-12">
              <InformasiBatchCard data={batchInfo} />
            </div>
            <div className="xl:col-span-8 col-span-12">
              <TimelineAktivitas activities={timelineActivities} />
            </div>
          </div>

          {/* ISO Alert Banner */}
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/60 p-3.5 mb-6 flex items-center gap-2 text-xs text-emerald-900">
            <i className="ri-information-line text-emerald-600 text-base flex-shrink-0"></i>
            <span>
              Sistem traceability ini sesuai dengan standar ISO 22005:2018 (Traceability in the Feed and Food Chain) untuk memastikan keamanan dan transparansi produk.
            </span>
          </div>
        </div>

        {/* Right Column (4 cols on xl) */}
        <div className="xl:col-span-4 col-span-12 space-y-6">
          {/* Identitas Produk */}
          <IdentitasProdukCard />

          {/* Informasi Distribusi */}
          <InformasiDistribusiCard info={distributionInfo} />

          {/* Dokumen Pendukung */}
          <DokumenPendukungTraceability documents={supportDocuments} />
        </div>
      </div>
    </Fragment>
  );
}
