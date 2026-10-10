"use client";

import React from 'react';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';

/**
 * Penjelasan bagi non-penguji yang membuka pengujian yang sedang berjalan:
 * pelaksanaan pengujian hanya oleh penguji yang ditugaskan.
 */
export default function PengujiOnlyNotice({ petugas }: { petugas?: string | null }) {
  const { isSuperadmin } = useCurrentUser();
  return (
    <div className="p-3 rounded-xl border border-sky-200 bg-sky-50 text-xs text-sky-800 flex gap-2" role="note">
      <i className="ri-shield-user-line text-base leading-none text-sky-500"></i>
      <p className="mb-0">
        Pengujian hanya dapat dilakukan oleh penguji
        {petugas ? (
          <>
            {' '}yang ditugaskan (<strong>{petugas}</strong>)
          </>
        ) : (
          ' yang menguasai metode ujinya'
        )}
        . Halaman ini ditampilkan dalam mode baca saja.
        {isSuperadmin && ' Untuk mencoba alur pengujian, gunakan fitur "Login sebagai" penguji pada menu Penguji.'}
      </p>
    </div>
  );
}
