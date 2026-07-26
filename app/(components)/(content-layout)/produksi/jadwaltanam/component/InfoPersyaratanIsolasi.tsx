'use client';

import InfoSection from './InfoSection';
import { PersyaratanIsolasi } from '@/app/types/jadwalTanam';


interface Props {
  value: PersyaratanIsolasi;
}

export default function InfoPersyaratanIsolasi({
  value,
}: Props) {

  return (

    <InfoSection
      title="Persyaratan Isolasi"
    >

      {/* Persyaratan Isolasi */}
      <div className="grid grid-cols-2 gap-y-3 text-sm">

        <span className="text-defaulttextcolor/70">
          Jarak Isolasi Minimal
        </span>

        <span>
          &gt; {value.jarakIsolasi} meter
        </span>

        <span className="text-defaulttextcolor/70">
          Tanaman Sekeliling
        </span>

        <span>
          {value.tanamanSekeliling}
        </span>

        <span className="text-defaulttextcolor/70">
          Jarak Tanaman
        </span>

        <span>
          &gt; {value.jarakTanam} meter
        </span>

      </div>

      <div className="mt-4 rounded-xl border border-success/20 bg-success/5 p-4">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-white">
            <i className="ri-check-line text-lg" />
          </div>

          <div>

            <h6 className="font-semibold text-success">
              Status Kepatuhan
            </h6>

            <p className="mt-1 text-sm text-defaulttextcolor">
              Lahan memenuhi persyaratan isolasi sesuai standar sertifikasi
              benih.
            </p>

          </div>

        </div>

      </div>

    </InfoSection >

  );

}