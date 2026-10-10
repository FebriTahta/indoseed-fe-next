"use client";

import { buttonClass, iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QcTabs from "../../shared/QcTabs";
import { QcInfoList } from "../../shared/QcCard";
import QcStatusBadge from "../../shared/QcStatusBadge";
import QcTimeline from "../../shared/QcTimeline";
import QcDocumentList from "../../shared/QcDocumentList";
import ParameterResultTable from "../../shared/ParameterResultTable";
import { pendingStepsFor } from "../../shared/qcFlow";
import { pemeriksaanPengujianService } from "@/app/services/pemeriksaanPengujianService";
import { HASIL_AKHIR, PermintaanPengujian, QC_STATUS } from "@/app/types/qc";
import { formatDateTime, formatNumber, getErrorMessage } from "@/app/lib/format";

type TabKey = "ringkasan" | "parameter" | "dokumentasi" | "riwayat";

/** Ringkasan lulus / tidak lulus dalam bentuk cincin. */
const HasilRing = ({ lulus, gagal, belum }: { lulus: number; gagal: number; belum: number }) => {
  const total = lulus + gagal + belum || 1;
  const pLulus = (lulus / total) * 100;
  const pGagal = (gagal / total) * 100;
  return (
    <div className="flex items-center gap-6">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#10b981 0 ${pLulus}%, #f43f5e ${pLulus}% ${pLulus + pGagal}%, #e5e7eb ${pLulus + pGagal}% 100%)`,
        }}
        role="img"
        aria-label={`${lulus} lulus, ${gagal} tidak lulus, ${belum} belum diuji`}
      >
        <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-800">
            {lulus}/{lulus + gagal + belum}
          </span>
          <span className="text-[10px] text-gray-500">Lulus</span>
        </div>
      </div>
      <ul className="text-xs space-y-1.5">
        <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Lulus <strong>{lulus}</strong></li>
        <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tidak Lulus <strong>{gagal}</strong></li>
        <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Belum diuji <strong>{belum}</strong></li>
      </ul>
    </div>
  );
};

export default function HasilDetailPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const router = useRouter();
  const [data, setData] = useState<PermintaanPengujian | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<TabKey>("ringkasan");

  useEffect(() => {
    let active = true;
    setData(null);
    setError("");
    pemeriksaanPengujianService
      .getById(id)
      .then((res) => active && setData(res.data))
      .catch((err) => active && setError(getErrorMessage(err, "Gagal memuat detail")));
    return () => {
      active = false;
    };
  }, [id]);

  if (error) return <div className="p-4 text-sm text-rose-600">{error}</div>;
  if (!data) {
    return (
      <div className="p-8 flex justify-center">
        <i className="ri-loader-4-line text-2xl animate-spin text-emerald-600"></i>
      </div>
    );
  }

  const params = (data.parameters || []).filter((p) => p.checked);
  const lulus = params.filter((p) => p.statusHasil === HASIL_AKHIR.LULUS).length;
  const gagal = params.filter((p) => p.statusHasil === HASIL_AKHIR.TIDAK_LULUS);
  const dokumentasi = (data.dokumen || []).filter((d) => d.kategori === "Dokumentasi");

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-gray-800">{data.noPengujian || data.noPermintaan}</h4>
          <div className="flex gap-2 mt-1">
            <QcStatusBadge status={data.status} />
            <QcStatusBadge status={data.hasilAkhir} emptyLabel="Belum ada kesimpulan" />
          </div>
        </div>
        <button type="button" onClick={onClose} className={iconButtonClass("gray")} aria-label="Tutup detail">
          <i className="ri-close-line"></i>
        </button>
      </div>

      <div className="px-2">
        <QcTabs<TabKey>
          tabs={[
            { key: "ringkasan", label: "Ringkasan" },
            { key: "parameter", label: "Parameter", badge: params.length },
            { key: "dokumentasi", label: "Dokumentasi", badge: dokumentasi.length },
            { key: "riwayat", label: "Riwayat" },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="p-4 space-y-5">
        {tab === "ringkasan" && (
          <>
            <QcInfoList
              columns={2}
              items={[
                { label: "No. Permintaan", value: data.noPermintaan },
                { label: "Batch", value: data.kodeBatch },
                { label: "Komoditas", value: data.komoditas },
                { label: "Varietas", value: data.varietas },
                { label: "No. Sampel", value: data.noSampel },
                { label: "Jumlah Sampel", value: `${formatNumber(data.jumlahSampel)} ${data.satuanSampel || ""}` },
                { label: "Petani Mitra", value: data.petani },
                { label: "Lahan", value: data.lahan },
                { label: "Analis", value: data.petugasQc?.nama },
                { label: "Laboratorium", value: data.laboratorium?.namaLaboratorium },
                { label: "Selesai Uji", value: formatDateTime(data.tanggalSelesaiUji) },
                { label: "Rekomendasi", value: data.rekomendasi },
              ]}
            />
            <div>
              <h5 className="text-sm font-semibold text-gray-800 mb-3">Ringkasan Hasil</h5>
              <HasilRing lulus={lulus} gagal={gagal.length} belum={params.length - lulus - gagal.length} />
              {gagal.length > 0 && (
                <div className="mt-3 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700">
                  <p className="font-semibold mb-1">Parameter tidak memenuhi standar:</p>
                  <ul className="list-disc list-inside">
                    {gagal.map((p) => (
                      <li key={p.id}>
                        {p.nama} ({p.nilaiHasil ?? p.hasilTeks ?? "-"} vs {p.standar || "-"})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {tab === "parameter" && <ParameterResultTable parameters={params} compact />}

        {tab === "dokumentasi" && (
          <QcDocumentList variant="grid" documents={dokumentasi} emptyMessage="Tidak ada dokumentasi pengujian." />
        )}

        {tab === "riwayat" && <QcTimeline items={data.riwayat || []} pendingSteps={pendingStepsFor(data.status)} />}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2">
        <button
          type="button"
          onClick={() => router.push(`/qc/pemeriksaan-pengujian/${data.id}`)}
          className={buttonClass("outline", "md", "flex-1")}
        >
          Lihat Detail
        </button>
        {data.status === QC_STATUS.MENUNGGU_REVIEW && (
          <button
            type="button"
            onClick={() => router.push(`/qc/pemeriksaan-pengujian/${data.id}`)}
            className={buttonClass("primary", "md", "flex-1")}
          >
            Review Hasil
          </button>
        )}
      </div>
    </div>
  );
}
