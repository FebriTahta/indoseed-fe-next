"use client";

import React from "react";
import { useParams } from "next/navigation";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import PermintaanForm from "../../components/PermintaanForm";

export default function EditPermintaanPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <Pageheader
        currentpage="Edit Permintaan Pengujian"
        activepage="Edit Permintaan"
        mainpage="Permintaan Pengujian"
        mainpageurl="/qc/permintaan-pengujian"
      />

      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <i className="ri-edit-line text-3xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Edit Permintaan Pengujian</h1>
            <p className="text-sm text-gray-500">Perbarui data permintaan pengujian selama sampel belum diterima laboratorium.</p>
          </div>
        </div>
      </div>

      <PermintaanForm mode="edit" id={id} />
    </>
  );
}
