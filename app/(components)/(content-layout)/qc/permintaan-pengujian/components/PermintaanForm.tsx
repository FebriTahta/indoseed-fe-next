"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import {
  SaveButton,
  CancelButton,
  ManageButton,
  AddButton,
  DeleteIconButton,
} from "@/app/(components)/(content-layout)/shared/ActionButtons";
import SpkButton from "@/shared/@spk-reusable-components/uielements/spk-button";
import { toast } from "react-toastify";
import { qcService } from "@/app/services/qcService";
import { batchProduksiService } from "@/app/services/batchProduksiService";
import { permintaanPengujianService } from "@/app/services/permintaanPengujianService";
import { TestParameter, TestMethod } from "@/app/types/qc";
import ManageParameterUjiModal, {
  FormParameterItem,
  isMethodMatchingCommodityOrVariety,
} from "./ManageParameterUjiModal";

const defaultMockBatches = [
  {
    value: "BTH-2026-00125",
    label: "BTH-2026-00125 (Melon - Melon Tere F1)",
    data: {
      komoditas: "Melon",
      varietas: "Melon Tere F1",
      tipe: "QC / Benih",
      petani: "Suryadi",
      lahan: "Lahan 01 / Blok A",
      panen: "16 Jun 2026",
    },
  },
  {
    value: "BTH-2026-00124",
    label: "BTH-2026-00124 (Cabai - Keriting)",
    data: {
      komoditas: "Cabai",
      varietas: "Keriting",
      tipe: "QC / Benih",
      petani: "Budi",
      lahan: "Lahan 02 / Blok B",
      panen: "15 Jun 2026",
    },
  },
  {
    value: "BTH-2026-00122",
    label: "BTH-2026-00122 (Padi - Inpari 32)",
    data: {
      komoditas: "Padi",
      varietas: "Inpari 32",
      tipe: "QC / Benih",
      petani: "Mulyono",
      lahan: "Lahan 03 / Blok C",
      panen: "14 Jun 2026",
    },
  },
  {
    value: "BTH-2026-00121",
    label: "BTH-2026-00121 (Melon - Melon Tere F1)",
    data: {
      komoditas: "Melon",
      varietas: "Melon Tere F1",
      tipe: "QC / Benih",
      petani: "Suryadi",
      lahan: "Lahan 01 / Blok B",
      panen: "13 Jun 2026",
    },
  },
  {
    value: "BTH-2026-00119",
    label: "BTH-2026-00119 (Cabai - Rawit)",
    data: {
      komoditas: "Cabai",
      varietas: "Rawit",
      tipe: "QC / Benih",
      petani: "Santoso",
      lahan: "Lahan 04 / Blok A",
      panen: "12 Jun 2026",
    },
  },
];

const mockRequests: Record<string, any> = {
  "1": {
    noPermintaan: "RQ-QC-2026-00125",
    tanggal: "2026-06-16",
    batch: "BTH-2026-00125",
    prioritas: "normal",
    pemohon: "produksi",
    parameters: [
      {
        id: "p-002",
        parameterId: "ee0392e3-826e-41e1-988a-ddedb4b56367",
        kode: "P002",
        parameter: "Kadar Air",
        kategori: "Fisik",
        metode: "ISTA 2.2 - Moisture Content",
        metodeKode: "ISTA 2.2",
        metodeNama: "Moisture Content",
        standar: "≤ 12 %",
        satuan: "%",
        checked: true,
      },
      {
        id: "p-001",
        parameterId: "8b293cf4-fb11-482e-83cf-d291d5fb4fb2",
        kode: "P001",
        parameter: "Daya Tumbuh",
        kategori: "Fisiologis",
        metode: "ISTA 5.2.1 - Germination Test",
        metodeKode: "ISTA 5.2.1",
        metodeNama: "Germination Test",
        standar: "≥ 80 %",
        satuan: "%",
        checked: true,
      },
    ],
  },
  "2": {
    noPermintaan: "RQ-QC-2026-00124",
    tanggal: "2026-06-15",
    batch: "BTH-2026-00124",
    prioritas: "normal",
    pemohon: "produksi",
    parameters: [
      {
        id: "p-003",
        parameterId: "df3374df-5227-4b2b-8a3c-319db8a534d8",
        kode: "P003",
        parameter: "Kemurnian",
        kategori: "Fisik",
        metode: "ISTA 2.10 - Purity Analysis",
        metodeKode: "ISTA 2.10",
        metodeNama: "Purity Analysis",
        standar: "≥ 98 %",
        satuan: "%",
        checked: true,
      },
    ],
  },
  "3": {
    noPermintaan: "RQ-QC-2026-00123",
    tanggal: "2026-06-14",
    batch: "BTH-2026-00122",
    prioritas: "urgent",
    pemohon: "produksi",
    parameters: [
      {
        id: "p-001",
        parameterId: "8b293cf4-fb11-482e-83cf-d291d5fb4fb2",
        kode: "P001",
        parameter: "Daya Tumbuh",
        kategori: "Fisiologis",
        metode: "ISTA 5.2.1 - Germination Test",
        metodeKode: "ISTA 5.2.1",
        metodeNama: "Germination Test",
        standar: "≥ 80 %",
        satuan: "%",
        checked: true,
      },
      {
        id: "p-004",
        parameterId: "param-004",
        kode: "P004",
        parameter: "Vigor",
        kategori: "Fisiologis",
        metode: "ISTA 5.3 - Accelerated Aging",
        metodeKode: "ISTA 5.3",
        metodeNama: "Accelerated Aging",
        standar: "≥ 70 %",
        satuan: "%",
        checked: true,
      },
    ],
  },
  "4": {
    noPermintaan: "RQ-QC-2026-00122",
    tanggal: "2026-06-13",
    batch: "BTH-2026-00121",
    prioritas: "normal",
    pemohon: "produksi",
    parameters: [],
  },
  "5": {
    noPermintaan: "RQ-QC-2026-00121",
    tanggal: "2026-06-12",
    batch: "BTH-2026-00119",
    prioritas: "normal",
    pemohon: "produksi",
    parameters: [],
  },
};

