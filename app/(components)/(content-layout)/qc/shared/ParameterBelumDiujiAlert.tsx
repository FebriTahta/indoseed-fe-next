"use client";

import React, { useState } from "react";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import QcReasonModal from "./QcReasonModal";

interface ParameterBelumDiujiAlertProps {
  parameters: { id: string; nama: string }[];
  /**
   * belum-lengkap = masih tahap pengujian, submit diblokir.
   * tidak-valid   = terlanjur dikirim / selesai, perlu pengujian ulang.
   */
  variant: "belum-lengkap" | "tidak-valid";
  /** Hanya untuk `tidak-valid`; kembalikan `true` bila berhasil. Tanpa ini tombol uji ulang disembunyikan. */
  onUjiUlang?: (alasan: string) => Promise<boolean>;
  busy?: boolean;
  className?: string;
}

const COPY = {
  "belum-lengkap": {
    title: "Pengujian belum lengkap",
    description: "Hasil belum dapat disubmit / diselesaikan sampai semua parameter berikut diisi nilai dan status hasilnya:",
    tone: "border-amber-200 bg-amber-50 text-amber-800",
    icon: "ri-information-line text-amber-500",
  },
  "tidak-valid": {
    title: "Hasil pengujian tidak valid",
    description: "Pengujian sudah dikirim / diselesaikan padahal parameter berikut belum diuji, sehingga hasil tidak dapat disetujui:",
    tone: "border-red-200 bg-red-50 text-red-800",
    icon: "ri-error-warning-line text-red-500",
  },
} as const;

/** Peringatan parameter uji yang belum diisi, dengan aksi "Uji Ulang" untuk hasil tidak valid. */
export default function ParameterBelumDiujiAlert({ parameters, variant, onUjiUlang, busy, className = "" }: ParameterBelumDiujiAlertProps) {
  const [confirming, setConfirming] = useState(false);
  const copy = COPY[variant];
  const showUjiUlang = variant === "tidak-valid" && onUjiUlang;

  return (
    <div className={`p-3 rounded-xl border text-xs flex flex-wrap items-start gap-3 ${copy.tone} ${className}`} role="alert">
      <i className={`${copy.icon} text-base leading-none mt-0.5`}></i>
      <div className="flex-1 min-w-[200px]">
        <p className="font-semibold">{copy.title}</p>
        <p className="mt-0.5">
          {parameters.length ? copy.description : "Belum ada parameter uji yang dipilih untuk sampel ini."}
        </p>
        {parameters.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-1">
            {parameters.map((p) => (
              <li key={p.id} className="px-1.5 py-0.5 rounded bg-white/70 border border-black/10 font-medium">
                {p.nama}
              </li>
            ))}
          </ul>
        )}
      </div>
      {showUjiUlang && (
        <button type="button" disabled={busy} onClick={() => setConfirming(true)} className={buttonClass("danger", "sm", "shrink-0")}>
          <i className="ri-restart-line"></i> Uji Ulang
        </button>
      )}

      {showUjiUlang && (
        <QcReasonModal
          isOpen={confirming}
          title="Lakukan Pengujian Ulang?"
          description="Status dikembalikan ke Dalam Pengujian. Nilai yang sudah terisi tetap tersimpan; lengkapi parameter yang belum diuji lalu submit kembali."
          details={<>Parameter belum diuji: <strong>{parameters.map((p) => p.nama).join(", ") || "-"}</strong></>}
          tone="danger"
          icon="ri-restart-line"
          label="Alasan pengujian ulang"
          placeholder="Mis. parameter daya berkecambah belum diuji"
          submitText="Uji Ulang"
          required
          onClose={() => setConfirming(false)}
          onSubmit={async (alasan) => {
            if (await onUjiUlang(alasan)) setConfirming(false);
          }}
        />
      )}
    </div>
  );
}
