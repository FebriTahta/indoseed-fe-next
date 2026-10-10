"use client";

import React, { useEffect, useState } from 'react';
import CrudModal from '@/app/(components)/(content-layout)/shared/CrudModal';

interface QcReasonModalProps {
  isOpen: boolean;
  title: string;
  description?: React.ReactNode;
  label?: string;
  placeholder?: string;
  submitText?: string;
  /** Wajib diisi minimal 3 karakter (mis. alasan penolakan / catatan revisi). */
  required?: boolean;
  onClose: () => void;
  onSubmit: (text: string) => Promise<void> | void;
}

/** Modal konfirmasi dengan isian alasan/catatan — dipakai untuk setujui, tolak, dan revisi. */
export default function QcReasonModal({
  isOpen,
  title,
  description,
  label = 'Catatan',
  placeholder = 'Tulis catatan...',
  submitText = 'Simpan',
  required,
  onClose,
  onSubmit,
}: QcReasonModalProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <CrudModal isOpen={isOpen} onClose={onClose} title={title} onSubmit={handleSubmit} submitText={submitText} isLoading={submitting}>
      {description && <div className="text-sm text-gray-600 mb-3">{description}</div>}
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError('');
        }}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-3 text-sm outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
          error ? 'border-rose-400' : 'border-gray-200'
        }`}
      />
      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </CrudModal>
  );
}
