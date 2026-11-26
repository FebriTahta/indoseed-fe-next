export interface TahapanProsesStep {
  nama: string;
  tanggal?: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface RiwayatTreatmentItem {
  tanggal: string;
  aktivitas: string;
  operator?: string;
}

export interface TreatmentBatchItem {
  id?: string;
  no?: number;
  kodeBatch: string;
  tanggalProses?: string;
  tanggalSelesai?: string;
  petani?: string;
  petaniKode?: string;
  lahan?: string;
  komoditas: string;
  varietas: string;
  metodeTreatment?: string;
  bahan?: string;
  jumlahBenih?: number;
  dosis?: string;
  operator?: string;
  beratAwal?: number;
  beratAkhir?: number;
  loss?: number;
  status: 'Selesai' | 'Dalam Proses' | 'Menunggu' | 'Proses' | string;
  lokasi?: string;
  catatan?: string;
  noLot?: string;
  gudangBahanId?: string;
  sortasiId?: string;
  referensiSortasi?: string;
  treatment?: string;
  tahapanProses?: TahapanProsesStep[];
  riwayatTreatment?: RiwayatTreatmentItem[];
  fotoDokumentasi?: string[];
  dibuatOleh?: string;
  diubahOleh?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReferensiGudangBahanItem {
  id: string;
  noLot: string;
  sumberPanen?: string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  lahan?: string;
  tanggalMasuk?: string;
  beratMasuk?: number;
  kadarAir?: number;
  lokasi?: string;
  lokasiDetail?: string;
  status: string;
  kondisiFisik?: string;
}

export interface TreatmentStats {
  totalBatch: number;
  totalBatchDelta: number;
  totalBenihDiproses: string;
  totalBenihDeltaPercent: number;
  batchSelesai: number;
  batchSelesaiDelta: number;
  dalamProses: number;
  dalamProsesDelta: number;
  batchBermasalah: number;
  batchBermasalahDelta?: number;
  grafikProsesTreatment: Array<{
    komoditas: string;
    selesai: number;
    dalamProses: number;
    menunggu: number;
  }>;
  chartMetodeTreatment: Array<{
    nama: string;
    count: number;
    persentase: number;
    color: string;
  }>;
  chartBahanTerbanyak: Array<{
    nama: string;
    persentase: number;
  }>;
}

export interface ProsesTreatmentAktifItem {
  kodeBatch: string;
  komoditas: string;
  varietas: string;
  lokasi: string;
  treatment: string;
  dosis: string;
  operator: string;
  beratAwal: number;
  beratAkhir: number;
  loss: number;
  mulai: string;
  selesaiEstimasi: string;
  progress: number;
  status: 'Proses' | 'Selesai' | 'Pending';
}
