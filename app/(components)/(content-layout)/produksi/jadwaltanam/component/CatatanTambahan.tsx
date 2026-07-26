'use client';

import { CatatanTambahan, SelectOption } from "@/app/types/jadwalTanam";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkSelect from "@/shared/@spk-reusable-components/spk-packages/spk-reactselect";
import { FilterSelectConfig } from "../../../shared/FilterRow";


interface Props {
  value: CatatanTambahan;

  onChange: (
    field: keyof CatatanTambahan,
    value: any
  ) => void;
}

export default function CatatanTambahanCard({
  value,
  onChange,
}: Props) {


  return (

    <div className="grid grid-cols-2 gap-6">

      {/* Catatan */}

      <div>

        <label className="form-label">
          Catatan
        </label>

        <div className="relative">

          <textarea
            rows={4}
            maxLength={500}
            className="form-control w-full resize-none"
            placeholder="Tulis catatan tambahan terkait jadwal tanam ini..."
            value={value.catatan}
            onChange={(e) =>
              onChange("catatan", e.target.value)
            }
          />

          <div className="absolute bottom-2 right-3 text-xs text-textmuted">

            {value.catatan.length}/500

          </div>

        </div>

      </div>

      {/* Upload */}

      <div>

        <label className="form-label">
          Dokumen Pendukung (Opsional)
        </label>

        <div
          className="
                flex
                h-[120px]
                items-center
                justify-center
                rounded-lg
                border-2
                border-dashed
                border-defaultborder
                bg-light
                transition
                hover:border-primary
            "
        >

          <div className="flex flex-col items-center gap-2">

            <i className="ri-upload-cloud-2-line text-3xl text-success"></i>

            <div className="text-sm font-medium">

              Klik atau drag file ke sini untuk upload

            </div>

            <div className="text-xs text-textmuted">

              PDF, JPG, PNG (Maks. 5 MB)

            </div>

          </div>

          <input
            type="file"
            className="hidden"
            id="upload-file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) =>
              onChange("dokumen", e.target.files?.[0] ?? null)
            }
          />

          <label
            htmlFor="upload-file"
            className="btn btn-light ms-5 cursor-pointer"
          >
            Pilih File
          </label>

        </div>

        {
          value.dokumen && (

            <div className="mt-3 flex items-center justify-between rounded border bg-success/10 p-3">

              <div>

                <div className="font-medium">

                  {value.dokumen.name}

                </div>

                <div className="text-xs text-textmuted">

                  {(value.dokumen.size / 1024).toFixed(1)} KB

                </div>

              </div>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => onChange("dokumen", null)}
              >

                Hapus

              </button>

            </div>

          )
        }

      </div>

    </div>

  );

}