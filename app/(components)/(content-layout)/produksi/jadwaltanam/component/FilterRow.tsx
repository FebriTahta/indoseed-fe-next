import React, { useState } from 'react';
import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';

export interface FilterSelectConfig {
  value: any;
  onChange: (val: any) => void;
  options: { value: any; label: string }[];
  placeholder: string;
  title?: string;
  widthClass?: string;
  type?: 'date' | 'opsi';
}

interface FilterRowProps {
  search?: string;
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
  searchTitle?: string;
  selectFilters: FilterSelectConfig[];
  onSearch: () => void;
  onReset: () => void;
}

export default function FilterRow({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  searchTitle,
  selectFilters,
  onSearch,
  onReset,
}: FilterRowProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(2026, 5, 1),
    new Date(2026, 5, 30)
  ]);
  const [startDate, endDate] = dateRange;

  const handleReset = () => {
    setDateRange([new Date(2026, 5, 1), new Date(2026, 5, 30)]);
    onReset();
  };

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg mb-6">
      <div className="box-body p-4 flex flex-wrap items-end justify-between gap-3">
        {/* Controls Container */}
        <div className="flex flex-wrap items-end gap-3 flex-1">
          {onSearchChange && (
            <div className="flex flex-col gap-1 min-w-[180px] sm:w-52 flex-1 sm:flex-initial">
              {searchTitle && (
                <label className="text-xs text-gray-600 font-medium mb-0">
                  {searchTitle}
                </label>
              )}
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={search || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="form-control text-xs border border-gray-300 rounded-md py-1.5 px-3 pr-8 w-full font-medium text-gray-700 bg-white"
                />
                <i className="ri-search-line absolute right-2.5 text-gray-400 text-xs pointer-events-none z-10"></i>
              </div>
            </div>
          )}

          {selectFilters.map((config, index) => (
            <div key={index} className={`flex flex-col gap-1 ${config.widthClass || 'min-w-[120px]'} flex-1 sm:flex-initial`}>
              {config.title && (
                <label className="text-xs text-gray-600 font-medium mb-0">
                  {config.title}
                </label>
              )}
              {config.type === 'date' ? (
                <div className="relative flex items-center">
                  <SpkDatepickr
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update: [Date | null, Date | null]) => {
                      setDateRange(update);
                      if (config.onChange) {
                        config.onChange(update);
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="01/06/2026 - 30/06/2026"
                    className="form-control text-xs border border-gray-300 rounded-md py-1.5 px-3 pr-8 w-full font-medium text-gray-700 bg-white"
                  />
                  <i className="ri-calendar-line absolute right-2.5 text-gray-400 text-sm pointer-events-none z-10"></i>
                </div>
              ) : (
                <SpkSelect
                  {...({
                    option: config.options,
                    placeholder: config.placeholder,
                    onfunchange: config.onChange,
                    getValue: config.value,
                    classNameprefix: 'react-select',
                    clearable: true
                  } as any)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Filter & Reset Buttons */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleReset}
            className="px-4 py-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            Reset
          </button>

          <button
            onClick={onSearch}
            className="px-4 py-1.5 rounded-md bg-[#078836] hover:bg-[#06732d] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <i className="ri-filter-3-line text-sm"></i> Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
