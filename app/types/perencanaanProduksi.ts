export interface PerencanaanProduksi {
  id: string;
  noPerencanaan: string;
  commodityId?: string | null;
  komoditas: string;
  varietyId?: string | null;
  varietas: string;
  targetProduksi: number; // in kg
  aktualProduksi: number; // in kg (terpenuhi)
  produksiTerpenuhi: number; // % persentase terpenuhi
  targetLuasLahan: number; // in ha
  lahanTersedia: number; // in ha
  realisasiTanam: number; // in ha
  periode: string; // e.g. "Okt - Des 2026"
  periodeMulai?: string | null;
  periodeSelesai?: string | null;
  metodeTanam: string; // "Pindah Tanam" | "Tanam Langsung"
  kebutuhanBenih: number; // in kg
  estimasiHasilPerHa: number; // in kg/ha
  partnerId?: string | null;
  namaPetani?: string | null;
  greenhouseId?: string | null;
  namaLahan?: string | null;
  status: 'Draft' | 'Disetujui' | 'Proses' | 'Selesai' | 'Dibatalkan' | string;
  catatan?: string | null;
  estimasiPanen?: string | null;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PerencanaanStats {
  totalRencana: number;
  totalTargetProduksi: number;
  totalAktualProduksi: number;
  totalKebutuhanBenih: number;
  totalLuasLahan: number;
  jumlahPetani: number;
  persenTerpenuhiRataRata: number;
}

export interface PerencanaanFilterParams {
  search?: string;
  periode?: string;
  status?: string;
  komoditas?: string;
  varietas?: string;
  namaPetani?: string;
  page?: number;
  limit?: number;
}
