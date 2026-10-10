import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { dashboardQcService } from '@/app/services/dashboardQcService';
import { DashboardQc } from '@/app/types/dashboardQc';
import { getErrorMessage, toDateInputValue } from '@/app/lib/format';

const DEFAULT_RANGE_DAYS = 30;

const defaultPeriode = () => {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (DEFAULT_RANGE_DAYS - 1));
  return { startDate: toDateInputValue(start), endDate: toDateInputValue(end) };
};

/** Data Dashboard QC untuk periode terpilih (default 30 hari terakhir). */
export function useDashboardQc() {
  const [periode, setPeriode] = useState(defaultPeriode);
  const [data, setData] = useState<DashboardQc | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    try {
      const res = await dashboardQcService.get(periode);
      if (current === requestId.current) setData(res.data);
    } catch (err) {
      if (current === requestId.current) toast.error(getErrorMessage(err, 'Gagal memuat dashboard QC'));
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [periode]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, periode, setPeriode, reload: load };
}
