import React from 'react';

export default function IdentitasProdukCard() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Identitas Produk
      </h3>

      <div className="grid grid-cols-2 gap-4 items-center mb-4">
        {/* Seed Bag Photo */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=250&q=80"
            alt="INPARI 32 5Kg"
            className="w-24 h-28 object-cover rounded shadow-sm border border-emerald-600/30"
          />
          <span className="text-[10px] font-bold text-emerald-800 mt-1">INPARI 32 (5 Kg)</span>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-gray-100 text-center">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TRC-2606-0005-7XBK"
            alt="QR Verification"
            className="w-20 h-20 rounded border border-gray-200"
          />
          <span className="text-[9px] text-gray-500 font-medium mt-1">Scan QR untuk verifikasi</span>
        </div>
      </div>

      {/* Verified Green Badge Card */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <i className="ri-check-line"></i>
          </div>
          <div>
            <h5 className="text-xs font-bold text-emerald-900 mb-0">Verified</h5>
            <span className="text-[10px] text-emerald-700 font-medium">Data valid & terverifikasi</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-gray-500 block">Kode Verifikasi</span>
          <span className="text-[10px] font-extrabold text-emerald-900">TRC-2606-0005-7XBK</span>
        </div>
      </div>
    </div>
  );
}
