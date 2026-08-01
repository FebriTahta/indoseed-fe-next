export interface SortasiBatchItem {
  id?: string;
  no?: number;
  kodeBatch: string;
  komoditas: string;
  varietas: string;
  alatSortasi: string;
  beratMasuk: number;
  hasilLulus: number;
  hasilTolak: number;
  recovery: number;
  tanggalSortasi: string;
  status: 'Selesai' | 'Proses' | 'Pending' | string;
  lokasi?: string;
  operator?: string;
  catatan?: string;
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
