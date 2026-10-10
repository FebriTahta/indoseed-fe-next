"use client";

import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import { CancelButton } from "../../../shared/ActionButtons";
import HeaderInfo from "./form-sections/HeaderInfo";
import LeftSidebar from "./form-sections/LeftSidebar";
import ParameterTab from "./form-sections/ParameterTab";
import HasilTab from "./form-sections/HasilTab";
import RightSidebar from "./form-sections/RightSidebar";
import DokumentasiTab from "./form-sections/DokumentasiTab";
import TerimaSampelCard from "./form-sections/TerimaSampelCard";
import QcTabs from "../../shared/QcTabs";
import QcCard, { QcInfoList } from "../../shared/QcCard";
import QcTimeline from "../../shared/QcTimeline";
import QcStatusBadge from "../../shared/QcStatusBadge";
import QcReasonModal from "../../shared/QcReasonModal";
import { usePemeriksaanDetail } from "@/app/hooks/usePemeriksaanDetail";
import { useQcMeta } from "@/app/hooks/useQcReference";
import { QC_STATUS } from "@/app/types/qc";
import { formatDateTime } from "@/app/lib/format";

type TabKey = "parameter" | "hasil" | "dokumentasi" | "catatan" | "audit";
type ReviewDialog = "setujui" | "revisi" | null;


