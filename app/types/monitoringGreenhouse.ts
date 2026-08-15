export interface MonitoringGreenhouseItem {
  id?: string;
  no?: number;
  kodeGreenhouse: string;
  lahanId?: string;
  referensiLahan?: string;
  lokasi: string;
  komoditas: string;
  varietas: string;
  luas: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Rencana' | 'Maintenance' | string;
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Tidak Aktif' | string;
  aktivitasTerakhir?: string;
  suhuRataRata?: number;
  kelembapanRata?: number;
  intensitasCahaya?: number;
  phAirIrigasi?: number;
  catatan?: string;
}

export interface GreenhousePlotItem {
  id: string;
  label: string;
  crop: string;
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Aktif' | 'Tidak Aktif';
  badgeColor: string;
  bgColor: string;
}
