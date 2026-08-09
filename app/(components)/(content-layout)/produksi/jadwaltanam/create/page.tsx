'use client';

import React, { useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Pageheader from '@/shared/layouts-components/page-header/pageheader';
import Stepper from '../component/Stepper';
import useJadwalTanamAdd from '@/app/hooks/useJadwalTanamAdd';
import jadwalTanamService from '@/app/services/jadwalTanamService';

import Step1InformasiUmum from '../component/steps/Step1InformasiUmum';
import Step2LahanKomoditas from '../component/steps/Step2LahanKomoditas';
import Step3RencanaTanam from '../component/steps/Step3RencanaTanam';
import Step4PersonilPeralatan from '../component/steps/Step4PersonilPeralatan';
import Step5ReviewKonfirmasi from '../component/steps/Step5ReviewKonfirmasi';

export default function CreateJadwalTanamPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    informasiUmum,
    lahanKomoditas,
    rencanaTanam,
    catatanTambahan,
    informasiLahan,
    stats,
    handleChangeIU,
    handleChangeLK,
    handleChangeRT,
    handleChangeCT,
    handleChangeIL,
  } = useJadwalTanamAdd();

  const [detailRencanaTanam, setDetailRencanaTanam] = useState<any[]>([]);
  const [personilList, setPersonilList] = useState<any[]>([]);
  const [peralatanList, setPeralatanList] = useState<any[]>([]);

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

  // Dynamic header titles & labels
  const getHeaderMeta = () => {
    switch (currentStep) {
      case 1:
        return {
          title: 'Buat Jadwal Tanam Baru',
          activePage: 'Buat Jadwal Tanam Baru',
          mainPage: 'Jadwal Tanam',
          description: 'Buat jadwal tanam baru sesuai standar ISO 9001:2015 dan prinsip Good Seed Production.',
          nextLabel: 'Lanjut: Lahan & Komoditas >'
        };
      case 2:
        return {
          title: 'Buat Jadwal Tanam Baru',
          activePage: 'Buat Jadwal Tanam Baru',
          mainPage: 'Jadwal Tanam',
          description: 'Buat jadwal tanam baru sesuai standar ISO 9001:2015 dan prinsip Good Seed Production.',
          nextLabel: 'Lanjut: Rencana Tanam >'
        };
      case 3:
        return {
          title: 'Rencana Tanam',
          activePage: 'Rencana Tanam',
          mainPage: 'Jadwal Tanam',
          description: 'Buat dan kelola rencana tanam benih untuk periode produksi.',
          nextLabel: 'Lanjut: Personil & Peralatan >'
        };
      case 4:
        return {
          title: 'Personil & Peralatan',
          activePage: 'Personil & Peralatan',
          mainPage: 'Rencana Tanam',
          description: 'Kelola personil dan peralatan yang dialokasikan untuk rencana tanam ini.',
          nextLabel: 'Lanjut: Review & Konfirmasi >'
        };
      case 5:
        return {
          title: 'Review & Konfirmasi',
          activePage: 'Review & Konfirmasi',
          mainPage: 'Rencana Tanam',
          description: 'Review seluruh rencana tanam sebelum dikonfirmasi untuk pelaksanaan.',
          nextLabel: isSubmitting ? 'Menyimpan...' : 'Konfirmasi Rencana Tanam >'
        };
      default:
        return {
          title: 'Buat Jadwal Tanam Baru',
          activePage: 'Buat Jadwal Tanam Baru',
          mainPage: 'Jadwal Tanam',
          description: 'Buat jadwal tanam baru sesuai standar ISO 9001:2015 dan prinsip Good Seed Production.',
          nextLabel: 'Lanjut >'
        };
    }
  };

  const meta = getHeaderMeta();

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      try {
        setIsSubmitting(true);
        const uploadedDocs = (catatanTambahan?.dokumenFiles || []).map((file: any) => ({
          nama: file.name || file.nama || 'Dokumen Rencana Tanam',
          fileUrl: file instanceof File ? URL.createObjectURL(file) : (file.url || file.fileUrl || ''),
          fileType: file.type || file.fileType || 'application/pdf',
        }));

        const docsToSave = uploadedDocs;

        const payload = {
          kodeJadwalTanam: informasiUmum.kodeJadwalTanam,
          periodeTanam: informasiUmum.periodeTanamMulai,
          periodeTanamMulai: informasiUmum.periodeTanamMulai,
          periodeTanamSelesai: informasiUmum.periodeTanamSelesai,
          musimTanam: informasiUmum.musimTanam,
          tujuanProduksi: informasiUmum.tujuanProduksi,
          tipeProduksi: informasiUmum.tipeProduksi,
          statusJadwal: informasiUmum.statusJadwal || 'Draft',
          penanggungJawab: informasiUmum.penanggungJawab,
          deskripsi: informasiUmum.deskripsi,

          greenhouseId: lahanKomoditas.idLahan,
          commodityId: lahanKomoditas.komoditas,
          varietyId: lahanKomoditas.varietas,
          luasTanam: lahanKomoditas.luasTanam,
          asalBenih: lahanKomoditas.asalBenih,
          jumlahBenihDiperlukan: lahanKomoditas.jumlahBenihDiperlukan,
          jarakTanam: lahanKomoditas.jarakTanam,
          sistemTanam: lahanKomoditas.sistemTanam,

          tanggalPersemaian: rencanaTanam.tanggalPersemaian,
          tanggalTanam: rencanaTanam.tanggalTanam,
          perkiraanPanen: rencanaTanam.perkiraanPanen,
          siklusTanamHari: rencanaTanam.siklusTanamHari,
          metodeTanam: rencanaTanam.metodeTanam,
          kepadatanTanam: rencanaTanam.kepadatanTanam,
          irigasi: rencanaTanam.irigasi,
          sumberAir: rencanaTanam.sumberAir,
          catatan: catatanTambahan.catatan,

          detailRencanaTanam,
          personilList,
          peralatanList,
          dokumenList: docsToSave,
        };

        const res = await jadwalTanamService.createJadwalTanams(payload);
        toast.success(res.message || 'Jadwal tanam berhasil dibuat!');
        router.push('/produksi/jadwaltanam');
      } catch (err: any) {
        console.error('Error creating Jadwal Tanam:', err);
        toast.error(err.response?.data?.message || 'Gagal membuat jadwal tanam');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/produksi/jadwaltanam');
    }
  };

  return (
    <Fragment>
      <Pageheader
        title={meta.title}
        currentpage="Jadwal Tanam"
        activepage={meta.activePage}
        mainpage="Produksi"
        description={meta.description}
        customButton={
          <div className="flex items-center gap-2">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1"
              >
                <i className="ri-arrow-left-s-line text-sm"></i> Kembali
              </button>
            ) : (
              <button
                onClick={() => router.push('/produksi/jadwaltanam')}
                className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm"
              >
                Batal
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              {currentStep === 1 ? (
                <>
                  Simpan Jadwal <i className="ri-arrow-down-s-line text-xs"></i>
                </>
              ) : (
                <>
                  {meta.nextLabel}
                </>
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
            options={stats}
          />
        )}

        {currentStep === 2 && (
          <Step2LahanKomoditas
            options={stats}
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
            options={stats}
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
            options={stats}
            dataIU={informasiUmum}
            dataIL={informasiLahan}
            dataLK={lahanKomoditas}
            dataRT={rencanaTanam}
            detailList={detailRencanaTanam}
            personilList={personilList}
            setPersonilList={setPersonilList}
            peralatanList={peralatanList}
            setPeralatanList={setPeralatanList}
          />
        )}

        {currentStep === 5 && (
          <Step5ReviewKonfirmasi
            options={stats}
            dataIU={informasiUmum}
            dataIL={informasiLahan}
            dataLK={lahanKomoditas}
            dataRT={rencanaTanam}
            dataCT={catatanTambahan}
            detailList={detailRencanaTanam}
            personilList={personilList}
            peralatanList={peralatanList}
          />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-4 flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/produksi/jadwaltanam')}
          className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md transition-colors"
        >
          Batal
        </button>

        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
            >
              <i className="ri-arrow-left-s-line"></i> Kembali
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-[#078836] hover:bg-[#06732d] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shadow-sm transition-colors"
          >
            {meta.nextLabel}
          </button>
        </div>
      </div>
    </Fragment>
  );
}