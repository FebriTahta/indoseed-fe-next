import { Land } from './greenhouse';

export interface Partner {
  id: string;
  kodePetani: string;
  namaPetani: string;
  kelompokTani: string;
  komoditasUtama: string;
  commodityId?: string | null;
  commodity?: any;
  noKtp: string | null;
  noTelepon: string | null;
  alamat: string | null;
  luasLahan: number;
  pengalaman: number;
  tglBergabung: string;
  status: 'Aktif' | 'Non Aktif' | 'Tidak Aktif';
  image: string | null;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
  greenhouses?: Land[];
}
