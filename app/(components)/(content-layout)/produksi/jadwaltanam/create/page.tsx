'use client';

import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import { Fragment } from 'react';
import Stepper from '../component/Stepper';
import FormSection from '../component/FormSection';
import InformasiUmumCard from '../component/InformasiUmum';
import LahanKomoditasCard from '../component/LahanKomoditas';
import useJadwalTanamAdd from '@/app/hooks/useJadwalTanamAdd';
import RencanaTanamCard from '../component/RencanaTanam';
import CatatanTambahanCard from '../component/CatatanTambahan';
import StandarKepatuhanISO from '../component/StandarKepatuhan';
import RingkasanJadwal from '../component/RingkasanJadwal';
import InformasiBenih from '../component/InfoBenih';
import InformasiLahanCard from '../component/InformasiLahan';
import PetaLayoutCard from '../component/PetaLayout';
import InfoKomoditasVarietas from '../component/InfoKomoditasVarietas';
import RencanaJadwalTanamCard from '../component/RencanaJadwalTanam';

export default function CreateJadwalTanamPage() {

  const {
    informasiUmum,
    setInformasiUmum,
    lahanKomoditas,
    setLahanKomoditas,
    rencanaTanam,
    setRencanaTanam,
    catatanTambahan,
    setCatatanTambahan,
    informasiLahan, 
    setInformasiLahan,
    commodityOptions,
    varietasOptions,
    stats,
    infoSummary,
    handleChangeIU,
    handleChangeLK,
    handleChangeRT,
    handleChangeCT,
    handleChangeIL
  } = useJadwalTanamAdd();

  const steps = [
    {
      id: 1,
      title: 'Informasi Umum',
      description: 'Data dasar jadwal tanam',
    },
    {
      id: 2,
      title: 'Lahan & Komoditas',
      description: 'Informasi lahan dan benih',
    },
    {
      id: 3,
      title: 'Rencana Tanam',
      description: 'Waktu dan metode tanam',
    },
    {
      id: 4,
      title: 'Personil & Peralatan',
      description: 'Penanggung jawab & alat',
    },
    {
      id: 5,
      title: 'Review',
      description: 'Verifikasi sebelum simpan',
    },
  ];

  return (
    <Fragment>
      <Pageheader title="Buat Jadwal Tanam Baru"
        currentpage="Jadwal Tanam"
        activepage="Buat Jadwal Tanam Baru"
        mainpage="Produksi"
        description="Buat jadwal tanam baru sesuai ISO 90001:2015 dan prinsip Good Seed Production"
        customButton={
          <SpkButton
            {...({
              onclickfunc: undefined,
              style: { backgroundColor: '#078836', color: 'white' },
              className: "hover:bg-[#06732d] hover:text-white",
              customClass: "ti-btn !border-0 btn-wave !me-0 flex items-center gap-1.5"
            } as any)}
          >
            <i className="ri-add-line text-lg"></i> Simpan Jadwal
          </SpkButton>
        } />

      <Stepper
        items={steps}
        current={1}
      />

      <div className="grid grid-cols-12 gap-5 mt-5">

        <div className="col-span-9">

          <FormSection title="Informasi Umum">
          
            <InformasiUmumCard value={informasiUmum} options={stats.infoUmumOption} onChange={handleChangeIU} />          
          
          </FormSection>

          <FormSection title="Lahan & Komoditas">

            <LahanKomoditasCard value={lahanKomoditas} options={stats.lahanKomoOption} onChange={handleChangeLK} />  

          </FormSection>

          <FormSection title="Rencana Tanam">

            <RencanaTanamCard value={rencanaTanam} options={stats.rencanaTanamOption} onChange={handleChangeRT} />          

          </FormSection>

          <FormSection title="Catatan Tambahan">

            <CatatanTambahanCard value={catatanTambahan} onChange={handleChangeCT} />          

          </FormSection>

        </div>

        <div className="col-span-3">

          <StandarKepatuhanISO />

          <RingkasanJadwal summary={infoSummary.summary} />

          <InformasiBenih data={infoSummary.infoBenih} /> 

        </div>

      </div>

      <div className="grid grid-cols-12 gap-5 mt-5">

        <div className="col-span-9">
          <FormSection title="A. Informasi Lahan">

            <InformasiLahanCard value={informasiLahan} options={stats.informasiLahanOption} onChange={handleChangeIL} />

          </FormSection>

          <FormSection title="Peta & Layout Lahan">

            <PetaLayoutCard value={lahanKomoditas} onChange={handleChangeLK} />

          </FormSection>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <i className="ri-shield-check-line text-lg text-primary" />
              </div>

              <div className="flex-1">
                <h6 className="mb-1 text-sm font-semibold text-primary">
                  Catatan ISO
                </h6>

                <p className="text-sm text-defaulttextcolor">
                  Pastikan lahan bebas dari kontaminasi, memiliki riwayat budidaya yang
                  baik, dan memenuhi persyaratan isolasi sesuai standar sertifikasi
                  benih.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">

          <InfoKomoditasVarietas value={lahanKomoditas} onChange={handleChangeLK} options={stats.lahanKomoOption} />

        </div>

      </div>

      <div className="grid grid-cols-12 gap-5 mt-5">

        <div className="col-span-12">

          <FormSection title="Rencana Tanam">

            <RencanaJadwalTanamCard value={rencanaTanam} options={stats.rencanaTanamOption} onChange={handleChangeRT} />          

          </FormSection>

        </div>
      </div>


    </Fragment>
    // <div className="space-y-6">

    //     {/* Header */}

    //     <div className="flex justify-between items-center">

    //         <div>

    //             <h1 className="text-2xl font-bold">
    //                 Buat Jadwal Tanam Baru
    //             </h1>

    //             <p className="text-gray-500">
    //                 Buat jadwal tanam baru sesuai standar ISO.
    //             </p>

    //         </div>

    //         <div className="flex gap-2">

    //             <button
    //                 className="btn btn-outline"
    //                 onClick={vm.cancel}
    //             >
    //                 Batal
    //             </button>

    //             <button
    //                 className="btn btn-success"
    //                 onClick={() => vm.submit('draft')}
    //             >
    //                 Simpan Draft
    //             </button>

    //         </div>

    //     </div>

    //     {/* Step */}

    //     <Stepper

    //         current={vm.step}

    //         items={vm.steps}

    //         onChange={vm.goToStep}

    //     />

    //     {/* Layout */}

    //     <div className="grid grid-cols-12 gap-6">

    //         {/* Left */}

    //         <div className="col-span-9">

    //             {vm.step == 1 && (

    //                 <Step1InformasiUmum

    //                     value={vm.form.informasiUmum}

    //                     options={vm.options}

    //                     onChange={vm.updateInformasi}

    //                 />

    //             )}

    //             {vm.step == 2 && (

    //                 <Step2LahanKomoditas

    //                     value={vm.form.lahanKomoditas}

    //                     options={vm.options}

    //                     onChange={vm.updateLahan}

    //                 />

    //             )}

    //             {vm.step == 3 && (

    //                 <Step3RencanaTanam

    //                     value={vm.form.rencanaTanam}

    //                     options={vm.options}

    //                     onChange={vm.updateRencana}

    //                 />

    //             )}

    //             {vm.step == 4 && (

    //                 <Step4Personil

    //                     value={vm.form.personil}

    //                     options={vm.options}

    //                     onChange={vm.updatePersonil}

    //                 />

    //             )}

    //             {vm.step == 5 && (

    //                 <Step5Review

    //                     form={vm.form}

    //                 />

    //             )}

    //         </div>

    //         {/* Right */}

    //         <div className="col-span-3 space-y-5">

    //             <ISOCard />

    //             <SummaryCard

    //                 summary={vm.summary}

    //             />

    //         </div>

    //     </div>

    //     {/* Footer */}

    //     <div className="flex justify-between">

    //         <button

    //             className="btn"

    //             disabled={vm.step == 1}

    //             onClick={vm.previous}

    //         >

    //             Sebelumnya

    //         </button>

    //         {vm.step != 5 && (

    //             <button

    //                 className="btn btn-primary"

    //                 onClick={vm.next}

    //             >

    //                 Selanjutnya

    //             </button>

    //         )}

    //         {vm.step == 5 && (

    //             <button

    //                 className="btn btn-success"

    //                 onClick={() => vm.submit('publish')}

    //             >

    //                 Simpan Jadwal

    //             </button>

    //         )}

    //     </div>

    // </div>

  );

}