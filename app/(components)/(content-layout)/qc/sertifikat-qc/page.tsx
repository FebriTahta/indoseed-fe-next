"use client"
import React, { useState } from 'react';
import { ViewIconButton } from '@/app/(components)/(content-layout)/shared/ActionButtons';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Seo from '@/shared/layouts-components/seo/seo';
import StatsWidgets, { StatItem } from '../../shared/StatsWidgets';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CreateCertificateModal from './CreateCertificateModal';
import QcPageHeader from '../shared/QcPageHeader';
import DownloadCertificateModal from './DownloadCertificateModal';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function SertifikatQCPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // --- DUMMY DATA ---
  const tableData = [
    { id: 1, noSert: "QC-2026-0001", batch: "QC-2606-0001", komoditas: "Padi", varietas: "Inpari 32", param: "5 Parameter", tglUji: "11/06/2026", tglTerbit: "12/06/2026", status: "Diterbitkan", berlaku: "12/12/2026" },
    { id: 2, noSert: "QC-2026-0002", batch: "QC-2606-0002", komoditas: "Jagung", varietas: "Pioneer 21", param: "5 Parameter", tglUji: "11/06/2026", tglTerbit: "12/06/2026", status: "Diterbitkan", berlaku: "12/12/2026" },
    { id: 3, noSert: "QC-2026-0003", batch: "QC-2606-0003", komoditas: "Kedelai", varietas: "Anjasmoro", param: "5 Parameter", tglUji: "10/06/2026", tglTerbit: "11/06/2026", status: "Diterbitkan", berlaku: "11/12/2026" },
    { id: 4, noSert: "QC-2026-0004", batch: "QC-2606-0004", komoditas: "Padi", varietas: "Inpari 42", param: "5 Parameter", tglUji: "10/06/2026", tglTerbit: "11/06/2026", status: "Diterbitkan", berlaku: "11/12/2026" },
    { id: 5, noSert: "QC-2026-0005", batch: "QC-2606-0005", komoditas: "Jagung", varietas: "Bisi 18", param: "5 Parameter", tglUji: "09/06/2026", tglTerbit: "10/06/2026", status: "Menunggu", berlaku: "10/12/2026" },
    { id: 6, noSert: "QC-2026-0006", batch: "QC-2606-0006", komoditas: "Padi", varietas: "Ciherang", param: "5 Parameter", tglUji: "09/06/2026", tglTerbit: "-", status: "Menunggu", berlaku: "-" },
    { id: 7, noSert: "QC-2026-0007", batch: "QC-2606-0007", komoditas: "Kedelai", varietas: "Dega 1", param: "5 Parameter", tglUji: "08/06/2026", tglTerbit: "08/06/2026", status: "Diterbitkan", berlaku: "08/12/2026" },
    { id: 8, noSert: "QC-2026-0008", batch: "QC-2606-0008", komoditas: "Kacang Hijau", varietas: "Vima 1", param: "5 Parameter", tglUji: "08/06/2026", tglTerbit: "08/06/2026", status: "Diterbitkan", berlaku: "08/12/2026" },
    { id: 9, noSert: "QC-2026-0009", batch: "QC-2606-0009", komoditas: "Padi", varietas: "Mekongga", param: "5 Parameter", tglUji: "07/06/2026", tglTerbit: "08/06/2026", status: "Tidak Lulus", berlaku: "-" },
    { id: 10, noSert: "QC-2026-0010", batch: "QC-2606-0010", komoditas: "Jagung", varietas: "NK 212", param: "5 Parameter", tglUji: "07/06/2026", tglTerbit: "07/06/2026", status: "Diterbitkan", berlaku: "07/12/2026" },
  ];

  // Charts Configs
  const ringkasanOptions: any = {
    chart: { type: 'donut' },
    labels: ['Diterbitkan', 'Menunggu', 'Tidak Lulus', 'Kadaluarsa (Akan)'],
    colors: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Total', formatter: () => '324' } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };
  const ringkasanSeries = [298, 18, 8, 7];

  const distribusiOptions: any = {
    chart: { type: 'donut' },
    labels: ['Padi', 'Jagung', 'Kedelai', 'Kacang Hijau', 'Lainnya'],
    colors: ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#8b5cf6'],
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, name: { show: true }, value: { show: true, fontSize: '24px', fontWeight: 600 }, total: { show: true, label: 'Total', formatter: () => '324' } } } } },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 }
  };
  const distribusiSeries = [142, 98, 46, 18, 20];

  const trenOptions: any = {
    chart: { type: 'line', toolbar: { show: false }, sparkline: { enabled: false } },
    colors: ['#10b981'],
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 4, colors: ['#10b981'], strokeColors: '#fff', strokeWidth: 2 },
    xaxis: { categories: ['13/05', '17/05', '21/05', '25/05', '29/05', '02/06', '06/06', '10/06'], labels: { style: { colors: '#9ca3af', fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { min: 0, max: 50, tickAmount: 5, labels: { style: { colors: '#9ca3af', fontSize: '10px' } } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
    dataLabels: { enabled: false },
    tooltip: { enabled: true }
  };
  const trenSeries = [{ name: 'Jumlah Sertifikat', data: [25, 30, 22, 35, 20, 32, 28, 40] }];

  const topLabOptions: any = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '50%' } },
    colors: ['#10b981'],
    dataLabels: { enabled: true, textAnchor: 'start', style: { colors: ['#111827'], fontSize: '12px' }, formatter: function (val: any) { return val; }, offsetX: 5 },
    xaxis: { categories: ['Lab. Benih Utama', 'Balai Pengujian Mutu Benih', 'Lab. Agronesia', 'Lab. Citra Tani', 'Lab. Prima Analitika'], labels: { show: true, style: { colors: '#9ca3af', fontSize: '10px' } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: '#4b5563', fontSize: '12px', fontWeight: 500 } } },
    grid: { show: false }
  };
  const topLabSeries = [{ data: [142, 98, 46, 18, 20] }];

  const statItems: StatItem[] = [
    {
      title: "Total Sertifikat",
      value: "324",
      subtitle: "Sertifikat",
      icon: "ri-shield-check-line",
      bgColor: "bg-success/10",
      textColor: "text-success"
    },
    {
      title: "Diterbitkan",
      value: "298",
      subtitle: "92.0%",
      icon: "ri-file-check-line",
      bgColor: "bg-primary/10",
      textColor: "text-primary"
    },
    {
      title: "Menunggu",
      value: "18",
      subtitle: "5.6%",
      icon: "ri-time-line",
      bgColor: "bg-warning/10",
      textColor: "text-warning"
    },
    {
      title: "Tidak Lulus",
      value: "8",
      subtitle: "2.4%",
      icon: "ri-close-circle-line",
      bgColor: "bg-danger/10",
      textColor: "text-danger"
    },
    {
      title: "Kadaluarsa (Akan)",
      value: "7",
      subtitle: "Dalam 30 hari",
      icon: "ri-calendar-event-line",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  return (
    <>
      <Seo title="Sertifikat QC" />
      <ToastContainer />
      <Pageheader currentpage="Sertifikat QC" activepage="Quality Control" mainpage="Sertifikat QC" />

      {/* Header & Actions */}
      <QcPageHeader
        title="Sertifikat QC"
        description="Kelola dan pantau sertifikat hasil quality control untuk setiap batch benih."
        actionButtons={
          <>
            <SpkButton variant="primary" onClick={() => setIsCreateModalOpen(true)}>
              <i className="ri-add-line mr-1"></i> Buat Sertifikat Baru
            </SpkButton>
            <SpkButton variant="outline-secondary" customClass="bg-white">
              <i className="ri-download-2-line mr-1"></i> Export Laporan <i className="ri-arrow-down-s-line ml-1"></i>
            </SpkButton>
          </>
        }
      />

      {/* Metric Cards */}
      <StatsWidgets items={statItems} />

      {/* Filter Row */}
      <div className="box mb-4 shadow-sm">
        <div className="box-body p-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Periode Terbit</label>
            <div className="relative">
              <input type="text" className="form-control text-sm w-full" value="01/06/2026 - 30/06/2026" readOnly />
              <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Komoditas</label>
            <select className="form-select text-sm w-full">
              <option>Semua Komoditas</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Varietas</label>
            <select className="form-select text-sm w-full">
              <option>Semua Varietas</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Status Sertifikat</label>
            <select className="form-select text-sm w-full">
              <option>Semua Status</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Laboratorium</label>
            <select className="form-select text-sm w-full">
              <option>Semua Laboratorium</option>
            </select>
          </div>
          <div className="flex gap-2">
            <SpkButton variant="light" customClass="w-full">Reset</SpkButton>
            <SpkButton variant="primary" customClass="w-full bg-[#1B4E3B]"><i className="ri-filter-3-line mr-1"></i> Terapkan</SpkButton>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* Table */}
          <div className="box shadow-sm">
            <div className="box-header border-b border-gray-100">
              <h5 className="box-title text-base font-semibold">Daftar Sertifikat QC</h5>
            </div>
            <div className="box-body p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">No.</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">No. Sertifikat</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Kode Batch</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Komoditas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Varietas</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Parameter</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Tanggal Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Tanggal Terbit</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Status</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-3 px-4">Berlaku Hingga</th>
                      <th className="text-center text-xs font-semibold text-gray-500 py-3 px-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="text-sm py-2 px-4">{row.id}</td>
                        <td className="text-sm font-medium text-primary py-2 px-4 cursor-pointer">{row.noSert}</td>
                        <td className="text-sm py-2 px-4">{row.batch}</td>
                        <td className="text-sm py-2 px-4">{row.komoditas}</td>
                        <td className="text-sm py-2 px-4">{row.varietas}</td>
                        <td className="text-sm py-2 px-4">{row.param}</td>
                        <td className="text-sm py-2 px-4">{row.tglUji}</td>
                        <td className="text-sm py-2 px-4">{row.tglTerbit}</td>
                        <td className="py-2 px-4">
                          <span className={`badge ${row.status === 'Diterbitkan' ? 'bg-success/10 text-success' : row.status === 'Menunggu' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="text-sm py-2 px-4">{row.berlaku}</td>
                        <td className="py-2 px-4 text-center flex justify-center gap-1">
                          <ViewIconButton />
                          <button className="text-gray-400 hover:text-primary transition-colors" title="Download" onClick={() => setIsDownloadModalOpen(true)}><i className="ri-download-2-line text-lg"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="box-footer p-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-gray-500">Menampilkan 1 - 10 dari 324 data</span>
              <div className="flex gap-2 items-center">
                <select className="form-select form-select-sm w-20">
                  <option>10</option>
                </select>
                <div className="flex">
                  <button className="btn btn-sm btn-light border"><i className="ri-arrow-left-s-line"></i></button>
                  <button className="btn btn-sm btn-primary border-primary">1</button>
                  <button className="btn btn-sm btn-light border">2</button>
                  <button className="btn btn-sm btn-light border">3</button>
                  <button className="btn btn-sm btn-light border">4</button>
                  <button className="btn btn-sm btn-light border">5</button>
                  <span className="px-2">...</span>
                  <button className="btn btn-sm btn-light border">33</button>
                  <button className="btn btn-sm btn-light border"><i className="ri-arrow-right-s-line"></i></button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Left Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="box shadow-sm">
              <div className="box-header border-b border-gray-100 flex justify-between items-center">
                <h5 className="box-title text-sm font-semibold">Distribusi Sertifikat per Komoditas</h5>
                <select className="form-select form-select-sm w-auto border-0 text-xs text-gray-500">
                  <option>30 Hari Terakhir</option>
                </select>
              </div>
              <div className="box-body flex items-center p-4">
                <div className="w-1/2">
                   <ReactApexChart options={distribusiOptions} series={distribusiSeries} type="donut" height={220} />
                </div>
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-success"></span>Padi</div><span className="font-semibold">142 <span className="text-gray-400 font-normal text-xs">(43.8%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-warning"></span>Jagung</div><span className="font-semibold">98 <span className="text-gray-400 font-normal text-xs">(30.2%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-orange-500"></span>Kedelai</div><span className="font-semibold">46 <span className="text-gray-400 font-normal text-xs">(14.2%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-danger"></span>Kacang Hijau</div><span className="font-semibold">18 <span className="text-gray-400 font-normal text-xs">(5.6%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-purple-500"></span>Lainnya</div><span className="font-semibold">20 <span className="text-gray-400 font-normal text-xs">(6.2%)</span></span></div>
                </div>
              </div>
            </div>

            <div className="box shadow-sm">
              <div className="box-header border-b border-gray-100 flex justify-between items-center">
                <h5 className="box-title text-sm font-semibold">Top 5 Laboratorium</h5>
                <select className="form-select form-select-sm w-auto border-0 text-xs text-gray-500">
                  <option>30 Hari Terakhir</option>
                </select>
              </div>
              <div className="box-body p-4 pt-2">
                 <ReactApexChart options={topLabOptions} series={topLabSeries} type="bar" height={220} />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
             <i className="ri-information-line text-success"></i> Sertifikat QC diterbitkan sesuai standar ISTA Rules dan SNI yang berlaku.
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Ringkasan Sertifikat */}
          <div className="box shadow-sm">
             <div className="box-header border-b border-gray-100 flex justify-between items-center">
                <h5 className="box-title text-sm font-semibold">Ringkasan Sertifikat</h5>
                <span className="text-[10px] text-gray-400">Update terakhir: 11/06/2026 14:30 WIB</span>
             </div>
             <div className="box-body p-4 flex items-center">
                <div className="w-5/12">
                   <ReactApexChart options={ringkasanOptions} series={ringkasanSeries} type="donut" height={200} />
                </div>
                <div className="w-7/12 pl-2 space-y-3">
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-success"></span>Diterbitkan</div><span className="font-semibold">298 <span className="text-gray-400 font-normal text-xs">(92.0%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-warning"></span>Menunggu</div><span className="font-semibold">18 <span className="text-gray-400 font-normal text-xs">(5.6%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-danger"></span>Tidak Lulus</div><span className="font-semibold">8 <span className="text-gray-400 font-normal text-xs">(2.4%)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-purple-500"></span>Kadaluarsa (Akan)</div><span className="font-semibold">7 <span className="text-gray-400 font-normal text-xs">(2.2%)</span></span></div>
                </div>
             </div>
          </div>

          {/* Tren Penerbitan */}
          <div className="box shadow-sm">
             <div className="box-header border-b border-gray-100 flex justify-between items-center">
                <h5 className="box-title text-sm font-semibold">Tren Penerbitan Sertifikat</h5>
                <select className="form-select form-select-sm w-auto border-0 text-xs text-gray-500">
                  <option>30 Hari Terakhir</option>
                </select>
             </div>
             <div className="box-body p-4 pt-2">
                <ReactApexChart options={trenOptions} series={trenSeries} type="line" height={180} />
                <div className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-2">
                   <span className="w-3 h-1 bg-success block"></span> Jumlah Sertifikat
                </div>
             </div>
          </div>

          {/* Masa Berlaku Sertifikat */}
          <div className="box shadow-sm">
             <div className="box-header border-b border-gray-100">
                <h5 className="box-title text-sm font-semibold">Masa Berlaku Sertifikat</h5>
             </div>
             <div className="box-body p-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-success/5 border border-success/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-semibold text-success">&gt; 90 Hari</span>
                         <i className="ri-refresh-line text-success"></i>
                      </div>
                      <h4 className="text-xl font-bold text-success mb-0">238</h4>
                      <span className="text-xs text-success">73.5%</span>
                   </div>
                   <div className="bg-warning/5 border border-warning/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-semibold text-warning">31 - 90 Hari</span>
                         <i className="ri-refresh-line text-warning"></i>
                      </div>
                      <h4 className="text-xl font-bold text-warning mb-0">72</h4>
                      <span className="text-xs text-warning">22.2%</span>
                   </div>
                   <div className="bg-danger/5 border border-danger/10 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-semibold text-danger">&lt; 30 Hari</span>
                         <i className="ri-download-2-line text-danger"></i>
                      </div>
                      <h4 className="text-xl font-bold text-danger mb-0">7</h4>
                      <span className="text-xs text-danger">2.2%</span>
                   </div>
                   <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-semibold text-purple-600">Kadaluarsa</span>
                         <i className="ri-download-2-line text-purple-600"></i>
                      </div>
                      <h4 className="text-xl font-bold text-purple-600 mb-0">7</h4>
                      <span className="text-xs text-purple-600">2.2%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Dokumentasi & Template */}
          <div className="box shadow-sm">
             <div className="box-header border-b border-gray-100">
                <h5 className="box-title text-sm font-semibold">Dokumentasi & Template</h5>
             </div>
             <div className="box-body p-4 space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                         <i className="ri-file-word-2-fill text-lg"></i>
                      </div>
                      <div>
                         <p className="text-sm font-medium mb-0">Template Sertifikat QC</p>
                         <span className="text-[10px] text-gray-500">DOCX • 124 KB</span>
                      </div>
                   </div>
                   <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded">
                         <i className="ri-file-excel-2-fill text-lg"></i>
                      </div>
                      <div>
                         <p className="text-sm font-medium mb-0">Format Laporan Hasil Uji</p>
                         <span className="text-[10px] text-gray-500">XLSX • 86 KB</span>
                      </div>
                   </div>
                   <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded">
                         <i className="ri-file-pdf-2-fill text-lg"></i>
                      </div>
                      <div>
                         <p className="text-sm font-medium mb-0">Panduan Penerbitan Sertifikat</p>
                         <span className="text-[10px] text-gray-500">PDF • 1.2 MB</span>
                      </div>
                   </div>
                   <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded">
                         <i className="ri-file-pdf-2-fill text-lg"></i>
                      </div>
                      <div>
                         <p className="text-sm font-medium mb-0">SOP Penerbitan Sertifikat QC</p>
                         <span className="text-[10px] text-gray-500">PDF • 382 KB</span>
                      </div>
                   </div>
                   <button className="text-gray-400 hover:text-primary"><i className="ri-download-2-line"></i></button>
                </div>
             </div>
          </div>

        </div>
      </div>

      <CreateCertificateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <DownloadCertificateModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />

    </>
  );
}
