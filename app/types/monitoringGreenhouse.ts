export interface MonitoringGreenhouseItem {
  no: number;
  kodeGreenhouse: string;
  lokasi: string;
  komoditas: string;
  varietas: string;
  luas: number;
  status: 'Aktif' | 'Tidak Aktif' | 'Rencana';
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Tidak Aktif';
  aktivitasTerakhir: string;
}

export interface GreenhousePlotItem {
  id: string;
  label: string;
  crop: string;
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Aktif' | 'Tidak Aktif';
  badgeColor: string;
  bgColor: string;
}
