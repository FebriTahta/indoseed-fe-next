"use client";

import React, { useState } from "react";
import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { PermintaanPengujian, QC_STATUS } from "@/app/types/qc";
import QcReasonModal from "./QcReasonModal";

interface BukaUlangPengujianButtonProps {
  data: PermintaanPengujian;
  /** Kembalikan `true` bila berhasil. */
  onUjiUlang: (alasan: string) => Promise<boolean>;
  busy?: boolean;
  className?: string;
}

/**
 * Aksi superadmin untuk mengembalikan hasil yang terlanjur dikirim / diselesaikan padahal
 * pengujiannya belum tuntas, agar penguji dapat menguji ulang. Hasil tidak valid (parameter
 * kosong) sudah ditangani tombol "Uji Ulang" pada ParameterBelumDiujiAlert.
 */
export default function BukaUlangPengujianButton({ data, onUjiUlang, busy, className = "" }: BukaUlangPengujianButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { isSuperadmin } = useCurrentUser();

  const sudahDiajukan = data.status === QC_STATUS.MENUNGGU_REVIEW || data.status === QC_STATUS.SELESAI;
  if (!isSuperadmin || !sudahDiajukan || data.hasilTidakValid) return null;

  return (
    <>
      <button type="button" disabled={busy} onClick={() => setConfirming(true)} className={buttonClass("danger", "md", className)}>
        <i className="ri-restart-line"></i> Buka Ulang Pengujian
      </button>
      <QcReasonModal
        isOpen={confirming}
        title="Buka Ulang Pengujian?"
        description="Status dikembalikan ke Dalam Pengujian dan kesimpulan serta review dihapus. Nilai yang sudah terisi tetap tersimpan sehingga penguji dapat memperbaiki lalu submit kembali."
        details={<>No. Pengujian: <strong>{data.noPengujian || data.noPermintaan}</strong> · Status saat ini: <strong>{data.status}</strong></>}
        tone="danger"
        icon="ri-restart-line"
        label="Alasan pengujian ulang"
        placeholder="Mis. pengamatan daya berkecambah belum selesai saat hasil diajukan"
        submitText="Buka Ulang"
        required
        onClose={() => setConfirming(false)}
        onSubmit={async (alasan) => {
          if (await onUjiUlang(alasan)) setConfirming(false);
        }}
      />
    </>
  );
}
