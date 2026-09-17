"use client"
import React, { Fragment } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import DetailPanel, { TabConfig, DetailAction } from '../../shared/DetailPanel';
import CrudModal from '../../shared/CrudModal';
import ImageUpload from '../../shared/ImageUpload';
import { TableViewBtn, TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';

import { Commodity } from '@/app/types/commodity';
import { useKomoditas } from '@/app/hooks/useKomoditas';

const CATEGORY_COLORS: Record<string, string> = {
  'Serealia': 'success',
  'Legum': 'warning',
  'Umbi': 'primary',
  'Hortikultura': 'danger'
};

const CATEGORY_ICONS: Record<string, string> = {
  'Serealia': 'ri-leaf-line',
  'Legum': 'ri-seedling-line',
  'Umbi': 'ri-plant-line',
  'Hortikultura': 'ri-seedling-fill'
};

export default function KomoditasPage() {
  const {
    loading,
    error,
    commodities,
    isTableLoading,
    stats,
    statItems,
    kategoriOptions,
    statusOptions,
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedCommodity,
    setViewedCommodity,
    isDetailLoading,
    activeDetailTab,
    setActiveDetailTab,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    modalMode,
    formValues,
    setFormValues,
    previewUrl,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSaveModal,
    handleDeleteCommodity,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
  } = useKomoditas();

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterKategori,
      onChange: (val: any) => { setFilterKategori(val); setCurrentPage(1); },
      options: kategoriOptions,
      placeholder: 'Kategori',
      widthClass: 'sm:w-44'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-40'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Komoditas', 'Nama Komoditas', 'Kategori', 'Deskripsi', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Commodity, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedCommodity && viewedCommodity.id === item.id;
    const categoryColor = CATEGORY_COLORS[item.kategori] || 'gray';
    const categoryIcon = CATEGORY_ICONS[item.kategori] || 'ri-seedling-line';

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeKomoditas}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.namaKomoditas} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-${categoryColor}/10 text-${categoryColor}`}>
                <i className={`${categoryIcon} text-lg`}></i>
              </div>
            )}
          </div>
          <span className="text-gray-800 font-semibold">{item.namaKomoditas}</span>
        </td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold bg-${categoryColor}/10 text-${categoryColor}`}>
            {item.kategori}
          </span>
        </td>
        <td className="p-4 max-w-xs truncate text-gray-500" title={item.deskripsi}>
          {item.deskripsi || '-'}
        </td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : 'bg-danger/10 text-danger'
            }`}>
            {item.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center">
            <TableViewBtn id={item.id} onClick={() => handleViewDetail(item)} />
            <TableEditBtn id={item.id} onClick={() => handleOpenEditModal(item)} />
            <TableRemoveBtn id={item.id} onClick={() => handleDeleteCommodity(item.id)} />
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'riwayat', label: 'Riwayat' }
  ];

  const detailActions: DetailAction[] = viewedCommodity ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedCommodity),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewedCommodity.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedCommodity),
      icon: 'ri-shut-down-line',
      className: viewedCommodity.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-55'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedCommodity) return null;
    switch (tabId) {
      case 'info':
        const categoryColor = CATEGORY_COLORS[viewedCommodity.kategori] || 'gray';
        const categoryIcon = CATEGORY_ICONS[viewedCommodity.kategori] || 'ri-seedling-line';

        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kode Komoditas</div>
            <div className="col-span-8 py-1 font-mono text-gray-800 flex items-center">
              <span className="mr-2 text-gray-700">:</span>{viewedCommodity.kodeKomoditas}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Nama Komoditas</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.namaKomoditas}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kategori</div>
            <div className="col-span-8 py-1 font-semibold text-emerald-600 flex items-center gap-1">
              <span className="mr-2 text-gray-700">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] bg-${categoryColor}/10 text-${categoryColor}`}>
                {viewedCommodity.kategori}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Deskripsi</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-2">:</span>{viewedCommodity.deskripsi || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewedCommodity.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
                }`}>
                {viewedCommodity.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.tglDibuat ? new Date(viewedCommodity.tglDibuat).toLocaleDateString('id-ID') + ' ' + new Date(viewedCommodity.tglDibuat).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.dibuatOleh || 'Admin'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Diubah</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.tglDiubah ? new Date(viewedCommodity.tglDiubah).toLocaleDateString('id-ID') + ' ' + new Date(viewedCommodity.tglDiubah).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Diubah Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedCommodity.diubahOleh || 'Admin'}
            </div>

            <div className="col-span-12 py-2">
              <p className="font-semibold text-textmuted mb-2">Gambar / Ikon</p>
              <div className="w-20 h-20 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                {viewedCommodity.image ? (
                  <img src={viewedCommodity.image} alt={viewedCommodity.namaKomoditas} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-${categoryColor}/10 text-${categoryColor}`}>
                    <i className={`${categoryIcon} text-2xl`}></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Riwayat Produktivitas Musim:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Diisi Apa Ini</p>
                  <span className="text-[10px] text-textmuted">Hasil panen di seluruh unit greenhouse memuaskan</span>
                </div>
                <span className="font-bold text-emerald-600">850 Kg</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Musim Tanam Genap 2024</p>
                  <span className="text-[10px] text-textmuted">Suhu rata-rata stabil, produktivitas normal</span>
                </div>
                <span className="font-bold text-emerald-600">780 Kg</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Auth loading / error states
  if (error) {
    return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <span className="text-sm font-semibold text-gray-600">Memeriksa autentikasi...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Seo title="Komoditas" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Komoditas"
        activepage="Komoditas"
        description="Kelola master data komoditas perusahaan"
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedCommodity ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari komoditas..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
            onAdd={handleOpenAddModal}
            addLabel="Tambah Komoditas"
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={commodities}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data komoditas yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewedCommodity && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Komoditas"
              onClose={() => setViewedCommodity(null)}
              imageUrl={viewedCommodity.image}
              imageAlt={viewedCommodity.namaKomoditas}
              statusLabel={viewedCommodity.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              statusBgClass={viewedCommodity.status === 'Aktif' ? 'bg-success' : 'bg-danger'}
              primaryTitle={viewedCommodity.namaKomoditas}
              secondaryTitle={viewedCommodity.kodeKomoditas}
              tabs={detailTabs}
              activeTab={activeDetailTab}
              onTabChange={setActiveDetailTab}
              renderTabContent={renderDetailTabContent}
              actions={detailActions}
              isLoading={isDetailLoading}
            />
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Komoditas Baru' : 'Ubah Data Komoditas'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Komoditas</label>
            <input
              type="text"
              value={formValues.kodeKomoditas}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodeKomoditas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="KOM-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Komoditas</label>
            <input
              type="text"
              value={formValues.namaKomoditas}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaKomoditas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Padi"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori</label>
            <select
              value={formValues.kategori}
              onChange={(e) => setFormValues(prev => ({ ...prev, kategori: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Serealia">Serealia</option>
              <option value="Legum">Legum</option>
              <option value="Umbi">Umbi</option>
              <option value="Hortikultura">Hortikultura</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Commodity['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Non Aktif</option>
            </select>
          </div>
        </div>

        <div>
          <ImageUpload
            label="Foto Komoditas"
            imageUrl={previewUrl}
            onImageChange={handleFileChange}
            disabled={isSubmitLoading}
            className="mb-4"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea
            value={formValues.deskripsi}
            onChange={(e) => setFormValues(prev => ({ ...prev, deskripsi: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Keterangan mengenai komoditas ini..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
