"use client";
import React, { Fragment } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import CrudModal from '../../shared/CrudModal';
import { TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';

import { PenanggungJawab } from '@/app/types/penanggungJawab';
import { usePenanggungJawab } from '@/app/hooks/usePenanggungJawab';

export default function MasterPenanggungJawabPage() {
  const {
    penanggungJawabList,
    loading,
    isTableLoading,
    isSubmitLoading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    statusOptions,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    selectedItem,
    formValues,
    setFormValues,
    formErrors,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    itemToDelete,
    isDeleteLoading,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleResetFilters,
    handleSaveModal,
    handleConfirmDelete,
  } = usePenanggungJawab();

  // Filters Configuration
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterStatus,
      onChange: (val: any) => {
        setFilterStatus(val);
        setCurrentPage(1);
      },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-44',
    },
  ];

  // Table Headers
  const tableHeaders = ['No', 'ID Penanggung Jawab', 'Nama Penanggung Jawab', 'Status', 'Tanggal Dibuat', 'Aksi'];

  // Format Date Helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Render Table Row
  const renderTableRow = (item: PenanggungJawab, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;

    return (
      <tr
        key={item.id}
        className="hover:bg-gray-50/50 transition-colors border-b border-defaultborder"
      >
        <td className="p-4 text-center text-gray-500 font-medium">{rowNumber}</td>
        <td className="p-4">
          <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded border border-gray-200">
            {item.id}
          </span>
        </td>
        <td className="p-4 font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              {item.nama ? item.nama.charAt(0).toUpperCase() : 'P'}
            </div>
            <span>{item.nama}</span>
          </div>
        </td>
        <td className="p-4">
          <span
            className={`badge px-2.5 py-1 rounded text-xs font-semibold ${
              item.status === 'Aktif'
                ? 'bg-success/10 text-success'
                : 'bg-danger/10 text-danger'
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="p-4 text-gray-500 text-sm">
          {formatDate(item.createdAt)}
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <TableEditBtn id={item.id} onClick={() => handleOpenEditModal(item)} />
            <TableRemoveBtn id={item.id} onClick={() => handleOpenDeleteModal(item)} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <Fragment>
      <Seo title="Master Penanggung Jawab" />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Pageheader
        title="Master Data"
        currentpage="Penanggung Jawab"
        activepage="Penanggung Jawab"
        description="Kelola data penanggung jawab produksi dan operasional"
      />

      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12">
          {/* Filter & Action Bar */}
          <FilterRow
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Cari nama penanggung jawab..."
            selectFilters={filterConfig}
            onReset={handleResetFilters}
            onAdd={handleOpenAddModal}
            addLabel="Tambah Penanggung Jawab"
          />

          {/* Data Table */}
          <DataTable
            headers={tableHeaders}
            items={penanggungJawabList}
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
            emptyMessage="Belum ada data penanggung jawab."
            isLoading={isTableLoading || loading}
          />
        </div>
      </div>

      {/* Modal Tambah / Edit (Input hanya Nama sesuai permintaan) */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Tambah Penanggung Jawab' : 'Edit Penanggung Jawab'}
        onSubmit={handleSaveModal}
        submitText={modalMode === 'create' ? 'Simpan Data' : 'Simpan Perubahan'}
        cancelText="Batal"
        isLoading={isSubmitLoading}
        maxWidthClass="max-w-lg"
      >
        <div className="space-y-4">
          {/* Info Auto-Generated ID */}
          {modalMode === 'edit' && selectedItem && (
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                ID Penanggung Jawab (Otomatis)
              </label>
              <div className="font-mono text-xs text-gray-700 bg-white p-2 rounded border border-gray-200">
                {selectedItem.id}
              </div>
            </div>
          )}

          {/* Form Input: Nama Penanggung Jawab */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Nama Penanggung Jawab <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formValues.nama}
              onChange={(e) => {
                setFormValues((prev) => ({ ...prev, nama: e.target.value }));
                if (formErrors.nama) {
                  // clear error on change
                  formErrors.nama = undefined;
                }
              }}
              className={`form-control w-full border ${
                formErrors.nama ? 'border-red-500' : 'border-defaultborder'
              } p-2.5 rounded text-sm focus:border-emerald-500 focus:ring-emerald-500`}
              placeholder="Contoh: Ir. Ahmad Subarjo"
              required
              disabled={isSubmitLoading}
              autoFocus
            />
            {formErrors.nama && (
              <p className="text-xs text-red-500 mt-1 font-medium">{formErrors.nama}</p>
            )}
            <p className="text-[11px] text-gray-400 mt-1">
              {modalMode === 'create'
                ? 'ID akan dibuat secara otomatis oleh sistem.'
                : 'Ubah nama penanggung jawab sesuai kebutuhan.'}
            </p>
          </div>

          {/* Status (Opsional untuk edit / kelola keaktifan) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Status
            </label>
            <select
              value={formValues.status}
              onChange={(e) => setFormValues((prev) => ({ ...prev, status: e.target.value }))}
              className="form-select w-full border border-defaultborder p-2.5 rounded text-sm bg-white cursor-pointer focus:border-emerald-500"
              disabled={isSubmitLoading}
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </CrudModal>

      {/* Modal Konfirmasi Hapus */}
      <CrudModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Konfirmasi Hapus"
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirmDelete();
        }}
        submitText="Ya, Hapus"
        cancelText="Batal"
        isLoading={isDeleteLoading}
        maxWidthClass="max-w-md"
      >
        <div className="py-2">
          <div className="flex items-center gap-3 mb-3 text-red-600">
            <i className="ri-error-warning-line text-3xl"></i>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Hapus Penanggung Jawab</h4>
              <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Apakah Anda yakin ingin menghapus data penanggung jawab{' '}
            <strong className="text-gray-900">{itemToDelete?.nama}</strong>?
          </p>
        </div>
      </CrudModal>
    </Fragment>
  );
}
