export type ManajemenStokTab =
  | 'benih-bersih'
  | 'packing-internal'
  | 'packing-customer'
  | 'bahan-treatment'
  | 'barang-umum';

export interface QcReferenceInfo {
  noPermintaan?: string;
  noPengujian?: string;
  tanggalPengujian?: string;
  hasilAkhir?: 'Lulus' | 'Tidak Lulus' | 'Dalam Pengujian' | 'Karantina';
  dayaBerkecambah?: number;
  kadarAir?: number;
  kemurnianFisik?: number;
  petugasQc?: string;
  catatanQc?: string;
}

export interface StokBenihBersihItem {
  id: string;
  noLot: string;
  varietas: string;
  komoditas: string;
  kelas: 'BS' | 'BD' | 'BP' | 'BR';
  kodeBatch: string;
  batchProduksiId?: string | null;
  gudang: string;
  lokasi: string;
  stokFisik: number;
  dialokasikan: number;
  tersedia: number;
  statusQc: 'Lolos QC' | 'Karantina' | 'Ditahan';
  tglMasuk: string;
  qcReference?: QcReferenceInfo;
}

export interface NonBenihStokItem {
  id: string;
  kodeBarang: string;
  namaBarang: string;
  kategori: string;
  satuan: string;
  gudang: string;
  lokasi: string;
  stokFisik: number;
  dialokasikan: number;
  tersedia: number;
  stokMin: number;
  statusStok: 'Aman' | 'Menipis' | 'Kritis';
  tglMasuk: string;
  keterangan?: string;
}

export interface KomposisiStokData {
  totalStok: number;
  lolosQc: {
    kg: number;
    percent: number;
  };
  karantina: {
    kg: number;
    percent: number;
  };
  ditahan: {
    kg: number;
    percent: number;
  };
  dialokasikan: {
    kg: number;
    percent: number;
  };
}

export interface RingkasanStatusData {
  belumDiproses: number;
  karantina: number;
  lolosQc: number;
}

export interface ManajemenStokStats {
  totalSkuAktif: number;
  totalLotBenihBersih: number;
  stokMinimum: number;
  stokDitahan: number;
  komposisi: KomposisiStokData;
  ringkasanStatus: RingkasanStatusData;
}

export interface KartuStokItem {
  tanggal: string;
  noTransaksi: string;
  jenisTransaksi: string;
  masukKg: number;
  keluarKg: number;
  sisaKg: number;
  keterangan: string;
  petugas: string;
}

