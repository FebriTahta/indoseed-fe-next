"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { AddButton, ViewIconButton, EditIconButton, ExportButton } from "@/app/(components)/(content-layout)/shared/ActionButtons";
import PermintaanForm from "./PermintaanForm";

const mockData = [
  {
    id: "1",
    noPermintaan: "RQ-QC-2026-00125",
    tanggalPermintaan: "16 Jun 2026 08:15",
    batch: "BTH-2026-00125",
    komoditasVarietas: "Melon / Tere F1",
    tipe: "QC / Benih",
    jumlahSampel: "500 gram",
    jenisPengujian: "Lengkap (6)",
    pemohon: "Produksi",
    prioritas: "Normal",
    status: "Menunggu Persetujuan",
  },
  {
    id: "2",
    noPermintaan: "RQ-QC-2026-00124",
    tanggalPermintaan: "15 Jun 2026 14:20",
    batch: "BTH-2026-00124",
    komoditasVarietas: "Cabai / Keriting",
    tipe: "QC / Benih",
    jumlahSampel: "500 gram",
    jenisPengujian: "Lengkap (5)",
    pemohon: "Produksi",
    prioritas: "Normal",
    status: "Sampling",
  },
  {
    id: "3",
    noPermintaan: "RQ-QC-2026-00123",
    tanggalPermintaan: "14 Jun 2026 09:10",
    batch: "BTH-2026-00122",
    komoditasVarietas: "Padi / Inpari 32",
    tipe: "QC / Benih",
    jumlahSampel: "1 kg",
    jenisPengujian: "Lengkap (6)",
    pemohon: "Produksi",
    prioritas: "Urgent",
    status: "Dalam Pengujian",
  },
  {
    id: "4",
    noPermintaan: "RQ-QC-2026-00122",
    tanggalPermintaan: "13 Jun 2026 11:45",
    batch: "BTH-2026-00121",
    komoditasVarietas: "Melon / Tere F1",
    tipe: "QC / Benih",
    jumlahSampel: "500 gram",
    jenisPengujian: "Lengkap (6)",
    pemohon: "Produksi",
    prioritas: "Normal",
    status: "Menunggu Review",
  },
  {
    id: "5",
    noPermintaan: "RQ-QC-2026-00121",
    tanggalPermintaan: "12 Jun 2026 10:30",
    batch: "BTH-2026-00119",
    komoditasVarietas: "Cabai / Rawit",
    tipe: "QC / Benih",
    jumlahSampel: "500 gram",
    jenisPengujian: "Lengkap (5)",
    pemohon: "Produksi",
    prioritas: "Normal",
    status: "Selesai",
  },
];

