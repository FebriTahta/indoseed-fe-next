import React, { useState } from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';
import SpkDatepickr from '@/shared/@spk-reusable-components/spk-packages/datepicker-component';

export interface FilterSelectConfig {
  value: any;
  onChange: (val: any) => void;
  options: { value: any; label: string }[];
  placeholder: string;
  title?: string;
  widthClass?: string;
  type?: string
}

interface FilterRowProps {
  search: string;
  onSearchChange: (search: string) => void;
  searchPlaceholder?: string;
  selectFilters: FilterSelectConfig[];
  onSearch: () => void;
  onReset: () => void;
}

export default function FilterRow({
  search,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  selectFilters,
  onSearch,
  onReset,
}: FilterRowProps) {

  const [dateRange, setDateRange] = useState([]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-md mb-6">
      <div className="box-body p-4 flex flex-col md:flex-row justify-between items-center gap-4 flex-wrap">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
         

          {/* Dynamic Select Filters */}
          {selectFilters.map((config, index) => 
            config.type === "date" ? (
              <div key={index} className={`w-full ${config.widthClass || 'sm:w-36'} text-xs`}>
                Periode Tanam
                <div className="input-group custom-picker flex-nowrap">
                  <div className="input-group-text !text-textmuted   dark:text-textmuted/50 !border-defaultborder dark:!border-defaultborder/10"> <i className="ri-calendar-line"></i> </div>
                  <SpkDatepickr
                    className="form-control datepicker-input"
                    placeholderText="Select date range"
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange={true}
                    onChange={(update) => setDateRange(update)} 
                    selected={undefined} 
                    minDate={undefined} 
                    maxDate={undefined} 
                    Timeinput={undefined} 
                    isClearable={undefined} 
                    Iconvisible={undefined} 
                    showTimeSelectOnly={undefined} 
                    showTimeInput={undefined} 
                    Localtime={undefined} 
                    Caption={undefined} 
                    Inline={undefined} 
                    Yearpicker={undefined} />
                </div>
              </div>
            ) : (
              // jika option
              <div key={index} className={`w-full ${config.widthClass || 'sm:w-36'} text-xs`}>
                {config.title || '' }
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
            )
          
            
          )}
        </div>

        {/* Reset & Export Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
          
          <SpkButton
              {...({
              onclickfunc: onSearch,
              style: { backgroundColor: '#078836', color: 'white' },
              className: "hover:bg-[#06732d] hover:text-white",
              customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
            } as any)}
          >
            <i className="ri-filter-2-line text-lg"></i> Filter
          </SpkButton>
          
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-textmuted hover:text-danger font-medium transition-colors"
          >
            <i className="ri-refresh-line"></i> Reset
          </button>

        </div>
      </div>
    </div>
  );
}
