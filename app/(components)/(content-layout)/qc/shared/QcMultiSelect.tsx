"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { SelectOption } from '@/app/types/qc';

const ReactSelect = dynamic(() => import('react-select'), {
  ssr: false,
  loading: () => <div className="h-[38px] w-full rounded-md border border-gray-200 bg-gray-50 animate-pulse" />,
});

interface QcMultiSelectProps {
  id: string;
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  invalid?: boolean;
  noOptionsMessage?: string;
}

/** Pilihan ganda berbasis react-select dengan nilai berupa array string (id/kode). */
export default function QcMultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Pilih...',
  isLoading,
  isDisabled,
  invalid,
  noOptionsMessage = 'Data tidak tersedia',
}: QcMultiSelectProps) {
  const selected = options.filter((o) => value.includes(o.value));

  return (
    <ReactSelect
      isMulti
      instanceId={id}
      inputId={id}
      className="text-sm"
      classNamePrefix="react-select"
      options={options}
      value={selected}
      onChange={(opts: any) => onChange((opts || []).map((o: SelectOption) => o.value))}
      placeholder={isLoading ? 'Memuat...' : placeholder}
      isLoading={isLoading}
      isDisabled={isDisabled}
      closeMenuOnSelect={false}
      noOptionsMessage={() => noOptionsMessage}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      styles={{
        menuPortal: (base: any) => ({ ...base, zIndex: 10001 }),
        control: (base: any) => (invalid ? { ...base, borderColor: '#fb7185' } : base),
      }}
    />
  );
}
