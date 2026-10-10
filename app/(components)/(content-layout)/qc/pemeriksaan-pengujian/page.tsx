"use client";

import { iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import PemeriksaanList from "./components/PemeriksaanList";
import { useRouter } from "next/navigation";
import { AddButton, ExportButton } from "../../shared/ActionButtons";

const PemeriksaanPengujianPage = () => {
  const router = useRouter();

  return (
    <>
      <Pageheader
        currentpage="Pemeriksaan / Pengujian"
        activepage="Pemeriksaan / Pengujian"
        mainpage="QC & LAB"
        mainpageurl="/qc/pemeriksaan-pengujian"
      />
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
              <i className="ri-flask-fill text-3xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Pemeriksaan / Pengujian</h1>
              <p className="text-sm text-gray-500">Kelola data pemeriksaan dan pengujian sampel benih sesuai metode dan standar mutu yang berlaku.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <AddButton 
              label="Permintaan Pengujian" 
              onClick={() => router.push("/qc/permintaan-pengujian/create")} 
            />
            <ExportButton label="Laporan" onClick={() => {}} />
            <button type="button" title="Lainnya" className={iconButtonClass("gray", "!w-9 !h-9")}>
              <i className="ri-more-2-fill"></i>
            </button>
          </div>
        </div>
      </div>
      <PemeriksaanList />
    </>
  );
};

export default PemeriksaanPengujianPage;
