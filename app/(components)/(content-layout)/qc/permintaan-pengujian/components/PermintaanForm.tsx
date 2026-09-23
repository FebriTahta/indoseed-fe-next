"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { SaveButton, CancelButton, ManageButton } from "@/app/(components)/(content-layout)/shared/ActionButtons";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";

const mockBatches = [
  { value: "BTH-2026-00125", label: "BTH-2026-00125", data: { komoditas: "Melon", varietas: "Melon Tere F1", tipe: "QC / Benih", petani: "Suryadi", lahan: "Lahan 01 / Blok A", panen: "16 Jun 2026" } },
  { value: "BTH-2026-00124", label: "BTH-2026-00124", data: { komoditas: "Cabai", varietas: "Keriting", tipe: "QC / Benih", petani: "Budi", lahan: "Lahan 02 / Blok B", panen: "15 Jun 2026" } }
];

const mockParameters = [
  { id: "1", parameter: "Kadar Air", metode: "MT-001", standar: "≤ 8%", checked: true },
  { id: "2", parameter: "Kemurnian Benih", metode: "MT-002", standar: "≥ 98%", checked: true },
  { id: "3", parameter: "Daya Berkecambah", metode: "MT-003", standar: "≥ 85%", checked: true },
  { id: "4", parameter: "Benih Murni", metode: "MT-004", standar: "≥ 98%", checked: true },
  { id: "5", parameter: "Kesehatan Benih", metode: "MT-005", standar: "≤ 2%", checked: true },
  { id: "6", parameter: "Berat 1.000 Butir", metode: "MT-008", standar: "≥ 6 gram", checked: true },
];

interface PermintaanFormProps {
  onCancel?: () => void;
}

