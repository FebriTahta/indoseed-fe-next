export interface RakData {
  id: string;
  kodeRak: string;
  namaRak: string;
  gudangId?: string | null;
  kodeGudang?: string | null;
  namaGudang?: string | null;
  kategori: 'benih' | 'packing' | 'treatment' | 'umum' | string;
  kapasitas: number;
  baris: string;
  kolom: string;
  level: string;
  status: 'Aktif' | 'Penuh' | 'Maintenance' | 'Tidak Aktif' | string;
  keterangan?: string | null;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  tglDibuat?: string;
  createdAt?: string;
  updatedAt?: string;
  gudang?: {
    id: string;
    kodeGudang: string;
    namaGudang: string;
    kategori: string;
    status: string;
  } | null;
}

export type RackData = RakData;
