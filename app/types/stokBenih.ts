export interface StokBenihItem {
  id?: string;
  no?: number;
  produkBenih: string;
  kategoriBenih?: string;
  batchLot: string;
  tanggalProduksi: string;
  expired: string;
  gudang: string;
  stokKg: number;
  reservedKg: number;
  availableKg: number;
  dayaTumbuh: number;
  status: 'Aman' | 'Exp < 30 Hari' | 'Expired' | string;
  keterangan?: string;
}

export interface TopProdukStok {
  produkBenih: string;
  stokKg: number;
  persentase: number;
}