const PermintaanForm = ({ onCancel }: PermintaanFormProps = {}) => {
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [parameters, setParameters] = useState(mockParameters);
  const [activeTab, setActiveTab] = useState("Parameter Uji");

  const toggleParameter = (id: string) => {
    setParameters(parameters.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  const tabs = ["Parameter Uji", "Catatan & Dokumen", "Riwayat"];

  return (
    <>
      {/* Top Header Actions */}
      <div className="flex items-center justify-between mb-4">
        {!onCancel && (
          <Pageheader
            currentpage="Buat Baru"
            activepage="Permintaan Pengujian"
            mainpage="QC & LAB"
            mainpageurl="/qc/permintaan-pengujian"
          />
        )}
        <div className={`flex gap-2 ${onCancel ? 'w-full justify-end' : 'mt-4 md:mt-0'}`}>
          <CancelButton onClick={() => onCancel ? onCancel() : router.push('/qc/permintaan-pengujian')} />
          <ManageButton label="Simpan Draft" onClick={() => {}} className="!text-emerald-600 !border-emerald-600 hover:!bg-emerald-600 hover:!text-white" />
          <SaveButton label="Submit Permintaan" onClick={() => onCancel ? onCancel() : router.push('/qc/permintaan-pengujian')} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header Info (Top Bar) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6 overflow-x-auto">
          <div className="flex gap-8 min-w-max">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-file-list-3-line"></i> No. Permintaan
              </p>
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                RQ-QC-2026-00126 <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">Auto</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-calendar-event-line text-emerald-600"></i> Tanggal Permintaan
              </p>
              <div className="font-semibold text-gray-800">
                <input type="date" defaultValue="2026-06-17" className="text-sm border-none bg-transparent p-0 focus:ring-0 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="h-10 border-l border-gray-200 hidden lg:block"></div>

          <div className="flex gap-8 min-w-max">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-user-line text-emerald-600"></i> Pemohon
              </p>
              <div className="w-40">
                <Select
                  options={[{ value: "produksi", label: "Produksi" }, { value: "gudang", label: "Gudang" }]}
                  defaultValue={{ value: "produksi", label: "Produksi" }}
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '28px',
                      height: '28px',
                      border: 'none',
                      boxShadow: 'none',
                      backgroundColor: 'transparent',
                    }),
                    valueContainer: (base) => ({ ...base, padding: '0px' }),
                    input: (base) => ({ ...base, margin: '0px', padding: '0px' }),
                    indicatorSeparator: () => ({ display: 'none' }),
                    dropdownIndicator: (base) => ({ ...base, padding: '0px', color: '#10b981' })
                  }}
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-alert-line text-rose-500"></i> Prioritas
              </p>
              <div className="flex gap-3">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="prioritas" value="normal" className="text-emerald-500 focus:ring-emerald-500" defaultChecked />
                  <span className="text-sm font-medium text-gray-700">Normal</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="prioritas" value="urgent" className="text-rose-500 focus:ring-rose-500" />
                  <span className="text-sm font-medium text-rose-600">Urgent</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (12 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left Column: Batch & Sample Info */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            
            {/* Sumber Batch */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-archive-line text-emerald-600 text-lg"></i> Sumber Batch
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pilih Batch <span className="text-rose-500">*</span></label>
                  <Select
                    options={mockBatches}
                    onChange={(val: any) => setSelectedBatch(val)}
                    placeholder="Pilih Batch..."
                    className="text-sm mb-2"
                  />
                  {selectedBatch && (
                    <button className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1 ml-auto">
                      <i className="ri-external-link-line"></i> Lihat Detail
                    </button>
                  )}
                </div>

                {selectedBatch ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500 block">Komoditas</span>
                        <span className="font-medium text-gray-800 flex items-center gap-1"><i className="ri-leaf-fill text-emerald-500"></i> {selectedBatch.data.komoditas}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">Varietas</span>
                        <span className="font-medium text-gray-800">{selectedBatch.data.varietas}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Tipe</span>
                      <span className="font-medium text-gray-800">{selectedBatch.data.tipe}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Petani Mitra</span>
                      <span className="font-medium text-gray-800"><i className="ri-team-line text-emerald-600 mr-1"></i> {selectedBatch.data.petani}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Lahan / Blok</span>
                      <span className="font-medium text-gray-800"><i className="ri-map-pin-line text-emerald-600 mr-1"></i> {selectedBatch.data.lahan}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Tanggal Panen</span>
                      <span className="font-medium text-gray-800"><i className="ri-calendar-line text-emerald-600 mr-1"></i> {selectedBatch.data.panen}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200 border-dashed text-gray-400 text-xs">
                    Pilih batch untuk melihat detail informasi
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Sampel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-flask-line text-emerald-600 text-lg"></i> Informasi Sampel
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Jumlah Sampel <span className="text-rose-500">*</span></label>
                  <div className="flex relative shadow-sm">
                    <input type="number" className="w-full pl-3 pr-16 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" placeholder="Contoh: 500" />
                    <select className="absolute right-0 top-0 bottom-0 bg-gray-50 border-l border-gray-200 rounded-r-lg px-2 text-sm text-gray-600 focus:ring-emerald-500 outline-none">
                      <option>gram</option>
                      <option>kg</option>
                      <option>butir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Metode Pengambilan <span className="text-rose-500">*</span></label>
                  <Select
                    options={[{ value: "sop", label: "Sesuai SOP Sampling" }]}
                    defaultValue={{ value: "sop", label: "Sesuai SOP Sampling" }}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pengambil Sampel <span className="text-rose-500">*</span></label>
                  <Select
                    options={[{ value: "andi", label: "Andi Pratama" }]}
                    defaultValue={{ value: "andi", label: "Andi Pratama" }}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Main Area) */}
          <div className="md:col-span-8 lg:col-span-9">
            
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                      ${
                        activeTab === tab
                          ? "border-emerald-500 text-emerald-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "Parameter Uji" && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <i className="ri-list-check-2 text-emerald-600 text-lg"></i> Pilihan Parameter Uji
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Parameter default dipilih berdasarkan komoditas dan standar mutu yang berlaku.</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                    <i className="ri-add-line"></i> Tambah Parameter
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 w-10">Pilih</th>
                        <th className="px-4 py-3">Parameter Uji</th>
                        <th className="px-4 py-3">Metode Uji</th>
                        <th className="px-4 py-3">Standar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {parameters.map((param) => (
                        <tr key={param.id} className={`hover:bg-gray-50 transition-colors ${param.checked ? '' : 'opacity-60 bg-gray-50'}`}>
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={param.checked}
                              onChange={() => toggleParameter(param.id)}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                          </td>
                          <td className={`px-4 py-3 font-medium ${param.checked ? 'text-gray-800' : 'text-gray-500 line-through'}`}>
                            {param.parameter}
                          </td>
                          <td className="px-4 py-3 text-gray-500">{param.metode}</td>
                          <td className="px-4 py-3 text-gray-500">{param.standar}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Catatan & Dokumen" && (
              <div className="space-y-4">
                {/* Catatan */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="ri-edit-2-line text-emerald-600 text-lg"></i> Catatan Khusus
                  </h3>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Masukkan instruksi khusus atau catatan tambahan untuk analis lab..."
                  ></textarea>
                </div>

                {/* Upload Dokumen */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="ri-attachment-line text-emerald-600 text-lg"></i> Lampiran Dokumen
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <i className="ri-upload-cloud-2-line text-3xl text-emerald-600"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">Klik untuk upload atau drag & drop file di sini</p>
                    <p className="text-xs text-gray-500 mb-4">Format yang didukung: PDF, DOCX, JPG, PNG (Maksimal 10 MB)</p>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                      Pilih File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Riwayat" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <i className="ri-history-line text-4xl text-gray-300 mb-3 block"></i>
                <p className="text-gray-500 text-sm">Belum ada riwayat perubahan untuk permintaan ini.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default PermintaanForm;
