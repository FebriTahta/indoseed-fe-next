"use client";

import React from 'react';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';

interface RingkasanKesiapanPanenProps {
  items?: KesiapanPanenItem[];
  stats?: any;
}

export default function RingkasanKesiapanPanen({ items = [], stats }: RingkasanKesiapanPanenProps) {
  const safeItems = items || [];
  const totalLahan = safeItems.length;

  const countSiap = safeItems.filter((i) => i.statusKesiapan === 'Siap Panen').length;
  const countAkan3_7 = safeItems.filter((i) => i.statusKesiapan === 'Akan Siap (3-7 Hari)').length;
  const countAkan8_14 = safeItems.filter((i) => i.statusKesiapan === 'Akan Siap (8-14 Hari)').length;
  const countBelum = safeItems.filter((i) => i.statusKesiapan === 'Belum Siap').length;
  const countTidakAktif = safeItems.filter((i) => i.statusKesiapan === 'Tidak Aktif').length;

  const pct = (c: number) => (totalLahan > 0 ? ((c / totalLahan) * 100).toFixed(1) : '0.0');

  const summaryData = [
    { label: 'Siap Panen', count: countSiap, percent: `${pct(countSiap)}%`, color: 'bg-emerald-600' },
    { label: 'Akan Siap (3-7 Hari)', count: countAkan3_7, percent: `${pct(countAkan3_7)}%`, color: 'bg-amber-500' },
    { label: 'Akan Siap (8-14 Hari)', count: countAkan8_14, percent: `${pct(countAkan8_14)}%`, color: 'bg-purple-600' },
    { label: 'Belum Siap', count: countBelum, percent: `${pct(countBelum)}%`, color: 'bg-rose-600' },
    { label: 'Tidak Aktif', count: countTidakAktif, percent: `${pct(countTidakAktif)}%`, color: 'bg-gray-300' },
  ];

  // SVG Ring Calculations
  const dashSiap = totalLahan > 0 ? (countSiap / totalLahan) * 100 : 0;
  const dashAkan3 = totalLahan > 0 ? (countAkan3_7 / totalLahan) * 100 : 0;
  const dashAkan8 = totalLahan > 0 ? (countAkan8_14 / totalLahan) * 100 : 0;
  const dashBelum = totalLahan > 0 ? (countBelum / totalLahan) * 100 : 0;

  const offsetAkan3 = -dashSiap;
  const offsetAkan8 = -(dashSiap + dashAkan3);
  const offsetBelum = -(dashSiap + dashAkan3 + dashAkan8);

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <div>
          <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan Kesiapan Panen</h3>
          <span className="text-[10px] text-gray-400 block mt-0.5">Real-time Data Lahan</span>
        </div>
      </div>

      <div className="box-body p-4 flex flex-col sm:flex-row items-center gap-5">
        {/* SVG Donut Chart */}
        <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            {/* Background track */}
            <path
              className="text-gray-100 stroke-current"
              strokeWidth="4.5"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {totalLahan > 0 && (
              <>
                <path
                  className="text-emerald-600 stroke-current"
                  strokeWidth="4.5"
                  strokeDasharray={`${dashSiap.toFixed(1)}, 100`}
                  strokeDashoffset="0"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500 stroke-current"
                  strokeWidth="4.5"
                  strokeDasharray={`${dashAkan3.toFixed(1)}, 100`}
                  strokeDashoffset={offsetAkan3.toFixed(1)}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-600 stroke-current"
                  strokeWidth="4.5"
                  strokeDasharray={`${dashAkan8.toFixed(1)}, 100`}
                  strokeDashoffset={offsetAkan8.toFixed(1)}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-rose-600 stroke-current"
                  strokeWidth="4.5"
                  strokeDasharray={`${dashBelum.toFixed(1)}, 100`}
                  strokeDashoffset={offsetBelum.toFixed(1)}
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </>
            )}
          </svg>

          {/* Donut Center Text */}
          <div className="absolute text-center flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 font-medium">Total Lahan</span>
            <span className="text-sm font-extrabold text-gray-800 leading-tight">{totalLahan}</span>
            <span className="text-[9px] text-gray-500 font-semibold">Lahan</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2 w-full text-xs">
          {summaryData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded ${item.color}`}></span>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="text-gray-600 font-semibold text-[11px]">
                {item.count} Lahan <span className="text-gray-400 font-normal">({item.percent})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
