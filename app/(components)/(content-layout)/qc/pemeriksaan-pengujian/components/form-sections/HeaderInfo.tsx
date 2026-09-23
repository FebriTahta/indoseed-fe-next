import React from "react";

const HeaderInfo = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between overflow-x-auto gap-8">
      
      {/* Group 1 */}
      <div className="flex gap-8 min-w-max">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <i className="ri-file-list-3-line"></i> No. Pengujian
          </p>
          <div className="font-semibold text-gray-800">TST-QC-2026-00125 <i className="ri-file-copy-line text-gray-400 cursor-pointer ml-1 hover:text-emerald-600"></i></div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">No. Permintaan</p>
          <div className="font-semibold text-gray-800">RQ-QC-2026-00125</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Batch</p>
          <div className="font-semibold text-gray-800">BTH-2026-00125</div>
        </div>
      </div>

      <div className="h-10 border-l border-gray-200 hidden lg:block"></div>

      {/* Group 2 */}
      <div className="flex gap-8 min-w-max">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">Komoditas</p>
          <div className="font-semibold text-gray-800 flex items-center gap-2">
            <i className="ri-leaf-fill text-emerald-500"></i> Melon
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">Varietas</p>
          <div className="font-semibold text-gray-800 flex items-center gap-2">
            <i className="ri-seedling-line text-emerald-500"></i> Melon Tere F1
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">Tipe</p>
          <div className="font-semibold text-gray-800">OC / Benih</div>
        </div>
      </div>

      <div className="h-10 border-l border-gray-200 hidden lg:block"></div>

      {/* Group 3 */}
      <div className="flex gap-8 min-w-max">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <i className="ri-calendar-event-line text-emerald-600"></i> Tanggal Sampling
          </p>
          <div className="font-semibold text-gray-800">16 Jun 2026</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <i className="ri-team-line text-emerald-600"></i> Petani Mitra
          </p>
          <div className="font-semibold text-gray-800">Suryadi</div>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
            <i className="ri-map-pin-line text-emerald-600"></i> Lahan
          </p>
          <div className="font-semibold text-gray-800">Lahan 01 / Blok A</div>
        </div>
      </div>

    </div>
  );
};

export default HeaderInfo;
