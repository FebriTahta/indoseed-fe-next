import { Land } from './greenhouse';

export interface Partner {
  id: string;
  kodePetani: string;
  namaPetani: string;
  kelompokTani: string;
  kelompokTaniId?: string | null;
  kelompok?: any;
  penanggungJawabId?: string | null;
  penanggungJawab?: any;
  komoditasUtama: string;
  commodityId?: string | null;
  commodity?: any;
  noKtp: string | null;
  noTelepon: string | null;
  email?: string | null;
  alamat: string | null;
  luasLahan: number;
  pengalaman: number;
  tglBergabung: string;
  status: 'Aktif' | 'Non Aktif' | 'Tidak Aktif';
  image: string | null;
  namaBank?: string | null;
  noRekening?: string | null;
  atasNama?: string | null;
  catatan?: string | null;
  dokumen?: string | null;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
  greenhouses?: Land[];
  createdAt?: string;
  updatedAt?: string;
}
