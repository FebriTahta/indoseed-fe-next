'use client';

import InfoSection from './InfoSection';

interface Props {
  data: {
    batchBenih: string;
    asalBenih: string;
    tanggalProduksi: string;
    dayaBerkecambah: string;
    kemurnian: string;
    kadarAir: string;
  };

  onDetail?: () => void;
}

export default function InformasiBenih({
  data,
  onDetail,
}: Props) {

  const items = [
    {
      label: 'Batch Benih',
      value: data.batchBenih,
    },
    {
      label: 'Asal Benih',
      value: data.asalBenih,
    },
    {
      label: 'Tanggal Produksi',
      value: data.tanggalProduksi,
    },
    {
      label: 'Daya Berkecambah',
      value: data.dayaBerkecambah,
    },
    {
      label: 'Kemurnian',
      value: data.kemurnian,
    },
    {
      label: 'Kadar Air',
      value: data.kadarAir,
    },
  ];

  return (

    <InfoSection
      title="Informasi Benih"
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

      <hr className="my-4 border-defaultborder" />

      <button
        type="button"
        onClick={onDetail}
        className="
                    flex
                    w-full
                    items-center
                    justify-between
                    text-sm
                    font-medium
                    text-success
                    transition-colors
                    hover:text-success/80
                "
      >

        <span>
          Lihat Detail Benih
        </span>

        <i className="ri-arrow-right-line text-base"></i>

      </button>

    </InfoSection>

  );

}