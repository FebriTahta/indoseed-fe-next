"use client";

import React from 'react';
import { TopProdukStok } from '@/app/types/stokBenih';

interface Top5StokTertinggiProps {
  items: TopProdukStok[];
}

export default function Top5StokTertinggi({ items }: Top5StokTertinggiProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
        <h3 className="text-xs font-bold text-gray-800">Top 5 Produk Stok Tertinggi</h3>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] text-gray-500 font-semibold">
              <th className="pb-2">Produk Benih</th>
              <th className="pb-2 text-center">Stok (Kg)</th>
              <th className="pb-2 text-right">Persentase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/50">
                <td className="py-2 text-gray-800 font-medium">{item.produkBenih}</td>
                <td className="py-2 text-center text-gray-900 font-bold">{item.stokKg.toLocaleString('id-ID')}</td>
                <td className="py-2 text-right text-gray-500 font-medium">{item.persentase}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
