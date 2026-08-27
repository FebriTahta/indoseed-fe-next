"use client"
import React, { useState, useEffect } from 'react';
import { ViewIconButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import { AddButton, ExportButton, FilterButton, ResetButton } from '../../shared/ActionButtons';
import ClientChart from '../../shared/ClientChart';
import CreateKemurnianModal from './CreateKemurnianModal';
import SharedFilterSection from '../shared/SharedFilterSection';
import { qcKemurnianService } from '@/app/services/qcKemurnianService';
import { qcService } from '@/app/services/qcService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';

export default function KemurnianPage() {
  const [filters, setFilters] = useState<any>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const fetchData = () => {
    qcKemurnianService.getQcKemurnianList({ page, pageSize, ...filters }).then(res => {
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

  const totalUji = tests.length;
  const totalSampel = tests.reduce((acc, t) => acc + (t.jumlahSampel || 1), 0);

  let memenuhiCount = 0;
  let mendekatiCount = 0;
  let tidakMemenuhiCount = 0;
  let totalKemurnian = 0;

  tests.forEach(t => {
    const status = t.status;
    if (status === 'Memenuhi') memenuhiCount++;
    else if (status === 'Mendekati') mendekatiCount++;
    else if (status === 'Tidak Memenuhi') tidakMemenuhiCount++;

    totalKemurnian += (t.kemurnian || 0);
  });

  const avgKemurnian = totalUji > 0 ? (totalKemurnian / totalUji) : 0;
  const memenuhiPerc = totalUji > 0 ? ((memenuhiCount / totalUji) * 100).toFixed(2) : "0.00";
  const mendekatiPerc = totalUji > 0 ? ((mendekatiCount / totalUji) * 100).toFixed(2) : "0.00";
  const tidakMemenuhiPerc = totalUji > 0 ? ((tidakMemenuhiCount / totalUji) * 100).toFixed(2) : "0.00";

  const statItems: StatItem[] = [
    {
      title: "Total Batch Diuji",
      value: (total || totalUji).toString(),
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
      title: "Rata-rata Kemurnian",
      value: `${avgKemurnian.toFixed(2).replace('.', ',')} %`,
      subtitle: "Dari semua sampel",
      icon: "ri-focus-2-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Memenuhi Standar",
      value: memenuhiCount.toString(),
      subtitle: `${memenuhiPerc}%`,
      icon: "ri-checkbox-circle-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Mendekati Batas",
      value: mendekatiCount.toString(),
      subtitle: `${mendekatiPerc}%`,
      icon: "ri-time-line",
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      title: "Tidak Memenuhi",
      value: tidakMemenuhiCount.toString(),
      subtitle: `${tidakMemenuhiPerc}%`,
      icon: "ri-close-circle-line",
      bgColor: "bg-danger/10",
      textColor: "text-danger"
    }
  ];

  // Charts
  const ringkasanOptions: any = {
    chart: { type: 'donut', id: 'donut-kemurnian' },
    labels: ['Memenuhi (≥ 98%)', 'Mendekati (95 - < 98%)', 'Tidak Memenuhi (< 95%)'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '12px' }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Sampel', formatter: () => totalSampel.toString() } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };
  const ringkasanSeries = [memenuhiCount, mendekatiCount, tidakMemenuhiCount];

  const distribusiOptions: any = {
    chart: { type: 'bar', id: 'dist-kemurnian', toolbar: { show: false } },
    colors: ['#10b981'],
    plotOptions: { bar: { borderRadius: 2, columnWidth: '40%', dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val: number) => val, offsetY: -20, style: { fontSize: '12px', colors: ["#304758"] } },
    xaxis: { categories: ['< 90%', '90 - 93%', '93 - 95%', '95 - 98%', '98 - 99%', '> 99%'], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { title: { text: 'Jumlah Sampel', style: { fontSize: '11px', fontWeight: 400, color: '#9ca3af' } } },
    grid: { show: false },
  };
  const distribusiSeries = [{ name: 'Jumlah Sampel', data: [1, 2, 6, 9, 32, 75] }];

  const trenOptions: any = {
    chart: { type: 'line', id: 'tren-kemurnian', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: [2] },
    xaxis: { categories: ['13/05', '17/05', '21/05', '25/05', '29/05', '03/06', '10/06'], labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 90, max: 100, labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, title: { text: 'Persentase (%)', style: { fontSize: '11px', fontWeight: 400, color: '#9ca3af' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4, yaxis: { lines: { show: true } } },
    markers: { size: 4, colors: ['#fff'], strokeColors: ['#10b981'], strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' },
    tooltip: { theme: 'light' }
  };
  const trenSeries = [{ name: 'Rata-rata Kemurnian (%)', data: [98.2, 96.5, 97.8, 97.1, 98.5, 98.4, 98.45] }];

  const top5Options: any = {
    chart: { type: 'bar', id: 'top5-kemurnian', toolbar: { show: false } },
    colors: ['#10b981'],
    plotOptions: { bar: { horizontal: true, borderRadius: 2, dataLabels: { position: 'top' } } },
    dataLabels: { enabled: true, formatter: (val: number) => val + '%', offsetX: 10, style: { fontSize: '10px', colors: ["#304758"] } },
    xaxis: { categories: ['Padi', 'Jagung', 'Kedelai', 'Kacang Hijau', 'K. Tanah'], max: 100, axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false } },
    yaxis: { labels: { style: { fontSize: '11px', fontWeight: 500 } } },
    grid: { show: false }
  };
  const top5Series = [{ name: 'Rata-rata Kemurnian (%)', data: [99.5, 98.2, 97.5, 96.8, 95.5] }];

  return (
    <>
      <Seo title="Uji Kemurnian" />
      <Pageheader currentpage="Kemurnian" activepage="Quality Control (QC)" mainpage="Kemurnian" />

      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-xl text-gray-800 mb-1">Uji Kemurnian</h4>
          <p className="text-sm text-gray-500">Kelola dan pantau hasil uji kemurnian benih untuk memastikan benih bebas dari kotoran dan benih tanaman lain.</p>
        </div>
        <div className="flex gap-2">
          <AddButton onClick={() => setIsCreateModalOpen(true)} label="Tambah Uji Baru" />
          <ExportButton />
        </div>
      </div>

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
              <h5 className="box-title text-base font-semibold">Daftar Hasil Uji Kemurnian</h5>
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
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kemurnian (%)</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.length > 0 ? tests.map((row, index) => (
                      <React.Fragment key={row.id}>
                        <tr className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                          <td className="2xl:hidden py-2 px-2 text-center w-8">
                            <button
                              onClick={() => toggleRow(row.id)}
                              className="text-white bg-[#1B4E3B] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold leading-none focus:outline-none"
                            >
                              {expandedRows[row.id] ? '-' : '+'}
                            </button>
                          </td>
                          <td className="text-sm py-2 px-4">{(page - 1) * pageSize + index + 1}</td>
                          <td className="text-sm font-medium text-primary py-2 px-4">{row.kodeBatch}</td>
                          <td className="text-sm py-2 px-4">{row.commodity?.namaKomoditas || '-'}</td>
                          <td className="text-sm py-2 px-4">{row.variety?.namaVarietas || '-'}</td>
                          <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.lotNoBenih || '-'}</td>
                          <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString('id-ID') : '-'}</td>
                          <td className="hidden 2xl:table-cell text-sm py-2 px-4">{row.metodeUji || '-'}</td>
                          <td className="text-sm py-2 px-4 font-semibold">{row.kemurnian?.toFixed(2).replace('.', ',') || '-'}</td>
                          <td className="py-2 px-4">
                            <span className={`badge ${row.status === 'Memenuhi' ? 'bg-success/10 text-success' : row.status === 'Mendekati' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-center">
                            <div className="flex justify-center gap-1">
                              <ViewIconButton />
                              <button className="text-gray-400 hover:text-primary transition-colors"><i className="ri-download-2-line text-lg"></i></button>
                            </div>
                          </td>
                        </tr>
                        {expandedRows[row.id] && (
                          <tr className="2xl:hidden bg-gray-50/80 border-b border-gray-100">
                            <td colSpan={8} className="py-3 px-6">
                              <ul className="text-sm space-y-1 text-gray-600">
                                <li><span className="font-semibold text-gray-800">Lot / Sampel:</span> {row.lotNoBenih || '-'}</li>
                                <li><span className="font-semibold text-gray-800">Tanggal Uji:</span> {row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString('id-ID') : '-'}</li>
                                <li><span className="font-semibold text-gray-800">Metode Uji:</span> {row.metodeUji || '-'}</li>
                              </ul>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )) : (
                      <tr>
                        <td colSpan={11} className="text-center py-4 text-gray-500">Tidak ada data ditemukan</td>
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
              <h5 className="box-title text-base font-semibold">Ringkasan Kemurnian</h5>
              <span className="text-[10px] text-gray-400">Update terakhir: 11/06/2026 14:30 WIB</span>
            </div>
            <div className="box-body p-4">
              <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
                <div className="w-full xl:w-1/2">
                  <ClientChart id="ringkasan-kemurnian-chart" dataKey={tests.length} options={ringkasanOptions} series={ringkasanSeries} type="donut" height={230} />
                </div>
                <div className="w-full xl:w-1/2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-success"></span><span className="text-xs text-gray-600">Memenuhi (≥ 98%)</span></div>
                    <span className="text-xs font-bold">{memenuhiCount} <span className="text-gray-400 font-normal">({memenuhiPerc}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-warning"></span><span className="text-xs text-gray-600">Mendekati (95 - &lt; 98%)</span></div>
                    <span className="text-xs font-bold">{mendekatiCount} <span className="text-gray-400 font-normal">({mendekatiPerc}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-danger"></span><span className="text-xs text-gray-600">Tidak Memenuhi (&lt; 95%)</span></div>
                    <span className="text-xs font-bold">{tidakMemenuhiCount} <span className="text-gray-400 font-normal">({tidakMemenuhiPerc}%)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Distribusi Kemurnian (%)</h5>
            </div>
            <div className="box-body p-4">
              <ClientChart id="dist-kemurnian-chart" options={distribusiOptions} series={distribusiSeries} type="bar" height={240} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 4 WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100 flex justify-between items-center">
            <h5 className="box-title text-base font-semibold">Tren Rata-rata Kemurnian (%)</h5>
          </div>
          <div className="box-body p-4">
            <ClientChart id="tren-kemurnian-chart" options={trenOptions} series={trenSeries} type="line" height={200} />
          </div>
        </div>

        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100 flex justify-between items-center">
            <h5 className="box-title text-base font-semibold">Top 5 Komoditas (Rata-rata Kemurnian)</h5>
          </div>
          <div className="box-body p-4">
            <ClientChart id="top5-kemurnian-chart" options={top5Options} series={top5Series} type="bar" height={200} />
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
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Kemurnian Minimal</td><td className="text-xs py-2 px-4 text-right font-semibold">98%</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Kotoran (Inert Matter)</td><td className="text-xs py-2 px-4 text-right">Maks. 2%</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Benih Tanaman Lain (Other Crop Seed)</td><td className="text-xs py-2 px-4 text-right">Maks. 2%</td></tr>
                <tr className="border-b border-gray-50"><td className="text-xs py-2 px-4 font-medium">Benih Gulma (Weed Seed)</td><td className="text-xs py-2 px-4 text-right">Maks. 0,1%</td></tr>
                <tr><td className="text-xs py-2 px-4 font-medium">Bahan Asing Lainnya</td><td className="text-xs py-2 px-4 text-right">Sesuai ISTA</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateKemurnianModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => { fetchData(); }}
      />
    </>
  );
}
