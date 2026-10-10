"use client";
import { buttonClass, iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets from '../../shared/StatsWidgets';
import DataTable from '../../shared/DataTable';
import { AddButton, ViewIconButton, EditIconButton, ResetButton } from '../../shared/ActionButtons';
import QcPageHeader from '../shared/QcPageHeader';
import AddStandardMethodModal from './AddStandardMethodModal';
import { qcService } from '@/app/services/qcService';
import { useQC } from '@/app/hooks/useQC';
import { useKomoditasOptions, useQcLookups } from '@/app/hooks/useQcReference';
import { TestMethodRiwayat, TestParameter } from '@/app/types/qc';
import { parseBatasAcuan } from '@/app/lib/batasAcuan';

const OPERATOR_LABEL: Record<string, string> = {
  '=': 'samadengan (=)',
  '<': 'lebih kecil (<)',
  '>': 'lebih besar (>)',
  '<=': 'lebih kecil daripada samadengan (≤)',
  '>=': 'lebih besar daripada samadengan (≥)',
  range: 'rentang (min - maks)',
};

const describeOperator = (batas?: string | null) => {
  const parsed = parseBatasAcuan(batas);
  return parsed ? OPERATOR_LABEL[parsed.operator] : batas ? 'kualitatif' : '-';
};

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

  const { options: lookupOptions } = useQcLookups(['JENIS_UJI']);
  const { options: komoditasOptions } = useKomoditasOptions();

  // Filter Inputs State
  const [searchInput, setSearchInput] = useState<string>('');
  const [jenisUjiInput, setJenisUjiInput] = useState<string>('');
  const [komoditasInput, setKomoditasInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Debounced server-side fetch untuk pencarian & filter dengan order by updatedAt desc
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMethods({
        search: searchInput.trim() || undefined,
        jenisUji: jenisUjiInput || undefined,
        komoditas: komoditasInput || undefined,
        status: statusInput || undefined,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, jenisUjiInput, komoditasInput, statusInput]);

  // Otomatis reset pagination ke halaman 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, jenisUjiInput, komoditasInput, statusInput]);

  const handleResetFilter = () => {
    setSearchInput('');
    setJenisUjiInput('');
    setKomoditasInput('');
    setStatusInput('');
    setCurrentPage(1);
  };

  // Urutkan data secara deterministik berdasarkan updatedAt descending
  const sortedMethods = useMemo(() => {
    return [...methods].sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }, [methods]);

  // Auto-select item pertama jika belum ada yang terpilih atau item sebelumnya hilang dari filter
  useEffect(() => {
    if (sortedMethods.length > 0) {
      if (!selectedItem || !sortedMethods.some(m => m.id === selectedItem.id)) {
        setSelectedItem(sortedMethods[0]);
      }
    } else {
      setSelectedItem(null);
    }
  }, [sortedMethods, selectedItem, setSelectedItem]);

  // Stats
  const activeMethods = sortedMethods.filter(m => m.status === 'Aktif').length;
  const inactiveMethods = sortedMethods.filter(m => m.status !== 'Aktif').length;

  const statItems = [
    { title: 'Total Metode Uji', value: sortedMethods.length.toString(), subtitle: 'metode uji aktif', icon: 'ri-flask-line', bgColor: 'bg-primary/10', textColor: 'text-primary' },
    { title: 'Metode Uji Aktif', value: activeMethods.toString(), subtitle: `dari total ${sortedMethods.length}`, icon: 'ri-checkbox-circle-line', bgColor: 'bg-success/10', textColor: 'text-success' },
    { title: 'Metode Uji Nonaktif', value: inactiveMethods.toString(), subtitle: `dari total ${sortedMethods.length}`, icon: 'ri-pause-circle-line', bgColor: 'bg-warning/10', textColor: 'text-warning' },
  ];

  const totalPages = Math.ceil(sortedMethods.length / pageSize) || 1;
  const paginated = sortedMethods.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Formatter tanggal yang deterministik
  const formatDateTime = (dateStr?: string | Date) => {
    if (!dateStr) return '-';
    if (typeof dateStr === 'string' && /^\d{2}\s[A-Za-z]{3}\s\d{4}\s\d{2}:\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return typeof dateStr === 'string' ? dateStr : '-';
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  // Riwayat perubahan terbaru dari tabel test_method_riwayat
  const [recentHistory, setRecentHistory] = useState<TestMethodRiwayat[]>([]);
  useEffect(() => {
    qcService
      .getMethodRiwayat(5)
      .then((res) => setRecentHistory(res.data || []))
      .catch((err) => console.error('Gagal memuat riwayat metode uji:', err));
  }, [methods]);

  // Parameter metode beserta label operator batas acuan (baca saja; ubah lewat form edit)
  const paramsToRender = useMemo(
    () =>
      (selectedItem?.testParameters || []).map((p: TestParameter) => ({
        id: p.id,
        nama: p.nama,
        satuan: p.satuan || '-',
        operatorLabel: describeOperator(p.batasAcuan),
        patokan: p.batasAcuan ? `${p.batasAcuan} ${p.satuan && p.satuan !== '-' ? p.satuan : ''}`.trim() : '-',
      })),
    [selectedItem]
  );

  const alatList: string[] = useMemo(
    () =>
      (selectedItem?.alatDigunakan || '')
        .split(/[,\n]/)
        .map((s: string) => s.trim())
        .filter(Boolean),
    [selectedItem]
  );

  const docsToRender = selectedItem?.dokumen || [];
  const sopDoc = docsToRender.find((d: any) => d.namaFile?.toLowerCase().includes('sop')) || docsToRender[0];

  return (
    <>
      <Seo title="Master Metode Uji" />
      <Pageheader currentpage="Master Metode Uji" activepage="Master Data" mainpage="QC & LAB" />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} style={{ zIndex: 10050 }} />

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
          </>
        }
      />

      <StatsWidgets items={statItems} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
        <div className={`transition-all duration-300 ${selectedItem ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
          <div className="box">
            <div className="box-body">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mb-4">
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Pencarian</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="form-control text-sm h-[38px] w-full pr-10"
                      placeholder="Cari ..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {loading ? (
                      <i className="ri-loader-4-line animate-spin absolute right-3 top-2.5 text-primary"></i>
                    ) : (
                      <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Jenis Uji</label>
                  <select
                    className="form-select text-sm h-[38px] w-full"
                    value={jenisUjiInput}
                    onChange={(e) => setJenisUjiInput(e.target.value)}
                  >
                    <option value="">Semua Jenis</option>
                    {lookupOptions('JENIS_UJI').map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Komoditas</label>
                  <select
                    className="form-select text-sm h-[38px] w-full"
                    value={komoditasInput}
                    onChange={(e) => setKomoditasInput(e.target.value)}
                  >
                    <option value="">Semua Komoditas</option>
                    {komoditasOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
                  <select
                    className="form-select text-sm h-[38px] w-full"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <ResetButton
                    className="w-full h-[38px] !py-0 !text-xs"
                    onClick={handleResetFilter}
                    label="Reset Filter"
                  />
                </div>
              </div>

              <DataTable
                headers={[
                  'No', 'Kode Metode', 'Nama Metode Uji', 'Jenis Uji', 'Standar Acuan', 'Komoditas', 'Status', 'Aksi'
                ]}
                items={paginated}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                totalRecords={sortedMethods.length}
                headerTextSize="12px"
                bodyTextSize="10px"
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                renderRow={(item, index) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`border-b border-defaultborder cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50'
                        }`}
                    >
                      <td className="p-3 text-sm">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="p-3 text-sm text-primary font-medium">{item.kode}</td>
                      <td className="p-3 text-sm font-semibold text-gray-800">{item.nama}</td>
                      <td className="p-3 text-sm">{item.jenisUji || '-'}</td>
                      <td className="p-3 text-sm">{item.standar?.kode || '-'}</td>
                      <td className="p-3 text-sm">{item.komoditas || 'Semua Komoditas'}</td>
                      <td className="p-3 text-sm">
                        <span className={`badge bg-${item.status === 'Aktif' ? 'success' : 'danger'}/10 text-${item.status === 'Aktif' ? 'success' : 'danger'} rounded-full px-2 py-1 flex items-center gap-1 w-fit`}>
                          <i className={`text-xs ${item.status === 'Aktif' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}`}></i>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm" onClick={(e) => e.stopPropagation()}>
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
            <div className="box-header flex items-center justify-between py-2.5 px-4">
              <div className="flex items-center gap-2">
                <i className="ri-time-line text-lg text-emerald-600"></i>
                <h6 className="box-title text-sm font-bold text-gray-800">Riwayat Perubahan</h6>
              </div>
            </div>
            <div className="box-body p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap table-bordered min-w-full">
                  <thead className="bg-gray-50/70 border-b border-defaultborder">
                    <tr className="border-b border-defaultborder bg-gray-50/70 text-gray-700 font-semibold text-xs">
                      <th scope="col" className="text-start py-2.5 px-3.5 text-xs font-semibold text-gray-700">Tanggal</th>
                      <th scope="col" className="text-start py-2.5 px-3.5 text-xs font-semibold text-gray-700">User</th>
                      <th scope="col" className="text-start py-2.5 px-3.5 text-xs font-semibold text-gray-700">Aktivitas</th>
                      <th scope="col" className="text-start py-2.5 px-3.5 text-xs font-semibold text-gray-700">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-defaultborder text-xs text-gray-700">
                    {recentHistory.length > 0 ? (
                      recentHistory.map((item) => {
                        let activityColor = 'text-primary';
                        if (item.aksi === 'Tambah Data') activityColor = 'text-emerald-600';
                        else if (item.aksi === 'Nonaktifkan') activityColor = 'text-amber-600';
                        const method = methods.find((m) => m.id === item.testMethodId);

                        return (
                          <tr
                            key={item.id}
                            onClick={() => method && setSelectedItem(method)}
                            className="border-b border-defaultborder hover:bg-gray-50 cursor-pointer transition-colors"
                            title="Klik untuk melihat detail metode ini"
                          >
                            <td className="py-2.5 px-3.5 text-xs text-gray-700">
                              {formatDateTime(item.createdAt)}
                            </td>
                            <td className="py-2.5 px-3.5 text-xs font-medium text-gray-800">
                              {item.oleh || '-'}
                            </td>
                            <td className={`py-2.5 px-3.5 text-xs font-medium ${activityColor}`}>
                              {item.aksi}
                            </td>
                            <td className="py-2.5 px-3.5 text-xs text-gray-700">
                              <span className="font-semibold">{item.testMethod?.kode}</span> {item.keterangan || ''}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 px-3.5 text-center text-xs text-gray-400">
                          Belum ada riwayat perubahan metode uji
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {selectedItem && (
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="box h-full">
              <div className="box-header flex justify-between items-center border-b border-defaultborder py-3 px-4">
                <div className="flex gap-2 items-center">
                  <i className="ri-flask-line text-lg text-emerald-600"></i>
                  <h3 className="box-title text-sm font-bold text-gray-800">Detail Metode Uji</h3>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/qc/standar-metode-uji/edit/${selectedItem.id}`)}
                  className={buttonClass("outline", "sm")}
                >
                  <i className="ri-edit-line text-xs"></i> Edit
                </button>
              </div>
              <div className="box-body p-4 space-y-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Kode Metode</span>
                      <span className="text-xs font-semibold text-gray-800">{selectedItem.kode}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Nama Metode Uji</span>
                      <span className="text-xs font-semibold text-gray-800">{selectedItem.nama}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Jenis Uji</span>
                      <span className="text-xs font-semibold text-gray-800">{selectedItem.jenisUji || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Standar Acuan</span>
                      <span className="text-xs font-semibold text-gray-800">
                        {selectedItem.standar ? `${selectedItem.standar.kode} - ${selectedItem.standar.nama}` : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Versi Metode</span>
                      <span className="text-xs font-semibold text-gray-800">{selectedItem.versiMetode || '-'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Status</span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          selectedItem.status === 'Nonaktif'
                            ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            selectedItem.status === 'Nonaktif' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        ></span>
                        {selectedItem.status || 'Aktif'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Komoditas</span>
                      <span className="text-xs font-semibold text-gray-800">
                        {selectedItem.komoditas || 'Semua Komoditas'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Alat yang Digunakan</span>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {alatList.length === 0 && <li>-</li>}
                        {alatList.map((al: string, i: number) => (
                          <li key={i}>• {al}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Prosedur / SOP</span>
                      {sopDoc ? (
                        <a
                          href={sopDoc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonClass("outline", "sm", "w-fit")}
                        >
                          <i className="ri-file-text-line text-xs"></i> Lihat SOP
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Belum ada dokumen SOP</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <i className="ri-flask-line text-emerald-600 text-sm"></i>
                      <h4 className="text-xs font-bold text-gray-800">Parameter Pengujian</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push(`/qc/standar-metode-uji/edit/${selectedItem.id}`)}
                      className={buttonClass("ghost", "sm")}
                      title="Edit parameter & nilai patokan"
                    >
                      <i className="ri-edit-line text-xs"></i> Kelola Parameter
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table whitespace-nowrap table-bordered min-w-full text-xs">
                      <thead className="bg-gray-50/70 border-b border-defaultborder">
                        <tr className="border-b border-defaultborder bg-gray-50/70 text-gray-700 font-semibold text-xs">
                          <th scope="col" className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Parameter</th>
                          <th scope="col" className="text-center py-2 px-2 text-xs font-semibold text-gray-700">Satuan</th>
                          <th scope="col" className="text-left py-2 px-2 text-xs font-semibold text-gray-700 min-w-[140px]">Opsi Operator</th>
                          <th scope="col" className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Patokan Standar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-defaultborder text-xs text-gray-700">
                        {paramsToRender.length > 0 ? (
                          paramsToRender.map((p: any) => (
                            <tr key={p.id} className="border-b border-defaultborder hover:bg-gray-50/50">
                              <td className="py-2.5 px-3 text-xs font-medium text-gray-800">{p.nama}</td>
                              <td className="py-2.5 px-2 text-xs text-center text-gray-600 font-mono">{p.satuan}</td>
                              <td className="py-2 px-2 text-xs">
                                {p.operatorLabel}
                              </td>
                              <td className="py-2.5 px-3 text-xs font-semibold text-gray-800">
                                {p.patokan}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-3 px-3 text-center text-xs text-gray-400">
                              Belum ada parameter pengujian
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-file-text-line text-emerald-600 text-sm"></i>
                    <h4 className="text-xs font-bold text-gray-800">Deskripsi Metode</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedItem.deskripsi || '-'}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-folder-open-line text-emerald-600 text-sm"></i>
                    <h4 className="text-xs font-bold text-gray-800">Dokumen Terkait</h4>
                  </div>
                  <div className="space-y-2.5">
                    {docsToRender.length === 0 && <p className="text-xs text-gray-400">Belum ada dokumen terkait.</p>}
                    {docsToRender.map((doc: any, idx: number) => (
                      <div key={doc.id || idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <i className="ri-file-text-line text-emerald-600 text-lg shrink-0"></i>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-gray-800 truncate" title={doc.namaFile}>
                              {doc.namaFile}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {doc.ukuran || '-'}
                            </div>
                          </div>
                        </div>
                        <a
                          href={doc.fileUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={iconButtonClass("emerald")}
                          title="Unduh Berkas"
                        >
                          <i className="ri-download-2-line text-base"></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-lg p-3 flex gap-2.5 items-start mt-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    i
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-emerald-800 mb-0.5">Catatan</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedItem.catatan || '-'}
                    </p>
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
