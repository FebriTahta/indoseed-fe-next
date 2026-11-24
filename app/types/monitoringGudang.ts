export type MonitoringTab = 'monitoring' | 'input' | 'peringatan' | 'riwayat' | 'pengaturan';

export type MonitoringStatus = 'Normal' | 'Perlu Perhatian' | 'Tidak Sesuai' | 'Sensor Offline';

export interface MonitoringGudangItem {
  id: string;
  gudangId?: string | null;
  kodeGudang?: string | null;
  namaGudang: string;
  zona: string;
  sensor?: string | null;
  suhu: number | null;
  rh: number | null;
  suhuMin: number;
  suhuMax: number;
  rhMin: number;
  rhMax: number;
  waktuPengukuran: string;
  sumberData: 'IoT Sensor' | 'Manual' | string;
  status: MonitoringStatus | string;
  catatan?: string | null;
  petugas?: string | null;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt?: string;
  updatedAt?: string;
  gudang?: {
    id: string;
    kodeGudang: string;
    namaGudang: string;
    kategori: string;
  } | null;
}

export interface MonitoringGudangStats {
  totalZona: number;
  normal: number;
  perluPerhatian: number;
  tidakSesuai: number;
  sensorOffline: number;
  offlineOrTidakSesuai: number;
  normalPercentage: number;
  perluPerhatianPercentage: number;
  tidakSesuaiPercentage: number;
  sensorOfflinePercentage: number;
}

export interface MonitoringAlertItem {
  id: string;
  title: string;
  tipe: 'warning' | 'danger' | 'success' | 'info';
  actionLabel: string;
  actionType: string;
  waktu: string;
  status: string;
}

export interface MasterGudangOption {
  id: string;
  kodeGudang: string;
  namaGudang: string;
  kategori: string;
  status: string;
}

export interface MonitoringFormInput {
  gudangId?: string;
  namaGudang: string;
  zona: string;
  sensor?: string;
  suhu?: number | string | null;
  rh?: number | string | null;
  suhuMin: number | string;
  suhuMax: number | string;
  rhMin: number | string;
  rhMax: number | string;
  waktuPengukuran: string;
  sumberData: string;
  status?: string;
  catatan?: string;
  petugas?: string;
}
