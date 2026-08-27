"use client"
import React, {Fragment } from 'react';
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

import { Land } from '@/app/types/greenhouse';
import { useGreenhouse, KOMODITAS_DEFAULTS } from '@/app/hooks/useGreenhouse';

export default function GreenhousePage() {
  const {
    loading,
    error,
    lands,
    isTableLoading,
    stats,
    statItems,
    commoditiesOptions,
    partnersOptions,
    jenisLahanOptions,
    statusOptions,
    komoditasOptions,
    lokasiOptions,
    search,
    setSearch,
    filterJenis,
    setFilterJenis,
    filterStatus,
    setFilterStatus,
    filterKomoditas,
    setFilterKomoditas,
    filterLokasi,
    setFilterLokasi,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedLand,
    setViewedLand,
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
    handleDeleteLand,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
    setImageFile,
  } = useGreenhouse();

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterJenis,
      onChange: (val: any) => { setFilterJenis(val); setCurrentPage(1); },
      options: jenisLahanOptions,
      placeholder: 'Jenis Lahan',
      widthClass: 'sm:w-44'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-40'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => { setFilterKomoditas(val); setCurrentPage(1); },
      options: commoditiesOptions,
      placeholder: 'Komoditas',
      widthClass: 'sm:w-40'
    },
    {
      value: filterLokasi,
      onChange: (val: any) => { setFilterLokasi(val); setCurrentPage(1); },
      options: lokasiOptions,
      placeholder: 'Lokasi',
      widthClass: 'sm:w-36'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Lahan', 'Nama Lahan', 'Jenis Lahan', 'Komoditas Utama', 'Petani Mitra', 'Lokasi', 'Luas (Ha)', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Land, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedLand && viewedLand.id === item.id;
    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodeLahan}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
            {item.image ? (
              <img src={item.image} alt={item.namaLahan} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                <i className="ri-image-line text-lg"></i>
              </div>
            )}
          </div>
          <span className="text-gray-800">{item.namaLahan}</span>
        </td>
        <td className="p-4">
          <span className={`font-semibold ${item.jenisLahan === 'Greenhouse' ? 'text-emerald-600' : 'text-blue-500'}`}>
            {item.jenisLahan}
          </span>
        </td>
        <td className="p-4">
          <span className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white bg-${item.komoditasColor}-500 text-xs`}>
              <i className={item.komoditasIcon}></i>
            </span>
            <span className="font-semibold text-gray-700">{item.commodity?.namaKomoditas || item.komoditasUtama}</span>
          </span>
        </td>
        <td className="p-4 font-medium text-gray-700">{item.partner?.namaPetani || item.petaniMitra || '-'}</td>
        <td className="p-4">{item.lokasi}</td>
        <td className="p-4">{Number(item.luas).toFixed(2)}</td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif'
            ? 'bg-success/10 text-success'
            : item.status === 'Maintenance'
              ? 'bg-danger/10 text-danger'
              : 'bg-gray-100 text-gray-500'
            }`}>
            {item.status}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center">
            <TableViewBtn id={item.id} onClick={() => handleViewDetail(item)} />
            <TableEditBtn id={item.id} onClick={() => handleOpenEditModal(item)} />
            <TableRemoveBtn id={item.id} onClick={() => handleDeleteLand(item.id)} />
          </div>
        </td>
      </tr>
    );
  };

  // Detail Panel Config
  const detailTabs: TabConfig[] = [
    { id: 'info', label: 'Informasi' },
    { id: 'kondisi', label: 'Kondisi' },
    { id: 'riwayat', label: 'Riwayat' },
    { id: 'dokumen', label: 'Dokumen' }
  ];

  const detailActions: DetailAction[] = viewedLand ? [
    {
      label: 'Edit Data',
      onClick: () => handleOpenEditModal(viewedLand),
      icon: 'ri-edit-line',
      className: 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50'
    },
    {
      label: viewedLand.status === 'Aktif' ? 'Non Aktifkan' : 'Aktifkan',
      onClick: () => handleToggleStatus(viewedLand),
      icon: 'ri-shut-down-line',
      className: viewedLand.status === 'Aktif'
        ? 'border border-red-500 text-red-500 hover:bg-red-50'
        : 'border border-success text-success hover:bg-emerald-50'
    }
  ] : [];

  const renderDetailTabContent = (tabId: string) => {
    if (!viewedLand) return null;
    switch (tabId) {
      case 'info':
        return (
          <div className="grid grid-cols-12 gap-y-3 text-xs mt-2 text-gray-700 divide-y divide-gray-50">
            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Jenis Lahan</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedLand.jenisLahan}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Komoditas Utama</div>
            <div className="col-span-8 py-1 font-semibold text-emerald-600 flex items-center gap-1">
              <span className="mr-2 text-gray-700">:</span>
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-white bg-${viewedLand.komoditasColor}-500 text-[10px]`}>
                <i className={viewedLand.komoditasIcon}></i>
              </span>
              {viewedLand.commodity?.namaKomoditas || viewedLand.komoditasUtama}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Luas</div>
            <div className="col-span-8 py-1 font-semibold text-gray-800 flex items-center">
              <span className="mr-2">:</span>{Number(viewedLand.luas).toFixed(2)} Ha
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-start">Lokasi</div>
            <div className="col-span-8 py-1 text-gray-800 flex items-start leading-relaxed">
              <span className="mr-2">:</span>
              <span>
                <strong className="text-gray-800">{viewedLand.lokasi}</strong> - {viewedLand.detailLokasi || '-'}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Koordinat</div>
            <div className="col-span-8 py-1 font-mono text-gray-700 flex items-center">
              <span className="mr-2 text-gray-700">:</span>{viewedLand.koordinat || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Petani Mitra</div>
            <div className="col-span-8 py-1 font-medium text-gray-800 flex items-center">
              <span className="mr-2">:</span>{viewedLand.partner?.namaPetani || viewedLand.petaniMitra || '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Tanggal Dibuat</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedLand.tglDibuat ? new Date(viewedLand.tglDibuat).toLocaleDateString('id-ID') : '-'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Dibuat Oleh</div>
            <div className="col-span-8 py-1 text-gray-600 flex items-center">
              <span className="mr-2">:</span>{viewedLand.dibuatOleh || 'Admin'}
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-1 flex items-center">Status</div>
            <div className="col-span-8 py-1 flex items-center">
              <span className="mr-2">:</span>
              <span className={`badge rounded font-bold px-1.5 py-0.5 text-[10px] ${viewedLand.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : viewedLand.status === 'Maintenance'
                  ? 'bg-danger/10 text-danger'
                  : 'bg-gray-100 text-gray-500'
                }`}>
                {viewedLand.status}
              </span>
            </div>

            <div className="col-span-4 font-semibold text-textmuted py-2 flex items-start">Keterangan</div>
            <div className="col-span-8 py-2 text-gray-600 flex items-start leading-relaxed">
              <span className="mr-2">:</span>{viewedLand.keterangan || '-'}
            </div>

            <div className="col-span-12 py-2">
              <p className="font-semibold text-textmuted mb-2">Gambar Lahan / Greenhouse</p>
              <div className="w-32 h-24 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                {viewedLand.image ? (
                  <img src={viewedLand.image} alt={viewedLand.namaLahan} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <i className="ri-image-line text-2xl"></i>
                  </div>
                )}
              </div>
            </div>
          </div>
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
      <Seo title="Greenhouse / Lahan" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <Pageheader
        title="Master Data"
        currentpage="Greenhouse / Lahan"
        activepage="Greenhouse"
        description="Kelola data greenhouse / lahan produksi"
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-12 gap-x-6">
        {/* Left Side (Table & Filters) */}
        <div className={viewedLand ? 'xl:col-span-8 col-span-12' : 'xl:col-span-12 col-span-12'}>
          {/* Filters Bar */}
          <FilterRow
            search={search}
            onSearchChange={(val) => { setSearch(val); }}
            searchPlaceholder="Cari greenhouse / lahan..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onExport={handleExportData}
            onAdd={handleOpenAddModal}
            addLabel="Tambah GH / Lahan"
          />

          {/* Table list with pagination */}
          <DataTable
            headers={tableHeaders}
            items={lands}
            renderRow={renderTableRow}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            emptyMessage="Tidak ada data lahan yang cocok dengan filter pencarian."
            isLoading={isTableLoading}
          />
        </div>

        {/* Right Side (Detail Panel) */}
        {viewedLand && (
          <div className="xl:col-span-4 col-span-12">
            <DetailPanel
              title="Detail Lahan"
              onClose={() => setViewedLand(null)}
              imageUrl={viewedLand.image}
              imageAlt={viewedLand.namaLahan}
              statusLabel={viewedLand.status}
              statusBgClass={
                viewedLand.status === 'Aktif'
                  ? 'bg-success'
                  : viewedLand.status === 'Maintenance'
                    ? 'bg-danger'
                    : 'bg-gray-500'
              }
              primaryTitle={viewedLand.namaLahan}
              secondaryTitle={viewedLand.kodeLahan}
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
        title={modalMode === 'add' ? 'Tambah Greenhouse / Lahan Baru' : 'Ubah Data Greenhouse / Lahan'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Lahan</label>
            <input
              type="text"
              value={formValues.kodeLahan}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodeLahan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="GH-XXX atau LH-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lahan</label>
            <input
              type="text"
              value={formValues.namaLahan}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaLahan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Greenhouse D"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Jenis Lahan</label>
            <select
              value={formValues.jenisLahan}
              onChange={(e) => {
                const val = e.target.value as Land['jenisLahan'];
                setFormValues(prev => ({
                  ...prev,
                  jenisLahan: val
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Greenhouse">Greenhouse</option>
              <option value="Lahan Terbuka">Lahan Terbuka</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas</label>
            <select
              value={formValues.commodityId}
              onChange={(e) => {
                const val = e.target.value;
                const selectedCommodity = commoditiesOptions.find(c => c.value === val);
                const commodityName = selectedCommodity ? selectedCommodity.label : '';
                const def = KOMODITAS_DEFAULTS[commodityName] || { color: 'green', icon: 'ri-seedling-line' };
                setFormValues(prev => ({
                  ...prev,
                  commodityId: val,
                  komoditasUtama: commodityName,
                  komoditasColor: def.color,
                  komoditasIcon: def.icon
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
              required
            >
              <option value="" disabled>Pilih Komoditas</option>
              {commoditiesOptions.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Warna Penanda</label>
            <select
              value={formValues.komoditasColor}
              onChange={(e) => setFormValues(prev => ({ ...prev, komoditasColor: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="emerald">Emerald (Hijau Emerald)</option>
              <option value="green">Green (Hijau)</option>
              <option value="lime">Lime (Hijau Muda)</option>
              <option value="red">Red (Merah)</option>
              <option value="blue">Blue (Biru)</option>
              <option value="amber">Amber (Oranye/Kuning)</option>
              <option value="yellow">Yellow (Kuning)</option>
              <option value="purple">Purple (Ungu)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Icon Penanda</label>
            <select
              value={formValues.komoditasIcon}
              onChange={(e) => setFormValues(prev => ({ ...prev, komoditasIcon: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="ri-leaf-line">Daun (ri-leaf-line)</option>
              <option value="ri-seedling-line">Kecambah (ri-seedling-line)</option>
              <option value="ri-sun-line">Matahari (ri-sun-line)</option>
              <option value="ri-focus-2-line">Target (ri-focus-2-line)</option>
              <option value="ri-water-flash-line">Air (ri-water-flash-line)</option>
              <option value="ri-plant-line">Tanaman (ri-plant-line)</option>
              <option value="ri-home-3-line">Greenhouse (ri-home-3-line)</option>
            </select>
          </div>
        </div>


        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Lokasi Wilayah</label>
            <select
              value={formValues.lokasi}
              onChange={(e) => setFormValues(prev => ({ ...prev, lokasi: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Bogor">Bogor</option>
              <option value="Subang">Subang</option>
              <option value="Lamongan">Lamongan</option>
              <option value="Jember">Jember</option>
              <option value="Garut">Garut</option>
              <option value="Wonosobo">Wonosobo</option>
              <option value="Brebes">Brebes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Luas Lahan (Ha)</label>
            <input
              type="number"
              step="0.01"
              value={formValues.luas}
              onChange={(e) => setFormValues(prev => ({ ...prev, luas: Number(e.target.value) }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="0.80"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Land['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Petani Mitra</label>
          <select
            value={formValues.partnerId}
            onChange={(e) => {
              const val = e.target.value;
              const partner = partnersOptions.find(p => p.value === val);
              setFormValues(prev => ({
                ...prev,
                partnerId: val,
                petaniMitra: partner ? partner.label : ''
              }));
            }}
            className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
            disabled={isSubmitLoading}
          >
            <option value="">Pilih Petani Mitra (Opsional)</option>
            {partnersOptions.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Latitude (Lat)</label>
            <input
              type="text"
              value={formValues.latitude}
              onChange={(e) => setFormValues(prev => ({ ...prev, latitude: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="-6.7105"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Longitude (Long)</label>
            <input
              type="text"
              value={formValues.longitude}
              onChange={(e) => setFormValues(prev => ({ ...prev, longitude: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="106.8123"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div>
          <ImageUpload
            label="Foto Greenhouse/Lahan (Maks. 5MB)"
            imageUrl={previewUrl}
            onImageChange={setImageFile}
            disabled={isSubmitLoading}
            className="mb-4"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat Lengkap / Detail Lokasi</label>
          <textarea
            value={formValues.detailLokasi}
            onChange={(e) => setFormValues(prev => ({ ...prev, detailLokasi: e.target.value }))}
            rows={2}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Masukkan alamat jalan, dusun, desa, kecamatan..."
            disabled={isSubmitLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Keterangan Tambahan</label>
          <textarea
            value={formValues.keterangan}
            onChange={(e) => setFormValues(prev => ({ ...prev, keterangan: e.target.value }))}
            rows={2}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Catatan tambahan mengenai lahan ini..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
