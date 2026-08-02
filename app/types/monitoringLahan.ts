export interface MonitoringLahanItem {
  id?: string;
  kodeLahan: string;
  lokasi: string;
  komoditas: string;
  varietas: string;
  luas: number;
  tanggalTanam: string;
  umurHst: string;
  kondisi: 'Baik' | 'Perlu Perhatian' | 'Buruk' | 'Belum Tanam';
  status: 'Aktif' | 'Rencana' | 'Pemeliharaan';
  latitude?: number;
  longitude?: number;
  catatan?: string;
}

export interface ActivityItem {
  id: string;
  type: 'Pemupukan' | 'Pengendalian Hama' | 'Irigasi' | 'Penyiangan Gulma';
  title: string;
  kodeLahan: string;
  actor: string;
  timestamp: string;
  iconBg: string;
  iconColor: string;
  icon: string;
}

export interface ParameterItem {
  label: string;
  value: string;
  icon: string;
  iconColor: string;
}
