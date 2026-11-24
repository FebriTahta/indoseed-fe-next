export interface Peran {
  id: string;
  kodePeran: string;
  namaPeran: string;
  kategori: string;
  deskripsi?: string | null;
  status: 'Aktif' | 'Nonaktif' | string;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    penanggungJawabs: number;
  };
  penanggungJawabs?: Array<{
    id: string;
    kodePersonel?: string | null;
    nama: string;
    peran?: string | null;
    areaModul?: string | null;
    lokasi?: string | null;
    status: string;
    noHp?: string | null;
    email?: string | null;
  }>;
}

export interface PeranStats {
  totalPeran: number;
  aktif: number;
  nonaktif: number;
  totalPersonelAssigned: number;
}

export interface PeranFormValues {
  kodePeran: string;
  namaPeran: string;
  kategori: string;
  deskripsi: string;
  status: 'Aktif' | 'Nonaktif';
}
