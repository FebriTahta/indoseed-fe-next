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

export default function RencanaJadwalTanamCard({
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
          Tanggal Mulai Tanam <span className="text-red-500">*</span>
        </label>

        <SpkDatepickr
          className="form-control"
          selected={value.tanggalTanam}
          onChange={(date) => onChange('tanggalTanam', date)} 
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
          Perkiraan Tanggal Selesai <span className="text-red-500">*</span>
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

      {/* Periode Tanam */}

      <div>

        <label className="form-label">
          Periode Tanam <span className="text-red-500">*</span>
        </label>

        <SpkDatepickr
          className="form-control"
          selected={value.tanggalTanam}
          onChange={(date) => onChange('tanggalTanam', date)} 
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

      {/* Musim Tanam */}

      <div>

        <label className="form-label">
          Musim Tanam <span className="text-red-500">*</span>
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

      {/* Metode Tanam */}

      <div>

        <label className="form-label">
          Metode Tanam 
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

      {/* Irigasi */}

      <div>

        <label className="form-label">
          Sistem Irigasi
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

      {/* Catatan */}

      <div>

        <label className="form-label">
          Catatan <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={4}
          className="form-control"
          value={value.catatan}
          onChange={(e) =>
            onChange(
              'catatan',
              e.target.value
            )
          }
        />

      </div>

    </div>

  );

}