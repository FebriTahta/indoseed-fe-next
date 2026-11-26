export interface PanenItem {
  id: string;
  kodePanen: string; // e.g. "PN-2026-06-0018"
  jadwalTanamId?: string;
  kodeJadwalTanam?: string; // e.g. "JT-2026-0011"
  kesiapanPanenId?: string;
  commodityId?: string;
  varietyId?: string;
  kesiapanLahanId?: string;
  jenisHasil?: 'Glondong / Buah' | 'OC / Benih' | string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  lahan: string;
  blokLahan?: string;
  rencanaPanen?: string;
  tanggalPanen: string;
  luasHa: number;
  perkiraanHasil?: number; // e.g. 1500 kg
  produksiKg: number; // hasil aktual e.g. 1480 kg
  hasilKgHa?: number;
  jumlahBuah?: number; // for Glondong/Buah
  beratBruto?: number;
  beratNetto?: number;
  kondisiHasil?: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' | string;
  statusPengolahan?: string; // e.g. "Menunggu Pengolahan" | "Dalam Proses" | "Selesai"
  status: 'Selesai' | 'Dalam Proses' | 'Tertunda' | 'Menunggu' | string;
  penanggungJawab?: string;
  metodePanen?: string;
  produksiKotorKg?: number;
  kadarAir?: number;
  kebersihan?: number;
  catatan?: string;
  dokumen?: string | any[];
  dokumentasi?: Array<{
    url: string;
    caption?: string;
    size?: string;
    date?: string;
  }> | string[];
  dibuatOleh?: string;
  diubahOleh?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PanenStats {
  totalJadwal: number; // 10
  selesaiCount: number; // 6
  dalamProsesCount: number; // 2
  tertundaCount: number; // 1
  totalHasilKg: number; // 12450
  glondongKg: number; // 8250
  glondongJadwal: number; // 6
  ocKg: number; // 4200
  ocJadwal: number; // 4
}

export interface RingkasanKomoditasItem {
  no: number;
  komoditas: string;
  varietas: string;
  jumlahJadwal: number;
  selesai: number;
  dalamProses: number;
  tertunda: number;
  totalHasilKg: number;
}

export interface ChartSeriesItem {
  name: string;
  data: number[];
}

export interface ChartPanenData {
  categories: string[]; // ['23 Jun', '24 Jun', ...]
  series: ChartSeriesItem[];
}

export interface ReferensiJadwalTanamPanen {
  id: string;
  kodeJadwalTanam: string;
  komoditas: string;
  varietas: string;
  namaPetani: string;
  kodePetani?: string;
  lahan: string;
  luasLahan: number;
  targetProduksi?: number;
  perkiraanPanen?: string;
  statusJadwal: string;
  statusPersetujuan?: string;
}

export interface CreatePanenPayload {
  kodePanen?: string;
  jadwalTanamId?: string;
  kodeJadwalTanam?: string;
  jenisHasil: string;
  komoditas: string;
  varietas: string;
  petani: string;
  petaniKode?: string;
  lahan: string;
  tanggalPanen: string;
  luasHa: number;
  jumlahBuah?: number;
  beratBruto?: number;
  beratNetto?: number;
  kondisiHasil: string;
  catatan?: string;
  dokumentasi?: string[];
  status?: string;
}
