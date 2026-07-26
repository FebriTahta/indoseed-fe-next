export interface JadwalTanam {
  informasiUmum: InformasiUmum;
  lahanKomoditas: LahanKomoditas;
  rencanaTanam: RencanaTanam;

  status: string;
  catatan?: string;
  dokumenPendukung?: File | null;
  
}

export interface InformasiUmum {
  kodeJadwalTanam: string;

  periodeTanamMulai: string;
  periodeTanamSelesai: string;

  musimTanam: string;
  tujuanProduksi: string;
  tipeProduksi: string;

  statusJadwal: StatusJadwal;
  penanggungJawab: string;

  deskripsi?: string;
}

export interface LahanKomoditas {
  idLahan: string;
  namaLahan?: string;

  luasTanam: number;

  komoditas: string;
  varietas: string;

  idBenih: string;
  asalBenih?: string;
  hasilBenih?: string;

  jumlahBenihDiperlukan: number;

  jarakTanam: string;
  sistemTanam: string;

  petaLahan?: File | null;
  koordinatLahan?: [];
}

export interface RencanaTanam {
  tanggalPersemaian: string;
  tanggalTanam: string;
  perkiraanPanen: string;

  siklusTanam: string;
  siklusTanamHari: number;

  metodeTanam: string;
  kepadatanTanam: number;

  irigasi: string;
  sumberAir: string;

  periodeTanam?: string;
  catatan?: string;

}


export interface RencanaTanamDetail {

  id: string;

  idLahan: string;
  namaLahan: string;

  luasTanam: string;
  komoditas: string;
  varietas: string;

  tipeLahan: string;
  tanggalTanam: string;
  populasiTanam: string;
  irigasi: string;
}

export interface TargetProduksi {
  luasTanam: number;
  targetProduksi: number;
  varietas: string;
  kualitas: string;
  PersenKecambahanMin: number;

}

export interface CatatanTambahan {
  catatan?: string;
  dokumen?: File | null;
}

export type StatusJadwal =
  | "Draft"
  | "Direncanakan"
  | "Disetujui"
  | "Berjalan"
  | "Selesai"
  | "Dibatalkan";

export interface SelectOption {
  value: string;
  label: string;
}

export interface InformasiLahan {
    idLahan: string;

    luasTanam: number;

    statusLahan: string;
    tipeLahan: string;

    koordinat: string;
    ketinggian: number;

    jenisTanah: string;
    phTanah: number;

    sumberAir: string;
    jarakSumberAir: number;

    sistemIrigasi: string;
    ketersediaanAir: string;
}

export interface PersyaratanIsolasi {
  jarakIsolasi: number;
  tanamanSekeliling: string;
  jarakTanam: number;
}