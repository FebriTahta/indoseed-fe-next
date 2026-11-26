import React from 'react';

interface HasilRingProps {
  lulus: number;
  gagal: number;
  belum: number;
}

const LEGEND = [
  { key: 'lulus', label: 'Lulus', icon: 'ri-checkbox-circle-fill text-emerald-500' },
  { key: 'gagal', label: 'Tidak Lulus', icon: 'ri-close-circle-fill text-rose-500' },
  { key: 'belum', label: 'Perlu Review', icon: 'ri-time-fill text-amber-400' },
] as const;

/** Cincin ringkasan parameter lulus / tidak lulus / belum diuji. */
export default function HasilRing({ lulus, gagal, belum }: HasilRingProps) {
  const total = lulus + gagal + belum;
  const pLulus = total ? (lulus / total) * 100 : 0;
  const pGagal = total ? (gagal / total) * 100 : 0;
  const counts = { lulus, gagal, belum };

  return (
    <div className="flex items-center gap-6">
      <div
        className="w-28 h-28 shrink-0 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#10b981 0 ${pLulus}%, #f43f5e ${pLulus}% ${pLulus + pGagal}%, #e5e7eb ${pLulus + pGagal}% 100%)`,
        }}
        role="img"
        aria-label={`${lulus} lulus, ${gagal} tidak lulus, ${belum} belum diuji`}
      >
        <div className="w-[88px] h-[88px] bg-white rounded-full flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-800">
            {lulus}/{total}
          </span>
          <span className="text-[10px] text-gray-500">Parameter Lulus</span>
        </div>
      </div>
      <ul className="flex-1 text-xs space-y-2.5">
        {LEGEND.map((l) => (
          <li key={l.key} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-gray-700">
              <i className={l.icon}></i> {l.label}
            </span>
            <strong className="text-gray-800">{counts[l.key]}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
