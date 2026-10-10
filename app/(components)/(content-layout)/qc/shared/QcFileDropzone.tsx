"use client";

import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

interface QcFileDropzoneProps {
  onSelect: (file: File) => void;
  accept?: string;
  maxSizeMb?: number;
  hint?: string;
  disabled?: boolean;
  compact?: boolean;
}

/** Area unggah file (klik atau drag & drop) dengan validasi ukuran. */
export default function QcFileDropzone({
  onSelect,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp',
  maxSizeMb = 10,
  hint = 'PDF, DOCX, XLSX, JPG, PNG',
  disabled,
  compact,
}: QcFileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Ukuran file maksimal ${maxSizeMb} MB`);
      return;
    }
    onSelect(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFile(e.dataTransfer.files?.[0]);
      }}
      className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors ${
        compact ? 'p-4' : 'p-8'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'} ${
        dragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <i className={`ri-upload-cloud-2-line text-emerald-600 ${compact ? 'text-2xl' : 'text-3xl mb-2'}`}></i>
      <p className="text-sm font-medium text-gray-800">Klik untuk unggah atau drag & drop file</p>
      <p className="text-xs text-gray-500">
        {hint} (maks. {maxSizeMb} MB)
      </p>
    </div>
  );
}
