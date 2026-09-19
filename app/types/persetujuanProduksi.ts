export interface RiwayatFlowStep {
  step: number;
  title: string;
  role: string;
  name: string;
  tanggal: string | Date | null;
  catatan?: string;
  status: 'Selesai' | 'Menunggu' | 'Disetujui' | 'Ditolak';
}

export interface DataPerbandinganJadwal {
  tanggalTanam?: string | Date | null;
  estimasiPanen?: string | Date | null;
  luasTanam?: number | string;
  petani?: string;
  lahan?: string;
}

export interface PersetujuanProduksi {
  id: string;
  noPengajuan: string;
  jenis: string;
  judul: string;
  pengaju: string;
  tanggalPengajuan: string;
  status: 'Proses' | 'Disetujui' | 'Ditolak' | 'Menunggu';
  alasanRevisi?: string;
  catatanReview?: string;
  disetujuiOleh?: string;
  tanggalPersetujuan?: string;
  lampiranFile?: string;
  lampiranSize?: string;
  jadwalTanamId?: string;
  dataSebelumnya?: DataPerbandinganJadwal;
  dataPengajuan?: DataPerbandinganJadwal;
  riwayatFlow?: RiwayatFlowStep[];
  createdAt: string;
  updatedAt: string;
  jadwalTanam?: any;
}

export interface PersetujuanProduksiStats {
  menunggu: number;
  disetujui: number;
  ditolak: number;
  total: number;
}

export interface FilterPersetujuanProduksiParams {
  search?: string;
  jenis?: string;
  pengaju?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
