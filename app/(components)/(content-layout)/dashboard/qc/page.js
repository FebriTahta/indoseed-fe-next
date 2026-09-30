"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardQC() {
  const router = useRouter();

  // --- MOCK DATA ---

  // Donut Chart
  const statusOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    labels: [
      "Menunggu Sampel",
      "Sampel Diterima",
      "Dalam Pengujian",
      "Menunggu Review",
      "Selesai",
    ],
    colors: ["#94a3b8", "#3b82f6", "#eab308", "#f97316", "#10b981"],
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            name: { show: true, offsetY: -10, color: "#6b7280", fontSize: "12px" },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: "bold",
              offsetY: 5,
              color: "#1f2937",
              formatter: (val) => val,
            },
            total: {
              show: true,
              label: "Total Sampel",
              color: "#6b7280",
              formatter: () => "24",
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 0 },
  };
  const statusSeries = [3, 5, 8, 4, 18];

  const statusLegend = [
    { label: "Menunggu Sampel", value: 3, percent: "12.5%", color: "bg-gray-400" },
    { label: "Sampel Diterima", value: 5, percent: "20.8%", color: "bg-blue-500" },
    { label: "Dalam Pengujian", value: 8, percent: "33.3%", color: "bg-yellow-500" },
    { label: "Menunggu Review", value: 4, percent: "16.7%", color: "bg-orange-500" },
    { label: "Selesai", value: 18, percent: "75.0%", color: "bg-emerald-500" },
  ];

  // Jenis Pengujian (Progress Bars)
  const jenisPengujian = [
    { label: "Kadar Air", value: 24, percent: 100 },
    { label: "Kemurnian", value: 20, percent: 83 },
    { label: "Daya Berkecambah", value: 16, percent: 67 },
    { label: "Benih Murni", value: 12, percent: 50 },
    { label: "Kesehatan Benih", value: 8, percent: 33 },
    { label: "Berat 1.000 Butir", value: 6, percent: 25 },
    { label: "Lainnya", value: 4, percent: 17 },
  ];

  // Alur QC
  const alurQC = [
    { no: 1, title: "Permintaan Pengujian", desc: "Sampel dan dokumen diterima", value: 24, color: "text-emerald-600", bg: "bg-emerald-100", dot: "bg-emerald-500", border: "border-emerald-200" },
    { no: 2, title: "Pengujian", desc: "Proses analisa di laboratorium", value: 18, color: "text-emerald-600", bg: "bg-emerald-100", dot: "bg-emerald-500", border: "border-emerald-200" },
    { no: 3, title: "Review Hasil", desc: "Pemeriksaan oleh supervisor", value: 4, color: "text-emerald-600", bg: "bg-emerald-100", dot: "bg-emerald-500", border: "border-emerald-200" },
    { no: 4, title: "Lulus / Rilis", desc: "Sertifikat QC diterbitkan", value: 18, color: "text-emerald-600", bg: "bg-emerald-100", dot: "bg-emerald-500", border: "border-gray-200" },
    { no: 5, title: "Tidak Lulus", desc: "Temuan dan tindakan koreksi", value: 2, color: "text-red-600", bg: "bg-red-100", dot: "bg-red-500", border: "border-transparent" },
  ];

  // Pengujian Terbaru Table
  const tableTerbaru = [
    { req: "RQ-QC-2026-00125", batch: "BTH-2026-00125", komoditas: "Melon", varietas: "Melon Tere F1", uji: "Kadar Air, Kemurnian", status: "Selesai", tgl: "16 Jun 2026", stColor: "bg-emerald-50 text-emerald-600 border-emerald-200", stIcon: "ri-checkbox-circle-fill" },
    { req: "RQ-QC-2026-00124", batch: "BTH-2026-00124", komoditas: "Cabai", varietas: "Cabai Keriting", uji: "Daya Berkecambah", status: "Review", tgl: "15 Jun 2026", stColor: "bg-orange-50 text-orange-600 border-orange-200", stIcon: "ri-search-eye-line" },
    { req: "RQ-QC-2026-00123", batch: "BTH-2026-00122", komoditas: "Padi", varietas: "Inpari 32", uji: "Kemurnian, Kotoran", status: "Pengujian", tgl: "14 Jun 2026", stColor: "bg-blue-50 text-blue-600 border-blue-200", stIcon: "ri-flask-fill" },
    { req: "RQ-QC-2026-00122", batch: "BTH-2026-00121", komoditas: "Melon", varietas: "Melon Tere F1", uji: "Germinasi", status: "Selesai", tgl: "13 Jun 2026", stColor: "bg-emerald-50 text-emerald-600 border-emerald-200", stIcon: "ri-checkbox-circle-fill" },
    { req: "RQ-QC-2026-00121", batch: "BTH-2026-00119", komoditas: "Cabai", varietas: "Cabai Rawit", uji: "Kesehatan Benih", status: "Tidak Lulus", tgl: "12 Jun 2026", stColor: "bg-red-50 text-red-600 border-red-200", stIcon: "ri-close-circle-fill" },
    { req: "RQ-QC-2026-00120", batch: "BTH-2026-00118", komoditas: "Padi", varietas: "Inpari 32", uji: "Kadar Air", status: "Selesai", tgl: "11 Jun 2026", stColor: "bg-emerald-50 text-emerald-600 border-emerald-200", stIcon: "ri-checkbox-circle-fill" },
    { req: "RQ-QC-2026-00119", batch: "BTH-2026-00117", komoditas: "Tomat", varietas: "Tomat Servo F1", uji: "Kemurnian", status: "Menunggu Review", tgl: "10 Jun 2026", stColor: "bg-orange-50 text-orange-600 border-orange-200", stIcon: "ri-search-eye-line" },
    { req: "RQ-QC-2026-00118", batch: "BTH-2026-00116", komoditas: "Kacang Panjang", varietas: "Kacang Panjang", uji: "Daya Berkecambah", status: "Pengujian", tgl: "09 Jun 2026", stColor: "bg-blue-50 text-blue-600 border-blue-200", stIcon: "ri-flask-fill" },
  ];

  // Komoditas Stacked Bar
  const komoditasOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false }, height: 260 },
    plotOptions: { bar: { horizontal: true, barHeight: "45%", borderRadius: 2 } },
    colors: ["#10b981", "#ef4444"], // Lulus (Green), Tidak Lulus (Red)
    dataLabels: {
      enabled: true,
      textAnchor: "middle",
      style: { fontSize: "10px", colors: ["#fff"] },
    },
    xaxis: {
      categories: ["Melon", "Cabai", "Padi", "Tomat", "Kacang Panjang"],
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#374151", fontSize: "12px", fontWeight: 500 } },
    },
    grid: { strokeDashArray: 3, borderColor: "#e5e7eb" },
    legend: { position: "top", horizontalAlign: "right", markers: { radius: 12 } },
  };
  const komoditasSeries = [
    { name: "Lulus", data: [6, 5, 4, 3, 2] },
    { name: "Tidak Lulus", data: [1, 1, 0, 0, 0] },
  ];

  // Temuan QC
  const tableTemuan = [
    { id: "TQ-2026-0005", batch: "BTH-2026-00121", komoditas: "Cabai", jenis: "Daya Berkecambah", status: "Open", stColor: "text-red-600 border-red-200 bg-red-50" },
    { id: "TQ-2026-0004", batch: "BTH-2026-00115", komoditas: "Melon", jenis: "Kadar Air", status: "Closed", stColor: "text-emerald-600 border-emerald-200 bg-emerald-50" },
    { id: "TQ-2026-0003", batch: "BTH-2026-00112", komoditas: "Padi", jenis: "Kemurnian", status: "In Progress", stColor: "text-blue-600 border-blue-200 bg-blue-50" },
    { id: "TQ-2026-0002", batch: "BTH-2026-00108", komoditas: "Tomat", jenis: "Kotoran Benih", status: "Closed", stColor: "text-emerald-600 border-emerald-200 bg-emerald-50" },
    { id: "TQ-2026-0001", batch: "BTH-2026-00103", komoditas: "Kacang Panjang", jenis: "Daya Berkecambah", status: "Closed", stColor: "text-emerald-600 border-emerald-200 bg-emerald-50" },
  ];

  // Dokumen
  const dokumen = [
    { type: "COA", id: "BTH-2026-00125", komoditas: "Melon Tere F1", tgl: "16 Jun 2026" },
    { type: "Laporan Uji", id: "BTH-2026-00124", komoditas: "Cabai Keriting", tgl: "15 Jun 2026" },
    { type: "Sertifikat QC", id: "BTH-2026-00122", komoditas: "Inpari 32", tgl: "14 Jun 2026" },
    { type: "Laporan Uji", id: "BTH-2026-00121", komoditas: "Melon Tere F1", tgl: "12 Jun 2026" },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <i className="ri-leaf-fill text-3xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard QC & LAB</h2>
            <p className="text-sm text-gray-500 font-medium">Monitor kualitas benih mulai dari penerimaan sampel hingga hasil pengujian.</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20">
            <i className="ri-add-line"></i> Permintaan Pengujian
          </button>
          <button className="px-5 py-2.5 bg-white text-emerald-600 border border-emerald-200 rounded-lg text-sm font-semibold hover:bg-emerald-50 flex items-center gap-2 transition-all shadow-sm">
            <i className="ri-history-line"></i> Lihat Riwayat
          </button>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <i className="ri-flask-line text-xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-600">Sampel Masuk</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">24</h3>
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <i className="ri-arrow-up-line"></i> 12% dari bulan lalu
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <i className="ri-settings-4-line text-xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-600">Pengujian Berjalan</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">18</h3>
          <p className="text-xs font-medium text-blue-600 flex items-center gap-1">
            <i className="ri-arrow-up-line"></i> 8% dari bulan lalu
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
              <i className="ri-time-line text-xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-600">Menunggu Review</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">4</h3>
          <p className="text-xs font-medium text-orange-600 flex items-center gap-1">
            <i className="ri-arrow-down-line"></i> 20% dari bulan lalu
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <i className="ri-close-line text-xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-600">Tidak Lulus</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">2</h3>
          <p className="text-xs font-medium text-red-600 flex items-center gap-1">
            <i className="ri-arrow-down-line"></i> 50% dari bulan lalu
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <i className="ri-check-line text-xl"></i>
            </div>
            <p className="text-sm font-semibold text-gray-600">Lulus</p>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">18</h3>
          <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <i className="ri-arrow-up-line"></i> 13% dari bulan lalu
          </p>
        </div>
      </div>

      {/* MIDDLE ROW (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Pengujian */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <i className="ri-pie-chart-2-fill text-emerald-600"></i>
            <h3 className="font-bold text-gray-800">Status Pengujian</h3>
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-1/2 -ml-4">
              <ApexCharts options={statusOptions} series={statusSeries} type="donut" height={220} />
            </div>
            <div className="w-1/2 pl-2 space-y-3">
              {statusLegend.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                    <span className="text-[10px] text-gray-400 w-8 text-right">({item.percent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jenis Pengujian */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Jenis Pengujian <span className="text-gray-400 font-normal text-sm">(Total)</span></h3>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {jenisPengujian.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-32 text-xs font-medium text-gray-600 truncate">{item.label}</div>
                <div className="w-8 text-xs font-bold text-gray-800 text-right">{item.value}</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
                <div className="w-8 text-[10px] text-gray-400 text-right">{item.percent}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alur QC */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Alur QC</h3>
          </div>
          <div className="flex-1 relative pl-2 pt-2 pb-2">
            {alurQC.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4 mb-4 last:mb-0 group">
                {/* Line connector */}
                {idx !== alurQC.length - 1 && (
                  <div className={`absolute left-3.5 top-8 bottom-[-16px] w-[2px] ${step.border}`}></div>
                )}
                
                {/* Dot */}
                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-white border-2 border-gray-200 group-hover:border-emerald-500 transition-colors`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${step.dot}`}></div>
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{step.no}. {step.title}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-xs font-bold ${step.bg} ${step.color}`}>
                      {step.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COL (Tables & Docs) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pengujian Terbaru */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <i className="ri-table-line text-emerald-600"></i>
                <h3 className="font-bold text-gray-800">Pengujian Terbaru</h3>
              </div>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-4 font-semibold text-center w-10">No.</th>
                    <th className="py-3 px-4 font-semibold">No. Permintaan</th>
                    <th className="py-3 px-4 font-semibold">No. Batch</th>
                    <th className="py-3 px-4 font-semibold">Komoditas</th>
                    <th className="py-3 px-4 font-semibold">Varietas</th>
                    <th className="py-3 px-4 font-semibold">Jenis Uji</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Tanggal Sampling</th>
                    <th className="py-3 px-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-700 divide-y divide-gray-100">
                  {tableTerbaru.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 px-4 text-center font-medium">{idx + 1}</td>
                      <td className="py-2.5 px-4 text-emerald-600 font-medium whitespace-nowrap">{row.req}</td>
                      <td className="py-2.5 px-4 text-gray-500 whitespace-nowrap">{row.batch}</td>
                      <td className="py-2.5 px-4">{row.komoditas}</td>
                      <td className="py-2.5 px-4">{row.varietas}</td>
                      <td className="py-2.5 px-4 text-gray-500 max-w-[150px] truncate">{row.uji}</td>
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold ${row.stColor}`}>
                          <i className={`${row.stIcon}`}></i> {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-gray-500 whitespace-nowrap">{row.tgl}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex gap-1 justify-center">
                          <button className="w-6 h-6 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50">
                            <i className="ri-eye-line text-xs"></i>
                          </button>
                          <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100">
                            <i className="ri-more-2-fill text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dokumen & Sertifikat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="ri-file-text-line text-emerald-600"></i>
                <h3 className="font-bold text-gray-800">Dokumen & Sertifikat</h3>
              </div>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dokumen.map((doc, idx) => (
                <div key={idx} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group bg-gray-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <i className="ri-file-pdf-2-line text-xl"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 truncate">{doc.type} - {doc.id}</h4>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">{doc.komoditas}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{doc.tgl}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <i className="ri-download-2-line text-gray-400 group-hover:text-emerald-600 transition-colors"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COL (Charts & Small Table) */}
        <div className="space-y-6">
          {/* Pengujian Berdasarkan Komoditas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="ri-bar-chart-horizontal-fill text-emerald-600"></i>
                <h3 className="font-bold text-gray-800">Pengujian Berdasarkan Komoditas</h3>
              </div>
            </div>
            <div className="p-4 pt-2">
              <div className="flex justify-end mb-2">
                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Periode: <strong className="text-gray-700">Juni 2026</strong></span>
              </div>
              <ApexCharts options={komoditasOptions} series={komoditasSeries} type="bar" height={260} />
            </div>
          </div>

          {/* Temuan QC */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <i className="ri-error-warning-fill text-emerald-600"></i>
                <h3 className="font-bold text-gray-800">Temuan QC (Terbaru)</h3>
              </div>
              <button className="text-xs text-blue-600 font-semibold hover:underline">Lihat Semua</button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                    <th className="py-2.5 px-3 font-semibold text-center w-8">No.</th>
                    <th className="py-2.5 px-3 font-semibold">No. Temuan</th>
                    <th className="py-2.5 px-3 font-semibold">Batch</th>
                    <th className="py-2.5 px-3 font-semibold">Komoditas</th>
                    <th className="py-2.5 px-3 font-semibold">Jenis Temuan</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-[11px] text-gray-700 divide-y divide-gray-100">
                  {tableTemuan.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 px-3 text-center">{idx + 1}</td>
                      <td className="py-2 px-3 text-emerald-600 font-medium whitespace-nowrap">{row.id}</td>
                      <td className="py-2 px-3 text-gray-500 whitespace-nowrap">{row.batch}</td>
                      <td className="py-2 px-3">{row.komoditas}</td>
                      <td className="py-2 px-3">{row.jenis}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-semibold ${row.stColor}`}>
                          <i className={`${row.status === 'Closed' ? 'ri-checkbox-circle-line' : row.status === 'Open' ? 'ri-error-warning-line' : 'ri-time-line'}`}></i> {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
