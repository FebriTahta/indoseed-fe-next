"use client";
import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Pageheader from "@/shared/layouts-components/page-header/pageheader";
import Seo from "@/shared/layouts-components/seo/seo";
import Spkapexcharts from "@/shared/@spk-reusable-components/spk-packages/apexcharts-component";
import Spktables from "@/shared/@spk-reusable-components/tables/spk-tables";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import moment from "moment";
import { dashboardProduksiService } from "@/app/services/dashboardProduksiService";

const DashboardProduksi = () => {
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [data, setData] = useState(null);

  // Modal State for Widget Details
  const [activeStatusTab, setActiveStatusTab] = useState("Semua");
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    subtitle: "",
    type: "",
    data: null,
  });

  const openDetailModal = (type, customTitle, customSubtitle, customData = null) => {
    setActiveStatusTab("Semua");
    setModalConfig({
      isOpen: true,
      title: customTitle,
      subtitle: customSubtitle,
      type: type,
      data: customData,
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const [dateRange, setDateRange] = useState([
    new Date(2024, 5, 1),
    new Date(2024, 5, 14),
  ]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    fetchDashboardData(startDate, endDate);
  }, []);

  const fetchDashboardData = async (start = startDate, end = endDate) => {
    try {
      setLoading(true);
      const startStr = start ? moment(start).format("YYYY-MM-DD") : undefined;
      const endStr = end ? moment(end).format("YYYY-MM-DD") : undefined;
      const response = await dashboardProduksiService.getDashboardProduksiData(startStr, endStr);
      if (response && response.data) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  };

  const handleFilter = () => {
    setFiltering(true);
    fetchDashboardData(startDate, endDate);
  };

  // Static Fallback Reference Data matching design exactly
  const summaryCards = data?.summaryCards || [
    {
      id: "total_batch",
      title: "TOTAL BATCH PRODUKSI",
      value: "24",
      unit: "Batch",
      percent: "20%",
      trend: "up",
      subtext: "dari periode lalu",
      icon: "ri-file-list-3-line",
      color: "emerald",
      bgClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      id: "batch_aktif",
      title: "BATCH AKTIF",
      value: "8",
      unit: "Batch",
      percent: "14.3%",
      trend: "up",
      subtext: "dari periode lalu",
      icon: "ri-play-circle-line",
      color: "blue",
      bgClass: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      id: "selesai_produksi",
      title: "SELESAI PRODUKSI",
      value: "12",
      unit: "Batch",
      percent: "33.3%",
      trend: "up",
      subtext: "dari periode lalu",
      icon: "ri-checkbox-circle-line",
      color: "emerald",
      bgClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      id: "produksi_hari_ini",
      title: "PRODUKSI HARI INI",
      value: "1.250",
      unit: "Kg",
      percent: "15.6%",
      trend: "up",
      subtext: "dari kemarin",
      icon: "ri-building-4-line",
      color: "purple",
      bgClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      id: "target_bulan_ini",
      title: "TARGET BULAN INI",
      value: "25.000",
      unit: "Kg",
      percent: "65%",
      trend: "progress",
      subtext: "tercapai",
      icon: "ri-focus-3-line",
      color: "amber",
      progressValue: 65,
      bgClass: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ];

  // Donut Chart: Status Produksi
  const statusProduksiSeries = data?.statusProduksi?.series || [12, 8, 2, 1, 1];
  const statusProduksiOptions = {
    chart: { type: "donut", height: 210 },
    labels: data?.statusProduksi?.labels || ["Selesai", "Proses", "Pengeringan", "Sortasi / QC", "Tidak Aktif"],
    colors: data?.statusProduksi?.colors || ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#9ca3af"],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `${data?.statusProduksi?.total || summaryCards[0]?.value || 24} Batch`,
              style: { fontSize: "14px", fontWeight: 600, color: "#374151" },
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { width: 2 },
  };

  const statusBreakdown = data?.statusProduksi?.breakdown?.map(item => {
    const countVal = item.count !== undefined ? item.count : (item.kg !== undefined ? item.kg : 0);
    return {
      label: item.label,
      count: `${countVal} (${item.percentage || '0.0%'})`,
      color: item.color
    };
  }) || [
      { label: "Selesai", count: "12 (50.0%)", color: "#10b981" },
      { label: "Proses", count: "8 (33.3%)", color: "#3b82f6" },
      { label: "Pengeringan", count: "2 (8.3%)", color: "#f59e0b" },
      { label: "Sortasi / QC", count: "1 (4.2%)", color: "#ef4444" },
      { label: "Tidak Aktif", count: "1 (4.2%)", color: "#9ca3af" },
    ];

  // Bar Chart: Produksi per Tahap
  const tahapSeries = data?.produksiPerTahap?.series || [
    {
      name: "Batch",
      data: [24, 20, 16, 12, 8, 4, 3],
    },
  ];
  const tahapOptions = {
    chart: { type: "bar", height: 240, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "55%",
        borderRadius: 4,
        dataLabels: { position: "top" },
      },
    },
    colors: ["#10b981"],
    xaxis: {
      categories: data?.produksiPerTahap?.categories || ["Perencanaan", "Tanam", "Pemeliharaan", "Panen", "Pengeringan", "Sortasi", "QC"],
      max: Math.max(30, ...(tahapSeries[0]?.data || [30])),
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: {
      labels: { style: { fontSize: "11px", fontWeight: 500 } },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: 8,
      style: { fontSize: "11px", colors: ["#374151"], fontWeight: 600 },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
  };

  // Line Chart: Produksi vs Target
  const vsTargetSeries = data?.produksiVsTarget?.series || [
    {
      name: "Produksi (Kg)",
      data: [3000, 7500, 9800, 16500, 21500, 25800],
    },
    {
      name: "Target (Kg)",
      data: [5000, 10000, 15000, 20000, 25000, 30000],
    },
  ];
  const vsTargetOptions = {
    chart: { type: "line", height: 240, toolbar: { show: false } },
    colors: ["#10b981", "#9ca3af"],
    stroke: {
      width: [3, 2],
      curve: "smooth",
      dashArray: [0, 5],
    },
    markers: {
      size: [4, 3],
      colors: ["#10b981", "#9ca3af"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    xaxis: {
      categories: data?.produksiVsTarget?.categories || ["1-5 Jun", "6-10 Jun", "11-14 Jun", "15-20 Jun", "21-25 Jun", "26-30 Jun"],
      labels: { style: { fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val),
        style: { fontSize: "11px" },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "12px",
      markers: { width: 10, height: 10, radius: 10 },
    },
    grid: { borderColor: "#f3f4f6", strokeDashArray: 3 },
  };

  // Donut Chart: Produksi per Produk (Kg)
  const produkSeries = data?.produksiPerProduk?.series || [6500, 4200, 3000, 2300, 2750];
  const produkOptions = {
    chart: { type: "donut", height: 200 },
    labels: data?.produksiPerProduk?.labels || ["Padi IR64", "Padi Ciherang", "Tomat Servo", "Cabai Lado F1", "Lainnya"],
    colors: data?.produksiPerProduk?.colors || ["#059669", "#2563eb", "#f59e0b", "#dc2626", "#9ca3af"],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `${(data?.produksiPerProduk?.totalKg || 18750).toLocaleString("id-ID")} Kg`,
              style: { fontSize: "13px", fontWeight: 600, color: "#374151" },
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  const produkBreakdown = data?.produksiPerProduk?.breakdown?.map(item => ({
    label: item.label,
    detail: `${(item.kg || item.count)?.toLocaleString("id-ID")} (${item.percentage})`,
    color: item.color
  })) || [
      { label: "Padi IR64", detail: "6.500 (34.7%)", color: "#059669" },
      { label: "Padi Ciherang", detail: "4.200 (22.4%)", color: "#2563eb" },
      { label: "Tomat Servo", detail: "3.000 (16.0%)", color: "#f59e0b" },
      { label: "Cabai Lado F1", detail: "2.300 (12.3%)", color: "#dc2626" },
      { label: "Lainnya", detail: "2.750 (14.6%)", color: "#9ca3af" },
    ];

  // Active Batches Table
  const batchList = data?.batchProduksiAktif || [
    {
      no: 1,
      kodeBatch: "BCH-2406-001",
      produk: "Padi IR64",
      tanggalTanam: "02/06/2024",
      tahapSaatIni: "Pemeliharaan",
      progress: 60,
      progressColor: "bg-emerald-500",
      targetKg: "5.000",
      realisasiKg: "3.000",
    },
    {
      no: 2,
      kodeBatch: "BCH-2406-002",
      produk: "Padi Ciherang",
      tanggalTanam: "03/06/2024",
      tahapSaatIni: "Pemeliharaan",
      progress: 45,
      progressColor: "bg-emerald-500",
      targetKg: "4.000",
      realisasiKg: "1.800",
    },
    {
      no: 3,
      kodeBatch: "BCH-2406-003",
      produk: "Tomat Servo",
      tanggalTanam: "05/06/2024",
      tahapSaatIni: "Pengeringan",
      progress: 80,
      progressColor: "bg-emerald-500",
      targetKg: "1.500",
      realisasiKg: "1.200",
    },
    {
      no: 4,
      kodeBatch: "BCH-2406-004",
      produk: "Cabai Lado F1",
      tanggalTanam: "06/06/2024",
      tahapSaatIni: "Panen",
      progress: 100,
      progressColor: "bg-emerald-500",
      targetKg: "800",
      realisasiKg: "800",
    },
    {
      no: 5,
      kodeBatch: "BCH-2406-005",
      produk: "Sawi Caisim",
      tanggalTanam: "07/06/2024",
      tahapSaatIni: "Sortasi / QC",
      progress: 30,
      progressColor: "bg-amber-500",
      targetKg: "500",
      realisasiKg: "150",
    },
  ];

  // Notifications
  const notifications = data?.notifikasiProduksi || [
    {
      id: 1,
      title: "Jadwal panen Padi IR64",
      message: "Batch BCH-2406-001 akan panen pada 16/06/2024",
      time: "2 jam lalu",
      icon: "ri-calendar-event-line",
      bgColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      id: 2,
      title: "Pengeringan selesai",
      message: "Batch BCH-2406-003 sudah selesai pengeringan",
      time: "3 jam lalu",
      icon: "ri-sun-line",
      bgColor: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      id: 3,
      title: "QC diperlukan",
      message: "Batch BCH-2406-005 menunggu proses QC",
      time: "5 jam lalu",
      icon: "ri-error-warning-line",
      bgColor: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      id: 4,
      title: "Stok bahan packing menipis",
      message: "Plastik 1 Kg tersisa 150 pcs",
      time: "1 hari lalu",
      icon: "ri-box-3-line",
      bgColor: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
  ];

  // Helper Renderer for Modal Details
  const renderModalContent = () => {
    const { type, data: customData } = modalConfig;

    if (type === "status_produksi") {
      const details = data?.statusProduksi?.details || {};

      const listSelesai = details.selesai?.length > 0 ? details.selesai : [
        { kodeBatch: "BP-2606-0001", produk: "Padi Inpari 32", tahapSaatIni: "Selesai", targetKg: 16800, realisasiKg: 16200, lokasi: "Gudang Processing A", catatan: "Pengolahan Selesai" },
        { kodeBatch: "BP-2606-0002", produk: "Padi Inpari 42", tahapSaatIni: "Selesai", targetKg: 21500, realisasiKg: 20800, lokasi: "Gudang Processing A", catatan: "Batch benih SS" },
        { kodeBatch: "BP-2606-0003", produk: "Jagung Hibrida P-21", tahapSaatIni: "Selesai", targetKg: 31000, realisasiKg: 29500, lokasi: "Gudang Processing B", catatan: "Batch benih Hibrida" },
      ];

      const listProses = details.proses?.length > 0 ? details.proses : [
        { kodeBatch: "BP-2606-0006", produk: "Jagung Hibrida N-27", tahapSaatIni: "Pemeliharaan / Processing", targetKg: 43500, realisasiKg: 41200, lokasi: "Gudang Processing B", catatan: "Proses pipil & pengeringan" },
        { kodeBatch: "BP-2606-0008", produk: "Padi Mekongga", tahapSaatIni: "Pemeliharaan / Processing", targetKg: 24100, realisasiKg: 23200, lokasi: "Gudang Processing A", catatan: "Pengolahan pasca panen" },
      ];

      const listPengeringan = details.pengeringan?.length > 0 ? details.pengeringan : [
        { kodeBatch: "DRY-2606-0006", produk: "Jagung Hibrida N-27", tahapSaatIni: "Pengeringan", targetKg: 43500, realisasiKg: 38280, lokasi: "Gudang Pengeringan 2 (Bed Dryer #2)", catatan: "Kadar air saat ini: 16.5% (Target: 13.0%)" },
        { kodeBatch: "DRY-2606-0007", produk: "Kacang Tanah Kelinci", tahapSaatIni: "Pengeringan", targetKg: 4300, realisasiKg: 3780, lokasi: "Lantai Jemur Utama", catatan: "Kadar air saat ini: 14.0% (Target: 10.0%)" },
        { kodeBatch: "DRY-2606-0008", produk: "Padi Mekongga", tahapSaatIni: "Pengeringan", targetKg: 24100, realisasiKg: 21200, lokasi: "Gudang Pengeringan 1 (Vertical Dryer #2)", catatan: "Kadar air saat ini: 15.2% (Target: 12.0%)" },
      ];

      const listSortasi = details.sortasi?.length > 0 ? details.sortasi : [
        { kodeBatch: "SRT-2606-0006", produk: "Jagung Hibrida N-27", tahapSaatIni: "Sortasi / QC", targetKg: 35000, realisasiKg: 33425, lokasi: "Gudang Sortasi 2 (Air Screen Cleaner)", catatan: "Recovery: 95.5% (Operator: Bambang S.)" },
        { kodeBatch: "SRT-2606-0007", produk: "Kacang Tanah Kelinci", tahapSaatIni: "Sortasi / QC", targetKg: 3800, realisasiKg: 3648, lokasi: "Gudang Sortasi 3 (Manual Sorting)", catatan: "Recovery: 96.0% (Operator: Siti N.)" },
        { kodeBatch: "SRT-2606-0008", produk: "Padi Mekongga", tahapSaatIni: "Sortasi / QC", targetKg: 20000, realisasiKg: 19240, lokasi: "Gudang Sortasi 1 (Optical Sorter)", catatan: "Recovery: 96.2% (Operator: Slamet R.)" },
      ];

      const listTidakAktif = details.tidakAktif?.length > 0 ? details.tidakAktif : [
        { kodeBatch: "JT-2606-0009", produk: "Rencana Kedelai Anjasmoro", tahapSaatIni: "Tidak Aktif (Draft)", targetKg: 2800, realisasiKg: 0, lokasi: "PJ: Dian Prasetyo", catatan: "Masih dalam rancangan pengajuan anggaran" },
        { kodeBatch: "JT-2606-0010", produk: "Uji Coba Padi Situ Bagendit", tahapSaatIni: "Tidak Aktif (Dibatalkan)", targetKg: 4000, realisasiKg: 0, lokasi: "PJ: Dewi Lestari", catatan: "Dibatalkan karena curah hujan tidak mencukupi" },
      ];

      const allItems = [...listSelesai, ...listProses, ...listPengeringan, ...listSortasi, ...listTidakAktif];

      // Filter displayed items by activeStatusTab
      let displayedItems = allItems;
      if (activeStatusTab === "Selesai") displayedItems = listSelesai;
      else if (activeStatusTab === "Proses") displayedItems = listProses;
      else if (activeStatusTab === "Pengeringan") displayedItems = listPengeringan;
      else if (activeStatusTab === "Sortasi / QC") displayedItems = listSortasi;
      else if (activeStatusTab === "Tidak Aktif") displayedItems = listTidakAktif;

      const tabs = [
        { id: "Semua", label: "Semua Status", count: allItems.length, color: "#374151", bg: "bg-gray-100 text-gray-700" },
        { id: "Selesai", label: "Selesai", count: listSelesai.length, color: "#10b981", bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
        { id: "Proses", label: "Proses", count: listProses.length, color: "#3b82f6", bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
        { id: "Pengeringan", label: "Pengeringan", count: listPengeringan.length, color: "#f59e0b", bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
        { id: "Sortasi / QC", label: "Sortasi / QC", count: listSortasi.length, color: "#ef4444", bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
        { id: "Tidak Aktif", label: "Tidak Aktif", count: listTidakAktif.length, color: "#9ca3af", bg: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
      ];

      return (
        <div className="space-y-5">
          {/* Top Interactive Metric Cards (Clickable) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {statusBreakdown.map((item, idx) => {
              const isActive = activeStatusTab === item.label;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStatusTab(item.label)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all transform hover:-translate-y-0.5 text-center ${
                    isActive
                      ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm"
                      : "border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-bodybg/50 hover:border-gray-300"
                  }`}
                >
                  <span className="text-[11px] font-bold block mb-1" style={{ color: item.color }}>
                    {item.label}
                  </span>
                  <span className="text-lg font-extrabold text-gray-800 dark:text-white">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-gray-100 dark:border-white/10">
            {tabs.map((tab) => {
              const isActive = activeStatusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveStatusTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-white/20 text-gray-700 dark:text-gray-200"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Table Based on Filter */}
          <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-gray-50 dark:bg-bodybg/50 font-bold text-xs text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <i className="ri-file-list-3-line text-emerald-500 text-sm"></i>
                Daftar Referensi Data: <strong className="text-emerald-600 dark:text-emerald-400">{activeStatusTab}</strong>
              </span>
              <span className="text-[11px] text-gray-400 font-normal">
                Menampilkan {displayedItems.length} dari {allItems.length} record
              </span>
            </div>
            <div className="table-responsive max-h-80 overflow-y-auto">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead className="bg-gray-50/90 dark:bg-bodybg/70 text-gray-500 sticky top-0 border-b border-gray-100 dark:border-white/10">
                  <tr>
                    <th className="py-2.5 px-3 text-left font-semibold">No.</th>
                    <th className="py-2.5 px-3 text-left font-semibold">Kode Referensi</th>
                    <th className="py-2.5 px-3 text-left font-semibold">Produk / Keterangan</th>
                    <th className="py-2.5 px-3 text-left font-semibold">Lokasi / Penanggung Jawab</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Target (Kg)</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Realisasi (Kg)</th>
                    <th className="py-2.5 px-3 text-left font-semibold">Catatan / Status rincian</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {displayedItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-gray-400 italic">
                        Tidak ada record data untuk status "{activeStatusTab}" pada periode ini.
                      </td>
                    </tr>
                  ) : (
                    displayedItems.map((row, idx) => {
                      const badgeClass =
                        row.statusGroup === "Selesai"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : row.statusGroup === "Proses"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : row.statusGroup === "Pengeringan"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : row.statusGroup === "Sortasi / QC"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

                      return (
                        <tr key={idx} className="hover:bg-gray-50/60 dark:hover:bg-bodybg/40 transition">
                          <td className="py-3 px-3 text-gray-400 font-medium">{row.no || idx + 1}</td>
                          <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{row.kodeBatch}</td>
                          <td className="py-3 px-3 font-semibold text-gray-800 dark:text-white">{row.produk}</td>
                          <td className="py-3 px-3 text-gray-600 dark:text-gray-300">{row.lokasi}</td>
                          <td className="py-3 px-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                            {typeof row.targetKg === "number" ? row.targetKg.toLocaleString("id-ID") : row.targetKg} Kg
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-gray-800 dark:text-white">
                            {typeof row.realisasiKg === "number" ? row.realisasiKg.toLocaleString("id-ID") : row.realisasiKg} Kg
                          </td>
                          <td className="py-3 px-3 text-gray-500 text-[11px] max-w-xs truncate" title={row.catatan}>
                            {row.catatan}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
                              {row.tahapSaatIni || row.statusGroup}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (type === "tahap_produksi") {
      const categories = data?.produksiPerTahap?.categories || ["Perencanaan", "Tanam", "Pemeliharaan", "Panen", "Pengeringan", "Sortasi", "QC"];
      const counts = tahapSeries[0]?.data || [24, 20, 16, 12, 8, 4, 3];

      return (
        <div className="space-y-4">
          <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-bodybg/50 font-bold text-xs text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/10">
              Rincian Sebaran Batch per Tahap Alur Produksi
            </div>
            <div className="table-responsive max-h-80 overflow-y-auto">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead className="bg-gray-50/80 dark:bg-bodybg/50 text-gray-500 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left">No.</th>
                    <th className="py-2 px-3 text-left">Tahap Produksi</th>
                    <th className="py-2 px-3 text-center">Jumlah Batch</th>
                    <th className="py-2 px-3 text-right">Est. Total Volume (Kg)</th>
                    <th className="py-2 px-3 text-center">Status Alur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {categories.map((cat, idx) => {
                    const cnt = counts[idx] || 0;
                    const estKg = cnt * 3500;
                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-bodybg/30">
                        <td className="py-2.5 px-3 text-gray-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          {cat}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{cnt} Batch</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                          {estKg.toLocaleString("id-ID")} Kg
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            Aktif Berjalan
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (type === "vs_target") {
      const categories = data?.produksiVsTarget?.categories || ["1-5 Jun", "6-10 Jun", "11-14 Jun", "15-20 Jun", "21-25 Jun", "26-30 Jun"];
      const prodData = vsTargetSeries[0]?.data || [3000, 7500, 9800, 16500, 21500, 25800];
      const targetData = vsTargetSeries[1]?.data || [5000, 10000, 15000, 20000, 25000, 30000];

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-100 dark:border-white/10 bg-emerald-50/40 dark:bg-emerald-900/10">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1 uppercase tracking-wider">
                Total Target
              </span>
              <h4 className="text-xl font-extrabold text-gray-800 dark:text-white">
                {(targetData[targetData.length - 1] || 25000).toLocaleString("id-ID")} Kg
              </h4>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-100 dark:border-white/10 bg-blue-50/40 dark:bg-blue-900/10">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mb-1 uppercase tracking-wider">
                Total Produksi
              </span>
              <h4 className="text-xl font-extrabold text-gray-800 dark:text-white">
                {(prodData[prodData.length - 1] || 18750).toLocaleString("id-ID")} Kg
              </h4>
            </div>
            <div className="p-3.5 rounded-xl border border-gray-100 dark:border-white/10 bg-amber-50/40 dark:bg-amber-900/10">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1 uppercase tracking-wider">
                Persentase Capaian
              </span>
              <h4 className="text-xl font-extrabold text-gray-800 dark:text-white">
                {Math.round(((prodData[prodData.length - 1] || 18750) * 100) / (targetData[targetData.length - 1] || 25000))}%
              </h4>
            </div>
          </div>

          <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-bodybg/50 font-bold text-xs text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/10">
              Tabel Komparasi Produksi Realisasi vs Target per Interval
            </div>
            <div className="table-responsive max-h-80 overflow-y-auto">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead className="bg-gray-50/80 dark:bg-bodybg/50 text-gray-500 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left">Periode Tanggal</th>
                    <th className="py-2 px-3 text-right">Target (Kg)</th>
                    <th className="py-2 px-3 text-right">Realisasi (Kg)</th>
                    <th className="py-2 px-3 text-right">Varian / Selisih (Kg)</th>
                    <th className="py-2 px-3 text-center">Capaian (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {categories.map((cat, idx) => {
                    const pKg = prodData[idx] || 0;
                    const tKg = targetData[idx] || 0;
                    const diff = pKg - tKg;
                    const pct = tKg > 0 ? Math.round((pKg / tKg) * 100) : 0;

                    return (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-bodybg/30">
                        <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-white">{cat}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-gray-500">{tKg.toLocaleString("id-ID")} Kg</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{pKg.toLocaleString("id-ID")} Kg</td>
                        <td className={`py-2.5 px-3 text-right font-semibold ${diff >= 0 ? "text-emerald-500" : "text-amber-500"}`}>
                          {diff >= 0 ? `+${diff.toLocaleString("id-ID")}` : diff.toLocaleString("id-ID")} Kg
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${pct >= 100 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (type === "produksi_produk") {
      return (
        <div className="space-y-4">
          <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-bodybg/50 font-bold text-xs text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
              <span>Akumulasi Volume Produksi Berdasarkan Produk</span>
              <span className="text-xs font-semibold text-emerald-600">Total: {(data?.produksiPerProduk?.totalKg || 18750).toLocaleString("id-ID")} Kg</span>
            </div>
            <div className="table-responsive max-h-80 overflow-y-auto">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead className="bg-gray-50/80 dark:bg-bodybg/50 text-gray-500 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left">No.</th>
                    <th className="py-2 px-3 text-left">Produk / Varietas</th>
                    <th className="py-2 px-3 text-right">Volume Produksi (Kg)</th>
                    <th className="py-2 px-3 text-center">Kontribusi (%)</th>
                    <th className="py-2 px-3 text-center">Status Stok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {produkBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-bodybg/30">
                      <td className="py-2.5 px-3 text-gray-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                        {item.label}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{item.detail}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-gray-700 dark:text-gray-300">
                        {item.detail.split("(")[1]?.replace(")", "") || "10.0%"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Tersedia
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (type === "card") {
      const card = customData || {};
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-bodybg/50 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{card.title}</span>
              <h3 className="text-3xl font-extrabold text-gray-800 dark:text-white">{card.value} <span className="text-sm font-normal text-gray-500">{card.unit}</span></h3>
            </div>
            <div className={`px-3 py-1.5 rounded-xl font-bold text-xs ${card.bgClass || 'bg-emerald-100 text-emerald-600'}`}>
              {card.percent} {card.subtext}
            </div>
          </div>

          <div className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-gray-50 dark:bg-bodybg/50 font-bold text-xs text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/10">
              Daftar Record Terkait {card.title}
            </div>
            <div className="table-responsive max-h-72 overflow-y-auto">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead className="bg-gray-50/80 dark:bg-bodybg/50 text-gray-500 sticky top-0">
                  <tr>
                    <th className="py-2 px-3 text-left">Kode Batch</th>
                    <th className="py-2 px-3 text-left">Produk</th>
                    <th className="py-2 px-3 text-left">Tanggal</th>
                    <th className="py-2 px-3 text-right">Target (Kg)</th>
                    <th className="py-2 px-3 text-right">Realisasi (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {batchList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-bodybg/30">
                      <td className="py-2 px-3 font-semibold text-emerald-600">{row.kodeBatch}</td>
                      <td className="py-2 px-3 font-medium text-gray-800 dark:text-white">{row.produk}</td>
                      <td className="py-2 px-3 text-gray-500">{row.tanggalTanam}</td>
                      <td className="py-2 px-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        {typeof row.targetKg === "number" ? row.targetKg.toLocaleString("id-ID") : row.targetKg}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        {typeof row.realisasiKg === "number" ? row.realisasiKg.toLocaleString("id-ID") : row.realisasiKg}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Fragment>
      <Seo title="Dashboard Produksi" />
      <Pageheader title="Dashboard Produksi" currentpage="Produksi" activepage="Dashboard Produksi" />

      {/* Header Info & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h5 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            Dashboard Produksi
            <i className="ri-line-chart-line text-emerald-500 text-lg"></i>
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Ringkasan aktivitas produksi benih secara real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-bodybg border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-700 dark:text-gray-200 shadow-sm relative focus-within:ring-2 focus-within:ring-emerald-500/20 transition">
            <i className="ri-calendar-line text-emerald-500 text-sm"></i>
            <SpkDatepickr
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer text-gray-700 dark:text-gray-200 w-44"
              placeholderText="Pilih rentang tanggal"
              startDate={startDate}
              endDate={endDate}
              selectsRange={true}
              dateFormat="dd/MM/yyyy"
              onChange={(update) => setDateRange(update)}
              isClearable={true}
            />
          </div>
          <button
            type="button"
            onClick={handleFilter}
            disabled={filtering || loading}
            className="ti-btn ti-btn-success text-white px-4 py-2 text-xs flex items-center gap-1.5 rounded-lg shadow-sm font-medium hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {filtering ? (
              <i className="ri-loader-4-line animate-spin text-sm"></i>
            ) : (
              <i className="ri-filter-3-line text-sm"></i>
            )}
            {filtering ? "Memuat..." : "Filter"}
          </button>
        </div>
      </div>

      {/* Top Row: 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
        {summaryCards.map((card, idx) => {
          const bgClass =
            card.bgClass ||
            (card.id === "batch_aktif"
              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              : card.id === "produksi_hari_ini"
                ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                : card.id === "target_bulan_ini"
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400");

          return (
            <div className="w-full" key={idx}>
              <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full transition-all hover:shadow-md">
                <div className="box-body p-4 flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase block mb-1">
                        {card.title}
                      </span>
                      <h3 className="font-extrabold text-2xl text-gray-800 dark:text-white tracking-tight">
                        {card.value}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${bgClass}`}>
                        <i className={card.icon}></i>
                      </div>
                      <button
                        type="button"
                        onClick={() => openDetailModal("card", card.title, `Detail referensi data ${card.title.toLowerCase()}`, card)}
                        className="text-gray-400 hover:text-emerald-600 transition p-0.5"
                        title="Lihat Detail Referensi"
                      >
                        <i className="ri-list-check text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-gray-400 font-medium block mb-2">{card.unit}</span>

                    {card.trend === "progress" ? (
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-emerald-600 dark:text-emerald-400">{card.percent} {card.subtext}</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full"
                            style={{ width: `${card.progressValue || 65}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs font-medium">
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold flex items-center me-1">
                          <i className="ri-arrow-up-s-fill text-sm"></i>
                          {card.percent}
                        </span>
                        <span className="text-gray-400">{card.subtext}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: 3 Visual Charts */}
      <div className="grid grid-cols-12 gap-5 mb-6">
        {/* Status Produksi */}
        <div className="col-span-12 lg:col-span-4">
          <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full">
            <div className="box-header border-b border-gray-100 dark:border-white/10 py-3.5 px-4 flex justify-between items-center">
              <h6 className="box-title font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <i className="ri-pie-chart-line text-emerald-500"></i>
                Status Produksi
              </h6>
              <button
                type="button"
                onClick={() => openDetailModal("status_produksi", "Detail Referensi Status Produksi", "Rincian status batch produksi dan referensi lokasi pengolahan")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md transition hover:bg-emerald-100"
              >
                <i className="ri-list-check text-sm"></i>
                Lihat Detail
              </button>
            </div>
            <div className="box-body p-4 flex items-center h-full">
              <div className="grid grid-cols-12 items-center w-full gap-2">
                <div className="col-span-12 xl:col-span-6 flex justify-center">
                  <Spkapexcharts
                    key={JSON.stringify(statusProduksiSeries)}
                    chartOptions={statusProduksiOptions}
                    chartSeries={statusProduksiSeries}
                    type="donut"
                    width={"100%"}
                    height={180}
                  />
                </div>

                <div className="col-span-12 xl:col-span-6 space-y-2">
                  {statusBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-gray-600 dark:text-gray-300 font-medium min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full me-2 inline-block shrink-0"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="truncate" title={item.label}>{item.label}</span>
                      </span>
                      <span className="font-semibold text-gray-800 dark:text-white ms-1 whitespace-nowrap">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produksi per Tahap */}
        <div className="col-span-12 lg:col-span-4">
          <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full">
            <div className="box-header border-b border-gray-100 dark:border-white/10 py-3.5 px-4 flex justify-between items-center">
              <h6 className="box-title font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <i className="ri-bar-chart-horizontal-line text-emerald-500"></i>
                Produksi per Tahap
              </h6>
              <button
                type="button"
                onClick={() => openDetailModal("tahap_produksi", "Detail Referensi Produksi per Tahap", "Rincian alur tahapan budidaya dan pemrosesan batch benih")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md transition hover:bg-emerald-100"
              >
                <i className="ri-list-check text-sm"></i>
                Lihat Detail
              </button>
            </div>
            <div className="box-body p-4">
              <Spkapexcharts
                chartOptions={tahapOptions}
                chartSeries={tahapSeries}
                type="bar"
                width={"100%"}
                height={260}
              />
            </div>
          </div>
        </div>

        {/* Produksi vs Target */}
        <div className="col-span-12 lg:col-span-4">
          <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full">
            <div className="box-header border-b border-gray-100 dark:border-white/10 py-3.5 px-4 flex justify-between items-center">
              <h6 className="box-title font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <i className="ri-line-chart-line text-emerald-500"></i>
                Produksi vs Target
              </h6>
              <button
                type="button"
                onClick={() => openDetailModal("vs_target", "Detail Referensi Produksi vs Target", "Evaluasi pencapaian target produksi terhadap realisasi per periode")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md transition hover:bg-emerald-100"
              >
                <i className="ri-list-check text-sm"></i>
                Lihat Detail
              </button>
            </div>
            <div className="box-body p-4">
              <Spkapexcharts
                chartOptions={vsTargetOptions}
                chartSeries={vsTargetSeries}
                type="line"
                width={"100%"}
                height={260}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Batches Table, Product Breakdown, and Notifications */}
      <div className="grid grid-cols-12 gap-5">
        {/* Table: Batch Produksi Aktif */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-6">
          <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full flex flex-col justify-between">
            <div>
              <div className="box-header border-b border-gray-100 dark:border-white/10 py-3.5 px-4 flex justify-between items-center">
                <h6 className="box-title font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                  <i className="ri-table-line text-emerald-500"></i>
                  Batch Produksi Aktif
                </h6>
                <button
                  type="button"
                  onClick={() => openDetailModal("status_produksi", "Detail Referensi Batch Produksi Aktif", "Daftar lengkap batch produksi aktif dan progres lapangan")}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md transition hover:bg-emerald-100"
                >
                  <i className="ri-list-check text-sm"></i>
                  Lihat Detail
                </button>
              </div>
              <div className="box-body p-0">
                <div className="table-responsive">
                  <table className="table whitespace-nowrap min-w-full text-xs">
                    <thead className="bg-gray-50/80 dark:bg-bodybg/50 text-gray-500 border-b border-gray-100 dark:border-white/10">
                      <tr>
                        <th className="py-2.5 px-3 text-left font-semibold">No.</th>
                        <th className="py-2.5 px-3 text-left font-semibold">Kode Batch</th>
                        <th className="py-2.5 px-3 text-left font-semibold">Produk / Varietas</th>
                        <th className="py-2.5 px-3 text-left font-semibold">Tanggal Tanam</th>
                        <th className="py-2.5 px-3 text-left font-semibold">Tahap Saat Ini</th>
                        <th className="py-2.5 px-3 text-left font-semibold">Progress</th>
                        <th className="py-2.5 px-3 text-right font-semibold">Target (Kg)</th>
                        <th className="py-2.5 px-3 text-right font-semibold">Realisasi (Kg)</th>
                        <th className="py-2.5 px-3 text-center font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                      {batchList.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-bodybg/30 transition">
                          <td className="py-3 px-3 text-gray-500">{row.no}</td>
                          <td className="py-3 px-3 font-semibold text-gray-800 dark:text-white">
                            {row.kodeBatch}
                          </td>
                          <td className="py-3 px-3 text-gray-700 dark:text-gray-300">{row.produk}</td>
                          <td className="py-3 px-3 text-gray-500">{row.tanggalTanam}</td>
                          <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">
                            {row.tahapSaatIni}
                          </td>
                          <td className="py-3 px-3 w-24">
                            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`${row.progressColor || "bg-emerald-500"} h-1.5 rounded-full`}
                                style={{ width: `${row.progress}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                            {typeof row.targetKg === "number" ? row.targetKg.toLocaleString("id-ID") : row.targetKg}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                            {typeof row.realisasiKg === "number" ? row.realisasiKg.toLocaleString("id-ID") : row.realisasiKg}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => openDetailModal("card", `Batch ${row.kodeBatch}`, `Detail Rincian Batch ${row.kodeBatch} (${row.produk})`, row)}
                              className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-gray-100 hover:bg-emerald-50 hover:text-emerald-600 text-gray-500 dark:bg-white/10 dark:text-gray-300 transition"
                              title="Detail Batch"
                            >
                              <i className="ri-eye-line text-xs"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-white/10 text-left">
              <Link
                href="/produksi/batchproduksi"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 transition"
              >
                Lihat semua batch aktif <i className="ri-arrow-right-line text-sm"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Produksi per Produk (Kg) */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-3">
          <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full flex flex-col justify-between">
            <div className="box-header border-b border-gray-100 dark:border-white/10 py-3.5 px-4 flex justify-between items-center">
              <h6 className="box-title font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                <i className="ri-price-tag-3-line text-emerald-500"></i>
                Produksi per Produk
              </h6>
              <button
                type="button"
                onClick={() => openDetailModal("produksi_produk", "Detail Referensi Produksi per Produk", "Akumulasi volume produksi benih berdasarkan komoditas dan varietas")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-md transition hover:bg-emerald-100"
              >
                <i className="ri-list-check text-sm"></i>
                Lihat Detail
              </button>
            </div>
            <div className="box-body p-4 flex flex-col justify-between">
              <div className="my-1">
                <Spkapexcharts
                  chartOptions={produkOptions}
                  chartSeries={produkSeries}
                  type="donut"
                  width={"100%"}
                  height={200}
                />
              </div>

              <div className="space-y-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/10">
                {produkBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-gray-600 dark:text-gray-300 font-medium">
                      <span
                        className="w-2.5 h-2.5 rounded-full me-2.5 inline-block"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.label}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notifikasi Produksi */}
        <div className="col-span-12 lg:col-span-3 xl:col-span-3">
          <div className="box custom-box shadow-sm border border-gray-100 dark:border-white/10 rounded-xl h-full flex flex-col justify-between">
            <div>
              <div className="box-header border-b border-gray-100 dark:border-white/10 py-3.5 px-4 flex justify-between items-center">
                <h6 className="box-title font-bold text-gray-800 dark:text-white text-sm flex items-center gap-2">
                  <i className="ri-notification-3-line text-emerald-500"></i>
                  Notifikasi Produksi
                </h6>
                <button
                  type="button"
                  onClick={() => openDetailModal("card", "Detail Notifikasi Produksi", "Daftar notifikasi aktivitas & peringatan alur produksi benih", { title: "NOTIFIKASI PRODUKSI", value: notifications.length, unit: "Pemberitahuan", bgClass: "bg-purple-100 text-purple-600" })}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded transition"
                  title="Lihat Detail Notifikasi"
                >
                  <i className="ri-list-check text-sm"></i>
                </button>
              </div>
              <div className="box-body p-4">
                <div className="space-y-4">
                  {notifications.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-semibold ${item.bgColor}`}
                      >
                        <i className={item.icon}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ms-1">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-100 dark:border-white/10 text-left">
              <a
                href="#!"
                onClick={(e) => {
                  e.preventDefault();
                  openDetailModal("card", "Detail Notifikasi Produksi", "Daftar notifikasi aktivitas & peringatan alur produksi benih", { title: "NOTIFIKASI PRODUKSI", value: notifications.length, unit: "Pemberitahuan", bgClass: "bg-purple-100 text-purple-600" });
                }}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1 transition"
              >
                Lihat semua notifikasi <i className="ri-arrow-right-line text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail Referensi Widget */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-bodybg rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transition-all transform duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-bodybg/50">
              <div>
                <h5 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <i className="ri-information-fill text-emerald-500 text-xl"></i>
                  {modalConfig.title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {modalConfig.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-500 dark:text-gray-300 transition"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {renderModalContent()}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/30 dark:bg-bodybg/30">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <i className="ri-shield-check-line text-emerald-500 text-sm"></i>
                Data referensi real-time terverifikasi sistem ERP
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="ti-btn ti-btn-secondary px-5 py-2 text-xs font-semibold rounded-lg shadow-sm hover:bg-gray-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default DashboardProduksi;
