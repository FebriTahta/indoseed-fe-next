export interface BatchProduksiItem {
  id?: string;
  no?: number;
  kodeBatch: string;
  gudangBahanId?: string;
  noLot?: string;
  treatmentId?: string;
  referensiTreatment?: string;
  komoditas: string;
  varietas: string;
  sumberBahan: string;
  lahan?: string;
  lokasi?: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  targetKg: number;
  hasilKg?: number;
  yieldPercent?: number;
  status: 'Selesai' | 'Dalam Proses' | 'Tertunda' | 'Persiapan' | 'Proses' | 'Reject' | 'Belum Mulai' | string;
  catatan?: string;
  foto?: string;
  tahapanList?: Array<{
    nama: string;
    tanggal: string;
    status: 'Selesai' | 'Dalam Proses' | 'Pending';
  }>;
  dokumenList?: Array<{
    id: string;
    judul: string;
    tipe: string;
    fileUrl?: string;
  }>;
}

export interface ReferensiGudangBahanItem {
  id: string;
  noLot: string;
  sumberPanen: string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  lahan?: string;
  tanggalMasuk: string;
  beratMasuk: number;
  kadarAir: number;
  lokasi: string;
  lokasiDetail?: string;
  status: string;
  kondisiFisik?: string;
}

export interface BatchProduksiStats {
  totalBatch: number;
  totalBatchDelta: number;
  dalamProses: number;
  dalamProsesDelta: number;
  selesaiCount: number;
  selesaiDelta: number;
  tertundaCount: number;
  tertundaDelta: number;
  persiapanCount?: number;
  totalProduksiBenih: string;
  totalProduksiDeltaPercent: number;
  komoditasBreakdown?: Array<{
    name: string;
    kg: number;
    percent: number;
    color: string;
  }>;
  trenProduksi?: Array<{
    minggu: string;
    target: number;
    realisasi: number;
  }>;
  statusDistribution?: {
    selesai: { count: number; percent: number };
    dalamProses: { count: number; percent: number };
    tertunda: { count: number; percent: number };
    persiapan: { count: number; percent: number };
  };
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
