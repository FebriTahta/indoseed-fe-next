import React from "react";
import QcCard from "../../../shared/QcCard";
import QcSelect from "../../../shared/QcSelect";
import { SelectOption } from "@/app/types/qc";

export interface SampleInfoValue {
  jumlahSampel: string;
  satuanSampel: string;
  metodeSampling: string;
  pengambilSampelId: string;
}

interface SampleInfoCardProps {
  value: SampleInfoValue;
  onChange: (patch: Partial<SampleInfoValue>) => void;
  satuanOptions: SelectOption[];
  metodeSamplingOptions: SelectOption[];
  pengambilOptions: SelectOption[];
  loadingPengambil?: boolean;
}

export default function SampleInfoCard({
  value,
  onChange,
  satuanOptions,
  metodeSamplingOptions,
  pengambilOptions,
  loadingPengambil,
}: SampleInfoCardProps) {
  return (
    <QcCard title="Informasi Sampel" icon="ri-flask-line" bodyClassName="space-y-4">
      <div>
        <label htmlFor="input-jumlah-sampel" className="block text-xs font-medium text-gray-700 mb-1">
          Jumlah Sampel <span className="text-rose-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            id="input-jumlah-sampel"
            type="number"
            min={0}
            step="any"
            value={value.jumlahSampel}
            onChange={(e) => onChange({ jumlahSampel: e.target.value })}
            className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Contoh: 500"
          />
          <select
            aria-label="Satuan sampel"
            value={value.satuanSampel}
            onChange={(e) => onChange({ satuanSampel: e.target.value })}
            className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-2 text-sm text-gray-600 outline-none"
          >
            {satuanOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="select-metode-sampling" className="block text-xs font-medium text-gray-700 mb-1">
          Metode Pengambilan <span className="text-rose-500">*</span>
        </label>
        <QcSelect
          id="select-metode-sampling"
          options={metodeSamplingOptions}
          value={value.metodeSampling}
          onChange={(v) => onChange({ metodeSampling: v || "" })}
        />
      </div>

      <div>
        <label htmlFor="select-pengambil-sampel" className="block text-xs font-medium text-gray-700 mb-1">
          Pengambil Sampel <span className="text-rose-500">*</span>
        </label>
        <QcSelect
          id="select-pengambil-sampel"
          options={pengambilOptions}
          value={value.pengambilSampelId}
          onChange={(v) => onChange({ pengambilSampelId: v || "" })}
          isLoading={loadingPengambil}
          placeholder="Pilih petugas penguji..."
          noOptionsMessage="Belum ada data penguji aktif"
        />
        <p className="mt-1 text-[11px] text-gray-500">
          Penguji ini yang akan menerima sampel dan melakukan pengujian, sehingga harus menguasai semua metode uji yang dipilih.
        </p>
      </div>
    </QcCard>
  );
}
