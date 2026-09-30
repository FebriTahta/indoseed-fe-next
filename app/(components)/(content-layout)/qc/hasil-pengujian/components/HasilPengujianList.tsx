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
        return <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-medium flex items-center justify-center gap-1 w-max"><i className="ri-time-line"></i> Menunggu Review</span>;
      case "Lulus":
        return <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-medium flex items-center justify-center gap-1 w-max"><i className="ri-checkbox-circle-fill"></i> Lulus</span>;
      case "Tidak Lulus":
        return <span className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded-full text-[10px] font-medium flex items-center justify-center gap-1 w-max"><i className="ri-close-circle-fill"></i> Tidak Lulus</span>;
      default:
        return <span className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-[10px] font-medium w-max">{status}</span>;
    }
  };

  const renderRow = (item: any, index: number) => (
    <tr
      key={item.id}
      className={`hover:bg-gray-50/80 border-b border-gray-100 transition-colors cursor-pointer ${selectedRow?.id === item.id ? 'bg-emerald-50/50' : ''}`}
      onClick={() => setSelectedRow(item)}
    >
      <td className="py-2.5 px-3 text-center">
        <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
      </td>
      <td className="py-2.5 px-2 text-center text-gray-500 text-[11px]">{index + 1}</td>
      <td className="py-2.5 px-2 text-blue-500 text-[11px] font-medium">{item.noPengujian}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.tglPengujian}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.batch}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.komoditasVarietas}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.sampel}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px] text-gray-600">{item.hasil}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px]">{renderStatusBadge(item.status)}</td>
      <td className="py-2.5 px-2 whitespace-nowrap text-[11px]">
        <div className="flex gap-1 justify-center items-center">
          <button className="w-6 h-6 rounded flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors" title="View">
            <i className="ri-eye-line text-[12px]"></i>
          </button>
          <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="More Options">
            <i className="ri-more-2-line text-[12px]"></i>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
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
                <i className="ri-time-line text-amber-500"></i>
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
                <i className="ri-close-circle-fill text-rose-500"></i>
                <p className="text-xs text-gray-500 font-medium">Tidak Lulus</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">17</h3>
              <p className="text-[10px] text-rose-600 font-medium mt-1 flex items-center"><i className="ri-arrow-down-line"></i> 13% dari total</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-error-warning-fill text-amber-500"></i>
                <p className="text-xs text-gray-500 font-medium">Perlu Tindakan</p>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">8</h3>
              <p className="text-[10px] text-gray-500 font-medium mt-1">perlu tindak lanjut</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        {/* Left Column (Table + Timeline) */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
          {/* Main Table Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
            {/* Filters */}
            <div className="p-3 border-b border-gray-100 flex flex-wrap lg:flex-nowrap items-end gap-3 bg-gray-50/50">
              <div className="flex-1 relative min-w-[200px]">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Cari ..."
                  className="w-full pl-9 pr-3 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-end gap-2 shrink-0">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-medium px-1">Periode</label>
                  <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] text-gray-700 bg-white focus:outline-none focus:border-emerald-500 w-28 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_8px_center]">
                    <option value="">Semua </option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-medium px-1">Komoditas</label>
                  <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] text-gray-700 bg-white focus:outline-none focus:border-emerald-500 w-28 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_8px_center]">
                    <option value="">Semua </option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-medium px-1">Status</label>
                  <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] text-gray-700 bg-white focus:outline-none focus:border-emerald-500 w-28 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_8px_center]">
                    <option value="">Semua </option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-medium px-1">Analis</label>
                  <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] text-gray-700 bg-white focus:outline-none focus:border-emerald-500 w-28 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_8px_center]">
                    <option value="">Semua </option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 font-medium px-1">Tipe Benih</label>
                  <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-[10px] text-gray-700 bg-white focus:outline-none focus:border-emerald-500 w-28 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_8px_center]">
                    <option value="">Semua Tipe</option>
                  </select>
                </div>
                <button
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-1.5 h-[28px] shadow-sm"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="ri-refresh-line"></i> Reset
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
                <thead className="bg-gray-50/50 sticky top-0 z-10 border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">
                      <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    </th>
                    {headers.map((header, idx) => (
                      <th key={idx} className="py-2.5 px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
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
              <span className="text-[11px] text-gray-500 font-medium">Menampilkan 1 - 10 dari 128 data</span>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><i className="ri-arrow-left-s-line"></i></button>
                <button className="w-6 h-6 flex items-center justify-center rounded bg-emerald-600 text-white font-medium text-[11px]">1</button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-[11px]">2</button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-[11px]">3</button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-[11px]">4</button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-[11px]">5</button>
                <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50"><i className="ri-arrow-right-s-line"></i></button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {selectedRow && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mt-auto relative z-0">
              <h5 className="font-bold text-gray-800 text-sm flex items-center gap-2 mb-6">
                <i className="ri-time-line text-emerald-600 text-lg"></i> Timeline Proses
              </h5>
              <div className="flex justify-between items-start text-center relative w-full overflow-visible pb-2">
                {/* Connecting Line */}
                <div className="absolute top-[15px] left-[8%] right-[8%] h-[2px] bg-emerald-100 -z-10"></div>

                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-[30px] h-[30px] rounded-full bg-emerald-100 text-emerald-600 border border-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_white]"><i className="ri-file-text-line text-sm"></i></div>
                  <p className="text-[10px] font-bold text-gray-800 mb-0.5">Permintaan Pengujian</p>
                  <p className="text-[9px] text-gray-500 mb-0.5">16 Jun 2026 08:15</p>
                  <p className="text-[9px] text-blue-500">Produksi</p>
                </div>
                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-[30px] h-[30px] rounded-full bg-emerald-100 text-emerald-600 border border-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_white]"><i className="ri-flask-line text-sm"></i></div>
                  <p className="text-[10px] font-bold text-gray-800 mb-0.5">Sampel Diterima</p>
                  <p className="text-[9px] text-gray-500 mb-0.5">16 Jun 2026 09:00</p>
                  <p className="text-[9px] text-blue-500">Andi Pratama</p>
                </div>
                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-[30px] h-[30px] rounded-full bg-emerald-600 text-white border border-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_white]"><i className="ri-check-line text-sm"></i></div>
                  <p className="text-[10px] font-bold text-gray-800 mb-0.5">Pengujian Selesai</p>
                  <p className="text-[9px] text-gray-500 mb-0.5">16 Jun 2026 11:30</p>
                  <p className="text-[9px] text-blue-500">Andi Pratama</p>
                </div>
                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-[30px] h-[30px] rounded-full bg-emerald-600 text-white border border-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_white]"><i className="ri-check-line text-sm"></i></div>
                  <p className="text-[10px] font-bold text-gray-800 mb-0.5">Submit Hasil</p>
                  <p className="text-[9px] text-gray-500 mb-0.5">16 Jun 2026 11:35</p>
                  <p className="text-[9px] text-blue-500">Andi Pratama</p>
                </div>
                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-[30px] h-[30px] rounded-full bg-gray-100 text-gray-400 border border-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_white]"><i className="ri-arrow-right-line text-sm"></i></div>
                  <p className="text-[10px] font-bold text-gray-400 mb-0.5">Review Supervisor</p>
                  <p className="text-[9px] text-gray-400">Menunggu</p>
                </div>
                <div className="flex flex-col items-center flex-1 z-10">
                  <div className="w-[30px] h-[30px] rounded-full bg-gray-100 text-gray-400 border border-white flex items-center justify-center mb-2 shadow-[0_0_0_4px_white]"><i className="ri-arrow-right-line text-sm"></i></div>
                  <p className="text-[10px] font-bold text-gray-400 mb-0.5">Approval</p>
                  <p className="text-[9px] text-gray-400">Menunggu</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Side Panel */}
        {selectedRow && (
          <div className="w-full xl:w-[420px] shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[calc(100vh-140px)]">
            <div className="p-4 border-b border-gray-100 bg-emerald-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <i className="ri-flask-line"></i>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm">{selectedRow.noPengujian}</h4>
                </div>
                {renderStatusBadge(selectedRow.status)}
              </div>
              <div className="flex gap-4 border-b border-gray-200 mt-2">
                <button className="pb-2 border-b-2 border-emerald-600 text-emerald-700 font-bold text-xs">Ringkasan</button>
                <button className="pb-2 text-gray-500 font-medium text-xs hover:text-gray-700">Parameter</button>
                <button className="pb-2 text-gray-500 font-medium text-xs hover:text-gray-700">Dokumentasi</button>
                <button className="pb-2 text-gray-500 font-medium text-xs hover:text-gray-700">Riwayat</button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
              {/* Informasi Pengujian */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-emerald-800 text-xs flex items-center gap-2">
                    <i className="ri-file-list-3-line text-emerald-600 text-sm"></i> Informasi Pengujian
                  </h5>
                  <button className="text-emerald-600 hover:text-emerald-700"><i className="ri-pencil-line"></i></button>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">No. Pengujian</p>
                    <p className="font-semibold text-gray-800">{selectedRow.noPengujian}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Komoditas</p>
                    <p className="font-semibold text-gray-800">Melon</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">No. Permintaan</p>
                    <p className="font-semibold text-gray-800">RQ-QC-2026-00125</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Varietas</p>
                    <p className="font-semibold text-gray-800">Melon Tere F1</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Batch</p>
                    <p className="font-semibold text-gray-800">{selectedRow.batch}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Tipe</p>
                    <p className="font-semibold text-gray-800">OC / Benih</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">No. Sampel</p>
                    <p className="font-semibold text-gray-800">SMP-2026-00125</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Petani Mitra</p>
                    <p className="font-semibold text-gray-800">Suryadi</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Tanggal Pengujian</p>
                    <p className="font-semibold text-gray-800">{selectedRow.tglPengujian}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Lahan</p>
                    <p className="font-semibold text-gray-800">Lahan 01 / Blok A</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Analis</p>
                    <p className="font-semibold text-gray-800">Andi Pratama</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5 text-[10px]">Jumlah Sampel</p>
                    <p className="font-semibold text-gray-800">{selectedRow.sampel}</p>
                  </div>
                </div>
              </div>

              {/* Ringkasan Hasil */}
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <h5 className="font-bold text-emerald-800 text-xs flex items-center gap-2 mb-4">
                  <i className="ri-pie-chart-2-line text-emerald-600 text-sm"></i> Ringkasan Hasil
                </h5>
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0 relative" style={{ background: "conic-gradient(#10b981 83.33%, #f43f5e 83.33% 100%)" }}>
                    <div className="w-[56px] h-[56px] bg-white rounded-full flex flex-col items-center justify-center z-10 shadow-sm">
                      <span className="font-extrabold text-gray-800 text-base leading-tight mt-1">5/6</span>
                      <span className="text-[7px] text-gray-500 font-medium leading-tight mb-1 uppercase tracking-wider text-center">Lulus</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-600"><i className="ri-checkbox-circle-fill text-emerald-500"></i> Lulus</span>
                      <span className="font-bold text-gray-800">5</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-600"><i className="ri-close-circle-fill text-rose-500"></i> Tidak Lulus</span>
                      <span className="font-bold text-gray-800">1</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-gray-600"><i className="ri-error-warning-fill text-amber-500"></i> Perlu Review</span>
                      <span className="font-bold text-gray-800">0</span>
                    </div>
                  </div>
                </div>
                {selectedRow.hasil !== "6/6" && (
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 mt-3">
                    <p className="text-[10px] text-rose-700 flex gap-1.5 font-bold mb-1.5"><i className="ri-alert-fill"></i> Parameter tidak memenuhi standar:</p>
                    <ul className="text-[10px] text-rose-600 font-medium list-disc list-inside ml-5">
                      <li>Daya Berkecambah (82% &lt; 85%)</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Dokumentasi */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-bold text-emerald-800 text-xs flex items-center gap-2">
                    <i className="ri-image-line text-emerald-600 text-sm"></i> Dokumentasi
                  </h5>
                  <button className="text-emerald-600 text-[10px] font-bold hover:underline tracking-wide">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative group cursor-pointer rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <img src="https://images.unsplash.com/photo-1574327429671-006240217646?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Sampel" className="w-full h-[72px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-download-2-line text-white text-lg drop-shadow-md"></i>
                    </div>
                    <div className="p-1.5 bg-white border-t border-gray-100 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-semibold text-gray-700 truncate">Sampel</span>
                        <span className="text-[8px] text-gray-400">16 Jun 2026</span>
                      </div>
                      <i className="ri-download-2-line text-emerald-600 text-[11px] group-hover:scale-110 transition-transform"></i>
                    </div>
                  </div>
                  <div className="relative group cursor-pointer rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Proses" className="w-full h-[72px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-download-2-line text-white text-lg drop-shadow-md"></i>
                    </div>
                    <div className="p-1.5 bg-white border-t border-gray-100 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-semibold text-gray-700 truncate">Proses Pengujian</span>
                        <span className="text-[8px] text-gray-400">16 Jun 2026</span>
                      </div>
                      <i className="ri-download-2-line text-emerald-600 text-[11px] group-hover:scale-110 transition-transform"></i>
                    </div>
                  </div>
                  <div className="relative group cursor-pointer rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <img src="https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Hasil" className="w-full h-[72px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-download-2-line text-white text-lg drop-shadow-md"></i>
                    </div>
                    <div className="p-1.5 bg-white border-t border-gray-100 flex justify-between items-center group-hover:bg-emerald-50 transition-colors">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[9px] font-semibold text-gray-700 truncate">Hasil Germinasi</span>
                        <span className="text-[8px] text-gray-400">17 Jun 2026</span>
                      </div>
                      <i className="ri-download-2-line text-emerald-600 text-[11px] group-hover:scale-110 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
              <h6 className="text-[11px] font-bold text-gray-500 mb-2.5 uppercase tracking-wider">Aksi</h6>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm">Lihat Detail</button>
                <button className="flex-1 py-2 px-2 bg-white border border-orange-200 text-orange-600 rounded-lg text-xs font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all shadow-sm">Kembalikan untuk Revisi</button>
                <button className="flex-1 py-2 px-2 bg-emerald-600 text-white border border-transparent rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20">Approve Hasil</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HasilPengujianList;
