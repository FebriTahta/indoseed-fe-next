"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import StatsWidgets, { StatItem } from "@/app/(components)/(content-layout)/shared/StatsWidgets";
import FilterRow, { FilterSelectConfig } from "@/app/(components)/(content-layout)/shared/FilterRow";
import { ViewIconButton } from "@/app/(components)/(content-layout)/shared/ActionButtons";
import QcStatusBadge from "../../shared/QcStatusBadge";
import HasilDetailPanel from "./HasilDetailPanel";
import { pemeriksaanPengujianService } from "@/app/services/pemeriksaanPengujianService";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useKomoditasOptions, usePengujiOptions, useQcMeta } from "@/app/hooks/useQcReference";
import { HASIL_AKHIR, HasilSummary, PermintaanPengujian, QcListParams } from "@/app/types/qc";
import { formatDate, formatNumber } from "@/app/lib/format";

const toOption = (options: { value: string; label: string }[], value?: string) =>
  value ? options.find((o) => o.value === value) || { value, label: value } : null;

const persen = (part: number, total: number) => (total ? `${Math.round((part / total) * 100)}% dari total` : "-");

const HasilPengujianList = () => {
  const { meta } = useQcMeta();
  const { options: komoditasOptions } = useKomoditasOptions();
  const { options: petugasOptions } = usePengujiOptions();
  const [summary, setSummary] = useState<HasilSummary | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = usePaginatedList<PermintaanPengujian, QcListParams>(
    (params) => pemeriksaanPengujianService.getHasilList({ ...params, sortOrder: "desc" }),
    { search: "", status: "", hasilAkhir: "", komoditas: "", petugasQcId: "" }
  );
  const { filters, setFilters } = list;

  useEffect(() => {
    pemeriksaanPengujianService
      .getHasilSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Gagal memuat ringkasan hasil:", err));
  }, []);

  const statItems: StatItem[] = useMemo(() => {
    const s = summary || { total: 0, menungguReview: 0, lulus: 0, tidakLulus: 0 };
    const selesai = s.lulus + s.tidakLulus;
    return [
      { title: "Total Hasil Pengujian", value: s.total, subtitle: "Menunggu review & selesai", icon: "ri-file-list-3-line", bgColor: "bg-blue-50", textColor: "text-blue-600" },
      { title: "Menunggu Review", value: s.menungguReview, subtitle: "Perlu direview", icon: "ri-time-line", bgColor: "bg-amber-50", textColor: "text-amber-600" },
      { title: "Lulus", value: s.lulus, subtitle: persen(s.lulus, selesai), icon: "ri-checkbox-circle-line", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
      { title: "Tidak Lulus", value: s.tidakLulus, subtitle: persen(s.tidakLulus, selesai), icon: "ri-close-circle-line", bgColor: "bg-rose-50", textColor: "text-rose-600" },
    ];
  }, [summary]);

  const statusOptions = useMemo(() => meta.hasilStatuses.map((s) => ({ value: s, label: s })), [meta.hasilStatuses]);
  const hasilOptions = useMemo(() => meta.hasilAkhir.map((s) => ({ value: s, label: s })), [meta.hasilAkhir]);

  const filterConfig: FilterSelectConfig[] = [
    {
      value: toOption(statusOptions, filters.status),
      onChange: (val: any) => setFilters({ status: val?.value || "" }),
      options: statusOptions,
      placeholder: "Status",
      widthClass: "sm:w-40",
    },
    {
      value: toOption(hasilOptions, filters.hasilAkhir),
      onChange: (val: any) => setFilters({ hasilAkhir: val?.value || "" }),
      options: hasilOptions,
      placeholder: "Kesimpulan",
      widthClass: "sm:w-36",
    },
    {
      value: toOption(komoditasOptions, filters.komoditas),
      onChange: (val: any) => setFilters({ komoditas: val?.value || "" }),
      options: komoditasOptions,
      placeholder: "Komoditas",
      widthClass: "sm:w-36",
    },
    {
      value: toOption(petugasOptions, filters.petugasQcId),
      onChange: (val: any) => setFilters({ petugasQcId: val?.value || "" }),
      options: petugasOptions,
      placeholder: "Analis",
      widthClass: "sm:w-44",
    },
  ];

  const headers = ["No.", "No. Pengujian", "Tgl Selesai Uji", "Batch", "Komoditas / Varietas", "Sampel", "Hasil", "Kesimpulan", "Status", "Aksi"];

  const renderRow = (item: PermintaanPengujian, index: number) => {
    const params = (item.parameters || []).filter((p) => p.checked);
    const lulus = params.filter((p) => p.statusHasil === HASIL_AKHIR.LULUS).length;
    return (
      <tr
        key={item.id}
        onClick={() => setSelectedId(item.id)}
        className={`border-b border-defaultborder cursor-pointer transition-colors text-xs ${
          selectedId === item.id ? "bg-emerald-50/60" : "hover:bg-gray-50"
        }`}
      >
        <td className="p-3 text-center text-gray-500">{(list.page - 1) * list.pageSize + index + 1}</td>
        <td className="p-3 font-semibold text-emerald-700 whitespace-nowrap">{item.noPengujian || item.noPermintaan}</td>
        <td className="p-3 whitespace-nowrap">{formatDate(item.tanggalSelesaiUji)}</td>
        <td className="p-3 whitespace-nowrap">{item.kodeBatch}</td>
        <td className="p-3 whitespace-nowrap">
          {item.komoditas || "-"} / {item.varietas || "-"}
        </td>
        <td className="p-3 whitespace-nowrap">
          {formatNumber(item.jumlahSampel)} {item.satuanSampel || ""}
        </td>
        <td className="p-3 whitespace-nowrap">
          {lulus}/{params.length}
        </td>
        <td className="p-3">
          <QcStatusBadge status={item.hasilAkhir} />
        </td>
        <td className="p-3">
          <QcStatusBadge status={item.status} />
        </td>
        <td className="p-3" onClick={(e) => e.stopPropagation()}>
          <ViewIconButton onClick={() => setSelectedId(item.id)} />
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      <StatsWidgets items={statItems} columns={4} />

      <FilterRow
        search={filters.search || ""}
        onSearchChange={(val) => setFilters({ search: val })}
        searchPlaceholder="Cari no. pengujian, batch..."
        selectFilters={filterConfig}
        onReset={list.resetFilters}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        <div className={selectedId ? "xl:col-span-8" : "xl:col-span-12"}>
          <DataTable
            headers={headers}
            items={list.items}
            renderRow={renderRow}
            currentPage={list.page}
            pageSize={list.pageSize}
            totalPages={list.totalPages}
            totalRecords={list.total}
            onPageChange={list.setPage}
            onPageSizeChange={list.setPageSize}
            headerTextSize="11px"
            bodyTextSize="11px"
            isLoading={list.loading}
            emptyMessage="Belum ada hasil pengujian."
          />
        </div>
        {selectedId && (
          <div className="xl:col-span-4 bg-white rounded-xl shadow-sm border border-gray-100 xl:sticky xl:top-20">
            <HasilDetailPanel id={selectedId} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HasilPengujianList;
