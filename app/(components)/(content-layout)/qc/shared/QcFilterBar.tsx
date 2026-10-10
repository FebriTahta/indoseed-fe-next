"use client";

import React, { useEffect, useState } from 'react';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';
import { buttonClass } from '@/app/(components)/(content-layout)/shared/buttonStyles';
import FilterField from '@/app/(components)/(content-layout)/shared/FilterField';
import QcSelect from './QcSelect';
import { SelectOption } from '@/app/types/qc';
import { toDateInputValue } from '@/app/lib/format';

type StringKeys<F> = { [K in keyof F]: F[K] extends string ? K : never }[keyof F] & string;

interface BaseField {
  label: string;
  /** Porsi lebar relatif terhadap field lain dalam satu baris (default 1). */
  grow?: number;
}

export type QcFilterField<F> =
  | (BaseField & { type: 'search'; key: StringKeys<F>; placeholder?: string })
  | (BaseField & { type: 'select'; key: StringKeys<F>; options: SelectOption[]; placeholder?: string; loading?: boolean })
  | (BaseField & { type: 'dateRange'; startKey: StringKeys<F>; endKey: StringKeys<F>; placeholder?: string });

interface QcFilterBarProps<F extends object> {
  /** Prefix id elemen agar unik bila ada lebih dari satu bar filter. */
  id: string;
  value: F;
  fields: QcFilterField<F>[];
  onApply: (filters: F) => void;
  onReset: () => void;
}

const toDate = (v: string) => (v ? new Date(`${v}T00:00:00`) : null);

/**
 * Bar filter standar halaman QC: field label di atas, tombol Reset & Terapkan di kanan,
 * selalu satu baris di layar desktop (field menyusut proporsional). Perubahan disimpan sebagai
 * draft dan baru diterapkan saat "Terapkan" / Enter.
 */
export default function QcFilterBar<F extends object>({ id, value, fields, onApply, onReset }: QcFilterBarProps<F>) {
  const [draft, setDraft] = useState<F>(value);

  // Sinkronkan draft bila filter terapan berubah dari luar (mis. reset).
  useEffect(() => setDraft(value), [value]);

  const get = (key: StringKeys<F>) => (draft[key] as unknown as string) || '';
  const set = (patch: Partial<Record<StringKeys<F>, string>>) => setDraft((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = { ...draft };
    fields.forEach((f) => {
      if (f.type === 'search') (trimmed as Record<string, unknown>)[f.key] = get(f.key).trim();
    });
    onApply(trimmed);
  };

  const renderControl = (field: QcFilterField<F>, fieldId: string) => {
    switch (field.type) {
      case 'search':
        return (
          <div className="relative">
            <input
              id={fieldId}
              type="search"
              value={get(field.key)}
              onChange={(e) => set({ [field.key]: e.target.value } as Partial<Record<StringKeys<F>, string>>)}
              placeholder={field.placeholder}
              className="form-control text-sm h-[38px] w-full pr-9"
            />
            <i className="ri-search-line absolute right-3 top-2.5 text-gray-400 pointer-events-none"></i>
          </div>
        );
      case 'select':
        return (
          <QcSelect
            id={fieldId}
            options={field.options}
            value={get(field.key) || null}
            onChange={(v) => set({ [field.key]: v || '' } as Partial<Record<StringKeys<F>, string>>)}
            placeholder={field.placeholder}
            isLoading={field.loading}
            isClearable
          />
        );
      case 'dateRange': {
        const start = get(field.startKey);
        return (
          <div className="relative">
            <SpkDatepickr
              id={fieldId}
              className="form-control text-sm h-[38px] w-full bg-white pr-8"
              placeholderText={field.placeholder}
              dateFormat="dd/MM/yyyy"
              selectsRange
              startDate={toDate(start)}
              endDate={toDate(get(field.endKey))}
              onChange={([s, e]: [Date | null, Date | null]) =>
                set({ [field.startKey]: s ? toDateInputValue(s) : '', [field.endKey]: e ? toDateInputValue(e) : '' } as Partial<
                  Record<StringKeys<F>, string>
                >)
              }
              isClearable
            />
            {!start && <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400 pointer-events-none"></i>}
          </div>
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box border border-defaultborder/60 bg-white shadow-sm rounded-md mb-4">
      <div className="box-body p-4 flex flex-wrap lg:flex-nowrap items-end gap-3">
        {fields.map((field) => {
          const key = field.type === 'dateRange' ? field.startKey : field.key;
          const fieldId = `${id}-${key}`;
          return (
            <FilterField
              key={key}
              label={field.label}
              htmlFor={fieldId}
              className="min-w-0 basis-full sm:basis-[calc(50%-0.375rem)] lg:basis-0"
              style={{ flexGrow: field.grow ?? 1 }}
            >
              {renderControl(field, fieldId)}
            </FilterField>
          );
        })}
        <div className="flex gap-2 shrink-0 basis-full sm:basis-auto">
          <button type="button" onClick={onReset} className={buttonClass('secondary', 'md', '!h-[38px]')}>
            Reset
          </button>
          <button type="submit" className={buttonClass('primary', 'md', '!h-[38px]')}>
            <i className="ri-filter-3-line"></i> Terapkan
          </button>
        </div>
      </div>
    </form>
  );
}
