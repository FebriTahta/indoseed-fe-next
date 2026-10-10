"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '@/app/(components)/(content-layout)/shared/ConfirmDialog';
import { iconButtonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import { AkunPenguji } from '@/app/types/penguji';

interface AkunPengujiModalProps {
  akun: AkunPenguji | null;
  /** Konteks tampilan, mis. "dibuat" setelah create atau "direset" setelah reset password. */
  context?: 'dibuat' | 'direset';
  onClose: () => void;
}

const CredentialRow = ({ label, value, secret }: { label: string; value: string; secret?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Gagal menyalin ke clipboard');
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className={`text-sm text-gray-900 break-all ${secret ? 'font-mono font-semibold tracking-wide' : 'font-medium'}`}>{value}</p>
      </div>
      <button type="button" onClick={copy} className={iconButtonClass(copied ? 'emerald' : 'gray')} title={`Salin ${label.toLowerCase()}`}>
        <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
      </button>
    </div>
  );
};

/** Menampilkan kredensial akun penguji satu kali — password tidak dapat dilihat lagi setelah ditutup. */
export default function AkunPengujiModal({ akun, context = 'dibuat', onClose }: AkunPengujiModalProps) {
  return (
    <ConfirmDialog
      open={akun !== null}
      tone="success"
      icon="ri-key-2-line"
      title={context === 'dibuat' ? 'Akun Penguji Berhasil Dibuat' : 'Password Berhasil Direset'}
      message="Bagikan kredensial berikut kepada penguji secara aman. Password sementara hanya ditampilkan sekali ini."
      confirmText="Saya Sudah Mencatat"
      cancelText="Tutup"
      onConfirm={onClose}
      onCancel={onClose}
    >
      {akun && (
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-1">
          <CredentialRow label="Username" value={akun.username} />
          <CredentialRow label="Email" value={akun.email} />
          <CredentialRow label="Password Sementara" value={akun.passwordSementara} secret />
        </div>
      )}
    </ConfirmDialog>
  );
}
