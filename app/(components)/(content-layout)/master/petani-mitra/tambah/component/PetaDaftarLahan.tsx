"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { LahanItem } from './ModalTambahLahan';

const PetaLeafletDaftarLahanWithNoSSR = dynamic(
  () => import('./PetaLeafletDaftarLahan'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[360px] bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">
        <div className="flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-lg text-emerald-400"></i>
          <span>Memuat Peta Lahan Petani...</span>
        </div>
      </div>
    ),
  }
);

interface PetaDaftarLahanProps {
  lahanList: LahanItem[];
  heightClass?: string;
}

export default function PetaDaftarLahan({ lahanList, heightClass }: PetaDaftarLahanProps) {
  return <PetaLeafletDaftarLahanWithNoSSR lahanList={lahanList} heightClass={heightClass} />;
}
