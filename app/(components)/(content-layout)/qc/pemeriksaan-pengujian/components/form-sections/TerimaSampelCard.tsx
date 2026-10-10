"use client";

import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import QcCard from "../../../shared/QcCard";
import QcSelect from "../../../shared/QcSelect";
import { useLaboratoriumOptions, usePengujiOptions, useQcLookups } from "@/app/hooks/useQcReference";
import { TerimaSampelPayload } from "@/app/services/pemeriksaanPengujianService";
import { PermintaanPengujian } from "@/app/types/qc";
import { toDateInputValue } from "@/app/lib/format";

interface TerimaSampelCardProps {
  data: PermintaanPengujian;
  busy: boolean;
  onSubmit: (payload: TerimaSampelPayload) => Promise<boolean>;
}

/** Tahap Sampling: lab menerima sampel, menetapkan petugas QC, lalu pengujian dimulai. */
export default function TerimaSampelCard({ data, busy, onSubmit }: TerimaSampelCardProps) {
  const { penguji, options: pengujiOptions, loading: loadingPenguji } = usePengujiOptions();
  const { options: labOptions, loading: loadingLab } = useLaboratoriumOptions();
  const { options: lookupOptions, loading: loadingLookup } = useQcLookups(["KONDISI_SAMPEL"]);

  const [form, setForm] = useState({
    petugasQcId: data.pengambilSampelId || "",
    laboratoriumId: "",
    tanggalSampling: toDateInputValue(),
    kondisiSampel: "",
    catatan: "",
  });

  // Default kondisi = opsi pertama master; laboratorium mengikuti petugas terpilih.
  useEffect(() => {
    if (!loadingLookup) setForm((f) => ({ ...f, kondisiSampel: f.kondisiSampel || lookupOptions("KONDISI_SAMPEL")[0]?.value || "" }));
  }, [loadingLookup, lookupOptions]);

  useEffect(() => {
    const labId = penguji.find((p) => p.id === form.petugasQcId)?.laboratoriumId;
    if (labId) setForm((f) => ({ ...f, laboratoriumId: labId }));
  }, [form.petugasQcId, penguji]);

  const handleSubmit = async () => {
    if (!form.petugasQcId || !form.tanggalSampling || !form.kondisiSampel) {
      toast.warning("Lengkapi petugas QC, tanggal sampling, dan kondisi sampel");
      return;
    }
    await onSubmit({
      petugasQcId: form.petugasQcId,
      laboratoriumId: form.laboratoriumId || null,
      tanggalSampling: form.tanggalSampling,
      kondisiSampel: form.kondisiSampel,
      catatan: form.catatan.trim() || null,
    });
  };

  return (
    <QcCard
      title="Penerimaan Sampel"
      icon="ri-inbox-archive-line"
      className="border-emerald-200"
      action={<span className="text-[11px] text-gray-500">Nomor pengujian & sampel terbit otomatis</span>}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-1">
          <label htmlFor="select-petugas-qc" className="block text-xs font-medium text-gray-700 mb-1">
            Petugas QC <span className="text-rose-500">*</span>
          </label>
          <QcSelect
            id="select-petugas-qc"
            options={pengujiOptions}
            value={form.petugasQcId}
            onChange={(v) => setForm((f) => ({ ...f, petugasQcId: v || "" }))}
            isLoading={loadingPenguji}
          />
        </div>
        <div>
          <label htmlFor="select-laboratorium" className="block text-xs font-medium text-gray-700 mb-1">
            Laboratorium
          </label>
          <QcSelect
            id="select-laboratorium"
            options={labOptions}
            value={form.laboratoriumId}
            onChange={(v) => setForm((f) => ({ ...f, laboratoriumId: v || "" }))}
            isLoading={loadingLab}
            isClearable
          />
        </div>
        <div>
          <label htmlFor="input-tgl-sampling" className="block text-xs font-medium text-gray-700 mb-1">
            Tanggal Sampling <span className="text-rose-500">*</span>
          </label>
          <input
            id="input-tgl-sampling"
            type="date"
            value={form.tanggalSampling}
            onChange={(e) => setForm((f) => ({ ...f, tanggalSampling: e.target.value }))}
            className="w-full h-[38px] border border-gray-200 rounded-md px-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="select-kondisi" className="block text-xs font-medium text-gray-700 mb-1">
            Kondisi Sampel <span className="text-rose-500">*</span>
          </label>
          <QcSelect
            id="select-kondisi"
            options={lookupOptions("KONDISI_SAMPEL")}
            value={form.kondisiSampel}
            onChange={(v) => setForm((f) => ({ ...f, kondisiSampel: v || "" }))}
            isLoading={loadingLookup}
          />
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={handleSubmit}
          className={buttonClass("primary", "md", "!h-[38px]")}
        >
          <i className="ri-play-circle-line text-base"></i> Terima & Mulai Uji
        </button>
      </div>
      <input
        type="text"
        value={form.catatan}
        onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
        placeholder="Catatan penerimaan sampel (opsional)"
        className="mt-3 w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
        aria-label="Catatan penerimaan sampel"
      />
    </QcCard>
  );
}
