import { Commodity } from './commodity';

export interface Variety {
  id: string;
  kodeVarietas: string;
  namaVarietas: string;
  commodityId: string;
  asalPemulia: string;
  tahunRilis: number | null;
  deskripsi: string;
  umurTanam: string;
  tinggiTanaman: string;
  bentukBiji: string;
  warnaGabah: string;
  potensiHasil: string;
  anjuranDataran: string;
  status: 'Aktif' | 'Tidak Aktif';
  image: string;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
  commodity: Commodity;
}
