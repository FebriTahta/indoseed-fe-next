import { Commodity } from './commodity';
import { MasterParameterOption } from './parameter';

export interface VarietyBrand {
  id: string;
  namaMerk: string;
  tipe: string;
  status: 'Aktif' | 'Tidak Aktif';
  keterangan?: string;
}

export interface VarietyCharacteristicItem {
  id: string;
  parameterId?: string;
  kode?: string;
  parameter: string;
  tipeNilai?: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
  nilai: string;
  satuan: string;
  keterangan?: string;
  isUsed?: boolean;
  options?: MasterParameterOption[];
}

export interface VarietyProductionParam {
  umurPanen?: string;
  satuanUmurPanen?: string;
  jarakTanam?: string;
  satuanJarakTanam?: string;
  populasiTanaman?: string;
  satuanPopulasi?: string;
  kebutuhanBenih?: string;
  satuanKebutuhanBenih?: string;
  musimTanam?: string;
  targetProduksi?: string;
  satuanTargetProduksi?: string;
  perkiraanHasil?: string;
  satuanPerkiraanHasil?: string;
  tingkatKeberhasilan?: string;
  satuanProduksi?: string;
  jarakIsolasi?: string;
  satuanJarakIsolasi?: string;
  sumberBenihAwal?: string;
  standarProduksi?: string;
  catatanProduksi?: string;
}

export interface VarietyQCParamItem {
  id: string;
  parameterId?: string;
  kode?: string;
  parameter: string;
  tipeNilai?: 'NUMBER' | 'TEXT' | 'OPTION' | 'RANGE' | 'BOOLEAN';
  nilaiMinimal: string;
  nilaiMaksimal: string;
  satuan: string;
  keterangan: string;
  isUsed?: boolean;
}

export interface VarietyQCConfig {
  statusQc?: 'Wajib QC' | 'Tidak Wajib';
  metodePengujian?: string;
  frekuensiPengujian?: string;
  sampling?: string;
  masaBerlakuHasilUji?: string;
  parameters?: VarietyQCParamItem[];
  standarAcuan?: string;
  noDokumenReferensi?: string;
  catatanQc?: string;
}

export interface VarietyPackagingItem {
  id: string;
  kemasan: string;
  isi: string;
  satuan: string;
  status: 'Aktif' | 'Tidak Aktif';
}

export interface VarietyInventoryConfig {
  kelolaStok?: 'Ya' | 'Tidak';
  satuanStok?: string;
  satuanKemasan?: string;
  konversiJumlah?: string;
  konversiSatuanAwal?: string;
  konversiNilai?: string;
  konversiSatuanAkhir?: string;
  metodeStok?: string;
  minimumStok?: string;
  maksimumStok?: string;
  statusInventory?: string;
  wajibNomorLot?: 'Ya' | 'Tidak';
  wajibTanggalProduksi?: 'Ya' | 'Tidak';
  wajibTanggalKadaluarsa?: 'Ya' | 'Tidak';
  wajibNomorSertifikat?: 'Ya' | 'Tidak';
  traceabilityLot?: 'Aktif' | 'Tidak Aktif';
  masaBerlakuHasilUji?: string;
  catatan?: string;
  kemasanList?: VarietyPackagingItem[];
}

export interface VarietyDocItem {
  id: string;
  namaDokumen: string;
  jenisDokumen: string;
  berlakuUntuk: string;
  nomorDokumen: string;
  tanggalDokumen: string;
  fileName: string;
  fileSize: string;
  fileType?: string;
  fileUrl?: string;
  keterangan?: string;
}

export interface Variety {
  id: string;
  kodeVarietas: string;
  namaVarietas: string;
  commodityId: string;
  asalPemulia: string;
  tahunRilis: number | null;
  deskripsi: string;
  umurTanam: string;
  tinggiTanaman: string;
  bentukBiji: string;
  warnaGabah: string;
  potensiHasil: string;
  anjuranDataran: string;
  status: 'Aktif' | 'Tidak Aktif';
  image: string;
  tglDibuat: string;
  dibuatOleh: string;
  tglDiubah: string;
  diubahOleh: string;
  commodity: Commodity;

  // Extended fields for richer layout & tabs
  brands?: VarietyBrand[];
  kategoriBenih?: string;
  sumberBenih?: string;
  namaInternal?: string;
  tglMulaiDigunakan?: string;
  karakteristikList?: VarietyCharacteristicItem[];
  ketahananPenyakit?: string;
  toleransiCuaca?: string;
  catatanKarakteristik?: string;
  produksiParam?: VarietyProductionParam;
  qcConfig?: VarietyQCConfig;
  inventoryConfig?: VarietyInventoryConfig;
  documents?: VarietyDocItem[];
}
