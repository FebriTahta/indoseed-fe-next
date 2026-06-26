import React from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';

export interface FilterSelectConfig {
  value: any;
  onChange: (val: any) => void;
  options: { value: any; label: string }[];
  placeholder: string;
  widthClass?: string;
}

interface FilterRowProps {
  search: string;
  onSearchChange: (search: string) => void;
  searchPlaceholder?: string;
  selectFilters: FilterSelectConfig[];
  onReset: () => void;
  onExport: () => void;
}

export default function FilterRow({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  selectFilters,
  onReset,
  onExport
}: FilterRowProps) {
  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-md mb-6">
      <div className="box-body p-4 flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Field */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-control w-full pl-9 pr-3 py-1.5 border border-defaultborder rounded-md text-sm"
              placeholder={searchPlaceholder}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <i className="ri-search-2-line text-sm"></i>
            </div>
          </div>

          {/* Filter Label */}
          <div className="hidden lg:flex items-center gap-1.5 text-textmuted border border-defaultborder px-3 py-1.5 bg-gray-50 text-xs font-semibold rounded-md">
            <i className="ri-filter-3-line"></i> Filter
          </div>

          {/* Dynamic Select Filters */}
          {selectFilters.map((config, index) => (
            <div key={index} className={`w-full ${config.widthClass || 'sm:w-36'} text-xs`}>
              <SpkSelect
                {...({
                  option: config.options,
                  placeholder: config.placeholder,
                  onfunchange: config.onChange,
                  getValue: config.value,
                  classNameprefix: "react-select",
                  clearable: true
                } as any)}
              />
            </div>
          ))}
        </div>

        {/* Reset & Export Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-textmuted hover:text-danger font-medium transition-colors"
          >
            <i className="ri-refresh-line"></i> Reset
          </button>

          <SpkButton
            {...({
              onclickfunc: onExport,
              style: { borderColor: '#078836', color: '#078836' },
              className: "hover:bg-emerald-50 text-xs font-semibold py-1.5 px-3 border rounded flex items-center gap-1",
              customClass: "ti-btn border-emerald-500 bg-white"
            } as any)}
          >
            <i className="ri-share-forward-line"></i> Export
          </SpkButton>
        </div>
      </div>
    </div>
  );
}