const PemeriksaanForm: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const state = usePemeriksaanDetail(id);
  const { data, loading, busy, dirty, canInput } = state;
  const { meta } = useQcMeta();
    const [activeTab, setActiveTab] = useState<TabKey>("parameter");
  const [reviewDialog, setReviewDialog] = useState<ReviewDialog>(null);

  const goBack = () => {
    if (dirty && !window.confirm("Ada perubahan hasil yang belum disimpan. Tinggalkan halaman?")) return;
    router.push("/qc/pemeriksaan-pengujian");
  };

  if (loading && !data) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <i className="ri-loader-4-line text-3xl animate-spin text-emerald-600 mb-2"></i>
        <p className="text-xs text-gray-500">Memuat data pemeriksaan...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-100 text-center space-y-3">
        <p className="text-xs text-gray-600">Data pemeriksaan tidak ditemukan.</p>
        <CancelButton label="Kembali" onClick={() => router.push("/qc/pemeriksaan-pengujian")} />
      </div>
    );
  }

  const belumDisetujui = data.status === QC_STATUS.MENUNGGU_PERSETUJUAN || data.status === QC_STATUS.DITOLAK;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 text-emerald-600 flex items-center justify-center text-5xl shrink-0">
            <i className="ri-flask-fill"></i>
          </div>
          <Pageheader
            title="QC & LAB"
            subtitle="Pemeriksaan / Pengujian"
            currentpage={data.noPengujian || data.noPermintaan}
            activepage="Pemeriksaan / Pengujian"
            description="Lakukan pemeriksaan dan pengujian sampel sesuai metode dan standar mutu yang berlaku."
          />
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <button type="button" onClick={goBack} className={buttonClass("secondary")}>
            <i className="ri-arrow-left-line"></i> Kembali
          </button>
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-gray-500 mb-0.5">Status</span>
            <QcStatusBadge status={data.status} size="sm" />
          </div>
          {data.status === QC_STATUS.SAMPLING && (
            <button
              type="button"
              onClick={() => router.push(`/qc/permintaan-pengujian/edit/${data.id}`)}
              className={buttonClass("secondary")}
            >
              <i className="ri-edit-line"></i> Edit Permintaan
            </button>
          )}
          {canInput && (
            <>
              <button type="button" disabled={busy} onClick={state.saveDraft} className={buttonClass("outline")}>
                <i className="ri-save-line"></i> Simpan Draft
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => window.confirm("Kirim hasil pengujian untuk direview?") && state.submitReview()}
                className={buttonClass("primary")}
              >
                <i className="ri-send-plane-line"></i> Submit untuk Review
              </button>
            </>
          )}
          {data.status === QC_STATUS.MENUNGGU_REVIEW && (
            <>
              <button type="button" disabled={busy} onClick={() => setReviewDialog("revisi")} className={buttonClass("warning")}>
                <i className="ri-arrow-go-back-line"></i> Kembalikan (Revisi)
              </button>
              <button type="button" disabled={busy} onClick={() => setReviewDialog("setujui")} className={buttonClass("primary")}>
                <i className="ri-check-double-line"></i> Setujui Hasil
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {belumDisetujui && (
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
            <i className="ri-information-line"></i> Permintaan ini belum disetujui sehingga belum dapat diperiksa.
          </div>
        )}
        {data.status === QC_STATUS.SAMPLING && <TerimaSampelCard data={data} busy={busy} onSubmit={state.terimaSampel} />}

        <HeaderInfo data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-4 xl:col-span-3">
            <LeftSidebar data={data} onLihatDokumentasi={() => setActiveTab("dokumentasi")} />
          </div>

          <div className="lg:col-span-8 xl:col-span-6">
            <QcTabs<TabKey>
              tabs={[
                { key: "parameter", label: "Parameter Pengujian" },
                { key: "hasil", label: "Hasil Pengujian" },
                { key: "dokumentasi", label: "Dokumentasi" },
                { key: "catatan", label: "Catatan" },
                { key: "audit", label: "Audit Trail" },
              ]}
              active={activeTab}
              onChange={setActiveTab}
            />

            {activeTab === "parameter" && (
              <ParameterTab
                state={state}
                hasilAkhirOptions={meta.hasilAkhir}
                onLihatDokumentasi={() => setActiveTab("dokumentasi")}
              />
            )}

            {activeTab === "hasil" && <HasilTab state={state} />}

            {activeTab === "dokumentasi" && <DokumentasiTab state={state} />}

            {activeTab === "catatan" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QcCard title="Catatan Pengujian" icon="ri-edit-2-line">
                  {canInput ? (
                    <textarea
                      rows={6}
                      value={state.catatanPengujian}
                      onChange={(e) => state.setCatatanPengujian(e.target.value)}
                      placeholder="Catatan analis terkait proses pengujian..."
                      className="w-full border border-gray-200 rounded-lg p-3 text-xs focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  ) : (
                    <p className="text-xs text-gray-700 whitespace-pre-line">{data.catatanPengujian || "-"}</p>
                  )}
                </QcCard>
                <QcCard title="Informasi Permintaan & Review" icon="ri-information-line">
                  <QcInfoList
                    items={[
                      { label: "Catatan Permintaan", value: data.catatan },
                      { label: "Disetujui Oleh", value: data.disetujuiOleh },
                      { label: "Tanggal Disetujui", value: formatDateTime(data.tanggalDisetujui) },
                      { label: "Mulai Uji", value: formatDateTime(data.tanggalMulaiUji) },
                      { label: "Selesai Uji", value: formatDateTime(data.tanggalSelesaiUji) },
                      { label: "Direview Oleh", value: data.direviewOleh },
                      { label: "Catatan Review", value: data.catatanReview },
                    ]}
                  />
                </QcCard>
              </div>
            )}

            {activeTab === "audit" && (
              <QcCard title="Audit Trail" icon="ri-history-line">
                <QcTimeline items={data.riwayat || []} />
              </QcCard>
            )}
          </div>

          <div className="lg:col-span-12 xl:col-span-3">
            <RightSidebar state={state} rekomendasiDefault={meta.rekomendasiDefault} />
          </div>
        </div>
      </div>

      <QcReasonModal
        isOpen={!!reviewDialog}
        title={reviewDialog === "setujui" ? "Setujui Hasil Pengujian" : "Kembalikan untuk Revisi"}
        description={
          <>
            Kesimpulan: <QcStatusBadge status={data.hasilAkhir} /> — {data.noPengujian}
          </>
        }
        label={reviewDialog === "setujui" ? "Catatan review (opsional)" : "Catatan revisi"}
        submitText={reviewDialog === "setujui" ? "Setujui" : "Kembalikan"}
        required={reviewDialog === "revisi"}
        onClose={() => setReviewDialog(null)}
        onSubmit={async (text) => {
          if (await state.review(reviewDialog!, text || undefined)) setReviewDialog(null);
        }}
      />
    </>
  );
};

export default PemeriksaanForm;
