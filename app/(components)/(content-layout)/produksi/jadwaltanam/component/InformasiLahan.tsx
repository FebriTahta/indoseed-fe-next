'use client';

import { InformasiLahan, SelectOption } from "@/app/types/jadwalTanam";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkSelect from "@/shared/@spk-reusable-components/spk-packages/spk-reactselect";
import { FilterSelectConfig } from "../../../shared/FilterRow";

interface Props {
  value: InformasiLahan;

  options: {
    lahan: SelectOption[];
    statusLahan: SelectOption[];
    tipeLahan: SelectOption[];
    jenisTanah: SelectOption[];
    sumberAir: SelectOption[];
    sistemIrigasi: SelectOption[];
    ketersediaanAir: SelectOption[];
  };

  onChange: (
    field: keyof InformasiLahan,
    value: string
  ) => void;
}

export default function InformasiLahanCard({
  value,
  options,
  onChange,
}: Props) {
  
  const lahan: FilterSelectConfig = {
    value: value.idLahan,
    onChange: (val: any) => onChange('idLahan', val),
    options: options.lahan,
    placeholder: 'Pilih Lahan',
    widthClass: 'sm:w-48',
  };

  const statusLahan: FilterSelectConfig = {
    value: value.statusLahan,
    onChange: (val: any) => onChange('statusLahan', val),
    options: options.statusLahan,
    placeholder: 'Pilih Status Lahan',
    widthClass: 'sm:w-48',
  };

  const tipeLahan: FilterSelectConfig = {
    value: value.tipeLahan,
    onChange: (val: any) => onChange('tipeLahan', val),
    options: options.tipeLahan,
    placeholder: 'Pilih Tipe Lahan',
    widthClass: 'sm:w-48',
  };

  const jenisTanah: FilterSelectConfig = {
    value: value.jenisTanah,
    onChange: (val: any) => onChange('jenisTanah', val),
    options: options.jenisTanah,
    placeholder: 'Pilih Jenis Tanah',
    widthClass: 'sm:w-48',
  };

  const sumberAir: FilterSelectConfig = {
    value: value.sumberAir,
    onChange: (val: any) => onChange('sumberAir', val),
    options: options.sumberAir,
    placeholder: 'Pilih Sumber Air',
    widthClass: 'sm:w-48',
  };

  const sistemIrigasi: FilterSelectConfig = {
    value: value.sistemIrigasi,
    onChange: (val: any) => onChange('sistemIrigasi', val),
    options: options.sistemIrigasi,
    placeholder: 'Pilih Sistem Irigasi',
    widthClass: 'sm:w-48',
  };

  const ketersediaanAir: FilterSelectConfig = {
    value: value.ketersediaanAir,
    onChange: (val: any) => onChange('ketersediaanAir', val),
    options: options.ketersediaanAir,
    placeholder: 'Pilih Ketersediaan Air',
    widthClass: 'sm:w-48',
  };



  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      {/* Lahan */}

      <div>

        <label className="form-label">
          Tipe Produksi <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: lahan.options,
            placeholder: lahan.placeholder,
            onfunchange: lahan.onChange,
            getValue: lahan.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Luas */}

      <div>

          <label className="form-label">
              Luas Tanam <span className="text-red-500">*</span>
          </label>

          <input
              className="form-control"
              value={value.luasTanam}
              onChange={(e) =>
                  onChange('luasTanam', e.target.value)
              }
          />

      </div>

      {/* Status Lahan */}

      <div>

        <label className="form-label">
          Status Lahan <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: statusLahan.options,
            placeholder: statusLahan.placeholder,
            onfunchange: statusLahan.onChange,
            getValue: statusLahan.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Tipe Lahan */}

      <div>

        <label className="form-label">
          Tipe Lahan <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: tipeLahan.options,
            placeholder: tipeLahan.placeholder,
            onfunchange: tipeLahan.onChange,
            getValue: tipeLahan.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

       {/* Koodinat Lahan */}

      <div>

          <label className="form-label">
              Koodinat Lahan (GPS) <span className="text-red-500">*</span>
          </label>

          <input
              className="form-control"
              value={value.luasTanam}
              onChange={(e) =>
                  onChange('luasTanam', e.target.value)
              }
          />

      </div>

      {/* Ketinggian */}

      <div>

          <label className="form-label">
              Ketinggian 
          </label>

          <input
              className="form-control"
              value={value.luasTanam}
              onChange={(e) =>
                  onChange('luasTanam', e.target.value)
              }
          />

      </div>

      {/* Jenis Tanah */}

      <div>

        <label className="form-label">
            Jenis Tanah <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: jenisTanah.options,
            placeholder: jenisTanah.placeholder,
            onfunchange: jenisTanah.onChange,
            getValue: jenisTanah.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      <div>

          <label className="form-label">
              pH Tanah 
          </label>

          <input
              className="form-control"
              value={value.luasTanam}
              onChange={(e) =>
                  onChange('luasTanam', e.target.value)
              }
          />

      </div>

      {/* Sumber Air */}

      <div>

        <label className="form-label">
            Sumber Air
        </label>

        <SpkSelect
          {...({
            option: sumberAir.options,
            placeholder: sumberAir.placeholder,
            onfunchange: sumberAir.onChange,
            getValue: sumberAir.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Jarak ke Sumber Air */}

      <div>

          <label className="form-label">
              Jarak Ke Sumber Air <span className="text-red-500">*</span>
          </label>

          <input
              className="form-control"
              value={value.luasTanam}
              onChange={(e) =>
                  onChange('luasTanam', e.target.value)
              }
          />

      </div>

       {/* Sistem Irigasi */}

      <div>

        <label className="form-label">
            Sistem Irigasi
        </label>

        <SpkSelect
          {...({
            option: sistemIrigasi.options,
            placeholder: sistemIrigasi.placeholder,
            onfunchange: sistemIrigasi.onChange,
            getValue: sistemIrigasi.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Ketersediaan Air */}

      <div>

        <label className="form-label">
            Ketersediaan Air
        </label>

        <SpkSelect
          {...({
            option: ketersediaanAir.options,
            placeholder: ketersediaanAir.placeholder,
            onfunchange: ketersediaanAir.onChange,
            getValue: ketersediaanAir.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

    </div>
  );

}