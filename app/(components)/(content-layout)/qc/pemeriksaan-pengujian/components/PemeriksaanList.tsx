"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

const mockData = [
  {
    id: "1",
    noPengujian: "TST-QC-2026-00125",
    noPermintaan: "RQ-QC-2026-00125",
    lot: "LOT-2026-00125",
    komoditas: "Melon",
    varietas: "Tere F1",
    petani: "Suryadi",
    tanggalSampling: "16 Jun 2026",
    jenisPengujian: "Daya Berkecambah",
    status: "Dalam Pengujian",
    petugasQC: "Budi Santoso",
  },
  {
    id: "2",
    noPengujian: "TST-QC-2026-00126",
    noPermintaan: "RQ-QC-2026-00126",
    lot: "LOT-2026-00126",
    komoditas: "Cabai",
    varietas: "F1",
    petani: "Joko",
    tanggalSampling: "16 Jun 2026",
    jenisPengujian: "Kemurnian",
    status: "Menunggu Pengujian",
    petugasQC: "Siti Rahayu",
  },
  {
    id: "3",
    noPengujian: "TST-QC-2026-00127",
    noPermintaan: "RQ-QC-2026-00127",
    lot: "LOT-2026-00127",
    komoditas: "Tomat",
    varietas: "F1",
    petani: "Budi",
    tanggalSampling: "17 Jun 2026",
    jenisPengujian: "Daya Berkecambah",
    status: "Menunggu Review",
    petugasQC: "Agus Pratama",
  },
  {
    id: "4",
    noPengujian: "TST-QC-2026-00128",
    noPermintaan: "RQ-QC-2026-00128",
    lot: "LOT-2026-00128",
    komoditas: "Melon",
    varietas: "Tere F1",
    petani: "Ahmad",
    tanggalSampling: "17 Jun 2026",
    jenisPengujian: "Kadar Air",
    status: "Selesai",
    petugasQC: "Siti Rahayu",
  },
  {
    id: "5",
    noPengujian: "TST-QC-2026-00129",
    noPermintaan: "RQ-QC-2026-00129",
    lot: "LOT-2026-00129",
    komoditas: "Kangkung",
    varietas: "F1",
    petani: "Wawan",
    tanggalSampling: "18 Jun 2026",
    jenisPengujian: "Kemurnian",
    status: "HOLD QC",
    petugasQC: "Budi Santoso",
  },
  {
    id: "6",
    noPengujian: "TST-QC-2026-00130",
    noPermintaan: "RQ-QC-2026-00130",
    lot: "LOT-2026-00130",
    komoditas: "Sawi",
    varietas: "F1",
    petani: "Rina",
    tanggalSampling: "18 Jun 2026",
    jenisPengujian: "Vigor",
    status: "Menunggu Sampel",
    petugasQC: "Agus Pratama",
  },
  {
    id: "7",
    noPengujian: "TST-QC-2026-00131",
    noPermintaan: "RQ-QC-2026-00131",
    lot: "LOT-2026-00131",
    komoditas: "Tomat",
    varietas: "F1",
    petani: "Sutrisno",
    tanggalSampling: "19 Jun 2026",
    jenisPengujian: "Kadar Air",
    status: "Dalam Pengujian",
    petugasQC: "Siti Rahayu",
  },
  {
    id: "8",
    noPengujian: "TST-QC-2026-00132",
    noPermintaan: "RQ-QC-2026-00132",
    lot: "LOT-2026-00132",
    komoditas: "Cabai",
    varietas: "F1",
    petani: "Santoso",
    tanggalSampling: "19 Jun 2026",
    jenisPengujian: "Vigor",
    status: "Selesai",
    petugasQC: "Budi Santoso",
  },
  {
    id: "9",
    noPengujian: "TST-QC-2026-00133",
    noPermintaan: "RQ-QC-2026-00133",
    lot: "LOT-2026-00133",
    komoditas: "Melon",
    varietas: "TGL F1",
    petani: "Lestari",
    tanggalSampling: "20 Jun 2026",
    jenisPengujian: "Kemurnian",
    status: "Ditolak",
    petugasQC: "Agus Pratama",
  },
  {
    id: "10",
    noPengujian: "TST-QC-2026-00134",
    noPermintaan: "RQ-QC-2026-00134",
    lot: "LOT-2026-00134",
    komoditas: "Bayam",
    varietas: "F1",
    petani: "Eko",
    tanggalSampling: "20 Jun 2026",
    jenisPengujian: "Daya Berkecambah",
    status: "Selesai",
    petugasQC: "Siti Rahayu",
  },
];

