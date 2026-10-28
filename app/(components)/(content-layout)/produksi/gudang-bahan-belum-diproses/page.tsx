"use client";

import React from 'react';
import useGudangBahanBelumDiproses from '@/app/hooks/useGudangBahanBelumDiproses';
import HeaderSection from './component/HeaderSection';
import StatsCards from './component/StatsCards';
import FilterBar from './component/FilterBar';
import DaftarGudangTable from './component/DaftarGudangTable';
import DetailLotPanel from './component/DetailLotPanel';
import GrafikStokCard from './component/GrafikStokCard';
import DistribusiStatusCard from './component/DistribusiStatusCard';
import KadarAirCard from './component/KadarAirCard';
import ModalTambahPenerimaan from './component/ModalTambahPenerimaan';
import ModalPetaLokasi from './component/ModalPetaLokasi';
import ModalLihatFoto from './component/ModalLihatFoto';

export default function GudangBahanBelumDiprosesPage() {
  const {
    items,
    stats,
    referensiPanen,
    isLoading,
    isSaving,
    // Filters
    search,
    setSearch,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    filterTanggal,
    setFilterTanggal,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    totalRecords,
    totalPages,
    // Selection
    selectedItem,
    handleSelectLot,
    selectedIds,
    handleToggleSelectId,
    handleSelectAll,
    // Modals
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isMapModalOpen,
    setIsMapModalOpen,
    isPhotoModalOpen,
    setIsPhotoModalOpen,
    editingItem,
    handleOpenAddModal,
    handleOpenEditModal,
    // Actions
    handleSaveCreate,
    handleSaveUpdate,
    handleDelete,
    handleTransferToPengeringan,
  } = useGudangBahanBelumDiproses();

  return (
    <div className="p-4 sm:p-6 space-y-5 animate-fadeIn">
      {/* 1. Page Header (Breadcrumbs, Title, Subtitle, + Button) */}
      <HeaderSection onOpenAddModal={handleOpenAddModal} />

      {/* 2. Top Summary KPI Cards */}
      <StatsCards stats={stats} />

      {/* 3. Filter and Search Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filterKomoditas={filterKomoditas}
        onKomoditasChange={setFilterKomoditas}
        komoditasOptions={komoditasOptions}
        filterVarietas={filterVarietas}
        onVarietasChange={setFilterVarietas}
        varietasOptions={varietasOptions}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        statusOptions={statusOptions}
        filterTanggal={filterTanggal}
        onTanggalChange={setFilterTanggal}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Main Section: 2 Columns (Left: Table + Charts, Right: Detail Lot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (Table & Analytics) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Table */}
          <DaftarGudangTable
            items={items}
            isLoading={isLoading}
            selectedItem={selectedItem}
            onSelectLot={handleSelectLot}
            selectedIds={selectedIds}
            onToggleSelectId={handleToggleSelectId}
            onSelectAll={handleSelectAll}
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            onTransferPengeringan={handleTransferToPengeringan}
          />

          {/* 3 Analytics Cards below table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GrafikStokCard data={stats.stockChartData} />
            <DistribusiStatusCard
              distribution={stats.statusDistribution}
              totalLot={stats.totalLot}
            />
            <KadarAirCard
              rataRataKadarAir={stats.rataRataKadarAir}
              trendData={stats.kadarAirTrend}
            />
          </div>
        </div>

        {/* Right Column (Detail Lot Card) */}
        <div className="lg:col-span-4 sticky top-20">
          <DetailLotPanel
            item={selectedItem}
            onOpenMapModal={() => setIsMapModalOpen(true)}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            onEdit={handleOpenEditModal}
            onTransferPengeringan={handleTransferToPengeringan}
          />
        </div>
      </div>

      {/* 5. Modals */}
      <ModalTambahPenerimaan
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        onSave={(payload) => {
          if (editingItem) {
            handleSaveUpdate(editingItem.id, payload);
          } else {
            handleSaveCreate(payload);
          }
        }}
        isSaving={isSaving}
        referensiPanen={referensiPanen}
        editingItem={editingItem}
      />

      <ModalPetaLokasi
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        selectedLot={selectedItem}
      />

      <ModalLihatFoto
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
