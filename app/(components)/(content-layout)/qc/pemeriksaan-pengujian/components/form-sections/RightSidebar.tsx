import React, { useRef, useState } from "react";
import { buttonClass, iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import QcCard from "../../../shared/QcCard";
import { useConfirmDeleteDokumentasi } from "./useConfirmDeleteDokumentasi";
import { isImageDoc } from "../../../shared/QcDocumentList";
import { useImageLightbox } from "../../../shared/QcImageLightbox";
import { formatDateTime } from "@/app/lib/format";
import QcTimeline from "../../../shared/QcTimeline";
import { pendingStepsFor } from "../../../shared/qcFlow";
import { PemeriksaanDetailState } from "@/app/hooks/usePemeriksaanDetail";
import { HASIL_AKHIR, PermintaanPengujianParameter } from "@/app/types/qc";

interface RightSidebarProps {
  state: PemeriksaanDetailState;
  /** Pemetaan kesimpulan → rekomendasi dari backend (`/qc/meta`). */
  rekomendasiDefault: Record<string, string>;
}

const satuanOf = (p: PermintaanPengujianParameter) => (p.satuan && p.satuan !== "-" ? p.satuan : "");

const KESIMPULAN_STYLE = {
  [HASIL_AKHIR.LULUS]: {
    box: "bg-emerald-50/60 border-emerald-200",
    divider: "border-emerald-200",
    icon: "ri-check-line bg-emerald-500",
    title: "text-emerald-600",
  },
  [HASIL_AKHIR.TIDAK_LULUS]: {
    box: "bg-rose-50/60 border-rose-200",
    divider: "border-rose-200",
    icon: "ri-close-line bg-rose-500",
    title: "text-rose-600",
  },
  pending: {
    box: "bg-gray-50 border-gray-200",
    divider: "border-gray-200",
    icon: "ri-time-line bg-gray-400",
    title: "text-gray-600",
  },
} as const;

const RightSidebar = ({ state, rekomendasiDefault }: RightSidebarProps) => {
  const { data, activeParams, statusOf, hasilAkhirPreview, drafts } = state;
  if (!data) return null;

  // Selama input hasil berlangsung tampilkan pratinjau, setelah itu kesimpulan tersimpan.
  const kesimpulan = state.canInput ? hasilAkhirPreview : data.hasilAkhir || hasilAkhirPreview;
  const rekomendasi = (kesimpulan && rekomendasiDefault[kesimpulan]) || data.rekomendasi;
  const gagal = activeParams.filter((p) => statusOf(p) === HASIL_AKHIR.TIDAK_LULUS);
  const terisi = activeParams.filter((p) => statusOf(p)).length;
  const style = KESIMPULAN_STYLE[kesimpulan as keyof typeof KESIMPULAN_STYLE] || KESIMPULAN_STYLE.pending;

  const nilaiOf = (p: PermintaanPengujianParameter) => {
    const d = drafts[p.id];
    const nilai = d?.nilaiHasil || (p.nilaiHasil ?? "");
    return nilai !== "" ? `${nilai}${satuanOf(p)}` : d?.hasilTeks || p.hasilTeks || "-";
  };

  return (
    <div className="space-y-4">
      <DokumentasiCard state={state} />

      <QcCard title="Kesimpulan Pengujian" icon="ri-seedling-fill">
        <div className={`rounded-xl border overflow-hidden ${style.box}`}>
          <div className={`flex items-center gap-3 px-4 py-3 border-b ${style.divider}`}>
            <span className={`w-9 h-9 rounded-full text-white text-lg flex items-center justify-center shrink-0 ${style.icon}`}></span>
            <h4 className={`font-bold text-sm tracking-wide mb-0 ${style.title}`}>
              {kesimpulan ? kesimpulan.toUpperCase() : "BELUM LENGKAP"}
            </h4>
          </div>

          <div className="px-4 py-3 space-y-3 text-xs">
            {!kesimpulan && (
              <p className="text-gray-600">
                {terisi}/{activeParams.length} parameter sudah memiliki hasil. Kesimpulan muncul setelah semua parameter terisi.
              </p>
            )}
            {kesimpulan === HASIL_AKHIR.LULUS && <p className="text-gray-600">Seluruh parameter memenuhi standar mutu.</p>}
            {kesimpulan === HASIL_AKHIR.TIDAK_LULUS && (
              <div>
                <p className="text-gray-600 mb-1.5">Ditemukan {gagal.length} parameter tidak memenuhi standar mutu:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {gagal.map((p) => (
                    <li key={p.id}>
                      {p.nama}: {nilaiOf(p)} (Standar {p.standar || "-"})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {kesimpulan && (
              <div>
                <p className="text-gray-600 mb-0.5">Rekomendasi:</p>
                <p className="font-semibold text-[#1B4E3B]">{rekomendasi || "-"}</p>
              </div>
            )}
          </div>

          {kesimpulan === HASIL_AKHIR.TIDAK_LULUS && (
            <div className={`px-4 py-3 border-t ${style.divider}`}>
              <button
                type="button"
                disabled
                title="Modul Temuan QC belum tersedia"
                className={buttonClass("secondary")}
              >
                <i className="ri-add-circle-fill text-emerald-600 text-sm"></i> Buat Temuan QC
              </button>
            </div>
          )}
        </div>
      </QcCard>

      <QcCard title="Status & Approval" icon="ri-git-commit-line">
        <QcTimeline items={data.riwayat || []} pendingSteps={pendingStepsFor(data.status)} />
      </QcCard>

      <CatatanCard state={state} />

      {data.catatanReview && (
        <QcCard title="Catatan Review" icon="ri-chat-check-line">
          <p className="text-[11px] text-gray-700 whitespace-pre-line">{data.catatanReview}</p>
          <p className="text-[10px] text-gray-400 mt-1">oleh {data.direviewOleh || "-"}</p>
        </QcCard>
      )}
    </div>
  );
};

/** Galeri dokumentasi pengujian + unggah cepat. */
function DokumentasiCard({ state }: { state: PemeriksaanDetailState }) {
  const { data, busy, uploadDokumentasi, deleteDokumentasi } = state;
  const inputRef = useRef<HTMLInputElement>(null);
  const docs = (data?.dokumen || []).filter((d) => d.kategori === "Dokumentasi");
  const { open: openPreview, lightbox } = useImageLightbox(docs.filter(isImageDoc));
  const confirmDeleteDokumentasi = useConfirmDeleteDokumentasi(deleteDokumentasi);
  if (!data) return null;
  const canEdit = state.canEditDokumentasi;

  return (
    <QcCard
      title="Dokumentasi Pengujian"
      icon="ri-image-line"
      action={
        canEdit && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadDokumentasi(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className={buttonClass("outline", "sm")}
            >
              <i className="ri-add-line"></i> Tambah
            </button>
          </>
        )
      }
    >
      {docs.length === 0 ? (
        <p className="text-[11px] text-gray-400 italic">Belum ada dokumentasi pengujian.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {docs.map((doc) => (
            <div key={doc.id} className="relative border border-gray-200 rounded-lg overflow-hidden">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                onClick={(e) => {
                  if (!isImageDoc(doc)) return;
                  e.preventDefault();
                  openPreview(doc.fileUrl);
                }}
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  {isImageDoc(doc) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={doc.fileUrl} alt={doc.keterangan || doc.namaFile} className="w-full h-full object-cover" />
                  ) : (
                    <i className="ri-file-pdf-2-line text-2xl text-rose-500"></i>
                  )}
                </div>
                <div className="px-1.5 py-1">
                  <p className="text-[10px] text-gray-700 truncate">{doc.keterangan || doc.namaFile}</p>
                  <p className="text-[9px] text-gray-400 truncate">{formatDateTime(doc.createdAt)}</p>
                </div>
              </a>
              {canEdit && (
                <button
                  type="button"
                  title="Hapus"
                  onClick={() => confirmDeleteDokumentasi(doc)}
                  className={iconButtonClass("gray", "absolute top-1 right-1 !w-6 !h-6 shadow-sm hover:!text-rose-600")}
                >
                  <i className="ri-close-line text-xs"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {lightbox}
    </QcCard>
  );
}

/** Catatan pengujian (bisa diedit selama pengujian berlangsung). */
function CatatanCard({ state }: { state: PemeriksaanDetailState }) {
  const [editing, setEditing] = useState(false);
  const { data, canInput, catatanPengujian, setCatatanPengujian } = state;
  if (!data) return null;

  return (
    <QcCard
      title="Catatan"
      icon="ri-information-line"
      action={
        canInput && (
          <button type="button" onClick={() => setEditing((v) => !v)} title="Ubah catatan" className={iconButtonClass("emerald")}>
            <i className={editing ? "ri-check-line" : "ri-edit-line"}></i>
          </button>
        )
      }
    >
      {editing && canInput ? (
        <textarea
          rows={3}
          autoFocus
          value={catatanPengujian}
          onChange={(e) => setCatatanPengujian(e.target.value)}
          placeholder="Tambahkan catatan terkait pengujian ini..."
          aria-label="Catatan pengujian"
          className="w-full border border-gray-200 rounded-md p-2 text-[11px] focus:outline-none focus:border-emerald-500"
        />
      ) : (
        <p className={`text-[11px] border border-gray-100 rounded-md p-2.5 whitespace-pre-line ${catatanPengujian ? "text-gray-700" : "text-gray-400 italic"}`}>
          {catatanPengujian || "Tambahkan catatan terkait pengujian ini..."}
        </p>
      )}
    </QcCard>
  );
}

export default RightSidebar;
