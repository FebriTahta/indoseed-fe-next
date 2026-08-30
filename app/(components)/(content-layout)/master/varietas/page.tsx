"use client"
import React, { Fragment } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import DetailPanel, { TabConfig, DetailAction } from '../../shared/DetailPanel';
import CrudModal from '../../shared/CrudModal';
import ImageUpload from '../../shared/ImageUpload';
import { TableViewBtn, TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';

import { Variety } from '@/app/types/variety';
import { useVarietas } from '@/app/hooks/useVarietas';

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

export default function VarietasPage() {
  const {
    loading,
    error,
    varieties,
    isTableLoading,
    statItems,
    commoditiesOptions,
    statusOptions,
    search,
    setSearch,
    filterCommodity,
    setFilterCommodity,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedVariety,
    setViewedVariety,
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
    handleDeleteVariety,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
    setImageFile,
  } = useVarietas();

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterCommodity,
      onChange: (val: any) => { setFilterCommodity(val); setCurrentPage(1); },
      options: commoditiesOptions,
      placeholder: 'Komoditas',
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
  const tableHeaders = ['No', 'Kode Varietas', 'Nama Varietas', 'Komoditas', 'Asal / Pemulia', 'Tahun Rilis', 'Status', 'Deskripsi Singkat', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Variety, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedVariety && viewedVariety.id === item.id;
    const categoryColor = CATEGORY_COLORS[item.commodity.kategori] || 'gray';
    const categoryIcon = CATEGORY_ICONS[item.commodity.kategori] || 'ri-seedling-line';

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeVarietas}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.namaVarietas} className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-${categoryColor}/10 text-${categoryColor}`}>
                <i className={`${categoryIcon} text-lg`}></i>
              </div>
            )}
          </div>
          <span className="text-gray-800 font-semibold">{item.namaVarietas}</span>
        </td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold bg-${categoryColor}/10 text-${categoryColor}`}>
            {item.commodity.namaKomoditas}
          </span>
        </td>
        <td className="p-4 text-gray-600 font-medium">{item.asalPemulia || '-'}</td>
        <td className="p-4 text-gray-600 font-medium">{item.tahunRilis || '-'}</td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : 'bg-danger/10 text-danger'
            }`}>
            {item.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
          </span>
        </td>
        <td className="p-4 max-w-xs truncate text-gray-500" title={item.deskripsi}>
          {item.deskripsi || '-'}
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center">
            <TableViewBtn id={item.id} onClick={() => handleViewDetail(item)} />
            <TableEditBtn id={item.id} onClick={() => handleOpenEditModal(item)} />
            <TableRemoveBtn id={item.id} onClick={() => handleDeleteVariety(item.id)} />
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Tabs Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'karakteristik', label: 'Karakteristik' },
    { id: 'ketahanan', label: 'Ketahanan' },
    { id: 'riwayat', label: 'Riwayat' }
  ];

  const detailActions: DetailAction[] = viewedVariety ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedVariety),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewedVariety.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedVariety),
      icon: 'ri-shut-down-line',
      className: viewedVariety.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedVariety) return null;
    const categoryColor = CATEGORY_COLORS[viewedVariety.commodity.kategori] || 'gray';

    switch (tabId) {
      case 'info':
        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Komoditas</div>
            <div className="col-span-8 py-1 font-semibold text-emerald-600 flex items-center gap-1">
              <span className="mr-2 text-gray-700">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] bg-${categoryColor}/10 text-${categoryColor}`}>
                {viewedVariety.commodity.namaKomoditas}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Asal / Pemulia</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.asalPemulia || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tahun Rilis</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.tahunRilis || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Deskripsi</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-2">:</span>{viewedVariety.deskripsi || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewedVariety.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
                }`}>
                {viewedVariety.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.tglDibuat ? new Date(viewedVariety.tglDibuat).toLocaleDateString('id-ID') + ' ' + new Date(viewedVariety.tglDibuat).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedVariety.dibuatOleh || 'Admin'}
            </div>

            <div className="col-span-12 py-2">
              <p className="font-semibold text-textmuted mb-2">Foto Varietas</p>
              <div className="w-24 h-24 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                {viewedVariety.image ? (
                  <img src={viewedVariety.image} alt={viewedVariety.namaVarietas} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <i className="ri-image-line text-2xl"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'karakteristik':
        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Umur Tanam</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.umurTanam || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tinggi Tanaman</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.tinggiTanaman || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Bentuk Biji</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.bentukBiji || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Warna Gabah</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.warnaGabah || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Potensi Hasil</div>
            <div className="col-span-8 py-1 text-emerald-600 flex items-center font-bold">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.potensiHasil || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Anjuran Dataran</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-center font-medium">
              <span className="mr-2 text-gray-700">:</span>{viewedVariety.anjuranDataran || '-'}
            </div>
          </div>
        );
      case 'ketahanan':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Informasi Hama & Ketahanan Penyakit:</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder bg-gray-50/50">
              <div className="p-3">
                <span className="font-bold text-emerald-600 block mb-1">Ketahanan Hama</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Tahan terhadap Wereng Batang Coklat (WBC) biotipe 1 dan 2, agak tahan terhadap biotipe 3.
                </p>
              </div>
              <div className="p-3">
                <span className="font-bold text-emerald-600 block mb-1">Ketahanan Penyakit</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Tahan terhadap Hawar Daun Bakteri (HDB) patotipe III, rentan patotipe IV dan VIII. Tahan terhadap penyakit Blas ras 033.
                </p>
              </div>
              <div className="p-3">
                <span className="font-bold text-orange-600 block mb-1">Catatan Kritis</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">
                  Kurang disarankan ditanam pada lahan endemik tungro. Memerlukan sanitasi lahan yang baik setelah masa panen.
                </p>
              </div>
            </div>
          </div>
        );
      case 'riwayat':
        return (
          <div className="space-y-3 text-xs py-1">
            <p className="font-semibold text-gray-700 mb-2">Riwayat Distribusi Produksi (Musim Terakhir):</p>
            <div className="border border-defaultborder rounded divide-y divide-defaultborder">
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Distribusi Benih Utama - MT I 2025</p>
                  <span className="text-[10px] text-textmuted">Disalurkan ke unit Greenhouse Mitra A & B</span>
                </div>
                <span className="font-bold text-emerald-600">1,250 Kg</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Distribusi Benih Utama - MT II 2024</p>
                  <span className="text-[10px] text-textmuted">Disalurkan ke unit Greenhouse Mitra C</span>
                </div>
                <span className="font-bold text-emerald-600">950 Kg</span>
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
      <Seo title="Varietas" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Varietas"
        activepage="Varietas"
        description="Kelola data varietas benih perusahaan"
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedVariety ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari varietas..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
            onAdd={handleOpenAddModal}
            addLabel="Tambah Varietas"
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={varieties}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data varietas yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewedVariety && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Varietas"
              onClose={() => setViewedVariety(null)}
              imageUrl={viewedVariety.image}
              imageAlt={viewedVariety.namaVarietas}
              statusLabel={viewedVariety.status === 'Aktif' ? 'Aktif' : 'Non Aktif'}
              statusBgClass={viewedVariety.status === 'Aktif' ? 'bg-success' : 'bg-danger'}
              primaryTitle={viewedVariety.namaVarietas}
              secondaryTitle={`Kode Varietas: ${viewedVariety.kodeVarietas}`}
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
        title={modalMode === 'add' ? 'Tambah Varietas Baru' : 'Ubah Data Varietas'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Varietas</label>
            <input
              type="text"
              value={formValues.kodeVarietas}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodeVarietas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="VAR-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Varietas</label>
            <input
              type="text"
              value={formValues.namaVarietas}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaVarietas: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Inpari 32"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas</label>
            <select
              value={formValues.commodityId}
              onChange={(e) => setFormValues(prev => ({ ...prev, commodityId: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              required
              disabled={isSubmitLoading}
            >
              <option value="" disabled>Pilih Komoditas</option>
              {commoditiesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Asal / Pemulia</label>
            <input
              type="text"
              value={formValues.asalPemulia}
              onChange={(e) => setFormValues(prev => ({ ...prev, asalPemulia: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: BB Padi"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tahun Rilis</label>
            <input
              type="number"
              value={formValues.tahunRilis}
              onChange={(e) => setFormValues(prev => ({ ...prev, tahunRilis: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 2014"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Umur Tanam</label>
            <input
              type="text"
              value={formValues.umurTanam}
              onChange={(e) => setFormValues(prev => ({ ...prev, umurTanam: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 115 - 120 hari"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Tanaman</label>
            <input
              type="text"
              value={formValues.tinggiTanaman}
              onChange={(e) => setFormValues(prev => ({ ...prev, tinggiTanaman: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 95 - 105 cm"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Bentuk Biji</label>
            <input
              type="text"
              value={formValues.bentukBiji}
              onChange={(e) => setFormValues(prev => ({ ...prev, bentukBiji: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Ramping"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Warna Gabah</label>
            <input
              type="text"
              value={formValues.warnaGabah}
              onChange={(e) => setFormValues(prev => ({ ...prev, warnaGabah: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Kuning bersih"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Potensi Hasil</label>
            <input
              type="text"
              value={formValues.potensiHasil}
              onChange={(e) => setFormValues(prev => ({ ...prev, potensiHasil: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: 7 - 8 ton/ha"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Anjuran Dataran</label>
            <input
              type="text"
              value={formValues.anjuranDataran}
              onChange={(e) => setFormValues(prev => ({ ...prev, anjuranDataran: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="Contoh: Rendah - Menengah"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Variety['status'] }))}
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
            label="Gambar Varietas / Benih (Maks. 5MB)"
            imageUrl={previewUrl}
            onImageChange={setImageFile}
            disabled={isSubmitLoading}
            className="mb-4"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Deskripsi / Keterangan</label>
          <textarea
            value={formValues.deskripsi}
            onChange={(e) => setFormValues(prev => ({ ...prev, deskripsi: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Keterangan singkat mengenai varietas ini..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
