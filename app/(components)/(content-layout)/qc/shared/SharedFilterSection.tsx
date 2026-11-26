import React, { useState, useEffect } from 'react';
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import { FilterButton, ResetButton } from '../../shared/ActionButtons';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SharedFilterProps {
  methods?: any[];
  methodValueKey?: string;
  commodities?: any[];
  varieties?: any[];
  statusOptions?: FilterOption[];
  onFilter: (filters: any) => void;
  onReset?: () => void;
}

export default function SharedFilterSection({ 
  methods = [], 
  methodValueKey = 'id',
  commodities = [], 
  varieties = [], 
  statusOptions = [],
  onFilter, 
  onReset 
}: SharedFilterProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [search, setSearch] = useState('');
  const [commodityId, setCommodityId] = useState('');
  const [varietyId, setVarietyId] = useState('');
  const [methodId, setMethodId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilter({
        search,
        commodityId,
        varietyId,
        methodId,
        status,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined
      });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, commodityId, varietyId, methodId, status, startDate, endDate]);

  const handleFilter = () => {
    onFilter({
      search,
      commodityId,
      varietyId,
      methodId,
      status,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined
    });
  };

  const handleReset = () => {
    setSearch('');
    setCommodityId('');
    setVarietyId('');
    setMethodId('');
    setStatus('');
    setDateRange([null, null]);
    if (onReset) onReset();
  };

  return (
      <div className="box mb-4 shadow-sm">
        <div className="box-body p-4 grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Kode Batch / Lot</label>
            <div className="relative">
              <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Cari kode batch..." value={search} onChange={e => setSearch(e.target.value)} />
              <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Komoditas</label>
            <select className="form-select text-sm h-[38px] w-full" value={commodityId} onChange={e => setCommodityId(e.target.value)}>
              <option value="">Semua Komoditas</option>
              {commodities?.map(c => <option key={c.id} value={c.id}>{c.namaKomoditas}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Varietas</label>
            <select className="form-select text-sm h-[38px] w-full" value={varietyId} onChange={e => setVarietyId(e.target.value)}>
              <option value="">Semua Varietas</option>
              {varieties?.map(v => <option key={v.id} value={v.id}>{v.namaVarietas}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Periode Uji</label>
            <div className="relative">
              <SpkDatepickr 
                className="form-control text-sm h-[38px] w-full bg-white" 
                placeholderText="Pilih Periode..." 
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => setDateRange(update)}
              />
              <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400 pointer-events-none"></i>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Metode Uji</label>
            <select className="form-select text-sm h-[38px] w-full" value={methodId} onChange={e => setMethodId(e.target.value)}>
              <option value="">Semua Metode</option>
              {methods?.map((m: any) => (
                <option key={m.id || m.kode} value={m[methodValueKey]}>{m.nama}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
            <select className="form-select text-sm h-[38px] w-full" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Semua Status</option>
              {statusOptions?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <ResetButton className="w-full h-[38px] py-0" onClick={handleReset} />
            <FilterButton className="w-full h-[38px] py-0" onClick={handleFilter} />
          </div>
        </div>
      </div>
  );
}
