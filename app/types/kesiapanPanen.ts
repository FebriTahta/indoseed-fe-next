export interface KesiapanPanenItem {
  id?: string;
  no?: number;
  kodeLahan: string;
  lokasi?: string;
  komoditas: string;
  varietas: string;
  tanggalTanam: string;
  umurHst: number;
  prediksiPanen: string;
  statusKesiapan: 'Siap Panen' | 'Akan Siap (3-7 Hari)' | 'Akan Siap (8-14 Hari)' | 'Belum Siap' | string;
  yieldEst: number;
  kadarAir?: number;
  kuningDaun?: number;
  kekerasanBiji?: string;
  catatan?: string;
}
