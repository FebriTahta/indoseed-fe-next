"use client";

import { buttonClass, ButtonVariant } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import StatsWidgets, { StatItem } from "@/app/(components)/(content-layout)/shared/StatsWidgets";
import FilterRow, { FilterSelectConfig } from "@/app/(components)/(content-layout)/shared/FilterRow";
import QcStatusBadge from "../../shared/QcStatusBadge";
import { pemeriksaanPengujianService } from "@/app/services/pemeriksaanPengujianService";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useKomoditasOptions, usePengujiOptions, useQcMeta } from "@/app/hooks/useQcReference";
import { PemeriksaanSummary, PermintaanPengujian, QC_STATUS, QcListParams } from "@/app/types/qc";
import { formatDate } from "@/app/lib/format";

/** Label & gaya tombol aksi sesuai tahap pemeriksaan. */
const ACTION_BY_STATUS: Record<string, { label: string; icon: string; variant: ButtonVariant }> = {
  [QC_STATUS.SAMPLING]: { label: "Terima Sampel", icon: "ri-play-circle-line", variant: "outline" },
  [QC_STATUS.DALAM_PENGUJIAN]: { label: "Input Hasil", icon: "ri-edit-box-line", variant: "primary" },
  [QC_STATUS.MENUNGGU_REVIEW]: { label: "Review", icon: "ri-search-eye-line", variant: "warning" },
};
const DEFAULT_ACTION = { label: "Lihat", icon: "ri-eye-line", variant: "secondary" as ButtonVariant };

const toOption = (options: { value: string; label: string }[], value?: string) =>
  value ? options.find((o) => o.value === value) || { value, label: value } : null;

const PemeriksaanList = () => {
  const router = useRouter();
  const { meta } = useQcMeta();
  const { options: komoditasOptions } = useKomoditasOptions();
  const { options: petugasOptions } = usePengujiOptions();
  const [summary, setSummary] = useState<PemeriksaanSummary | null>(null);

  const list = usePaginatedList<PermintaanPengujian, QcListParams>(
    (params) => pemeriksaanPengujianService.getList({ ...params, sortBy: "updatedAt", sortOrder: "desc" }),
    { search: "", status: "", komoditas: "", petugasQcId: "" }
  );
  const { filters, setFilters } = list;

  useEffect(() => {
    pemeriksaanPengujianService
      .getSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Gagal memuat ringkasan pemeriksaan:", err));
  }, []);

  const statItems: StatItem[] = useMemo(
    () => [
      { title: "Total Pemeriksaan", value: summary?.total ?? 0, subtitle: "Permintaan disetujui", icon: "ri-file-list-3-line", bgColor: "bg-blue-50", textColor: "text-blue-600" },
      { title: "Menunggu Sampel", value: summary?.sampling ?? 0, subtitle: "Siap diterima lab", icon: "ri-hourglass-2-fill", bgColor: "bg-orange-50", textColor: "text-orange-600" },
      { title: "Dalam Pengujian", value: summary?.dalamPengujian ?? 0, subtitle: "Input hasil lab", icon: "ri-flask-line", bgColor: "bg-purple-50", textColor: "text-purple-600" },
      { title: "Menunggu Review", value: summary?.menungguReview ?? 0, subtitle: "Perlu persetujuan", icon: "ri-file-list-2-line", bgColor: "bg-yellow-50", textColor: "text-yellow-600" },
      { title: "Selesai", value: summary?.selesai ?? 0, subtitle: "Hasil disetujui", icon: "ri-checkbox-circle-fill", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
    ],
    [summary]
  );

  const statusOptions = useMemo(
    () => meta.pemeriksaanStatuses.map((s) => ({ value: s, label: s })),
    [meta.pemeriksaanStatuses]
  );

  const filterConfig: FilterSelectConfig[] = [
    {
      value: toOption(statusOptions, filters.status),
      onChange: (val: any) => setFilters({ status: val?.value || "" }),
      options: statusOptions,
      placeholder: "Status",
      widthClass: "sm:w-44",
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
      placeholder: "Petugas QC",
      widthClass: "sm:w-48",
    },
  ];

  const headers = [
    "No.",
    "No. Pengujian",
    "No. Permintaan",
    "Batch",
    "Komoditas / Varietas",
    "Petani",
    "Tgl Sampling",
    "Parameter",
    "Status",
    "Petugas QC",
    "Aksi",
  ];

  const renderRow = (item: PermintaanPengujian, index: number) => {
    const action = ACTION_BY_STATUS[item.status] || DEFAULT_ACTION;
    const params = (item.parameters || []).filter((p) => p.checked);
    const terisi = params.filter((p) => p.statusHasil).length;
    return (
      <tr key={item.id} className="hover:bg-gray-50 border-b border-defaultborder transition-colors text-xs">
        <td className="p-3 text-center text-gray-500">{(list.page - 1) * list.pageSize + index + 1}</td>
        <td className="p-3 font-semibold text-emerald-700 whitespace-nowrap">{item.noPengujian || <span className="text-gray-400 italic font-normal">Belum terbit</span>}</td>
        <td className="p-3 whitespace-nowrap">{item.noPermintaan}</td>
        <td className="p-3 whitespace-nowrap">{item.kodeBatch}</td>
        <td className="p-3 whitespace-nowrap">
          {item.komoditas || "-"} / {item.varietas || "-"}
        </td>
        <td className="p-3 whitespace-nowrap">{item.petani || "-"}</td>
        <td className="p-3 whitespace-nowrap">{formatDate(item.tanggalSampling)}</td>
        <td className="p-3 whitespace-nowrap">
          {terisi}/{params.length} terisi
        </td>
        <td className="p-3">
          <QcStatusBadge status={item.status} />
        </td>
        <td className="p-3 whitespace-nowrap">{item.petugasQc?.nama || "-"}</td>
        <td className="p-3">
          <button
            type="button"
            onClick={() => router.push(`/qc/pemeriksaan-pengujian/${item.id}`)}
            className={buttonClass(action.variant, "sm")}
          >
            <i className={action.icon}></i> {action.label}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <StatsWidgets items={statItems} columns={5} />

      <FilterRow
        search={filters.search || ""}
        onSearchChange={(val) => setFilters({ search: val })}
        searchPlaceholder="Cari no. pengujian, batch, petani..."
        selectFilters={filterConfig}
        onReset={list.resetFilters}
      />

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
        emptyMessage="Belum ada permintaan yang disetujui untuk diperiksa."
      />
    </div>
  );
};

export default PemeriksaanList;
