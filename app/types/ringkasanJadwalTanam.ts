export interface RingkasanJadwal {
  komoditas: string;
  varietas: string;
  lahan: string;

  luasTanam: number;

  periodeTanam: {
    tanggalMulai: string;
    tanggalSelesai: string;
  };

  perkiraanPanen: string;

  jumlahBenih: number;

  tujuanProduksi: string;
  tipeProduksi: string;
}

export interface InformasiBenih {
  nomorBatch: string;
  asalBenih: string;

  tanggalProduksi: string;

  dayaBerkecambah: number;
  kemurnian: number;
  kadarAir: number;
}