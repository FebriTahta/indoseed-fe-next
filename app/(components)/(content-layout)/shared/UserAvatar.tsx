import React from 'react';

const PALETTE = [
  'bg-emerald-600',
  'bg-teal-600',
  'bg-sky-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-slate-600',
];

/** Inisial maksimal 2 huruf: "Dewi Lestari" → "DL", "admin.sistem" → "AS". */
export const initialsOf = (name: string) =>
  name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';

/** Warna stabil per nama agar pengguna yang sama selalu berwarna sama. */
const colorOf = (name: string) => PALETTE[[...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % PALETTE.length];

interface UserAvatarProps {
  name: string;
  subtitle?: string | null;
  /** Foto profil; bila kosong ditampilkan inisial berwarna. */
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  /** Tampilkan avatar saja tanpa nama. */
  avatarOnly?: boolean;
}

const SIZE = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-10 h-10 text-sm' };

/** Avatar (foto / inisial) + nama (+ peran) pengguna. */
export default function UserAvatar({ name, subtitle, imageUrl, size = 'sm', avatarOnly }: UserAvatarProps) {
  const dim = SIZE[size];
  const avatar = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt={name} className={`${dim} shrink-0 rounded-full object-cover border border-gray-200`} />
  ) : (
    <span className={`${dim} ${colorOf(name)} shrink-0 rounded-full text-white font-semibold flex items-center justify-center`} aria-hidden="true">
      {initialsOf(name)}
    </span>
  );
  if (avatarOnly) return avatar;

  return (
    <div className="flex items-center gap-2 min-w-0">
      {avatar}
      <span className="min-w-0 leading-tight">
        <span className="block font-medium text-gray-800 truncate">{name}</span>
        {subtitle && <span className="block text-[10px] text-gray-500 truncate">{subtitle}</span>}
      </span>
    </div>
  );
}
