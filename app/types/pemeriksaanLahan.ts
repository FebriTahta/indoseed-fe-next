export interface TemuanOffTypeItem {
  no: number;
  jenisKarakter: string;
  jumlah: number;
  keterangan: string;
}

export interface RoguingInfo {
  status?: string;
  tanggalRencana?: string | null;
  petugas?: string;
  catatan?: string;
}

export interface RiwayatPemeriksaanItem {
  tanggal: string;
  aktivitas: string;
  status: string;
}

export interface PemeriksaanLahanItem {
  id: string;
  noPemeriksaan: string;
  pemeriksaanKe: number;
  jadwalTanamId?: string | null;
  kodeJadwalTanam: string;
  tanggalPemeriksaan: string;
  komoditas: string;
  varietas: string;
  petani: string;
  lahan: string;
  fase: string;
  petugasQc: string;
  persentaseKemurnian: number;
  status: 'Memenuhi' | 'Perlu Roguing' | 'Tidak Memenuhi' | string;
  jumlahTanamanDiamati: number;
  tanamanSesuai: number;
  tanamanOffType: number;
  keterangan?: string;
  catatan?: string;
  temuanOffType?: TemuanOffTypeItem[];
  dokumentasi?: string[];
  roguingData?: RoguingInfo;
  riwayatData?: RiwayatPemeriksaanItem[];
  dibuatOleh?: string;
  diubahOleh?: string;
  createdAt?: string;
  updatedAt?: string;
  jadwalTanam?: any;
}

export interface PemeriksaanStats {
  totalPemeriksaan: number;
  memenuhiStandar: number;
  perluRoguing: number;
  tidakMemenuhi: number;
  rataRataKemurnian: string | number;
  tabCounts: {
    semua: number;
    pemeriksaan: number;
    offType: number;
    roguing: number;
    selesai: number;
  };
}

export interface ReferensiJadwalTanamItem {
  id: string;
  kodeJadwalTanam: string;
  komoditas: string;
  varietas: string;
  namaPetani: string;
  kodePetani?: string;
  luasTanam: number;
  periodeTanam?: string;
  tanggalTanam?: string;
  perkiraanPanen?: string;
  statusJadwal: string;
  detailLahan?: any[];
  partner?: any;
  commodity?: any;
  variety?: any;
  persetujuanProduksi?: any;
}
