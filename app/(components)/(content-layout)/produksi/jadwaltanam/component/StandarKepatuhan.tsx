'use client';

import InfoSection from './InfoSection';

const items = [
    {
        title: 'Perencanaan produksi terdokumentasi',
        subtitle: 'Klausul 8.1',
    },
    {
        title: 'Pengendalian sumber daya',
        subtitle: 'Klausul 8.5',
    },
    {
        title: 'Identifikasi & keterlacakan',
        subtitle: 'Klausul 8.5.2',
    },
    {
        title: 'Pengendalian proses produksi',
        subtitle: 'Klausul 8.5.1',
    },
    {
        title: 'Rekaman & dokumentasi',
        subtitle: 'Klausul 7.5',
    },
];

export default function StandarKepatuhanISO() {

    return (

      <InfoSection
          title="Standar & Kepatuhan ISO"
          icon={
              <i className="ri-shield-check-fill text-lg text-success"></i>
          }
      >

        <p className="mb-5 text-xs text-textmuted">
          Sesuai dengan ISO 9001:2015 dan ISO 22005:2018
        </p>

        <div className="space-y-4">

          {items.map((item) => (

            <div
                key={item.title}
                className="flex items-start gap-3"
            >

              <div className="mt-1">

                <i className="ri-checkbox-circle-fill text-success"></i>

              </div>

              <div>

                <div className="text-xs font-medium text-defaulttextcolor">

                  {item.title}

                </div>

                <div className="text-[11px] text-textmuted">

                  {item.subtitle}

                </div>

              </div>

            </div>

          ))}

        </div>

      </InfoSection>

    );

}