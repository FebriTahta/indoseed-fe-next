export interface TraceabilityStep {
  stage: number;
  name: string;
  code: string;
  date: string;
  detail1: string;
  detail2?: string;
  icon: string;
}

export interface ActivityTimelineItem {
  stageName: string;
  dateTime: string;
  actor: string;
  location: string;
  note: string;
  icon: string;
}

export interface DistributionInfo {
  customer: string;
  alamat: string;
  noDo: string;
  tanggalKirim: string;
  tanggalTerima: string;
  transporter: string;
  noResi: string;
}

export interface SupportDocument {
  name: string;
  size: string;
}

export interface BatchInfoData {
  kodeBatch: string;
  lotNo: string;
  komoditas: string;
  varietas: string;
  kelasBenih: string;
  totalProduksi: string;
  tanggalProduksi: string;
  tanggalExpired: string;
  statusBatch: string;
  deskripsi: string;
}
