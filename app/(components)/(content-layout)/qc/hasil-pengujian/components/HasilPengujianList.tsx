"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import FilterRow from "@/app/(components)/(content-layout)/shared/FilterRow";

const mockData = [
  {
    id: "1",
    noPengujian: "TST-QC-2026-00125",
    tglPengujian: "16 Jun 2026 11:30",
    batch: "BTH-2026-00125",
    komoditasVarietas: "Melon / Melon Tere F1",
    sampel: "500 g",
    hasil: "5/6",
    status: "Menunggu Review",
  },
  {
    id: "2",
    noPengujian: "TST-QC-2026-00124",
    tglPengujian: "15 Jun 2026 14:20",
    batch: "BTH-2026-00124",
    komoditasVarietas: "Cabai / Keriting",
    sampel: "500 g",
    hasil: "6/6",
    status: "Lulus",
  },
  {
    id: "3",
    noPengujian: "TST-QC-2026-00123",
    tglPengujian: "14 Jun 2026 09:10",
    batch: "BTH-2026-00122",
    komoditasVarietas: "Padi / Inpari 32",
    sampel: "1 kg",
    hasil: "6/6",
    status: "Lulus",
  },
  {
    id: "4",
    noPengujian: "TST-QC-2026-00122",
    tglPengujian: "13 Jun 2026 11:45",
    batch: "BTH-2026-00121",
    komoditasVarietas: "Melon / Tere F1",
    sampel: "500 g",
    hasil: "6/6",
    status: "Lulus",
  },
  {
    id: "5",
    noPengujian: "TST-QC-2026-00121",
    tglPengujian: "12 Jun 2026 10:30",
    batch: "BTH-2026-00119",
    komoditasVarietas: "Cabai / Rawit",
    sampel: "500 g",
    hasil: "5/6",
    status: "Tidak Lulus",
  },
  {
    id: "6",
    noPengujian: "TST-QC-2026-00120",
    tglPengujian: "11 Jun 2026 15:05",
    batch: "BTH-2026-00118",
    komoditasVarietas: "Padi / Inpari 32",
    sampel: "1 kg",
    hasil: "6/6",
    status: "Lulus",
  },
  {
    id: "7",
    noPengujian: "TST-QC-2026-00119",
    tglPengujian: "10 Jun 2026 13:40",
    batch: "BTH-2026-00117",
    komoditasVarietas: "Tomat / Servo F1",
    sampel: "500 g",
    hasil: "6/6",
    status: "Lulus",
  },
  {
    id: "8",
    noPengujian: "TST-QC-2026-00118",
    tglPengujian: "09 Jun 2026 09:20",
    batch: "BTH-2026-00116",
    komoditasVarietas: "Kacang Panjang / ...",
    sampel: "500 g",
    hasil: "5/6",
    status: "Menunggu Review",
  },
  {
    id: "9",
    noPengujian: "TST-QC-2026-00117",
    tglPengujian: "08 Jun 2026 16:10",
    batch: "BTH-2026-00115",
    komoditasVarietas: "Cabai / Keriting",
    sampel: "500 g",
    hasil: "6/6",
    status: "Lulus",
  },
  {
    id: "10",
    noPengujian: "TST-QC-2026-00116",
    tglPengujian: "07 Jun 2026 11:25",
    batch: "BTH-2026-00114",
    komoditasVarietas: "Melon / Tere F1",
    sampel: "1 kg",
    hasil: "6/6",
    status: "Lulus",
  },
];

