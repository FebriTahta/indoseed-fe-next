"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import StatsWidgets, { StatItem } from "@/app/(components)/(content-layout)/shared/StatsWidgets";
import FilterRow, { FilterSelectConfig } from "@/app/(components)/(content-layout)/shared/FilterRow";
import { ViewIconButton } from "@/app/(components)/(content-layout)/shared/ActionButtons";
import QcCard from "../../shared/QcCard";
import QcStatusBadge from "../../shared/QcStatusBadge";
import QcTimeline from "../../shared/QcTimeline";
import HasilDetailPanel from "./HasilDetailPanel";
import { summarizeParameters } from "../utils";
import { pendingStepsFor } from "../../shared/qcFlow";
import { pemeriksaanPengujianService } from "@/app/services/pemeriksaanPengujianService";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useHasilDetail } from "@/app/hooks/useHasilDetail";
import { useKomoditasOptions, usePengujiOptions, useQcMeta } from "@/app/hooks/useQcReference";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { HASIL_TIDAK_VALID, HasilSummary, PermintaanPengujian, QC_STATUS, QcListParams } from "@/app/types/qc";
import { formatDateTime, formatNumber } from "@/app/lib/format";

type Option = { value: string; label: string };
type HasilFilters = Pick<QcListParams, "search" | "status" | "hasilAkhir" | "komoditas" | "petugasQcId">;

const INITIAL_FILTERS: HasilFilters = { search: "", status: "", hasilAkhir: "", komoditas: "", petugasQcId: "" };
const EMPTY_SUMMARY: HasilSummary = { total: 0, menungguReview: 0, lulus: 0, tidakLulus: 0, tidakValid: 0 };
const HEADERS = ["No.", "No. Pengujian", "Tgl Pengujian", "Batch", "Komoditas / Varietas", "Sampel", "Hasil", "Status", "Aksi"];

const toOptions = (values: string[]): Option[] => values.map((v) => ({ value: v, label: v }));

const toOption = (options: Option[], value?: string) =>
  value ? options.find((o) => o.value === value) || { value, label: value } : null;

const persen = (part: number, total: number) => (total ? `${Math.round((part / total) * 100)}% dari total` : "-");

/** Tidak valid diutamakan; hasil selesai ditampilkan dengan kesimpulannya, selain itu status prosesnya. */
const statusTampil = (item: PermintaanPengujian) => {
  if (item.hasilTidakValid) return HASIL_TIDAK_VALID;
  return item.status === QC_STATUS.SELESAI && item.hasilAkhir ? item.hasilAkhir : item.status;
};

