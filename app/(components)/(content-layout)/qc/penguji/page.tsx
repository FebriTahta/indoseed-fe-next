"use client";

import React, { useState, useEffect } from 'react';
import Seo from '@/shared/layouts-components/seo/seo';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Link from 'next/link';
import { pengujiService } from '@/shared/services/pengujiService';
import PengujiFormModal from './PengujiFormModal';
import { 
  AddButton, 
  EditIconButton,
  DeleteIconButton, 
  ExportButton, 
  FilterButton,
  ResetButton 
} from '@/app/(components)/(content-layout)/shared/ActionButtons';
import QcPageHeader from '../shared/QcPageHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PengujiPage() {
  const [stats, setStats] = useState<any>({
    total: 0,
    aktif: 0,
    nonaktif: 0,
    bersertifikat: 0,
    akanExpired: 0
  });

  const [pengujiList, setPengujiList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentPenguji, setCurrentPenguji] = useState<any>(null);

  // Reference Data State
  const [laboratoriums, setLaboratoriums] = useState<any[]>([]);
  const [testMethods, setTestMethods] = useState<any[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [labFilter, setLabFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await pengujiService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [labRes, methodRes] = await Promise.all([
        pengujiService.getLaboratoriums(),
        pengujiService.getTestMethods()
      ]);
      if (labRes.status === 'success') {
        setLaboratoriums(labRes.data);
      }
      if (methodRes.status === 'success') {
        setTestMethods(methodRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch reference data", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await pengujiService.getPenguji({
        search,
        status: statusFilter,
        laboratoriumId: labFilter,
        testMethodId: methodFilter,
        page,
        limit: pageSize
      });

      if (res.success) {
        setPengujiList(res.data);
        setTotalItems(res.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchReferenceData();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, labFilter, methodFilter]);

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, labFilter, methodFilter, page, pageSize]);

  const handleResetFilter = () => {
    setSearch('');
    setStatusFilter('');
    setLabFilter('');
    setMethodFilter('');
    setPage(1);
  };

  // Helper colors for methods based on reference image
  const methodColors: Record<string, string> = {
    'Daya Tumbuh': 'bg-success/10 text-success',
    'Kadar Air': 'bg-info/10 text-info',
    'Kemurnian': 'bg-purple-100 text-purple-700',
    'Vigor': 'bg-success/10 text-success'
  };

  return (
    <>
      <ToastContainer />
      <Seo title="Penguji QC" />
      <Pageheader currentpage="Penguji" activepage="Quality Control (QC)" mainpage="Penguji" />

      {/* HEADER SECTION */}
      <QcPageHeader
        title="Penguji"
        description="Kelola data penguji yang bertugas melakukan pengujian benih di laboratorium dan lapangan."
        actionButtons={
          <>
            <AddButton 
              onClick={() => {
                setModalMode('add');
                setCurrentPenguji(null);
                setIsModalOpen(true);
              }} 
              label="Tambah Penguji" 
            />
            <ExportButton />
          </>
        }
      />

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="box shadow-sm mb-0">
          <div className="box-body p-4 flex items-center gap-4">
            <div className="avatar avatar-lg bg-primary/10 text-primary rounded-full">
              <i className="ri-group-line text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Penguji</p>
              <h4 className="font-bold text-2xl mb-1">{stats.total}</h4>
              <p className="text-xs text-gray-500">Penguji Aktif</p>
            </div>
          </div>
        </div>
        <div className="box shadow-sm mb-0">
          <div className="box-body p-4 flex items-center gap-4">
            <div className="avatar avatar-lg bg-success/10 text-success rounded-full">
              <i className="ri-user-follow-line text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Penguji Aktif</p>
              <h4 className="font-bold text-2xl mb-1">{stats.aktif}</h4>
              <p className="text-xs text-gray-500">{stats.total > 0 ? ((stats.aktif / stats.total) * 100).toFixed(2) : 0}%</p>
            </div>
          </div>
        </div>
        <div className="box shadow-sm mb-0">
          <div className="box-body p-4 flex items-center gap-4">
            <div className="avatar avatar-lg bg-danger/10 text-danger rounded-full">
              <i className="ri-user-unfollow-line text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Penguji Nonaktif</p>
              <h4 className="font-bold text-2xl mb-1">{stats.nonaktif}</h4>
              <p className="text-xs text-gray-500">{stats.total > 0 ? ((stats.nonaktif / stats.total) * 100).toFixed(2) : 0}%</p>
            </div>
          </div>
        </div>
        <div className="box shadow-sm mb-0">
          <div className="box-body p-4 flex items-center gap-4">
            <div className="avatar avatar-lg bg-success/10 text-success rounded-full">
              <i className="ri-verified-badge-line text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Bersertifikat</p>
              <h4 className="font-bold text-2xl mb-1">{stats.bersertifikat}</h4>
              <p className="text-xs text-gray-500">{stats.total > 0 ? ((stats.bersertifikat / stats.total) * 100).toFixed(2) : 0}%</p>
            </div>
          </div>
        </div>
        <div className="box shadow-sm mb-0">
          <div className="box-body p-4 flex items-center gap-4">
            <div className="avatar avatar-lg bg-warning/10 text-warning rounded-full">
              <i className="ri-calendar-event-line text-2xl"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">Akan Expired</p>
              <h4 className="font-bold text-2xl mb-1">{stats.akanExpired}</h4>
              <p className="text-xs text-gray-500">Dalam 30 hari</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR & TABLE */}
      <div className="box shadow-sm">
        <div className="box-header border-b border-gray-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Pencarian</label>
              <div className="relative">
                <input
                  type="text"
                  className="form-control text-sm h-[38px] w-full"
                  placeholder="Cari penguji, kode, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
              <select className="form-select text-sm h-[38px] w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Laboratorium</label>
              <select className="form-select text-sm h-[38px] w-full" value={labFilter} onChange={(e) => setLabFilter(e.target.value)}>
                <option value="">Semua Laboratorium</option>
                {laboratoriums.map((l) => (
                  <option key={l.id} value={l.id}>{l.namaLaboratorium}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Metode Uji</label>
              <select className="form-select text-sm h-[38px] w-full" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
                <option value="">Semua Metode Uji</option>
                {testMethods.map((m) => (
                  <option key={m.id} value={m.id}>{m.nama}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <ResetButton className="w-full h-[38px] py-0" onClick={handleResetFilter} label="Reset Filter" />
            </div>
          </div>
        </div>

        <div className="box-body p-0">
          <div className="table-responsive">
            <table className="table whitespace-nowrap min-w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">No.</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Foto</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kode Penguji</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Nama Penguji</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Laboratorium</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Metode Uji yang Dikuasai</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Sertifikasi</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Berlaku Hingga</th>
                  <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8">
                      <div className="ti-spinner text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : pengujiList.length > 0 ? (
                  pengujiList.map((row, index) => {
                    const sertif = row.sertifikasi && row.sertifikasi.length > 0 ? row.sertifikasi[0] : null;
                    return (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="text-sm py-3 px-4">{(page - 1) * pageSize + index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="avatar avatar-sm rounded-full">
                            <img src={row.foto || "../../../assets/images/faces/9.jpg"} alt="foto" />
                          </div>
                        </td>
                        <td className="text-sm font-medium py-3 px-4">{row.kodePenguji}</td>
                        <td className="text-sm font-medium text-gray-800 py-3 px-4">{row.nama}</td>
                        <td className="text-sm text-gray-700 font-semibold py-3 px-4">{row.laboratorium?.namaLaboratorium || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {row.metodeUji?.slice(0, 3).map((mu: any) => {
                              const name = mu.testMethod?.nama;
                              const colorClass = methodColors[name] || 'bg-gray-100 text-gray-600';
                              return (
                                <span key={mu.testMethodId} className={`badge text-xs font-medium px-2 py-1 ${colorClass}`}>
                                  {name}
                                </span>
                              );
                            })}
                            {row.metodeUji?.length > 3 && (
                              <span className="text-xs font-semibold text-gray-500 self-center ml-1">+{row.metodeUji.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-sm font-medium text-success py-3 px-4">{sertif?.namaSertifikasi || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${row.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="text-sm font-medium py-3 px-4">
                          {sertif?.berlakuHingga ? new Date(sertif.berlakuHingga).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1">
                            <EditIconButton 
                              onClick={() => {
                                setModalMode('edit');
                                setCurrentPenguji(row);
                                setIsModalOpen(true);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">Tidak ada data ditemukan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="box-footer border-t border-gray-100 p-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">Menampilkan {pengujiList.length > 0 ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, totalItems)} dari {totalItems} data</span>
          <div className="flex items-center gap-2">
            <select
              className="form-select text-sm h-[38px] py-1 px-2 border-gray-200"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10 / halaman</option>
              <option value="25">25 / halaman</option>
              <option value="50">50 / halaman</option>
            </select>
            <div className="flex border border-gray-200 rounded">
              <button 
                className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <div className="px-3 py-1 border-x border-gray-200 bg-primary text-white text-sm">
                {page}
              </div>
              <button 
                className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setPage(p => p + 1)}
                disabled={page * pageSize >= totalItems}
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER WIDGET */}
      <div className="box shadow-sm mt-4 bg-success/5 border border-success/10">
        <div className="box-body p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar avatar-md bg-white border border-success/20 text-success rounded-full">
              <i className="ri-shield-check-line text-2xl"></i>
            </div>
            <div>
              <h5 className="font-bold text-gray-800 text-base mb-1">Sertifikasi Penguji</h5>
              <p className="text-sm text-gray-600 mb-0">Pastikan penguji memiliki sertifikasi yang masih berlaku sesuai dengan metode uji yang dilakukan.</p>
            </div>
          </div>
          <button className="ti-btn ti-btn-outline-success bg-white">
            Kelola Sertifikasi
          </button>
        </div>
      </div>

      <PengujiFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={currentPenguji}
        laboratoriums={laboratoriums}
        testMethods={testMethods}
        onSubmit={async (data) => {
          try {
            if (modalMode === 'add') {
              await pengujiService.createPenguji(data);
            } else {
              if (currentPenguji?.id) {
                await pengujiService.updatePenguji(currentPenguji.id, data);
              }
            }
            setIsModalOpen(false);
            fetchData();
            toast.success('Berhasil menyimpan data Penguji!');
          } catch (error) {
            console.error('Failed to submit penguji data:', error);
            toast.error('Terjadi kesalahan saat menyimpan data Penguji!');
          }
        }}
      />
    </>
  );
}
