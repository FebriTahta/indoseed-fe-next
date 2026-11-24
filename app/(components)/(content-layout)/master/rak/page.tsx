"use client";

import React, { Fragment } from 'react';
import Pageheader from '../../../../../shared/layouts-components/page-header/pageheader';
import { useRak } from '@/app/hooks/useRak';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import { RakData } from '@/app/types/rak';
import { TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';
import DetailPanel, { DetailAction, TabConfig } from '../../shared/DetailPanel';
import DetailInfo, { DetailItem } from '../../shared/DetailInfo';
import CrudModal from '../../shared/CrudModal';

export default function MasterRak() {
  const {
    raks,
    loading,
    error,
    search,
    setSearch,
    filterKategori,
    setFilterKategori,
    filterStatus,
    setFilterStatus,
    filterGudang,
    setFilterGudang,
    gudangOptions,
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
    kategoriOptions,
    statusOptions,
    isTableLoading,
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
    statItems,
  } = useRak();

  const CATEGORY_COLORS: Record<string, string> = {
    benih: 'success',
    packing: 'primary',
    treatment: 'secondary',
    umum: 'info',
  };

  const CATEGORY_LABEL: Record<string, string> = {
    benih: 'Rak Benih',
    packing: 'Rak Packing',
    treatment: 'Rak Bahan Treatment',
    umum: 'Rak Umum',
  };

  // Filter Configurations
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterGudang,
      onChange: (val: any) => {
        setFilterGudang(val);
        setCurrentPage(1);
      },
      options: gudangOptions,
      placeholder: 'Semua Gudang',
      widthClass: 'sm:w-52',
    },
    {
      value: filterKategori,
      onChange: (val: any) => {
        setFilterKategori(val);
        setCurrentPage(1);
      },
      options: kategoriOptions,
      placeholder: 'Semua Kategori',
      widthClass: 'sm:w-44',
    },
    {
      value: filterStatus,
      onChange: (val: any) => {
        setFilterStatus(val);
        setCurrentPage(1);
      },
      options: statusOptions,
      placeholder: 'Semua Status',
      widthClass: 'sm:w-40',
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No',
    'Kode Rak',
    'Nama Rak',
    'Gudang',
    'Posisi (B-K-L)',
    'Kapasitas',
    'Kategori',
    'Status',
    'Aksi',
  ];

  // Render Table Row
  const renderTableRow = (item: RakData, index: number) => {
    const isSelected = viewed && (viewed.kodeRak === item.kodeRak || viewed.id === item.id);
    const rowNumber = (currentPage - 1) * pageSize + index + 1;

    return (
      <tr
        className={`border-b border-defaultborder transition-colors cursor-pointer ${
          isSelected ? 'bg-emerald-50/40' : 'hover:bg-gray-50/80'
        }`}
        key={item.id}
        onClick={() => setViewed(item)}
      >
        <td className="text-center">{rowNumber}</td>
        <td className="font-mono font-semibold text-emerald-700">{item.kodeRak}</td>
        <td className="font-medium text-gray-900">{item.namaRak}</td>
        <td>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{item.namaGudang || item.gudang?.namaGudang || '-'}</span>
            <span className="text-[10px] text-gray-400 font-mono">{item.kodeGudang || item.gudang?.kodeGudang || ''}</span>
          </div>
        </td>
        <td className="text-center">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {item.baris || '-'}-{item.kolom || '-'}-{item.level || '-'}
          </span>
        </td>
        <td className="font-semibold text-gray-800">
          {(item.kapasitas || 0).toLocaleString('id-ID')} <span className="text-[10px] text-gray-400 font-normal">kg</span>
        </td>
        <td>
          <span
            className={`badge bg-${CATEGORY_COLORS[item.kategori] || 'default'}/10 text-${
              CATEGORY_COLORS[item.kategori] || 'default'
            }`}
          >
            {CATEGORY_LABEL[item.kategori] || item.kategori}
          </span>
        </td>
        <td>
          <span
            className={`badge ${
              item.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : item.status === 'Penuh'
                ? 'bg-primary/10 text-primary'
                : item.status === 'Maintenance'
                ? 'bg-warning/10 text-warning'
                : 'bg-danger/10 text-danger'
            }`}
          >
            {item.status}
          </span>
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <TableEditBtn id={item.kodeRak} onClick={() => handleEdit(item.kodeRak)} />
            <TableRemoveBtn id={item.kodeRak} onClick={() => handleDelete(item.kodeRak)} />
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Tabs
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'utilisasi', label: 'Utilisasi Rak' },
    { id: 'riwayat', label: 'Riwayat Muatan' },
    { id: 'note', label: 'Catatan' },
  ];

  const detailActions: DetailAction[] = viewed
    ? [
        {
          label: 'Edit Data',
          onClick: () => handleOpenEditModal(viewed),
          icon: 'ri-edit-line',
          className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50',
        },
        {
          label: viewed.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
          onClick: () => handleToggleStatus(viewed),
          icon: 'ri-shut-down-line',
          className:
            viewed.status === 'Aktif'
              ? 'border border-red-500 text-red-500 hover:bg-red-50'
              : 'border border-success text-success hover:bg-emerald-50',
        },
      ]
    : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewed) return null;
    switch (tabId) {
      case 'info':
        const infoItems: DetailItem[] = [
          { label: 'Kode Rak', value: viewed.kodeRak },
          { label: 'Nama Rak', value: viewed.namaRak },
          { label: 'Gudang Penempatan', value: `${viewed.namaGudang || '-'} (${viewed.kodeGudang || '-'})` },
          { label: 'Kategori Rak', value: CATEGORY_LABEL[viewed.kategori] || viewed.kategori },
          { label: 'Kapasitas Maksimal', value: `${(viewed.kapasitas || 0).toLocaleString('id-ID')} kg` },
          { label: 'Posisi Grid', value: `Baris ${viewed.baris || '-'}, Kolom ${viewed.kolom || '-'}, Level ${viewed.level || '-'}` },
          {
            label: 'Tanggal Didaftarkan',
            value: viewed.createdAt ? new Date(viewed.createdAt).toLocaleDateString('id-ID') : '-',
          },
          {
            label: 'Status Rak',
            value: (
              <span
                className={`badge rounded font-bold px-2 py-0.5 text-[11px] ${
                  viewed.status === 'Aktif'
                    ? 'bg-success/10 text-success'
                    : viewed.status === 'Penuh'
                    ? 'bg-primary/10 text-primary'
                    : viewed.status === 'Maintenance'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-danger/10 text-danger'
                }`}
              >
                {viewed.status}
              </span>
            ),
          },
        ];
        return <DetailInfo items={infoItems} layout="grid" />;

      case 'utilisasi':
        return (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-700">Estimasi Keterisian Rak</span>
                <span className="text-xs font-bold text-emerald-700">65% (Terisi)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>Terpakai: ~{Math.round((viewed.kapasitas || 1000) * 0.65).toLocaleString('id-ID')} kg</span>
                <span>Kapasitas: {(viewed.kapasitas || 1000).toLocaleString('id-ID')} kg</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
                <span className="text-[11px] text-gray-500 block">Kondisi Sanitasi</span>
                <span className="text-sm font-bold text-gray-800">Bersih &amp; Kering</span>
              </div>
              <div className="p-2.5 bg-gray-50 border border-defaultborder/60 rounded">
                <span className="text-[11px] text-gray-500 block">Inspeksi Terakhir</span>
                <span className="text-sm font-bold text-gray-800">20 Nov 2026</span>
              </div>
            </div>
          </div>
        );

      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Riwayat Muatan Terakhir:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-2.5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 font-mono text-[11px]">LOT-2026-0015</p>
                  <span className="text-[10px] text-gray-500">Inpari 32 (BS) - Lolos QC</span>
                </div>
                <span className="font-bold text-emerald-600">5.000 kg</span>
              </div>
              <div className="p-2.5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800 font-mono text-[11px]">LOT-2026-0016</p>
                  <span className="text-[10px] text-gray-500">Ciherang (BS) - Siap Distribusi</span>
                </div>
                <span className="font-bold text-emerald-600">3.200 kg</span>
              </div>
            </div>
          </div>
        );

      case 'note':
        return (
          <div className="p-3 bg-gray-50 border border-defaultborder/80 rounded-lg text-xs">
            <span className="font-semibold text-gray-700 block mb-1">Catatan Khusus Rak:</span>
            <p className="text-gray-600 leading-relaxed">
              {viewed.keterangan || 'Tidak ada catatan khusus untuk rak ini.'}
            </p>
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
      <Pageheader
        title="Master Data"
        currentpage="Master Rak"
        activepage="Rak"
        mainpage="Rak"
        description="Kelola Data Rak &amp; Penyimpanan Gudang"
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewed ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => setSearch(val)}
            searchPlaceholder="Cari rak, kode, gudang..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
            onAdd={handleOpenAddModal}
            addLabel="Tambah Rak"
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={raks}
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
            emptyMessage="Tidak ada data rak yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewed && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Rak Penyimpanan"
              onClose={() => setViewed(null)}
              statusLabel={viewed.status}
              statusBgClass={
                viewed.status === 'Aktif'
                  ? 'bg-success'
                  : viewed.status === 'Penuh'
                  ? 'bg-primary'
                  : viewed.status === 'Maintenance'
                  ? 'bg-warning'
                  : 'bg-gray-500'
              }
              primaryTitle={viewed.namaRak}
              secondaryTitle={viewed.kodeRak}
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
        title={modalMode === 'add' ? 'Tambah Rak Baru' : 'Ubah Data Rak'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Kode Rak <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formValues.id}
              onChange={(e) => setFormValues((prev) => ({ ...prev, id: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono uppercase"
              placeholder="Contoh: RAK-BNH-01"
              required
              disabled={isSubmitLoading || modalMode === 'edit'}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Nama Rak <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formValues.namaRak}
              onChange={(e) => setFormValues((prev) => ({ ...prev, namaRak: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Rak Benih Padi A1"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Gudang Penempatan</label>
            <select
              value={formValues.kodeGudang}
              onChange={(e) => {
                const selectedCode = e.target.value;
                const foundG = gudangOptions.find((g) => g.value === selectedCode);
                setFormValues((prev) => ({
                  ...prev,
                  kodeGudang: selectedCode,
                  namaGudang: foundG ? foundG.label.split(' (')[0] : '',
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="">Pilih Gudang...</option>
              {gudangOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori Rak</label>
            <select
              value={formValues.kategori}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  kategori: e.target.value as RakData['kategori'],
                }))
              }
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

        <div className="grid grid-cols-4 gap-3 mt-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kapasitas (kg)</label>
            <input
              type="number"
              value={formValues.kapasitas}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, kapasitas: Number(e.target.value) || 0 }))
              }
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="1000"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Baris</label>
            <input
              type="text"
              value={formValues.baris}
              onChange={(e) => setFormValues((prev) => ({ ...prev, baris: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono text-center uppercase"
              placeholder="A"
              maxLength={4}
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kolom</label>
            <input
              type="text"
              value={formValues.kolom}
              onChange={(e) => setFormValues((prev) => ({ ...prev, kolom: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono text-center"
              placeholder="1"
              maxLength={4}
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Level / Tingkat</label>
            <input
              type="text"
              value={formValues.level}
              onChange={(e) => setFormValues((prev) => ({ ...prev, level: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono text-center"
              placeholder="1"
              maxLength={4}
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Rak</label>
            <select
              value={formValues.status}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  status: e.target.value as RakData['status'],
                }))
              }
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Keterangan</label>
            <input
              type="text"
              value={formValues.keterangan}
              onChange={(e) => setFormValues((prev) => ({ ...prev, keterangan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Keterangan tambahan..."
              disabled={isSubmitLoading}
            />
          </div>
        </div>
      </CrudModal>
    </Fragment>
  );
}
