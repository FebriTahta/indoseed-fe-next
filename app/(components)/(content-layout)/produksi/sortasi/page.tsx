"use client";

import React from 'react';
import useSortasi from '@/app/hooks/useSortasi';
import HeaderSection from './component/HeaderSection';
import StatsCards from './component/StatsCards';
import FilterBar from './component/FilterBar';
import DaftarSortasiTable from './component/DaftarSortasiTable';
import DetailSortasiPanel from './component/DetailSortasiPanel';
import GrafikHasilSortasiCard from './component/GrafikHasilSortasiCard';
import PerbandinganKualitasCard from './component/PerbandinganKualitasCard';
import InformasiSortasiCard from './component/InformasiSortasiCard';
import ModalTambahSortasi from './component/ModalTambahSortasi';
import SortasiDeleteModal from './component/SortasiDeleteModal';
import ModalLihatDokumentasi from './component/ModalLihatDokumentasi';

export default function SortasiPage() {
  const {
    batchList,
    stats,
    referensiGudangBahan,
    loading,
    isSaving,
    // Selection
    selectedDetailItem,
    handleSelectBatch,
    selectedIds,
    handleToggleSelectId,
    handleSelectAll,
    // Filters
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterStatus,
    setFilterStatus,
    komoditasOptions,
    statusOptions,
    periodeOptions,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Modals & Actions
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    isDocModalOpen,
    itemToEdit,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenDocModal,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitUpdate,
    handleSubmitDelete,
  } = useSortasi();

  return (
    <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
      {/* 1. Header Section: Title, Subtitle, Date filter & Add Button */}
      <HeaderSection onOpenAddModal={handleOpenAddModal} />

      {/* 2. Top Summary KPI Cards (5 Cards in 1 Row) */}
      <StatsCards stats={stats} />

      {/* 3. Filter and Search Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filterPeriode={filterPeriode}
        onPeriodeChange={setFilterPeriode}
        periodeOptions={periodeOptions}
        filterKomoditas={filterKomoditas}
        onKomoditasChange={setFilterKomoditas}
        komoditasOptions={komoditasOptions}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        statusOptions={statusOptions}
        onReset={handleResetFilters}
        onExport={() => alert('Fitur Export Laporan Sortasi')}
      />

      {/* 4. Main Section: 2 Columns (Left: Table, Right: Detail Process Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 cols): Data Proses Sortasi Table */}
        <div className="lg:col-span-8">
          <DaftarSortasiTable
            items={batchList}
            isLoading={loading}
            selectedItem={selectedDetailItem}
            onSelectBatch={handleSelectBatch}
            selectedIds={selectedIds}
            onToggleSelectId={handleToggleSelectId}
            onSelectAll={handleSelectAll}
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
          />
        </div>

        {/* Right Column (4 cols): Detail Proses Sortasi Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <DetailSortasiPanel
            item={selectedDetailItem}
            onOpenDocModal={handleOpenDocModal}
            onPrint={() => window.print()}
          />
        </div>
      </div>

      {/* 5. Bottom Section: 3 Analytics Cards (Grafik Hasil Sortasi, Perbandingan Kualitas, Informasi ISO) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GrafikHasilSortasiCard data={stats.chartHasilSortasi} />
        <PerbandinganKualitasCard data={stats.chartTrenKualitas} />
        <InformasiSortasiCard />
      </div>

      {/* 6. Modals */}
      <ModalTambahSortasi
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={async (payload) => {
          if (itemToEdit) {
            await handleSubmitUpdate(payload);
          } else {
            await handleSubmitCreate(payload);
          }
        }}
        referensiGudangBahan={referensiGudangBahan}
        editingItem={itemToEdit}
        isSaving={isSaving}
      />

      <SortasiDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={itemToEdit}
      />

      <ModalLihatDokumentasi
        isOpen={isDocModalOpen}
        onClose={handleCloseModals}
        item={selectedDetailItem}
      />
    </div>
  );
}
