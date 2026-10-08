"use client"
import React, { useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import CrudModal from '../../shared/CrudModal';
import ImageUpload from '../../shared/ImageUpload';
import { TableViewBtn, TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';

import ModalDetailPetani from './component/ModalDetailPetani';
import { Partner } from '@/app/types/partner';
import { usePetaniMitra } from '@/app/hooks/usePetaniMitra';

export default function PetaniMitraPage() {
  const router = useRouter();
  const {
    loading,
    error,
    partners,
    isTableLoading,
    greenhouses,
    stats,
    statItems,
    kelompokTaniOptions,
    statusOptions,
    komoditasOptions,
    penanggungJawabList,
    kelompokTaniList,
    search,
    setSearch,
    filterKelompok,
    setFilterKelompok,
    filterKomoditas,
    setFilterKomoditas,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    viewedPartner,
    setViewedPartner,
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
    handleDeletePartner,
    handleToggleStatus,
    handleExportData,
    handleViewDetail,
    handleFileChange,
    handleClearImage,
    setImageFile,
  } = usePetaniMitra();

  // Shared Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterKelompok,
      onChange: (val: any) => { setFilterKelompok(val); setCurrentPage(1); },
      options: kelompokTaniOptions,
      placeholder: 'Kelompok Tani',
      widthClass: 'sm:w-44'
    },
    {
      value: filterStatus,
      onChange: (val: any) => { setFilterStatus(val); setCurrentPage(1); },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-36'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => { setFilterKomoditas(val); setCurrentPage(1); },
      options: komoditasOptions,
      placeholder: 'Komoditas Utama',
      widthClass: 'sm:w-44'
    }
  ];

  // Table Headers
  const tableHeaders = ['No', 'Kode Petani', 'Nama Petani', 'Kelompok Tani', 'Komoditas Utama', 'Luas Lahan (Ha)', 'Status', 'Aksi'];

  // Render Row for DataTable
  const renderTableRow = (item: Partner, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const isSelected = viewedPartner && viewedPartner.id === item.id;
    const partnerGreenhouses = item.greenhouses || greenhouses.filter(g => g.partnerId === item.id || g.petaniMitra === item.namaPetani);
    const totalLuas = partnerGreenhouses.reduce((sum, g) => sum + Number(g.luas || 0), 0);
    const formattedLuas = totalLuas.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
      <tr
        key={item.id}
        className={`hover:bg-gray-50/50 transition-colors border-b border-defaultborder ${isSelected ? 'bg-emerald-50/40 font-medium' : ''}`}
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-semibold text-gray-800">{item.kodePetani}</td>
        <td className="p-4 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
            {item.image ? (
              <img src={item.image} alt={item.namaPetani} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                <i className="ri-user-line text-lg"></i>
              </div>
            )}
          </div>
          <span className="text-gray-800 font-semibold">{item.namaPetani}</span>
        </td>
        <td className="p-4">
          <div className="text-gray-800 font-semibold">{item.kelompokTani}</div>
          {(item.penanggungJawab?.nama || (typeof item.penanggungJawab === 'string' && item.penanggungJawab)) && (
            <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <i className="ri-user-star-line text-[10px]"></i>
              <span>PJ: {typeof item.penanggungJawab === 'object' ? item.penanggungJawab.nama : item.penanggungJawab}</span>
            </div>
          )}
        </td>
        <td className="p-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded">
            <i className="ri-leaf-line"></i>
            {item.komoditasUtama}
          </span>
        </td>
        <td className="p-4 text-gray-600 font-medium">{formattedLuas}</td>
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
            <TableRemoveBtn id={item.id} onClick={() => handleDeletePartner(item.id)} />
          </div>
        </td>
      </tr>
    );
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
      <Seo title="Petani Mitra" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Pageheader
        title="Master Data"
        currentpage="Petani Mitra"
        activepage="Petani Mitra"
        description="Kelola data petani mitra perusahaan"
      />

      {/* Summary Cards */}
      <StatsWidgets items={statItems} />

      <div className="w-full">
        {/* Filters Bar */}
        <FilterRow
          search={search}
          onSearchChange={(val) => { setSearch(val); }}
          searchPlaceholder="Cari petani mitra..."
          selectFilters={filterConfig}
          onReset={handleResetFilters}
          onExport={handleExportData}
          onAdd={() => router.push('/master/petani-mitra/tambah')}
          addLabel="Tambah Petani Mitra"
        />

        {/* Table list with pagination */}
        <DataTable
          headers={tableHeaders}
          items={partners}
          renderRow={renderTableRow}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          emptyMessage="Tidak ada data petani mitra yang cocok dengan filter pencarian."
          isLoading={isTableLoading}
        />
      </div>

      {/* Info Pop Up Modal with Land List */}
      <ModalDetailPetani
        isOpen={!!viewedPartner}
        partner={viewedPartner}
        allGreenhouses={greenhouses}
        onClose={() => setViewedPartner(null)}
        onEdit={(p) => handleOpenEditModal(p)}
        onToggleStatus={(p) => handleToggleStatus(p)}
        isLoading={isDetailLoading}
      />

      {/* Create / Edit Modal Dialog */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Tambah Petani Mitra' : 'Edit Data Petani Mitra'}
        onSubmit={handleSaveModal}
        submitText="Simpan Data"
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kode Petani *</label>
            <input
              type="text"
              value={formValues.kodePetani}
              onChange={(e) => setFormValues(prev => ({ ...prev, kodePetani: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
              placeholder="PM-XXX"
              required
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lengkap *</label>
            <input
              type="text"
              value={formValues.namaPetani}
              onChange={(e) => setFormValues(prev => ({ ...prev, namaPetani: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm focus:border-emerald-500"
              placeholder="Contoh: Budi Santoso"
              required
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Penanggung Jawab *</label>
            <select
              value={formValues.penanggungJawabId || ''}
              onChange={(e) => {
                const newPjId = e.target.value;
                setFormValues(prev => {
                  const currentKt = kelompokTaniList.find(k => k.id === prev.kelompokTaniId);
                  const shouldResetKt = currentKt && currentKt.penanggungJawabId && currentKt.penanggungJawabId !== newPjId;
                  return {
                    ...prev,
                    penanggungJawabId: newPjId,
                    kelompokTaniId: shouldResetKt ? '' : prev.kelompokTaniId,
                    kelompokTani: shouldResetKt ? '' : prev.kelompokTani,
                  };
                });
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer focus:border-emerald-500"
              required
              disabled={isSubmitLoading}
            >
              <option value="">Pilih Penanggung Jawab</option>
              {penanggungJawabList.map((pj: any) => (
                <option key={pj.id} value={pj.id}>
                  {pj.kodePersonel ? `[${pj.kodePersonel}] ` : ''}{pj.nama} ({pj.peran || 'PJ'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kelompok Tani *</label>
            <select
              value={formValues.kelompokTaniId || ''}
              onChange={(e) => {
                const newKtId = e.target.value;
                const selectedKt = kelompokTaniList.find(k => k.id === newKtId);
                setFormValues(prev => ({
                  ...prev,
                  kelompokTaniId: newKtId,
                  kelompokTani: selectedKt ? selectedKt.namaKelompok : prev.kelompokTani,
                  penanggungJawabId: selectedKt?.penanggungJawabId || prev.penanggungJawabId,
                  komoditasUtama: selectedKt?.komoditasUtama && !prev.komoditasUtama ? selectedKt.komoditasUtama : prev.komoditasUtama,
                }));
              }}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer focus:border-emerald-500"
              required
              disabled={isSubmitLoading}
            >
              <option value="">
                {formValues.penanggungJawabId
                  ? `-- Pilih Kelompok Tani --`
                  : '-- Pilih Kelompok Tani --'}
              </option>
              {(formValues.penanggungJawabId
                ? kelompokTaniList.filter(kt => !kt.penanggungJawabId || kt.penanggungJawabId === formValues.penanggungJawabId)
                : kelompokTaniList
              ).map((kt: any) => (
                <option key={kt.id} value={kt.id}>
                  {kt.kodeKelompok ? `[${kt.kodeKelompok}] ` : ''}{kt.namaKelompok}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Komoditas Utama *</label>
            <select
              value={formValues.komoditasUtama}
              onChange={(e) => setFormValues(prev => ({ ...prev, komoditasUtama: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              required
              disabled={isSubmitLoading}
            >
              <option value="" disabled>Pilih Komoditas</option>
              {komoditasOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status *</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as any }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer font-semibold"
              required
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">No. KTP</label>
            <input
              type="text"
              value={formValues.noKtp}
              onChange={(e) => setFormValues(prev => ({ ...prev, noKtp: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="3271xxxxxxxxxxxx"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">No. Telepon</label>
            <input
              type="text"
              value={formValues.noTelepon}
              onChange={(e) => setFormValues(prev => ({ ...prev, noTelepon: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm font-mono"
              placeholder="08xxxxxxxxxx"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Luas Lahan (Ha)</label>
            <input
              type="number"
              step="0.01"
              value={formValues.luasLahan}
              onChange={(e) => setFormValues(prev => ({ ...prev, luasLahan: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="1.50"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Pengalaman (tahun)</label>
            <input
              type="number"
              value={formValues.pengalaman}
              onChange={(e) => setFormValues(prev => ({ ...prev, pengalaman: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm"
              placeholder="10"
              disabled={isSubmitLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Tgl Bergabung</label>
            <input
              type="date"
              value={formValues.tglBergabung}
              onChange={(e) => setFormValues(prev => ({ ...prev, tglBergabung: e.target.value }))}
              className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Status Awal</label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues(prev => ({ ...prev, status: e.target.value as Partner['status'] }))}
              className="form-select w-full border border-defaultborder p-2 rounded text-sm bg-white cursor-pointer"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>
          </div>
        </div>

        <div>
          <ImageUpload
            label="Foto Profil Petani (Maks. 5MB)"
            imageUrl={previewUrl}
            onImageChange={setImageFile}
            disabled={isSubmitLoading}
            className="mb-4"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Alamat Lengkap</label>
          <textarea
            value={formValues.alamat}
            onChange={(e) => setFormValues(prev => ({ ...prev, alamat: e.target.value }))}
            rows={3}
            className="form-control w-full border border-defaultborder p-2 rounded text-sm"
            placeholder="Dusun/Kampung, RT/RW, Desa, Kecamatan, Kabupaten, Provinsi..."
            disabled={isSubmitLoading}
          />
        </div>
      </CrudModal>
    </Fragment>
  );
}
