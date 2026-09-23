"use client";

import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import PermintaanForm from "../components/PermintaanForm";

const CreatePermintaanPage = () => {
  return (
    <>
      <Pageheader
        currentpage="Buat Permintaan Pengujian"
        activepage="Buat Permintaan"
        mainpage="Permintaan Pengujian"
        mainpageurl="/qc/permintaan-pengujian"
      />
      
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <i className="ri-test-tube-line text-3xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Buat Permintaan Pengujian</h1>
            <p className="text-sm text-gray-500">Lengkapi data permintaan pengujian berdasarkan batch yang dipilih.</p>
          </div>
        </div>
      </div>

      <PermintaanForm />
    </>
  );
};

export default CreatePermintaanPage;
