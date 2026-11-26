"use client"
import React, { Fragment } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import DetailPanel, { TabConfig, DetailAction } from '../../shared/DetailPanel';
import CrudModal from '../../shared/CrudModal';
import { TableViewBtn, TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';

import { HarvestType, HarvestTypePrice } from '@/app/types/harvestType';
import { useHarvestType } from '@/app/hooks/useHarvestType';

export default function TipePanenPage() {
  const {
    loading,
    error,
    harvestTypes,
    isTableLoading,
    statusOptions,
    varietyOptions,
    search,
    setSearch,
    filterVariety,
    setFilterVariety,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedHarvestType,
    setViewedHarvestType,
    isDetailLoading,
    activeDetailTab,
    setActiveDetailTab,
    isModalOpen,
    setIsModalOpen,
    isSubmitLoading,
    modalMode,
    formValues,
    setFormValues,
    isAddPriceModalOpen,
    setIsAddPriceModalOpen,
    priceFormValues,
    setPriceFormValues,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSaveModal,
    handleDeleteHarvestType,
    handleToggleStatus,
    handleViewDetail,
    handleOpenAddPrice,
    handleSavePrice
  } = useHarvestType();

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterVariety,
      onChange: (val: any) => { setFilterVariety(val); setCurrentPage(1); },
      options: varietyOptions,
      placeholder: 'Semua Varietas',
      widthClass: 'sm:w-56'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-36'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode', 'Tipe Panen', 'Varietas', 'Harga Terkini', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: HarvestType, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedHarvestType && viewedHarvestType.id === item.id;
    
    // Get latest price
    const latestPrice = item.prices && item.prices.length > 0 ? item.prices[0] : null;
    const formattedPrice = latestPrice ? `Rp ${latestPrice.harga.toLocaleString('id-ID')}` : '-';

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-mono text-gray-800">{item.kode}</td>
        <td className="p-4 font-semibold text-gray-800">{item.nama}</td>
        <td className="p-4 text-gray-600 font-medium">
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded">
            <i className="ri-plant-line"></i>
            {item.variety?.namaVarietas || '-'}
          </span>
        </td>
        <td className="p-4 font-bold text-emerald-600">{formattedPrice}</td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : 'bg-danger/10 text-danger'
            }`}>
            {item.status}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center">
            <TableViewBtn id={item.id} onClick={() => handleViewDetail(item)} />
            <TableEditBtn id={item.id} onClick={() => handleOpenEditModal(item)} />
            <TableRemoveBtn id={item.id} onClick={() => handleDeleteHarvestType(item.id)} />
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Tabs Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'harga', label: 'Riwayat Harga' }
  ];

  const detailActions: DetailAction[] = viewedHarvestType ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedHarvestType),
      icon: 'ri-edit-line',
      className: 'bg-emerald-600 text-white hover:bg-emerald-700 font-semibold px-4 py-2 rounded flex items-center justify-center gap-2'
    },
    {
      label: viewedHarvestType.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedHarvestType),
      icon: 'ri-shut-down-line',
      className: viewedHarvestType.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50 font-semibold px-4 py-2 rounded flex items-center justify-center gap-2'
        : 'border border-success text-success hover:bg-emerald-50 font-semibold px-4 py-2 rounded flex items-center justify-center gap-2'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedHarvestType) return null;

    switch (tabId) {
      case 'info':
        return (
          <div className="grid grid-cols-12 gap-y-3.5 text-xs mt-3 text-gray-700 divide-y divide-gray-100">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Kode</div>
            <div className="col-span-8 py-1 font-mono text-gray-800 flex items-center">
              <span className="mr-3 text-gray-400">:</span>{viewedHarvestType.kode}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tipe Panen</div>
            <div className="col-span-8 py-1 font-bold text-gray-800 flex items-center">
              <span className="mr-3 text-gray-400">:</span>{viewedHarvestType.nama}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1.5 flex items-center">Varietas</div>
            <div className="col-span-8 py-1.5 font-bold text-blue-600 flex items-center">
              <span className="mr-3 text-gray-400">:</span>
              <span className="badge rounded font-bold px-2 py-0.5 text-xs bg-blue-50 text-blue-700">
                {viewedHarvestType.variety?.namaVarietas || '-'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-3 text-gray-400">:</span>
              <span className={`badge rounded font-bold px-2 py-0.5 text-xs ${viewedHarvestType.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
                }`}>
                {viewedHarvestType.status}
              </span>
            </div>
          </div>
        );
      case 'harga':
        return (
          <div className="space-y-4 text-xs py-1">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-gray-700 flex items-center gap-1.5">
                <i className="ri-money-dollar-circle-line text-emerald-600 text-sm"></i>
                Riwayat Harga
              </p>
              <button
                onClick={handleOpenAddPrice}
                className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-2 py-1 rounded font-semibold flex items-center gap-1 transition-colors"
              >
                <i className="ri-add-line"></i> Harga Baru
              </button>
            </div>

            {viewedHarvestType.prices && viewedHarvestType.prices.length > 0 ? (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                {viewedHarvestType.prices.map((price: HarvestTypePrice, idx: number) => (
                  <div key={price.id} className="p-3.5 bg-white border border-defaultborder hover:border-emerald-500/50 rounded-lg shadow-sm hover:shadow transition-all duration-200 relative">
                    {idx === 0 && (
                      <span className="absolute top-3 right-3 badge bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Aktif</span>
                    )}
                    <h4 className="font-bold text-gray-800 text-base mb-1">Rp {price.harga.toLocaleString('id-ID')}</h4>
                    <div className="text-[11px] text-gray-500 flex justify-between items-center mt-2">
                      <span className="font-medium text-gray-600">{price.keterangan || '-'}</span>
                      <span className="flex items-center gap-1">
                        <i className="ri-calendar-line"></i> {new Date(price.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 border border-dashed border-gray-200 rounded-lg bg-gray-50/30">
                <i className="ri-price-tag-3-line text-3xl mb-1.5 block text-gray-300"></i>
                Belum ada riwayat harga.
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <span className="text-sm font-semibold text-gray-600">Memeriksa autentikasi...</span>
      </div>
    </div>
  );

  return (
    <Fragment>
      <Seo title="Tipe Panen" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Pageheader
        title="Master Data"
        currentpage="Tipe Panen"
        activepage="Tipe Panen"
        description="Kelola data tipe panen dan master harga pada varietas"
      />

      <div className="grid grid-cols-12 gap-x-6">
        <div className={viewedHarvestType ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          <FilterRow
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Cari kode atau tipe panen..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onAdd={handleOpenAddModal}
            addLabel="Tambah Tipe Panen"
          />

          <DataTable
            headers={tableHeaders}
            items={harvestTypes}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data tipe panen."
            isLoading={isTableLoading}
          />
        </div>

        {viewedHarvestType && (
          <div className="xl:col-span-4 col-span-12 animate-fade-in-right">
            <DetailPanel
              title="Detail Tipe Panen"
              onClose={() => setViewedHarvestType(null)}
              statusLabel={viewedHarvestType.status}
              statusBgClass={viewedHarvestType.status === 'Aktif' ? 'bg-success' : 'bg-danger'}
              primaryTitle={viewedHarvestType.nama}
              secondaryTitle={`Kode: ${viewedHarvestType.kode}`}
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

      {/* Crud Modal (Harvest Type) */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Tipe Panen' : 'Edit Tipe Panen'}
        onSubmit={handleSaveModal}
        submitText="Simpan"
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode *</label>
            <input
              type="text"
              value={formValues.kode}
              onChange={(e) => setFormValues(prev => ({ ...prev, kode: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono uppercase"
              placeholder="Contoh: TP-001"
              required
              disabled={isSubmitLoading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Varietas *</label>
            <select
              value={formValues.varietyId}
              onChange={(e) => setFormValues(prev => ({ ...prev, varietyId: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              required
              disabled={isSubmitLoading}
            >
              <option value="" disabled>Pilih Varietas</option>
              {varietyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Tipe Panen *</label>
          <input
            type="text"
            value={formValues.nama}
            onChange={(e) => setFormValues(prev => ({ ...prev, nama: e.target.value }))}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Contoh: Gelondong / Fresh"
            required
            disabled={isSubmitLoading}
          />
        </div>

        {modalMode === 'add' && (
          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Harga Awal (Rp)</label>
            <input
              type="number"
              value={formValues.initialPrice}
              onChange={(e) => setFormValues(prev => ({ ...prev, initialPrice: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="Contoh: 12000"
              disabled={isSubmitLoading}
            />
            <p className="text-[10px] text-gray-500 mt-1">Opsional, akan otomatis tersimpan di riwayat harga.</p>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Status</label>
          <select
            value={formValues.status}
            onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as HarvestType['status'] }))}
            className="form-select w-full md:w-1/2 border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
            disabled={isSubmitLoading}
          >
            <option value="Aktif">Aktif</option>
            <option value="Non Aktif">Non Aktif</option>
          </select>
        </div>
      </CrudModal>

      {/* Add Price Modal */}
      <CrudModal
        isOpen={isAddPriceModalOpen}
        onClose={() => setIsAddPriceModalOpen(false)}
        title="Tambah Harga Baru"
        onSubmit={handleSavePrice}
        submitText="Simpan Harga"
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-md"
      >
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Harga Baru (Rp) *</label>
          <input
            type="number"
            value={priceFormValues.harga}
            onChange={(e) => setPriceFormValues(prev => ({ ...prev, harga: e.target.value }))}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono text-emerald-600 font-bold"
            placeholder="Contoh: 15000"
            required
            disabled={isSubmitLoading}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Keterangan (Opsional)</label>
          <textarea
            value={priceFormValues.keterangan}
            onChange={(e) => setPriceFormValues(prev => ({ ...prev, keterangan: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Contoh: Kenaikan harga musim kemarau..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>

    </Fragment>
  );
}
