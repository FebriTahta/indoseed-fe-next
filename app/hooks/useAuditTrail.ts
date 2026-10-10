import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { usePaginatedList } from '@/app/hooks/usePaginatedList';
import { auditTrailService } from '@/app/services/auditTrailService';
import { AuditFilters, AuditLog, AuditOptions, AuditSummary } from '@/app/types/auditTrail';
import { getErrorMessage } from '@/app/lib/format';

export const EMPTY_AUDIT_FILTERS: AuditFilters = {
  search: '',
  username: '',
  modul: '',
  aksi: '',
  entitas: '',
  startDate: '',
  endDate: '',
};

const EMPTY_OPTIONS: AuditOptions = { pengguna: [], modul: [], entitas: [], aksi: [] };

/** State halaman Audit Trail: daftar terfilter, ringkasan, opsi filter, baris terpilih, dan ekspor. */
export function useAuditTrail() {
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [options, setOptions] = useState<AuditOptions>(EMPTY_OPTIONS);
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [exporting, setExporting] = useState(false);

  const list = usePaginatedList<AuditLog, AuditFilters>((params) => auditTrailService.getList(params), EMPTY_AUDIT_FILTERS);
  const { filters, setFilters, resetFilters } = list;

  useEffect(() => {
    auditTrailService
      .getSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.error('Gagal memuat ringkasan audit:', err));
    auditTrailService
      .getOptions()
      .then((res) => setOptions(res.data))
      .catch((err) => console.error('Gagal memuat opsi filter audit:', err));
  }, []);

  // Detail dibuka hanya saat pengguna memilih baris; ganti filter menutup detail yang tidak lagi relevan.
  const applyFilters = useCallback(
    (next: AuditFilters) => {
      setSelected(null);
      setFilters(next);
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setSelected(null);
    resetFilters();
  }, [resetFilters]);

  const exportCsv = useCallback(async () => {
    setExporting(true);
    try {
      await auditTrailService.exportCsv(filters);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Gagal mengekspor audit trail'));
    } finally {
      setExporting(false);
    }
  }, [filters]);

  return { list, summary, options, selected, setSelected, applyFilters, clearFilters, exportCsv, exporting };
}
