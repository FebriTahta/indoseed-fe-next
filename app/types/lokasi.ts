export interface Lokasi {
  id: string;
  kodeLokasi: string;
  namaLokasi: string;
  tipeLokasi: string;
  alamat?: string | null;
  kota?: string | null;
  provinsi?: string | null;
  koordinat?: string | null;
  luasArea?: number | null;
  penanggungJawabUtama?: string | null;
  status: 'Aktif' | 'Nonaktif' | string;
  keterangan?: string | null;
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

export interface LokasiStats {
  totalLokasi: number;
  aktif: number;
  nonaktif: number;
  totalPersonelAssigned: number;
}

export interface LokasiFormValues {
  kodeLokasi: string;
  namaLokasi: string;
  tipeLokasi: string;
  alamat: string;
  kota: string;
  provinsi: string;
  koordinat: string;
  luasArea: number | string;
  penanggungJawabUtama: string;
  status: 'Aktif' | 'Nonaktif';
  keterangan: string;
}
