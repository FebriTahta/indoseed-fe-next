import { Commodity } from '@/app/types/commodity';
import React from 'react';

interface FilterCardProps {
  periode: string;
  setPeriode: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  komoditas: string;
  setKomoditas: (val: string) => void;
  komoditasOption?: Commodity[];
  varietas: string;
  setVarietas: (val: string) => void;
  varietasOption?: any[];
  namaPetani: string;
  setNamaPetani: (val: string) => void;
  namaPetaniOption?: any[];
  onReset: () => void;
  onApply: () => void;
  onOpenTambah: () => void;
}

export default function FilterCard({
  periode,
  setPeriode,
  status,
  setStatus,
  komoditas,
  setKomoditas,
  komoditasOption,
  varietas,
  setVarietas,
  varietasOption,
  namaPetani,
  setNamaPetani,
  namaPetaniOption,
  onReset,
  onApply,
  onOpenTambah
}: FilterCardProps) {
  const periodeOptions = [
    'Okt - Des 2026',
    'Nov 2026 - Jan 2027',
    'Nov 2026 - Feb 2027',
    'Des 2026 - Mar 2027',
    'Jan 2027 - Apr 2027',
    'Feb 2027 - Mei 2027'
  ];

  const produkOptions = [
    'Kangkung',
    'Bayam',
    'Tomat',
    'Cabe',
    'Brokoli',
    'Padi',
    'Terong',
    'Buncis',
    'Wortel',
    'Jagung',
    'Kedelai'
  ];

  const statusOptions = ['Disetujui', 'Draft', 'Proses', 'Selesai'];

  const varietasOptions = [
    'Super Sempit',
    'Sempit',
    'Hijau',
    'Melisa',
    'Keriting',
    'Green Magic',
    'Inpari 32',
    'Hifa',
    'Tahan Kuning',
    'Nantes',
    'Jagung Hibrida P-21',
    'Kedelai Anjasmoro'
  ];

  const petaniOptions = [
    'Slamet Riyadi',
    'Budi Santoso',
    'Ahmad Supardi',
    'Wayan Sujana',
    'Hendra Wijaya',
    'Endang Rukmana',
    'Sukardi',
    'Maman Sulaeman',
    'Dedi Kurniawan',
    'Nanang Kosim',
    'Agus Riyadi',
    'Sunardi'
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm mb-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-sm font-bold text-gray-800">Cari & Filter</h3>
      </div>

      {/* Grid Inputs */}
      <div className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-4">
          {/* Periode */}
          <div className='col-span-8 '>
            <label className="block text-xs font-medium text-gray-700 mb-1">Periode</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <select
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Pilih periode</option>
                {periodeOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className='col-span-4 '>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Semua status</option>
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Komoditas */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Komoditas</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <select
                value={komoditas}
                onChange={(e) => setKomoditas(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Semua komoditas</option>
                {komoditasOption?.map((k: any) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Varietas */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Varietas</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <select
                value={varietas}
                onChange={(e) => setVarietas(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Semua varietas</option>
                {varietasOption?.map((v: any) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Petani */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">Petani</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <select
                value={namaPetani}
                onChange={(e) => setNamaPetani(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="">Semua petani</option>
                {namaPetaniOption?.map((pet: any) => (
                  <option key={pet.value} value={pet.value}>
                    {pet.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-12 flex items-center gap-2 justify-end">
            <button
              onClick={onReset}
              type="button"
              className="px-3.5 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Reset Filter"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
            <button
              onClick={onOpenTambah}
              type="button"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#078836] hover:bg-[#06732e] rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span> Tambah Rencana</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
