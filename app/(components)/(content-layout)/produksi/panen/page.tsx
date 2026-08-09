"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import usePanen from '@/app/hooks/usePanen';
import { PanenItem } from '@/app/services/panenService';
import StatsWidgets from '../../shared/StatsWidgets';
import FilterRow, { FilterSelectConfig } from '../jadwaltanam/component/FilterRow';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PanenPage() {
  const {
    panenList,
    isLoading,
    selectedPanen,
    setSelectedPanen,
    search,
    setSearch,
    filterPeriode,
    setFilterPeriode,
    filterKomoditas,
    setFilterKomoditas,
    filterVarietas,
    setFilterVarietas,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalRecords,
    totalPages,
    statItems,
    komoditasOptions,
    varietasOptions,
    statusOptions,
    handleApplyFilters,
    handleResetFilters,
    handleAddPanen,
    handleEditPanen,
    handleDeletePanen,
    handleSavePanen,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    kesiapanSiapPanenList,
  } = usePanen();

  // Filter Configuration for FilterRow
  const filterConfig: FilterSelectConfig[] = [
    {
      value: filterPeriode,
      onChange: (val: any) => setFilterPeriode(val),
      options: [],
      placeholder: 'Periode',
      title: 'Periode',
      widthClass: 'sm:w-52',
      type: 'date'
    },
    {
      value: filterKomoditas,
      onChange: (val: any) => setFilterKomoditas(val),
      options: komoditasOptions,
      placeholder: 'Semua Komoditas',
      title: 'Komoditas',
      widthClass: 'sm:w-44',
      type: 'opsi'
    },
    {
      value: filterVarietas,
      onChange: (val: any) => setFilterVarietas(val),
      options: varietasOptions,
      placeholder: 'Semua Varietas',
      title: 'Varietas',
      widthClass: 'sm:w-44',
      type: 'opsi'
    },
    {
      value: filterStatus,
      onChange: (val: any) => setFilterStatus(val),
      options: statusOptions,
      placeholder: 'Semua Status',
      title: 'Status Panen',
      widthClass: 'sm:w-44',
      type: 'opsi'
    },
  ];

  // Selected Kesiapan Panen reference ID
  const [selectedKesiapanId, setSelectedKesiapanId] = useState<string>('');

  // Form State for Modal
  const [formData, setFormData] = useState<Partial<PanenItem>>({
    kodePanen: '',
    komoditas: 'Padi',
    varietas: 'Inpari 32',
    lahan: 'Lahan A1 - Blok 01',
    tanggalPanen: new Date().toISOString().split('T')[0],
    luasHa: 5.0,
    produksiKg: 15250,
    status: 'Selesai',
    penanggungJawab: 'Budi Santoso',
    metodePanen: 'Combine Harvester',
    produksiKotorKg: 15800,
    kadarAir: 14,
    kebersihan: 98,
    catatan: '',
  });

  const handleKesiapanSelect = (idOrKode: string) => {
    setSelectedKesiapanId(idOrKode);
    if (!idOrKode) return;

    const item = kesiapanSiapPanenList.find(
      (k) => (k.id && k.id === idOrKode) || k.kodeLahan === idOrKode
    );

    if (item) {
      setFormData((prev) => ({
        ...prev,
        kesiapanPanenId: item.id,
        kesiapanLahanId: item.id || (item as any).greenhouseId,
        commodityId: item.commodityId || (item as any).commodity?.id,
        varietyId: item.varietyId || (item as any).variety?.id,
        komoditas: item.komoditas || prev.komoditas,
        varietas: item.varietas || prev.varietas,
        lahan: item.lokasi || item.kodeLahan || prev.lahan,
        luasHa: item.luasHa || (item as any).greenhouse?.luas || prev.luasHa || 5.0,
        produksiKg: item.yieldEst ? item.yieldEst : (prev.produksiKg || 15000),
        produksiKotorKg: item.yieldEst ? Math.round(item.yieldEst * 1.03) : (prev.produksiKotorKg || 15500),
      }));
    }
  };

  const openCreateModal = () => {
    setSelectedKesiapanId('');
    setFormData({
      kodePanen: `PN-2606-00${totalRecords + 1}`,
      kesiapanPanenId: '',
      kesiapanLahanId: '',
      commodityId: '',
      varietyId: '',
      komoditas: '',
      varietas: '',
      lahan: '',
      tanggalPanen: new Date().toISOString().split('T')[0],
      luasHa: 0,
      produksiKg: 0,
      status: 'Selesai',
      penanggungJawab: 'Budi Santoso',
      metodePanen: 'Combine Harvester',
      produksiKotorKg: 0,
      kadarAir: 14,
      kebersihan: 98,
      catatan: '',
    });
    handleAddPanen();
  };

  const openEditModal = (item: PanenItem) => {
    setSelectedKesiapanId(item.kesiapanPanenId || '');
    setFormData({
      ...item,
      tanggalPanen: item.tanggalPanen ? new Date(item.tanggalPanen).toISOString().split('T')[0] : '',
    });
    handleEditPanen(item);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    handleSavePanen(formData);
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">Selesai</span>;
      case 'Berlangsung':
      case 'Sedang Berlangsung':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">Berlangsung</span>;
      case 'Belum Mulai':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">Belum Mulai</span>;
    }
  };

  // ApexChart configuration for Tren Produksi Panen
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      height: 260,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ['#10b981', '#3b82f6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: [2, 2], dashArray: [0, 5] },
    fill: {
      type: ['gradient', 'none'],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: [
        '01 Jun', '02 Jun', '03 Jun', '04 Jun', '05 Jun', '06 Jun', '07 Jun', '08 Jun', '09 Jun', '10 Jun',
        '11 Jun', '12 Jun', '13 Jun', '14 Jun', '16 Jun', '17 Jun', '18 Jun', '19 Jun', '20 Jun', '21 Jun',
        '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '29 Jun', '30 Jun'
      ],
      labels: {
        style: { colors: '#64748b', fontSize: '10px' },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val >= 1000 ? (val / 1000) + ' rb' : val}`,
        style: { colors: '#64748b', fontSize: '10px' },
      },
      min: 0,
      max: 20000,
    },
    legend: { show: false },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 3 },
  };

  const chartSeries = [
    {
      name: 'Produksi (Kg)',
      data: [
        0, 1200, 2500, 7500, 6800, 7800, 7500, 7500, 7200, 15250,
        6500, 13180, 8610, 4800, 15600, 9200, 5000, 3100, 2500, 2400,
        2300, 2200, 2200, 2100, 2100, 2000, 2000, 2000
      ],
    },
    {
      name: 'Target (Kg)',
      data: Array(28).fill(8000),
    },
  ];

  const activePanen = selectedPanen || (panenList.length > 0 ? panenList[0] : null);

  // Parse attached documents from JSON
  const docsList = React.useMemo(() => {
    if (!activePanen?.dokumen) {
      return [
        { nama: `Berita Acara Panen_${activePanen?.kodePanen || 'PN-2606-0001'}.pdf`, url: '#', size: '245 KB', type: 'pdf' },
        { nama: 'Foto Panen_1.jpg', url: '#', size: '1.2 MB', type: 'img' },
        { nama: 'Foto Panen_2.jpg', url: '#', size: '1.1 MB', type: 'img' },
      ];
    }
    try {
      const parsed = typeof activePanen.dokumen === 'string' ? JSON.parse(activePanen.dokumen) : activePanen.dokumen;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { }
    return [
      { nama: `Berita Acara Panen_${activePanen.kodePanen}.pdf`, url: '#', size: '245 KB', type: 'pdf' },
      { nama: 'Foto Panen_1.jpg', url: '#', size: '1.2 MB', type: 'img' },
      { nama: 'Foto Panen_2.jpg', url: '#', size: '1.1 MB', type: 'img' },
    ];
  }, [activePanen]);

  return (
    <div className="space-y-6 pb-12">
      <Pageheader
        title="Produksi"
        currentpage="Panen"
        activepage="Panen"
        mainpage="Produksi"
        description="Kelola data dan aktivitas panen untuk setiap jadwal tanam."
        customButton={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreateModal}
              className="bg-[#078836] hover:bg-[#06732d] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <i className="ri-add-line text-sm"></i> Buat Panen Baru
            </button>
            <button
              type="button"
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <i className="ri-download-line text-xs"></i> Export Data <i className="ri-arrow-down-s-line text-xs"></i>
            </button>
          </div>
        }
      />

      {/* Stat Cards (7 Indicators) */}
      <StatsWidgets items={statItems} columns={7} />

      {/* Filter Row */}
      <FilterRow
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari kode panen, komoditas, lahan, varietas..."
        searchTitle="Cari"
        selectFilters={filterConfig}
        onSearch={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Main Grid Section: Table (8 cols) + Detail Panel (4 cols) */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Table Area (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 box border border-defaultborder/60 bg-white shadow-xs rounded-lg p-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-800">Daftar Panen</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 inline-flex items-center gap-1.5 transition-colors"
              >
                <i className="ri-download-2-line text-xs"></i>
                <span>Export</span>
              </button>
              <button
                type="button"
                className="p-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                title="Pengaturan Tabel"
              >
                <i className="ri-settings-3-line text-sm"></i>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50/70 text-gray-600 font-bold text-[11px]">
                  <th className="py-2.5 px-2 w-10 text-center">No</th>
                  <th className="py-2.5 px-2">Kode Panen</th>
                  <th className="py-2.5 px-2">Komoditas</th>
                  <th className="py-2.5 px-2">Varietas</th>
                  <th className="py-2.5 px-2">Lahan</th>
                  <th className="py-2.5 px-2">Tanggal Panen</th>
                  <th className="py-2.5 px-2 text-right">Luas (Ha)</th>
                  <th className="py-2.5 px-2 text-right">Produksi (Kg)</th>
                  <th className="py-2.5 px-2 text-right">Hasil (Kg/Ha)</th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2">Penanggung Jawab</th>
                  <th className="py-2.5 px-2 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs">Memuat data panen...</span>
                      </div>
                    </td>
                  </tr>
                ) : panenList.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400">
                      Tidak ada data panen yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  panenList.map((item, idx) => {
                    const isSelected = activePanen?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedPanen(item)}
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-emerald-50/50 font-medium' : ''
                          }`}
                      >
                        <td className="py-2.5 px-2 text-center text-gray-400">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="py-2.5 px-2 font-bold text-emerald-600 whitespace-nowrap">
                          {item.kodePanen}
                        </td>
                        <td className="py-2.5 px-2">{item.komoditas}</td>
                        <td className="py-2.5 px-2">{item.varietas}</td>
                        <td className="py-2.5 px-2 whitespace-nowrap">{item.lahan}</td>
                        <td className="py-2.5 px-2 whitespace-nowrap">
                          {item.tanggalPanen ? new Date(item.tanggalPanen).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {item.luasHa ? item.luasHa.toFixed(2).replace('.', ',') : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          {item.produksiKg ? item.produksiKg.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-right font-semibold">
                          {item.hasilKgHa ? item.hasilKgHa.toLocaleString('id-ID') : '-'}
                        </td>
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-2.5 px-2 whitespace-nowrap">{item.penanggungJawab || '-'}</td>
                        <td className="py-2.5 px-2 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedPanen(item)}
                              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
                              title="Lihat Detail"
                            >
                              <i className="ri-eye-line text-sm"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="p-1 text-gray-500 hover:text-emerald-700 transition-colors"
                              title="Edit Data"
                            >
                              <i className="ri-pencil-line text-sm"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePanen(item.id, item.kodePanen)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                              title="Hapus Data"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-500">
              Menampilkan {panenList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, totalRecords)} dari {totalRecords} data
            </span>

            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 bg-white"
              >
                <option value={10}>10 / halaman</option>
                <option value={20}>20 / halaman</option>
                <option value={50}>50 / halaman</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  <i className="ri-arrow-left-s-line"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-semibold text-xs transition-colors ${currentPage === p
                        ? 'bg-emerald-600 text-white border border-emerald-600'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                >
                  <i className="ri-arrow-right-s-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Sidebar Panel (4 Cols - Ringkasan Panen) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="box border border-defaultborder/60 bg-white shadow-xs rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">Ringkasan Panen</h3>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-emerald-600">{activePanen?.kodePanen || 'PN-2606-0001'}</span>
                {getStatusBadge(activePanen?.status || 'Selesai')}
              </div>
            </div>

            {activePanen ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-y-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Komoditas</span>
                    <span className="font-semibold text-gray-800">{activePanen.komoditas}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Varietas</span>
                    <span className="font-semibold text-gray-800">{activePanen.varietas}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px]">Lahan</span>
                    <span className="font-semibold text-gray-800">{activePanen.lahan}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Luas Dipanen</span>
                    <span className="font-semibold text-gray-800">{activePanen.luasHa?.toFixed(2).replace('.', ',')} Ha</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Tanggal Panen</span>
                    <span className="font-semibold text-gray-800">
                      {activePanen.tanggalPanen ? new Date(activePanen.tanggalPanen).toLocaleDateString('id-ID') : '-'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block text-[10px]">Metode Panen</span>
                    <span className="font-semibold text-gray-800">{activePanen.metodePanen || 'Combine Harvester'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Produksi Kotor</span>
                    <span className="font-semibold text-gray-800">
                      {activePanen.produksiKotorKg ? `${activePanen.produksiKotorKg.toLocaleString('id-ID')} Kg` : '15.800 Kg'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Produksi Bersih</span>
                    <span className="font-semibold text-gray-800">
                      {activePanen.produksiKg ? `${activePanen.produksiKg.toLocaleString('id-ID')} Kg` : '15.250 Kg'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Kadar Air</span>
                    <span className="font-semibold text-gray-800">{activePanen.kadarAir || 14}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Kebersihan</span>
                    <span className="font-semibold text-gray-800">{activePanen.kebersihan || 98}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Hasil (Kg/Ha)</span>
                    <span className="font-bold text-emerald-600">{activePanen.hasilKgHa ? activePanen.hasilKgHa.toLocaleString('id-ID') : '3.050'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Penanggung Jawab</span>
                    <span className="font-semibold text-gray-800">{activePanen.penanggungJawab || 'Budi Santoso'}</span>
                  </div>
                </div>

                {/* Progress Panen Bar */}
                <div className="pt-1">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-gray-700">Progress Panen</span>
                    <span className="font-bold text-emerald-600">
                      {activePanen.status === 'Selesai' ? '100%' : activePanen.status === 'Berlangsung' ? '50%' : '0%'}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mb-1.5">{activePanen.status}</span>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: activePanen.status === 'Selesai' ? '100%' : activePanen.status === 'Berlangsung' ? '50%' : '0%',
                      }}
                    ></div>
                  </div>
                </div>

                {/* Dokumen & Bukti */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs mb-2">Dokumen & Bukti</h4>
                  {docsList.map((doc: any, i: number) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-lg p-2.5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <i className={doc.nama.endsWith('.pdf') ? 'ri-file-pdf-line text-sm' : 'ri-image-line text-sm'}></i>
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-gray-800 text-[11px] truncate mb-0" title={doc.nama}>{doc.nama}</p>
                          <span className="text-[9px] text-gray-400">{doc.size || '1.2 MB'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-emerald-600 transition-colors shrink-0"
                        title="Download Dokumen"
                      >
                        <i className="ri-download-2-line text-xs"></i>
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="w-full py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 transition-colors mt-2 text-center block"
                  >
                    Lihat Semua Dokumen
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Pilih baris panen untuk melihat rincian.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Area - Line Chart (Tren Produksi Panen) */}
      <div className="box border border-defaultborder/60 bg-white shadow-xs rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Tren Produksi Panen</h3>
            <span className="text-[11px] text-gray-400 font-normal">
              Grafik hasil produksi panen harian dibandingkan dengan target produksi.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-gray-700 font-semibold">Produksi (Kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-blue-500 inline-block"></span>
              <span className="text-gray-700 font-semibold">Target (Kg)</span>
            </div>
          </div>
        </div>

        <div className="w-full">
          <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={260} />
        </div>
      </div>

      {/* Modal Form Buat / Edit Panen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">
                {editingItem ? 'Edit Data Panen' : 'Buat Panen Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {!editingItem && (
                  <div className="sm:col-span-2 bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl space-y-1.5">
                    <label className="block text-emerald-900 font-bold mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <i className="ri-file-list-3-line text-emerald-600 text-sm"></i>
                        Referensi Kesiapan Panen (Status: Siap Panen)
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {kesiapanSiapPanenList.length} Siap Panen
                      </span>
                    </label>
                    <select
                      value={selectedKesiapanId}
                      onChange={(e) => handleKesiapanSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-emerald-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-gray-800 text-xs font-medium shadow-xs"
                    >
                      <option value="">-- Pilih Referensi Kesiapan Panen --</option>
                      {kesiapanSiapPanenList.map((item) => (
                        <option key={item.id || item.kodeLahan} value={item.id || item.kodeLahan}>
                          {item.kodeLahan} - {item.lokasi || 'Lahan'} ({item.komoditas} - {item.varietas} | Luas: {item.luasHa || 5.0} Ha)
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-emerald-700/80 italic flex items-center gap-1">
                      <i className="ri-information-line text-xs"></i>
                      <span>Memilih referensi akan mengisi otomatis Komoditas, Varietas, Lahan, dan Luas.</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Kode Panen</label>
                  <input
                    type="text"
                    required
                    value={formData.kodePanen || ''}
                    onChange={(e) => setFormData({ ...formData, kodePanen: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Tanggal Panen</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggalPanen || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalPanen: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-1">Lahan</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    placeholder="Otomatis terisi dari Referensi Kesiapan Panen"
                    value={formData.lahan || ''}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Komoditas</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    placeholder="Otomatis terisi"
                    value={formData.komoditas || ''}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Varietas</label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    placeholder="Otomatis terisi"
                    value={formData.varietas || ''}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Luas (Ha)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.luasHa || 0}
                    onChange={(e) => setFormData({ ...formData, luasHa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Produksi (Kg)</label>
                  <input
                    type="number"
                    required
                    value={formData.produksiKg || 0}
                    onChange={(e) => setFormData({ ...formData, produksiKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Status Panen</label>
                  <select
                    value={formData.status || 'Selesai'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Selesai">Selesai</option>
                    <option value="Berlangsung">Berlangsung</option>
                    <option value="Belum Mulai">Belum Mulai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={formData.penanggungJawab || ''}
                    onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Produksi Kotor (Kg)</label>
                  <input
                    type="number"
                    value={formData.produksiKotorKg || 0}
                    onChange={(e) => setFormData({ ...formData, produksiKotorKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Metode Panen</label>
                  <input
                    type="text"
                    value={formData.metodePanen || ''}
                    onChange={(e) => setFormData({ ...formData, metodePanen: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
