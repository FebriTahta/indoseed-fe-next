export interface SelectOption {
  value: string;
  label: string;
}

export interface InformasiUmum {
  kodeJadwalTanam: string;
  penanggungJawab: string;
  periodeTanamMulai: string;
  periodeTanamSelesai: string;
  musimTanam: string;
  tujuanProduksi: string;
  tipeProduksi: string;
  statusJadwal: string;
  deskripsi?: string;
  periodeTanam?: string;
}

export interface LahanKomoditas {
  idLahan: string;
  namaLahan?: string;
  luasTanam: number;
  komoditas: string;
  namaKomoditas?: string;
  varietas: string;
  namaVarietas?: string;
  idBenih?: string;
  asalBenih?: string;
  hasilBenih?: string;
  jumlahBenihDiperlukan: number;
  jarakTanam: string;
  sistemTanam: string;
  petaLahan?: File | null;
  koordinatLahan?: any[];
}

export interface RencanaTanam {
  tanggalPersemaian: string;
  tanggalTanam: string;
  perkiraanPanen: string;
  siklusTanam?: string;
  siklusTanamHari: number;
  metodeTanam: string;
  kepadatanTanam: number;
  irigasi: string;
  sumberAir: string;
  periodeTanam?: string;
  catatan?: string;
}

export interface CatatanTambahan {
  catatan?: string;
  dokumenFiles?: any[];
}

export interface InformasiLahan {
  luasTanam: number;
  kepadatanTanam: number;
  jumlahBenih: number;
  metodeTanam: string;
  irigasi: string;
  sumberAir: string;
}

export interface JadwalTanamDetail {
  id?: string;
  jadwalTanamId?: string;
  greenhouseId?: string | null;
  namaLahan: string;
  kodeLahan?: string | null;
  luas: number;
  tipeLahan?: string | null;
  irigasi?: string | null;
  sumberAir?: string | null;
  komoditasVarietas?: string | null;
  rencanaTanam?: string | Date | null;
  estimasiPanen?: string | Date | null;
  targetProduksi?: number | null;
  statusLahan?: string | null;
  keterangan?: string | null;
}

export interface JadwalTanamPersonil {
  id?: string;
  jadwalTanamId?: string;
  nama: string;
  peran: string;
  kontak?: string | null;
  tugas?: string | null;
}

export interface JadwalTanamPeralatan {
  id?: string;
  jadwalTanamId?: string;
  nama: string;
  jenis: string;
  jumlah: number;
  satuan: string;
  kondisi: string;
}

export interface JadwalTanamDokumen {
  id?: string;
  jadwalTanamId?: string;
  nama: string;
  fileUrl: string;
  fileSize?: string | null;
  fileType?: string | null;
  uploadedAt?: string | Date;
}

export interface JadwalTanam {
  id: string;
  kodeJadwalTanam: string;
  perencanaanProduksiId?: string | null;
  partnerId?: string | null;
  namaPetani?: string | null;
  kodePetani?: string | null;
  komoditas?: string | null;
  varietas?: string | null;
  periodeTanam?: string | null;
  periodeTanamMulai?: string | Date | null;
  periodeTanamSelesai?: string | Date | null;
  musimTanam?: string | null;
  tujuanProduksi?: string | null;
  tipeProduksi?: string | null;
  statusJadwal: string;
  penanggungJawab?: string | null;
  deskripsi?: string | null;
  keterangan?: string | null;

  greenhouseId?: string | null;
  commodityId?: string | null;
  varietyId?: string | null;
  luasTanam?: number;
  asalBenih?: string | null;
  jumlahBenihDiperlukan?: number;
  jarakTanam?: string | null;
  sistemTanam?: string | null;
  targetProduksi?: number;
  estimasiHasilPerHa?: number;
  standarKualitas?: string | null;
  perkecambahanMin?: number | null;

  tanggalPersemaian?: string | Date | null;
  tanggalTanam?: string | Date | null;
  perkiraanPanen?: string | Date | null;
  siklusTanamHari?: number;
  metodeTanam?: string | null;
  kepadatanTanam?: string | null;
  irigasi?: string | null;
  sumberAir?: string | null;
  catatan?: string | null;

  status?: string;
  dibuatOleh?: string | null;
  diubahOleh?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  commodity?: {
    id: string;
    kodeKomoditas: string;
    namaKomoditas: string;
  } | null;
  variety?: {
    id: string;
    kodeVarietas: string;
    namaVarietas: string;
  } | null;
  partner?: {
    id: string;
    kodePetani: string;
    namaPetani: string;
    noTelepon?: string;
    kelompokTani?: string;
  } | null;
  greenhouse?: {
    id: string;
    kodeLahan: string;
    namaLahan: string;
  } | null;
  perencanaanProduksi?: {
    id: string;
    noPerencanaan: string;
    komoditas: string;
    varietas: string;
    targetProduksi?: number;
    periode?: string;
  } | null;

  detailLahan?: JadwalTanamDetail[];
  personil?: JadwalTanamPersonil[];
  peralatan?: JadwalTanamPeralatan[];
  dokumen?: JadwalTanamDokumen[];

  // Legacy wrappers for backward compatibility
  informasiUmum?: InformasiUmum;
  lahanKomoditas?: LahanKomoditas;
  rencanaTanam?: RencanaTanam;
}

export interface JadwalTanamStats {
  total: number;
  dalamProses: number;
  disetujui: number;
  revisi: number;
  ditolak: number;
  trends?: {
    total: string;
    dalamProses: string;
    disetujui: string;
    revisi: string;
    ditolak: string;
  };
}

export interface CreateJadwalTanamPayload {
  kodeJadwalTanam?: string;
  perencanaanProduksiId?: string | null;
  partnerId?: string | null;
  namaPetani?: string | null;
  kodePetani?: string | null;
  komoditas?: string | null;
  varietas?: string | null;
  periodeTanam?: string | null;
  periodeTanamMulai?: string | null;
  periodeTanamSelesai?: string | null;
  musimTanam?: string | null;
  tujuanProduksi?: string | null;
  tipeProduksi?: string | null;
  statusJadwal?: string;
  penanggungJawab?: string | null;
  deskripsi?: string | null;
  keterangan?: string | null;

  greenhouseId?: string | null;
  commodityId?: string | null;
  varietyId?: string | null;
  luasTanam?: number;
  asalBenih?: string | null;
  jumlahBenihDiperlukan?: number;
  jarakTanam?: string | null;
  sistemTanam?: string | null;
  targetProduksi?: number;
  estimasiHasilPerHa?: number;
  standarKualitas?: string | null;
  perkecambahanMin?: number | null;

  tanggalPersemaian?: string | null;
  tanggalTanam?: string | null;
  perkiraanPanen?: string | null;
  siklusTanamHari?: number;
  metodeTanam?: string | null;
  kepadatanTanam?: string | null;
  irigasi?: string | null;
  sumberAir?: string | null;
  catatan?: string | null;

  detailLahan?: JadwalTanamDetail[];
  personil?: JadwalTanamPersonil[];
  peralatan?: JadwalTanamPeralatan[];
  dokumen?: JadwalTanamDokumen[];
}