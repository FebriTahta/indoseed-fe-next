export interface BatchProduksiItem {
  id?: string;
  no?: number;
  kodeBatch: string;
  treatmentId?: string;
  referensiTreatment?: string;
  komoditas: string;
  varietas: string;
  sumberBahan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  targetKg: number;
  hasilKg?: number;
  yieldPercent?: number;
  status: 'Selesai' | 'Proses' | 'Reject' | 'Belum Mulai' | string;
  lokasi?: string;
  catatan?: string;
}

export interface TahapanProduksiItem {
  namaTahap: string;
  completedBatch: number;
  totalBatch: number;
  percentage: number;
  icon: string;
}

export interface DokumenTerbaruItem {
  id: string;
  judul: string;
  waktu: string;
  tipe: 'pdf' | string;
}
