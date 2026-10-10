import React, { useMemo } from "react";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import { toast } from "react-toastify";
import QcCard from "../../../shared/QcCard";
import QcMiniMap from "../../../shared/QcMiniMap";
import QcDocumentList, { QcDocumentItem } from "../../../shared/QcDocumentList";
import { PermintaanPengujian } from "@/app/types/qc";
import { formatDateTime, formatNumber } from "@/app/lib/format";

interface LeftSidebarProps {
  data: PermintaanPengujian;
  onLihatDokumentasi: () => void;
}

/** Baris label + nilai berbingkai (gaya field baca-saja). */
const FieldRow = ({ label, children, copyValue }: { label: string; children: React.ReactNode; copyValue?: string | null }) => (
  <div className="grid grid-cols-[42%_58%] items-center gap-2">
    <span className="text-[11px] text-gray-500">{label}</span>
    <div className="min-h-[32px] px-2.5 py-1.5 border border-gray-200 rounded-md text-xs text-gray-800 flex items-center justify-between gap-1">
      <span className="truncate">{children || "-"}</span>
      {copyValue && (
        <button
          type="button"
          title="Salin"
          onClick={() => navigator.clipboard?.writeText(copyValue).then(() => toast.success("Disalin"))}
          className="text-gray-400 hover:text-emerald-600 shrink-0"
        >
          <i className="ri-file-copy-line"></i>
        </button>
      )}
    </div>
  </div>
);

const KONDISI_CLASS: Record<string, string> = {
  Baik: "bg-emerald-50 text-emerald-700",
  Cukup: "bg-amber-50 text-amber-700",
  Rusak: "bg-rose-50 text-rose-700",
};

const LeftSidebar = ({ data, onLihatDokumentasi }: LeftSidebarProps) => {
  // Lampiran permintaan + dokumen SOP metode uji tiap parameter (tanpa duplikat).
  const dokumenTerkait = useMemo<QcDocumentItem[]>(() => {
    const permintaanDocs = (data.dokumen || []).filter((d) => d.kategori !== "Dokumentasi");
    const sopDocs = (data.parameters || [])
      .filter((p) => p.checked)
      .flatMap((p) => (p.metodeRef?.dokumen || []).map((d) => ({ ...d, keterangan: `SOP ${p.metodeRef?.kode}` })));
    const seen = new Set<string>();
    return [...permintaanDocs, ...sopDocs].filter((d) => !seen.has(d.fileUrl) && !!seen.add(d.fileUrl));
  }, [data]);

  const lokasi = data.lokasiAsal;
  const posisi = lokasi?.posisi;

  return (
    <div className="space-y-4">
      <QcCard title="Informasi Sampel" icon="ri-file-list-3-line" bodyClassName="space-y-2.5">
        <FieldRow label="No. Sampel" copyValue={data.noSampel}>{data.noSampel}</FieldRow>
        <FieldRow label="Jumlah Sampel">
          {formatNumber(data.jumlahSampel)} {data.satuanSampel || ""}
        </FieldRow>
        <FieldRow label="Pengambil Sampel">{data.pengambilSampelRef?.nama || data.pengambilSampel}</FieldRow>
        <FieldRow label="Tanggal Pengambilan">
          {data.tanggalSampling ? (
            <span className="inline-flex items-center gap-1.5">
              <i className="ri-calendar-line text-emerald-600"></i> {formatDateTime(data.tanggalSampling)}
            </span>
          ) : null}
        </FieldRow>
        <div className="grid grid-cols-[42%_58%] items-center gap-2">
          <span className="text-[11px] text-gray-500">Kondisi Sampel</span>
          {data.kondisiSampel ? (
            <span
              className={`w-fit inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                KONDISI_CLASS[data.kondisiSampel] || "bg-gray-100 text-gray-700"
              }`}
            >
              <i className="ri-checkbox-circle-fill"></i> {data.kondisiSampel}
            </span>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
        <FieldRow label="Petugas QC">{data.petugasQc?.nama}</FieldRow>
        <button
          type="button"
          onClick={onLihatDokumentasi}
          className={`${buttonClass("outline", "md", "mt-1")} w-full`}
        >
          <i className="ri-image-line"></i> Lihat Dokumentasi
        </button>
      </QcCard>

      <QcCard title="Lokasi Asal Sampel" icon="ri-map-pin-line" bodyClassName="space-y-2.5">
        <FieldRow label="Lahan / Blok">{lokasi?.namaLahan || data.lahan}</FieldRow>
        <FieldRow label="Koordinat">
          {lokasi?.koordinat ? (
            <span className="inline-flex items-center gap-1.5">
              <i className="ri-map-pin-2-line text-blue-500"></i> {lokasi.koordinat}
            </span>
          ) : null}
        </FieldRow>
        {posisi ? (
          <>
            <div className="grid grid-cols-[42%_58%] gap-2">
              <span></span>
              <a
                href={`https://www.google.com/maps?q=${posisi.lat},${posisi.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("secondary", "sm", "w-fit")}
              >
                <i className="ri-map-2-line"></i> Lihat di Maps
              </a>
            </div>
            <QcMiniMap lat={posisi.lat} lng={posisi.lng} />
          </>
        ) : (
          <p className="text-[11px] text-gray-400 italic">Koordinat lahan belum tersedia di data master.</p>
        )}
      </QcCard>

      <QcCard title="Dokumen Terkait" icon="ri-folder-open-line">
        <QcDocumentList documents={dokumenTerkait} emptyMessage="Tidak ada lampiran atau SOP metode uji." />
      </QcCard>
    </div>
  );
};

export default LeftSidebar;
