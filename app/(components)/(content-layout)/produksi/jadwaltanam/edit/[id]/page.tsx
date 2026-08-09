'use client';

import React, { useState, Fragment, use } from 'react';
import { useRouter } from 'next/navigation';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Stepper from '../../component/Stepper';
import useJadwalTanamEdit from '@/app/hooks/useJadwalTanamEdit';

import Step1InformasiUmum from '../../component/steps/Step1InformasiUmum';
import Step2LahanKomoditas from '../../component/steps/Step2LahanKomoditas';
import Step3RencanaTanam from '../../component/steps/Step3RencanaTanam';
import Step4PersonilPeralatan from '../../component/steps/Step4PersonilPeralatan';
import Step5ReviewKonfirmasi from '../../component/steps/Step5ReviewKonfirmasi';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditJadwalTanamPage({ params }: EditPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(5);

  const {
    isLoading,
    isSubmitting,
    informasiUmum,
    lahanKomoditas,
    rencanaTanam,
    catatanTambahan,
    informasiLahan,
    detailRencanaTanam,
    setDetailRencanaTanam,
    personilList,
    setPersonilList,
    peralatanList,
    setPeralatanList,
    lahanOptions,
    commodityOptions,
    filteredVarietasOptions,
    handleChangeIU,
    handleChangeLK,
    handleChangeRT,
    handleChangeCT,
    handleChangeIL,
    handleSaveUpdate,
  } = useJadwalTanamEdit(resolvedParams.id);

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
      title: 'Review & Konfirmasi',
      description: 'Verifikasi sebelum simpan',
    },
  ];

  const options = {
    lahanKomoOption: {
      lahan: lahanOptions,
      komoditas: commodityOptions,
      varietas: filteredVarietasOptions,
    },
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSaveUpdate();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/produksi/jadwaltanam');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 text-xs">
        <div className="flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-xl text-emerald-600"></i>
          <span>Memuat data jadwal tanam...</span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Pageheader
        title={`Edit Jadwal Tanam: ${informasiUmum.kodeJadwalTanam || ''}`}
        currentpage="Edit Jadwal Tanam"
        activepage="Edit"
        mainpage="Produksi"
        description="Perbarui informasi rencana tanam dan alokasi sumber daya."
        customButton={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push('/produksi/jadwaltanam')}
              className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              Batal
            </button>

            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1"
              >
                <i className="ri-arrow-left-s-line text-sm"></i> Kembali
              </button>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                if (currentStep === 5) {
                  handleSaveUpdate();
                } else {
                  handleNext();
                }
              }}
              className="px-4 py-1.5 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              {currentStep === 5 ? (
                <>{isSubmitting ? 'Memperbarui...' : 'Konfirmasi Perubahan >'}</>
              ) : (
                <>Lanjut &gt;</>
              )}
            </button>
          </div>
        }
      />

      {/* Stepper Navigation */}
      <Stepper
        items={steps}
        current={currentStep}
        onChange={(step) => setCurrentStep(step)}
      />

      {/* Step Content */}
      <div className="mt-5 mb-8">
        {currentStep === 1 && (
          <Step1InformasiUmum
            dataIU={informasiUmum}
            dataLK={lahanKomoditas}
            dataRT={rencanaTanam}
            dataCT={catatanTambahan}
            onChangeIU={handleChangeIU}
            onChangeLK={handleChangeLK}
            onChangeRT={handleChangeRT}
            onChangeCT={handleChangeCT}
            options={options}
          />
        )}

        {currentStep === 2 && (
          <Step2LahanKomoditas
            options={options}
            dataLK={lahanKomoditas}
            dataIL={informasiLahan}
            dataRT={rencanaTanam}
            onChangeLK={handleChangeLK}
            onChangeIL={handleChangeIL}
            onChangeRT={handleChangeRT}
          />
        )}

        {currentStep === 3 && (
          <Step3RencanaTanam
            options={options}
            dataIU={informasiUmum}
            dataLK={lahanKomoditas}
            dataRT={rencanaTanam}
            dataCT={catatanTambahan}
            onChangeRT={handleChangeRT}
            onChangeCT={handleChangeCT}
            detailList={detailRencanaTanam}
            setDetailList={setDetailRencanaTanam}
          />
        )}

        {currentStep === 4 && (
          <Step4PersonilPeralatan
            personilList={personilList}
            setPersonilList={setPersonilList}
            peralatanList={peralatanList}
            setPeralatanList={setPeralatanList}
          />
        )}

        {currentStep === 5 && (
          <Step5ReviewKonfirmasi
            dataIU={informasiUmum}
            dataIL={informasiLahan}
            dataLK={lahanKomoditas}
            dataRT={rencanaTanam}
            dataCT={catatanTambahan}
            detailList={detailRencanaTanam}
            personilList={personilList}
            peralatanList={peralatanList}
            options={options}
            isEditMode={true}
          />
        )}
      </div>
    </Fragment>
  );
}
