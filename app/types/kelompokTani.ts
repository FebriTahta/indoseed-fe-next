import { PenanggungJawab } from './penanggungJawab';
import { Commodity } from './commodity';

export interface KelompokTaniMember {
  id: string;
  kodePetani: string;
  namaPetani: string;
  status: string;
  noTelepon?: string | null;
  alamat?: string | null;
}

export interface KelompokTani {
  id: string;
  kodeKelompok: string;
  namaKelompok: string;
  ketua: string;
  noHpKetua?: string | null;
  tahunBerdiri?: string | null;
  lokasi: string;
  desa?: string | null;
  kecamatan?: string | null;
  kabupaten?: string | null;
  komoditasUtama: string;
  commodityId?: string | null;
  jumlahAnggota: number;
  deskripsi?: string | null;
  status: 'Aktif' | 'Nonaktif' | 'Tidak Aktif' | string;
  penanggungJawabId?: string | null;
  penanggungJawab?: PenanggungJawab | null;
  commodity?: Commodity | null;
  partners?: KelompokTaniMember[];
  _count?: {
    partners: number;
  };
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface KelompokTaniStats {
  totalKelompok: number;
  totalAnggota: number;
  komoditasUtama: string;
  statusAktifCount: number;
  totalCount: number;
  allLokasi?: string[];
  allKomoditas?: string[];
}
