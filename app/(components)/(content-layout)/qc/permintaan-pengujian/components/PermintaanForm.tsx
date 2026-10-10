"use client";

import { buttonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { SaveButton, CancelButton } from "@/app/(components)/(content-layout)/shared/ActionButtons";
import QcTabs from "../../shared/QcTabs";
import QcCard from "../../shared/QcCard";
import QcSelect from "../../shared/QcSelect";
import QcTimeline from "../../shared/QcTimeline";
import QcDocumentList from "../../shared/QcDocumentList";
import QcFileDropzone from "../../shared/QcFileDropzone";
import QcStatusBadge from "../../shared/QcStatusBadge";
import BatchSourceCard from "./form/BatchSourceCard";
import SampleInfoCard, { SampleInfoValue } from "./form/SampleInfoCard";
import ParameterSelector from "./form/ParameterSelector";
import ManageParameterUjiModal, { FormParameterItem } from "./ManageParameterUjiModal";
import { qcService } from "@/app/services/qcService";
import { permintaanPengujianService, PermintaanPayload } from "@/app/services/permintaanPengujianService";
import { useQcLookups, useQcMeta, usePengujiOptions } from "@/app/hooks/useQcReference";
import { BatchOption, PermintaanPengujian, QC_STATUS, TestParameter } from "@/app/types/qc";
import { getErrorMessage, toDateInputValue } from "@/app/lib/format";

interface PermintaanFormProps {
  mode?: "create" | "edit";
  id?: string;
}

type TabKey = "parameter" | "catatan" | "riwayat";

const PermintaanForm = ({ mode = "create", id }: PermintaanFormProps) => {
  const router = useRouter();
  const isEdit = mode === "edit" && !!id;

  const { meta } = useQcMeta();
  const { options, loading: loadingLookup } = useQcLookups([
    "PEMOHON",
    "PRIORITAS",
    "SATUAN_SAMPEL",
    "METODE_SAMPLING",
  ]);
  const { options: pengambilOptions, loading: loadingPenguji } = usePengujiOptions();

  const [detail, setDetail] = useState<PermintaanPengujian | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(isEdit);
  const [noPermintaan, setNoPermintaan] = useState("");
  const [tanggal, setTanggal] = useState(toDateInputValue());
  const [pemohon, setPemohon] = useState("");
  const [prioritas, setPrioritas] = useState("");
  const [sample, setSample] = useState<SampleInfoValue>({
    jumlahSampel: "",
    satuanSampel: "",
    metodeSampling: "",
    pengambilSampelId: "",
  });
  const [batchId, setBatchId] = useState<string | null>(null);
  const [parameters, setParameters] = useState<FormParameterItem[]>([]);
  const [catatan, setCatatan] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [masterParams, setMasterParams] = useState<TestParameter[]>([]);
  const [loadingParams, setLoadingParams] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("parameter");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMasterParams = async () => {
    setLoadingParams(true);
    try {
      setMasterParams((await qcService.getParameters()).data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal memuat master parameter"));
    } finally {
      setLoadingParams(false);
    }
  };

  // Data referensi: batch yang belum diajukan & master parameter.
  useEffect(() => {
    permintaanPengujianService
      .getBatchOptions(isEdit ? id : undefined)
      .then((res) => setBatches(res.data || []))
      .catch((err) => toast.error(getErrorMessage(err, "Gagal memuat batch produksi")))
      .finally(() => setLoadingBatches(false));
    loadMasterParams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Create: pratinjau nomor otomatis. Edit: muat data permintaan.
  useEffect(() => {
    if (!isEdit) {
      permintaanPengujianService
        .getNextNumber()
        .then((res) => setNoPermintaan(res.data.noPermintaan))
        .catch(() => setNoPermintaan(""));
      return;
    }
    setLoadingDetail(true);
    permintaanPengujianService
      .getPermintaanById(id!)
      .then(({ data }) => {
        setDetail(data);
        setNoPermintaan(data.noPermintaan);
        setTanggal(toDateInputValue(data.tanggal));
        setPemohon(data.pemohon);
        setPrioritas(data.prioritas);
        setSample({
          jumlahSampel: data.jumlahSampel ? String(data.jumlahSampel) : "",
          satuanSampel: data.satuanSampel || "",
          metodeSampling: data.metodeSampling || "",
          pengambilSampelId: data.pengambilSampelId || "",
        });
        setBatchId(data.batchProduksiId || null);
        setCatatan(data.catatan || "");

        const linked = (data.parameters || []).filter((p) => p.parameterId);
        setParameters(
          linked.map((p) => ({
            parameterId: p.parameterId!,
            kode: p.kode,
            nama: p.nama,
            kategori: p.kategori,
            metodeId: p.metodeId,
            metode: p.metode,
            standar: p.standar,
            satuan: p.satuan,
            definisi: p.definisi,
            checked: p.checked,
          }))
        );
        const unlinked = (data.parameters || []).length - linked.length;
        if (unlinked > 0) {
          toast.warning(`${unlinked} parameter lama tidak terhubung ke master parameter. Silakan pilih ulang.`);
        }
      })
      .catch((err) => toast.error(getErrorMessage(err, "Gagal memuat permintaan pengujian")))
      .finally(() => setLoadingDetail(false));
  }, [id, isEdit]);

  // Nilai default form baru diambil dari urutan pertama master lookup (bukan hardcode).
  useEffect(() => {
    if (isEdit || loadingLookup) return;
    setPemohon((v) => v || options("PEMOHON")[0]?.value || "");
    setPrioritas((v) => v || options("PRIORITAS")[0]?.value || "");
    setSample((s) => ({
      ...s,
      satuanSampel: s.satuanSampel || options("SATUAN_SAMPEL")[0]?.value || "",
      metodeSampling: s.metodeSampling || options("METODE_SAMPLING")[0]?.value || "",
    }));
  }, [isEdit, loadingLookup, options]);

  const selectedBatch = useMemo(() => batches.find((b) => b.id === batchId), [batches, batchId]);
  const readOnly = isEdit && !!detail && !meta.editableStatuses.includes(detail.status);
  const activeCount = parameters.filter((p) => p.checked).length;
  const goBack = () => router.push("/qc/permintaan-pengujian");

  const validate = () => {
    if (!batchId) return "Pilih batch produksi terlebih dahulu";
    if (!(Number(sample.jumlahSampel) > 0)) return "Jumlah sampel harus lebih dari 0";
    if (!sample.pengambilSampelId) return "Pilih pengambil sampel";
    if (!pemohon || !prioritas || !sample.satuanSampel || !sample.metodeSampling) return "Lengkapi data permintaan";
    if (activeCount === 0) return "Tambahkan minimal 1 parameter uji yang aktif";
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      toast.warning(error);
      return;
    }
    const payload: PermintaanPayload = {
      tanggal,
      batchProduksiId: batchId!,
      jumlahSampel: Number(sample.jumlahSampel),
      satuanSampel: sample.satuanSampel,
      metodeSampling: sample.metodeSampling,
      pengambilSampelId: sample.pengambilSampelId,
      pemohon,
      prioritas,
      catatan: catatan.trim() || null,
      parameters: parameters.map((p) => ({ parameterId: p.parameterId, checked: p.checked })),
    };

    setIsSubmitting(true);
    try {
      const res = isEdit
        ? await permintaanPengujianService.updatePermintaan(id!, payload, file)
        : await permintaanPengujianService.createPermintaan(payload, file);
      toast.success(
        isEdit
          ? `Permintaan ${res.data.noPermintaan} berhasil diperbarui`
          : `Permintaan ${res.data.noPermintaan} berhasil dibuat`
      );
      goBack();
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan permintaan pengujian"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDetail) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
        <i className="ri-loader-4-line text-3xl animate-spin text-emerald-600 mb-2"></i>
        <p className="text-xs text-gray-500 font-medium">Memuat data permintaan pengujian...</p>
      </div>
    );
  }

  const permintaanDocs = (detail?.dokumen || []).filter((d) => d.kategori !== "Dokumentasi");

  return (
    <>
      <div className="space-y-4">
        {detail?.status === QC_STATUS.DITOLAK && (
          <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-800 flex items-start gap-2">
            <i className="ri-close-circle-line text-lg"></i>
            <div>
              <p className="font-semibold">Permintaan ditolak</p>
              <p className="text-xs">{detail.alasanPenolakan || "-"}</p>
              <p className="text-xs mt-1">Simpan perubahan untuk mengajukan ulang permintaan ini.</p>
            </div>
          </div>
        )}
        {readOnly && (
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800 flex items-center justify-between gap-2">
            <span>
              <i className="ri-lock-line"></i> Permintaan berstatus <strong>{detail?.status}</strong> sehingga tidak dapat diubah.
            </span>
            <button
              type="button"
              onClick={() => router.push(`/qc/pemeriksaan-pengujian/${detail?.id}`)}
              className={buttonClass("secondary", "sm")}
            >
              Lihat pemeriksaan
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">
                <i className="ri-file-list-3-line"></i> No. Permintaan
              </p>
              <div className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                {noPermintaan || "-"}
                {isEdit ? (
                  <QcStatusBadge status={detail?.status} />
                ) : (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    Otomatis
                  </span>
                )}
              </div>
            </div>
            <div className="h-8 border-l border-gray-200 hidden sm:block"></div>
            <div>
              <label htmlFor="input-tanggal-permintaan" className="text-xs text-gray-500 font-medium mb-1 block">
                <i className="ri-calendar-event-line text-emerald-600"></i> Tanggal Permintaan
              </label>
              <input
                id="input-tanggal-permintaan"
                type="date"
                value={tanggal}
                disabled={readOnly}
                onChange={(e) => setTanggal(e.target.value)}
                className="text-sm border border-gray-200 rounded-md px-2 py-1 text-gray-800 font-semibold"
              />
            </div>
            <div className="w-40">
              <label htmlFor="select-pemohon" className="text-xs text-gray-500 font-medium mb-1 block">
                <i className="ri-user-line text-emerald-600"></i> Pemohon
              </label>
              <QcSelect
                id="select-pemohon"
                options={options("PEMOHON")}
                value={pemohon}
                onChange={(v) => setPemohon(v || "")}
                isDisabled={readOnly}
                isLoading={loadingLookup}
              />
            </div>
            <fieldset>
              <legend className="text-xs text-gray-500 font-medium mb-1">
                <i className="ri-alert-line text-rose-500"></i> Prioritas
              </legend>
              <div className="flex gap-3">
                {options("PRIORITAS").map((opt) => (
                  <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                      type="radio"
                      name="prioritas"
                      value={opt.value}
                      checked={prioritas === opt.value}
                      disabled={readOnly}
                      onChange={() => setPrioritas(opt.value)}
                      className="text-emerald-500 focus:ring-emerald-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="flex items-center gap-2">
            <CancelButton onClick={goBack} />
            {!readOnly && (
              <SaveButton
                label={
                  isSubmitting
                    ? "Menyimpan..."
                    : detail?.status === QC_STATUS.DITOLAK
                      ? "Ajukan Ulang"
                      : isEdit
                        ? "Simpan Perubahan"
                        : "Submit Permintaan"
                }
                onClick={handleSave}
                disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <BatchSourceCard
              batches={batches}
              value={batchId}
              onChange={setBatchId}
              loading={loadingBatches}
              disabled={readOnly}
            />
            <SampleInfoCard
              value={sample}
              onChange={(patch) => setSample((s) => ({ ...s, ...patch }))}
              satuanOptions={options("SATUAN_SAMPEL")}
              metodeSamplingOptions={options("METODE_SAMPLING")}
              pengambilOptions={pengambilOptions}
              loadingPengambil={loadingPenguji}
            />
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            <QcTabs<TabKey>
              tabs={[
                { key: "parameter", label: "Parameter Uji", icon: "ri-list-check-2", badge: activeCount },
                { key: "catatan", label: "Catatan & Dokumen", icon: "ri-attachment-line" },
                { key: "riwayat", label: "Riwayat", icon: "ri-history-line" },
              ]}
              active={activeTab}
              onChange={setActiveTab}
            />

            {activeTab === "parameter" && (
              <ParameterSelector
                parameters={parameters}
                onChange={setParameters}
                masterParameters={masterParams}
                loading={loadingParams}
                komoditas={selectedBatch?.komoditas}
                varietas={selectedBatch?.varietas}
                onOpenCatalog={() => setIsCatalogOpen(true)}
              />
            )}

            {activeTab === "catatan" && (
              <div className="space-y-4">
                <QcCard title="Catatan Khusus" icon="ri-edit-2-line">
                  <textarea
                    rows={4}
                    value={catatan}
                    disabled={readOnly}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-gray-50 focus:bg-white"
                    placeholder="Instruksi khusus atau catatan tambahan untuk analis lab..."
                  />
                </QcCard>
                <QcCard title="Lampiran Dokumen" icon="ri-attachment-line" bodyClassName="space-y-3">
                  <QcDocumentList documents={permintaanDocs} emptyMessage="Belum ada lampiran tersimpan." />
                  {file ? (
                    <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3 flex items-center justify-between">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-800">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB — akan diunggah saat disimpan</p>
                      </div>
                      <button type="button" onClick={() => setFile(null)} className={buttonClass("danger", "sm")}>
                        Batal
                      </button>
                    </div>
                  ) : (
                    !readOnly && <QcFileDropzone onSelect={setFile} compact />
                  )}
                </QcCard>
              </div>
            )}

            {activeTab === "riwayat" && (
              <QcCard title="Riwayat Permintaan" icon="ri-history-line">
                <QcTimeline
                  items={detail?.riwayat || []}
                  emptyMessage="Riwayat akan tercatat setelah permintaan disimpan."
                />
              </QcCard>
            )}
          </div>
        </div>
      </div>

      <ManageParameterUjiModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        selectedParameters={parameters}
        onApply={setParameters}
        dbParameters={masterParams}
        onRefreshDb={loadMasterParams}
        komoditas={selectedBatch?.komoditas}
        varietas={selectedBatch?.varietas}
      />
    </>
  );
};

export default PermintaanForm;
