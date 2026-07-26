"use client"
import React, { useState, useMemo, useEffect } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets from '../../shared/StatsWidgets';
import DataTable from '../../shared/DataTable';
import { HistoryButton, AddButton, EditButton, ManageButton, ViewIconButton, EditIconButton } from '../../shared/ActionButtons';
// import DetailPanel, { TabConfig, DetailAction } from '../../shared/DetailPanel';
// import CrudModal from '../../shared/CrudModal';
// import FilterRow, { FilterSelectConfig } from '../../shared/FilterRow';
import AddParameterModal from './AddParameterModal';
import AddDocumentModal from './AddDocumentModal';
import AddStandardMethodModal from './AddStandardMethodModal';
import ManageMethodsModal from './ManageMethodsModal';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { qcService } from '@/app/services/qcService';

import { useQC } from '@/app/hooks/useQC';

export default function StandarMetodeUjiPage() {
  const {
    loading,
    standards,
    documentStandards,
    methods,
    parameters,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    selectedItem,
    setSelectedItem,
    search,
    setSearch,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchMethods,
    documents
  } = useQC();

  // Manage Methods modal state
  const [isManageMethodsOpen, setIsManageMethodsOpen] = useState(false);
  const [isSavingMethods, setIsSavingMethods] = useState(false);

  /** Save changes: update standarId on added/removed methods */
  const handleSaveMethods = async (added: string[], removed: string[]) => {
    setIsSavingMethods(true);
    try {
      await Promise.all([
        ...added.map((id) =>
          qcService.updateMethod(id, { standarId: selectedItem?.id })
        ),
        ...removed.map((id) =>
          qcService.updateMethod(id, { standarId: null })
        ),
      ]);
      await fetchMethods();
      setIsManageMethodsOpen(false);
    } catch (err: any) {
      // toast is handled inside qcService / useQC; surface here if needed
      console.error('Failed to save method links:', err);
    } finally {
      setIsSavingMethods(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedItem(null);
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Basic Stats
  let statItems = [];

  if (activeTab === 'document') {
    const activeDocs = documents.filter(d => d.status === 'Aktif').length;
    const expiredDocs = documents.filter(d => d.status === 'Kadaluarsa').length;
    statItems = [
      { title: 'Total Dokumen', value: documents.length.toString(), subtitle: 'Dokumen', icon: 'ri-folder-2-line', bgColor: 'bg-success/10', textColor: 'text-success' },
      { title: 'Dokumen Aktif', value: activeDocs.toString(), subtitle: 'Dokumen', icon: 'ri-folder-check-line', bgColor: 'bg-primary/10', textColor: 'text-primary' },
      { title: 'Dokumen Kadaluarsa', value: expiredDocs.toString(), subtitle: 'Dokumen', icon: 'ri-folder-warning-line', bgColor: 'bg-warning/10', textColor: 'text-warning' },
      { title: 'Terakhir Diperbarui', value: '16 Juni 2024', subtitle: 'Oleh Dewi Lestari', icon: 'ri-calendar-check-line', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    ];
  } else {
    statItems = [
      { title: 'Total Parameter Uji', value: parameters.length.toString(), subtitle: 'Parameter', icon: 'ri-book-open-line', bgColor: 'bg-success/10', textColor: 'text-success' },
      { title: 'Total Metode Uji', value: methods.length.toString(), subtitle: 'Metode', icon: 'ri-flask-line', bgColor: 'bg-primary/10', textColor: 'text-primary' },
      { title: 'Standar ISO Digunakan', value: standards.length.toString(), subtitle: 'Standar', icon: 'ri-shield-check-line', bgColor: 'bg-warning/10', textColor: 'text-warning' },
    ];
  }

  // Tab configurations
  const renderContent = () => {
    switch (activeTab) {
      case 'parameter': {
        const filtered = parameters.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()));
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return (
          <DataTable
            headers={['No', 'Parameter Uji', 'Kategori', 'Metode Default', 'Standar Acuan', 'Batas Acuan', 'Satuan', 'Status', 'Aksi']}
            items={paginated}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={filtered.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            renderRow={(item, index) => (
              <tr key={item.id} className="border-b border-defaultborder">
                <td className="p-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="p-3 text-sm font-semibold text-gray-800">{item.nama}</td>
                <td className="p-3 text-sm">{item.kategori || '-'}</td>
                <td className="p-3 text-sm">{item.metode?.kode || '-'}</td>
                <td className="p-3 text-sm">{item.standar?.nama || '-'}</td>
                <td className="p-3 text-sm">{item.batasAcuan || '-'}</td>
                <td className="p-3 text-sm">{item.satuan || '-'}</td>
                <td className="p-3 text-sm">
                  <span className={`badge bg-${item.status === 'Aktif' ? 'success' : 'danger'}/10 text-${item.status === 'Aktif' ? 'success' : 'danger'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    <ViewIconButton onClick={() => setSelectedItem(item)} />
                    <EditIconButton onClick={() => handleOpenEditModal(item)} />
                  </div>
                </td>
              </tr>
            )}
          />
        );
      }
      case 'method': {
        const filtered = methods.filter(m => m.nama.toLowerCase().includes(search.toLowerCase()) || m.kode.toLowerCase().includes(search.toLowerCase()));
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return (
          <DataTable
            headers={['No', 'Kode Metode', 'Nama Metode', 'Parameter Terkait', 'Standar Acuan', 'Deskripsi Singkat', 'Status', 'Aksi']}
            items={paginated}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={filtered.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            renderRow={(item, index) => (
              <tr key={item.id} className="border-b border-defaultborder">
                <td className="p-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="p-3 text-sm font-medium">{item.kode}</td>
                <td className="p-3 text-sm font-semibold text-gray-800">{item.nama}</td>
                <td className="p-3 text-sm">{item.testParameters && item.testParameters.length > 0 ? item.testParameters.map((p: any) => p.nama).join(', ') : '-'}</td>
                <td className="p-3 text-sm">{item.standar?.nama || '-'}</td>
                <td className="p-3 text-sm">{item.deskripsi || '-'}</td>
                <td className="p-3 text-sm">
                  <span className={`badge bg-${item.status === 'Aktif' ? 'success' : 'danger'}/10 text-${item.status === 'Aktif' ? 'success' : 'danger'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    <ViewIconButton onClick={() => setSelectedItem(item)} />
                    <EditIconButton onClick={() => handleOpenEditModal(item)} />
                  </div>
                </td>
              </tr>
            )}
          />
        );
      }
      case 'standard': {
        const filtered = standards.filter(s => s.nama.toLowerCase().includes(search.toLowerCase()) || s.kode.toLowerCase().includes(search.toLowerCase()));
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return (
          <DataTable
            headers={['No', 'Kode Standar', 'Nama Standar', 'Organisasi', 'Tahun', 'Deskripsi Singkat', 'Status', 'Aksi']}
            items={paginated}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={filtered.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            renderRow={(item, index) => (
              <tr key={item.id} className="border-b border-defaultborder">
                <td className="p-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="p-3 text-sm font-medium">{item.kode}</td>
                <td className="p-3 text-sm font-semibold text-gray-800">{item.nama}</td>
                <td className="p-3 text-sm">{item.organisasi || '-'}</td>
                <td className="p-3 text-sm">{item.versiTahun || '-'}</td>
                <td className="p-3 text-sm">{item.deskripsi || '-'}</td>
                <td className="p-3 text-sm">
                  <span className={`badge bg-${item.status === 'Aktif' ? 'success' : 'danger'}/10 text-${item.status === 'Aktif' ? 'success' : 'danger'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    <ViewIconButton onClick={() => setSelectedItem(item)} />
                    <EditIconButton onClick={() => handleOpenEditModal(item)} />
                  </div>
                </td>
              </tr>
            )}
          />
        );
      }
      case 'document': {
        const filtered = documents.filter(d => d.nama.toLowerCase().includes(search.toLowerCase()) || d.kode.toLowerCase().includes(search.toLowerCase()));
        const totalPages = Math.ceil(filtered.length / pageSize) || 1;
        const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

        return (
          <DataTable
            headers={['No', 'Kode Dokumen', 'Nama Dokumen', 'Kategori', 'Tipe File', 'Versi', 'Tanggal Berlaku', 'Status', 'Aksi']}
            items={paginated}
            currentPage={currentPage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={filtered.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            renderRow={(item, index) => (
              <tr key={item.id} className="border-b border-defaultborder">
                <td className="p-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="p-3 text-sm font-medium">{item.kode}</td>
                <td className="p-3 text-sm font-semibold text-gray-800">{item.nama}</td>
                <td className="p-3 text-sm">{item.kategori}</td>
                <td className="p-3 text-sm">
                  <div className={`flex items-center gap-1.5 font-medium ${(item.tipeFile || '').toUpperCase() === 'PDF' ? 'text-danger' :
                      (item.tipeFile || '').toUpperCase().startsWith('XLS') ? 'text-success' :
                        (item.tipeFile || '').toUpperCase().startsWith('DOC') ? 'text-primary' :
                          (item.tipeFile || '').toUpperCase().startsWith('PPT') ? 'text-warning' : 'text-gray-500'
                    }`}>
                    <i className={`text-lg ${(item.tipeFile || '').toUpperCase() === 'PDF' ? 'ri-file-pdf-line' :
                        (item.tipeFile || '').toUpperCase().startsWith('XLS') ? 'ri-file-excel-line' :
                          (item.tipeFile || '').toUpperCase().startsWith('DOC') ? 'ri-file-word-line' :
                            (item.tipeFile || '').toUpperCase().startsWith('PPT') ? 'ri-file-ppt-line' : 'ri-file-line'
                      }`}></i>
                    {item.tipeFile || 'Unknown'}
                  </div>
                </td>
                <td className="p-3 text-sm">{item.versi}</td>
                <td className="p-3 text-sm">{item.tanggalBerlaku ? format(new Date(item.tanggalBerlaku), 'dd MMM yyyy', { locale: id }) : '-'}</td>
                <td className="p-3 text-sm">
                  <span className={`badge bg-${item.status === 'Aktif' ? 'success' : 'danger'}/10 text-${item.status === 'Aktif' ? 'success' : 'danger'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-sm">
                  <div className="flex gap-2">
                    {item.fileUrl && (
                      <>
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded bg-gray-100 text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors" title="Preview Dokumen">
                          <i className="ri-eye-line text-sm"></i>
                        </a>
                        <a href={item.fileUrl} download={item.fileName || item.nama} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded bg-gray-100 text-gray-500 hover:text-success hover:bg-success/10 transition-colors" title="Unduh Dokumen">
                          <i className="ri-download-2-line text-sm"></i>
                        </a>
                      </>
                    )}
                    <EditIconButton onClick={() => handleOpenEditModal(item)} />
                  </div>
                </td>
              </tr>
            )}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <Seo title="Standar & Metode Uji" />
      <Pageheader currentpage="Standar & Metode Uji" activepage="Quality Control (QC)" mainpage="Standar & Metode Uji" />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Top Actions & Stats */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Standar & Metode Uji</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola standar acuan dan metode pengujian sesuai ISO</p>
        </div>
        <div className="flex gap-3">
          <HistoryButton />
          <AddButton
            onClick={handleOpenAddModal}
            label={`Tambah ${activeTab === 'parameter' ? 'Parameter' : activeTab === 'document' ? 'Dokumen' : 'Standar / Metode Uji'}`}
          />
        </div>
      </div>

      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className={`transition-all duration-300 ${(selectedItem || (activeTab === 'document' && !selectedItem)) ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
          <div className="box">
            <div className="!p-0 border-b-0 relative z-50">
              <div className="flex border-b border-defaultborder w-full">
                <button type="button" onClick={() => setActiveTab('parameter')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'parameter' ? 'border-success text-success' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Daftar Parameter Uji</button>
                <button type="button" onClick={() => setActiveTab('method')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'method' ? 'border-success text-success' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Metode Uji</button>
                <button type="button" onClick={() => setActiveTab('standard')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'standard' ? 'border-success text-success' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Standar Acuan</button>
                <button type="button" onClick={() => setActiveTab('document')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'document' ? 'border-success text-success' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Dokumen Pendukung</button>
              </div>
            </div>
            <div className="box-body">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <i className="ri-search-line text-gray-500"></i>
                  </div>
                  <input
                    type="text"
                    className="form-control pl-10"
                    placeholder="Cari parameter, metode, atau standar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <select className="form-select">
                    <option value="">Semua Kategori</option>
                    <option value="Fisiologis">Fisiologis</option>
                    <option value="Fisik">Fisik</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>

        {(selectedItem || (activeTab === 'document' && !selectedItem)) && (
          <div className="xl:col-span-4 flex flex-col gap-6">
            {selectedItem ? (
              <div className="box h-full">
                <div className="box-header flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="box-title text-base font-semibold">
                      {activeTab === 'parameter' ? 'Detail Parameter Uji' : activeTab === 'method' ? 'Detail Metode Uji' : activeTab === 'document' ? 'Detail Dokumen' : 'Detail Standar Acuan'}
                    </h3>
                    {(activeTab === 'standard' || activeTab === 'document') && selectedItem && (
                      <span className={`badge bg-${selectedItem.status === 'Aktif' ? 'success' : 'danger'}/10 text-${selectedItem.status === 'Aktif' ? 'success' : 'danger'}`}>
                        {selectedItem.status}
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-700 transition-colors" title="Tutup Detail">
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="box-body flex flex-col h-full">
                  {selectedItem ? (
                    <div className="space-y-4 flex-grow">
                      {activeTab !== 'standard' && activeTab !== 'document' && (
                        <>
                          <div>
                            <span className="text-xs text-gray-500 block">{activeTab === 'parameter' ? 'Parameter Uji' : 'Nama Metode'}</span>
                            <span className="text-sm font-semibold text-gray-800">{selectedItem.nama}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Kategori</span>
                            <span className="text-sm font-semibold text-gray-800">{selectedItem.kategori || '-'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Metode Default</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {selectedItem.metode?.kode ? `${selectedItem.metode.kode} - ${selectedItem.metode.nama}` : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Standar Acuan</span>
                            <span className="text-sm font-semibold text-gray-800">
                              {selectedItem.standar?.nama ? `${selectedItem.standar.nama} (${selectedItem.standar.deskripsi || ''})` : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Definisi</span>
                            <span className="text-sm text-gray-600">{selectedItem.definisi || '-'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Satuan</span>
                            <span className="text-sm font-semibold text-gray-800">{selectedItem.satuan || '-'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Batas Acuan</span>
                            <span className="text-sm font-semibold text-gray-800">{selectedItem.batasAcuan || '-'}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Keterangan</span>
                            <span className="text-sm text-gray-600">{selectedItem.keterangan || '-'}</span>
                          </div>
                          <div className="mt-auto pt-4">
                            <EditButton
                              label={`Edit ${activeTab === 'parameter' ? 'Parameter' : 'Metode'}`}
                              className="w-full"
                            />
                          </div>
                        </>
                      )}
                      {activeTab === 'standard' && (
                        <>
                          <div className="flex gap-4 items-center mb-4">
                            <div className="w-16 h-16 bg-[#00478F] text-white rounded-md flex items-center justify-center font-bold text-2xl italic">
                              {selectedItem.organisasi}
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-800">{selectedItem.kode}</div>
                              <div className="text-sm text-gray-600">{selectedItem.nama}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-gray-500">Organisasi</div>
                            <div className="col-span-2 text-gray-800">{selectedItem.organisasi}</div>

                            <div className="text-gray-500">Tahun</div>
                            <div className="col-span-2 text-gray-800">{selectedItem.versiTahun}</div>

                            <div className="text-gray-500">Jenis</div>
                            <div className="col-span-2 text-gray-800">{selectedItem.jenis || 'Standar Internasional'}</div>

                            <div className="text-gray-500">Bahasa</div>
                            <div className="col-span-2 text-gray-800">{selectedItem.bahasa || 'Inggris'}</div>

                            <div className="text-gray-500">Deskripsi Singkat</div>
                            <div className="col-span-2 text-gray-800">{selectedItem.deskripsi}</div>
                          </div>

                          <div className="mt-4">
                            <div className="text-xs text-gray-500 mb-1">Dokumen</div>
                            {selectedItem.document ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 border border-defaultborder rounded-md bg-gray-50">
                                  <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                      <i className={`text-xl ${(selectedItem.document.tipeFile || '').toUpperCase() === 'PDF' ? 'ri-file-pdf-fill text-danger' :
                                          (selectedItem.document.tipeFile || '').toUpperCase().startsWith('DOC') ? 'ri-file-word-fill text-primary' :
                                            (selectedItem.document.tipeFile || '').toUpperCase().startsWith('XLS') ? 'ri-file-excel-fill text-success' :
                                              (selectedItem.document.tipeFile || '').toUpperCase().startsWith('PPT') ? 'ri-file-ppt-fill text-warning' :
                                                'ri-file-fill text-gray-500'
                                        }`}></i>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-sm font-medium text-gray-800 truncate">{selectedItem.document.fileName || selectedItem.document.nama}</div>
                                      <div className="text-xs text-gray-500 flex gap-2">
                                        <span>{selectedItem.document.tipeFile || 'Unknown format'}</span>
                                        {selectedItem.document.fileSize && <span>• {selectedItem.document.fileSize}</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {selectedItem.document.fileUrl && (
                                      <>
                                        <a href={selectedItem.document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors" title="Preview Dokumen">
                                          <i className="ri-eye-line text-lg"></i>
                                        </a>
                                        <a href={selectedItem.document.fileUrl} download={selectedItem.document.fileName || selectedItem.document.nama} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-success transition-colors" title="Unduh Dokumen">
                                          <i className="ri-download-2-line text-lg"></i>
                                        </a>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic p-3 border border-dashed border-gray-300 rounded-md bg-gray-50">
                                Tidak ada dokumen pendukung.
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-sm mt-4">
                            <div className="text-gray-500">Tanggal Berlaku</div>
                            <div className="col-span-2 text-gray-800">01 Januari {selectedItem.versiTahun || 2023}</div>

                            <div className="text-gray-500">Revisi Terakhir</div>
                            <div className="col-span-2 text-gray-800">16 Juni 2024 oleh Dewi Lestari</div>
                          </div>

                          <div className="mt-6 border-t pt-4">
                            {/* Live list of linked methods */}
                            {(() => {
                              const linked = methods.filter(
                                (m) => m.standarId === selectedItem.id
                              );
                              return linked.length > 0 ? (
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 font-medium">
                                      Metode Uji dalam Standar Ini
                                    </span>
                                    <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-semibold">
                                      Total {linked.length} Metode
                                    </span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {linked.map((m) => (
                                      <div
                                        key={m.id}
                                        className="flex items-center justify-between p-2 rounded-md bg-gray-50 border border-defaultborder"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <i className="ri-flask-line text-success text-base shrink-0" />
                                          <div className="min-w-0">
                                            <div className="text-xs font-semibold text-gray-800 truncate">
                                              {m.nama}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                              {m.kode}
                                            </div>
                                          </div>
                                        </div>
                                        <span
                                          className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${m.status === 'Aktif'
                                            ? 'bg-success/10 text-success'
                                            : 'bg-danger/10 text-danger'
                                            }`}
                                        >
                                          {m.status}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-4 text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-md border border-dashed border-gray-200">
                                  <i className="ri-flask-line block text-xl mb-1 text-gray-300" />
                                  Belum ada metode yang terhubung
                                </div>
                              );
                            })()}
                            <ManageButton
                              label="Kelola Metode dalam Standar Ini"
                              className="w-full"
                              onClick={() => setIsManageMethodsOpen(true)}
                            />
                          </div>
                        </>
                      )}
                      {activeTab === 'document' && (
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs text-gray-500 block">Kode Dokumen</span>
                            <span className="text-sm font-semibold">{selectedItem.kode}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Nama Dokumen</span>
                            <span className="text-sm font-semibold">{selectedItem.nama}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Kategori</span>
                            <span className="text-sm text-gray-800">{selectedItem.kategori}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Versi</span>
                            <span className="text-sm text-gray-800">{selectedItem.versi}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">Tanggal Berlaku</span>
                            <span className="text-sm text-gray-800">{selectedItem.tanggalBerlaku ? format(new Date(selectedItem.tanggalBerlaku), 'dd MMMM yyyy', { locale: id }) : '-'}</span>
                          </div>
                          <div className="mt-auto pt-4">
                            <EditButton
                              label="Edit Dokumen"
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-10 flex flex-col items-center justify-center h-full">
                      <i className="ri-information-line text-4xl mb-2 text-gray-300"></i>
                      <p>Pilih item untuk melihat detail</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="box h-full flex flex-col">
                <div className="box-header flex justify-between items-center border-b border-defaultborder pb-3">
                  <h3 className="box-title text-base font-semibold">
                    Standar Acuan (Terkait Dokumen)
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">Total {documentStandards.length} Standar</span>
                </div>
                <div className="box-body flex-grow overflow-y-auto p-4 space-y-3">
                  {documentStandards.length > 0 ? (
                    documentStandards.map(s => (
                      <div key={s.id} className="p-3 border border-defaultborder rounded-md bg-white hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0">
                          <i className="ri-file-text-line text-xl"></i>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-800 truncate">{s.kode}</div>
                          <div className="text-xs text-gray-500 truncate">{s.nama}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{s.organisasi} • {s.versiTahun}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                          {s.status}
                        </span>
                        <i className="ri-arrow-right-s-line text-gray-400 text-lg"></i>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 text-center italic p-4">
                      Belum ada standar acuan yang memiliki dokumen.
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-defaultborder bg-white mt-auto">
                  <button type="button" onClick={() => setActiveTab('standard')} className="w-full py-2 px-4 rounded-md border border-success text-success hover:bg-success hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2">
                    <i className="ri-settings-3-line"></i> Kelola Standar Acuan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === 'parameter' ? (
        <AddParameterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          initialData={selectedItem}
          onSubmit={(data) => {
            if (modalMode === 'edit') {
              handleUpdate(data);
            } else {
              handleCreate(data);
            }
          }}
          methods={methods}
          standards={standards}
        />
      ) : activeTab === 'document' ? (
        <AddDocumentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          initialData={selectedItem}
          onSubmit={(data) => {
            if (modalMode === 'edit') {
              handleUpdate(data);
            } else {
              handleCreate(data);
            }
          }}
          standards={standards}
          methods={methods}
        />
      ) : (
        <AddStandardMethodModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          initialData={selectedItem}
          documents={documents}
          onSubmit={(data) => {
            if (modalMode === 'edit') {
              handleUpdate(data);
            } else {
              handleCreate(data);
            }
          }}
        />
      )}

      {/* Manage Methods Modal — always rendered, shown when isManageMethodsOpen */}
      <ManageMethodsModal
        isOpen={isManageMethodsOpen}
        onClose={() => setIsManageMethodsOpen(false)}
        standard={selectedItem}
        allMethods={methods}
        onSave={handleSaveMethods}
        isSaving={isSavingMethods}
      />
    </>
  );
}
