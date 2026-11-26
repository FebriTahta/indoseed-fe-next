export interface TimelineTahap {
  tahap: string;
  status: 'completed' | 'active' | 'in_progress' | 'pending';
  tanggal?: string;
  waktu?: string;
  keterangan?: string;
}

export interface GudangBahanItem {
  id: string;
  no?: number;
  noLot: string; // e.g. "LOT-2026-00021"
  panenId?: string;
  sumberPanen: string; // e.g. "PN-2026-0007"
  komoditas: string; // e.g. "Melon"
  varietas: string; // e.g. "Melon Tere F1"
  petani?: string; // e.g. "Budi Santoso"
  petaniKode?: string; // e.g. "BTN-001"
  lahan?: string; // e.g. "LHN-001 / Blok 01"
  tanggalPanen?: string; // e.g. "2026-06-02"
  tanggalMasuk: string; // e.g. "2026-06-03"
  beratMasuk: number; // e.g. 850
  kadarAir: number; // e.g. 28.5
  lokasi: string; // e.g. "Zona A"
  lokasiDetail?: string; // e.g. "Gudang Produksi / Zona A"
  status: 'Bahan Belum Diproses' | 'Dalam Pengeringan' | 'Menunggu Sortasi' | string;
  kondisiFisik?: string; // e.g. "Baik"
  petugasPenerima?: string; // e.g. "Admin Gudang"
  catatan?: string;
  foto?: string;
  riwayatFlow?: TimelineTahap[];
  dibuatOleh?: string;
  diubahOleh?: string;
  createdAt?: string;
  updatedAt?: string;
  panen?: {
    id: string;
    kodePanen: string;
    petani?: string;
    lahan?: string;
    produksiKg?: number;
    kadarAir?: number;
  };
}

export interface GudangBahanStats {
  totalLot: number; // e.g. 12
  totalLotDelta: number; // e.g. 2
  totalBeratMasuk: number; // e.g. 8450
  totalBeratMasukDeltaPercent: number; // e.g. 12
  rataRataKadarAir: number; // e.g. 27.5
  kadarAirDeltaPercent: number; // e.g. -3.2
  lokasiCount: number; // e.g. 3
  lokasiNames: string; // e.g. "A, B, C (Zona Gudang)"
  statusDistribution: {
    'Bahan Belum Diproses': number;
    'Dalam Pengeringan': number;
    'Menunggu Sortasi': number;
    [key: string]: number;
  };
  stockChartData: Array<{
    komoditas: string;
    masuk: number;
    keluar: number;
  }>;
  kadarAirTrend: Array<{
    date: string;
    value: number;
  }>;
}

export interface ReferensiPanenItem {
  id: string;
  kodePanen: string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  lahan?: string;
  blokLahan?: string;
  tanggalPanen?: string;
  produksiKg?: number;
  beratNetto?: number;
  kadarAir?: number;
  kondisiHasil?: string;
  status?: string;
}

export interface CreateGudangBahanPayload {
  noLot?: string;
  panenId?: string;
  sumberPanen: string;
  komoditas: string;
  varietas: string;
  petani?: string;
  petaniKode?: string;
  lahan?: string;
  tanggalPanen?: string;
  tanggalMasuk: string;
  beratMasuk: number;
  kadarAir: number;
  lokasi: string;
  lokasiDetail?: string;
  status?: string;
  kondisiFisik?: string;
  petugasPenerima?: string;
  catatan?: string;
  foto?: string;
}

export interface GetGudangBahanParams {
  page?: number;
  limit?: number;
  search?: string;
  komoditas?: string;
  varietas?: string;
  status?: string;
  lokasi?: string;
  startDate?: string;
  endDate?: string;
}
