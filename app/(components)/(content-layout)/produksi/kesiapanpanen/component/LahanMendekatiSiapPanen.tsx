"use client";

import React from 'react';
import { KesiapanPanenItem } from '@/app/types/kesiapanPanen';

interface LahanMendekatiSiapPanenProps {
  items?: KesiapanPanenItem[];
}

export default function LahanMendekatiSiapPanen({ items = [] }: LahanMendekatiSiapPanenProps) {
  const safeItems = items || [];
  // Sort or filter items that are ready or nearing readiness
  const readyItems = safeItems
    .filter((i) => i.statusKesiapan !== 'Tidak Aktif')
    .slice(0, 4);

  const defaultItems = [
    {
      id: 'LA-2605-0003',
      crop: 'Kedelai Anjasmoro',
      info: 'Umur 95 HST • Prediksi 16/06/2026',
      badge: '3 Hari Lagi',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'LA-2605-0005',
      crop: 'Jagung Bisi 18',
      info: 'Umur 97 HST • Prediksi 15/06/2026',
      badge: '4 Hari Lagi',
      img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'LA-2605-0006',
      crop: 'Padi Ciherang',
      info: 'Umur 100 HST • Prediksi 17/06/2026',
      badge: '6 Hari Lagi',
      img: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const displayList = readyItems.length > 0
    ? readyItems.map((item) => {
        const cropName = `${item.komoditas || ''} ${item.varietas || ''}`.trim() || 'Tanaman';
        const infoStr = `Umur ${item.umurHst || 0} HST • Prediksi ${item.prediksiPanen || '-'}`;
        const badgeColor =
          item.statusKesiapan === 'Siap Panen'
            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
            : item.statusKesiapan === 'Akan Siap (3-7 Hari)'
            ? 'bg-amber-100 text-amber-800 border-amber-200'
            : 'bg-purple-100 text-purple-800 border-purple-200';

        const sampleImgs = [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=150&q=80',
          'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=150&q=80',
          'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=150&q=80',
        ];
        const randomImg = sampleImgs[Math.floor(Math.random() * sampleImgs.length)];

        return {
          id: item.kodeLahan,
          crop: cropName,
          info: infoStr,
          badge: item.statusKesiapan,
          badgeColor,
          img: randomImg,
        };
      })
    : defaultItems.map((d) => ({
        ...d,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      }));

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Lahan Mendekati Siap Panen</h3>
        <span className="text-xs text-emerald-700 font-semibold">{displayList.length} Lahan</span>
      </div>

      <div className="box-body p-4 space-y-3">
        {displayList.map((item, idx) => (
          <div key={item.id || idx} className="p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50/80 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.img}
                alt={item.crop}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-800 mb-0.5">{item.id} • {item.crop}</h4>
                <span className="text-[10px] text-gray-500 font-medium block">{item.info}</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-[10px] font-bold border shrink-0 ml-2 ${item.badgeColor}`}>
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
