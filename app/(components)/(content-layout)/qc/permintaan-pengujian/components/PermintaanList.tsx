"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(components)/(content-layout)/shared/DataTable";
import StatsWidgets, { StatItem } from "@/app/(components)/(content-layout)/shared/StatsWidgets";
import FilterRow, { FilterSelectConfig } from "@/app/(components)/(content-layout)/shared/FilterRow";
import {
  EditIconButton,
  DeleteIconButton,
} from "@/app/(components)/(content-layout)/shared/ActionButtons";
import { toast } from "react-toastify";
import { permintaanPengujianService } from "@/app/services/permintaanPengujianService";
import { PermintaanPengujian, PermintaanSummary } from "@/app/types/qc";

const PermintaanList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriode, setFilterPeriode] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterKomoditas, setFilterKomoditas] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [data, setData] = useState<PermintaanPengujian[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<PermintaanSummary>({
    total: 0,
    menungguPersetujuan: 0,
    sampling: 0,
    dalamPengujian: 0,
    menungguReview: 0,
    selesai: 0,
    ditolak: 0,
  });

  const fetchSummary = useCallback(async () => {
    try {
      const res = await permintaanPengujianService.getPermintaanSummary();
      if (res && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await permintaanPengujianService.getPermintaanList({
        search: searchTerm,
        periode: filterPeriode,
        status: filterStatus,
        komoditas: filterKomoditas,
        sortBy: "updatedAt",
        sortOrder: "desc",
        page: currentPage,
        pageSize,
      });
      if (res && res.data) {
        // Ensure sorting descending by updatedAt
        const sorted = (res.data || []).slice().sort((a: any, b: any) => {
          const timeA = new Date(a.updatedAt || a.tanggal || 0).getTime();
          const timeB = new Date(b.updatedAt || b.tanggal || 0).getTime();
          return timeB - timeA;
        });
        setData(sorted);
        setTotalRecords(res.total || 0);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching permintaan pengujian:", err);
      toast.error("Gagal memuat data permintaan pengujian");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterPeriode, filterStatus, filterKomoditas, currentPage, pageSize]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResetFilter = () => {
    setSearchTerm("");
    setFilterPeriode("");
    setFilterStatus("");
    setFilterKomoditas("");
    setCurrentPage(1);
  };

  const handleDelete = async (id: string, noPermintaan: string) => {
    if (window.confirm(`Hapus permintaan pengujian ${noPermintaan}?`)) {
      try {
        await permintaanPengujianService.deletePermintaan(id);
        toast.success(`Permintaan ${noPermintaan} berhasil dihapus`);
        fetchData();
        fetchSummary();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Gagal menghapus permintaan pengujian");
      }
    }
  };

  // Reusable Stat Items
  const statItems: StatItem[] = useMemo(
    () => [
      {
        title: "Total Permintaan",
        value: summary.total,
        subtitle: "Keseluruhan batch",
        icon: "ri-file-list-3-line",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Menunggu Persetujuan",
        value: summary.menungguPersetujuan,
        subtitle: "Perlu diproses",
        icon: "ri-time-line",
        bgColor: "bg-amber-50",
        textColor: "text-amber-600",
      },
      {
        title: "Sampling",
        value: summary.sampling,
        subtitle: "Pengambilan sampel",
        icon: "ri-test-tube-line",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-600",
      },
      {
        title: "Dalam Pengujian",
        value: summary.dalamPengujian,
        subtitle: "Proses analisa lab",
        icon: "ri-settings-4-line",
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Selesai",
        value: summary.selesai,
        subtitle: "Hasil terbit",
        icon: "ri-checkbox-circle-line",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-600",
      },
    ],
    [summary]
  );

  // Reusable Select Filter Config
  const filterConfig: FilterSelectConfig[] = useMemo(
    () => [
      {
        value: filterPeriode
          ? {
              value: filterPeriode,
              label:
                filterPeriode === "today"
                  ? "Hari Ini"
                  : filterPeriode === "week"
                  ? "Minggu Ini"
                  : "Bulan Ini",
            }
          : null,
        onChange: (val: any) => {
          setFilterPeriode(val?.value || "");
          setCurrentPage(1);
        },
        options: [
          { value: "today", label: "Hari Ini" },
          { value: "week", label: "Minggu Ini" },
          { value: "month", label: "Bulan Ini" },
        ],
        placeholder: "Semua Periode",
        widthClass: "sm:w-36",
      },
      {
        value: filterStatus
          ? { value: filterStatus, label: filterStatus }
          : null,
        onChange: (val: any) => {
          setFilterStatus(val?.value || "");
          setCurrentPage(1);
        },
        options: [
          { value: "Menunggu Persetujuan", label: "Menunggu Persetujuan" },
          { value: "Sampling", label: "Sampling" },
          { value: "Dalam Pengujian", label: "Dalam Pengujian" },
          { value: "Menunggu Review", label: "Menunggu Review" },
          { value: "Selesai", label: "Selesai" },
          { value: "Ditolak", label: "Ditolak" },
        ],
        placeholder: "Semua Status",
        widthClass: "sm:w-44",
      },
      {
        value: filterKomoditas
          ? { value: filterKomoditas, label: filterKomoditas }
          : null,
        onChange: (val: any) => {
          setFilterKomoditas(val?.value || "");
          setCurrentPage(1);
        },
        options: [
          { value: "Melon", label: "Melon" },
          { value: "Cabai", label: "Cabai" },
          { value: "Padi", label: "Padi" },
          { value: "Kedelai", label: "Kedelai" },
          { value: "Jagung", label: "Jagung" },
        ],
        placeholder: "Semua Komoditas",
        widthClass: "sm:w-36",
      },
    ],
    [filterPeriode, filterStatus, filterKomoditas]
  );

  const headers = [
    "No.",
    "No. Permintaan",
    "Tanggal Permintaan",
    "Batch",
    "Komoditas / Varietas",
    "Tipe",
    "Jumlah Sampel",
    "Jenis Pengujian",
    "Pemohon",
    "Prioritas",
    "Status",
    "Aksi",
  ];

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Menunggu Persetujuan":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-small inline-flex items-center gap-1">
            <i className="ri-time-line"></i> Menunggu Persetujuan
          </span>
        );
      case "Sampling":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-small inline-flex items-center gap-1">
            <i className="ri-test-tube-line"></i> Sampling
          </span>
        );
      case "Dalam Pengujian":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-small inline-flex items-center gap-1">
            <i className="ri-settings-4-line"></i> Dalam Pengujian
          </span>
        );
      case "Menunggu Review":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-small inline-flex items-center gap-1">
            <i className="ri-search-eye-line"></i> Menunggu Review
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-small inline-flex items-center gap-1">
            <i className="ri-checkbox-circle-line"></i> Selesai
          </span>
        );
      case "Ditolak":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-small inline-flex items-center gap-1">
            <i className="ri-close-circle-line"></i> Ditolak
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-small">
            {status}
          </span>
        );
    }
  };

  const renderPrioritas = (prioritas: string) => {
    if (prioritas?.toLowerCase() === "urgent") {
      return (
        <span className="text-red-600 font-semibold inline-flex items-center gap-1">
          <i className="ri-alarm-warning-line"></i> Urgent
        </span>
      );
    }
    return <span className="text-gray-600 font-medium">Normal</span>;
  };

  const formatDate = (dateVal: string | Date | undefined) => {
    if (!dateVal) return "-";
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return String(dateVal);
    }
  };

  const renderRow = (item: PermintaanPengujian, index: number) => {
    const paramCount = item.parameters?.length || 0;
    const komoditasVarietas = `${item.komoditas || "-"} / ${item.varietas || "-"}`;
    const pemohonLabel =
      item.pemohon === "produksi"
        ? "Produksi"
        : item.pemohon === "gudang"
        ? "Gudang"
        : item.pemohon === "rnd"
        ? "R & D"
        : item.pemohon || "-";

    return (
      <tr
        key={item.id}
        className="hover:bg-gray-50 border-b border-defaultborder transition-colors text-xs"
      >
        <td className="p-3 text-center text-gray-500">
          {(currentPage - 1) * pageSize + index + 1}
        </td>
        <td className="p-3 font-semibold text-emerald-700">
          {item.noPermintaan}
        </td>
        <td className="p-3 text-gray-600">{formatDate(item.tanggal)}</td>
        <td className="p-3">
          <span className="font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
            {item.kodeBatch}
          </span>
        </td>
        <td className="p-3 text-gray-700 font-medium">{komoditasVarietas}</td>
        <td className="p-3 text-gray-500">{item.tipe || "QC / Benih"}</td>
        <td className="p-3 text-gray-700">
          {item.jumlahSampel || 0} {item.satuanSampel || "gram"}
        </td>
        <td className="p-3">
          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
            <i className="ri-flask-line"></i> {paramCount} Parameter
          </span>
        </td>
        <td className="p-3 text-gray-700">{pemohonLabel}</td>
        <td className="p-3">{renderPrioritas(item.prioritas)}</td>
        <td className="p-3">{renderStatusBadge(item.status)}</td>
        <td className="p-3">
          <div className="flex gap-1.5 justify-center">
            <EditIconButton
              title="Edit Permintaan"
              onClick={() =>
                router.push(`/qc/permintaan-pengujian/edit/${item.id}`)
              }
            />
            <DeleteIconButton
              title="Hapus"
              onClick={() => handleDelete(item.id, item.noPermintaan)}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      {/* Reusable Stats Widgets */}
      <StatsWidgets items={statItems} columns={5} />

      {/* Reusable Filter Row Bar */}
      <FilterRow
        search={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Cari No. Permintaan, Batch, Komoditas..."
        selectFilters={filterConfig}
        onReset={handleResetFilter}
        onExport={() => toast.info("Mengekspor data permintaan pengujian...")}
        onAdd={() => router.push("/qc/permintaan-pengujian/create")}
        addLabel="Buat Permintaan"
      />

      {/* Reusable Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          headers={headers}
          items={data}
          renderRow={renderRow}
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          headerTextSize="11px"
          bodyTextSize="11px"
          isLoading={isLoading}
          emptyMessage="Tidak ada permintaan pengujian yang sesuai dengan kriteria filter."
        />
      </div>
    </div>
  );
};

export default PermintaanList;