const HasilPengujianList = () => {
  const { meta } = useQcMeta();
  const { options: komoditasOptions } = useKomoditasOptions();
  // Penguji hanya melihat hasil miliknya, sehingga filter analis tidak relevan.
  const { ready, isPenguji } = useCurrentUser();
  const { options: petugasOptions } = usePengujiOptions(ready && !isPenguji);
  const [summary, setSummary] = useState<HasilSummary>(EMPTY_SUMMARY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** Pilih otomatis data teratas (terbaru) pada muatan awal & setiap filter berubah. */
  const autoSelectRef = useRef(true);

  const list = usePaginatedList<PermintaanPengujian, HasilFilters>(
    (params) => pemeriksaanPengujianService.getHasilList({ ...params, sortBy: "updatedAt", sortOrder: "desc" }),
    INITIAL_FILTERS
  );
  const { filters, items, loading, reload, setFilters: applyFilters, resetFilters: applyReset } = list;

  const loadSummary = useCallback(() => {
    pemeriksaanPengujianService
      .getHasilSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Gagal memuat ringkasan hasil:", err));
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    if (loading || !autoSelectRef.current) return;
    autoSelectRef.current = false;
    setSelectedId(items[0]?.id ?? null);
  }, [items, loading]);

  const refreshAfterReview = useCallback(() => {
    reload();
    loadSummary();
  }, [reload, loadSummary]);

  const detail = useHasilDetail(selectedId, refreshAfterReview);

  const setFilters = (patch: Partial<HasilFilters>) => {
    autoSelectRef.current = true;
    applyFilters(patch);
  };

  const resetFilters = () => {
    autoSelectRef.current = true;
    applyReset();
  };

  const statItems: StatItem[] = useMemo(() => {
    const selesai = summary.lulus + summary.tidakLulus;
    return [
      { title: "Total Hasil Pengujian", value: summary.total, subtitle: "Menunggu review & selesai", icon: "ri-file-list-3-line", bgColor: "bg-blue-50", textColor: "text-blue-600" },
      { title: "Menunggu Review", value: summary.menungguReview, subtitle: "Perlu direview", icon: "ri-time-line", bgColor: "bg-amber-50", textColor: "text-amber-600" },
      { title: "Lulus", value: summary.lulus, subtitle: persen(summary.lulus, selesai), icon: "ri-checkbox-circle-line", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
      { title: "Tidak Lulus", value: summary.tidakLulus, subtitle: persen(summary.tidakLulus, selesai), icon: "ri-close-circle-line", bgColor: "bg-rose-50", textColor: "text-rose-600" },
      { title: "Tidak Valid", value: summary.tidakValid ?? 0, subtitle: "Perlu pengujian ulang", icon: "ri-error-warning-line", bgColor: "bg-red-50", textColor: "text-red-600" },
    ];
  }, [summary]);

  const statusOptions = useMemo(() => toOptions(meta.hasilStatuses), [meta.hasilStatuses]);
  const hasilOptions = useMemo(() => toOptions(meta.hasilAkhir), [meta.hasilAkhir]);

  const selectFilter = (
    key: keyof Omit<HasilFilters, "search">,
    options: Option[],
    placeholder: string,
    widthClass: string
  ): FilterSelectConfig => ({
    value: toOption(options, filters[key]),
    onChange: (val: Option | null) => setFilters({ [key]: val?.value || "" }),
    options,
    placeholder,
    widthClass,
  });

  const filterConfig: FilterSelectConfig[] = [
    selectFilter("status", statusOptions, "Status", "sm:w-40"),
    selectFilter("hasilAkhir", hasilOptions, "Kesimpulan", "sm:w-36"),
    selectFilter("komoditas", komoditasOptions, "Komoditas", "sm:w-36"),
    ...(isPenguji ? [] : [selectFilter("petugasQcId", petugasOptions, "Analis", "sm:w-44")]),
  ];

  const renderRow = (item: PermintaanPengujian, index: number) => {
    const { aktif, lulus } = summarizeParameters(item.parameters);
    const selected = selectedId === item.id;
    return (
      <tr
        key={item.id}
        onClick={() => setSelectedId(item.id)}
        aria-selected={selected}
        className={`border-b border-defaultborder cursor-pointer transition-colors text-xs ${
          selected ? "bg-emerald-50/60" : "hover:bg-gray-50"
        }`}
      >
        <td className="p-3 text-center text-gray-500">{(list.page - 1) * list.pageSize + index + 1}</td>
        <td className="p-3 font-semibold text-emerald-700 whitespace-nowrap">{item.noPengujian || item.noPermintaan}</td>
        <td className="p-3 whitespace-nowrap">{formatDateTime(item.tanggalSelesaiUji)}</td>
        <td className="p-3 whitespace-nowrap">{item.kodeBatch}</td>
        <td className="p-3 whitespace-nowrap">
          {item.komoditas || "-"} / {item.varietas || "-"}
        </td>
        <td className="p-3 whitespace-nowrap">
          {formatNumber(item.jumlahSampel)} {item.satuanSampel || ""}
        </td>
        <td className="p-3 whitespace-nowrap">
          {lulus}/{aktif.length}
        </td>
        <td className="p-3">
          <QcStatusBadge status={statusTampil(item)} />
        </td>
        <td className="p-3" onClick={(e) => e.stopPropagation()}>
          <ViewIconButton onClick={() => setSelectedId(item.id)} />
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      <StatsWidgets items={statItems} columns={5} />

      <FilterRow
        search={filters.search || ""}
        onSearchChange={(val) => setFilters({ search: val })}
        searchPlaceholder="Cari no. pengujian, batch..."
        selectFilters={filterConfig}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className={`space-y-4 ${selectedId ? "xl:col-span-8" : "xl:col-span-12"}`}>
          <DataTable
            headers={HEADERS}
            items={items}
            renderRow={renderRow}
            currentPage={list.page}
            pageSize={list.pageSize}
            totalPages={list.totalPages}
            totalRecords={list.total}
            onPageChange={list.setPage}
            onPageSizeChange={list.setPageSize}
            headerTextSize="11px"
            bodyTextSize="11px"
            isLoading={loading}
            emptyMessage="Belum ada hasil pengujian."
          />

          {detail.data && (
            <QcCard title={`Timeline Proses — ${detail.data.noPengujian || detail.data.noPermintaan}`} icon="ri-route-line">
              <QcTimeline
                orientation="horizontal"
                items={detail.data.riwayat || []}
                pendingSteps={pendingStepsFor(detail.data.status)}
              />
            </QcCard>
          )}
        </div>

        {selectedId && (
          <div className="xl:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 xl:sticky xl:top-20">
            <HasilDetailPanel state={detail} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HasilPengujianList;
