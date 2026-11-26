import React from 'react';

interface FilterFieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/** Label kecil di atas kontrol filter (select, tanggal, pencarian) pada bar filter halaman. */
export default function FilterField({ label, htmlFor, className = '', style, children }: FilterFieldProps) {
  return (
    <div className={className} style={style}>
      <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-600 mb-1 truncate">
        {label}
      </label>
      {children}
    </div>
  );
}
