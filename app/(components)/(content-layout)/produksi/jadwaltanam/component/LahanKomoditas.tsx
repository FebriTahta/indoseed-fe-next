'use client';

import {  LahanKomoditas, SelectOption } from "@/app/types/jadwalTanam";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkSelect from "@/shared/@spk-reusable-components/spk-packages/spk-reactselect";
import { FilterSelectConfig } from "../../../shared/FilterRow";



interface Props {
  value: LahanKomoditas;

  options: {
    lahan: SelectOption[];
    komoditas: SelectOption[];
    varietas: SelectOption[];
    asalBenih: SelectOption[];
    jarakTanam: SelectOption[];
    sistemTanam: SelectOption[];
  };

  onChange: (
    field: keyof LahanKomoditas,
    value: any
  ) => void;
}

export default function LahanKomoditasCard({
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

  const komoditas: FilterSelectConfig = {
    value: value.komoditas,
    onChange: (val: any) => onChange('komoditas', val),
    options: options.komoditas,
    placeholder: 'Pilih Komoditas',
    widthClass: 'sm:w-48',
  };

  const varietas: FilterSelectConfig = {
    value: value.varietas,
    onChange: (val: any) => onChange('varietas', val),
    options: options.varietas,
    placeholder: 'Pilih Varietas',
    widthClass: 'sm:w-48',
  };

  const asalBenih: FilterSelectConfig = {
    value: value.asalBenih,
    onChange: (val: any) => onChange('asalBenih', val),
    options: options.asalBenih,
    placeholder: 'Pilih Asal Benih',
    widthClass: 'sm:w-48',
  };

  const jarakTanam: FilterSelectConfig = {
    value: value.jarakTanam,
    onChange: (val: any) => onChange('jarakTanam', val),
    options: options.jarakTanam,
    placeholder: 'Pilih Jarak Tanam',
    widthClass: 'sm:w-48',
  };

  const sistemTanam: FilterSelectConfig = {
    value: value.sistemTanam,
    onChange: (val: any) => onChange('sistemTanam', val),
    options: options.sistemTanam,
    placeholder: 'Pilih Sistem Tanam',
    widthClass: 'sm:w-48',
  };


  return (

    <div className="grid grid-cols-4 gap-4">

      {/* Lahan */}

      <div>

          <label className="form-label">
              Lahan <span className="text-red-500">*</span>
          </label>

          <SpkSelect
              {...({
                  option: lahan.options,
                  placeholder: lahan.placeholder,
                  onfunchange: lahan.onChange,
                  getValue: lahan.value,
                  classNameprefix: "react-select",
                  clearable: true,
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

      {/* Komoditas */}

      <div>

          <label className="form-label">
              Komoditas <span className="text-red-500">*</span>
          </label>

          <SpkSelect
              {...({
                  option: komoditas.options,
                  placeholder: komoditas.placeholder,
                  onfunchange: komoditas.onChange,
                  getValue: komoditas.value,
                  classNameprefix: "react-select",
                  clearable: true,
              } as any)}
          />

      </div>

      {/* Varietas */}

      <div>

          <label className="form-label">
              Varietas <span className="text-red-500">*</span>
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

      {/* Asal Benih */}

      <div>

          <label className="form-label">
              Asal Benih <span className="text-red-500">*</span>
          </label>

          <SpkSelect
              {...({
                  option: asalBenih.options,
                  placeholder: asalBenih.placeholder,
                  onfunchange: asalBenih.onChange,
                  getValue: asalBenih.value,
                  classNameprefix: "react-select",
                  clearable: true,
              } as any)}
          />

      </div>

      {/* Jumlah Benih */}

      <div>

          <label className="form-label">
              Jumlah Benih Dibutuhkan <span className="text-red-500">*</span>
          </label>

          <input
              className="form-control"
              value={value.jumlahBenihDiperlukan}
              onChange={(e) =>
                  onChange('jumlahBenihDiperlukan', e.target.value)
              }
          />

      </div>

      {/* Jarak Tanam */}

      <div>

          <label className="form-label">
              Jarak Tanam <span className="text-red-500">*</span>
          </label>

          <SpkSelect
              {...({
                  option: jarakTanam.options,
                  placeholder: jarakTanam.placeholder,
                  onfunchange: jarakTanam.onChange,
                  getValue: jarakTanam.value,
                  classNameprefix: "react-select",
                  clearable: true,
              } as any)}
          />

      </div>

      {/* Sistem Tanam */}

      <div>

          <label className="form-label">
              Sistem Tanam <span className="text-red-500">*</span>
          </label>

          <SpkSelect
              {...({
                  option: sistemTanam.options,
                  placeholder: sistemTanam.placeholder,
                  onfunchange: sistemTanam.onChange,
                  getValue: sistemTanam.value,
                  classNameprefix: "react-select",
                  clearable: true,
              } as any)}
          />

      </div>

  </div>

  );

}