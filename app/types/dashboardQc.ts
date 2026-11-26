import { PermintaanPengujian } from '@/app/types/qc';

export interface DashboardKpi {
  sampelMasuk: number;
  pengujianBerjalan: number;
  menungguReview: number;
  tidakLulus: number;
  lulus: number;
}

export interface DashboardQc {
  periode: { startDate: string; endDate: string };
  kpi: DashboardKpi;
  /** Perubahan persen dibanding periode sebelumnya dengan panjang yang sama; null = tidak ada pembanding. */
  trend: Record<keyof DashboardKpi, number | null>;
  statusPengujian: { status: string; total: number }[];
  totalPermintaan: number;
  alur: { permintaan: number; pengujian: number; review: number; lulus: number; tidakLulus: number };
  jenisPengujian: { nama: string; total: number }[];
  komoditas: { komoditas: string; lulus: number; tidakLulus: number }[];
  terbaru: PermintaanPengujian[];
}
