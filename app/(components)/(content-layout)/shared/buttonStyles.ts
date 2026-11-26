/**
 * Satu sumber gaya tombol aplikasi: radius `rounded-md`, tinggi seragam per ukuran.
 *   md (36px) → tombol aksi halaman/form/modal
 *   sm (28px) → tombol di dalam tabel/kartu
 */
export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'secondary'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'warningSolid'
  | 'dangerSolid';
export type ButtonSize = 'sm' | 'md';

const BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-md border font-semibold whitespace-nowrap transition-colors ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none';

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-[11px]',
  md: 'h-9 px-3.5 text-xs',
};

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-[#1B4E3B] border-[#1B4E3B] text-white hover:bg-[#163F30] hover:border-[#163F30]',
  outline: 'bg-white border-[#1B4E3B] text-[#1B4E3B] hover:bg-emerald-50',
  secondary: 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
  warning: 'bg-white border-amber-400 text-amber-700 hover:bg-amber-50',
  danger: 'bg-white border-rose-300 text-rose-600 hover:bg-rose-50',
  ghost: 'bg-transparent border-transparent text-emerald-700 hover:bg-emerald-50',
  warningSolid: 'bg-amber-500 border-amber-500 text-white hover:bg-amber-600 hover:border-amber-600',
  dangerSolid: 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700 hover:border-rose-700',
};

export const buttonClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') =>
  `${BASE} ${SIZE[size]} ${VARIANT[variant]} ${extra}`.trim();

export type IconButtonTone = 'emerald' | 'blue' | 'rose' | 'amber' | 'gray';

const ICON_TONE: Record<IconButtonTone, string> = {
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100',
  blue: 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100',
  rose: 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100',
  amber: 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100',
  gray: 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700',
};

/** Tombol ikon persegi 28px (aksi baris tabel, tutup, hapus, dll.). */
export const iconButtonClass = (tone: IconButtonTone = 'gray', extra = '') =>
  `inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-md border text-sm transition-colors ` +
  `disabled:opacity-60 disabled:cursor-not-allowed ${ICON_TONE[tone]} ${extra}`.trim();
