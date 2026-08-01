"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(
  () => import('./PetaLeafletComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] bg-slate-900 flex items-center justify-center text-white text-xs">
        <div className="flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-lg"></i>
          <span>Memuat Peta Sebaran Lahan...</span>
        </div>
      </div>
    )
  }
);

export default function PetaSebaranLahan() {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-xs rounded-lg overflow-hidden mb-6">
      <div className="box-header p-4 border-b border-defaultborder flex justify-between items-center">
        <h3 className="box-title text-sm font-bold text-gray-800">Peta Sebaran Lahan</h3>
      </div>

      <MapWithNoSSR />
    </div>
  );
}
