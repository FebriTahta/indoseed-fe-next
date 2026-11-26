"use client";

import React from 'react';
import QcReasonModal from './QcReasonModal';
import { ConfirmTone } from '@/app/(components)/(content-layout)/shared/ConfirmDialog';
import QcStatusBadge from './QcStatusBadge';

export type ReviewKeputusan = 'setujui' | 'revisi';

interface ReviewHasilModalProps {
  /** Keputusan yang sedang dikonfirmasi; `null` = modal tertutup. */
  keputusan: ReviewKeputusan | null;
  noPengujian?: string | null;
  hasilAkhir?: string | null;
  onClose: () => void;
  /** Kembalikan `true` bila berhasil agar modal ditutup. */
  onSubmit: (keputusan: ReviewKeputusan, catatan?: string) => Promise<boolean>;
}

const COPY: Record<
  ReviewKeputusan,
  { title: string; message: string; label: string; submitText: string; tone: ConfirmTone; icon: string }
> = {
  setujui: {
    title: 'Setujui Hasil Pengujian?',
    message: 'Hasil akan ditetapkan sebagai final dan status pengujian menjadi Selesai.',
    label: 'Catatan review (opsional)',
    submitText: 'Ya, Setujui',
    tone: 'success',
    icon: 'ri-check-double-line',
  },
  revisi: {
    title: 'Kembalikan untuk Revisi?',
    message: 'Pengujian dikembalikan ke analis untuk diperbaiki. Sertakan catatan apa yang perlu direvisi.',
    label: 'Catatan revisi',
    submitText: 'Kembalikan',
    tone: 'warning',
    icon: 'ri-arrow-go-back-line',
  },
};

/** Konfirmasi review hasil pengujian (setujui / kembalikan untuk revisi). */
export default function ReviewHasilModal({ keputusan, noPengujian, hasilAkhir, onClose, onSubmit }: ReviewHasilModalProps) {
  const copy = COPY[keputusan ?? 'setujui'];

  return (
    <QcReasonModal
      isOpen={keputusan !== null}
      title={copy.title}
      description={copy.message}
      tone={copy.tone}
      icon={copy.icon}
      details={
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold">{noPengujian || '-'}</span>
          <span className="flex items-center gap-1.5 text-gray-500">
            Kesimpulan <QcStatusBadge status={hasilAkhir} />
          </span>
        </div>
      }
      label={copy.label}
      submitText={copy.submitText}
      required={keputusan === 'revisi'}
      onClose={onClose}
      onSubmit={async (text) => {
        if (keputusan && (await onSubmit(keputusan, text || undefined))) onClose();
      }}
    />
  );
}
