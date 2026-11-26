"use client";

import { buttonClass, iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QcTabs from "../../shared/QcTabs";
import QcCard, { QcInfoList } from "../../shared/QcCard";
import QcStatusBadge from "../../shared/QcStatusBadge";
import QcTimeline from "../../shared/QcTimeline";
import QcDocumentList from "../../shared/QcDocumentList";
import ParameterResultTable from "../../shared/ParameterResultTable";
import ReviewHasilModal, { ReviewKeputusan } from "../../shared/ReviewHasilModal";
import ParameterBelumDiujiAlert from "../../shared/ParameterBelumDiujiAlert";
import BukaUlangPengujianButton from "../../shared/BukaUlangPengujianButton";
import HasilRing from "./HasilRing";
import { summarizeParameters } from "../utils";
import { pendingStepsFor } from "../../shared/qcFlow";
import { HasilDetailState } from "@/app/hooks/useHasilDetail";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { HASIL_TIDAK_VALID, PermintaanPengujian, QC_STATUS } from "@/app/types/qc";
import { formatDateTime, formatNumber } from "@/app/lib/format";

type TabKey = "ringkasan" | "parameter" | "dokumentasi" | "riwayat";

/** Jumlah dokumentasi yang ditampilkan sebagai pratinjau di tab Ringkasan. */
const DOKUMENTASI_PREVIEW = 3;

interface HasilDetailPanelProps {
  state: HasilDetailState;
  onClose: () => void;
}

const informasiItems = (data: PermintaanPengujian) => [
  { label: "No. Pengujian", value: data.noPengujian },
  { label: "Komoditas", value: data.komoditas },
  { label: "No. Permintaan", value: data.noPermintaan },
  { label: "Varietas", value: data.varietas },
  { label: "Batch", value: data.kodeBatch },
  { label: "Tipe", value: data.tipe },
  { label: "No. Sampel", value: data.noSampel },
  { label: "Petani Mitra", value: data.petani },
  { label: "Tanggal Pengujian", value: formatDateTime(data.tanggalSelesaiUji) },
  { label: "Lahan", value: data.lahan },
  { label: "Analis", value: data.petugasQc?.nama },
  { label: "Jumlah Sampel", value: `${formatNumber(data.jumlahSampel)} ${data.satuanSampel || ""}`.trim() },
];

/** Panel samping halaman Hasil Pengujian: ringkasan, parameter, dokumentasi, riwayat & aksi review. */
export default function HasilDetailPanel({ state, onClose }: HasilDetailPanelProps) {
  const router = useRouter();
  const { data, loading, error, busy, review, ujiUlang } = state;
  const [tab, setTab] = useState<TabKey>("ringkasan");
  const [reviewDialog, setReviewDialog] = useState<ReviewKeputusan | null>(null);
  const { canReview } = useCurrentUser();

  // Kembali ke tab Ringkasan setiap kali berpindah data.
  useEffect(() => setTab("ringkasan"), [data?.id]);

  if (error) return <div className="p-4 text-sm text-rose-600">{error}</div>;
  if (loading || !data) {
    return (
      <div className="p-8 flex justify-center">
        <i className="ri-loader-4-line text-2xl animate-spin text-emerald-600"></i>
      </div>
    );
  }

  const { aktif, lulus, gagal, belum } = summarizeParameters(data.parameters);
  const dokumentasi = (data.dokumen || []).filter((d) => d.kategori === "Dokumentasi");
  const goToDetail = () => router.push(`/qc/pemeriksaan-pengujian/${data.id}`);

  return (
    <div className="flex flex-col">
      <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 rounded-t-xl flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 truncate">
            <i className="ri-flask-line text-emerald-600"></i>
            {data.noPengujian || data.noPermintaan}
          </h4>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <QcStatusBadge status={data.status} />
            <QcStatusBadge status={data.hasilTidakValid ? HASIL_TIDAK_VALID : data.hasilAkhir} emptyLabel="Belum ada kesimpulan" />
          </div>
        </div>
        <button type="button" onClick={onClose} className={iconButtonClass("gray")} aria-label="Tutup detail">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="px-2 pt-2">
        <QcTabs<TabKey>
          tabs={[
            { key: "ringkasan", label: "Ringkasan" },
            { key: "parameter", label: "Parameter", badge: aktif.length },
            { key: "dokumentasi", label: "Dokumentasi", badge: dokumentasi.length },
            { key: "riwayat", label: "Riwayat" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="px-4 pb-4 space-y-4">
        {data.hasilTidakValid && (
          <ParameterBelumDiujiAlert
            variant="tidak-valid"
            parameters={data.parameterBelumDiuji || []}
            onUjiUlang={canReview ? ujiUlang : undefined}
            busy={busy}
          />
        )}

        {tab === "ringkasan" && (
          <>
            <QcCard
              title="Informasi Pengujian"
              icon="ri-information-line"
              action={
                <button type="button" onClick={goToDetail} className={iconButtonClass("emerald")} title="Buka halaman pemeriksaan">
                  <i className="ri-external-link-line"></i>
                </button>
              }
            >
              <QcInfoList columns={2} items={informasiItems(data)} />
            </QcCard>

            <QcCard title="Ringkasan Hasil" icon="ri-pie-chart-2-line">
              <HasilRing lulus={lulus} gagal={gagal.length} belum={belum} />
              {gagal.length > 0 && (
                <div className="mt-4 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <i className="ri-error-warning-line"></i> Parameter tidak memenuhi standar:
                  </p>
                  <ul className="list-disc list-inside">
                    {gagal.map((p) => (
                      <li key={p.id}>
                        {p.nama} ({p.nilaiHasil ?? p.hasilTeks ?? "-"} vs {p.standar || "-"})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.rekomendasi && (
                <p className="mt-3 text-xs text-gray-600">
                  <span className="text-gray-500">Rekomendasi:</span> {data.rekomendasi}
                </p>
              )}
            </QcCard>

            <QcCard
              title="Dokumentasi"
              icon="ri-image-line"
              action={
                dokumentasi.length > DOKUMENTASI_PREVIEW && (
                  <button type="button" onClick={() => setTab("dokumentasi")} className="text-xs font-medium text-emerald-700 hover:underline">
                    Lihat Semua
                  </button>
                )
              }
            >
              <QcDocumentList
                variant="grid"
                documents={dokumentasi.slice(0, DOKUMENTASI_PREVIEW)}
                emptyMessage="Tidak ada dokumentasi pengujian."
              />
            </QcCard>
          </>
        )}

        {tab === "parameter" && <ParameterResultTable parameters={aktif} compact />}

        {tab === "dokumentasi" && (
          <QcDocumentList variant="grid" documents={dokumentasi} emptyMessage="Tidak ada dokumentasi pengujian." />
        )}

        {tab === "riwayat" && <QcTimeline items={data.riwayat || []} pendingSteps={pendingStepsFor(data.status)} />}
      </div>

      <div className="p-4 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-800 mb-2">Aksi</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={goToDetail} className={buttonClass("outline", "md", "flex-1")}>
            Lihat Detail
          </button>
          {data.status === QC_STATUS.MENUNGGU_REVIEW && !data.hasilTidakValid && canReview && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => setReviewDialog("revisi")}
                className={buttonClass("warning", "md", "flex-1")}
              >
                Kembalikan untuk Revisi
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setReviewDialog("setujui")}
                className={buttonClass("primary", "md", "flex-1")}
              >
                Approve Hasil
              </button>
            </>
          )}
          <BukaUlangPengujianButton data={data} onUjiUlang={ujiUlang} busy={busy} className="flex-1" />
        </div>
      </div>

      <ReviewHasilModal
        keputusan={reviewDialog}
        noPengujian={data.noPengujian}
        hasilAkhir={data.hasilAkhir}
        onClose={() => setReviewDialog(null)}
        onSubmit={review}
      />
    </div>
  );
}
