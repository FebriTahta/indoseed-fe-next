import React, { useMemo } from 'react';
import { JadwalTanam } from '@/app/types/jadwalTanam';

interface RingkasanKomoditasProps {
  jadwalTanams?: JadwalTanam[];
}

const COLOR_PALETTE = [
  { color: 'bg-emerald-600', textClass: 'text-emerald-600', hex: '#16a34a' },
  { color: 'bg-blue-600', textClass: 'text-blue-600', hex: '#2563eb' },
  { color: 'bg-purple-600', textClass: 'text-purple-600', hex: '#9333ea' },
  { color: 'bg-amber-600', textClass: 'text-amber-600', hex: '#d97706' },
  { color: 'bg-rose-600', textClass: 'text-rose-600', hex: '#e11d48' },
  { color: 'bg-indigo-600', textClass: 'text-indigo-600', hex: '#4f46e5' },
  { color: 'bg-cyan-600', textClass: 'text-cyan-600', hex: '#0891b2' },
  { color: 'bg-gray-500', textClass: 'text-gray-500', hex: '#6b7280' },
];

export default function RingkasanKomoditas({ jadwalTanams = [] }: RingkasanKomoditasProps) {
  const commoditiesData = useMemo(() => {
    if (!jadwalTanams || jadwalTanams.length === 0) return [];

    const grouped: Record<string, number> = {};
    let totalLuas = 0;

    jadwalTanams.forEach(item => {
      const name = item.komoditas || item.lahanKomoditas?.komoditas || (item.lahanKomoditas as any)?.namaKomoditas || 'Lainnya';
      const luas = Number(item.lahanKomoditas?.luasTanam || 0);
      grouped[name] = (grouped[name] || 0) + luas;
      totalLuas += luas;
    });

    const entries = Object.entries(grouped);
    if (entries.length === 0) return [];

    let currentOffset = 0;

    return entries.map(([name, area], index) => {
      const percent = totalLuas > 0 ? Math.round((area / totalLuas) * 100) : 0;
      const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];
      const offset = currentOffset;
      currentOffset += percent;

      return {
        name,
        area: `${area.toFixed(2).replace('.', ',')} Ha`,
        percent,
        offset,
        color: palette.color,
        textClass: palette.textClass,
      };
    });
  }, [jadwalTanams]);

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg mb-6 overflow-hidden">
      <div className="box-header p-4 border-b border-defaultborder">
        <h3 className="box-title text-sm font-bold text-gray-800">Ringkasan per Komoditas</h3>
      </div>
      <div className="box-body p-4 flex flex-col sm:flex-row items-center gap-5">
        {commoditiesData.length > 0 ? (
          <>
            {/* Donut Chart SVG */}
            <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Track */}
                <path
                  className="text-gray-100 stroke-current"
                  strokeWidth="4.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Dynamic Slices */}
                {commoditiesData.map((item, idx) => (
                  <path
                    key={idx}
                    className={`${item.textClass} stroke-current`}
                    strokeWidth="4.5"
                    strokeDasharray={`${item.percent}, 100`}
                    strokeDashoffset={`-${item.offset}`}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 w-full text-xs">
              {commoditiesData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded ${item.color}`}></span>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-gray-500 font-medium text-[11px]">
                    {item.percent}% ({item.area})
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-6 text-center w-full text-xs text-gray-400">
            Belum ada data komoditas terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}
