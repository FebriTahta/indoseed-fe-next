"use client";

import React from 'react';
import { AlatPengeringItem } from '@/app/types/pengeringan';

interface StatusAlatPengeringProps {
  alatList: AlatPengeringItem[];
}

export default function StatusAlatPengering({ alatList }: StatusAlatPengeringProps) {
  const renderBadge = (status: string) => {
    switch (status) {
      case 'Beroperasi':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Beroperasi
          </span>
        );
      case 'Jeda':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            Jeda
          </span>
        );
      case 'Tidak Beroperasi':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            Tidak Beroperasi
          </span>
        );
    }
  };

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800">Status Alat Pengering</h3>
        <button type="button" className="text-xs font-semibold text-emerald-700 hover:underline">
          Lihat Semua
        </button>
      </div>

      {/* Dryer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {alatList.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-lg border transition-all ${
              item.status === 'Beroperasi'
                ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                : item.status === 'Jeda'
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-gray-200 bg-gray-50/40 opacity-75'
            }`}
          >
            {/* Header: Icon, Code, Type, Badge */}
            <div className="flex items-start justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs ${
                    item.status === 'Beroperasi'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.status === 'Jeda'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <i className="ri-archive-line text-sm"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 leading-none">{item.kodeAlat}</h4>
                  <span className="text-[10px] text-gray-500 font-medium block mt-0.5">{item.tipeAlat}</span>
                </div>
              </div>
            </div>

            <div className="mb-2.5">{renderBadge(item.status)}</div>

            {/* Metrics */}
            <div className="space-y-1 text-[11px] mb-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Suhu</span>
                <span className="font-bold text-gray-800">
                  {item.suhu !== null ? `${item.suhu.toLocaleString('id-ID')}°C` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Kadar Air Rata-rata</span>
                <span className="font-bold text-gray-800">
                  {item.kadarAirRata !== null ? `${item.kadarAirRata.toLocaleString('id-ID')}%` : '—'}
                </span>
              </div>
            </div>

            {/* Kapasitas Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between items-center text-[10px] font-semibold text-gray-600 mb-1">
                <span>Kapasitas</span>
                <span>{item.kapasitasPersen}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${
                    item.status === 'Beroperasi'
                      ? 'bg-emerald-600'
                      : item.status === 'Jeda'
                      ? 'bg-amber-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ width: `${item.kapasitasPersen}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Lokasi */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
              <span>Lokasi</span>
              <span className="font-medium text-gray-700">{item.lokasi}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
