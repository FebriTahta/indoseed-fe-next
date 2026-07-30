export interface TreatmentBatchItem {
  no: number;
  kodeBatch: string;
  komoditas: string;
  varietas: string;
  treatment: string;
  dosis: string;
  operator: string;
  beratAwal: number;
  beratAkhir: number;
  loss: number;
  tanggalSelesai: string;
  status: 'Selesai' | 'Proses' | 'Pending';
}

export interface ProsesTreatmentAktifItem {
  kodeBatch: string;
  komoditas: string;
  varietas: string;
  lokasi: string;
  treatment: string;
  dosis: string;
  operator: string;
  beratAwal: number;
  beratAkhir: number;
  loss: number;
  mulai: string;
  selesaiEstimasi: string;
  progress: number;
  status: 'Proses' | 'Selesai' | 'Pending';
}
