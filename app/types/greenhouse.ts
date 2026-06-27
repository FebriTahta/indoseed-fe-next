export interface Land {
  id: string;
  kodeLahan: string;
  namaLahan: string;
  jenisLahan: 'Greenhouse' | 'Lahan Terbuka';
  komoditasUtama: string;
  komoditasColor: string;
  komoditasIcon: string;
  lokasi: string;
  luas: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Maintenance';
  detailLokasi: string;
  koordinat: string;
  petaniMitra: string;
  commodityId: string | null;
  partnerId: string | null;
  tglDibuat: string;
  dibuatOleh: string;
  keterangan: string;
  image: string;
  commodity?: {
    id: string;
    kodeKomoditas: string;
    namaKomoditas: string;
  } | null;
  partner?: {
    id: string;
    kodePetani: string;
    namaPetani: string;
  } | null;
}
