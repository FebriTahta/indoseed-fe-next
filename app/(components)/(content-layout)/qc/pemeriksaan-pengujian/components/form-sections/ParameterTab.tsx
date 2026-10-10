import React, { useMemo } from "react";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import ParameterResultTable from "../../../shared/ParameterResultTable";
import QcStatusBadge from "../../../shared/QcStatusBadge";
import QcDocumentList, { isImageDoc } from "../../../shared/QcDocumentList";
import { useImageLightbox } from "../../../shared/QcImageLightbox";
import { useQcLookups } from "@/app/hooks/useQcReference";
import { PemeriksaanDetailState } from "@/app/hooks/usePemeriksaanDetail";
import { isNumericBatas } from "@/app/lib/batasAcuan";
import { formatDateTime } from "@/app/lib/format";

interface ParameterTabProps {
  state: PemeriksaanDetailState;
  hasilAkhirOptions: string[];
  onLihatDokumentasi: () => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] text-gray-500 mb-1">{children}</p>
);

/** Tab "Parameter Pengujian": tabel isian hasil + detail parameter terpilih. */
const ParameterTab = ({ state, hasilAkhirOptions, onLihatDokumentasi }: ParameterTabProps) => {
  const { activeParams, drafts, setParamDraft, statusOf, canInput, data } = state;
  // Kartu detail hanya untuk parameter uji perkecambahan (daftar nama dari master lookup).
  const { lookups } = useQcLookups(["PARAMETER_PERKECAMBAHAN"]);
  const selected = useMemo(() => {
    const names = (lookups.PARAMETER_PERKECAMBAHAN || []).map((l) => l.nama.trim().toLowerCase());
    return activeParams.find((p) => names.some((n) => p.nama.trim().toLowerCase().includes(n)));
  }, [lookups, activeParams]);
  const status = selected ? statusOf(selected) : null;
  const gagal = status === "Tidak Lulus";
  const draft = selected ? drafts[selected.id] : undefined;
  const satuan = selected?.satuan && selected.satuan !== "-" ? selected.satuan : "";
  const numeric = selected ? isNumericBatas(selected.batasAcuan ?? selected.standar) : false;
  const nilai = draft ? draft.nilaiHasil || draft.hasilTeks : selected?.nilaiHasil ?? selected?.hasilTeks ?? "";
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
        />
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
                <p>{selected.metodeRef ? `${selected.metodeRef.kode} – ${selected.metodeRef.nama}` : selected.metode || "-"}</p>
              </div>
              <div>
                <Label>Standar Acuan</Label>
                <p>{selected.metodeRef?.standar?.kode || "-"}</p>
              </div>
              <div>
                <Label>Standar</Label>
                <p>{selected.standar || "-"}</p>
              </div>
              <div>
                <Label>SOP</Label>
                <QcDocumentList documents={selected.metodeRef?.dokumen || []} emptyMessage="Belum ada SOP." />
              </div>
            </div>

            {/* Rincian hasil */}
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs font-semibold text-gray-800">Rincian Hasil</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Diuji Oleh</Label>
                  <div className="h-[34px] px-2.5 border border-gray-200 rounded-md text-xs flex items-center">{selected.diujiOleh || "-"}</div>
                </div>
                <div>
                  <Label>Tanggal Uji</Label>
                  <div className="h-[34px] px-2.5 border border-gray-200 rounded-md text-xs flex items-center">{formatDateTime(selected.tanggalUji)}</div>
                </div>
              </div>
              <div>
                <Label>Catatan Hasil</Label>
                {canInput ? (
                  <textarea
                    rows={4}
                    value={draft?.catatanHasil || ""}
                    onChange={(e) => setParamDraft(selected.id, { catatanHasil: e.target.value })}
                    placeholder="Rincian pengamatan, mis. jumlah benih diuji, benih normal/abnormal, mati, keras..."
                    aria-label={`Catatan hasil ${selected.nama}`}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                ) : (
                  <p className="text-xs text-gray-600 whitespace-pre-line border border-gray-100 rounded-md p-2 min-h-[60px]">
                    {selected.catatanHasil || "-"}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 mb-1">Hasil Akhir</p>
                <div className="flex">
                  {canInput && draft ? (
                    <input
                      type={numeric ? "number" : "text"}
                      step="any"
                      value={numeric ? draft.nilaiHasil : draft.hasilTeks}
                      onChange={(e) => setParamDraft(selected.id, numeric ? { nilaiHasil: e.target.value } : { hasilTeks: e.target.value })}
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