const PermintaanList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headers = [
    "No.",
    "No. Permintaan",
    "Tanggal Permintaan",
    "Batch",
    "Komoditas / Varietas",
    "Tipe",
    "Jumlah Sampel",
    "Jenis Pengujian",
    "Pemohon",
    "Prioritas",
    "Status",
    "Aksi",
  ];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Persetujuan":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><i className="ri-time-line mr-1"></i>Menunggu Persetujuan</span>;
      case "Sampling":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"><i className="ri-test-tube-line mr-1"></i>Sampling</span>;
      case "Dalam Pengujian":
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"><i className="ri-settings-4-line mr-1"></i>Dalam Pengujian</span>;
      case "Menunggu Review":
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"><i className="ri-search-eye-line mr-1"></i>Menunggu Review</span>;
      case "Selesai":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"><i className="ri-checkbox-circle-line mr-1"></i>Selesai</span>;
      case "Ditolak":
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><i className="ri-close-circle-line mr-1"></i>Ditolak</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const renderPrioritas = (prioritas: string) => {
    if (prioritas === "Urgent") {
      return <span className="text-red-600 font-medium">Urgent</span>;
    }
    return <span className="text-gray-600">Normal</span>;
  };

  const renderRow = (item: any, index: number) => (
    <tr key={item.id} className="hover:bg-gray-50 border-b border-defaultborder transition-colors">

      <td className="p-4 text-center">{(index + 1).toString()}</td>
      <td className="p-4"><span className="text-primary font-medium">{item.noPermintaan}</span></td>
      <td className="p-4">{item.tanggalPermintaan}</td>
      <td className="p-4"><span className="font-medium text-gray-700">{item.batch}</span></td>
      <td className="p-4">{item.komoditasVarietas}</td>
      <td className="p-4">{item.tipe}</td>
      <td className="p-4">{item.jumlahSampel}</td>
      <td className="p-4">{item.jenisPengujian}</td>
      <td className="p-4">{item.pemohon}</td>
      <td className="p-4">{renderPrioritas(item.prioritas)}</td>
      <td className="p-4">{renderStatusBadge(item.status)}</td>
      <td className="p-4">
        <div className="flex gap-2 justify-center">
          <ViewIconButton title="Lihat" />
          <EditIconButton onClick={() => router.push(`/qc/permintaan-pengujian/edit/${item.id}`)} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Permintaan</p>
            <h3 className="text-3xl font-bold text-gray-800">128</h3>
            <p className="text-xs text-emerald-600 mt-1"><i className="ri-arrow-up-line"></i> 8% dari bulan lalu</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <i className="ri-file-list-3-line text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Menunggu Persetujuan</p>
            <h3 className="text-3xl font-bold text-gray-800">18</h3>
            <p className="text-xs text-gray-500 mt-1">perlu diproses</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <i className="ri-time-line text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Sampling</p>
            <h3 className="text-3xl font-bold text-gray-800">12</h3>
            <p className="text-xs text-gray-500 mt-1">menunggu sampel</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <i className="ri-flask-line text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Dalam Pengujian</p>
            <h3 className="text-3xl font-bold text-gray-800">24</h3>
            <p className="text-xs text-gray-500 mt-1">proses analisa</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <i className="ri-settings-4-line text-2xl"></i>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Selesai</p>
            <h3 className="text-3xl font-bold text-gray-800">65</h3>
            <p className="text-xs text-gray-500 mt-1">lulus / tidak lulus</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <i className="ri-checkbox-circle-line text-2xl"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari No. Permintaan, Batch..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
            </div>
            <div className="w-40">
              <Select
                instanceId="filter-periode"
                options={[
                  { value: "", label: "Semua Periode" },
                  { value: "today", label: "Hari Ini" },
                  { value: "week", label: "Minggu Ini" },
                  { value: "month", label: "Bulan Ini" },
                ]}
                placeholder="Periode"
                className="text-sm"
              />
            </div>
            <div className="w-40">
              <Select
                instanceId="filter-status"
                options={[
                  { value: "", label: "Semua Status" },
                  { value: "menunggu", label: "Menunggu Persetujuan" },
                  { value: "sampling", label: "Sampling" },
                  { value: "dalam_pengujian", label: "Dalam Pengujian" },
                  { value: "selesai", label: "Selesai" },
                ]}
                placeholder="Status"
                className="text-sm"
              />
            </div>
            <div className="w-40">
              <Select
                instanceId="filter-komoditas"
                options={[
                  { value: "", label: "Semua Komoditas" },
                  { value: "melon", label: "Melon" },
                  { value: "cabai", label: "Cabai" },
                  { value: "padi", label: "Padi" },
                ]}
                placeholder="Komoditas"
                className="text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <i className="ri-refresh-line"></i> Reset Filter
            </button>
          </div>
          <div className="flex gap-2">
            <AddButton label="Buat Permintaan" onClick={() => setIsModalOpen(true)} />
            <ExportButton />
          </div>
        </div>

        {/* Table */}
        <DataTable
          headers={headers}
          items={mockData}
          renderRow={renderRow}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={1}
          totalRecords={mockData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          headerTextSize="12px"
          bodyTextSize="10px"
        />
      </div>

      {/* Modal Buat Permintaan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Center Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-[75vw] animate-slide-down">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-defaultborder bg-emerald-600 text-white rounded-t-xl">
                <h5 className="text-white font-bold mb-0 flex items-center gap-2">
                  <i className="ri-test-tube-line"></i> Buat Permintaan Pengujian
                </h5>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              {/* Form Content */}
              <div className="bg-white">
                <div className="p-0 border-0 shadow-none mb-0 bg-white">
                  <PermintaanForm onCancel={() => setIsModalOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermintaanList;
