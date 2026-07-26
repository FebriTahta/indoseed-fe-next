'use client';

import { InformasiUmum, SelectOption } from "@/app/types/jadwalTanam";
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import SpkSelect from "@/shared/@spk-reusable-components/spk-packages/spk-reactselect";
import { FilterSelectConfig } from "../../../shared/FilterRow";




interface Props {
  value: InformasiUmum;

  options: {
    musimTanam: SelectOption[];
    tujuanProduksi: SelectOption[];
    tipeProduksi: SelectOption[];
    statusJadwal: SelectOption[];
  };

  onChange: (
    field: keyof InformasiUmum,
    value: string
  ) => void;
}

export default function InformasiUmumCard({
  value,
  options,
  onChange,
}: Props) {

  const musimTanam: FilterSelectConfig = {
    value: value.musimTanam,
    onChange: (val: any) => { 
      onChange(
          'musimTanam',
          val
        ) 
    },
    options: options.musimTanam,
    placeholder: 'Pilih Musim Tanam',
    widthClass: 'sm:w-48',
  };

  const tujuanProduksi: FilterSelectConfig = {
    value: value.tujuanProduksi,
    onChange: (val: any) => { 
      onChange(
          'tujuanProduksi',
          val
        ) 
    },
    options: options.tujuanProduksi,
    placeholder: 'Pilih Tujuan Produksi',
    widthClass: 'sm:w-48',
  };

  const tipeProduksi: FilterSelectConfig = {
    value: value.tipeProduksi,
    onChange: (val: any) => { 
      onChange(
          'tipeProduksi',
          val
        ) 
    },
    options: options.tipeProduksi,
    placeholder: 'Pilih Tipe Produksi',
    widthClass: 'sm:w-48',
  };

  const statusJadwal: FilterSelectConfig = {
    value: value.statusJadwal,
    onChange: (val: any) => { 
      onChange(
          'statusJadwal',
          val
        ) 
    },
    options: options.statusJadwal,
    placeholder: 'Pilih Tipe Produksi',
    widthClass: 'sm:w-48',
  };


  return (

    <div className="grid grid-cols-4 gap-4">

      {/* Kode Jadwal */}

      <div>

        <label className="form-label">
          Kode Jadwal Tanam
        </label>

        <input
          value={value.kodeJadwalTanam}
          disabled
          className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
          placeholder="Auto (akan dibuatkan otomatis)"
          required
        />

      </div>

      {/* Periode */}

      <div>

        <label className="form-label">
          Periode Tanam <span className="text-red-500">*</span>
        </label>

        <SpkDatepickr
          className="form-control w-full border border-defaultborder p-2 rounded text-sm bg-gray-50 font-mono"
          placeholderText="Select date range"
          startDate={value.periodeTanamMulai}
          endDate={value.periodeTanamSelesai}
          selectsRange={true}
          onChange={(update) => {
            console.log('Change Update picker: ', update);
            onChange(
              'periodeTanamMulai',
              update[0]
            )

            onChange(
              'periodeTanamSelesai',
              update[1]
            )
          }} 
          selected={undefined} 
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
          Yearpicker={undefined} />
      </div>

      {/* Musim */}

      <div>

        <label className="form-label">
          Musim Tanam <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: musimTanam.options,
            placeholder: musimTanam.placeholder,
            onfunchange: musimTanam.onChange,
            getValue: musimTanam.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Tujuan */}

      <div>

        <label className="form-label">
          Tujuan Produksi <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: tujuanProduksi.options,
            placeholder: tujuanProduksi.placeholder,
            onfunchange: tujuanProduksi.onChange,
            getValue: tujuanProduksi.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Tipe */}

      <div>

        <label className="form-label">
          Tipe Produksi <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: tipeProduksi.options,
            placeholder: tipeProduksi.placeholder,
            onfunchange: tipeProduksi.onChange,
            getValue: tipeProduksi.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Status */}

      <div>

        <label className="form-label">
          Status Jadwal <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: statusJadwal.options,
            placeholder: statusJadwal.placeholder,
            onfunchange: statusJadwal.onChange,
            getValue: statusJadwal.value,
            classNameprefix: "react-select",
            clearable: true
          } as any)}
        />

      </div>

      {/* Deskripsi */}

      <div className="md:col-span-2">

        <label className="form-label">
          Deskripsi (Opsional)
        </label>

        <textarea
          rows={4}
          className="form-control"
          value={value.deskripsi}
          onChange={(e) =>
            onChange(
              'deskripsi',
              e.target.value
            )
          }
        />

      </div>

    </div>

  );

}