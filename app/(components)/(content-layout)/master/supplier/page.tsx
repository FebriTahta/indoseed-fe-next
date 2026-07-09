"use client"
import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';


import { useSupplier } from '@/app/hooks/useSupplier';
import AddBtn from './component/AddBtn';
import Table from './component/Table';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';

import {SupplierData} from '@/app/types/supplier';
import EditBtn from './component/EditBtn';
import RemoveBtn from './component/RemoveBtn';
import DetailPanel, { DetailAction, TabConfig } from '../../shared/DetailPanel';
import DetailInfo from './component/DetInfo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import CrudModal from '../../shared/CrudModal';


  
export default function MasterSupplier() {
  const {
      suppliers,
      loading,
      error,
      search,
      setSearch,
      filterKategori,
      setFilterKategori,
      filterStatus,
      setFilterStatus,
      filterWilayah,
      setFilterWilayah,
      viewed,
      setViewed,
      isDetailLoading,
      setIsDetailLoading,
      activeDetailTab,
      setActiveDetailTab,
      currentPage,
      setCurrentPage,
      pageSize,
      setPageSize,
      totalRecords,
      setTotalRecords,
      totalPages,
      setTotalPages,
      kategoriOptions,
      statusOptions,
      isTableLoading,
      isModalOpen,
      setIsModalOpen,
      isSubmitLoading,
      setIsSubmitLoading,
      handleResetFilters,
      handleOpenAddModal,
      handleExportData,
      handleAdd,
      handleEdit,
      handleDelete,
      handleOpenEditModal,
      handleSaveModal,
      handleToggleStatus,
      modalMode,
      setModalMode,
      formValues,
      setFormValues,
      statItems
  } = useSupplier();

  
const CATEGORY_COLORS: Record<string, string> = {
  'benih': 'success',
};

const CATEGORY_LABEL: Record<string, string> = {
  'benih': 'Supplier Benih',

};

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
    },
  ];

  // Render Row for DataTable
  const renderTableRow = (item: SupplierData, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewed && viewed.kodeSupplier === item.kodeSupplier;
    return (
      <tr className="border-b border-defaultborder" key={item.id}>
          <td>{index + 1}</td>
          <td>{item.kodeSupplier}</td>
          <td>{item.namaSupplier}</td>
          <td>
            <span className={`badge bg-${CATEGORY_COLORS[item.kategori] || 'default'}/10 text-${CATEGORY_COLORS[item.kategori] || 'default'}`}>
                {CATEGORY_LABEL[item.kategori] || item.kategori}
            </span>
            
          </td>
          <td>
              <span className={`badge ${item.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                  {item.status === 'Aktif' ? 'Active' : 'Non active'}
              </span>
          </td>
          <td>
              <EditBtn id={item.kodeSupplier} onClick={handleEdit} />
              <RemoveBtn id={item.kodeSupplier} onClick={handleDelete} />
          </td>
      </tr>
    );
  };

  // Detail Panel Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'kontak', label: 'Kontak' },
    { id: 'riwayat', label: 'Riwayat Pembelian' },
    { id: 'note', label: 'Catatan' }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Supplier', 'Nama Supplier', 'Kategori', 'Status', 'Aksi'];

  const detailActions: DetailAction[] = viewed ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewed),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewed.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewed),
      icon: 'ri-shut-down-line',
      className: viewed.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewed) return null;
    switch (tabId) {
      case 'info':
        return (
          <DetailInfo viewed={viewed} />
        );
      case 'kondisi':
        return (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-temp-hot-line text-lg text-red-500"></i> Suhu Udara
              </span>
              <span className="text-sm font-bold text-gray-800">27.8 °C</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-contrast-drop-line text-lg text-blue-500"></i> Kelembapan Udara
              </span>
              <span className="text-sm font-bold text-gray-800">72%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-flask-line text-lg text-purple-500"></i> Keasaman Tanah (pH)
              </span>
              <span className="text-sm font-bold text-gray-800">6.4 pH</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
              <span className="text-xs text-textmuted font-semibold flex items-center gap-1.5">
                <i className="ri-pin-distance-line text-lg text-emerald-500"></i> Sistem Irigasi
              </span>
              <span className="text-xs font-semibold bg-success/15 text-success rounded px-2 py-0.5">Otomatis - Aktif</span>
            </div>
          </div>
        );
      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Musim Panen Terakhir:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Musim Tanam II - Ceri</p>
                  <span className="text-[10px] text-textmuted">Hasil panen melimpah</span>
                </div>
                <span className="font-bold text-emerald-600">950 Kg</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Musim Tanam I - Roma</p>
                  <span className="text-[10px] text-textmuted">Panen akhir tahun 2025</span>
                </div>
                <span className="font-bold text-emerald-600">1.2 Ton</span>
              </div>
            </div>
          </div>
        );
      case 'dokumen':
        return (
          <div className="space-y-3 py-1">
            <div className="p-2.5 border border-defaultborder/60 hover:bg-gray-50 rounded flex items-center justify-between gap-3 text-xs cursor-pointer group">
              <div className="flex items-center gap-2 overflow-hidden">
                <i className="ri-file-pdf-fill text-red-500 text-lg flex-shrink-0"></i>
                <span className="truncate font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Sertifikat Lahan Prima 1.pdf</span>
              </div>
              <i className="ri-download-line text-textmuted group-hover:text-emerald-600 text-sm"></i>
            </div>
            <div className="p-2.5 border border-defaultborder/60 hover:bg-gray-50 rounded flex items-center justify-between gap-3 text-xs cursor-pointer group">
              <div className="flex items-center gap-2 overflow-hidden">
                <i className="ri-file-pdf-fill text-red-500 text-lg flex-shrink-0"></i>
                <span className="truncate font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">SOP Budidaya Tomat.pdf</span>
              </div>
              <i className="ri-download-line text-textmuted group-hover:text-emerald-600 text-sm"></i>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  

  if (error) {
      return <div className="p-4 text-center text-danger">{error}</div>;
  }

  return (
    <Fragment>
        <Pageheader title="Master Data" 
          currentpage="Master Supplier" 
          activepage="Supplier" 
          mainpage="Supplier" 
          description="Kelola Data Supplier" 
          customButton={
              <SpkButton
                {...({
                  onclickfunc: handleOpenAddModal,
                  style: { backgroundColor: '#078836', color: 'white' },
                  className: "hover:bg-[#06732d] hover:text-white",
                  customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
                } as any)}
              >
                <i className="ri-add-line text-lg"></i> Tambah Supplier
              </SpkButton>
            } />
        
        {/* Summary Cards */}
        <StatsWidgets items={statItems} />

        <div className="grid grid-cols-12 gap-x-6">
          {/* Left Side (Table & Filters) */}
          <div className={viewed ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
            {/* Filters Bar */}
            <FilterRow
              search={search}
              onSearchChange={(val) => { setSearch(val); }}
              searchPlaceholder="Cari gudang..."
              selectFilters={filterConfig}
              onReset={handleResetFilters}
              onExport={handleExportData}
            />
  
            {/* Table list with pagination */}
            <DataTable
              headers={tableHeaders}
              items={suppliers}
              renderRow={renderTableRow}
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              totalRecords={totalRecords}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              emptyMessage="Tidak ada data customer yang cocok dengan filter pencarian."
              isLoading={loading}
            />
          </div>
  
          {/* Right Side (Detail Panel) */}
          {viewed && (
            <div className="xl:col-span-4 col-span-12">
              <DetailPanel
                title="Detail Gudang"
                onClose={() => setViewed(null)}
                statusLabel={viewed.status}
                statusBgClass={
                  viewed.status === 'Aktif'
                    ? 'bg-success'
                    : viewed.status === 'Maintenance'
                      ? 'bg-danger'
                      : 'bg-gray-500'
                }
                primaryTitle={viewed.namaSupplier}
                secondaryTitle={viewed.kodeSupplier}
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
          title={modalMode === 'add' ? 'Tambah Supplier' : 'Ubah Data Supplier'}
          onSubmit={handleSaveModal}
          submitText="Simpan Data"
          cancelText="Batal"
          isLoading={isSubmitLoading}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Supplier</label>
              <input
                type="text"
                value={formValues.id}
                onChange={(e) => setFormValues(prev => ({ ...prev, id: e.target.value }))}
                className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
                placeholder="SUP-XXX"
                required
                disabled={isSubmitLoading}
              />
            </div>
  
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Supplier</label>
              <input
                type="text"
                value={formValues.namaSupplier}
                onChange={(e) => setFormValues(prev => ({ ...prev, namaSupplier: e.target.value }))}
                className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
                placeholder="Contoh: John Doe"
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
                onChange={(e) => {
                  const val = e.target.value as SupplierData['kategori'];
                  setFormValues(prev => ({
                    ...prev,
                    kategori: val
                  }));
                }}
                className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
                disabled={isSubmitLoading}
              >
                {Object.entries(CATEGORY_LABEL).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
                
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat</label>
              <textarea 
                className="form-control -full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500" 
                value={formValues.alamat}
                onChange={(e) => setFormValues(prev => ({ ...prev, alamat: e.target.value }))} 
                id="text-area" 
                rows={3} 
                placeholder="Contoh: Jl. Raya Surabaya No. 123"
                disabled={isSubmitLoading}
                />
            </div>

          </div>



        </CrudModal>
    </Fragment>
  );
}
