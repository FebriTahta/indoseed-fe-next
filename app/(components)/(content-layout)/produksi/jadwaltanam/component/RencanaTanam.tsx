'use client';

import { RencanaTanam, SelectOption } from "@/app/types/jadwalTanam";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkSelect from "@/shared/@spk-reusable-components/spk-packages/spk-reactselect";
import { FilterSelectConfig } from "../../../shared/FilterRow";


interface Props {
  value: RencanaTanam;

  options: {
    metodeTanam: SelectOption[];
    irigasi: SelectOption[];
    sumberAir: SelectOption[];
  };

  onChange: (
    field: keyof RencanaTanam,
    value: any
  ) => void;
}

export default function RencanaTanamCard({
  value,
  options,
  onChange,
}: Props) {

  const metodeTanam: FilterSelectConfig = {
    value: value.metodeTanam,
    onChange: (val: any) => {
      onChange('metodeTanam', val);
    },
    options: options.metodeTanam,
    placeholder: 'Pilih Metode Tanam',
    widthClass: 'sm:w-48',
  };

  const irigasi: FilterSelectConfig = {
    value: value.irigasi,
    onChange: (val: any) => {
      onChange('irigasi', val);
    },
    options: options.irigasi,
    placeholder: 'Pilih Irigasi',
    widthClass: 'sm:w-48',
  };

  const sumberAir: FilterSelectConfig = {
    value: value.sumberAir,
    onChange: (val: any) => {
      onChange('sumberAir', val);
    },
    options: options.sumberAir,
    placeholder: 'Pilih Sumber Air',
    widthClass: 'sm:w-48',
  };


  return (

    <div className="grid grid-cols-4 gap-4">

      {/* Tanggal Persemaian */}

      <div>

        <label className="form-label">
          Tanggal Persemaian <span className="text-red-500">*</span>
        </label>

        <SpkDatepickr
          className="form-control"
          selected={value.tanggalPersemaian}
          onChange={(date) => onChange('tanggalPersemaian', date)} 
          minDate={undefined} 
          maxDate={undefined} 
          Timeinput={undefined} 
          isClearable={undefined} 
          Iconvisible={undefined} 
          showTimeSelectOnly={undefined} 
          showTimeInput={undefined} 
          Localtime={undefined} 
          Caption={undefined} 
          Inline={undefined} 
          Yearpicker={undefined} 
          selectsRange={undefined} 
          startDate={undefined} 
          endDate={undefined}        
          />

      </div>

      {/* Tanggal Tanam */}

      <div>

        <label className="form-label">
          Tanggal Tanam <span className="text-red-500">*</span>
        </label>

        <SpkDatepickr
          className="form-control"
          selected={value.tanggalTanam}
          onChange={(date) =>
            onChange('tanggalTanam', date)
          }
          minDate={undefined} 
          maxDate={undefined} 
          Timeinput={undefined} 
          isClearable={undefined} 
          Iconvisible={undefined} 
          showTimeSelectOnly={undefined} 
          showTimeInput={undefined} 
          Localtime={undefined} 
          Caption={undefined} 
          Inline={undefined} 
          Yearpicker={undefined} 
          selectsRange={undefined} 
          startDate={undefined} 
          endDate={undefined} 
        />

      </div>

      {/* Perkiraan Panen */}

      <div>

        <label className="form-label">
          Perkiraan Panen <span className="text-red-500">*</span>
        </label>

        <SpkDatepickr
          className="form-control"
          selected={value.perkiraanPanen}
          onChange={(date) =>
            onChange('perkiraanPanen', date)
          }
          minDate={undefined} 
          maxDate={undefined} 
          Timeinput={undefined} 
          isClearable={undefined} 
          Iconvisible={undefined} 
          showTimeSelectOnly={undefined} 
          showTimeInput={undefined} 
          Localtime={undefined} 
          Caption={undefined} 
          Inline={undefined} 
          Yearpicker={undefined} 
          selectsRange={undefined} 
          startDate={undefined} 
          endDate={undefined} 
        />

      </div>

      {/* Siklus */}

      <div>

        <label className="form-label">
          Siklus Tanam (Hari) <span className="text-red-500">*</span>
        </label>

        <input
          type="number"
          className="form-control"
          value={value.siklusTanam}
          onChange={(e) =>
            onChange('siklusTanam', Number(e.target.value))
          }
        />

      </div>

      {/* Metode Tanam */}

      <div>

        <label className="form-label">
          Metode Tanam <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: metodeTanam.options,
            placeholder: metodeTanam.placeholder,
            onfunchange: metodeTanam.onChange,
            getValue: metodeTanam.value,
            classNameprefix: "react-select",
            clearable: true,
          } as any)}
        />

      </div>

      {/* Kepadatan */}

      <div>

        <label className="form-label">
          Kepadatan Tanam <span className="text-red-500">*</span>
        </label>

        <input
          type="number"
          className="form-control"
          value={value.kepadatanTanam}
          onChange={(e) =>
            onChange('kepadatanTanam', Number(e.target.value))
          }
        />

      </div>

      {/* Irigasi */}

      <div>

        <label className="form-label">
          Irigasi <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: irigasi.options,
            placeholder: irigasi.placeholder,
            onfunchange: irigasi.onChange,
            getValue: irigasi.value,
            classNameprefix: "react-select",
            clearable: true,
          } as any)}
        />

      </div>

      {/* Sumber Air */}

      <div>

        <label className="form-label">
          Sumber Air <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: sumberAir.options,
            placeholder: sumberAir.placeholder,
            onfunchange: sumberAir.onChange,
            getValue: sumberAir.value,
            classNameprefix: "react-select",
            clearable: true,
          } as any)}
        />

      </div>

    </div>

  );

}