const HasilPengujianList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState<any>(mockData[0]);

  const [filterPeriode, setFilterPeriode] = useState("");
  const [filterKomoditas, setFilterKomoditas] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAnalis, setFilterAnalis] = useState("");
  const [filterTipe, setFilterTipe] = useState("");

  const selectFilters = [
    {
      value: filterPeriode,
      onChange: setFilterPeriode,
      options: [{ value: "", label: "Semua Periode" }],
      placeholder: "Semua Periode",
      widthClass: "w-36"
    },
    {
      value: filterKomoditas,
      onChange: setFilterKomoditas,
      options: [{ value: "", label: "Semua Komoditas" }],
      placeholder: "Semua Komoditas",
      widthClass: "w-36"
    },
    {
      value: filterStatus,
      onChange: setFilterStatus,
      options: [{ value: "", label: "Semua Status" }],
      placeholder: "Semua Status",
      widthClass: "w-36"
    },
    {
      value: filterAnalis,
      onChange: setFilterAnalis,
      options: [{ value: "", label: "Semua Analis" }],
      placeholder: "Semua Analis",
      widthClass: "w-36"
    },
    {
      value: filterTipe,
      onChange: setFilterTipe,
      options: [{ value: "", label: "Semua Tipe" }],
      placeholder: "Semua Tipe",
      widthClass: "w-36"
    }
  ];

  const headers = [
    "No.",
    "No. Pengujian",
    "Tgl Pengujian",
    "Batch",
    "Komoditas / Varietas",
    "Sampel",
    "Hasil",
    "Status",
    "Aksi",
  ];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Review":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-medium flex items-center justify-center gap-1 w-max"><i className="ri-time-line"></i> Menunggu Review</span>;
      case "Lulus":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium flex items-center justify-center gap-1 w-max"><i className="ri-checkbox-circle-line"></i> Lulus</span>;
      case "Tidak Lulus":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-medium flex items-center justify-center gap-1 w-max"><i className="ri-close-circle-line"></i> Tidak Lulus</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium w-max">{status}</span>;
    }
  };

  const renderRow = (item: any, index: number) => (
    <tr 
      key={item.id} 
      className={`hover:bg-gray-50 border-b border-defaultborder transition-colors cursor-pointer ${selectedRow?.id === item.id ? 'bg-emerald-50' : ''}`}
      onClick={() => setSelectedRow(item)}
    >
      <td className="py-2 px-3 text-center">
         <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
      </td>
      <td className="py-2 px-2 text-center text-gray-500 font-medium text-[11px]">{(index + 1).toString()}</td>
      <td className="py-2 px-2 text-primary font-medium whitespace-nowrap text-[11px]">{item.noPengujian}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.tglPengujian}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.batch}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.komoditasVarietas}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.sampel}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.hasil}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px]">{renderStatusBadge(item.status)}</td>
      <td className="py-2 px-2 whitespace-nowrap text-[11px]">
        <div className="flex gap-1 justify-center items-center">
          <button className="w-6 h-6 rounded flex items-center justify-center text-primary border border-gray-200 hover:bg-gray-100" title="View">
            <i className="ri-eye-line text-[12px]"></i>
          </button>
          <button className="w-6 h-6 rounded flex items-center justify-center text-gray-500 border border-gray-200 hover:bg-gray-100" title="More Options">
            <i className="ri-more-2-line text-[12px]"></i>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <i className="ri-flask-fill text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Hasil Pengujian</h2>
            <p className="text-sm text-gray-500">Menampilkan hasil pemeriksaan mutu benih yang telah selesai diuji dan menunggu proses review atau approval.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 transition-colors">
            <i className="ri-add-line"></i> Buat Hasil Pengujian
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <i className="ri-download-2-line"></i> Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-file-text-line text-blue-500"></i>
                <p className="text-xs text-gray-500 font-medium">Total Hasil Pengujian</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">128</h3>
              <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center"><i className="ri-arrow-up-line"></i> 8% dari bulan lalu</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-time-line text-yellow-500"></i>
                <p className="text-xs text-gray-500 font-medium">Menunggu Review</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">9</h3>
              <p className="text-[10px] text-gray-500 font-medium mt-1">perlu direview</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-checkbox-circle-fill text-emerald-500"></i>
                <p className="text-xs text-gray-500 font-medium">Lulus</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">102</h3>
              <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center"><i className="ri-arrow-up-line"></i> 79% dari total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-close-circle-fill text-red-500"></i>
                <p className="text-xs text-gray-500 font-medium">Tidak Lulus</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">17</h3>
              <p className="text-[10px] text-red-600 font-medium mt-1 flex items-center"><i className="ri-arrow-down-line"></i> 13% dari total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-error-warning-fill text-yellow-500"></i>
                <p className="text-xs text-gray-500 font-medium">Perlu Tindakan</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">8</h3>
              <p className="text-[10px] text-gray-500 font-medium mt-1">perlu tindak lanjut</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Table Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="p-3 border-b border-gray-100 bg-gray-50/50">
            <FilterRow 
              search={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Cari No. Pengujian / Batch / Sampel / Varietas..."
              selectFilters={selectFilters}
              onReset={() => {
                setSearchTerm("");
                setFilterPeriode("");
                setFilterKomoditas("");
                setFilterStatus("");
                setFilterAnalis("");
                setFilterTipe("");
              }}
            />
          </div>

          <div className="flex-1 overflow-auto">
             <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3 border-b border-gray-200 text-center w-10">
                      <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </th>
                    {headers.map((header, idx) => (
                      <th key={idx} className="py-2 px-2 border-b border-gray-200 text-xs font-semibold text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((item, index) => renderRow(item, index))}
                </tbody>
             </table>
          </div>
          <div className="p-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Menampilkan 1 - 10 dari 128 data</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><i className="ri-arrow-left-s-line"></i></button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-emerald-600 text-white font-medium text-xs">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs">3</button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs">4</button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-xs">5</button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><i className="ri-arrow-right-s-line"></i></button>
            </div>
          </div>
        </div>

        {/* Detail Side Panel */}
        {selectedRow && (
          <div className="w-full lg:w-[450px] shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[calc(100vh-220px)]">
             <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">
                         <i className="ri-flask-line"></i>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm">{selectedRow.noPengujian}</h4>
                   </div>
                   {renderStatusBadge(selectedRow.status)}
                </div>
                <div className="flex border-b border-gray-200">
                   <button className="px-4 py-2 border-b-2 border-emerald-600 text-emerald-600 font-medium text-xs">Ringkasan</button>
                   <button className="px-4 py-2 text-gray-500 font-medium text-xs hover:text-gray-700">Parameter</button>
                   <button className="px-4 py-2 text-gray-500 font-medium text-xs hover:text-gray-700">Dokumentasi</button>
                   <button className="px-4 py-2 text-gray-500 font-medium text-xs hover:text-gray-700">Riwayat</button>
                </div>
             </div>
             
             <div className="p-4 flex-1 overflow-y-auto space-y-5">
                {/* Informasi Pengujian */}
                <div>
                   <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                         <i className="ri-information-line text-emerald-600"></i> Informasi Pengujian
                      </h5>
                      <button className="text-gray-400 hover:text-emerald-600"><i className="ri-edit-line"></i></button>
                   </div>
                   <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                      <div>
                         <p className="text-gray-500 mb-0.5">No. Pengujian</p>
                         <p className="font-medium text-gray-800">{selectedRow.noPengujian}</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Komoditas</p>
                         <p className="font-medium text-gray-800">Melon</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">No. Permintaan</p>
                         <p className="font-medium text-gray-800">RQ-QC-2026-00125</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Varietas</p>
                         <p className="font-medium text-gray-800">Melon Tere F1</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Batch</p>
                         <p className="font-medium text-gray-800">{selectedRow.batch}</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Tipe</p>
                         <p className="font-medium text-gray-800">OC / Benih</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">No. Sampel</p>
                         <p className="font-medium text-gray-800">SMP-2026-00125</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Petani Mitra</p>
                         <p className="font-medium text-gray-800">Suryadi</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Tanggal Pengujian</p>
                         <p className="font-medium text-gray-800">{selectedRow.tglPengujian}</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Lahan</p>
                         <p className="font-medium text-gray-800">Lahan 01 / Blok A</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Analis</p>
                         <p className="font-medium text-gray-800">Andi Pratama</p>
                      </div>
                      <div>
                         <p className="text-gray-500 mb-0.5">Jumlah Sampel</p>
                         <p className="font-medium text-gray-800">{selectedRow.sampel}</p>
                      </div>
                   </div>
                </div>

                {/* Ringkasan Hasil */}
                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                   <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-4">
                      <i className="ri-pie-chart-2-line text-emerald-600"></i> Ringkasan Hasil
                   </h5>
                   <div className="flex items-center gap-6 mb-4">
                      <div className="w-20 h-20 rounded-full border-8 border-emerald-500 flex items-center justify-center shrink-0 shadow-inner relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                           {/* Add a red dash offset to simulate the 5/6 pie chart */}
                           <path className="text-red-500" strokeWidth="4" stroke="currentColor" fill="none" strokeDasharray="16.6 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                         <div className="text-center bg-white rounded-full w-full h-full flex flex-col items-center justify-center z-10">
                            <span className="font-bold text-lg leading-tight">5/6</span>
                            <span className="text-[8px] text-gray-500 leading-tight">Parameter Lulus</span>
                         </div>
                      </div>
                      <div className="space-y-2 flex-1">
                         <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5"><i className="ri-checkbox-circle-fill text-emerald-500"></i> Lulus</span>
                            <span className="font-bold">5</span>
                         </div>
                         <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5"><i className="ri-close-circle-fill text-red-500"></i> Tidak Lulus</span>
                            <span className="font-bold">1</span>
                         </div>
                         <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5"><i className="ri-error-warning-fill text-yellow-500"></i> Perlu Review</span>
                            <span className="font-bold">0</span>
                         </div>
                      </div>
                   </div>
                   {selectedRow.hasil !== "6/6" && (
                     <div className="bg-red-50 p-2.5 rounded border border-red-100 mt-2">
                        <p className="text-[11px] text-red-700 flex gap-1.5 font-medium mb-1"><i className="ri-alert-line"></i> Parameter tidak memenuhi standar:</p>
                        <ul className="text-[10px] text-red-600 list-disc list-inside ml-4">
                           <li>Daya Berkecambah (82% &lt; 85%)</li>
                        </ul>
                     </div>
                   )}
                </div>

                {/* Dokumentasi */}
                <div>
                   <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                         <i className="ri-image-line text-emerald-600"></i> Dokumentasi
                      </h5>
                      <button className="text-emerald-600 text-xs font-medium hover:underline">Lihat Semua</button>
                   </div>
                   <div className="grid grid-cols-3 gap-2">
                      <div className="relative group cursor-pointer">
                         <img src="https://images.unsplash.com/photo-1574327429671-006240217646?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Sampel" className="w-full h-20 object-cover rounded-md border border-gray-200" />
                         <div className="absolute bottom-0 inset-x-0 bg-black/50 p-1 text-center">
                            <p className="text-[9px] text-white">Sampel</p>
                            <p className="text-[8px] text-gray-300">16 Jun 2026 09:20</p>
                         </div>
                      </div>
                      <div className="relative group cursor-pointer">
                         <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Proses" className="w-full h-20 object-cover rounded-md border border-gray-200" />
                         <div className="absolute bottom-0 inset-x-0 bg-black/50 p-1 text-center">
                            <p className="text-[9px] text-white">Proses Pengujian</p>
                            <p className="text-[8px] text-gray-300">16 Jun 2026 11:30</p>
                         </div>
                      </div>
                      <div className="relative group cursor-pointer">
                         <img src="https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Hasil" className="w-full h-20 object-cover rounded-md border border-gray-200" />
                         <div className="absolute bottom-0 inset-x-0 bg-black/50 p-1 text-center">
                            <p className="text-[9px] text-white">Hasil Germinasi</p>
                            <p className="text-[8px] text-gray-300">17 Jun 2026 08:30</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Timeline */}
                <div>
                   <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-3">
                      <i className="ri-time-line text-emerald-600"></i> Timeline Proses
                   </h5>
                   <div className="flex justify-between items-start text-center relative max-w-full overflow-x-auto pb-2">
                     <div className="absolute top-3 left-6 right-6 h-0.5 bg-emerald-100 -z-10"></div>
                     
                     <div className="flex flex-col items-center w-24 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 text-xs"><i className="ri-check-line"></i></div>
                        <p className="text-[9px] font-semibold text-gray-800">Permintaan Pengujian</p>
                        <p className="text-[8px] text-gray-500">16 Jun 2026 08:15</p>
                     </div>
                     <div className="flex flex-col items-center w-24 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 text-xs"><i className="ri-check-line"></i></div>
                        <p className="text-[9px] font-semibold text-gray-800">Sampel Diterima</p>
                        <p className="text-[8px] text-gray-500">16 Jun 2026 09:00</p>
                     </div>
                     <div className="flex flex-col items-center w-24 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 text-xs"><i className="ri-check-line"></i></div>
                        <p className="text-[9px] font-semibold text-gray-800">Pengujian Selesai</p>
                        <p className="text-[8px] text-gray-500">16 Jun 2026 11:30</p>
                     </div>
                     <div className="flex flex-col items-center w-24 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 text-xs"><i className="ri-check-line"></i></div>
                        <p className="text-[9px] font-semibold text-gray-800">Submit Hasil</p>
                        <p className="text-[8px] text-gray-500">16 Jun 2026 11:35</p>
                     </div>
                     <div className="flex flex-col items-center w-24 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-1 text-xs"><i className="ri-time-line"></i></div>
                        <p className="text-[9px] font-semibold text-gray-800">Review Supervisor</p>
                        <p className="text-[8px] text-gray-500">Menunggu</p>
                     </div>
                     <div className="flex flex-col items-center w-24 shrink-0">
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-1 text-xs"><i className="ri-shield-check-line"></i></div>
                        <p className="text-[9px] font-semibold text-gray-800">Approval</p>
                        <p className="text-[8px] text-gray-500">Menunggu</p>
                     </div>
                   </div>
                </div>
             </div>

             <div className="p-4 border-t border-gray-100 bg-gray-50/50">
               <h6 className="text-xs font-bold text-gray-800 mb-2">Aksi</h6>
               <div className="flex gap-2">
                  <button className="flex-1 py-1.5 px-3 bg-white border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50">Lihat Detail</button>
                  <button className="flex-1 py-1.5 px-3 bg-white border border-orange-200 text-orange-600 rounded text-xs font-medium hover:bg-orange-50">Kembalikan untuk Revisi</button>
                  <button className="flex-1 py-1.5 px-3 bg-emerald-600 text-white rounded text-xs font-medium hover:bg-emerald-700">Approve Hasil</button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HasilPengujianList;
