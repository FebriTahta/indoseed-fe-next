import React from "react";
import QcStatusBadge from "./QcStatusBadge";
import { PermintaanPengujianParameter } from "@/app/types/qc";
import { isNumericBatas } from "@/app/lib/batasAcuan";
import { formatNumber } from "@/app/lib/format";
import type { ParamDraft } from "@/app/hooks/usePemeriksaanDetail";

interface ParameterResultTableProps {
  parameters: PermintaanPengujianParameter[];
  /** Mode input: kolom Hasil berupa isian. */
  editable?: boolean;
  drafts?: Record<string, ParamDraft>;
  onChangeDraft?: (paramId: string, patch: Partial<ParamDraft>) => void;
  statusOf?: (p: PermintaanPengujianParameter) => string | null;
  hasilAkhirOptions?: string[];
  /** Sembunyikan kolom Metode Uji & Standar Acuan (untuk panel sempit). */
  compact?: boolean;
  /** Klik baris untuk memilih parameter (mis. membuka detail). */
  selectedId?: string | null;
  onSelect?: (paramId: string) => void;
}

const satuanOf = (p: PermintaanPengujianParameter) => (p.satuan && p.satuan !== "-" ? p.satuan : "-");

/** Standar tanpa satuan (satuan punya kolom sendiri), mis. "≥ 85". */
const standarOf = (p: PermintaanPengujianParameter) => {
  const raw = (p.batasAcuan || p.standar || "").trim();
  if (!raw) return "-";
  return p.satuan && p.satuan !== "-" && raw.endsWith(p.satuan) ? raw.slice(0, -p.satuan.length).trim() : raw;
};

const th = "py-3 px-2.5 font-medium text-gray-600 border-b border-r border-gray-200 last:border-r-0";
const td = "py-2.5 px-2.5 border-r border-gray-100 last:border-r-0";

/** Tabel parameter pengujian beserta hasil & status kelulusan (isian atau baca saja). */
export default function ParameterResultTable({
  parameters,
  editable,
  drafts = {},
  onChangeDraft,
  statusOf = (p) => p.statusHasil || null,
  hasilAkhirOptions = [],
  compact,
  selectedId,
  onSelect,
}: ParameterResultTableProps) {
  const rows = parameters.filter((p) => p.checked);
  if (!rows.length) return <p className="text-xs text-gray-400 italic">Tidak ada parameter pengujian.</p>;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-[11px]">
        <thead className="bg-slate-50">
          <tr>
            <th className={`${th} w-12 text-center`}>No</th>
            <th className={th}>Parameter</th>
            {!compact && <th className={th}>Metode Uji</th>}
            {!compact && <th className={th}>Standar Acuan</th>}
            <th className={th}>Standar</th>
            <th className={`${th} text-center`}>Hasil</th>
            <th className={th}>Satuan</th>
            <th className={th}>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-700">
          {rows.map((p, idx) => {
            const draft = drafts[p.id];
            const status = statusOf(p);
            const gagal = status === "Tidak Lulus";
            const numeric = isNumericBatas(p.batasAcuan ?? p.standar);
            const inputClass = `w-16 border rounded-md px-2 py-1.5 text-center text-xs focus:outline-none focus:ring-1 ${
              gagal
                ? "border-amber-300 text-rose-600 focus:ring-rose-400"
                : "border-gray-200 text-blue-600 focus:ring-emerald-500"
            }`;

            return (
              <tr
                key={p.id}
                onClick={onSelect ? () => onSelect(p.id) : undefined}
                className={`${onSelect ? "cursor-pointer" : ""} ${
                  selectedId === p.id ? "bg-emerald-50/70" : gagal ? "bg-rose-50/30" : "hover:bg-gray-50/60"
                }`}
              >
                <td className={`${td} text-center`}>{idx + 1}</td>
                <td className={td}>{p.nama}</td>
                {!compact && <td className={td}>{p.metodeRef?.kode || p.metodeKode || "-"}</td>}
                {!compact && <td className={td}>{p.metodeRef?.standar?.kode || "-"}</td>}
                <td className={`${td} whitespace-nowrap`}>{standarOf(p)}</td>
                <td className={`${td} text-center`}>
                  {editable && draft && onChangeDraft ? (
                    numeric ? (
                      <input
                        type="number"
                        step="any"
                        value={draft.nilaiHasil}
                        onChange={(e) => onChangeDraft(p.id, { nilaiHasil: e.target.value })}
                        onFocus={() => onSelect?.(p.id)}
                        aria-label={`Hasil ${p.nama}`}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        type="text"
                        value={draft.hasilTeks}
                        onChange={(e) => onChangeDraft(p.id, { hasilTeks: e.target.value })}
                        placeholder="Hasil"
                        aria-label={`Hasil ${p.nama}`}
                        className={`${inputClass} w-28`}
                      />
                    )
                  ) : (
                    <span className={`font-semibold ${gagal ? "text-rose-600" : "text-gray-800"}`}>
                      {p.nilaiHasil !== null && p.nilaiHasil !== undefined ? formatNumber(p.nilaiHasil) : p.hasilTeks || "-"}
                    </span>
                  )}
                </td>
                <td className={td}>{satuanOf(p)}</td>
                <td className={td}>
                  {editable && !numeric && onChangeDraft ? (
                    <select
                      value={draft?.statusHasil || ""}
                      onChange={(e) => onChangeDraft(p.id, { statusHasil: e.target.value })}
                      aria-label={`Status ${p.nama}`}
                      className="border border-gray-200 rounded-md px-1.5 py-1 text-xs"
                    >
                      <option value="">Pilih</option>
                      {hasilAkhirOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <QcStatusBadge status={status} size="sm" emptyLabel="Belum diuji" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
