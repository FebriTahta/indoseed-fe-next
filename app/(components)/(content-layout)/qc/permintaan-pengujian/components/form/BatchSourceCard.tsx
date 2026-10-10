import React, { useMemo } from "react";
import QcCard, { QcInfoList } from "../../../shared/QcCard";
import QcSelect from "../../../shared/QcSelect";
import { BatchOption } from "@/app/types/qc";
import { formatDate } from "@/app/lib/format";

interface BatchSourceCardProps {
  batches: BatchOption[];
  value: string | null;
  onChange: (batchId: string | null) => void;
  loading?: boolean;
  disabled?: boolean;
}

/** Pilih batch produksi yang belum pernah diajukan pengujian + info asal panennya. */
export default function BatchSourceCard({ batches, value, onChange, loading, disabled }: BatchSourceCardProps) {
  const options = useMemo(
    () => batches.map((b) => ({ value: b.id, label: `${b.kodeBatch} — ${b.komoditas} (${b.varietas})` })),
    [batches]
  );
  const selected = batches.find((b) => b.id === value);

  return (
    <QcCard
      title="Sumber Batch"
      icon="ri-archive-line"
      action={
        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-100">
          {loading ? "Memuat..." : `${batches.length} batch tersedia`}
        </span>
      }
    >
      <label htmlFor="select-permintaan-batch" className="block text-xs font-medium text-gray-700 mb-1">
        Pilih Batch <span className="text-rose-500">*</span>
      </label>
      <QcSelect
        id="select-permintaan-batch"
        options={options}
        value={value}
        onChange={(v) => onChange(v)}
        isLoading={loading}
        isDisabled={disabled}
        placeholder="Pilih atau cari batch..."
        noOptionsMessage="Tidak ada batch yang belum diajukan pengujian"
      />

      {!loading && batches.length === 0 && (
        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
          <i className="ri-alert-line text-amber-600 text-sm mt-0.5"></i>
          <span>Semua batch produksi sudah memiliki permintaan pengujian atau belum ada batch baru.</span>
        </div>
      )}

      <div className="mt-3">
        {selected ? (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <QcInfoList
              items={[
                { label: "Komoditas", value: selected.komoditas },
                { label: "Varietas", value: selected.varietas },
                { label: "Status Batch", value: selected.status },
                { label: "Kode Panen", value: selected.asalPanen?.kodePanen || selected.sumberBahan },
                { label: "Petani Mitra", value: selected.asalPanen?.petani },
                { label: "Lahan / Blok", value: selected.asalPanen?.lahan || selected.lokasi },
                { label: "Tanggal Panen", value: formatDate(selected.asalPanen?.tanggalPanen) },
              ]}
            />
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200 border-dashed text-gray-400 text-xs">
            Pilih batch untuk melihat detail informasi
          </div>
        )}
      </div>
    </QcCard>
  );
}
