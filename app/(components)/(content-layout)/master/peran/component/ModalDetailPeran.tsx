"use client";

import React from 'react';
import { Peran } from '@/app/types/peran';

interface ModalDetailPeranProps {
  isOpen: boolean;
  onClose: () => void;
  item: Peran | null;
  onEdit: (item: Peran) => void;
}

export default function ModalDetailPeran({
  isOpen,
  onClose,
  item,
  onEdit,
}: ModalDetailPeranProps) {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-2xs">
              <i className="ri-id-card-line"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Detail Master Peran</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Informasi jabatan dan daftar personel yang memegang peran ini.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Main Card */}
          <div className="p-4 bg-gradient-to-br from-emerald-50/60 to-white rounded-xl border border-emerald-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full font-semibold">
                  {item.kodePeran}
                </span>
                <h4 className="text-lg font-bold text-gray-900 mt-1">{item.namaPeran}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600 font-medium">
                    Kategori: <span className="text-gray-800 font-semibold">{item.kategori}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      item.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Aktif' ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    ></span>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>

            {item.deskripsi && (
              <div className="mt-3 pt-3 border-t border-emerald-100/60 text-xs text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900 block mb-0.5">Tanggung Jawab:</span>
                <p className="text-gray-600">{item.deskripsi}</p>
              </div>
            )}
          </div>

          {/* Assigned Personnel List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Personel dengan Peran Ini ({item.penanggungJawabs?.length || item._count?.penanggungJawabs || 0})
              </h5>
            </div>

            {item.penanggungJawabs && item.penanggungJawabs.length > 0 ? (
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                {item.penanggungJawabs.map((pj) => (
                  <div key={pj.id} className="p-3 hover:bg-gray-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                        {pj.nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{pj.nama}</p>
                        <span className="text-[11px] text-gray-500">
                          {pj.kodePersonel || '-'} • {pj.areaModul || 'Produksi'} ({pj.lokasi || 'Semua'})
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        pj.status === 'Aktif'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {pj.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">
                <i className="ri-user-unfollow-line text-2xl block mb-1"></i>
                Belum ada personel yang ditugaskan untuk peran ini.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 shadow-2xs"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <i className="ri-edit-line text-sm"></i>
            Edit Peran
          </button>
        </div>
      </div>
    </div>
  );
}
