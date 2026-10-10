import React, { useMemo, useState } from "react";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import ParameterResultTable from "../../../shared/ParameterResultTable";
import QcStatusBadge from "../../../shared/QcStatusBadge";
import QcDocumentList, { isImageDoc } from "../../../shared/QcDocumentList";
import { useImageLightbox } from "../../../shared/QcImageLightbox";
import { useQcLookups } from "@/app/hooks/useQcReference";
import { PemeriksaanDetailState } from "@/app/hooks/usePemeriksaanDetail";
import { isNumericBatas } from "@/app/lib/batasAcuan";
import {
  HARI_PENGAMATAN_OPTIONS,
  KATEGORI_BENIH,
  RincianDraft,
  RincianField,
  hitungDayaBerkecambah,
  isParameterPerkecambahan,
  toRincianDraft,
  toRincianPayload,
  totalBenih,
} from "@/app/lib/perkecambahan";

interface ParameterTabProps {
  state: PemeriksaanDetailState;
  hasilAkhirOptions: string[];
  onLihatDokumentasi: () => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] text-gray-500 mb-1">{children}</p>
);

const fieldClass =
  "w-full h-[36px] px-3 border border-gray-200 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:border-emerald-500";

/** Isian angka rincian (atau teks baca-saja bila tidak dalam mode input). */
const CountField = ({
  label,
  value,
  suffix,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  suffix?: string;
  editable: boolean;
  onChange: (v: string) => void;
}) => (
  <div>
    <Label>{label}</Label>
    <div className="relative">
      {editable ? (
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className={`${fieldClass} ${suffix ? "pr-12" : ""}`}
        />
      ) : (
        <div className={`${fieldClass} flex items-center`}>{value !== "" ? value : "-"}</div>
      )}
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

/** Tab "Parameter Pengujian": tabel isian hasil + detail parameter uji perkecambahan (daya berkecambah). */
const ParameterTab = ({ state, hasilAkhirOptions, onLihatDokumentasi }: ParameterTabProps) => {
  const { activeParams, drafts, setParamDraft, statusOf, canInput, data } = state;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Detail hanya untuk parameter uji perkecambahan (daftar nama dari master lookup).
  const { lookups } = useQcLookups(["PARAMETER_PERKECAMBAHAN"]);
  const perkecambahanNames = useMemo(
    () => (lookups.PARAMETER_PERKECAMBAHAN || []).map((l) => l.nama.trim().toLowerCase()),
    [lookups]
  );
  const perkecambahanParams = useMemo(
    () => activeParams.filter((p) => isParameterPerkecambahan(p.nama, perkecambahanNames)),
    [perkecambahanNames, activeParams]
  );
  const selected = perkecambahanParams.find((p) => p.id === selectedId) ?? perkecambahanParams[0];
  const status = selected ? statusOf(selected) : null;
  const gagal = status === "Tidak Lulus";
  const draft = selected ? drafts[selected.id] : undefined;
  const satuan = selected?.satuan && selected.satuan !== "-" ? selected.satuan : "";
  const numeric = selected ? isNumericBatas(selected.batasAcuan ?? selected.standar) : false;
  const nilai = draft ? draft.nilaiHasil || draft.hasilTeks : (selected?.nilaiHasil ?? selected?.hasilTeks ?? "");
  // Hasil akhir dihitung dari rincian: benih normal ÷ jumlah benih diuji.
  const rincian = draft?.rincian ?? toRincianDraft(selected?.rincianHasil);
  const rincianPayload = toRincianPayload(rincian);
  const jumlahBenih = rincianPayload?.jumlahBenih ?? null;
  const total = totalBenih(rincianPayload);
  const semuaKategoriTerisi = KATEGORI_BENIH.every(({ field }) => rincianPayload?.[field] != null);
  const totalTidakSesuai =
    jumlahBenih !== null && (total > jumlahBenih || (semuaKategoriTerisi && total !== jumlahBenih));
  const setRincian = (field: RincianField, value: string) => {
    if (!selected) return;
    const next: RincianDraft = { ...rincian, [field]: value };
    const daya = hitungDayaBerkecambah(toRincianPayload(next));
    setParamDraft(selected.id, {
      rincian: next,
      nilaiHasil: daya === null ? "" : String(daya),
    });
  };
  const fotos = (data?.dokumen || []).filter((d) => d.kategori === "Dokumentasi" && isImageDoc(d));
  const { open: openPreview, lightbox } = useImageLightbox(fotos);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <i className="ri-file-list-3-line"></i>
          </span>
          <div>
            <h5 className="font-semibold text-[#1B4E3B] text-sm mb-0">Parameter Pengujian</h5>
            <p className="text-[11px] text-gray-500">
              Hasil pengujian akan otomatis mengevaluasi kesesuaian terhadap standar mutu.
            </p>
          </div>
        </div>
        <ParameterResultTable
          parameters={activeParams}
          editable={canInput}
          drafts={drafts}
          onChangeDraft={setParamDraft}
          statusOf={statusOf}
          hasilAkhirOptions={hasilAkhirOptions}
          selectedId={selected?.id}
          onSelect={setSelectedId}
          isSelectable={(p) => perkecambahanParams.some((x) => x.id === p.id)}
        />
        {perkecambahanParams.length > 1 && (
          <p className="text-[10px] text-gray-400 mt-2">
            <i className="ri-cursor-line"></i> Klik baris parameter perkecambahan untuk melihat rincian dan SOP-nya.
          </p>
        )}
      </div>

      {selected && (
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-emerald-800 flex items-center gap-2 text-sm mb-0">
              <i className="ri-file-list-2-line text-emerald-600"></i> Detail Parameter: {selected.nama}
            </h3>
            <QcStatusBadge status={status} size="sm" emptyLabel="Belum diuji" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Informasi metode */}
            <div className="lg:col-span-3 space-y-3 text-xs text-gray-800">
              <div>
                <Label>Metode Uji</Label>
                <p>
                  {selected.metodeRef
                    ? `${selected.metodeRef.kode} – ${selected.metodeRef.nama}`
                    : selected.metode || "-"}
                </p>
              </div>
              <div>
                <Label>Standar Acuan</Label>
                <p>{selected.metodeRef?.standar?.kode || "-"}</p>
              </div>
              <div>
                <Label>Standar</Label>
                <p>{selected.standar || "-"}</p>
              </div>
              {selected.definisi && (
                <div>
                  <Label>Definisi</Label>
                  <p className="text-gray-600">{selected.definisi}</p>
                </div>
              )}
              <div>
                <Label>SOP</Label>
                <QcDocumentList documents={selected.metodeRef?.dokumen || []} emptyMessage="Belum ada SOP." />
              </div>
            </div>

            {/* Rincian hasil */}
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold text-gray-800">Rincian Hasil</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <CountField
                    label="Jumlah Benih Diuji"
                    value={rincian.jumlahBenih}
                    suffix="butir"
                    editable={canInput}
                    onChange={(v) => setRincian("jumlahBenih", v)}
                  />
                  <div>
                    <Label>Hari Pengamatan</Label>
                    {canInput ? (
                      <select
                        value={rincian.hariPengamatan}
                        onChange={(e) => setRincian("hariPengamatan", e.target.value)}
                        aria-label="Hari pengamatan"
                        className={fieldClass}
                      >
                        <option value="">Pilih hari</option>
                        {HARI_PENGAMATAN_OPTIONS.map((h) => (
                          <option key={h} value={h}>
                            Hari ke-{h}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className={`${fieldClass} flex items-center`}>
                        {rincian.hariPengamatan ? `Hari ke-${rincian.hariPengamatan}` : "-"}
                      </div>
                    )}
                  </div>
                  {KATEGORI_BENIH.map(({ field, label }) => (
                    <CountField
                      key={field}
                      label={label}
                      value={rincian[field]}
                      editable={canInput}
                      onChange={(v) => setRincian(field, v)}
                    />
                  ))}
                </div>
                {jumlahBenih !== null && (
                  <p className={`text-[11px] ${totalTidakSesuai ? "text-rose-600" : "text-gray-500"}`}>
                    <i className={totalTidakSesuai ? "ri-error-warning-line" : "ri-information-line"}></i> Total benih:{" "}
                    {total} / {jumlahBenih} butir
                    {totalTidakSesuai &&
                      " — total normal, abnormal, mati, dan keras harus sama dengan jumlah benih diuji."}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 mb-1">Hasil Akhir</p>
                <div className="flex">
                  {canInput && draft && !rincianPayload ? (
                    <input
                      type={numeric ? "number" : "text"}
                      step="any"
                      value={numeric ? draft.nilaiHasil : draft.hasilTeks}
                      onChange={(e) =>
                        setParamDraft(
                          selected.id,
                          numeric ? { nilaiHasil: e.target.value } : { hasilTeks: e.target.value }
                        )
                      }
                      aria-label={`Hasil akhir ${selected.nama}`}
                      className={`flex-1 min-w-0 h-[36px] px-3 border rounded-l-md text-sm font-semibold focus:outline-none ${
                        gagal ? "bg-rose-50 border-rose-200 text-rose-600" : "border-gray-200 text-gray-800"
                      }`}
                    />
                  ) : (
                    <div
                      className={`flex-1 h-[36px] px-3 border rounded-l-md text-sm font-semibold flex items-center ${
                        gagal ? "bg-rose-50 border-rose-200 text-rose-600" : "border-gray-200 text-gray-800"
                      }`}
                    >
                      {nilai !== "" ? nilai : "-"}
                    </div>
                  )}
                  <span className="h-[36px] px-3 border border-l-0 border-gray-200 bg-gray-50 rounded-r-md text-xs text-gray-500 flex items-center">
                    {satuan || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Peringatan & dokumentasi */}
            <div className="lg:col-span-4 space-y-3">
              {gagal && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex gap-2 text-[11px] text-rose-700">
                  <i className="ri-error-warning-line text-rose-500 text-base"></i>
                  <span>
                    <span className="font-medium">Nilai hasil tidak memenuhi standar.</span>
                    <br />
                    Standar: {selected.standar || "-"}
                  </span>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-800 mb-2">Dokumentasi</p>
                {fotos.length ? (
                  <div className="grid grid-cols-3 gap-2">
                    {fotos.slice(0, 3).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        title="Lihat pratinjau"
                        onClick={() => openPreview(f.fileUrl)}
                        className="aspect-square rounded-md overflow-hidden border border-gray-200 hover:ring-2 hover:ring-emerald-400"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.fileUrl} alt={f.keterangan || f.namaFile} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">Belum ada foto dokumentasi.</p>
                )}
                <button
                  type="button"
                  onClick={onLihatDokumentasi}
                  className={buttonClass("secondary", "md", "mt-2 w-full")}
                >
                  Lihat Semua ({(data?.dokumen || []).filter((d) => d.kategori === "Dokumentasi").length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {lightbox}
    </div>
  );
};

export default ParameterTab;
