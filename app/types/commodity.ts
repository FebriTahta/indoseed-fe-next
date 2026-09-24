export interface CommodityVariety {
  id: string;
  kodeVarietas: string;
  namaVarietas: string;
  umurTanam?: string | null;
  status?: string;
}

export interface Commodity {
  id: string;
  kodeKomoditas: string;
  namaKomoditas: string;
  kategori: string;
  satuanHasil?: string;
  deskripsi: string;
  status: 'Aktif' | 'Tidak Aktif' | 'Nonaktif';
  image?: string;
  tglDibuat?: string;
  dibuatOleh?: string;
  tglDiubah?: string;
  diubahOleh?: string;
  _count?: {
    varieties: number;
  };
  varieties?: CommodityVariety[];
}
