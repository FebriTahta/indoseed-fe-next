"use client";

import { iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import StatsWidgets, { StatItem } from "@/app/(components)/(content-layout)/shared/StatsWidgets";
import FilterRow, { FilterSelectConfig } from "@/app/(components)/(content-layout)/shared/FilterRow";
import {
  EditIconButton,
  DeleteIconButton,
  ViewIconButton,
} from "@/app/(components)/(content-layout)/shared/ActionButtons";
import QcStatusBadge from "../../shared/QcStatusBadge";
import QcReasonModal from "../../shared/QcReasonModal";
import { permintaanPengujianService } from "@/app/services/permintaanPengujianService";
import { usePaginatedList } from "@/app/hooks/usePaginatedList";
import { useKomoditasOptions, useQcLookups, useQcMeta } from "@/app/hooks/useQcReference";
import { PermintaanPengujian, PermintaanSummary, QC_STATUS, QcListParams } from "@/app/types/qc";
import { formatDate, formatNumber, getErrorMessage } from "@/app/lib/format";

const PERIODE_OPTIONS = [
  { value: "today", label: "Hari Ini" },
  { value: "week", label: "7 Hari Terakhir" },
  { value: "month", label: "Bulan Ini" },
];

const EMPTY_SUMMARY: PermintaanSummary = {
  total: 0,
  menungguPersetujuan: 0,
  sampling: 0,
  dalamPengujian: 0,
  menungguReview: 0,
  selesai: 0,
  ditolak: 0,
};

type DialogState = { type: "approve" | "reject"; item: PermintaanPengujian } | null;

const toOption = (options: { value: string; label: string }[], value?: string) =>
  value ? options.find((o) => o.value === value) || { value, label: value } : null;

const PermintaanList = () => {
  const router = useRouter();
  const { meta } = useQcMeta();
  const { options: komoditasOptions } = useKomoditasOptions();
  const { options: lookupOptions, labelOf } = useQcLookups(["PEMOHON", "PRIORITAS"]);
  const [summary, setSummary] = useState<PermintaanSummary>(EMPTY_SUMMARY);
  const [dialog, setDialog] = useState<DialogState>(null);

  const list = usePaginatedList<PermintaanPengujian, QcListParams>(
    (params) => permintaanPengujianService.getPermintaanList({ ...params, sortBy: "updatedAt", sortOrder: "desc" }),
    { search: "", periode: "", status: "", komoditas: "", prioritas: "" }
  );

  const fetchSummary = () =>
    permintaanPengujianService
      .getPermintaanSummary()
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Gagal memuat ringkasan:", err));

  useEffect(() => {
    fetchSummary();
  }, []);

  const refresh = () => {
    list.reload();
    fetchSummary();
  };

  const isEditable = (status: string) => meta.editableStatuses.includes(status);

  const handleDelete = async (item: PermintaanPengujian) => {
    if (!window.confirm(`Hapus permintaan pengujian ${item.noPermintaan}?`)) return;
    try {
      await permintaanPengujianService.deletePermintaan(item.id);
      toast.success(`Permintaan ${item.noPermintaan} berhasil dihapus`);
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus permintaan pengujian"));
    }
  };

  const handleDialogSubmit = async (text: string) => {
    if (!dialog) return;
    try {
      if (dialog.type === "approve") {
        await permintaanPengujianService.approvePermintaan(dialog.item.id, text || undefined);
        toast.success(`Permintaan ${dialog.item.noPermintaan} disetujui, lanjut ke tahap sampling`);
      } else {
        await permintaanPengujianService.rejectPermintaan(dialog.item.id, text);
        toast.success(`Permintaan ${dialog.item.noPermintaan} ditolak`);
      }
      setDialog(null);
      refresh();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memproses permintaan"));
    }
  };

  const statItems: StatItem[] = useMemo(
    () => [
      { title: "Total Permintaan", value: summary.total, subtitle: "Keseluruhan batch", icon: "ri-file-list-3-line", bgColor: "bg-blue-50", textColor: "text-blue-600" },
      { title: "Menunggu Persetujuan", value: summary.menungguPersetujuan, subtitle: "Perlu diproses", icon: "ri-time-line", bgColor: "bg-amber-50", textColor: "text-amber-600" },
      { title: "Sampling", value: summary.sampling, subtitle: "Pengambilan sampel", icon: "ri-test-tube-line", bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
      { title: "Dalam Pengujian", value: summary.dalamPengujian + summary.menungguReview, subtitle: "Analisa & review lab", icon: "ri-settings-4-line", bgColor: "bg-purple-50", textColor: "text-purple-600" },
      { title: "Selesai", value: summary.selesai, subtitle: `${summary.ditolak} ditolak`, icon: "ri-checkbox-circle-line", bgColor: "bg-emerald-50", textColor: "text-emerald-600" },
    ],
    [summary]
  );

  const statusOptions = useMemo(() => meta.statuses.map((s) => ({ value: s, label: s })), [meta.statuses]);
  const prioritasOptions = lookupOptions("PRIORITAS");
  const { filters, setFilters } = list;

  const filterConfig: FilterSelectConfig[] = [
    {
      value: toOption(PERIODE_OPTIONS, filters.periode),
      onChange: (val: any) => setFilters({ periode: val?.value || "" }),
      options: PERIODE_OPTIONS,
      placeholder: "Periode",
      widthClass: "sm:w-36",
    },
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
      value: toOption(prioritasOptions, filters.prioritas),
      onChange: (val: any) => setFilters({ prioritas: val?.value || "" }),
      options: prioritasOptions,
      placeholder: "Prioritas",
      widthClass: "sm:w-32",
    },
  ];

  const headers = [
    "No.",
    "No. Permintaan",
    "Tanggal",
    "Batch",
    "Komoditas / Varietas",
    "Jumlah Sampel",
    "Parameter",
    "Pemohon",
    "Prioritas",
    "Status",
    "Aksi",
  ];

  const renderRow = (item: PermintaanPengujian, index: number) => {
    const paramCount = item.parameters?.filter((p) => p.checked).length || 0;
    const editable = isEditable(item.status);
    const waitingApproval = item.status === QC_STATUS.MENUNGGU_PERSETUJUAN;

    return (
      <tr key={item.id} className="hover:bg-gray-50 border-b border-defaultborder transition-colors text-xs">
        <td className="p-3 text-center text-gray-500">{(list.page - 1) * list.pageSize + index + 1}</td>
        <td className="p-3 font-semibold text-emerald-700">{item.noPermintaan}</td>
        <td className="p-3 text-gray-600">{formatDate(item.tanggal)}</td>
        <td className="p-3">
          <span className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{item.kodeBatch}</span>
        </td>
        <td className="p-3 text-gray-700 font-medium">
          {item.komoditas || "-"} / {item.varietas || "-"}
        </td>
        <td className="p-3 text-gray-700">
          {formatNumber(item.jumlahSampel)} {item.satuanSampel || ""}
        </td>
        <td className="p-3">
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
            <i className="ri-flask-line"></i> {paramCount} Parameter
          </span>
        </td>
        <td className="p-3 text-gray-700">{labelOf("PEMOHON", item.pemohon)}</td>
        <td className="p-3">
          <span className={item.prioritas === "urgent" ? "text-red-600 font-semibold" : "text-gray-600"}>
            {labelOf("PRIORITAS", item.prioritas)}
          </span>
        </td>
        <td className="p-3">
          <div title={item.alasanPenolakan || undefined}>
            <QcStatusBadge status={item.status} />
          </div>
        </td>
        <td className="p-3">
          <div className="flex gap-1.5 justify-center">
            {waitingApproval && (
              <>
                <button
                  type="button"
                  title="Setujui permintaan"
                  onClick={() => setDialog({ type: "approve", item })}
                  className={iconButtonClass("emerald")}
                >
                  <i className="ri-check-line"></i>
                </button>
                <button
                  type="button"
                  title="Tolak permintaan"
                  onClick={() => setDialog({ type: "reject", item })}
                  className={iconButtonClass("rose")}
                >
                  <i className="ri-close-line"></i>
                </button>
              </>
            )}
            {meta.pemeriksaanStatuses.includes(item.status) && (
              <ViewIconButton
                title="Lihat pemeriksaan"
                onClick={() => router.push(`/qc/pemeriksaan-pengujian/${item.id}`)}
              />
            )}
            {editable && (
              <>
                <EditIconButton
                  title={item.status === QC_STATUS.DITOLAK ? "Perbaiki & ajukan ulang" : "Edit Permintaan"}
                  onClick={() => router.push(`/qc/permintaan-pengujian/edit/${item.id}`)}
                />
                <DeleteIconButton title="Hapus" onClick={() => handleDelete(item)} />
              </>
            )}
          </div>
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
        searchPlaceholder="Cari no. permintaan, batch, petani..."
        selectFilters={filterConfig}
        onReset={list.resetFilters}
        onAdd={() => router.push("/qc/permintaan-pengujian/create")}
        addLabel="Buat Permintaan"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
          emptyMessage="Tidak ada permintaan pengujian yang sesuai dengan kriteria filter."
        />
      </div>

      <QcReasonModal
        isOpen={!!dialog}
        title={dialog?.type === "approve" ? "Setujui Permintaan Pengujian" : "Tolak Permintaan Pengujian"}
        description={
          dialog && (
            <>
              <strong>{dialog.item.noPermintaan}</strong> — batch {dialog.item.kodeBatch} ({dialog.item.komoditas} /{" "}
              {dialog.item.varietas})
            </>
          )
        }
        label={dialog?.type === "approve" ? "Catatan (opsional)" : "Alasan penolakan"}
        placeholder={dialog?.type === "approve" ? "Catatan persetujuan..." : "Jelaskan alasan permintaan ditolak..."}
        submitText={dialog?.type === "approve" ? "Setujui" : "Tolak Permintaan"}
        required={dialog?.type === "reject"}
        onClose={() => setDialog(null)}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
};

export default PermintaanList;
