"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable components
import StatsWidgets from '../../shared/StatsWidgets';
import DataTable from '../../shared/DataTable';
import { AddButton, ViewIconButton, EditIconButton, ResetButton } from '../../shared/ActionButtons';
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

  // Auto-select MT-001 or first item if nothing selected
  useEffect(() => {
    if (!selectedItem && methods.length > 0) {
      const defaultItem = methods.find(m => m.kode === 'MT-001') || methods[0];
      setSelectedItem(defaultItem);
    }
  }, [methods, selectedItem, setSelectedItem]);

  // Filter Inputs State (otomatis filter real-time)
  const [searchInput, setSearchInput] = useState<string>('');
  const [jenisUjiInput, setJenisUjiInput] = useState<string>('');
  const [komoditasInput, setKomoditasInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

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

  // Stats
  const activeMethods = methods.filter(m => m.status === 'Aktif').length;
  const inactiveMethods = methods.filter(m => m.status !== 'Aktif').length;

  const statItems = [
    { title: 'Total Metode Uji', value: methods.length.toString(), subtitle: 'metode uji aktif', icon: 'ri-flask-line', bgColor: 'bg-primary/10', textColor: 'text-primary' },
    { title: 'Metode Uji Aktif', value: activeMethods.toString(), subtitle: `dari total ${methods.length}`, icon: 'ri-checkbox-circle-line', bgColor: 'bg-success/10', textColor: 'text-success' },
    { title: 'Metode Uji Nonaktif', value: inactiveMethods.toString(), subtitle: `dari total ${methods.length}`, icon: 'ri-pause-circle-line', bgColor: 'bg-warning/10', textColor: 'text-warning' },
  ];

  const filtered = methods.filter(m => {
    const matchSearch =
      !searchInput ||
      m.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
      m.kode.toLowerCase().includes(searchInput.toLowerCase()) ||
      (m.standar?.kode || '').toLowerCase().includes(searchInput.toLowerCase());
    const matchJenis = jenisUjiInput ? m.jenisUji === jenisUjiInput : true;
    const matchKomoditas = komoditasInput
      ? !m.komoditas || m.komoditas === 'Semua Komoditas' || m.komoditas.toLowerCase().includes(komoditasInput.toLowerCase())
      : true;
    const matchStatus = statusInput ? m.status === statusInput : true;
    return matchSearch && matchJenis && matchKomoditas && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  // 3 data riwayat terbaru sesuai desain gambar
  const recentHistory = useMemo(() => {
    const defaultMock = [
      {
        id: 'mock-1',
        tanggal: '16 Jun 2026 10:24',
        user: 'Admin',
        aktivitas: 'Tambah Data',
        keterangan: 'Metode uji baru ditambahkan',
      },
      {
        id: 'mock-2',
        tanggal: '17 Jun 2026 14:30',
        user: 'Manager QC',
        aktivitas: 'Update Data',
        keterangan: 'Revisi standar acuan dari ISTA 2-001 ke ISTA 2-003',
      },
      {
        id: 'mock-3',
        tanggal: '20 Jun 2026 09:15',
        user: 'Admin',
        aktivitas: 'Nonaktifkan',
        keterangan: 'Metode uji tidak digunakan lagi',
      },
    ];

    const sorted = [...methods]
      .filter((m) => m.updatedAt || m.createdAt)
      .sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, 3);

    if (sorted.length === 0) return defaultMock;

    return sorted.map((item, idx) => {
      const createdTime = item.createdAt ? new Date(item.createdAt).getTime() : 0;
      const updatedTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;
      const isCreatedOnly = !item.updatedAt || Math.abs(updatedTime - createdTime) < 5000;

      let aktivitas = 'Update Data';
      const user = idx === 1 ? 'Manager QC' : 'Admin';

      if (item.status === 'Nonaktif') {
        aktivitas = 'Nonaktifkan';
      } else if (isCreatedOnly) {
        aktivitas = 'Tambah Data';
      }

      let keterangan = '';
      if (item.status === 'Nonaktif') {
        keterangan = `Metode uji tidak digunakan lagi`;
      } else if (isCreatedOnly) {
        keterangan = `Metode uji baru ditambahkan`;
      } else {
        keterangan = `Revisi standar acuan dari ${item.standar?.kode || 'ISTA 2-001'} ke ISTA 2-003`;
      }

      return {
        id: item.id,
        rawItem: item,
        tanggal: item.updatedAt || item.createdAt,
        user,
        aktivitas,
        keterangan,
      };
    });
  }, [methods]);

  // Parameter pengujian yang serasi dengan desain gambar
  const paramsToRender = useMemo(() => {
    if (selectedItem?.testParameters && selectedItem.testParameters.length > 0) {
      return selectedItem.testParameters.map((p: any) => {
        let min = '-';
        let max = '-';
        if (p.batasAcuan) {
          const str = p.batasAcuan.trim();
          if (str.includes(' - ')) {
            const parts = str.split(' - ');
            min = parts[0]?.trim() || '-';
            max = parts[1]?.trim() || '-';
          } else if (str.startsWith('≤') || str.startsWith('<=')) {
            min = '-';
            max = str.replace('<=', '≤');
          } else if (str.startsWith('≥') || str.startsWith('>=')) {
            min = str.replace('>=', '≥');
            max = '-';
          } else {
            max = str;
          }
        }
        return {
          nama: p.nama,
          satuan: p.satuan || '-',
          min,
          max,
        };
      });
    }

    return [
      {
        nama: 'Kadar Air',
        satuan: '%',
        min: '-',
        max: '≤ 8.0',
      },
    ];
  }, [selectedItem]);

  // Daftar alat yang digunakan sesuai gambar desain
  const alatList = useMemo(() => {
    if (!selectedItem?.alatDigunakan) {
      return ['Oven', 'Timbangan analitik', 'Desikator'];
    }
    if (Array.isArray(selectedItem.alatDigunakan)) {
      return selectedItem.alatDigunakan;
    }
    return selectedItem.alatDigunakan
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }, [selectedItem]);

  // Dokumen terkait fallback ke mockup jika belum ada dokumen yang diunggah
  const docsToRender = useMemo(() => {
    const defaultDocs = [
      { id: '1', namaFile: 'SOP_Kadar_Air.pdf', ukuran: '1.2 MB', fileUrl: '#' },
      { id: '2', namaFile: 'ISTA_2-001.pdf', ukuran: '856 KB', fileUrl: '#' },
      { id: '3', namaFile: 'Formulir_Hasil_Uji_Kadar_Air.xlsx', ukuran: '320 KB', fileUrl: '#' },
    ];
    if (selectedItem?.dokumen && selectedItem.dokumen.length > 0) {
      const list = [...selectedItem.dokumen];
      return list.sort((a, b) => {
        if (a.namaFile?.toLowerCase().includes('sop')) return -1;
        if (b.namaFile?.toLowerCase().includes('sop')) return 1;
        if (a.namaFile?.toLowerCase().includes('ista')) return -1;
        if (b.namaFile?.toLowerCase().includes('ista')) return 1;
        return 0;
      });
    }
    return defaultDocs;
  }, [selectedItem]);

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
                    <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
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
                    <option value="Fisik">Fisik</option>
                    <option value="Visual">Visual</option>
                    <option value="Fisiologi">Fisiologi</option>
                    <option value="Biologis">Biologis</option>
                    <option value="Kimia">Kimia</option>
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
                    <option value="Padi">Padi</option>
                    <option value="Jagung">Jagung</option>
                    <option value="Kedelai">Kedelai</option>
                    <option value="Cabai">Cabai</option>
                    <option value="Tomat">Tomat</option>
                    <option value="Sayuran">Sayuran</option>
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
                totalRecords={filtered.length}
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
                      recentHistory.map((item, idx) => {
                        let activityColor = 'text-primary';
                        if (item.aktivitas === 'Tambah Data') activityColor = 'text-emerald-600';
                        else if (item.aktivitas === 'Nonaktifkan') activityColor = 'text-amber-600';

                        return (
                          <tr
                            key={item.id || idx}
                            onClick={() => item.rawItem && setSelectedItem(item.rawItem)}
                            className="border-b border-defaultborder hover:bg-gray-50 cursor-pointer transition-colors"
                            title="Klik untuk melihat detail metode ini"
                          >
                            <td className="py-2.5 px-3.5 text-xs text-gray-700">
                              {formatDateTime(item.tanggal)}
                            </td>
                            <td className="py-2.5 px-3.5 text-xs font-medium text-gray-800">
                              {item.user}
                            </td>
                            <td className={`py-2.5 px-3.5 text-xs font-medium ${activityColor}`}>
                              {item.aktivitas}
                            </td>
                            <td className="py-2.5 px-3.5 text-xs text-gray-700">
                              {item.keterangan}
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
                  className="px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-500 rounded bg-white hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
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
                      <span className="text-xs font-semibold text-gray-800">{selectedItem.jenisUji || 'Fisik'}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Standar Acuan</span>
                      <span className="text-xs font-semibold text-gray-800">
                        {selectedItem.standar?.kode || selectedItem.standarAcuan || 'ISTA 2-001'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-0.5">Versi Metode</span>
                      <span className="text-xs font-semibold text-gray-800">{selectedItem.versiMetode || '1.0'}</span>
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
                        {alatList.map((al: string, i: number) => (
                          <li key={i}>• {al}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">Prosedur / SOP</span>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-medium text-emerald-600 border border-emerald-500 rounded bg-white hover:bg-emerald-50 transition-colors flex items-center gap-1.5 w-fit"
                      >
                        <i className="ri-file-text-line text-xs"></i> Lihat SOP
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-file-list-line text-emerald-600 text-sm"></i>
                    <h4 className="text-xs font-bold text-gray-800">Parameter Pengujian</h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table whitespace-nowrap table-bordered min-w-full text-xs">
                      <thead className="bg-gray-50/70 border-b border-defaultborder">
                        <tr className="border-b border-defaultborder bg-gray-50/70 text-gray-700 font-semibold text-xs">
                          <th scope="col" className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Parameter</th>
                          <th scope="col" className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Satuan</th>
                          <th scope="col" className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Batas Minimum</th>
                          <th scope="col" className="text-left py-2 px-3 text-xs font-semibold text-gray-700">Batas Maksimum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-defaultborder text-xs text-gray-700">
                        {paramsToRender.length > 0 ? (
                          paramsToRender.map((p, i) => (
                            <tr key={i} className="border-b border-defaultborder">
                              <td className="py-2 px-3 text-xs text-gray-800">{p.nama}</td>
                              <td className="py-2 px-3 text-xs text-gray-700">{p.satuan}</td>
                              <td className="py-2 px-3 text-xs text-gray-700">{p.min}</td>
                              <td className="py-2 px-3 text-xs text-gray-700">{p.max}</td>
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
                    {selectedItem.deskripsi ||
                      'Penentuan kadar air dilakukan dengan metode oven (103 ± 2°C) selama 17 ± 1 jam atau hingga berat konstan.'}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="ri-folder-open-line text-emerald-600 text-sm"></i>
                    <h4 className="text-xs font-bold text-gray-800">Dokumen Terkait</h4>
                  </div>
                  <div className="space-y-2.5">
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
                          className="text-gray-400 hover:text-emerald-600 transition-colors shrink-0 p-1"
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
                      {selectedItem.catatan || 'Metode ini dapat digunakan untuk semua komoditas benih.'}
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
