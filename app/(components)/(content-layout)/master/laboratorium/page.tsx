"use client"
import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';

import { useLaboratorium } from '@/app/hooks/useLaboratorium';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import { LaboratoriumData } from '@/app/types/laboratorium';

import { TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';
import DetailPanel, { DetailAction, TabConfig } from '../../shared/DetailPanel';
import DetailInfo, { DetailItem } from '../../shared/DetailInfo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import CrudModal from '../../shared/CrudModal';

export default function MasterLaboratorium() {
  const {
    laboratoriums,
    loading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    viewed,
    setViewed,
    isDetailLoading,
    activeDetailTab,
    setActiveDetailTab,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    statusOptions,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    handleResetFilters,
    handleOpenAddModal,
    handleExportData,
    handleEdit,
    handleDelete,
    handleOpenEditModal,
    handleSaveModal,
    handleToggleStatus,
    modalMode,
    formValues,
    setFormValues,
    statItems
  } = useLaboratorium();

  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-40'
    },
  ];

  const renderTableRow = (item: LaboratoriumData, index: number) => {
    return (
      <tr className="border-b border-defaultborder" key={item.id}>
        <td>{index + 1}</td>
        <td>{item.kodeLaboratorium}</td>
        <td>{item.namaLaboratorium}</td>
        <td>{item.telepon || '-'}</td>
        <td>
          <span className={`badge ${item.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            {item.status}
          </span>
        </td>
        <td>
          <TableEditBtn id={item.kodeLaboratorium} onClick={handleEdit} />
          <TableRemoveBtn id={item.kodeLaboratorium} onClick={handleDelete} />
        </td>
      </tr>
    );
  };

  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
  ];

  const tableHeaders = ['No', 'Kode Lab', 'Nama Lab', 'Telepon', 'Status', 'Aksi'];

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

    const infoItems: DetailItem[] = [
      { label: 'Kode Laboratorium', value: viewed.kodeLaboratorium },
      { label: 'Nama Laboratorium', value: viewed.namaLaboratorium },
      { label: 'Deskripsi', value: viewed.deskripsi || '-' },
      { label: 'Telepon', value: viewed.telepon || '-' },
      { label: 'Lembaga Akreditasi', value: viewed.lembagaAkreditasi || '-' },
      { label: 'Nomor Akreditasi', value: viewed.nomorAkreditasi || '-' },
      { label: 'Ruang Lingkup', value: viewed.ruangLingkupPengujian || '-' },
      { label: 'Alamat', value: viewed.alamat || '-' },
    ];

    switch (tabId) {
      case 'info':
        return <DetailInfo items={infoItems} layout="stack" />;
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
        currentpage="Master Laboratorium"
        activepage="Laboratorium"
        mainpage="Laboratorium"
        description="Kelola Data Laboratorium"
      />

      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        <div className={viewed ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari lab..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
            onAdd={handleOpenAddModal}
            addLabel="Tambah Lab"
          />

          <DataTable
            headers={tableHeaders}
            items={laboratoriums}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data lab yang cocok."
            isLoading={loading}
          />
        </div>

        {viewed && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Lab"
              onClose={() => setViewed(null)}
              statusLabel={viewed.status}
              statusBgClass={viewed.status === 'Aktif' ? 'bg-success' : 'bg-gray-500'}
              primaryTitle={viewed.namaLaboratorium}
              secondaryTitle={viewed.kodeLaboratorium}
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

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Laboratorium' : 'Ubah Data Laboratorium'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Laboratorium</label>
            <input
              type="text"
              value={formValues.id}
              onChange={(e) => setFormValues(prev => ({ ...prev, id: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="LAB-XXX"
              required
              disabled={isSubmitLoading || modalMode === 'edit'}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Laboratorium</label>
            <input
              type="text"
              value={formValues.namaLaboratorium}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaLaboratorium: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Nama Laboratorium"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Telepon</label>
            <input
              type="text"
              value={formValues.telepon}
              onChange={(e) => setFormValues(prev => ({ ...prev, telepon: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="0812xxxx"
              disabled={isSubmitLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nomor Akreditasi</label>
            <input
              type="text"
              value={formValues.nomorAkreditasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, nomorAkreditasi: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="No Akreditasi"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Lembaga Akreditasi</label>
            <input
              type="text"
              value={formValues.lembagaAkreditasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, lembagaAkreditasi: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="KAN / dll"
              disabled={isSubmitLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Ruang Lingkup</label>
            <input
              type="text"
              value={formValues.ruangLingkupPengujian}
              onChange={(e) => setFormValues(prev => ({ ...prev, ruangLingkupPengujian: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Benih / Tanah"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tanggal Akreditasi</label>
            <input
              type="date"
              value={formValues.tanggalAkreditasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, tanggalAkreditasi: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              disabled={isSubmitLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Berlaku Akreditasi</label>
            <input
              type="date"
              value={formValues.tanggalBerlakuAkreditasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, tanggalBerlakuAkreditasi: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat</label>
            <textarea
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              value={formValues.alamat}
              onChange={(e) => setFormValues(prev => ({ ...prev, alamat: e.target.value }))}
              rows={2}
              placeholder="Alamat Lengkap"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              value={formValues.deskripsi}
              onChange={(e) => setFormValues(prev => ({ ...prev, deskripsi: e.target.value }))}
              rows={2}
              placeholder="Deskripsi"
              disabled={isSubmitLoading}
            />
          </div>
        </div>
      </CrudModal>
    </Fragment>
  );
}
