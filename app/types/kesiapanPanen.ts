export interface KesiapanPanenItem {
  no: number;
  kodeLahan: string;
  komoditas: string;
  varietas: string;
  tanggalTanam: string;
  umurHst: number;
  prediksiPanen: string;
  statusKesiapan: 'Siap Panen' | 'Akan Siap (3-7 Hari)' | 'Akan Siap (8-14 Hari)' | 'Belum Siap';
  yieldEst: number;
}
