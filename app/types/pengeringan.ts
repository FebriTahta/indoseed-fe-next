export interface PengeringanBatchItem {
  id?: string;
  no?: number;
  kodeBatch: string;
  panenId?: string;
  referensiPanen?: string;
  komoditas: string;
  varietas: string;
  alatPengering: string;
  beratMasuk: number;
  kadarAirMasuk: number;
  kadarAirTarget: number;
  kadarAirSaatIni: number;
  beratKeluar?: number;
  status: 'Selesai' | 'Proses' | 'Jeda' | 'Bermasalah' | string;
  selesai?: string;
  suhuRataRata?: number;
  durasiJam?: number;
  lokasi?: string;
  catatan?: string;
}

export interface AlatPengeringItem {
  id: string;
  kodeAlat: string; // e.g. "DR-01"
  tipeAlat: string; // e.g. "Dryer Box 10 Ton"
  status: 'Beroperasi' | 'Jeda' | 'Tidak Beroperasi';
  suhu: number | null; // e.g. 42.3
  kadarAirRata: number | null; // e.g. 12.8
  kapasitasPersen: number; // e.g. 60
  lokasi: string; // e.g. "Gudang Pengeringan 1"
}

export interface AlertPengeringanItem {
  id: string;
  judul: string;
  tipe: 'danger' | 'warning' | 'info';
  kodeBatchOrAlat: string;
  deskripsi: string;
  waktu: string;
}
