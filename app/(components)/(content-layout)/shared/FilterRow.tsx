import React, { useState, useEffect } from 'react';
import { Button } from './ActionButtons';
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
  onExport?: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

export default function FilterRow({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  selectFilters,
  onReset,
  onExport,
  onAdd,
  addLabel = 'Tambah Data'
}: FilterRowProps) {
  const [mounted, setMounted] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when external search is reset/changed
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search !== localSearch) {
        onSearchChange(localSearch);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch, search, onSearchChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg mb-6 transition-all z-20 relative">
      <div className="box-body p-4 flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap bg-gray-50/50">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Field */}
          <div className="relative w-full sm:w-64 group">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="form-control w-full pl-3 pr-9 py-2 border border-defaultborder rounded-md text-sm transition-all duration-300 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm hover:border-emerald-400"
              placeholder={searchPlaceholder}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-hover:text-emerald-500 transition-colors duration-300">
              <i className="ri-search-2-line text-sm"></i>
            </div>
          </div>

          {/* Dynamic Select Filters */}
          {selectFilters.map((config, index) => (
            <div key={index} className={`w-full ${config.widthClass || 'sm:w-40'} text-xs relative z-10`}>
              {mounted ? (
                <SpkSelect
                  {...({
                    id: (config as any).id || `filter-select-${index}`,
                    option: config.options,
                    placeholder: config.placeholder,
                    onfunchange: config.onChange,
                    getValue: config.value,
                    classNameprefix: "react-select",
                    clearable: true
                  } as any)}
                />
              ) : (
                <div className="h-[38px] w-full bg-white shadow-sm border border-defaultborder rounded-md animate-pulse"></div>
              )}
            </div>
          ))}

          {/* Reset Action */}
          <Button variant="secondary" icon="ri-refresh-line" onClick={onReset}>
            Reset Filter
          </Button>
        </div>

        {/* Add & Export Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto border-t border-gray-200 md:border-t-0 pt-4 md:pt-0">
          {onExport && (
            <Button variant="secondary" icon="ri-file-excel-2-line" onClick={onExport}>
              Export Data
            </Button>
          )}

          {onAdd && (
            <Button variant="primary" icon="ri-add-line" onClick={onAdd}>
              {addLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
