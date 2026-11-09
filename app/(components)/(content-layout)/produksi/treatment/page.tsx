"use client";

import React from 'react';
import useTreatment from '@/app/hooks/useTreatment';
import HeaderSection from './component/HeaderSection';
import StatsCards from './component/StatsCards';
import FilterBar from './component/FilterBar';
import DaftarTreatmentTable from './component/DaftarTreatmentTable';
import DetailTreatmentPanel from './component/DetailTreatmentPanel';
import GrafikProsesTreatmentCard from './component/GrafikProsesTreatmentCard';
import MetodeTreatmentDonutCard from './component/MetodeTreatmentDonutCard';
import BahanTreatmentTerbanyakCard from './component/BahanTreatmentTerbanyakCard';
import ModalTambahTreatment from './component/ModalTambahTreatment';
import ModalLihatDokumentasiTreatment from './component/ModalLihatDokumentasiTreatment';
import TreatmentDeleteModal from './component/TreatmentDeleteModal';

export default function TreatmentPage() {
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
    itemToDelete,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenDocModal,
    handleCloseModals,
    handleSubmitCreate,
    handleSubmitUpdate,
    handleSubmitDelete,
  } = useTreatment();

  return (
    <div className="p-4 sm:p-6 space-y-4 animate-fadeIn">
      {/* 1. Header Section: Title, Subtitle & "+ Tambah Proses Treatment" button */}
      <HeaderSection onOpenAddModal={handleOpenAddModal} />

      {/* 2. Top Summary KPI Cards (5 Cards in 1 Row) */}
      <StatsCards stats={stats} />

      {/* 3. Search and Filter Bar */}
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
        onExport={() => alert('Fitur Export Data Treatment')}
      />

      {/* 4. Main Section: 2 Columns (Left: Table 8 cols, Right: Detail Process Panel 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 cols): Data Proses Treatment Table */}
        <div className="lg:col-span-8">
          <DaftarTreatmentTable
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

        {/* Right Column (4 cols): Detail Treatment Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <DetailTreatmentPanel
            item={selectedDetailItem}
            onOpenDocModal={() => handleOpenDocModal(selectedDetailItem || undefined)}
          />
        </div>
      </div>

      {/* 5. Bottom Section: 3 Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Grafik Proses Treatment (kg) */}
        <GrafikProsesTreatmentCard data={stats.grafikProsesTreatment} />

        {/* Card 2: Metode Treatment Donut */}
        <MetodeTreatmentDonutCard
          data={stats.chartMetodeTreatment}
          totalBatch={stats.totalBatch}
        />

        {/* Card 3: Bahan Treatment Terbanyak Ranking Bars */}
        <BahanTreatmentTerbanyakCard data={stats.chartBahanTerbanyak} />
      </div>

      {/* 6. Modals */}
      {/* Modal Tambah / Edit Treatment */}
      <ModalTambahTreatment
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={async (payload) => {
          if (itemToEdit) {
            await handleSubmitUpdate(payload);
          } else {
            await handleSubmitCreate(payload);
          }
        }}
        editingItem={itemToEdit}
        referensiGudangBahan={referensiGudangBahan}
        isSaving={isSaving}
      />

      {/* Modal Lihat Dokumentasi Foto */}
      <ModalLihatDokumentasiTreatment
        isOpen={isDocModalOpen}
        onClose={handleCloseModals}
        item={selectedDetailItem}
      />

      {/* Modal Konfirmasi Hapus */}
      <TreatmentDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleSubmitDelete}
        item={itemToDelete}
      />
    </div>
  );
}
