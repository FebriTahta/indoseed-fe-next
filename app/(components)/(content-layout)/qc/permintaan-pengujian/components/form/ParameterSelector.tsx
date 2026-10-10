import React, { useMemo, useState } from "react";
import { buttonClass, iconButtonClass } from "@/app/(components)/(content-layout)/shared/buttonStyles";
import { toast } from "react-toastify";
import QcSelect from "../../../shared/QcSelect";
import { FormParameterItem, isMethodMatchingCommodityOrVariety, toFormParameter } from "../ManageParameterUjiModal";
import { TestParameter } from "@/app/types/qc";

const CATEGORY_CLASS: Record<string, string> = {
  Fisiologis: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Fisik: "bg-blue-50 text-blue-700 border-blue-200",
  Kesehatan: "bg-rose-50 text-rose-700 border-rose-200",
};

interface ParameterSelectorProps {
  parameters: FormParameterItem[];
  onChange: (next: FormParameterItem[]) => void;
  masterParameters: TestParameter[];
  loading?: boolean;
  komoditas?: string;
  varietas?: string;
  onOpenCatalog: () => void;
}

/** Tambah parameter uji satu per satu dari master + tabel parameter terpilih. */
export default function ParameterSelector({
  parameters,
  onChange,
  masterParameters,
  loading,
  komoditas,
  varietas,
  onOpenCatalog,
}: ParameterSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const available = useMemo(() => {
    const used = new Set(parameters.map((p) => p.parameterId));
    return masterParameters.filter(
      (p) =>
        !used.has(p.id) &&
        p.status !== "Nonaktif" &&
        isMethodMatchingCommodityOrVariety(p.metode, komoditas, varietas)
    );
  }, [masterParameters, parameters, komoditas, varietas]);

  const options = useMemo(
    () => available.map((p) => ({ value: p.id, label: `[${p.kode}] ${p.nama}${p.kategori ? ` — ${p.kategori}` : ""}` })),
    [available]
  );
  const preview = selectedId ? toFormParameter(available.find((p) => p.id === selectedId)!) : null;
  const activeCount = parameters.filter((p) => p.checked).length;
  const allChecked = parameters.length > 0 && parameters.every((p) => p.checked);

  const handleAdd = () => {
    const master = available.find((p) => p.id === selectedId);
    if (!master) return toast.warning("Silakan pilih parameter uji terlebih dahulu");
    onChange([...parameters, toFormParameter(master)]);
    setSelectedId(null);
  };

  const update = (parameterId: string, patch: Partial<FormParameterItem> | null) =>
    onChange(
      patch === null
        ? parameters.filter((p) => p.parameterId !== parameterId)
        : parameters.map((p) => (p.parameterId === parameterId ? { ...p, ...patch } : p))
    );

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
            <i className="ri-flask-fill text-emerald-600 text-lg"></i> Pilihan Parameter Uji
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeCount} diuji dari {parameters.length}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Parameter disaring otomatis sesuai komoditas/varietas batch dan metode uji global.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenCatalog}
            className={buttonClass("outline")}
          >
            <i className="ri-database-2-line text-sm"></i> Katalog Master Parameter
          </button>
          {parameters.length > 0 && (
            <button
              type="button"
              onClick={() => onChange(parameters.map((p) => ({ ...p, checked: !allChecked })))}
              className={buttonClass("secondary")}
            >
              <i className={`ri-${allChecked ? "checkbox-blank-line" : "checkbox-line"} text-emerald-600`}></i>
              {allChecked ? "Batal Semua" : "Pilih Semua"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
            <i className="ri-add-circle-fill text-emerald-600 text-base"></i> Tambah Parameter Uji
          </span>
          <span className="text-[11px] text-emerald-700">
            Tersedia <strong>{available.length}</strong> parameter
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label htmlFor="select-permintaan-param-add" className="block text-xs font-semibold text-gray-700 mb-1">
              Parameter Uji
            </label>
            <QcSelect
              id="select-permintaan-param-add"
              options={options}
              value={selectedId}
              onChange={setSelectedId}
              isLoading={loading}
              isDisabled={loading || options.length === 0}
              isClearable
              placeholder={options.length === 0 ? "Tidak ada parameter tersisa" : "Cari atau pilih parameter..."}
              className="text-xs"
            />
          </div>
          <div className="md:col-span-3">
            <span className="block text-xs font-semibold text-gray-700 mb-1">
              <i className="ri-lock-line text-gray-400"></i> Metode Uji
            </span>
            <div className="h-[38px] px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs flex items-center truncate">
              {preview?.metode || <span className="text-gray-400 italic">Otomatis dari parameter</span>}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="block text-xs font-semibold text-gray-700 mb-1">
              <i className="ri-lock-line text-gray-400"></i> Batas / Standar
            </span>
            <div className="h-[38px] px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center truncate">
              {preview?.standar || "-"}
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedId}
              className={buttonClass("primary", "md", "w-full !h-[38px]")}
            >
              <i className="ri-add-line text-base"></i> Tambah
            </button>
          </div>
        </div>
      </div>

      {parameters.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
          <i className="ri-flask-line text-3xl text-emerald-500"></i>
          <h4 className="font-semibold text-gray-800 text-sm mt-2">Belum Ada Parameter Uji</h4>
          <p className="text-xs text-gray-500">Pilih parameter dari master atau buka katalog untuk memilih beberapa sekaligus.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 w-10 text-center">No.</th>
                <th className="px-3 py-3 w-12 text-center">Uji</th>
                <th className="px-3 py-3">Kode</th>
                <th className="px-3 py-3">Parameter Uji</th>
                <th className="px-3 py-3">Metode Uji</th>
                <th className="px-3 py-3">Standar Mutu</th>
                <th className="px-3 py-3 w-14 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parameters.map((param, index) => (
                <tr key={param.parameterId} className={param.checked ? "bg-white" : "opacity-60 bg-gray-50"}>
                  <td className="px-3 py-3 text-center text-xs text-gray-500">{index + 1}</td>
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={param.checked}
                      onChange={() => update(param.parameterId, { checked: !param.checked })}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                      aria-label={`Uji parameter ${param.nama}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded font-semibold">{param.kode}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${param.checked ? "text-gray-900" : "text-gray-500 line-through"}`}>
                        {param.nama}
                      </span>
                      {param.kategori && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            CATEGORY_CLASS[param.kategori] || "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {param.kategori}
                        </span>
                      )}
                    </div>
                    {param.definisi && <p className="text-[11px] text-gray-400 line-clamp-1">{param.definisi}</p>}
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-800">{param.metode || "-"}</td>
                  <td className="px-3 py-3">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md text-xs">
                      {param.standar || "-"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => update(param.parameterId, null)}
                      className={iconButtonClass("rose")}
                      title="Hapus parameter dari permintaan"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