interface PermintaanFormProps {
  mode?: "create" | "edit";
  id?: string;
  initialData?: any;
  onCancel?: () => void;
}

const PermintaanForm = ({
  mode = "create",
  id,
  initialData,
  onCancel,
}: PermintaanFormProps = {}) => {
  const router = useRouter();

  const existingData = initialData || (id ? mockRequests[id] : null);

  // Batches state (combines mockBatches & database batch_produksi)
  const [batches, setBatches] = useState<any[]>(defaultMockBatches);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  // Form Basic Info
  const [noPermintaan, setNoPermintaan] = useState(
    existingData?.noPermintaan || "RQ-QC-2026-00126"
  );
  const [tanggal, setTanggal] = useState(
    existingData?.tanggal || new Date().toISOString().split("T")[0]
  );
  const [pemohon, setPemohon] = useState(existingData?.pemohon || "produksi");
  const [prioritas, setPrioritas] = useState(existingData?.prioritas || "normal");

  // Sample Info
  const [jumlahSampel, setJumlahSampel] = useState("500");
  const [satuanSampel, setSatuanSampel] = useState("gram");
  const [metodeSampling, setMetodeSampling] = useState("sop");
  const [pengambilSampel, setPengambilSampel] = useState("andi");

  // Parameters Management State
  // Initial parameters: EMPTY in create mode, or existingData in edit mode
  const [parameters, setParameters] = useState<FormParameterItem[]>(
    existingData?.parameters || []
  );
  const [dbParameters, setDbParameters] = useState<TestParameter[]>([]);
  const [methods, setMethods] = useState<TestMethod[]>([]);
  const [isLoadingDbParams, setIsLoadingDbParams] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);

  // State for adding parameter ONE BY ONE (Satu per Satu)
  const [selectedParamToAdd, setSelectedParamToAdd] = useState<any>(null);
  const [selectedMethodToAdd, setSelectedMethodToAdd] = useState<any>(null);
  const [customStandardToAdd, setCustomStandardToAdd] = useState<string>("");

  // Tabs
  const tabs = ["Parameter Uji", "Catatan & Dokumen", "Riwayat"];
  const [activeTab, setActiveTab] = useState<string>("Parameter Uji");

  // Notes & Attachment State
  const [catatan, setCatatan] = useState<string>(existingData?.catatan || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Prevent SSR hydration mismatch for dynamic client Select components
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch DB batches
  const fetchDbBatches = async () => {
    try {
      const res = await batchProduksiService.getBatchProduksiList({ limit: 100 });
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      if (list.length > 0) {
        const formatted = list.map((b: any) => ({
          value: b.kodeBatch,
          label: `${b.kodeBatch} — ${b.komoditas || "Benih"} (${b.varietas || "-"})`,
          data: {
            komoditas: b.komoditas || "Benih",
            varietas: b.varietas || "-",
            tipe: "QC / Benih",
            petani: b.sumberBahan || "Mitra Utama",
            lahan: b.lokasi || "Gudang Processing",
            panen: b.tanggalSelesai || b.tanggalMulai || "12 Jun 2026",
          },
        }));

        // Merge DB batches with mock batches (prevent duplicate values)
        const combined = [...formatted];
        defaultMockBatches.forEach((mb) => {
          if (!combined.some((item) => item.value === mb.value)) {
            combined.push(mb);
          }
        });
        setBatches(combined);

        // Update selectedBatch if existing
        if (existingData?.batch) {
          const match = combined.find((b) => b.value === existingData.batch);
          if (match) setSelectedBatch(match);
        }
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // Fetch DB parameters & methods
  const fetchDbParameters = async () => {
    setIsLoadingDbParams(true);
    try {
      const [paramRes, methodRes] = await Promise.all([
        qcService.getParameters(),
        qcService.getMethods(),
      ]);

      const paramList = Array.isArray(paramRes)
        ? paramRes
        : Array.isArray(paramRes?.data)
        ? paramRes.data
        : [];
      setDbParameters(paramList);

      const methodList = Array.isArray(methodRes)
        ? methodRes
        : Array.isArray(methodRes?.data)
        ? methodRes.data
        : [];
      setMethods(methodList);

      // In edit mode: if existingData has parameters, load them
      if (mode === "edit" && existingData?.parameters) {
        setParameters(existingData.parameters);
      }
    } catch (error) {
      console.error("Error fetching parameters or methods from DB:", error);
    } finally {
      setIsLoadingDbParams(false);
    }
  };

  useEffect(() => {
    fetchDbBatches();
    fetchDbParameters();
  }, []);

  useEffect(() => {
    // If create mode, fetch sequential auto-number from API
    if (mode === "create" && !initialData) {
      permintaanPengujianService
        .getNextNumber()
        .then((res) => {
          if (res?.data?.noPermintaan) {
            setNoPermintaan(res.data.noPermintaan);
          }
        })
        .catch((e) => console.error("Error getting next number:", e));
    }

    // If edit mode with id, fetch real data from API
    if (mode === "edit" && id) {
      permintaanPengujianService
        .getPermintaanById(id)
        .then((res) => {
          if (res && res.data) {
            const d = res.data;
            if (d.noPermintaan) setNoPermintaan(d.noPermintaan);
            if (d.tanggal) {
              const t =
                typeof d.tanggal === "string"
                  ? d.tanggal.split("T")[0]
                  : new Date(d.tanggal).toISOString().split("T")[0];
              setTanggal(t);
            }
            if (d.pemohon) setPemohon(d.pemohon);
            if (d.prioritas) setPrioritas(d.prioritas);
            if (d.jumlahSampel !== undefined)
              setJumlahSampel(String(d.jumlahSampel));
            if (d.satuanSampel) setSatuanSampel(d.satuanSampel);
            if (d.metodeSampling) setMetodeSampling(d.metodeSampling);
            if (d.pengambilSampel) setPengambilSampel(d.pengambilSampel);
            if (d.catatan) setCatatan(d.catatan);
            if (d.fileLampiranUrl) setExistingFileUrl(d.fileLampiranUrl);
            if (d.fileLampiranNama) setExistingFileName(d.fileLampiranNama);
            if (d.parameters && Array.isArray(d.parameters)) {
              const formatted: FormParameterItem[] = d.parameters.map((p: any) => ({
                id: p.id,
                parameterId: p.parameterId,
                kode: p.kode,
                parameter: p.nama || p.parameter,
                nama: p.nama || p.parameter,
                kategori: p.kategori,
                metodeId: p.metodeId,
                metode:
                  p.metode ||
                  `${p.metodeKode || ""} ${p.metodeNama || ""}`.trim(),
                metodeKode: p.metodeKode,
                metodeNama: p.metodeNama,
                standar: p.standar || "",
                satuan: p.satuan || "%",
                checked: p.checked !== undefined ? p.checked : true,
                definisi: p.definisi,
                keterangan: p.keterangan,
                isCustom: p.isCustom,
              }));
              setParameters(formatted);
            }
            if (d.kodeBatch) {
              setSelectedBatch({
                value: d.kodeBatch,
                label: `${d.kodeBatch} — ${d.komoditas || "Benih"} (${d.varietas || "-"})`,
                data: {
                  id: d.batchProduksiId,
                  komoditas: d.komoditas || "Benih",
                  varietas: d.varietas || "-",
                  tipe: d.tipe || "QC / Benih",
                  petani: d.petani || "Mitra Utama",
                  lahan: d.lahan || "-",
                  panen: d.panen || "-",
                },
              });
            }
          }
        })
        .catch((err) => {
          console.warn("Could not load detail from API, using fallback:", err);
        });
    }
  }, [mode, id, initialData]);

  useEffect(() => {
    if (existingData && mode !== "edit") {
      if (existingData.noPermintaan) setNoPermintaan(existingData.noPermintaan);
      if (existingData.tanggal) setTanggal(existingData.tanggal);
      if (existingData.pemohon) setPemohon(existingData.pemohon);
      if (existingData.prioritas) setPrioritas(existingData.prioritas);
      if (existingData.batch) {
        const found = batches.find((b) => b.value === existingData.batch);
        if (found) setSelectedBatch(found);
      }
      if (existingData.parameters) {
        setParameters(existingData.parameters);
      }
    } else if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0]);
    }
  }, [id, initialData, batches]);

  // When a user selects a parameter in the "Tambah Satu per Satu" dropdown
  const handleSelectParamOption = (option: any) => {
    setSelectedParamToAdd(option);
    if (!option) {
      setSelectedMethodToAdd(null);
      setCustomStandardToAdd("");
      return;
    }

    const paramData: TestParameter = option.param;
    // Auto-fill locked method directly from param
    if (paramData.metode) {
      setSelectedMethodToAdd({
        value: paramData.metode.id,
        label: `${paramData.metode.kode ? `${paramData.metode.kode} - ` : ""}${paramData.metode.nama}`,
        method: paramData.metode,
      });
    } else {
      setSelectedMethodToAdd(null);
    }

    // Auto-fill standard directly from master data (locked)
    const std = paramData.batasAcuan
      ? `${paramData.batasAcuan} ${paramData.satuan || ""}`.trim()
      : "-";
    setCustomStandardToAdd(std);
  };

  // Add the single selected parameter to the table
  const handleAddSingleParameter = () => {
    if (!selectedParamToAdd) {
      toast.warning("Silakan pilih parameter uji terlebih dahulu");
      return;
    }

    const p: TestParameter = selectedParamToAdd.param;
    const methodObj = p.metode; // Strictly locked to param's master method
    const standardDisplay = p.batasAcuan
      ? `${p.batasAcuan} ${p.satuan || ""}`.trim()
      : "-";

    // Check if already in the list
    const isAlreadyAdded = parameters.some(
      (item) => item.parameterId === p.id || item.kode === p.kode
    );

    if (isAlreadyAdded) {
      toast.warning(`Parameter ${p.nama} sudah ada di daftar pengujian.`);
      return;
    }

    const newParamItem: FormParameterItem = {
      id: p.id || `param-${Date.now()}`,
      parameterId: p.id,
      kode: p.kode,
      parameter: p.nama,
      kategori: p.kategori || "Umum",
      metode: methodObj
        ? `${methodObj.kode ? `${methodObj.kode} - ` : ""}${methodObj.nama}`
        : "-",
      metodeKode: methodObj?.kode,
      metodeNama: methodObj?.nama,
      standar: standardDisplay,
      satuan: p.satuan,
      checked: true,
      definisi: p.definisi,
      keterangan: p.keterangan,
    };

    setParameters((prev) => [...prev, newParamItem]);
    toast.success(`Parameter "${p.nama}" berhasil ditambahkan.`);

    // Reset inputs for next addition
    setSelectedParamToAdd(null);
    setSelectedMethodToAdd(null);
    setCustomStandardToAdd("");
  };

  // Available parameters for dropdown (exclude ones already in table and match commodity/variety)
  const availableParamsForDropdown = useMemo(() => {
    const currentKeys = new Set(
      parameters.map((p) => p.parameterId || p.kode)
    );
    const k = selectedBatch?.data?.komoditas;
    const v = selectedBatch?.data?.varietas;

    return dbParameters
      .filter((p) => !currentKeys.has(p.id) && !currentKeys.has(p.kode))
      .filter((p) => isMethodMatchingCommodityOrVariety(p.metode, k, v))
      .map((p) => ({
        value: p.id,
        label: `[${p.kode}] ${p.nama} — ${p.kategori || "QC"}`,
        param: p,
      }));
  }, [dbParameters, parameters, selectedBatch]);

  // Available methods for dropdown
  const methodOptions = useMemo(() => {
    return methods.map((m) => ({
      value: m.id,
      label: `${m.kode ? `${m.kode} - ` : ""}${m.nama}`,
      method: m,
    }));
  }, [methods]);

  // Toggle single parameter checked
  const toggleParameter = (id: string) => {
    setParameters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p))
    );
  };

  // Remove parameter from this request
  const handleRemoveParameter = (id: string) => {
    setParameters((prev) => prev.filter((p) => p.id !== id));
    toast.info("Parameter dihapus dari daftar pengujian");
  };

  // Toggle select all
  const allChecked = useMemo(() => {
    return parameters.length > 0 && parameters.every((p) => p.checked);
  }, [parameters]);

  const toggleSelectAll = () => {
    const nextState = !allChecked;
    setParameters((prev) => prev.map((p) => ({ ...p, checked: nextState })));
  };



  const activeParametersCount = parameters.filter((p) => p.checked).length;

  const handleSave = async () => {
    if (!selectedBatch) {
      toast.error("Harap pilih batch produksi terlebih dahulu");
      return;
    }

    if (activeParametersCount === 0) {
      toast.warning("Tambahkan dan pilih minimal 1 parameter uji yang aktif");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        noPermintaan,
        tanggal,
        kodeBatch: selectedBatch.value,
        batchProduksiId: selectedBatch.data?.id || null,
        komoditas: selectedBatch.data?.komoditas || "",
        varietas: selectedBatch.data?.varietas || "",
        tipe: selectedBatch.data?.tipe || "QC / Benih",
        petani: selectedBatch.data?.petani || "",
        lahan: selectedBatch.data?.lahan || "",
        panen: selectedBatch.data?.panen || "",
        jumlahSampel: Number(jumlahSampel) || 0,
        satuanSampel,
        metodeSampling,
        pengambilSampel,
        pemohon,
        prioritas,
        catatan,
        parameters: parameters
          .filter((p) => p.checked)
          .map((p) => ({
            parameterId: p.parameterId || null,
            kode: p.kode,
            nama: p.parameter || p.nama,
            kategori: p.kategori,
            metodeId: p.metodeId || null,
            metode: p.metode,
            metodeKode: p.metodeKode,
            metodeNama: p.metodeNama,
            standar: p.standar,
            satuan: p.satuan,
            checked: true,
            definisi: p.definisi,
            keterangan: p.keterangan,
            isCustom: p.isCustom,
          })),
      };

      if (selectedFile) {
        const formData = new FormData();
        Object.keys(payload).forEach((k) => {
          if (k === "parameters") {
            formData.append(k, JSON.stringify(payload[k]));
          } else if (payload[k] !== undefined && payload[k] !== null) {
            formData.append(k, payload[k]);
          }
        });
        formData.append("file", selectedFile);

        if (mode === "edit" && id) {
          await permintaanPengujianService.updatePermintaan(id, formData);
        } else {
          await permintaanPengujianService.createPermintaan(formData);
        }
      } else {
        if (mode === "edit" && id) {
          await permintaanPengujianService.updatePermintaan(id, payload);
        } else {
          await permintaanPengujianService.createPermintaan(payload);
        }
      }

      toast.success(
        mode === "edit"
          ? `Permintaan pengujian ${noPermintaan} berhasil diperbarui.`
          : `Permintaan pengujian ${noPermintaan} berhasil dibuat.`
      );

      if (onCancel) {
        onCancel();
      } else {
        router.push("/qc/permintaan-pengujian");
      }
    } catch (err: any) {
      console.error("Error saving permintaan:", err);
      toast.error(
        err.response?.data?.message || "Gagal menyimpan permintaan pengujian"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <i className="ri-loader-4-line text-3xl animate-spin text-emerald-600 mb-2"></i>
        <p className="text-xs text-gray-500 font-medium">Memuat form permintaan pengujian...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="space-y-4">
        {/* Header Info (Top Bar) & Actions */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6 overflow-x-auto">
          {/* Left: Form Fields */}
          <div className="flex items-center gap-6 min-w-max">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-file-list-3-line"></i> No. Permintaan
              </p>
              <div className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                {noPermintaan}{" "}
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                  {mode === "edit" ? "Edit" : "Auto"}
                </span>
              </div>
            </div>

            <div className="h-8 border-l border-gray-200"></div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-calendar-event-line text-emerald-600"></i> Tanggal
                Permintaan
              </p>
              <div className="font-semibold text-gray-800">
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="text-sm border-none bg-transparent p-0 focus:ring-0 cursor-pointer text-gray-800 font-semibold"
                />
              </div>
            </div>

            <div className="h-8 border-l border-gray-200"></div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-user-line text-emerald-600"></i> Pemohon
              </p>
              <div className="w-32">
                <Select
                  instanceId="select-permintaan-pemohon"
                  options={[
                    { value: "produksi", label: "Produksi" },
                    { value: "gudang", label: "Gudang" },
                    { value: "rnd", label: "R & D" },
                  ]}
                  value={{
                    value: pemohon,
                    label:
                      pemohon === "produksi"
                        ? "Produksi"
                        : pemohon === "gudang"
                        ? "Gudang"
                        : "R & D",
                  }}
                  onChange={(val: any) => setPemohon(val?.value || "produksi")}
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "28px",
                      height: "28px",
                      border: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                    }),
                    valueContainer: (base) => ({ ...base, padding: "0px" }),
                    input: (base) => ({ ...base, margin: "0px", padding: "0px" }),
                    indicatorSeparator: () => ({ display: "none" }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "0px",
                      color: "#10b981",
                    }),
                  }}
                />
              </div>
            </div>

            <div className="h-8 border-l border-gray-200"></div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <i className="ri-alert-line text-rose-500"></i> Prioritas
              </p>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="prioritas"
                    value="normal"
                    checked={prioritas === "normal"}
                    onChange={() => setPrioritas("normal")}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Normal</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="prioritas"
                    value="urgent"
                    checked={prioritas === "urgent"}
                    onChange={() => setPrioritas("urgent")}
                    className="text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-rose-600">Urgent</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 min-w-max">
            <CancelButton
              onClick={() =>
                onCancel ? onCancel() : router.push("/qc/permintaan-pengujian")
              }
            />
            <SaveButton
              label={mode === "edit" ? "Simpan Perubahan" : "Submit Permintaan"}
              onClick={handleSave}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Main Content Layout (12 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Batch & Sample Info */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            {/* Sumber Batch */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-archive-line text-emerald-600 text-lg"></i> Sumber Batch
              </h5>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pilih Batch <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    instanceId="select-permintaan-batch"
                    options={batches}
                    value={selectedBatch}
                    onChange={(val: any) => setSelectedBatch(val)}
                    placeholder="Pilih atau cari Batch..."
                    className="text-sm mb-2"
                  />
                  {selectedBatch && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <i className="ri-check-line text-emerald-600"></i> Batch Terpilih
                      </span>
                    </div>
                  )}
                </div>

                {selectedBatch && selectedBatch.data ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs text-gray-500 block">Komoditas</span>
                        <span className="font-medium text-gray-800 flex items-center gap-1">
                          <i className="ri-leaf-fill text-emerald-500"></i>{" "}
                          {selectedBatch.data.komoditas}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block">Varietas</span>
                        <span className="font-medium text-gray-800">
                          {selectedBatch.data.varietas}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Tipe</span>
                      <span className="font-medium text-gray-800">
                        {selectedBatch.data.tipe}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Petani Mitra / Sumber
                      </span>
                      <span className="font-medium text-gray-800">
                        <i className="ri-team-line text-emerald-600 mr-1"></i>{" "}
                        {selectedBatch.data.petani}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Lahan / Blok</span>
                      <span className="font-medium text-gray-800">
                        <i className="ri-map-pin-line text-emerald-600 mr-1"></i>{" "}
                        {selectedBatch.data.lahan}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Tanggal Panen</span>
                      <span className="font-medium text-gray-800">
                        <i className="ri-calendar-line text-emerald-600 mr-1"></i>{" "}
                        {selectedBatch.data.panen}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200 border-dashed text-gray-400 text-xs">
                    Pilih batch untuk melihat detail informasi
                  </div>
                )}
              </div>
            </div>

            {/* Informasi Sampel */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-flask-line text-emerald-600 text-md"></i> Informasi
                Sampel
              </h5>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Jumlah Sampel <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex relative shadow-sm">
                    <input
                      type="number"
                      value={jumlahSampel}
                      onChange={(e) => setJumlahSampel(e.target.value)}
                      className="w-full pl-3 pr-16 py-2 border border-gray-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                      placeholder="Contoh: 500"
                    />
                    <select
                      value={satuanSampel}
                      onChange={(e) => setSatuanSampel(e.target.value)}
                      className="absolute right-0 top-0 bottom-0 bg-gray-50 border-l border-gray-200 rounded-r-lg px-2 text-sm text-gray-600 focus:ring-emerald-500 outline-none cursor-pointer"
                    >
                      <option value="gram">gram</option>
                      <option value="kg">kg</option>
                      <option value="butir">butir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Metode Pengambilan <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    instanceId="select-permintaan-metode-sampling"
                    options={[
                      { value: "sop", label: "Sesuai SOP Sampling ISTA" },
                      { value: "random", label: "Sampling Acak Terstratifikasi" },
                      { value: "composite", label: "Sampling Komposit" },
                    ]}
                    value={{
                      value: metodeSampling,
                      label:
                        metodeSampling === "sop"
                          ? "Sesuai SOP Sampling ISTA"
                          : metodeSampling === "random"
                          ? "Sampling Acak Terstratifikasi"
                          : "Sampling Komposit",
                    }}
                    onChange={(val: any) => setMetodeSampling(val?.value || "sop")}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pengambil Sampel <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    instanceId="select-permintaan-pengambil-sampel"
                    options={[
                      { value: "andi", label: "Andi Pratama (QC Officer)" },
                      { value: "budi", label: "Budi Santoso (Lab Tech)" },
                      { value: "citra", label: "Citra Dewi (QC Inspector)" },
                    ]}
                    value={{
                      value: pengambilSampel,
                      label:
                        pengambilSampel === "andi"
                          ? "Andi Pratama (QC Officer)"
                          : pengambilSampel === "budi"
                          ? "Budi Santoso (Lab Tech)"
                          : "Citra Dewi (QC Inspector)",
                    }}
                    onChange={(val: any) => setPengambilSampel(val?.value || "andi")}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Main Area) */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4 bg-white rounded-t-xl px-4 pt-2 shadow-sm">
              <nav
                className="-mb-px flex space-x-8 overflow-x-auto"
                aria-label="Tabs"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                      ${
                        activeTab === tab
                          ? "border-emerald-500 text-emerald-600 font-semibold"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab === "Parameter Uji" && (
                      <i className="ri-list-check-2 text-base"></i>
                    )}
                    {tab === "Catatan & Dokumen" && (
                      <i className="ri-attachment-line text-base"></i>
                    )}
                    {tab === "Riwayat" && (
                      <i className="ri-history-line text-base"></i>
                    )}
                    {tab}
                    {tab === "Parameter Uji" && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {activeParametersCount}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content: Parameter Uji */}
            {activeTab === "Parameter Uji" && (
              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
                {/* Header & Management Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                        <i className="ri-flask-fill text-emerald-600 text-lg"></i> Pilihan
                        Parameter Uji
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeParametersCount} diuji dari {parameters.length} parameter
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tambahkan parameter uji satu per satu dari database master pengujian di bawah ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setIsManageModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs transition-colors"
                      title="Buka katalog database untuk melihat semua detail parameter"
                    >
                      <i className="ri-database-2-line text-sm"></i>
                      <span>Katalog Master Parameter</span>
                    </button>

                    {parameters.length > 0 && (
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="flex items-center gap-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        title={allChecked ? "Nonaktifkan semua" : "Aktifkan semua"}
                      >
                        <i
                          className={`ri-${
                            allChecked ? "checkbox-blank-line" : "checkbox-line"
                          } text-emerald-600`}
                        ></i>
                        <span>{allChecked ? "Batal Semua" : "Pilih Semua"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form: Tambah Parameter Uji Satu per Satu */}
                <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-emerald-50/20 border border-emerald-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                      <i className="ri-add-circle-fill text-emerald-600 text-base"></i>
                      Tambah Parameter Uji Satu per Satu
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Tersedia <strong>{availableParamsForDropdown.length}</strong> parameter di database
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Select Parameter Uji */}
                    <div className="md:col-span-5">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Pilih Parameter Uji <span className="text-rose-500">*</span>
                      </label>
                      <Select
                        instanceId="select-permintaan-param-add"
                        options={availableParamsForDropdown}
                        value={selectedParamToAdd}
                        onChange={handleSelectParamOption}
                        placeholder={
                          isLoadingDbParams
                            ? "Memuat parameter..."
                            : availableParamsForDropdown.length === 0
                            ? "Semua parameter telah ditambahkan"
                            : "Cari atau pilih parameter uji..."
                        }
                        isDisabled={isLoadingDbParams || availableParamsForDropdown.length === 0}
                        className="text-xs"
                        isSearchable
                      />
                    </div>

                    {/* Metode Uji Terkait (Terkunci) */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <i className="ri-lock-line text-gray-400"></i>
                        Metode Uji
                      </label>
                      <div
                        className="h-[38px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 flex items-center truncate"
                        title={selectedMethodToAdd ? selectedMethodToAdd.label : "Otomatis terkunci dari parameter"}
                      >
                        {selectedMethodToAdd ? (
                          <span className="truncate text-gray-800 font-semibold">
                            {selectedMethodToAdd.label}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Otomatis dari parameter</span>
                        )}
                      </div>
                    </div>

                    {/* Standar / Batas Acuan (Terkunci) */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                        <i className="ri-lock-line text-gray-400"></i>
                        Batas / Standar
                      </label>
                      <div className="h-[38px] px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center truncate">
                        {customStandardToAdd ? (
                          <span className="truncate">{customStandardToAdd}</span>
                        ) : (
                          <span className="text-gray-400 font-normal italic text-[11px]">-</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddSingleParameter}
                        disabled={!selectedParamToAdd}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <i className="ri-add-line text-base font-bold"></i>
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table of Selected Parameters */}
                {parameters.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <i className="ri-flask-line text-2xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      Belum Ada Parameter Uji yang Ditambahkan
                    </h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                      Silakan pilih parameter uji dari database pada formulir di atas dan klik <strong>Tambah</strong> untuk memasukkannya satu per satu.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsManageModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <i className="ri-database-2-line"></i>
                      Buka Katalog Master Parameter
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                        <tr>
                          <th className="px-3 py-3 w-10 text-center">No.</th>
                          <th className="px-4 py-3 w-12 text-center">Pilih</th>
                          <th className="px-4 py-3 w-20">Kode</th>
                          <th className="px-4 py-3">Parameter Uji</th>
                          <th className="px-4 py-3">Metode Uji</th>
                          <th className="px-4 py-3">Standar Mutu</th>
                          <th className="px-4 py-3 w-24 text-center">Status</th>
                          <th className="px-4 py-3 w-16 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parameters.map((param, index) => {
                          const categoryColor =
                            param.kategori === "Fisiologis"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : param.kategori === "Fisik"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : param.kategori === "Kesehatan"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-purple-50 text-purple-700 border-purple-200";

                          return (
                            <tr
                              key={param.id}
                              className={`transition-colors ${
                                param.checked
                                  ? "hover:bg-gray-50/80 bg-white"
                                  : "opacity-60 bg-gray-50 hover:bg-gray-100/60"
                              }`}
                            >
                              {/* No. */}
                              <td className="px-3 py-3 text-center text-xs text-gray-500 font-medium">
                                {index + 1}
                              </td>

                              {/* Checkbox */}
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={param.checked}
                                  onChange={() => toggleParameter(param.id)}
                                  className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                                  title={
                                    param.checked
                                      ? "Nonaktifkan parameter ini"
                                      : "Aktifkan parameter ini"
                                  }
                                />
                              </td>

                              {/* Kode */}
                              <td className="px-4 py-3">
                                <span className="font-mono text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-semibold">
                                  {param.kode || "P"}
                                </span>
                              </td>

                              {/* Parameter Name & Category */}
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-semibold ${
                                      param.checked
                                        ? "text-gray-900"
                                        : "text-gray-500 line-through"
                                    }`}
                                  >
                                    {param.parameter}
                                  </span>
                                  {param.kategori && (
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryColor}`}
                                    >
                                      {param.kategori}
                                    </span>
                                  )}
                                </div>
                                {param.definisi && (
                                  <p
                                    className="text-[11px] text-gray-400 line-clamp-1 mt-0.5"
                                    title={param.definisi}
                                  >
                                    {param.definisi}
                                  </p>
                                )}
                              </td>

                              {/* Metode */}
                              <td className="px-4 py-3 text-gray-600 text-xs">
                                <span className="font-medium text-gray-800">
                                  {param.metode}
                                </span>
                              </td>

                              {/* Standar Mutu (Terkunci dari Master) */}
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md text-xs">
                                  {param.standar || "-"}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="px-4 py-3 text-center">
                                {param.checked ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Diuji
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-600">
                                    Dilewati
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveParameter(param.id)}
                                  className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                  title="Hapus parameter dari permintaan ini"
                                >
                                  <i className="ri-delete-bin-line text-sm"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer status summary bar */}
                {parameters.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium">
                        <i className="ri-checkbox-circle-fill text-emerald-600"></i>
                        Total Parameter Diuji:{" "}
                        <strong className="text-emerald-700 text-sm">
                          {activeParametersCount}
                        </strong>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        Dilewati: <strong>{parameters.length - activeParametersCount}</strong>
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        Total Terdaftar: <strong>{parameters.length}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsManageModalOpen(true)}
                        className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <i className="ri-settings-4-line"></i>
                        Buka Katalog Parameter Master
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Content: Catatan & Dokumen */}
            {activeTab === "Catatan & Dokumen" && (
              <div className="space-y-4">
                {/* Catatan */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="ri-edit-2-line text-emerald-600 text-lg"></i> Catatan
                    Khusus
                  </h3>
                  <textarea
                    rows={4}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                    placeholder="Masukkan instruksi khusus atau catatan tambahan untuk analis lab..."
                  ></textarea>
                </div>

                {/* Upload Dokumen */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="ri-attachment-line text-emerald-600 text-lg"></i>{" "}
                    Lampiran Dokumen
                  </h3>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <i className="ri-file-text-line text-xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB — Siap diunggah
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  ) : existingFileUrl ? (
                    <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700">
                          <i className="ri-attachment-line text-xl"></i>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {existingFileName || "Lampiran Tersimpan"}
                          </p>
                          <a
                            href={existingFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1"
                          >
                            <i className="ri-external-link-line"></i> Lihat File
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <i className="ri-upload-cloud-2-line text-3xl text-emerald-600"></i>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Klik untuk upload atau drag & drop file di sini
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Format yang didukung: PDF, DOCX, JPG, PNG (Maksimal 10 MB)
                      </p>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        Pilih File
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab Content: Riwayat */}
            {activeTab === "Riwayat" && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <i className="ri-history-line text-4xl text-gray-300 mb-3 block"></i>
                <h5 className="font-semibold text-gray-700 text-sm mb-1">
                  Riwayat Permintaan
                </h5>
                <p className="text-gray-500 text-xs">
                  {mode === "edit"
                    ? `Permintaan dibuat pada ${tanggal} oleh Pemohon ${pemohon.toUpperCase()}.`
                    : "Belum ada riwayat perubahan untuk permintaan baru ini."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Kelola & Pilih Parameter dari Database */}
      <ManageParameterUjiModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        selectedParameters={parameters}
        onApply={(updated) => setParameters(updated)}
        dbParameters={dbParameters}
        onRefreshDb={fetchDbParameters}
        komoditas={selectedBatch?.data?.komoditas}
        varietas={selectedBatch?.data?.varietas}
      />
    </React.Fragment>
  );
};

export default PermintaanForm;
