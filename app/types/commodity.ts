export interface Commodity {
  id: string;
  kodeKomoditas: string;
  namaKomoditas: string;
  kategori: string;
  deskripsi: string;
  status: 'Aktif' | 'Tidak Aktif';
  image: string;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
}
