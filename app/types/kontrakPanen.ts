export interface KontrakPanen {
  id: string;
  noKontrak: string;
  commodityId?: string | null;
  komoditas: string;
  varietyId?: string | null;
  varietas: string;
  harvestTypeId?: string | null;
  tipePanenan: string; // 'Glondong / Fresh' | 'OC / Benih'
  nilaiKontrak: number;
  satuan: string;
  umurPanen: number; // HST
  periodeMulai?: string | null;
  periodeSelesai?: string | null;
  status: string; // 'Aktif' | 'Tidak Aktif' | 'Draft'
  keterangan?: string | null;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt: string;
  updatedAt: string;
  commodity?: {
    id: string;
    namaKomoditas: string;
    kodeKomoditas?: string;
    image?: string;
  } | null;
  variety?: {
    id: string;
    namaVarietas: string;
    kodeVarietas?: string;
    image?: string;
    umurTanam?: string;
  } | null;
}

export interface KontrakPanenFilterParams {
  search?: string;
  komoditas?: string;
  varietas?: string;
  tipePanenan?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface KontrakPanenStats {
  total: number;
  aktif: number;
  tidakAktif: number;
  draft: number;
}

export interface KontrakPanenFormData {
  noKontrak?: string;
  commodityId?: string;
  komoditas: string;
  varietyId?: string;
  varietas: string;
  harvestTypeId?: string;
  tipePanenan: string;
  nilaiKontrak: number | string;
  satuan: string;
  umurPanen: number | string;
  periodeMulai: string;
  periodeSelesai: string;
  status: string;
  keterangan?: string;
}
