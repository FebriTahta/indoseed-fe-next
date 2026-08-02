'use client';

import InfoSection from './InfoSection';

interface Props {
  summary: {
    komoditas: string;
    varietas: string;
    lahan: string;
    luasTanam: number | string;
    periodeTanam: string;
    perkiraanPanen: string;
    benihDiperlukan: number | string;
    tujuanProduksi: string;
    tipeProduksi: string;
  };
}

export default function RingkasanJadwal({
  summary,
}: Props) {

  const items = [
    {
      label: 'Komoditas',
      value: summary.komoditas,
    },
    {
      label: 'Varietas',
      value: summary.varietas,
    },
    {
      label: 'Lahan',
      value: summary.lahan,
    },
    {
      label: 'Luas Tanam',
      value: summary.luasTanam,
    },
    {
      label: 'Periode Tanam',
      value: summary.periodeTanam,
    },
    {
      label: 'Perkiraan Panen',
      value: summary.perkiraanPanen,
    },
    {
      label: 'Benih Diperlukan',
      value: summary.benihDiperlukan,
    },
    {
      label: 'Tujuan Produksi',
      value: summary.tujuanProduksi,
    },
    {
      label: 'Tipe Produksi',
      value: summary.tipeProduksi,
    },
  ];

  return (

    <InfoSection
      title="Ringkasan Jadwal"
    >

      <div className="space-y-3">

        {items.map((item) => (

          <div
            key={item.label}
            className="flex justify-between gap-4 text-xs"
          >

            <span className="text-textmuted">
              {item.label}
            </span>

            <span className="font-medium text-defaulttextcolor text-right">
              {item.value || '-'}
            </span>

          </div>

        ))}

      </div>

    </InfoSection>

  );

}