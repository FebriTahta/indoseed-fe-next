"use client";

import React, { useEffect, useId, useState } from 'react';
import { ConfirmDialog, ConfirmTone } from '@/app/(components)/(content-layout)/shared/ConfirmDialog';

interface QcReasonModalProps {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  /** Ringkasan objek yang dikonfirmasi (mis. nomor & batch). */
  details?: React.ReactNode;
  tone?: ConfirmTone;
  icon?: string;
  label?: string;
  placeholder?: string;
  submitText?: string;
  /** Wajib diisi minimal 3 karakter (mis. alasan penolakan / catatan revisi). */
  required?: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void> | void;
}

/** Modal konfirmasi dengan isian alasan/catatan — dipakai untuk setujui, tolak, revisi, dan uji ulang. */
export default function QcReasonModal({
  isOpen,
  title,
  description,
  details,
  tone = 'info',
  icon,
  label = 'Catatan',
  placeholder = 'Tulis catatan...',
  submitText = 'Simpan',
  required,
  onClose,
  onSubmit,
}: QcReasonModalProps) {
  const fieldId = useId();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText('');
      setError('');
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (required && text.trim().length < 3) {
      setError(`${label} wajib diisi (minimal 3 karakter)`);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(text.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfirmDialog
      open={isOpen}
      title={title}
      message={description}
      details={details}
      tone={tone}
      icon={icon}
      confirmText={submitText}
      loading={submitting}
      onConfirm={handleConfirm}
      onCancel={onClose}
    >
      <label htmlFor={fieldId} className="block text-xs font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        id={fieldId}
        rows={3}
        autoFocus
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
        }}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
          error ? 'border-rose-400' : 'border-gray-200'
        }`}
      />
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </ConfirmDialog>
  );
}
