"use client";

import React, { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import { useJadwalTanams } from '@/app/hooks/useJadwalTanam';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from './component/FilterRow';
import DataTable from '../../shared/DataTable';
import Timeline from './component/TimeLine';
import KalenderJadwalTanam from './component/KalenderJadwalTanam';
import RingkasanKomoditas from './component/RingkasanKomoditas';
import NoteCard from './component/NoteCard';
import ModalDetailJadwalTanam from './component/ModalDetailJadwalTanam';
import { JadwalTanam } from '@/app/types/jadwalTanam';

export default function JadwalTanamPage() {
  const router = useRouter();
  const {
    jadwalTanams,
    loading,
    error,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterLahan,
    setFilterLahan,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    handleAdd,
    handleDelete,
    statItems,
    statMaster
  } = useJadwalTanams();

  const [selectedPreviewJadwal, setSelectedPreviewJadwal] = useState<JadwalTanam | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreview = (item: JadwalTanam) => {
    setSelectedPreviewJadwal(item);
    setIsPreviewOpen(true);
  };

  // Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterPeriode,
      onChange: (val: any) => setFilterPeriode(val),
      options: [],
      placeholder: 'Periode Tanam',
      title: 'Periode Tanam',
      widthClass: 'sm:w-48',
      type: 'date'
    },
    {
      value: filterLahan,
      onChange: (val: any) => setFilterLahan(val),
      options: statMaster.lahanOptions,
      placeholder: 'Semua Lahan',
      title: 'Lahan',
      widthClass: 'sm:w-44',
      type: 'opsi'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => setFilterKomoditas(val),
      options: statMaster.komoditasOptions,
      placeholder: 'Semua Komoditas',
      title: 'Komoditas',
      widthClass: 'sm:w-44',
      type: 'opsi'
    },
    {
      value: filterVarietas,
      onChange: (val: any) => setFilterVarietas(val),
      options: statMaster.varietasOptions,
      placeholder: 'Semua Varietas',
      title: 'Varietas',
      widthClass: 'sm:w-44',
      type: 'opsi'
    },
    {
      value: filterStatus,
      onChange: (val: any) => setFilterStatus(val),
      options: statusOptions,
      placeholder: 'Semua Status',
      title: 'Status',
      widthClass: 'sm:w-40',
      type: 'opsi'
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No',
    'Kode Jadwal',
    'Komoditas',
    'Varietas',
    'Lahan',
    'Luas (Ha)',
    'Tanggal Tanam',
    'Perkiraan Panen',
    'Status',
    'Penanggung Jawab',
    'Aksi'
  ];

  // Render Table Row
  const renderTableRow = (item: JadwalTanam, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;

    const renderStatusBadge = (status: string) => {
      if (status === 'Sedang Berlangsung') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Sedang Berlangsung
          </span>
        );
      } else if (status === 'Akan Tanam') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Akan Tanam
          </span>
        );
      } else if (status === 'Selesai') {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Selesai
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
          {status}
        </span>
      );
    };

    return (
      <tr className="border-b border-defaultborder hover:bg-slate-50/60 transition-colors" key={item.informasiUmum?.kodeJadwalTanam || index}>
        <td className="p-3 font-medium text-gray-700">{rowNumber}</td>
        <td className="p-3 font-semibold text-gray-800">{item.informasiUmum?.kodeJadwalTanam}</td>
        <td className="p-3 text-gray-700">{item.lahanKomoditas?.komoditas}</td>
        <td className="p-3 text-gray-700">{item.lahanKomoditas?.varietas}</td>
        <td className="p-3 text-gray-700">{item.lahanKomoditas?.namaLahan}</td>
        <td className="p-3 text-gray-700">
          {typeof item.lahanKomoditas?.luasTanam === 'number'
            ? item.lahanKomoditas.luasTanam.toFixed(2).replace('.', ',')
            : item.lahanKomoditas?.luasTanam}
        </td>
        <td className="p-3 text-gray-700">{item.rencanaTanam?.tanggalTanam}</td>
        <td className="p-3 text-gray-700">{item.rencanaTanam?.perkiraanPanen}</td>
        <td className="p-3">{renderStatusBadge(item.status)}</td>
        <td className="p-3 text-gray-700">{item.informasiUmum?.penanggungJawab}</td>
        <td className="p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenPreview(item)}
              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
              title="Lihat Detail"
            >
              <i className="ri-eye-line text-base"></i>
            </button>
            <button
              onClick={() => router.push(`/produksi/jadwaltanam/edit/${(item as any).id}`)}
              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
              title="Edit"
            >
              <i className="ri-pencil-line text-base"></i>
            </button>
            <button
              onClick={() => handleDelete((item as any).id, item.informasiUmum?.kodeJadwalTanam)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              title="Hapus Jadwal Tanam"
            >
              <i className="ri-delete-bin-line text-base"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (error) {
    return <div className="p-4 text-center text-red-500 font-semibold">{error}</div>;
  }

  return (
    <Fragment>
      <Pageheader
        title="Produksi"
        currentpage="Jadwal Tanam"
        activepage="Jadwal Tanam"
        mainpage="Jadwal Tanam"
        description="Kelola dan atur jadwal tanam untuk setiap lahan produksi"
        customButton={
          <button
            onClick={handleAdd}
            className="bg-[#078836] hover:bg-[#06732d] text-white px-4 py-2 rounded-md font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <i className="ri-add-line text-base"></i> Buat Jadwal Tanam Baru
            <i className="ri-arrow-down-s-line text-xs"></i>
          </button>
        }
      />

      {/* Filter Row */}
      <FilterRow
        selectFilters={filterConfig}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* 6 Summary Stat Cards */}
      <StatsWidgets items={statItems} columns={6} />

      {/* Main Grid: Left side Table & Timeline (9 cols), Right side Widgets (3 cols) */}
      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Column */}
        <div className="xl:col-span-9 col-span-12">
          {/* Table list with pagination */}
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
            <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
              <h3 className="box-title text-sm font-bold text-gray-800">Daftar Jadwal Tanam</h3>
            </div>
            <DataTable
              headers={tableHeaders}
              items={jadwalTanams}
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
              emptyMessage="Tidak ada data jadwal tanam yang cocok."
              isLoading={loading}
            />
          </div>

          {/* Timeline Jadwal Tanam */}
          <Timeline jadwalTanams={jadwalTanams} />
        </div>

        {/* Right Column */}
        <div className="xl:col-span-3 col-span-12">
          {/* Kalender Jadwal Tanam */}
          <KalenderJadwalTanam jadwalTanams={jadwalTanams} />

          {/* Ringkasan per Komoditas */}
          <RingkasanKomoditas jadwalTanams={jadwalTanams} />

          {/* Catatan Card */}
          <NoteCard description="Pastikan seluruh jadwal tanam telah diverifikasi dan lahan dalam kondisi siap tanam." />
        </div>
      </div>

      {/* Modal Preview Detail Jadwal Tanam */}
      <ModalDetailJadwalTanam
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        jadwal={selectedPreviewJadwal}
        onRefresh={handleApplyFilters}
      />
    </Fragment>
  );
}
