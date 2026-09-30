"use client";

import React, { useState } from "react";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import { useRouter } from "next/navigation";
import HeaderInfo from "./form-sections/HeaderInfo";
import LeftSidebar from "./form-sections/LeftSidebar";
import ParameterTab from "./form-sections/ParameterTab";
import RightSidebar from "./form-sections/RightSidebar";
import DokumentasiTab from "./form-sections/DokumentasiTab";
import { SaveButton, CancelButton, ManageButton } from "../../../shared/ActionButtons";

interface PemeriksaanFormProps {
  id?: string;
}

const PemeriksaanForm: React.FC<PemeriksaanFormProps> = ({ id }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Parameter Pengujian");

  const tabs = [
    "Parameter Pengujian",
    "Hasil Pengujian",
    "Dokumentasi",
    "Catatan",
    "Audit Trail",
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-sm border border-emerald-100">
            <i className="ri-flask-line"></i>
          </div>
          <Pageheader
            title="QC & LAB"
            subtitle="Pemeriksaan / Pengujian"
            currentpage={id || "TST-QC-2026-00125"}
            activepage="Pemeriksaan / Pengujian"
            description="Lakukan pemeriksaan dan pengujian sampel sesuai dengan metode dan standar mutu yang berlaku."
          />
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 font-medium mb-0.5">Status</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-medium">
              <i className="ri-loader-4-line animate-spin"></i> Dalam Pengujian
            </span>
          </div>
          <CancelButton label="Kembali" onClick={() => router.push("/qc/pemeriksaan-pengujian")} className="!px-3 !py-1.5 !text-xs !bg-white !text-emerald-600 !border-emerald-600 hover:!bg-emerald-50" />
          <SaveButton label="Submit untuk Review" onClick={() => { }} className="!px-3 !py-1.5 !text-xs !bg-emerald-600 !text-white hover:!bg-emerald-700" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Header Info */}
        <HeaderInfo />

        {/* Main Content Layout (12 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Left Column: Sample Info, Location, Docs */}
          <div className="md:col-span-3 space-y-4">
            <LeftSidebar />
          </div>

          {/* Middle & Right Column Wrapper */}
          <div className="md:col-span-9">

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
              <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab
                        ? "border-emerald-500 text-emerald-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content Layout */}
            {activeTab === "Parameter Pengujian" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Parameter Table Area */}
                <div className="md:col-span-8 space-y-4">
                  <ParameterTab />
                </div>

                {/* Status & Approval Area */}
                <div className="md:col-span-4 space-y-4">
                  <RightSidebar />
                </div>
              </div>
            )}

            {activeTab === "Dokumentasi" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-12 space-y-4">
                  <DokumentasiTab />
                </div>
              </div>
            )}

            {activeTab !== "Parameter Pengujian" && activeTab !== "Dokumentasi" && (
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center text-gray-500">
                Konten untuk tab "{activeTab}" belum tersedia (Placeholder)
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default PemeriksaanForm;
