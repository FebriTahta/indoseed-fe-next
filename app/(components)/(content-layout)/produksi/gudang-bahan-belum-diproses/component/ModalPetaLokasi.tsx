"use client";

import React from 'react';
import { GudangBahanItem } from '@/app/types/gudangBahanBelumDiproses';

interface ModalPetaLokasiProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLot: GudangBahanItem | null;
}

export default function ModalPetaLokasi({
  isOpen,
  onClose,
  selectedLot,
}: ModalPetaLokasiProps) {
  if (!isOpen) return null;

  const currentZone = selectedLot?.lokasi || 'Zona A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Peta Denah Gudang Bahan Belum Diproses
              </h2>
              <p className="text-xs text-gray-500">
                Gudang Produksi - Penempatan Pallet & Zona Penyimpanan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Blueprint body */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          {/* Warehouse Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-400 block font-medium">Suhu Ruang</span>
              <span className="text-sm font-bold text-gray-900">24.8°C</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-400 block font-medium">Kelembaban (RH)</span>
              <span className="text-sm font-bold text-gray-900">58%</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-400 block font-medium">Kapasitas Terpakai</span>
              <span className="text-sm font-bold text-emerald-700">72% (9.2 Ton)</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] text-gray-400 block font-medium">Lot Terpilih</span>
              <span className="text-sm font-bold text-emerald-800 font-mono">
                {selectedLot?.noLot || 'LOT-2026-00021'}
              </span>
            </div>
          </div>

          {/* Interactive Layout */}
          <div className="p-5 rounded-xl border border-gray-200 bg-slate-900 text-white space-y-4 shadow-inner">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Gudang Produksi (Main Storage Hall)
              </span>
              <span>Pintu Masuk Bongkar Muat (Loading Dock) ↓</span>
            </div>

            {/* Grid of 3 Zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ZONA A */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentZone.includes('A')
                    ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                    <span>Zona A</span>
                    {currentZone.includes('A') && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white">
                        Lokasi Lot
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">Pallet 01 - 08</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Komoditas:</span>
                    <span className="text-white font-medium">Melon & Kangkung</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Kapasitas:</span>
                    <span className="text-emerald-400 font-semibold">5 Pallet (Terisi)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Kondisi:</span>
                    <span className="text-slate-300">Sirkulasi AC Dingin</span>
                  </div>
                </div>

                {/* Pallet blocks representation */}
                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  <div className={`h-8 rounded flex items-center justify-center font-mono text-[9px] ${currentZone.includes('A') ? 'bg-emerald-600 text-white font-bold ring-2 ring-white' : 'bg-emerald-900/60 text-emerald-300'}`}>P-01</div>
                  <div className="h-8 rounded bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-mono text-[9px]">P-02</div>
                  <div className="h-8 rounded bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-mono text-[9px]">P-03</div>
                  <div className="h-8 rounded bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-mono text-[9px]">P-04</div>
                  <div className="h-8 rounded bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-mono text-[9px]">P-05</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                </div>
              </div>

              {/* ZONA B */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentZone.includes('B')
                    ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm text-blue-400 flex items-center gap-2">
                    <span>Zona B</span>
                    {currentZone.includes('B') && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white">
                        Lokasi Lot
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">Pallet 09 - 16</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Komoditas:</span>
                    <span className="text-white font-medium">Cabai, Tomat, Selada</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Kapasitas:</span>
                    <span className="text-blue-400 font-semibold">4 Pallet (Terisi)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Kondisi:</span>
                    <span className="text-slate-300">Dry Storage</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  <div className="h-8 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center font-mono text-[9px]">P-09</div>
                  <div className="h-8 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center font-mono text-[9px]">P-10</div>
                  <div className="h-8 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center font-mono text-[9px]">P-11</div>
                  <div className="h-8 rounded bg-blue-900/60 text-blue-300 flex items-center justify-center font-mono text-[9px]">P-12</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                </div>
              </div>

              {/* ZONA C */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentZone.includes('C')
                    ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm text-amber-400 flex items-center gap-2">
                    <span>Zona C</span>
                    {currentZone.includes('C') && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white">
                        Lokasi Lot
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">Pallet 17 - 24</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Komoditas:</span>
                    <span className="text-white font-medium">Padi & Tomat</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Kapasitas:</span>
                    <span className="text-amber-400 font-semibold">3 Pallet (Terisi)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Kondisi:</span>
                    <span className="text-slate-300">Ventilasi Alami</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
                  <div className="h-8 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center font-mono text-[9px]">P-17</div>
                  <div className="h-8 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center font-mono text-[9px]">P-18</div>
                  <div className="h-8 rounded bg-amber-900/60 text-amber-300 flex items-center justify-center font-mono text-[9px]">P-19</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                  <div className="h-8 rounded bg-slate-800 text-slate-500 flex items-center justify-center font-mono text-[9px]">Kosong</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs text-gray-500">
            Titik koordinat penyimpanan: <strong className="text-gray-800">{selectedLot?.lokasiDetail || `Gudang Produksi / ${selectedLot?.lokasi || 'Zona A'}`}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs transition-colors"
          >
            Tutup Peta
          </button>
        </div>
      </div>
    </div>
  );
}
