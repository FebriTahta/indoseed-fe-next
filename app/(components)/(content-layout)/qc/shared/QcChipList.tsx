import React from 'react';

const TONES = [
  'bg-emerald-50 text-emerald-700',
  'bg-sky-50 text-sky-700',
  'bg-violet-50 text-violet-700',
  'bg-amber-50 text-amber-700',
  'bg-rose-50 text-rose-700',
  'bg-teal-50 text-teal-700',
];

/** Warna stabil per label agar label yang sama selalu berwarna sama di seluruh tabel. */
const toneOf = (label: string) => TONES[[...label].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % TONES.length];

interface QcChipListProps {
  items: string[];
  /** Jumlah chip yang ditampilkan sebelum diringkas menjadi "+N". */
  max?: number;
  emptyLabel?: string;
}

/** Daftar chip berwarna dengan ringkasan "+N" (tooltip memuat seluruh item). */
export default function QcChipList({ items, max = 3, emptyLabel = '-' }: QcChipListProps) {
  if (!items.length) return <span className="text-gray-400">{emptyLabel}</span>;
  const visible = items.slice(0, max);
  const rest = items.length - visible.length;

  return (
    <div className="flex flex-wrap items-center gap-1" title={items.join(', ')}>
      {visible.map((item) => (
        <span key={item} className={`px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${toneOf(item)}`}>
          {item}
        </span>
      ))}
      {rest > 0 && <span className="text-[10px] font-semibold text-gray-500">+{rest}</span>}
    </div>
  );
}
