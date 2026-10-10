"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { SelectOption } from '@/app/types/qc';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => <div className="h-[38px] w-full rounded-md border border-gray-200 bg-gray-50 animate-pulse" />,
});

interface QcSelectProps {
  id: string;
  options: SelectOption[];
  value?: string | null;
  onChange: (value: string | null, option: SelectOption | null) => void;
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
  className?: string;
  formatOptionLabel?: (option: SelectOption) => React.ReactNode;
}

/**
 * Select tunggal berbasis react-select dengan nilai berupa string (bukan objek option),
 * sehingga form cukup menyimpan id/kode dan label selalu diambil dari data master.
 */
export default function QcSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  isLoading,
  isDisabled,
  isClearable,
  noOptionsMessage = 'Data tidak tersedia',
  className = 'text-sm',
  formatOptionLabel,
}: QcSelectProps) {
  const selected = options.find((o) => o.value === value) || (value ? { value, label: value } : null);

  return (
    <ReactSelect
      instanceId={id}
      inputId={id}
      className={className}
      classNamePrefix="react-select"
      options={options}
      value={selected}
      onChange={(opt: any) => onChange(opt?.value ?? null, opt ?? null)}
      placeholder={isLoading ? 'Memuat...' : placeholder}
      isLoading={isLoading}
      isDisabled={isDisabled}
      isClearable={isClearable}
      noOptionsMessage={() => noOptionsMessage}
      formatOptionLabel={formatOptionLabel as any}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      styles={{ menuPortal: (base: any) => ({ ...base, zIndex: 10000 }) }}
    />
  );
}
