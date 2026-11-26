"use client"
import React, { useState, useEffect } from 'react';
import { ViewIconButton, EditIconButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import { toast } from 'react-toastify';
import QcPageHeader from '../shared/QcPageHeader';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import { AddButton, ExportButton, FilterButton, ResetButton } from '../../shared/ActionButtons';
import ClientChart from '../../shared/ClientChart';
import CreateVigorModal from './CreateVigor';
import SharedFilterSection from '../shared/SharedFilterSection';
import { qcVigorService } from '@/app/services/qcVigorService';
import { qcService } from '@/app/services/qcService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';
import Link from 'next/link';

export default function VigorPage() {
  const [filters, setFilters] = useState<any>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [commodities, setCommodities] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Expandable Rows State
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const toggleRow = (id: string) => setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));

  const handleEdit = (data: any) => {
    setEditData(data);
    setIsCreateModalOpen(true);
  };

  const fetchData = () => {
    qcVigorService.getQcVigorList({ page, pageSize, ...filters }).then(res => {
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
    qcService.getMethods().then(res => setMethods(res.data || [])).catch(console.error);
    commodityService.getCommodities({}).then(res => setCommodities(res.data || [])).catch(console.error);
    varietyService.getVarieties({}).then(res => setVarieties(res.data || [])).catch(console.error);
  }, []);

  const totalUji = total;
  const totalSampel = tests.reduce((sum, t) => sum + (t.jumlahSampel || 0), 0);

  const tinggiCount = tests.filter(t => t.kategori === 'Tinggi').length;
  const sedangCount = tests.filter(t => t.kategori === 'Sedang').length;
  const rendahCount = tests.filter(t => t.kategori === 'Rendah').length;

  const avgVigor = tests.length > 0 ? Math.round(tests.reduce((sum, t) => sum + (t.vigor || 0), 0) / tests.length) : 0;

  const totalCount = tinggiCount + sedangCount + rendahCount;
  const tinggiPerc = totalCount > 0 ? ((tinggiCount / totalCount) * 100).toFixed(2) : "0.00";
  const sedangPerc = totalCount > 0 ? ((sedangCount / totalCount) * 100).toFixed(2) : "0.00";
  const rendahPerc = totalCount > 0 ? ((rendahCount / totalCount) * 100).toFixed(2) : "0.00";

  const statItems: StatItem[] = [
    {
      title: "Total Batch Diuji",
      value: totalUji.toString(),
      subtitle: "Batch",
      icon: "ri-leaf-line",
      bgColor: "bg-info/10",
      textColor: "text-info"
    },
    {
      title: "Total Sampel",
      value: totalSampel.toString(),
      subtitle: "Sampel",
      icon: "ri-clipboard-line",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      title: "Rata-rata Indeks Vigor",
      value: avgVigor.toString(),
      subtitle: "Dari semua sampel",
      icon: "ri-bar-chart-grouped-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Vigor Tinggi (≥ 800)",
      value: tinggiCount.toString(),
      subtitle: `${tinggiPerc}%`,
      icon: "ri-checkbox-circle-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Vigor Sedang (600 - 799)",
      value: sedangCount.toString(),
      subtitle: `${sedangPerc}%`,
      icon: "ri-time-line",
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      title: "Vigor Rendah (< 600)",
      value: rendahCount.toString(),
      subtitle: `${rendahPerc}%`,
      icon: "ri-close-circle-line",
      bgColor: "bg-danger/10",
      textColor: "text-danger"
    }
  ];

  // Distribution chart dynamic data
  const distData = [0, 0, 0, 0, 0, 0];
  tests.forEach(t => {
    const v = t.vigor || 0;
    if (v < 400) distData[0]++;
    else if (v < 600) distData[1]++;
    else if (v < 700) distData[2]++;
    else if (v < 800) distData[3]++;
    else if (v < 900) distData[4]++;
    else distData[5]++;
  });

  const ringkasanOptions: any = {
    chart: { type: 'donut', id: 'donut-vigor' },
    labels: ['Vigor Tinggi (≥ 800)', 'Vigor Sedang (600 - 799)', 'Vigor Rendah (< 600)'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '12px' }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Sampel', formatter: () => totalCount.toString() } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };
  const ringkasanSeries = [tinggiCount, sedangCount, rendahCount];

  const distribusiOptions: any = {
    chart: { type: 'bar', id: 'dist-vigor', toolbar: { show: false } },
    colors: ['#10b981'],
    plotOptions: { bar: { borderRadius: 2, columnWidth: '40%', dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val: number) => val, offsetY: -20, style: { fontSize: '12px', colors: ["#304758"] } },
    xaxis: { categories: ['< 400', '400 - 599', '600 - 699', '700 - 799', '800 - 899', '≥ 900'], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { title: { text: 'Jumlah Sampel', style: { fontSize: '11px', fontWeight: 400, color: '#9ca3af' } } },
    grid: { show: false },
  };
  const distribusiSeries = [{ name: 'Jumlah Sampel', data: distData }];

  // Trend chart dynamic data
  const trenMap: Record<string, { total: number; count: number }> = {};
  tests.forEach(t => {
    if (!t.tanggalUji) return;
    const dateStr = String(t.tanggalUji).split('T')[0];
    if (!trenMap[dateStr]) trenMap[dateStr] = { total: 0, count: 0 };
    trenMap[dateStr].total += t.vigor || 0;
    trenMap[dateStr].count++;
  });
  const trenSorted = Object.entries(trenMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([dateStr, data]) => {
      const parts = dateStr.split('-');
      const d = parts[2], m = parts[1];
      return { date: `${d}/${m}`, avg: Math.round(data.total / data.count) };
    });
  const trenCategories = trenSorted.map(t => t.date);
  const trenData = trenSorted.map(t => t.avg);

  const trenOptions: any = {
    chart: { type: 'line', id: 'tren-vigor', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: [2] },
    xaxis: { categories: trenCategories.length ? trenCategories : ['-'], labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, max: 1250, labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, title: { text: 'Indeks Vigor', style: { fontSize: '11px', fontWeight: 400, color: '#9ca3af' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    markers: { size: 4, colors: ['#fff'], strokeColors: ['#10b981'], strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' },
    tooltip: { theme: 'light' }
  };
  const trenSeries = [{ name: 'Rata-rata Indeks Vigor', data: trenData.length ? trenData : [0] }];

  // Top 5 Commodities dynamic data
  const komoditasMap: Record<string, { total: number; count: number }> = {};
  tests.forEach(t => {
    const k = t.commodity?.namaKomoditas || 'Unknown';
    if (!komoditasMap[k]) komoditasMap[k] = { total: 0, count: 0 };
    komoditasMap[k].total += t.vigor || 0;
    komoditasMap[k].count++;
  });
  const komoditasStats = Object.entries(komoditasMap)
    .map(([name, data]) => ({ name, avg: Math.round(data.total / data.count) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  const top5Options: any = {
    chart: { type: 'bar', id: 'top5-vigor', toolbar: { show: false } },
    colors: ['#10b981'],
    plotOptions: { bar: { horizontal: true, borderRadius: 2, dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val: number) => val, offsetX: 10, style: { fontSize: '10px', colors: ["#304758"] } },
    xaxis: { categories: komoditasStats.length ? komoditasStats.map(k => k.name) : ['-'], max: 1000, axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false } },
    yaxis: { labels: { style: { fontSize: '11px', fontWeight: 500 } } },
    grid: { show: false }
  };
  const top5Series = [{ name: 'Rata-rata Indeks Vigor', data: komoditasStats.length ? komoditasStats.map(k => k.avg) : [0] }];
  const getOverallStatus = (t: any, fallback: string) => {
    if (t.parameterUji) {
      try {
        const params = typeof t.parameterUji === 'string' ? JSON.parse(t.parameterUji) : t.parameterUji;
        if (Array.isArray(params) && params.length > 0) {
          const allPassed = params.every((p: any) => p.status === 'Lulus' || p.status === 'Memenuhi');
          const anyFailed = params.some((p: any) => p.status === 'Tidak Lulus' || p.status === 'Tidak Memenuhi');
          const isLulusFormat = fallback === 'Lulus' || fallback === 'Tidak Lulus' || t.status === 'Lulus' || t.status === 'Tidak Lulus';

          if (anyFailed) return isLulusFormat ? 'Tidak Lulus' : 'Tidak Memenuhi';
          if (allPassed) return isLulusFormat ? 'Lulus' : 'Memenuhi';
          return 'Sedang Diuji';
        }
      } catch (e) { }
    }
    return t.status || fallback;
  };

  return (
    <>
      <Seo title="Uji Vigor" />
      <Pageheader currentpage="Vigor" activepage="Quality Control (QC)" mainpage="Vigor" />

      <QcPageHeader
        title="Uji Vigor"
        description="Kelola dan pantau hasil uji vigor benih untuk memastikan benih memiliki potensi tumbuh kuat dan seragam."
        actionButtons={
          <>
            <AddButton onClick={() => setIsCreateModalOpen(true)} label="Tambah Uji Baru" />
            <ExportButton />
          </>
        }
      />

      <StatsWidgets items={statItems} columns={6} />

      <SharedFilterSection
        methods={methods}
        commodities={commodities}
        varieties={varieties}
        statusOptions={[
          { value: 'Memenuhi', label: 'Memenuhi' },
          { value: 'Mendekati', label: 'Mendekati' },
          { value: 'Tidak Memenuhi', label: 'Tidak Memenuhi' }
        ]}
        methodValueKey="nama"
        onFilter={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        onReset={() => {
          setFilters({});
          setPage(1);
        }}
      />

      <div className="grid grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Daftar Hasil Uji Vigor</h5>
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
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Varietas</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Lot / Sampel</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Tanggal Uji</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Metode Uji</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Petugas Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Indeks Vigor (%)</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kategori</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                      <th className="hidden 2xl:table-cell text-left text-xs font-semibold text-gray-500 py-3 px-4">Lampiran</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.length > 0 ? tests.map((row, idx) => {
                      const status = getOverallStatus(row, 'Memenuhi');
                      return (
                        <React.Fragment key={row.id || idx}>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                            <td className="2xl:hidden py-2 px-2 text-center w-8">
                              <button
                                onClick={() => toggleRow(row.id)}
                                className="text-white bg-[#1B4E3B] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold leading-none focus:outline-none"
                              >
                                {expandedRows[row.id] ? '-' : '+'}
                              </button>
                            </td>
                            <td className="text-sm py-2 px-4">{(page - 1) * pageSize + idx + 1}</td>
                            <td className="text-sm font-medium text-primary py-2 px-4">{row.kodeBatch}</td>
                            <td className="text-sm py-2 px-4">{row.commodity?.namaKomoditas || '-'}</td>
                            <td className="text-sm py-2 px-4">{row.variety?.namaVarietas || '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.lotNoBenih || '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString('id-ID') : '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.testMethod?.nama || '-'}</td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.petugasUji?.nama || '-'}</td>
                            <td className="text-sm py-2 px-4 font-semibold">{row.indeksVigor?.toFixed(1).replace('.', ',') || '-'}</td>
                            <td className="py-2 px-4">
                              <span className={`text-sm font-semibold ${row.kategori === 'Tinggi' ? 'text-success' : row.kategori === 'Sedang' ? 'text-warning' : 'text-danger'}`}>
                                {row.kategori}
                              </span>
                            </td>
                            <td className="py-2 px-4">
                              <span className={`badge ${status === 'Memenuhi' || status === 'Lulus' ? 'bg-success/10 text-success' : status === 'Mendekati' ? 'bg-warning/10 text-warning' : status === 'Tidak Memenuhi' || status === 'Tidak Lulus' ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-500'}`}>
                                {status}
                              </span>
                            </td>
                            <td className="hidden 2xl:table-cell text-sm py-2 px-4">
                              {row.lampirans && row.lampirans.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                  {row.lampirans.map((lampiran: any, i: number) => (
                                    <a key={lampiran.id || i} href={lampiran.url} target="_blank" rel="noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>File {i + 1}</a>
                                  ))}
                                </div>
                              ) : '-'}
                            </td>
                            <td className="py-2 px-4 text-center">
                              <div className="flex justify-center gap-1">
                                <ViewIconButton />
                                <EditIconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }} />
                              </div>
                            </td>
                          </tr>
                          {expandedRows[row.id] && (
                            <tr className="2xl:hidden bg-gray-50/80 border-b border-gray-100">
                              <td colSpan={10} className="py-3 px-6">
                                <ul className="text-sm space-y-1 text-gray-600">
                                  <li><span className="font-semibold text-gray-800">Lot / Sampel:</span> {row.lotNoBenih || '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Tanggal Uji:</span> {row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString('id-ID') : '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Metode Uji:</span> {row.testMethod?.nama || '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Petugas Uji:</span> {row.petugasUji?.nama || '-'}</li>
                                  <li><span className="font-semibold text-gray-800">Lampiran:</span> {row.lampirans && row.lampirans.length > 0 ? (
                                    <div className="flex flex-col gap-1 mt-1 ml-4">
                                      {row.lampirans.map((lampiran: any, i: number) => (
                                        <a key={lampiran.id || i} href={lampiran.url} target="_blank" rel="noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>File {i + 1}</a>
                                      ))}
                                    </div>
                                  ) : '-'}</li>
                                </ul>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    }) : (
                      <tr>
                        <td colSpan={14} className="text-center py-4 text-gray-500">Tidak ada data ditemukan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="box-footer border-t border-gray-100 p-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Menampilkan {tests.length > 0 ? (page - 1) * pageSize + 1 : 0} - {Math.min(page * pageSize, total)} dari {total} data</span>
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
                    className="btn btn-sm btn-light p-1 px-2"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  ><i className="ri-arrow-left-s-line"></i></button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`btn btn-sm ${page === i + 1 ? 'btn-primary bg-[#1B4E3B] text-white' : 'btn-light'} p-1 px-2`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="btn btn-sm btn-light p-1 px-2"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  ><i className="ri-arrow-right-s-line"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Ringkasan Vigor</h5>
              <span className="text-[10px] text-gray-400">Update terakhir: 11/06/2026 14:30 WIB</span>
            </div>
            <div className="box-body p-4">
              <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                <div className="w-full xl:w-1/2">
                  <ClientChart id="ringkasan-vigor-chart" dataKey={tests.length} options={ringkasanOptions} series={ringkasanSeries} type="donut" height={230} />
                </div>
                <div className="w-full xl:w-1/2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-success"></span><span className="text-xs text-gray-600">Vigor Tinggi (≥ 800)</span></div>
                    <span className="text-xs font-bold">{tinggiCount} <span className="text-gray-400 font-normal">({tinggiPerc}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-warning"></span><span className="text-xs text-gray-600">Vigor Sedang (600 - 799)</span></div>
                    <span className="text-xs font-bold">{sedangCount} <span className="text-gray-400 font-normal">({sedangPerc}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-danger"></span><span className="text-xs text-gray-600">Vigor Rendah (&lt; 600)</span></div>
                    <span className="text-xs font-bold">{rendahCount} <span className="text-gray-400 font-normal">({rendahPerc}%)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Distribusi Indeks Vigor</h5>
              <span className="text-xs text-gray-500 cursor-pointer hover:text-primary transition-colors">Lihat Detail</span>
            </div>
            <div className="box-body p-4">
              <ClientChart id="dist-vigor-chart" options={distribusiOptions} series={distribusiSeries} type="bar" height={240} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 4 WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100 flex justify-between items-center">
            <h5 className="box-title text-base font-semibold">Tren Rata-rata Indeks Vigor</h5>
            <div className="dropdown">
              <button className="btn btn-sm btn-light border-gray-200 text-xs flex items-center gap-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                30 Hari Terakhir <i className="ri-arrow-down-s-line"></i>
              </button>
            </div>
          </div>
          <div className="box-body p-4">
            <ClientChart id="tren-vigor-chart" options={trenOptions} series={trenSeries} type="line" height={200} />
          </div>
        </div>

        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100 flex justify-between items-center">
            <h5 className="box-title text-base font-semibold">Top 5 Komoditas (Rata-rata Indeks Vigor)</h5>
          </div>
          <div className="box-body p-4">
            <ClientChart id="top5-vigor-chart" options={top5Options} series={top5Series} type="bar" height={200} />
          </div>
        </div>

        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100">
            <h5 className="box-title text-base font-semibold">Parameter & Standar (ISTA)</h5>
          </div>
          <div className="box-body p-0">
            <table className="table min-w-full whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr><th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Parameter</th><th className="text-right text-xs font-semibold text-gray-500 py-2 px-4">Standar (ISTA)</th></tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Indeks Vigor Tinggi</td><td className="text-xs py-2 px-4 text-right font-semibold">≥ 800</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Indeks Vigor Sedang</td><td className="text-xs py-2 px-4 text-right">600 - 799</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Indeks Vigor Rendah</td><td className="text-xs py-2 px-4 text-right">&lt; 600</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Metode Uji</td><td className="text-xs py-2 px-4 text-right">ISTA - SV / CV</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Suhu</td><td className="text-xs py-2 px-4 text-right">20 - 30 °C</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Lama Uji</td><td className="text-xs py-2 px-4 text-right">3 - 7 Hari</td></tr>
                <tr><td className="text-xs py-2 px-4 font-medium text-gray-400">Sumber: ISTA Rules 2024</td><td className="text-xs py-2 px-4 text-right"></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateVigorModal
          isOpen={isCreateModalOpen}
          onClose={() => { setIsCreateModalOpen(false); setEditData(null); }}
          onSuccess={() => { fetchData(); toast.success('Berhasil menyimpan data Uji Vigor!'); setEditData(null); }}
          initialData={editData}
          methods={methods}
          commodities={commodities}
          varieties={varieties}
        />
      )}
    </>
  );
}
