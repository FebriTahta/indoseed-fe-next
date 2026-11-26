export interface RincianRejectItem {
  jenis: string;
  berat: number;
  persentase: number;
}

export interface SortasiBatchItem {
  id?: string;
  no?: number;
  kodeBatch: string;
  tanggalSortasi: string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  noLot?: string;
  gudangBahanId?: string;
  pengeringanId?: string;
  referensiPengeringan?: string;
  alatSortasi?: string;
  beratMasuk: number;
  hasilLulus: number;
  hasilTolak: number;
  recovery: number;
  status: 'Selesai' | 'Proses' | 'Pending' | string;
  lokasi?: string;
  operator?: string;
  catatan?: string;
  rincianReject?: RincianRejectItem[];
  dokumentasi?: string[];
  dibuatOleh?: string;
  diubahOleh?: string;
}

export interface ProsesSortasiAktifItem {
  kodeBatch: string;
  komoditas: string;
  varietas: string;
  lokasi: string;
  alatSortasi: string;
  operator: string;
  beratMasuk: number;
  step1: 'check' | 'process' | 'pending';
  step2: 'check' | 'process' | 'pending';
  step3: 'check' | 'process' | 'pending';
  step4: 'check' | 'process' | 'pending';
  progress: number;
  status: 'Proses' | 'Selesai' | 'Pending';
}

export interface SortasiStats {
  totalBatch: number;
  totalBeratMasuk: number;
  totalBeratMasukFormatted: string;
  totalBeratLolos: number;
  totalBeratLolosFormatted: string;
  totalBeratReject: number;
  totalBeratRejectFormatted: string;
  persenLolos: string;
  persenReject: string;
  rataRataKualitas: string;
  prosesCount: number;
  selesaiCount: number;
  chartHasilSortasi: {
    categories: string[];
    lolos: number[];
    reject: number[];
  };
  chartTrenKualitas: {
    categories: string[];
    lolos: number[];
    reject: number[];
  };
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
  status: string;
  kondisiFisik?: string;
}

export interface CreateSortasiPayload {
  kodeBatch?: string;
  tanggalSortasi?: string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  noLot?: string;
  gudangBahanId?: string;
  pengeringanId?: string;
  referensiPengeringan?: string;
  alatSortasi?: string;
  beratMasuk: number;
  hasilLulus: number;
  hasilTolak: number;
  status: 'Proses' | 'Selesai' | string;
  lokasi?: string;
  operator?: string;
  catatan?: string;
  rincianReject?: RincianRejectItem[];
  dokumentasi?: string[];
}
