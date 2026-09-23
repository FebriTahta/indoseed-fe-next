"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets from '../../shared/StatsWidgets';
import DataTable from '../../shared/DataTable';
import { AddButton, EditButton, ManageButton, ViewIconButton, EditIconButton, ResetButton } from '../../shared/ActionButtons';
import QcPageHeader from '../shared/QcPageHeader';
import AddStandardMethodModal from './AddStandardMethodModal';
import { qcService } from '@/app/services/qcService';
import { useQC } from '@/app/hooks/useQC';

export default function StandarMetodeUjiPage() {
  const router = useRouter();
  const {
    loading,
    methods,
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
    fetchMethods,
    parameters
  } = useQC();

  // Force active tab to method
  useEffect(() => {
    setActiveTab('method');
  }, [setActiveTab]);

  // Kategori Filter State
  const [jenisUji, setJenisUji] = useState<string>('');
  const [komoditas, setKomoditas] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, jenisUji, komoditas, status]);

  // Stats
  const activeMethods = methods.filter(m => m.status === 'Aktif').length;
  const inactiveMethods = methods.filter(m => m.status !== 'Aktif').length;

  const statItems = [
    { title: 'Total Metode Uji', value: methods.length.toString(), subtitle: 'metode uji aktif', icon: 'ri-flask-line', bgColor: 'bg-primary/10', textColor: 'text-primary' },
    { title: 'Metode Uji Aktif', value: activeMethods.toString(), subtitle: `dari total ${methods.length}`, icon: 'ri-checkbox-circle-line', bgColor: 'bg-success/10', textColor: 'text-success' },
    { title: 'Metode Uji Nonaktif', value: inactiveMethods.toString(), subtitle: `dari total ${methods.length}`, icon: 'ri-pause-circle-line', bgColor: 'bg-warning/10', textColor: 'text-warning' },
  ];

  const filtered = methods.filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase()) || m.kode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? m.status === status : true;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Real data is now used instead of mock data

  return (
    <>
      <Seo title="Master Metode Uji" />
      <Pageheader currentpage="Master Metode Uji" activepage="Master Data" mainpage="QC & LAB" />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <QcPageHeader
        title="Master Metode Uji"
        description="Kelola data metode uji yang digunakan dalam proses pemeriksaan kualitas benih."
        icon="ri-flask-fill"
        iconBg="bg-primary/10"
        iconColor="text-primary"
        actionButtons={
          <>
            <AddButton
              onClick={() => router.push('/qc/standar-metode-uji/create')}
              label="Tambah Metode Uji"
            />
            <SpkButton variant="outline-primary" className="btn-sm flex items-center gap-2">
              <i className="ri-download-line text-sm"></i> Import
            </SpkButton>
          </>
        }
      />

      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className={`transition-all duration-300 ${selectedItem ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
          <div className="box">
            <div className="box-body">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                <div className="md:col-span-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="form-control text-sm h-[38px] w-full pr-10"
                      placeholder="Cari ..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Jenis Uji</label>
                  <select className="form-select text-sm h-[38px] w-full" value={jenisUji} onChange={(e) => setJenisUji(e.target.value)}>
                    <option value="">Semua Jenis</option>
                    <option value="Fisik">Fisik</option>
                    <option value="Visual">Visual</option>
                    <option value="Fisiologi">Fisiologi</option>
                    <option value="Biologis">Biologis</option>
                    <option value="Kimia">Kimia</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Komoditas</label>
                  <select className="form-select text-sm h-[38px] w-full" value={komoditas} onChange={(e) => setKomoditas(e.target.value)}>
                    <option value="">Semua Komoditas</option>
                    <option value="Padi">Padi</option>
                    <option value="Jagung">Jagung</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
                  <select className="form-select text-sm h-[38px] w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <ResetButton className="w-full h-[38px] py-0" onClick={() => { setSearch(''); setJenisUji(''); setKomoditas(''); setStatus(''); }} label="Reset" />
                </div>
              </div>

              <DataTable
                headers={[
                  <div key="cb" className="form-check"><input className="form-check-input" type="checkbox" /></div>,
                  'No', 'Kode Metode', 'Nama Metode Uji', 'Jenis Uji', 'Standar Acuan', 'Komoditas', 'Status', 'Aksi'
                ]}
                items={paginated}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                totalRecords={filtered.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                renderRow={(item, index) => {
                  return (
                    <tr key={item.id} className="border-b border-defaultborder">
                      <td className="p-3"><div className="form-check"><input className="form-check-input" type="checkbox" /></div></td>
                      <td className="p-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="p-3 text-sm text-primary font-medium">{item.kode}</td>
                      <td className="p-3 text-sm font-semibold text-gray-800">{item.nama}</td>
                      <td className="p-3 text-sm">{item.jenisUji || '-'}</td>
                      <td className="p-3 text-sm">{item.standar?.kode || '-'}</td>
                      <td className="p-3 text-sm">{item.komoditas || '-'}</td>
                      <td className="p-3 text-sm">
                        <span className={`badge bg-${item.status === 'Aktif' ? 'success' : 'danger'}/10 text-${item.status === 'Aktif' ? 'success' : 'danger'} rounded-full px-2 py-1 flex items-center gap-1 w-fit`}>
                          <i className={`text-xs ${item.status === 'Aktif' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}`}></i>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex gap-2">
                          <ViewIconButton onClick={() => setSelectedItem(item)} />
                          <EditIconButton onClick={() => router.push(`/qc/standar-metode-uji/edit/${item.id}`)} />
                        </div>
                      </td>
                    </tr>
                  );
                }}
              />
            </div>
          </div>

          <div className="box mt-6">
            <div className="box-header flex items-center gap-2">
              <i className="ri-history-line text-lg text-primary"></i>
              <h3 className="box-title text-base font-semibold">Riwayat Perubahan</h3>
            </div>
            <div className="box-body p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-defaultborder">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 p-3">Tanggal</th>
                      <th className="text-left text-xs font-semibold text-gray-500 p-3">User</th>
                      <th className="text-left text-xs font-semibold text-gray-500 p-3">Aktivitas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 p-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-defaultborder">
                      <td className="p-3 text-sm text-gray-600">16 Jun 2026 10:24</td>
                      <td className="p-3 text-sm font-medium text-primary">Admin</td>
                      <td className="p-3 text-sm">Tambah Data</td>
                      <td className="p-3 text-sm text-gray-600">Metode uji baru ditambahkan</td>
                    </tr>
                    <tr className="border-b border-defaultborder">
                      <td className="p-3 text-sm text-gray-600">17 Jun 2026 14:30</td>
                      <td className="p-3 text-sm font-medium text-primary">Manager QC</td>
                      <td className="p-3 text-sm">Update Data</td>
                      <td className="p-3 text-sm text-gray-600">Revisi standar acuan dari ISTA 2-001 ke ISTA 2-003</td>
                    </tr>
                    <tr>
                      <td className="p-3 text-sm text-gray-600">20 Jun 2026 09:15</td>
                      <td className="p-3 text-sm font-medium text-primary">Admin</td>
                      <td className="p-3 text-sm">Nonaktifkan</td>
                      <td className="p-3 text-sm text-gray-600">Metode uji tidak digunakan lagi</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {selectedItem && (
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="box h-full">
              <div className="box-header flex justify-between items-center border-b border-defaultborder pb-3">
                <div className="flex gap-2 items-center">
                  <i className="ri-flask-line text-xl text-primary bg-primary/10 p-1.5 rounded-md"></i>
                  <h3 className="box-title text-base font-semibold">Detail Metode Uji</h3>
                </div>
                <EditButton
                  label="Edit"
                  onClick={() => handleOpenEditModal(selectedItem)}
                  className="btn-sm"
                />
              </div>
              <div className="box-body space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Kode Metode</span>
                    <span className="text-sm font-semibold text-primary">{selectedItem.kode}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Komoditas</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedItem.komoditas || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Nama Metode Uji</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedItem.nama}</span>
                  </div>
                  <div className="row-span-2">
                    <span className="text-xs text-gray-500 block mb-1">Alat yang digunakan</span>
                    <ul className="text-sm text-gray-800 list-disc pl-4 space-y-1">
                      {selectedItem.alatDigunakan ? (
                        selectedItem.alatDigunakan.split(',').map((al: string, i: number) => (
                          <li key={i}>{al.trim()}</li>
                        ))
                      ) : (
                        <li className="text-gray-400">Belum ada data alat</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Jenis Uji</span>
                    <span className="text-sm font-semibold text-gray-800">{selectedItem.jenisUji || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Standar Acuan</span>
                    <span className="text-sm font-semibold text-primary">{selectedItem.standar?.kode || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Prosedur / SOP</span>
                    <SpkButton variant="outline-success" className="btn-sm mt-1 flex items-center gap-1 w-fit">
                      <i className="ri-file-text-line"></i> Lihat SOP
                    </SpkButton>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Versi Metode</span>
                    <span className="text-sm text-gray-800">{selectedItem.versiMetode || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Status</span>
                    <span className={`badge bg-${selectedItem.status === 'Aktif' ? 'success' : 'danger'}/10 text-${selectedItem.status === 'Aktif' ? 'success' : 'danger'} rounded-full px-2 py-1 flex items-center gap-1 w-fit mt-1`}>
                      <i className={`text-xs ${selectedItem.status === 'Aktif' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}`}></i>
                      {selectedItem.status}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-book-open-line text-success"></i>
                    <h4 className="text-sm font-semibold text-gray-800">Parameter Pengujian</h4>
                  </div>
                  <div className="table-responsive rounded-md border border-defaultborder">
                    <table className="table whitespace-nowrap min-w-full">
                      <thead className="bg-gray-50 border-b border-defaultborder">
                        <tr>
                          <th className="text-left text-xs font-semibold text-gray-500 p-2">Parameter</th>
                          <th className="text-left text-xs font-semibold text-gray-500 p-2">Satuan</th>
                          <th className="text-left text-xs font-semibold text-gray-500 p-2">Batas Minimum</th>
                          <th className="text-left text-xs font-semibold text-gray-500 p-2">Batas Maksimum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedItem.testParameters || []).length > 0 ? (
                          selectedItem.testParameters.map((p: any, i: number) => (
                            <tr key={i} className="border-b border-defaultborder last:border-0">
                              <td className="p-2 text-sm text-gray-800">{p.nama}</td>
                              <td className="p-2 text-sm text-gray-600">{p.satuan || '-'}</td>
                              <td colSpan={2} className="p-2 text-sm text-gray-600">{p.batasAcuan || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-sm text-gray-400">Belum ada parameter pengujian</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-file-list-3-line text-success"></i>
                    <h4 className="text-sm font-semibold text-gray-800">Deskripsi Metode</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedItem.deskripsi || 'Penentuan kadar air dilakukan dengan metode oven (103 ± 2°C) selama 17 ± 1 jam atau hingga berat konstan.'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <i className="ri-folder-open-line text-success"></i>
                    <h4 className="text-sm font-semibold text-gray-800">Dokumen Terkait</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-defaultborder rounded-md bg-gray-50">
                      <div className="flex items-center gap-2">
                        <i className="ri-file-pdf-fill text-danger text-xl"></i>
                        <div>
                          <div className="text-xs font-semibold text-gray-800">SOP_Kadar_Air.pdf</div>
                          <div className="text-xs text-gray-400">1.2 MB</div>
                        </div>
                      </div>
                      <i className="ri-download-2-line text-primary cursor-pointer"></i>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-defaultborder rounded-md bg-gray-50">
                      <div className="flex items-center gap-2">
                        <i className="ri-file-pdf-fill text-danger text-xl"></i>
                        <div>
                          <div className="text-xs font-semibold text-gray-800">ISTA_2-001.pdf</div>
                          <div className="text-xs text-gray-400">856 KB</div>
                        </div>
                      </div>
                      <i className="ri-download-2-line text-primary cursor-pointer"></i>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-defaultborder rounded-md bg-gray-50">
                      <div className="flex items-center gap-2">
                        <i className="ri-file-excel-fill text-success text-xl"></i>
                        <div>
                          <div className="text-xs font-semibold text-gray-800">Formulir_Hasil_Uji_Kadar_Air.xlsx</div>
                          <div className="text-xs text-gray-400">320 KB</div>
                        </div>
                      </div>
                      <i className="ri-download-2-line text-primary cursor-pointer"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-success/10 p-3 rounded-md flex gap-2">
                  <i className="ri-information-line text-success text-lg shrink-0"></i>
                  <div>
                    <h5 className="text-sm font-semibold text-success mb-1">Catatan</h5>
                    <p className="text-xs text-gray-600">{selectedItem.catatan || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddStandardMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedItem}
        onSubmit={(data) => {
          if (modalMode === 'edit') {
            handleUpdate(data, 'method');
          } else {
            handleCreate({ ...data, jenis: 'Metode Uji' }, 'method');
          }
        }}
      />
    </>
  );
}
