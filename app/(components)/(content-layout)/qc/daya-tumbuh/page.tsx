"use client"
import React, { useState, useEffect } from 'react';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { AddButton, ExportButton, FilterButton, ResetButton } from '../../shared/ActionButtons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientChart from '../../shared/ClientChart';
import CreateDayaTumbuhModal from './CreateDayaTumbuhModal';
import SharedFilterSection from '../shared/SharedFilterSection';
import { qcService } from '@/app/services/qcService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import { qcDayaTumbuhService } from '@/app/services/qcDayaTumbuhService';

export default function DayaTumbuhPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Expandable Rows State
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const toggleRow = (id: string) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

  const fetchData = () => {
    qcDayaTumbuhService.getDayaTumbuh({ page, pageSize, ...filters }).then(res => {
      if (res?.data && !Array.isArray(res)) {
        setTests(res.data);
        setTotal(res.pagination?.totalItems || 0);
        setTotalPages(res.pagination?.totalPages || 1);
        if (res.pagination?.currentPage) setPage(res.pagination.currentPage);
      } else {
        setTests(Array.isArray(res) ? res : []);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters]);

  useEffect(() => {
    qcService.getMethods().then(res => setMethods(Array.isArray(res) ? res : res?.data || [])).catch(console.error);
    commodityService.getCommodities({}).then(res => setCommodities(Array.isArray(res) ? res : res?.data || [])).catch(console.error);
    varietyService.getVarieties({}).then(res => setVarieties(Array.isArray(res) ? res : res?.data || [])).catch(console.error);
  }, []);

  const totalUji = tests.length;
  const totalBatch = new Set(tests.map(t => t.kodeBatch)).size;

  let lulusCount = 0;
  let tidakLulusCount = 0;
  let sedangDiujiCount = 0;
  let totalDayaTumbuh = 0;
  let sertifikatCount = 0;

  tests.forEach(t => {
    const dayaTumbuh = t.dayaTumbuh ?? (t.jumlahBenihDitanam ? (t.jumlahBerkecambah / t.jumlahBenihDitanam) * 100 : 0);
    const batasMinimal = t.batasMinimal ?? 85;
    const status = t.status || (dayaTumbuh >= batasMinimal ? 'Lulus' : 'Tidak Lulus');

    if (status === 'Lulus') lulusCount++;
    else if (status === 'Tidak Lulus') tidakLulusCount++;
    else sedangDiujiCount++;

    if (t.lampiranUrl) sertifikatCount++;
    totalDayaTumbuh += dayaTumbuh;
  });

  const avgDayaTumbuh = totalUji > 0 ? (totalDayaTumbuh / totalUji) : 0;

  const lulusPerc = totalUji > 0 ? ((lulusCount / totalUji) * 100).toFixed(2) : "0.00";
  const tidakLulusPerc = totalUji > 0 ? ((tidakLulusCount / totalUji) * 100).toFixed(2) : "0.00";
  const sedangDiujiPerc = totalUji > 0 ? ((sedangDiujiCount / totalUji) * 100).toFixed(2) : "0.00";

  const statItems: StatItem[] = [
    {
      title: "Total Uji Daya Tumbuh",
      value: (total || totalUji).toString(),
      subtitle: `Dari ${totalBatch} Batch`,
      icon: "ri-seedling-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Lulus",
      value: lulusCount.toString(),
      subtitle: `(${lulusPerc}%)`,
      icon: "ri-check-line",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      title: "Tidak Lulus",
      value: tidakLulusCount.toString(),
      subtitle: `(${tidakLulusPerc}%)`,
      icon: "ri-close-line",
      bgColor: "bg-danger/10",
      textColor: "text-danger"
    },
    {
      title: "Sedang Diuji",
      value: sedangDiujiCount.toString(),
      subtitle: `(${sedangDiujiPerc}%)`,
      icon: "ri-time-line",
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      title: "Sertifikat Diterbitkan",
      value: sertifikatCount.toString(),
      subtitle: "",
      icon: "ri-file-list-3-line",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Rata-rata Daya Tumbuh",
      value: `${avgDayaTumbuh.toFixed(2).replace('.', ',')}%`,
      subtitle: "",
      icon: "ri-percent-line",
      bgColor: "bg-info/10",
      textColor: "text-info"
    }
  ];

  // Charts Configs
  const ringkasanOptions: any = {
    chart: { type: 'donut', id: 'donut-dt' },
    labels: ['Lulus (≥ Batas Minimal)', 'Tidak Lulus (< Batas Minimal)', 'Sedang Diuji'],
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '12px' }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Rata-rata', formatter: () => `${avgDayaTumbuh.toFixed(2).replace('.', ',')}%` } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };
  const ringkasanSeries = [
    totalUji > 0 ? (lulusCount / totalUji) * 100 : 0,
    totalUji > 0 ? (tidakLulusCount / totalUji) * 100 : 0,
    totalUji > 0 ? (sedangDiujiCount / totalUji) * 100 : 0
  ];

  const trenOptions: any = {
    chart: { type: 'line', id: 'tren-dt', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#10b981', '#ef4444'],
    stroke: { curve: 'smooth', width: [2, 2], dashArray: [0, 5] },
    xaxis: { categories: ['12/05', '16/05', '20/05', '24/05', '28/05', '01/06', '05/06', '09/06', '11/06'], labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 20, max: 100, labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    markers: { size: 4, colors: ['#fff'], strokeColors: ['#10b981'], strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' },
    tooltip: { theme: 'light' }
  };
  const trenSeries = [
    { name: 'Rata-rata Aktual', data: [75, 82, 70, 78, 65, 85, 75, 70, 80] },
    { name: 'Target Minimal', data: [85, 85, 85, 85, 85, 85, 85, 85, 85] }
  ];

  const kurvaOptions: any = {
    chart: { type: 'line', id: 'kurva-dt', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#10b981', '#ef4444'],
    stroke: { curve: 'smooth', width: [2, 2], dashArray: [0, 5] },
    xaxis: { categories: ['1 Hari', '2 Hari', '3 Hari', '4 Hari', '5 Hari', '6 Hari', '7 Hari'], labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, max: 100, labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    markers: { size: 4, colors: ['#fff'], strokeColors: ['#10b981'], strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' },
    tooltip: { theme: 'light' }
  };
  const kurvaSeries = [
    { name: 'Persentase Berkecambah', data: [0, 50, 70, 85, 90, 95, 96.5] },
    { name: 'Target Minimal', data: [85, 85, 85, 85, 85, 85, 85] }
  ];

  const handleSelectRow = (row: any) => {
    setSelectedTest(row);
  };

  return (
    <>
      <Seo title="Daya Tumbuh" />
      <Pageheader currentpage="Daya Tumbuh" activepage="Quality Control (QC)" mainpage="Daya Tumbuh" />
      <ToastContainer />

      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-xl text-gray-800 mb-1">Daya Tumbuh</h4>
          <p className="text-sm text-gray-500">Uji daya tumbuh benih untuk memastikan persentase benih mampu berkecambah dengan optimal.</p>
        </div>
        <div className="flex gap-2">
          <AddButton onClick={() => setIsCreateModalOpen(true)} label="Buat Uji Daya Tumbuh" />
          <ExportButton />
        </div>
      </div>

      {/* Metric Cards */}
      <StatsWidgets items={statItems} columns={6} />

      {/* Filter Row */}
      <SharedFilterSection
        methods={methods}
        commodities={commodities}
        varieties={varieties}
        statusOptions={[
          { value: 'Lulus', label: 'Lulus' },
          { value: 'Tidak Lulus', label: 'Tidak Lulus' }
        ]}
        methodValueKey="kode"
        onFilter={(newFilters) => {
          const { methodId, ...rest } = newFilters;
          setFilters({ ...rest, qcMethodId: methodId });
          setPage(1);
        }}
        onReset={() => {
          setFilters({});
          setPage(1);
        }}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">

          {/* Table */}
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Daftar Hasil Uji Daya Tumbuh</h5>
            </div>
            <div className="box-body p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="2xl:hidden text-center text-xs font-semibold text-gray-500 py-3 px-2 w-8"></th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">No</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kode Batch</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Komoditas</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Varietas</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Tanggal Uji</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Metode</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Jumlah Sampel</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Daya Tumbuh (%)</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Batas Minimal (%)</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Sertifikat</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.length > 0 ? tests.map((row, idx) => {
                      const dayaTumbuh = row.dayaTumbuh ?? (row.jumlahBenihDitanam ? (row.jumlahBerkecambah / row.jumlahBenihDitanam) * 100 : 0);
                      const batasMinimal = row.batasMinimal ?? 85;
                      const status = row.status || (dayaTumbuh >= batasMinimal ? 'Lulus' : 'Tidak Lulus');

                      return (
                        <React.Fragment key={row.id || idx}>
                          <tr onClick={() => handleSelectRow(row)} className={`border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer ${selectedTest?.id === row.id ? 'bg-primary/5' : ''}`}>
                            <td className="2xl:hidden py-2 px-2 text-center w-8">
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleRow(row.id || String(idx)); }}
                                className="text-white bg-[#1B4E3B] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold leading-none focus:outline-none"
                              >
                                {expandedRows[row.id || String(idx)] ? '-' : '+'}
                              </button>
                            </td>
                            <td className="text-sm py-2 px-4">{idx + 1}</td>
                            <td className="text-sm font-medium text-primary py-2 px-4">{row.kodeBatch}</td>
                            <td className="text-sm py-2 px-4">{row.commodity?.namaKomoditas || '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.variety?.namaVarietas || '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString() : '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.metodeUji || '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.jumlahSampel || '-'}</td>
                            <td className="text-sm py-2 px-4 font-semibold">{dayaTumbuh.toFixed(2).replace('.', ',')}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{batasMinimal}</td>
                            <td className="py-2 px-4">
                              <span className={`badge ${status === 'Lulus' ? 'bg-success/10 text-success' : status === 'Tidak Lulus' ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-500'}`}>
                                {status}
                              </span>
                            </td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.lampiranUrl ? <a href={row.lampiranUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Lihat</a> : '-'}</td>
                            <td className="py-2 px-4 text-center flex justify-center gap-1">
                              <button className="text-gray-400 hover:text-primary transition-colors" title="Lihat Detail"><i className="ri-eye-line text-lg"></i></button>
                            </td>
                          </tr>
                          {expandedRows[row.id || String(idx)] && (
                            <tr className="2xl:hidden bg-gray-50/80 border-b border-gray-100">
                              <td colSpan={7} className="py-3 px-6">
                                <ul className="text-sm space-y-1 text-gray-600">
                                  <li><span className="font-semibold text-gray-800">Varietas:</span> {row.variety?.namaVarietas || '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Tanggal Uji:</span> {row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString() : '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Metode Uji:</span> {row.metodeUji || '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Jumlah Sampel:</span> {row.jumlahSampel || '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Batas Minimal:</span> {batasMinimal}%</li>
                                  <li><span className="font-semibold text-gray-800">Sertifikat:</span> {row.lampiranUrl ? <a href={row.lampiranUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Lihat</a> : '-'}</li>
                                </ul>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    }) : (
                      <tr>
                        <td colSpan={13} className="text-center py-4 text-gray-500">Tidak ada data ditemukan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="box-footer border-t border-gray-100 p-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Menampilkan {tests.length > 0 ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, total)} dari {total} data
              </span>
              <div className="flex items-center gap-2">
                <select
                  className="form-select text-sm h-[38px] py-1 px-2 border-gray-200"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10 / halaman</option>
                  <option value={20}>20 / halaman</option>
                  <option value={50}>50 / halaman</option>
                </select>
                <div className="flex gap-1">
                  <button
                    className="btn btn-sm btn-light p-1 px-2 disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <i className="ri-arrow-left-s-line"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`btn btn-sm p-1 px-2 ${page === p ? 'btn-primary bg-[#1B4E3B] text-white' : 'btn-light'}`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    className="btn btn-sm btn-light p-1 px-2 disabled:opacity-50"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  >
                    <i className="ri-arrow-right-s-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">

          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Ringkasan Persentase Daya Tumbuh</h5>
              <span className="text-[10px] text-gray-400">Update terakhir: 11/06/2026 14:30 WIB</span>
            </div>
            <div className="box-body p-4">
              <div className="flex items-center">
                <div className="w-1/2">
                  <ClientChart id="ringkasan-chart-dt" dataKey={tests.length} options={ringkasanOptions} series={ringkasanSeries} type="donut" height={180} />
                </div>
                <div className="w-1/2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-success"></span>
                      <span className="text-xs text-gray-600">Lulus (≥ Batas Minimal)</span>
                    </div>
                    <span className="text-xs font-bold">{lulusPerc}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-danger"></span>
                      <span className="text-xs text-gray-600">Tidak Lulus (&lt; Batas Minimal)</span>
                    </div>
                    <span className="text-xs font-bold">{tidakLulusPerc}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-warning"></span>
                      <span className="text-xs text-gray-600">Sedang Diuji</span>
                    </div>
                    <span className="text-xs font-bold">{sedangDiujiPerc}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Tren Daya Tumbuh (30 Hari Terakhir)</h5>
            </div>
            <div className="box-body p-4">
              <ClientChart id="tren-chart-dt" dataKey={tests.length} options={trenOptions} series={trenSeries} type="line" height={160} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">


          {/* Detail Hasil Uji Terpilih */}
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Detail Hasil Uji Terpilih</h5>
            </div>
            <div className="box-body p-4">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Kode Batch</p>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-lg mb-0">{selectedTest ? selectedTest.kodeBatch : '-'}</h5>
                    {selectedTest && (
                      <span className={`badge ${((selectedTest.dayaTumbuh !== undefined && selectedTest.dayaTumbuh !== null ? selectedTest.dayaTumbuh : (((selectedTest.jumlahBerkecambah || 0) / (selectedTest.jumlahBenihDitanam || 1)) * 100)) >= 85) ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {((selectedTest.dayaTumbuh !== undefined && selectedTest.dayaTumbuh !== null ? selectedTest.dayaTumbuh : (((selectedTest.jumlahBerkecambah || 0) / (selectedTest.jumlahBenihDitanam || 1)) * 100)) >= 85) ? 'Lulus' : 'Tidak Lulus'}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Komoditas</p>
                  <h6 className="font-semibold text-sm mb-0">{selectedTest?.commodity?.namaKomoditas || '-'}</h6>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Varietas</p>
                  <h6 className="font-semibold text-sm mb-0">{selectedTest?.variety?.namaVarietas || '-'}</h6>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tanggal Uji</p>
                  <h6 className="font-semibold text-sm mb-0">{selectedTest?.tanggalUji ? new Date(selectedTest.tanggalUji).toLocaleDateString() : '-'}</h6>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Metode</p>
                  <h6 className="font-semibold text-sm mb-0">{selectedTest?.metodeUji || '-'}</h6>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Jumlah Sampel</p>
                  <h6 className="font-semibold text-sm mb-0">{selectedTest?.jumlahSampel || '-'} Butir</h6>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Daya Tumbuh</p>
                  <h6 className="font-bold text-lg text-primary mb-0">{selectedTest ? (selectedTest.dayaTumbuh !== undefined && selectedTest.dayaTumbuh !== null ? selectedTest.dayaTumbuh : (((selectedTest.jumlahBerkecambah || 0) / (selectedTest.jumlahBenihDitanam || 1)) * 100)).toFixed(2).replace('.', ',') : '0,00'}%</h6>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h6 className="text-sm font-semibold mb-3">Parameter Uji</h6>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Daya Tumbuh</span><span className="font-semibold">{selectedTest ? (selectedTest.dayaTumbuh !== undefined && selectedTest.dayaTumbuh !== null ? selectedTest.dayaTumbuh : (((selectedTest.jumlahBerkecambah || 0) / (selectedTest.jumlahBenihDitanam || 1)) * 100)).toFixed(2).replace('.', ',') : '0,00'} %</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Batas Minimal</span><span className="font-semibold">{selectedTest?.batasMinimal || 85} %</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Jumlah Benih Ditanam</span><span className="font-semibold">{selectedTest?.jumlahBenihDitanam || '-'} Butir</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Jumlah Berkecambah</span><span className="font-semibold">{selectedTest?.jumlahBerkecambah || '-'} Butir</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Jumlah Tidak Berkecambah</span><span className="font-semibold">{selectedTest?.jumlahTidakBerkecambah || '-'} Butir</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Waktu Uji</span><span className="font-semibold">{selectedTest?.waktuUjiHari || '-'} Hari</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Suhu Uji</span><span className="font-semibold">{selectedTest?.suhuUji || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Media Uji</span><span className="font-semibold">{selectedTest?.mediaUji || '-'}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Kelembaban Media</span><span className="font-semibold">{selectedTest?.kelembabanMedia || '-'}</span></div>
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-semibold mb-3">Kurva Perkecambahan</h6>
                  <ClientChart id="kurva-chart-dt" dataKey={tests.length} options={kurvaOptions} series={kurvaSeries} type="line" height={200} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">


          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Distribusi Hasil Uji per Komoditas</h5>
              <a href="#" className="text-xs text-primary hover:underline">Lihat Semua</a>
            </div>
            <div className="box-body p-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">Padi</span>
                  <span className="text-gray-500">Total 34</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                  <div className="bg-success h-full" style={{ width: '88%' }}></div>
                  <div className="bg-danger h-full" style={{ width: '6%' }}></div>
                  <div className="bg-info h-full" style={{ width: '6%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">Jagung</span>
                  <span className="text-gray-500">Total 23</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                  <div className="bg-success h-full" style={{ width: '87%' }}></div>
                  <div className="bg-danger h-full" style={{ width: '9%' }}></div>
                  <div className="bg-info h-full" style={{ width: '4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">Kedelai</span>
                  <span className="text-gray-500">Total 16</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full flex overflow-hidden">
                  <div className="bg-success h-full" style={{ width: '94%' }}></div>
                  <div className="bg-danger h-full" style={{ width: '0%' }}></div>
                  <div className="bg-info h-full" style={{ width: '6%' }}></div>
                </div>
              </div>
              <div className="flex gap-4 mt-2 justify-center border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-success"></span><span className="text-[10px] text-gray-500">Lulus</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-danger"></span><span className="text-[10px] text-gray-500">Tidak Lulus</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-info"></span><span className="text-[10px] text-gray-500">Sedang Diuji</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCreateModalOpen && <CreateDayaTumbuhModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={() => { fetchData(); toast.success('Berhasil menyimpan data Uji Daya Tumbuh!'); }} methods={methods} commodities={commodities} varieties={varieties} />}
    </>
  );
}
