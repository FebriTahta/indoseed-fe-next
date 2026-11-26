"use client";

import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import PermintaanList from "./components/PermintaanList";

const PermintaanPengujianPage = () => {
  return (
    <>
      <Pageheader
        currentpage="Permintaan Pengujian"
        activepage="Permintaan Pengujian"
        mainpage="QC & LAB"
        mainpageurl="/qc/permintaan-pengujian"
      />
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <i className="ri-flask-fill text-3xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Permintaan Pengujian</h1>
            <p className="text-sm text-gray-500">Kelola permintaan pemeriksaan kualitas benih sebelum proses pengujian dilakukan.</p>
          </div>
        </div>
      </div>
      <PermintaanList />
    </>
  );
};

export default PermintaanPengujianPage;
