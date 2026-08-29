"use client"
import React, { useState, useEffect } from 'react';
import { ViewIconButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import ClientChart from '../../shared/ClientChart';
import SharedFilterSection from '../shared/SharedFilterSection';
import QcPageHeader from '../shared/QcPageHeader';
import { qcTestService } from '@/app/services/qcTestService';
import { commodityService } from '@/app/services/commodityService';
import { varietyService } from '@/app/services/varietyService';

export default function StatusLulusRejectPage() {
  const [filters, setFilters] = useState<any>({});
  const [commodities, setCommodities] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any>({
    summary: { lulus: 0, reject: 0, pending: 0, totalTests: 0, totalCommodities: 0 },
    statusPerKomoditas: [],
    trenStatus: [],
    topPenyebabReject: []
  });

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const resTable = await qcTestService.getQcTests({ page, pageSize, ...filters });
      if (resTable?.data && !Array.isArray(resTable)) {
        setTests(resTable.data);
        setTotal(resTable.pagination?.totalItems || 0);
        setTotalPages(resTable.pagination?.totalPages || 1);
        if (resTable.pagination?.currentPage) setPage(resTable.pagination.currentPage);
      } else {
        setTests(Array.isArray(resTable) ? resTable : []);
      }

      const resSummary = await qcTestService.getQcTestSummary(filters);
      if (resSummary?.success) {
        setSummaryData(resSummary);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters]);

  useEffect(() => {
    commodityService.getCommodities({}).then(res => setCommodities(res.data || [])).catch(console.error);
    varietyService.getVarieties({}).then(res => setVarieties(res.data || [])).catch(console.error);
  }, []);

  const totalTests = summaryData.summary.totalTests || 0;
  const lulus = summaryData.summary.lulus || 0;
  const reject = summaryData.summary.reject || 0;
  const pending = summaryData.summary.pending || 0;
  const totalCommodities = summaryData.summary.totalCommodities || 0;
  
  const lulusPerc = totalTests > 0 ? ((lulus / totalTests) * 100).toFixed(1) : "0.0";
  const rejectPerc = totalTests > 0 ? ((reject / totalTests) * 100).toFixed(1) : "0.0";
  const pendingPerc = totalTests > 0 ? ((pending / totalTests) * 100).toFixed(1) : "0.0";

  const statItems: StatItem[] = [
    {
      title: "Lulus",
      value: lulus.toString(),
      subtitle: `(${lulusPerc}%)`,
      icon: "ri-checkbox-circle-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Reject",
      value: reject.toString(),
      subtitle: `(${rejectPerc}%)`,
      icon: "ri-close-circle-line",
      bgColor: "bg-danger/10",
      textColor: "text-danger"
    },
    {
      title: "Pending",
      value: pending.toString(),
      subtitle: `(${pendingPerc}%)`,
      icon: "ri-time-line",
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      title: "Total Batch Diuji",
      value: totalTests.toString(),
      subtitle: "100%",
      icon: "ri-flask-line",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      title: "Komoditas",
      value: totalCommodities.toString(),
      subtitle: "Komoditas",
      icon: "ri-leaf-line",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  // Chart Options
  const ringkasanOptions: any = {
    chart: { type: 'donut', id: 'donut-ringkasan' },
    labels: ['Lulus', 'Reject', 'Pending'],
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true, fontSize: '12px' }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Total Batch', formatter: () => totalTests.toString() } } } } },
    dataLabels: { enabled: false },
    legend: { show: true, position: 'right' },
    stroke: { width: 0 }
  };
  const ringkasanSeries = [lulus, reject, pending];

  const trenOptions: any = {
    chart: { type: 'line', id: 'tren-status', toolbar: { show: false } },
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    stroke: { curve: 'smooth', width: [2, 2, 2] },
    xaxis: { 
      categories: summaryData.trenStatus.length > 0 ? summaryData.trenStatus.map((t: any) => t.date) : ['-'],
      labels: { style: { colors: '#9ca3af', fontSize: '11px' } }, 
      axisBorder: { show: false }, axisTicks: { show: false } 
    },
    yaxis: { labels: { style: { colors: '#9ca3af', fontSize: '11px' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
    markers: { size: 4, strokeWidth: 2, hover: { size: 6 } },
    legend: { show: true, position: 'bottom' }
  };
  const trenSeries = [
    { name: 'Lulus', data: summaryData.trenStatus.map((t: any) => t.Lulus) },
    { name: 'Reject', data: summaryData.trenStatus.map((t: any) => t.Reject) },
    { name: 'Pending', data: summaryData.trenStatus.map((t: any) => t.Pending) }
  ];

  const komoditasOptions: any = {
    chart: { type: 'bar', id: 'komoditas-status', stacked: true, toolbar: { show: false } },
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    plotOptions: { bar: { horizontal: true, borderRadius: 2 } },
    dataLabels: { enabled: true, style: { fontSize: '10px' } },
    xaxis: { 
      categories: summaryData.statusPerKomoditas.length > 0 ? summaryData.statusPerKomoditas.map((k: any) => k.name) : ['-'],
      axisBorder: { show: false }, axisTicks: { show: false } 
    },
    legend: { position: 'top' },
    grid: { show: false }
  };
  const komoditasSeries = [
    { name: 'Lulus', data: summaryData.statusPerKomoditas.map((k: any) => k.Lulus) },
    { name: 'Reject', data: summaryData.statusPerKomoditas.map((k: any) => k.Reject) },
    { name: 'Pending', data: summaryData.statusPerKomoditas.map((k: any) => k.Pending) }
  ];

  const penyebabLabels = summaryData.topPenyebabReject.map((p: any) => p.name);
  const penyebabValues = summaryData.topPenyebabReject.map((p: any) => p.value);
  const penyebabColors = ['#10b981', '#6b7280', '#d4af37', '#f87171', '#ef4444'];
  const penyebabOptions: any = {
    chart: { type: 'donut', id: 'donut-penyebab' },
    labels: penyebabLabels.length > 0 ? penyebabLabels : ['-'],
    colors: penyebabColors,
    plotOptions: { pie: { donut: { size: '65%', labels: { show: true, name: { show: false }, value: { show: true, fontSize: '24px', fontWeight: 'bold', offsetY: 5 }, total: { show: true, label: 'Total Reject', showAlways: true, formatter: () => reject.toString() } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };

  const kelulusanOptions: any = {
    chart: { type: 'radialBar', id: 'kelulusan-gauge' },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: { background: "#e7e7e7", strokeWidth: '97%', margin: 5 },
        dataLabels: {
          name: { show: false },
          value: { offsetY: -2, fontSize: '22px', fontWeight: 'bold' }
        }
      }
    },
    colors: ['#10b981'],
    labels: ['Persentase']
  };
  const kelulusanSeries = [Number(lulusPerc)];

  return (
    <>
      <Seo title="Status Lulus / Reject" />
      <Pageheader currentpage="Status Lulus / Reject" activepage="Quality Control (QC)" mainpage="Status Lulus / Reject" />

      <QcPageHeader
        title="Status Lulus / Reject"
        description="Monitor dan kelola status kelulusan hasil quality control setiap batch benih."
        actionButtons={
          <>
            <button className="btn btn-outline-light btn-sm flex items-center gap-2">
              <i className="ri-download-2-line"></i> Export Laporan <i className="ri-arrow-down-s-line"></i>
            </button>
          </>
        }
      />

      <StatsWidgets items={statItems} columns={5} />

      <SharedFilterSection
        methods={[]} // Hide method filter if not needed, or pass methods
        commodities={commodities}
        varieties={varieties}
        statusOptions={[
          { value: 'lulus', label: 'LULUS' },
          { value: 'reject', label: 'REJECT' },
          { value: 'pending', label: 'PENDING' }
        ]}
        onFilter={(newFilters) => {
          setFilters(newFilters);
          setPage(1);
        }}
        onReset={() => {
          setFilters({});
          setPage(1);
        }}
      />

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Daftar Status Lulus / Reject</h5>
            </div>
            <div className="box-body p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">No</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kode Batch</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Komoditas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Varietas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Lokasi / Lab</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Tanggal Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Jenis Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Alasan Reject</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.length > 0 ? tests.map((row, index) => {
                      const statusUpper = (row.status || '').toUpperCase();
                      const isReject = statusUpper.includes('REJECT') || statusUpper.includes('TOLAK') || statusUpper.includes('TIDAK LULUS');
                      const isLulus = !isReject && statusUpper.includes('LULUS');
                      const statusClass = isLulus ? 'bg-success/10 text-success' 
                                        : isReject ? 'bg-danger/10 text-danger' 
                                        : 'bg-warning/10 text-warning';
                      const alasan = isReject ? (row.catatan || 'Kondisi tidak memenuhi standar') : '-';
                      
                      return (
                        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="text-sm py-2 px-4">{(page - 1) * pageSize + index + 1}</td>
                          <td className="text-sm font-medium text-primary py-2 px-4">{row.kodeBatch}</td>
                          <td className="text-sm py-2 px-4">{row.commodity?.namaKomoditas || '-'}</td>
                          <td className="text-sm py-2 px-4">{row.variety?.namaVarietas || '-'}</td>
                          <td className="text-sm py-2 px-4">{row.lokasiLab || 'Lab. Benih Utama'}</td>
                          <td className="text-sm py-2 px-4">{row.tanggalUji ? new Date(row.tanggalUji).toLocaleDateString('id-ID') : '-'}</td>
                          <td className="text-sm py-2 px-4">{row.jenisUji || '-'}</td>
                          <td className="py-2 px-4">
                            <span className={`badge ${statusClass}`}>{statusUpper}</span>
                          </td>
                          <td className="text-sm py-2 px-4 truncate max-w-[150px]" title={alasan}>{alasan}</td>
                          <td className="py-2 px-4 text-center">
                            <ViewIconButton />
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={10} className="text-center py-4 text-gray-500">Tidak ada data ditemukan</td>
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
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Ringkasan Status</h5>
            </div>
            <div className="box-body p-4 flex flex-col justify-center min-h-[250px]">
              {totalTests > 0 ? (
                <ClientChart id="ringkasan-chart" options={ringkasanOptions} series={ringkasanSeries} type="donut" height={250} dataKey={`ringkasan-${totalTests}`} />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                  <i className="ri-pie-chart-2-line text-4xl mb-2"></i>
                  <span className="text-sm">Belum ada data</span>
                </div>
              )}
            </div>
          </div>

          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100 flex justify-between items-center">
              <h5 className="box-title text-base font-semibold">Tren Status (30 Hari Terakhir)</h5>
              <span className="text-xs text-gray-500 cursor-pointer flex items-center gap-1">
                30 Hari Terakhir <i className="ri-arrow-down-s-line"></i>
              </span>
            </div>
            <div className="box-body p-4">
              <ClientChart id="tren-chart" options={trenOptions} series={trenSeries} type="line" height={250} />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100">
            <h5 className="box-title text-base font-semibold">Status per Komoditas</h5>
          </div>
          <div className="box-body p-4">
            <ClientChart id="komoditas-chart" options={komoditasOptions} series={komoditasSeries} type="bar" height={220} />
          </div>
        </div>

        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100">
            <h5 className="box-title text-base font-semibold">Top 5 Penyebab Reject</h5>
          </div>
            <div className="box-body p-4 flex flex-col justify-center min-h-[220px]">
              {reject > 0 ? (
                <div className="flex items-center w-full h-full">
                  <div className="w-1/2 flex items-center justify-center">
                    <ClientChart id="penyebab-chart" options={penyebabOptions} series={penyebabValues.length > 0 ? penyebabValues : [1]} type="donut" height={220} dataKey={`penyebab-${reject}`} />
                  </div>
                  <div className="w-1/2 flex flex-col justify-center space-y-3 pl-2">
                    {summaryData.topPenyebabReject.map((item: any, idx: number) => {
                      const perc = reject > 0 ? ((item.value / reject) * 100).toFixed(1) : "0.0";
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: penyebabColors[idx % penyebabColors.length] }}></span>
                            <span className="text-gray-700 font-medium truncate max-w-[90px]" title={item.name}>{item.name}</span>
                          </div>
                          <div className="text-gray-600">
                            <span className="font-bold text-gray-800">{item.value}</span> ({perc}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                  <i className="ri-donut-chart-line text-4xl mb-2"></i>
                  <span className="text-sm">Belum ada data reject</span>
                </div>
              )}
            </div>
        </div>

        <div className="box shadow-sm flex flex-col justify-between">
          <div className="box-header border-b border-gray-100 text-center">
            <h5 className="box-title text-base font-semibold">Persentase Kelulusan</h5>
          </div>
          <div className="box-body p-4 flex flex-col items-center justify-center">
            <ClientChart id="kelulusan-chart" options={kelulusanOptions} series={kelulusanSeries} type="radialBar" height={220} />
            <p className="text-sm text-gray-500 mt-[-20px]">Target Minimal: 70%</p>
          </div>
        </div>

        <div className="box shadow-sm">
          <div className="box-header border-b border-gray-100">
            <h5 className="box-title text-base font-semibold">Aksi Cepat</h5>
          </div>
          <div className="box-body p-4 space-y-3">
            <div className="bg-blue-50 p-3 flex items-center justify-between rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i className="ri-file-list-line"></i></div>
                <div>
                  <h6 className="font-semibold text-sm mb-0">Lihat Batch Reject</h6>
                  <p className="text-xs text-gray-500 mb-0">Lihat daftar batch dengan status reject</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-blue-600"></i>
            </div>
            <div className="bg-blue-50 p-3 flex items-center justify-between rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i className="ri-search-line"></i></div>
                <div>
                  <h6 className="font-semibold text-sm mb-0">Pembetulan / Investigasi</h6>
                  <p className="text-xs text-gray-500 mb-0">Buat catatan pembetulan untuk batch reject</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-blue-600"></i>
            </div>
            <div className="bg-blue-50 p-3 flex items-center justify-between rounded-md cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><i className="ri-download-line"></i></div>
                <div>
                  <h6 className="font-semibold text-sm mb-0">Export Laporan Status</h6>
                  <p className="text-xs text-gray-500 mb-0">Unduh laporan status lulus / reject</p>
                </div>
              </div>
              <i className="ri-arrow-right-line text-blue-600"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <i className="ri-check-line text-success"></i> Status Lulus / Reject ditentukan berdasarkan standar ISTA Rules dan SNI yang berlaku.
      </div>
    </>
  );
}
