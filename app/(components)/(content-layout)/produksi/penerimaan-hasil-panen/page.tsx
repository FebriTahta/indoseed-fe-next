"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PenerimaanHasilPanenRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/produksi/gudang-bahan-belum-diproses');
  }, [router]);

  return null;
}
