import React from "react";
import { toast } from "react-toastify";
import { PermintaanPengujian } from "@/app/types/qc";
import { formatDate } from "@/app/lib/format";

interface FieldProps {
  label: string;
  icon?: string;
  children: React.ReactNode;
  copyValue?: string | null;
}

const Field = ({ label, icon, children, copyValue }: FieldProps) => (
  <div className="flex items-start gap-2">
    {icon && <i className={`${icon} text-base text-emerald-600 mt-1.5 shrink-0`}></i>}
    <div>
      <p className="text-[10px] text-gray-500 mb-1 whitespace-nowrap">{label}</p>
      <div className="flex items-center gap-2 text-xs font-medium text-gray-800">
        <span className="whitespace-nowrap">{children || "-"}</span>
        {copyValue && (
          <button
            type="button"
            title="Salin"
            onClick={() => navigator.clipboard?.writeText(copyValue).then(() => toast.success("Disalin"))}
            className="text-gray-400 hover:text-emerald-600"
          >
            <i className="ri-file-copy-line"></i>
          </button>
        )}
      </div>
    </div>
  </div>
);

const Divider = () => <div className="hidden md:block w-px self-stretch bg-gray-100"></div>;

/** Ringkasan identitas pengujian di bagian atas halaman. */
const HeaderInfo = ({ data }: { data: PermintaanPengujian }) => (
  <div className="bg-white px-5 py-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-start gap-x-5 gap-y-4">
    <Field label="No. Pengujian" icon="ri-file-list-3-line" copyValue={data.noPengujian}>
      <span className="font-semibold">{data.noPengujian || <span className="text-gray-400 italic font-normal">Belum terbit</span>}</span>
    </Field>
    <Divider />
    <Field label="No. Permintaan">{data.noPermintaan}</Field>
    <Divider />
    <Field label="Batch">{data.kodeBatch}</Field>
    <Divider />
    <Field label="Komoditas" icon="ri-leaf-fill">{data.komoditas}</Field>
    <Divider />
    <Field label="Varietas" icon="ri-seedling-line">{data.varietas}</Field>
    <Divider />
    <Field label="Tipe">{data.tipe}</Field>
    <Divider />
    <Field label="Tanggal Sampling" icon="ri-calendar-event-line">{formatDate(data.tanggalSampling, "")}</Field>
    <Divider />
    <Field label="Petani Mitra" icon="ri-plant-line">{data.petani}</Field>
    <Divider />
    <Field label="Lahan" icon="ri-landscape-line">{data.lahan}</Field>
  </div>
);

export default HeaderInfo;
