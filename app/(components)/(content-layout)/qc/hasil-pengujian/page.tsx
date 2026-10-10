"use client";

import { iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import HasilPengujianList from "./components/HasilPengujianList";
import { AddButton, ExportButton } from "../../shared/ActionButtons";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

const HasilPengujianPage = () => {
  const router = useRouter();
  const { isPenguji } = useCurrentUser();

  return (
    <>
      <Pageheader currentpage="Hasil Pengujian" activepage="QC & LAB" mainpage="Hasil Pengujian" />
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
              <i className="ri-flask-fill text-3xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Hasil Pengujian</h1>
              <p className="text-sm text-gray-500">Menampilkan hasil pemeriksaan mutu benih yang telah selesai diuji dan menunggu proses review atau approval.</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isPenguji && (
              <AddButton
                label="Input Hasil Pengujian"
                onClick={() => router.push("/qc/pemeriksaan-pengujian")}
              />
            )}
            <ExportButton label="Export" onClick={() => {}} />
            <button type="button" title="Lainnya" className={iconButtonClass("gray", "!w-9 !h-9")}>
              <i className="ri-more-2-fill"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <HasilPengujianList />
      </div>
    </>
  );
};

export default HasilPengujianPage;
