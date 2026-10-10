import React from "react";
import { QcInfoList } from "../../../shared/QcCard";
import QcStatusBadge from "../../../shared/QcStatusBadge";
import QcDocumentList from "../../../shared/QcDocumentList";
import { PemeriksaanDetailState } from "@/app/hooks/usePemeriksaanDetail";
import { formatDateTime } from "@/app/lib/format";

/** Tab "Hasil Pengujian": rincian, catatan, dan SOP per parameter. */
const HasilTab = ({ state }: { state: PemeriksaanDetailState }) => {
  const { activeParams, drafts, setParamDraft, statusOf, canInput } = state;

  if (!activeParams.length) {
    return <p className="bg-white p-5 rounded-xl border border-gray-100 text-xs text-gray-400 italic">Tidak ada parameter pengujian.</p>;
  }

  return (
    <div className="space-y-4">
      {activeParams.map((p, idx) => {
        const status = statusOf(p);
        const draft = drafts[p.id];
        const nilai = draft?.nilaiHasil || draft?.hasilTeks || (p.nilaiHasil ?? p.hasilTeks ?? "");
        const satuan = p.satuan && p.satuan !== "-" ? ` ${p.satuan}` : "";

        return (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`h-1 ${status === "Tidak Lulus" ? "bg-rose-500" : status ? "bg-emerald-500" : "bg-gray-200"}`}></div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="font-semibold text-[#1B4E3B] text-sm mb-0">
                  {idx + 1}. {p.nama}
                </h3>
                <QcStatusBadge status={status} size="sm" emptyLabel="Belum diuji" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QcInfoList
                  items={[
                    { label: "Hasil", value: nilai !== "" ? `${nilai}${satuan}` : null },
                    { label: "Standar", value: p.standar },
                    { label: "Metode Uji", value: p.metodeRef ? `${p.metodeRef.kode} - ${p.metodeRef.nama}` : p.metode },
                    { label: "Standar Acuan", value: p.metodeRef?.standar ? `${p.metodeRef.standar.kode} - ${p.metodeRef.standar.nama}` : null },
                    { label: "Diuji Oleh", value: p.diujiOleh },
                    { label: "Tanggal Uji", value: formatDateTime(p.tanggalUji) },
                  ]}
                />
                <div>
                  <p className="text-xs font-medium text-gray-800 mb-2">Catatan Hasil</p>
                  {canInput ? (
                    <textarea
                      rows={5}
                      value={draft?.catatanHasil || ""}
                      onChange={(e) => setParamDraft(p.id, { catatanHasil: e.target.value })}
                      placeholder="Rincian pengamatan, mis. benih normal/abnormal, kondisi uji..."
                      aria-label={`Catatan hasil ${p.nama}`}
                      className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-xs text-gray-600 whitespace-pre-line">{p.catatanHasil || "-"}</p>
                  )}
                  {p.definisi && <p className="text-[11px] text-gray-400 mt-2">{p.definisi}</p>}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-800 mb-2">SOP / Dokumen Metode</p>
                  <QcDocumentList documents={p.metodeRef?.dokumen || []} emptyMessage="Metode uji belum memiliki dokumen." />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HasilTab;
