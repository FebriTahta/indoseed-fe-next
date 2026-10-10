import { QC_STATUS } from '@/app/types/qc';

/** Tahapan alur QC yang belum dilalui, untuk ditampilkan sebagai "menunggu" di timeline. */
export const pendingStepsFor = (status?: string | null): string[] => {
  switch (status) {
    case QC_STATUS.MENUNGGU_PERSETUJUAN:
      return ['Persetujuan permintaan', 'Penerimaan sampel', 'Input hasil pengujian', 'Review hasil'];
    case QC_STATUS.SAMPLING:
      return ['Penerimaan sampel', 'Input hasil pengujian', 'Review hasil'];
    case QC_STATUS.DALAM_PENGUJIAN:
      return ['Submit hasil untuk review', 'Review hasil'];
    case QC_STATUS.MENUNGGU_REVIEW:
      return ['Review hasil'];
    default:
      return [];
  }
};
