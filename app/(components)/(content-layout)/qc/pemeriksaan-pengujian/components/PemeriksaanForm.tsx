"use client";

import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import { CancelButton } from "../../../shared/ActionButtons";
import { useConfirm } from "@/app/(components)/(content-layout)/shared/ConfirmDialog";
import HeaderInfo from "./form-sections/HeaderInfo";
import LeftSidebar from "./form-sections/LeftSidebar";
import ParameterTab from "./form-sections/ParameterTab";
import RightSidebar from "./form-sections/RightSidebar";
import DokumentasiTab from "./form-sections/DokumentasiTab";
import TerimaSampelCard from "./form-sections/TerimaSampelCard";
import QcTabs from "../../shared/QcTabs";
import QcCard, { QcInfoList } from "../../shared/QcCard";
import QcTimeline from "../../shared/QcTimeline";
import QcStatusBadge from "../../shared/QcStatusBadge";
import ReviewHasilModal, { ReviewKeputusan } from "../../shared/ReviewHasilModal";
import ParameterBelumDiujiAlert from "../../shared/ParameterBelumDiujiAlert";
import BukaUlangPengujianButton from "../../shared/BukaUlangPengujianButton";
import PengujiOnlyNotice from "../../shared/PengujiOnlyNotice";
import { usePemeriksaanDetail } from "@/app/hooks/usePemeriksaanDetail";
import { useQcMeta } from "@/app/hooks/useQcReference";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { QC_STATUS } from "@/app/types/qc";
import { formatDateTime } from "@/app/lib/format";

type TabKey = "parameter" | "dokumentasi" | "catatan" | "audit";


const PemeriksaanForm: React.FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const state = usePemeriksaanDetail(id);
  const { data, loading, busy, dirty, canInput, canSubmit, belumDiuji } = state;
  const { meta } = useQcMeta();
    const [activeTab, setActiveTab] = useState<TabKey>("parameter");
  const [reviewDialog, setReviewDialog] = useState<ReviewKeputusan | null>(null);

  const confirm = useConfirm();
  const { canReview, isPenguji } = useCurrentUser();

  const goBack = async () => {
    if (
      dirty &&
      !(await confirm({
        title: "Tinggalkan Halaman?",
        message: "Ada perubahan hasil pengujian yang belum disimpan. Perubahan tersebut akan hilang jika Anda keluar.",
        tone: "warning",
        icon: "ri-logout-box-r-line",
        confirmText: "Tinggalkan",
        cancelText: "Tetap di Sini",
      }))
    ) {
      return;
    }
    router.push("/qc/pemeriksaan-pengujian");
  };

  const handleSubmitReview = async () => {
    const ok = await confirm({
      title: "Kirim Hasil untuk Review?",
      message: "Hasil pengujian akan dikunci dan diteruskan ke supervisor untuk direview. Pastikan semua nilai sudah benar.",
      details: (
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold">{data?.noPengujian || data?.noPermintaan}</span>
          <span className="flex items-center gap-1.5 text-gray-500">
            Kesimpulan sementara <QcStatusBadge status={state.hasilAkhirPreview} emptyLabel="-" />
          </span>
        </div>
      ),
      tone: "info",
      icon: "ri-send-plane-line",
      confirmText: "Ya, Kirim",
    });
    if (ok) state.submitReview();
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
          {data.status === QC_STATUS.SAMPLING && !isPenguji && (
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
                disabled={busy || !canSubmit}
                onClick={handleSubmitReview}
                className={buttonClass("primary")}
                title={canSubmit ? undefined : "Lengkapi hasil semua parameter uji terlebih dahulu"}
              >
                <i className="ri-send-plane-line"></i> Submit untuk Review
              </button>
            </>
          )}
          {data.status === QC_STATUS.MENUNGGU_REVIEW && canReview && (
            <>
              <button type="button" disabled={busy} onClick={() => setReviewDialog("revisi")} className={buttonClass("warning")}>
                <i className="ri-arrow-go-back-line"></i> Kembalikan (Revisi)
              </button>
              <button
                type="button"
                disabled={busy || data.hasilTidakValid}
                onClick={() => setReviewDialog("setujui")}
                className={buttonClass("primary")}
                title={data.hasilTidakValid ? "Hasil tidak valid, tidak dapat disetujui" : undefined}
              >
                <i className="ri-check-double-line"></i> Setujui Hasil
              </button>
            </>
          )}
          <BukaUlangPengujianButton data={data} onUjiUlang={state.ujiUlang} busy={busy} />
        </div>
      </div>

      <div className="space-y-4">
        {canInput && !canSubmit && <ParameterBelumDiujiAlert variant="belum-lengkap" parameters={belumDiuji} />}
        {data.hasilTidakValid && (
          <ParameterBelumDiujiAlert
            variant="tidak-valid"
            parameters={data.parameterBelumDiuji || []}
            onUjiUlang={canReview ? state.ujiUlang : undefined}
            busy={busy}
          />
        )}
        {belumDisetujui && (
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-800">
            <i className="ri-information-line"></i> Permintaan ini belum disetujui sehingga belum dapat diperiksa.
          </div>
        )}
        {data.status === QC_STATUS.SAMPLING && isPenguji && <TerimaSampelCard data={data} busy={busy} onSubmit={state.terimaSampel} />}
        {(data.status === QC_STATUS.SAMPLING || data.status === QC_STATUS.DALAM_PENGUJIAN) && !isPenguji && (
          <PengujiOnlyNotice petugas={data.petugasQc?.nama} />
        )}

        <HeaderInfo data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-4 xl:col-span-3">
            <LeftSidebar data={data} onLihatDokumentasi={() => setActiveTab("dokumentasi")} />
          </div>

          <div className="lg:col-span-8 xl:col-span-6">
            <QcTabs<TabKey>
              tabs={[
                { key: "parameter", label: "Parameter Pengujian" },
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

      <ReviewHasilModal
        keputusan={reviewDialog}
        noPengujian={data.noPengujian}
        hasilAkhir={data.hasilAkhir}
        onClose={() => setReviewDialog(null)}
        onSubmit={state.review}
      />
    </>
  );
};

export default PemeriksaanForm;