const PemeriksaanList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const headers = [
    "No.",
    "No. Pengujian",
    "No. Permintaan",
    "Lot",
    "Komoditas",
    "Varietas",
    "Petani",
    "Tanggal Sampling",
    "Jenis Pengujian",
    "Status",
    "Petugas QC",
    "Aksi",
  ];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Sampel":
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"><i className="ri-flask-line mr-1"></i>Menunggu Sampel</span>;
      case "Menunggu Pengujian":
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"><i className="ri-time-line mr-1"></i>Menunggu Pengujian</span>;
      case "Dalam Pengujian":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"><i className="ri-loader-4-line mr-1 animate-spin"></i>Dalam Pengujian</span>;
      case "Menunggu Review":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><i className="ri-search-eye-line mr-1"></i>Menunggu Review</span>;
      case "Selesai":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"><i className="ri-checkbox-circle-line mr-1"></i>Selesai</span>;
      case "HOLD QC":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><i className="ri-error-warning-line mr-1"></i>HOLD QC</span>;
      case "Ditolak":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><i className="ri-close-circle-line mr-1"></i>Ditolak</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const renderAction = (status: string) => {
    if (status === "Menunggu Pengujian") {
      return (
        <button className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-100 text-xs font-medium">
          <i className="ri-play-circle-line"></i> Mulai
        </button>
      );
    }
    if (status === "Dalam Pengujian") {
      return (
        <button className="flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 text-xs font-medium">
          <i className="ri-edit-box-line"></i> Lanjutkan
        </button>
      );
    }
    if (status === "Menunggu Review") {
      return (
        <button className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 text-xs font-medium">
          <i className="ri-search-eye-line"></i> Review
        </button>
      );
    }
    if (status === "Menunggu Sampel") {
      return (
        <button className="flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 text-xs font-medium">
          <i className="ri-file-info-line"></i> Detail
        </button>
      );
    }
    return (
      <button className="flex items-center gap-1 px-3 py-1 bg-white text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 text-xs font-medium">
        <i className="ri-eye-line"></i> Lihat
      </button>
    );
  };

  const renderRow = (item: any, index: number) => (
    <tr key={item.id} className="hover:bg-gray-50 border-b border-defaultborder transition-colors">
      <td className="p-4 text-center text-primary font-medium">{(index + 1).toString()}</td>
      <td className="p-4 text-primary font-medium">{item.noPengujian}</td>
      <td className="p-4">{item.noPermintaan}</td>
      <td className="p-4 text-gray-700">{item.lot}</td>
      <td className="p-4">{item.komoditas}</td>
      <td className="p-4">{item.varietas}</td>
      <td className="p-4">{item.petani}</td>
      <td className="p-4">{item.tanggalSampling}</td>
      <td className="p-4">{item.jenisPengujian}</td>
      <td className="p-4">{renderStatusBadge(item.status)}</td>
      <td className="p-4">{item.petugasQC}</td>
      <td className="p-4">
        <div className="flex gap-2 justify-center items-center">
          {renderAction(item.status)}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
            <i className="ri-file-list-3-line text-2xl"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Total Pengujian</p>
            <h3 className="text-2xl font-bold text-blue-700">24</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 mr-3">
            <i className="ri-hourglass-2-fill text-2xl"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Menunggu Sampel</p>
            <h3 className="text-2xl font-bold text-orange-700">3</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-3">
            <i className="ri-flask-line text-2xl"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Menunggu Pengujian</p>
            <h3 className="text-2xl font-bold text-blue-700">6</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mr-3">
            <i className="ri-settings-4-line text-2xl"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Dalam Pengujian</p>
            <h3 className="text-2xl font-bold text-purple-700">8</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 mr-3">
            <i className="ri-file-list-2-line text-2xl"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Menunggu Review</p>
            <h3 className="text-2xl font-bold text-yellow-700">4</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mr-3">
            <i className="ri-checkbox-circle-fill text-2xl"></i>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Selesai</p>
            <h3 className="text-2xl font-bold text-emerald-700">6</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-md relative">
            <input
              type="text"
              placeholder="Cari ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 bg-white shadow-sm font-medium">
              <i className="ri-refresh-line"></i> Reset
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 shadow-sm font-medium">
              <i className="ri-search-line"></i> Cari
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-end">
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <Select instanceId="filter-status" options={[{ value: "", label: "Semua" }]} placeholder="Semua" className="text-sm" />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-700 mb-1">Komoditas</label>
            <Select instanceId="filter-komoditas" options={[{ value: "", label: "Semua" }]} placeholder="Semua" className="text-sm" />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-700 mb-1">Varietas</label>
            <Select instanceId="filter-varietas" options={[{ value: "", label: "Semua" }]} placeholder="Semua" className="text-sm" />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-700 mb-1">Jenis Pengujian</label>
            <Select instanceId="filter-jenis" options={[{ value: "", label: "Semua" }]} placeholder="Semua" className="text-sm" />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-gray-700 mb-1">Petugas QC</label>
            <Select instanceId="filter-petugas" options={[{ value: "", label: "Semua" }]} placeholder="Semua" className="text-sm" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal Pengujian</label>
            <div className="relative">
              <input
                type="text"
                placeholder="01/06/2026 - 30/06/2026"
                className="w-full pl-10 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                defaultValue="01/06/2026 - 30/06/2026"
              />
              <i className="ri-calendar-line absolute left-3 top-2 text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="p-4 pb-0">
          <h4 className="font-semibold text-lg text-gray-800">Daftar Pemeriksaan / Pengujian</h4>
        </div>

        {/* Table */}
        <DataTable
          headers={headers}
          items={mockData}
          renderRow={renderRow}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={3}
          totalRecords={24}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};

export default PemeriksaanList;
