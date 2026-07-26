'use client';

import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';
import InfoSection from './InfoSection';
import { LahanKomoditas, SelectOption } from '@/app/types/jadwalTanam';
import { FilterSelectConfig } from './FilterRow';
import { Variety } from '@/app/types/variety';

interface Props {
  value: LahanKomoditas;

  options: {
    komoditas: SelectOption[];
    varietas: SelectOption[];
    kelasBenihHasil: SelectOption[];
    asalBenih: SelectOption[];

  };

  onChange: (
    field: keyof LahanKomoditas,
    value: any
  ) => void;
}

export default function InfoKomoditasVarietas({
  value,
  options,
  onChange,
}: Props) {


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

  const kelasBenihHasil: FilterSelectConfig = {
    value: value.hasilBenih,
    onChange: (val: any) => onChange('hasilBenih', val),
    options: options.kelasBenihHasil,
    placeholder: 'Pilih Benih yang Dihasilkan',
    widthClass: 'sm:w-48',
  };

  const asalBenih: FilterSelectConfig = {
    value: value.asalBenih,
    onChange: (val: any) => onChange('asalBenih', val),
    options: options.asalBenih,
    placeholder: 'Pilih Asal Benih',
    widthClass: 'sm:w-48',
  };

  const stokBenih: string = '--';
  const infoVarity: Variety = {} as Variety;

  return (

    <InfoSection
      title="B. Komoditas & Varietas"
    >
      <div className="grid grid-cols-1 gap-4">

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

        <label className="form-label">
          Kelas Benih yang Dihasilkan <span className="text-red-500">*</span>
        </label>

        <SpkSelect
          {...({
            option: kelasBenihHasil.options,
            placeholder: kelasBenihHasil.placeholder,
            onfunchange: kelasBenihHasil.onChange,
            getValue: kelasBenihHasil.value,
            classNameprefix: "react-select",
            clearable: true,
          } as any)}
        />

        <label className="form-label">
          Sumber Benih <span className="text-red-500">*</span>
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

        <div>
          <span className="inline-flex rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
            Stok Tersedia: {stokBenih} Kg
          </span>
        </div>

        {/* Informasi Varietas */}
        <div className="rounded-xl border border-success/20 bg-success/5 p-4">

          <h6 className="mb-4 font-semibold text-success">
            Informasi Varietas
          </h6>

          <div className="grid grid-cols-2 gap-y-3 text-sm">

            <span className="text-defaulttextcolor/70">
              Nama Varietas
            </span>
            <span>{infoVarity.namaVarietas}</span>

            <span className="text-defaulttextcolor/70">
              Umur Panen
            </span>
            <span>± {infoVarity.umurTanam} Hari</span>

            <span className="text-defaulttextcolor/70">
              Potensi Hasil
            </span>
            <span>{infoVarity.potensiHasil}</span>

            <span className="text-defaulttextcolor/70">
              Ketahanan
            </span>
            <span> - </span>

            <span className="text-defaulttextcolor/70">
              Deskripsi
            </span>

            <span>
              {infoVarity.deskripsi}
            </span>

          </div>

        </div>

      </div>

    </InfoSection>

  );

}