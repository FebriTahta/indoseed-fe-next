import React from "react";

const ParameterTab = () => {
  const parameters = [
    { id: 1, name: "Kadar Air (Moisture)", method: "Oven Method (ISTA)", standard: "Maks. 8.0%", result: "7.2%", status: "Sesuai", isEdit: false },
    { id: 2, name: "Daya Kecambah (Germination)", method: "Paper Towel (ISTA)", standard: "Min. 85%", result: "88%", status: "Sesuai", isEdit: false },
    { id: 3, name: "Kemurnian Fisik (Purity)", method: "Manual Sort (ISTA)", standard: "Min. 99%", result: "99.5%", status: "Sesuai", isEdit: false },
    { id: 4, name: "Benih Gulma / Kotoran", method: "Visual Inspection", standard: "Maks. 0.2%", result: "-", status: "Belum Diuji", isEdit: true },
  ];

  return (
    <div className="bg-white p-0 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <i className="ri-flask-line text-blue-600"></i> Hasil Uji Parameter
        </h3>
        <button className="text-sm flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium">
          <i className="ri-add-line"></i> Tambah Parameter
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Parameter</th>
              <th className="py-3 px-4">Metode Uji</th>
              <th className="py-3 px-4">Standar (Acuan)</th>
              <th className="py-3 px-4">Hasil Uji</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {parameters.map((param, index) => (
              <tr key={param.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 text-center text-gray-500">{index + 1}</td>
                <td className="py-3 px-4 font-medium text-gray-800">{param.name}</td>
                <td className="py-3 px-4 text-gray-600">{param.method}</td>
                <td className="py-3 px-4 text-gray-600">{param.standard}</td>
                <td className="py-3 px-4">
                  {param.isEdit ? (
                    <input type="text" placeholder="Input hasil..." className="border border-gray-300 rounded-md px-2 py-1 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
                  ) : (
                    <span className="font-medium text-gray-800">{param.result}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {param.status === "Sesuai" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <i className="ri-check-line"></i> Sesuai
                    </span>
                  ) : param.status === "Tidak Sesuai" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      <i className="ri-close-line"></i> Tidak Sesuai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      <i className="ri-time-line"></i> Menunggu
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit Hasil">
                      <i className="ri-pencil-line"></i>
                    </button>
                    <button className="text-gray-400 hover:text-purple-600 transition-colors" title="Lampirkan Dokumen">
                      <i className="ri-attachment-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm">
        <span className="text-gray-500">Total 4 Parameter Uji</span>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          Simpan Hasil Uji
        </button>
      </div>
    </div>
  );
};

export default ParameterTab;
