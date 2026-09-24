"use client";
import React from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import DataTable from '../../shared/DataTable';
import CrudModal from '../../shared/CrudModal';
import { TableEditBtn, TableRemoveBtn } from '../../shared/ActionButtons';
import { MasterParameter, MasterParameterOption, PARAMETER_MODUL_OPTIONS } from '@/app/types/parameter';
import { useMasterParameter } from '@/app/hooks/useMasterParameter';

const TIPE_COLORS: Record<string, string> = {
  NUMBER: 'info',
  TEXT: 'secondary',
  OPTION: 'warning',
  RANGE: 'primary',
  BOOLEAN: 'success',
};

export default function MasterParameterPage() {
  const {
    loading,
    isTableLoading,
    isSubmitLoading,
    parameters,
    modulList,
    search,
    setSearch,
    filterModul,
    setFilterModul,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formValues,
    setFormValues,
    handleResetFilters,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSaveModal,
    handleDeleteParameter,
  } = useMasterParameter();

  // Filters Configuration
  const defaultModulList = PARAMETER_MODUL_OPTIONS.map((opt) => opt.value as string);
  const activeModuls = Array.from(new Set([...defaultModulList, ...modulList]));

  const getModulLabel = (modul: string) => {
    const found = PARAMETER_MODUL_OPTIONS.find((opt) => opt.value === modul);
    return found ? found.label : modul;
  };

  const modulOptions = [
    { value: 'ALL', label: 'Semua Modul' },
    ...activeModuls.map((m) => ({ value: m, label: getModulLabel(m) })),
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'Aktif', label: 'Aktif' },
    { value: 'Non-Aktif', label: 'Non-Aktif' },
  ];

  const selectFilters: FilterSelectConfig[] = [
    {
      value: filterModul,
      onChange: (val: any) => {
        setFilterModul(val);
        setCurrentPage(1);
      },
      options: modulOptions,
      placeholder: 'Modul',
      widthClass: 'sm:w-44',
    },
    {
      value: filterStatus,
      onChange: (val: any) => {
        setFilterStatus(val);
        setCurrentPage(1);
      },
      options: statusOptions,
      placeholder: 'Status',
      widthClass: 'sm:w-40',
    },
  ];

  // Stats Data
  const statItems: StatItem[] = [
    {
      title: 'Total Parameter',
      value: totalRecords,
      subtitle: 'Definisi terdaftar',
      icon: 'ri-list-settings-line',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Modul Terdaftar',
      value: modulList.length,
      subtitle: 'Modul terintegrasi',
      icon: 'ri-grid-fill',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Tipe Option',
      value: parameters.filter((p) => p.tipeNilai === 'OPTION').length,
      subtitle: 'Parameter pilihan dropdown',
      icon: 'ri-toggle-line',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
    {
      title: 'Parameter Aktif',
      value: parameters.filter((p) => p.status === 'Aktif').length,
      subtitle: 'Status siap digunakan',
      icon: 'ri-checkbox-circle-line',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
  ];

  // Table Headers
  const tableHeaders = [
    'No',
    'Kode',
    'Nama Parameter',
    'Varietas',
    'Modul',
    'Tipe Nilai',
    'Satuan',
    'Opsi / Detail',
    'Status',
    'Aksi',
  ];

  // Option Handler for Modal
  const handleAddOptionRow = () => {
    const nextUrutan = formValues.options.length + 1;
    setFormValues((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          kode: `OPT_${nextUrutan}`,
          nama: '',
          bobot: 0,
          urutan: nextUrutan,
          status: 'Aktif',
        },
      ],
    }));
  };

  const handleRemoveOptionRow = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleOptionChange = (index: number, field: keyof MasterParameterOption, value: any) => {
    setFormValues((prev) => {
      const updated = [...prev.options];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, options: updated };
    });
  };

  // Render Table Row
  const renderTableRow = (item: MasterParameter, index: number) => {
    const rowNumber = (currentPage - 1) * pageSize + index + 1;
    const tipeColor = TIPE_COLORS[item.tipeNilai] || 'secondary';

    return (
      <tr
        key={item.id}
        className="hover:bg-gray-50/50 transition-colors border-b border-defaultborder"
      >
        <td className="p-4">{rowNumber}</td>
        <td className="p-4 font-mono font-semibold text-gray-800">{item.kode}</td>
        <td className="p-4 font-semibold text-gray-800">
          <div>{item.nama}</div>
          {item.deskripsi && (
            <div className="text-xs text-gray-400 font-normal truncate max-w-xs">{item.deskripsi}</div>
          )}
        </td>
        <td className="p-4">
          {item.varietyParameters && item.varietyParameters.length > 0 ? (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {item.varietyParameters.map((vp) => (
                <span key={vp.variety?.id || Math.random()} className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-medium text-[10px]">
                  {vp.variety?.namaVarietas}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 italic text-xs">-</span>
          )}
        </td>
        <td className="p-4">
          <span className="badge px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {getModulLabel(item.namaModul)}
          </span>
        </td>
        <td className="p-4">
          <span className={`badge px-2.5 py-1 rounded text-xs font-semibold bg-${tipeColor}/10 text-${tipeColor}`}>
            {item.tipeNilai}
          </span>
        </td>
        <td className="p-4 font-medium text-gray-600">{item.satuan || '-'}</td>
        <td className="p-4 text-xs text-gray-600">
          {item.tipeNilai === 'OPTION' && item.options ? (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {item.options.slice(0, 4).map((opt) => (
                <span
                  key={opt.id || opt.kode}
                  className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-mono text-[11px]"
                >
                  {opt.nama}
                </span>
              ))}
              {item.options.length > 4 && (
                <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-bold">
                  +{item.options.length - 4}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </td>
        <td className="p-4">
          <span
            className={`badge px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}
          >
            {item.status}
          </span>
        </td>
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-1">
            <TableEditBtn id={item.id} onClick={() => handleOpenEditModal(item)} />
            <TableRemoveBtn id={item.id} onClick={() => handleDeleteParameter(item.id)} />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div>
      <Seo title="Master Parameter" />
      <Pageheader currentpage="Master Parameter" activepage="Master Data" mainpage="Master Parameter" />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Widget Highlights */}
      <StatsWidgets items={statItems} columns={4} />

      {/* Filters Bar */}
      <FilterRow
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Cari kode, nama, atau deskripsi..."
        selectFilters={selectFilters}
        onReset={handleResetFilters}
        onExport={() => alert('Fitur export data parameter')}
        onAdd={handleOpenAddModal}
        addLabel="Tambah Parameter"
      />

      {/* Table Data */}
      <DataTable
        headers={tableHeaders}
        items={parameters}
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        isLoading={isTableLoading || loading}
        renderRow={renderTableRow}
        emptyMessage="Belum ada data master parameter."
      />

      {/* Modal Add / Edit Parameter */}
      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Tambah Master Parameter' : 'Edit Master Parameter'}
        isLoading={isSubmitLoading}
        onSubmit={handleSaveModal}
        submitText={modalMode === 'create' ? 'Simpan Parameter' : 'Update Parameter'}
        maxWidthClass="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-sm font-semibold text-gray-700">
              Kode Parameter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-control w-full h-[40px] p-2 text-sm rounded-lg uppercase"
              placeholder="Contoh: PH_TANAH"
              value={formValues.kode}
              onChange={(e) => setFormValues({ ...formValues, kode: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label text-sm font-semibold text-gray-700">
              Nama Parameter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-control w-full h-[40px] p-2 text-sm rounded-lg"
              placeholder="Contoh: pH Tanah"
              value={formValues.nama}
              onChange={(e) => setFormValues({ ...formValues, nama: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="form-label text-sm font-semibold text-gray-700">
              Nama Modul <span className="text-red-500">*</span>
            </label>
            <select
              className="form-select w-full h-[40px] p-2 text-sm rounded-lg"
              value={formValues.namaModul}
              onChange={(e) => setFormValues({ ...formValues, namaModul: e.target.value })}
              required
            >
              {PARAMETER_MODUL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              {formValues.namaModul &&
                !PARAMETER_MODUL_OPTIONS.some((opt) => opt.value === formValues.namaModul) && (
                  <option value={formValues.namaModul}>{formValues.namaModul}</option>
                )}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Pilihan modul: Off_Type, QC, VARIETAS, MONITORING_LAHAN.
            </p>
          </div>

          <div>
            <label className="form-label text-sm font-semibold text-gray-700">
              Tipe Nilai <span className="text-red-500">*</span>
            </label>
            <select
              className="form-select w-full h-[40px] p-2 text-sm rounded-lg"
              value={formValues.tipeNilai}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  tipeNilai: e.target.value as any,
                })
              }
            >
              <option value="NUMBER">NUMBER (Angka tunggal)</option>
              <option value="RANGE">RANGE (Rentang Min - Max)</option>
              <option value="OPTION">OPTION (Pilihan Dropdown)</option>
              <option value="TEXT">TEXT (Teks Bebas)</option>
              <option value="BOOLEAN">BOOLEAN (Ya / Tidak)</option>
            </select>
          </div>

          <div>
            <label className="form-label text-sm font-semibold text-gray-700">Satuan</label>
            <input
              type="text"
              className="form-control w-full h-[40px] p-2 text-sm rounded-lg"
              placeholder="Contoh: %, pH, HST, kg"
              value={formValues.satuan}
              onChange={(e) => setFormValues({ ...formValues, satuan: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label text-sm font-semibold text-gray-700">Batas Lulus (Batas Bawah / Minimal)</label>
            <input
              type="number"
              step="any"
              className="form-control w-full h-[40px] p-2 text-sm rounded-lg"
              placeholder="Contoh: 3 (opsional)"
              value={formValues.batasLulus}
              onChange={(e) => setFormValues({ ...formValues, batasLulus: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label text-sm font-semibold text-gray-700">Status</label>
            <select
              className="form-select w-full h-[40px] p-2 text-sm rounded-lg"
              value={formValues.status}
              onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
            >
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="form-label text-sm font-semibold text-gray-700">Deskripsi / Catatan</label>
            <textarea
              className="form-control w-full p-2 text-sm rounded-lg"
              rows={5}
              placeholder="Deskripsi singkat mengenai parameter ini..."
              value={formValues.deskripsi}
              onChange={(e) => setFormValues({ ...formValues, deskripsi: e.target.value })}
            />
          </div>
        </div>

        {/* Option Builder section if Tipe Nilai is OPTION */}
        {formValues.tipeNilai === 'OPTION' && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-800">Daftar Pilihan / Options</h4>
                <p className="text-xs text-gray-500">Tentukan opsi pilihan dropdown untuk parameter ini</p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary flex items-center gap-1 rounded-lg text-xs"
                onClick={handleAddOptionRow}
              >
                <i className="ri-add-line"></i> Tambah Opsi
              </button>
            </div>

            {formValues.options.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                Belum ada opsi. Klik tombol &quot;Tambah Opsi&quot; di atas.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {formValues.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200"
                  >
                    <span className="w-6 text-center font-bold text-gray-400 text-xs">{idx + 1}</span>
                    <input
                      type="text"
                      className="form-control form-control-sm rounded text-xs uppercase w-28"
                      placeholder="Kode"
                      value={opt.kode}
                      onChange={(e) => handleOptionChange(idx, 'kode', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm rounded text-xs flex-1"
                      placeholder="Nama Opsi (Contoh: Lonjong, Bulat)"
                      value={opt.nama}
                      onChange={(e) => handleOptionChange(idx, 'nama', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      step="any"
                      className="form-control form-control-sm rounded text-xs w-20"
                      placeholder="Bobot"
                      value={opt.bobot ?? 0}
                      onChange={(e) => handleOptionChange(idx, 'bobot', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-icon btn-danger-light rounded"
                      onClick={() => handleRemoveOptionRow(idx)}
                      title="Hapus Opsi"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CrudModal>
    </div>
  );
}
