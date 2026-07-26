'use client';

import { SelectOption, TargetProduksi } from "@/app/types/jadwalTanam";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkSelect from "@/shared/@spk-reusable-components/spk-packages/spk-reactselect";
import { FilterSelectConfig } from "../../../shared/FilterRow";


interface Props {
  value: TargetProduksi;

  options: {
    varietas: SelectOption[];
  };

  onChange: (
    field: keyof TargetProduksi,
    value: any
  ) => void;
}

export default function TargetProduksiCard({
  value,
  options,
  onChange,
}: Props) {

  const varietas: FilterSelectConfig = {
    value: value.varietas,
    onChange: (val: any) => {
      onChange('varietas', val);
    },
    options: options.varietas,
    placeholder: 'Pilih Metode Tanam',
    widthClass: 'sm:w-48',
  };


  return (

    <div className="grid grid-cols-5 gap-3">

      {/* Luas Tanam (Ha) */}

      <div>

        <label className="form-label">
          Luas Tanam (Ha) <span className="text-red-500">*</span>
        </label>

        <input
          type="number"
          className="form-control"
          value={value.luasTanam}
          onChange={(e) =>
            onChange('luasTanam', Number(e.target.value))
          }
        />

      </div>

      {/* Target Produksi Benih (Kg) */}

      <div>

        <label className="form-label">
          Target Produksi Benih (Kg) <span className="text-red-500">*</span>
        </label>

        <input
          type="number"
          className="form-control"
          value={value.targetProduksi}
          onChange={(e) =>
            onChange('targetProduksi', Number(e.target.value))
          }
        />

      </div>

      {/* Varietas */}

      <div>

        <label className="form-label">
          Varietas
        </label>

        <SpkSelect
          {...({
            option: varietas.options,
            placeholder: varietas.placeholder,
            onfunchange: varietas.onChange,
            getValue: varietas.value,
            classNameprefix: "react-select",
            clearable: true,
          } as any)}
        />

      </div>

      {/* Standar Kualitas */}

      <div>

        <label className="form-label">
          Standar Kualiatas
        </label>

        <SpkSelect
          {...({
            option: varietas.options,
            placeholder: varietas.placeholder,
            onfunchange: varietas.onChange,
            getValue: varietas.value,
            classNameprefix: "react-select",
            clearable: true,
          } as any)}
        />

      </div>

      {/* Persentase Perkecambahan Minimal */}

      <div>

        <label className="form-label">
          Persentase Perkecambahan Minimal (%)
        </label>

        <input
          type="number"
          className="form-control"
          value={value.PersenKecambahanMin}
          onChange={(e) =>
            onChange('PersenKecambahanMin', Number(e.target.value))
          }
        />

      </div>

    </div>

  );

}