"use client";

import React, { useEffect, useState } from 'react';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';
import { toDateInputValue } from '@/app/lib/format';

interface PeriodeRangePickerProps {
  value: { startDate: string; endDate: string };
  onChange: (value: { startDate: string; endDate: string }) => void;
}

const toDate = (v: string) => (v ? new Date(`${v}T00:00:00`) : null);

/** Pemilih rentang tanggal; perubahan baru diterapkan setelah tanggal awal & akhir lengkap. */
export default function PeriodeRangePicker({ value, onChange }: PeriodeRangePickerProps) {
  const [range, setRange] = useState<[Date | null, Date | null]>([toDate(value.startDate), toDate(value.endDate)]);

  useEffect(() => setRange([toDate(value.startDate), toDate(value.endDate)]), [value]);

  return (
    <div className="relative w-[230px]">
      <i className="ri-calendar-2-line absolute left-3 top-2.5 text-emerald-700 pointer-events-none z-10"></i>
      <SpkDatepickr
        className="form-control text-sm h-9 w-[230px] bg-white !pl-9"
        dateFormat="dd/MM/yyyy"
        selectsRange
        startDate={range[0]}
        endDate={range[1]}
        maxDate={new Date()}
        onChange={(next: [Date | null, Date | null]) => {
          setRange(next);
          if (next[0] && next[1]) onChange({ startDate: toDateInputValue(next[0]), endDate: toDateInputValue(next[1]) });
        }}
      />
    </div>
  );
}
