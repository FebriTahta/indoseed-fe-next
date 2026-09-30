import React from "react";

const ParameterTab = () => {
  const parameters = [
    { id: 1, name: "Kadar Air", method: "MT-001", acuan: "ISTA 2-001", standard: "≤ 8", result: "7.2", unit: "%", status: "Lulus", isError: false },
    { id: 2, name: "Kemurnian", method: "MT-002", acuan: "ISTA 2-106", standard: "≥ 98", result: "98.6", unit: "%", status: "Lulus", isError: false },
    { id: 3, name: "Daya Berkecambah", method: "MT-003", acuan: "ISTA 2-007", standard: "≥ 85", result: "82", unit: "%", status: "Tidak Lulus", isError: true },
    { id: 4, name: "Benih Murni", method: "MT-004", acuan: "ISTA 2-004", standard: "≥ 98", result: "98.2", unit: "%", status: "Lulus", isError: false },
    { id: 5, name: "Kesehatan Benih", method: "MT-005", acuan: "ISTA 2-103", standard: "≤ 2", result: "1.5", unit: "%", status: "Lulus", isError: false },
    { id: 6, name: "Berat 1.000 Butir", method: "MT-008", acuan: "ISTA 2-100", standard: "≥ 6", result: "6.8", unit: "gram", status: "Lulus", isError: false },
  ];

  return (
    <div className="space-y-4">
      {/* Parameter Pengujian */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h5 className="font-medium text-emerald-800 flex items-center gap-2">
              <i className="ri-file-list-3-line text-emerald-600"></i> Parameter Pengujian
            </h5>
            <p className="text-[11px] text-gray-500 mt-0.5 ml-6">Hasil pengujian akan otomatis mengevaluasi kesesuaian terhadap standar mutu.</p>
          </div>
          <button className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1.5 border border-emerald-200 bg-emerald-50 rounded-lg">
            <i className="ri-add-line"></i> Tambah Parameter
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="py-2 px-3 w-10 text-center">No</th>
                <th className="py-2 px-3">Parameter</th>
                <th className="py-2 px-3">Metode Uji</th>
                <th className="py-2 px-3">Standar Acuan</th>
                <th className="py-2 px-3">Standar</th>
                <th className="py-2 px-3">Hasil</th>
                <th className="py-2 px-3">Satuan</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parameters.map((param, index) => (
                <tr key={param.id} className="hover:bg-gray-50/50">
                  <td className="py-2 px-3 text-center text-gray-500">{index + 1}</td>
                  <td className="py-2 px-3 text-gray-800">{param.name}</td>
                  <td className="py-2 px-3 text-gray-600">{param.method}</td>
                  <td className="py-2 px-3 text-gray-600">{param.acuan}</td>
                  <td className="py-2 px-3 text-gray-600">{param.standard}</td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      defaultValue={param.result}
                      className={`border rounded px-2 py-1 w-12 text-center focus:outline-none focus:ring-1 text-xs ${param.isError ? 'border-red-300 text-red-600 focus:border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-200 text-blue-600 focus:border-emerald-500 focus:ring-emerald-500'}`}
                    />
                  </td>
                  <td className="py-2 px-3 text-gray-600">{param.unit}</td>
                  <td className="py-2 px-3">
                    {param.status === "Lulus" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <i className="ri-checkbox-circle-fill"></i> Lulus
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                        <i className="ri-close-circle-fill"></i> Tidak
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button className="w-6 h-6 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm flex items-center justify-center mx-auto" title="Detail">
                      <i className="ri-eye-line text-[10px]"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Parameter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

        <div className="flex items-center justify-between mb-4 mt-1">
          <h3 className="font-medium text-emerald-800 flex items-center gap-2 text-sm">
            <i className="ri-file-list-2-line text-emerald-600"></i> Detail Parameter: Daya Berkecambah
          </h3>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
            <i className="ri-close-circle-fill"></i> Tidak Lulus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Col: Info */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-gray-500 mb-1">Metode Uji</p>
              <p className="text-xs font-medium text-gray-800">MT-003 - Metode Uji Germinasi</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-1">Standar Acuan</p>
              <p className="text-xs font-medium text-gray-800">ISTA 2-007</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-1">Standar</p>
              <p className="text-xs font-medium text-gray-800">≥ 85 %</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 mb-1">SOP</p>
              <a href="#" className="flex items-start justify-between group p-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                <div className="flex items-start gap-2">
                  <i className="ri-file-pdf-2-line text-emerald-500 text-lg mt-0.5"></i>
                  <div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-emerald-700 line-clamp-1">SOP_Germinasi_v1.2.pdf</span>
                    <span className="text-[10px] text-gray-400">856 KB</span>
                  </div>
                </div>
                <i className="ri-download-2-line text-gray-400 group-hover:text-emerald-600 mt-1"></i>
              </a>
            </div>
          </div>

          {/* Middle Col: Rincian Hasil */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-gray-800 mb-2">Rincian Hasil</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Jumlah Benih Diuji</p>
                <div className="relative">
                  <input type="text" defaultValue="400" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-500" />
                  <span className="absolute right-3 top-1.5 text-xs text-gray-400">butir</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Hari Pengamatan</p>
                <select className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-blue-600 font-medium focus:outline-none focus:border-emerald-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:8px_8px] bg-[right_10px_center]">
                  <option>Hari ke-7</option>
                  <option>Hari ke-14</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Benih Normal</p>
                <input type="text" defaultValue="328" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Benih Abnormal</p>
                <input type="text" defaultValue="42" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Benih Mati</p>
                <input type="text" defaultValue="30" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 mb-1">Benih Keras</p>
                <input type="text" defaultValue="0" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <p className="text-xs font-bold text-gray-800">Hasil Akhir</p>
              <div className="relative w-24">
                <input type="text" defaultValue="82" className="w-full border border-red-200 bg-red-50 text-red-600 font-bold rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-500" readOnly />
                <span className="absolute right-3 top-1.5 text-xs text-red-400 font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Right Col: Note & Docs */}
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex gap-2">
              <i className="ri-error-warning-fill text-rose-500 text-lg mt-0.5"></i>
              <div>
                <p className="text-[11px] text-rose-700 leading-relaxed font-medium">Nilai hasil tidak memenuhi standar.<br />Standar minimum: 85%</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-800 mb-2">Dokumentasi</p>
              <div className="flex gap-2 mb-2">
                <div className="w-12 h-12 bg-gray-200 rounded border border-gray-300 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
                    <i className="ri-zoom-in-line text-white text-xs"></i>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded border border-gray-300 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
                    <i className="ri-zoom-in-line text-white text-xs"></i>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded border border-gray-300 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
                    <i className="ri-zoom-in-line text-white text-xs"></i>
                  </div>
                </div>
              </div>
              <button className="text-[10px] text-emerald-600 font-medium hover:text-emerald-700">Lihat Semua (3)</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParameterTab;
