import React, { useState, useRef, useEffect } from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import uploadService from '@/app/services/uploadService';
import { qcDayaTumbuhService } from '@/app/services/qcDayaTumbuhService';
import { batchProduksiService } from '@/app/services/batchProduksiService';
import ModalFooter from '../components/ModalFooter';
import SpkSelect from '@/shared/@spk-reusable-components/spk-packages/spk-reactselect';

import { qcService } from '@/app/services/qcService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  methods: any[];
  commodities: any[];
  varieties: any[];
}

export default function CreateDayaTumbuhModal({ isOpen, onClose, onSuccess, methods, commodities, varieties }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lampiranUrl, setLampiranUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [batchList, setBatchList] = useState<any[]>([]);
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false);
  const [batchSearchTerm, setBatchSearchTerm] = useState<string>('');
  const [allParameters, setAllParameters] = useState<any[]>([]);
  
  const [kodeBatch, setKodeBatch] = useState<string>('');
  const [commodityId, setCommodityId] = useState<string>('');
  const [varietyId, setVarietyId] = useState<string>('');
  const [lotNoBenih, setLotNoBenih] = useState<string>('LOT-A-001');
  const [jumlahSampel, setJumlahSampel] = useState<string>('');
  const [metodeUji, setMetodeUji] = useState<string>('');
  const [petugasUji, setPetugasUji] = useState<string>('Dewi Lestari');
  const [parameterResults, setParameterResults] = useState<Record<string, { hasilUji: number; status: string }>>({});

  useEffect(() => {
    if (isOpen) {
      qcService.getParameters().then(res => {
        setAllParameters(Array.isArray(res) ? res : res?.data || []);
      }).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setKodeBatch('');
      setCommodityId('');
      setVarietyId('');
      setBatchList([]);
      setBatchSearchTerm('');
      setParameterResults({});
      setLotNoBenih('');
      return;
    }

    const timer = setTimeout(async () => {
      setIsBatchLoading(true);
      try {
        const [batchRes, qcRes] = await Promise.all([
          batchProduksiService.getBatchProduksiList({ search: batchSearchTerm, limit: 100 }),
          qcDayaTumbuhService.getDayaTumbuh({ limit: 1000 })
        ]);

        if (batchRes?.data) {
          // Exclude batches that already have a QC Daya Tumbuh test
          const testedBatchCodes = (qcRes?.data || []).map((q: any) => q.kodeBatch);
          const filteredBatches = batchRes.data.filter((b: any) => !testedBatchCodes.includes(b.kodeBatch));

          const sortedData = [...filteredBatches].sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || a.tanggalMulai || 0).getTime();
            const dateB = new Date(b.createdAt || b.tanggalMulai || 0).getTime();
            return dateA - dateB;
          });
          setBatchList(sortedData);
        }
      } catch (err) {
        console.error("Failed to load batch list or QC data", err);
      } finally {
        setIsBatchLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [isOpen, batchSearchTerm]);

  const handleBatchChange = (selectedOption: any) => {
    const selectedKode = selectedOption ? selectedOption.value : '';
    setKodeBatch(selectedKode);

    // Auto-fill commodity and variety from selected batch
    const selectedBatch = batchList.find(b => b.kodeBatch === selectedKode);
    if (selectedBatch) {
      const matchedCommodity = commodities.find(c => c.id === selectedBatch.komoditas || c.namaKomoditas === selectedBatch.komoditas);
      if (matchedCommodity) setCommodityId(matchedCommodity.id);

      const matchedVariety = varieties.find(v => v.id === selectedBatch.varietas || v.namaVarietas === selectedBatch.varietas);
      if (matchedVariety) setVarietyId(matchedVariety.id);

      // Auto-fill Lot
      const computedLot = selectedBatch.batchLot?.kodeLot || `LOT-${selectedKode.replace('BP-', '')}`;
      setLotNoBenih(computedLot);
    } else {
      setCommodityId('');
      setVarietyId('');
      setLotNoBenih('');
    }
  };

  const [jumlahBenihDitanam, setJumlahBenihDitanam] = useState<string>('');
  const [jumlahBerkecambah, setJumlahBerkecambah] = useState<string>('');
  const [waktuUjiHari, setWaktuUjiHari] = useState<string>('');
  const [suhuUji, setSuhuUji] = useState<string>('');
  const [mediaUji, setMediaUji] = useState<string>('');
  const [kelembabanMedia, setKelembabanMedia] = useState<string>('');
  const [catatanTambahan, setCatatanTambahan] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadService.uploadFile(file, 'qc');
      if (res.success && res.data?.fileUrl) {
        setLampiranUrl(res.data.fileUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Gagal mengupload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const payload = {
        kodeBatch,
        commodityId: commodityId || null,
        varietyId: varietyId || null,
        metodeUji: metodeUji || null,
        tanggalUji: selectedDate,
        petugasUji,
        jumlahSampel: parseInt(jumlahSampel) || null,
        lampiranUrl,
        jumlahBenihDitanam: parseInt(jumlahBenihDitanam) || null,
        jumlahBerkecambah: parseInt(jumlahBerkecambah) || null,
        jumlahTidakBerkecambah: (parseInt(jumlahBenihDitanam) || 0) - (parseInt(jumlahBerkecambah) || 0),
        waktuUjiHari: parseInt(waktuUjiHari) || null,
        suhuUji: suhuUji || null,
        mediaUji: mediaUji || null,
        kelembabanMedia: kelembabanMedia|| null,
        catatan: catatanTambahan || null,
        parameterUji: JSON.stringify(Object.keys(parameterResults).map(id => {
          const p = allParameters.find(x => x.id === id);
          return {
             id,
             parameter: p?.nama,
             satuan: p?.satuan,
             batasAcuan: p?.batasAcuan,
             hasilUji: parameterResults[id].hasilUji,
             status: parameterResults[id].status
          };
        })),
      };

      const res = await qcDayaTumbuhService.createDayaTumbuh(payload);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h5 className="font-semibold text-lg">Buat Uji Daya Tumbuh</h5>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">

            {/* 1. Informasi Batch */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                Informasi Batch
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kode Batch / Lot <span className="text-danger">*</span></label>
                  <SpkSelect 
                    name="kodeBatch"
                    id="kodeBatch"
                    searchable={true}
                    isLoading={isBatchLoading}
                    onInputChange={(val: string) => setBatchSearchTerm(val)}
                    value={kodeBatch ? { value: kodeBatch, label: kodeBatch } : null}
                    onfunchange={handleBatchChange}
                    option={batchList?.map((b: any) => ({
                      value: b.kodeBatch,
                      label: `${b.kodeBatch} - ${b.komoditas}`
                    }))}
                    placeholder="Pilih Batch Produksi..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Komoditas</label>
                  <select 
                    className={`form-select text-sm h-[38px] w-full ${kodeBatch ? 'bg-gray-100 pointer-events-none' : ''}`}
                    value={commodityId} 
                    onChange={e => setCommodityId(e.target.value)}
                    disabled={!!kodeBatch}
                  >
                    <option value="">Pilih Komoditas...</option>
                    {commodities?.map(c => <option key={c.id} value={c.id}>{c.namaKomoditas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Varietas</label>
                  <select 
                    className={`form-select text-sm h-[38px] w-full ${kodeBatch ? 'bg-gray-100 pointer-events-none' : ''}`}
                    value={varietyId} 
                    onChange={e => setVarietyId(e.target.value)}
                    disabled={!!kodeBatch}
                  >
                    <option value="">Pilih Varietas...</option>
                    {varieties?.map(v => <option key={v.id} value={v.id}>{v.namaVarietas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lot / No. Benih</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full bg-gray-100" readOnly value={lotNoBenih} onChange={e => setLotNoBenih(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Sampel <span className="text-danger">*</span></label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="0" value={jumlahSampel} onChange={e => setJumlahSampel(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Metode Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={metodeUji} onChange={e => setMetodeUji(e.target.value)}>
                    <option value="">Pilih Metode Uji</option>
                    {methods?.map(m => (
                      <option key={m.id} value={m.kode}>{m.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Tanggal Uji <span className="text-danger">*</span></label>
                  <div className="relative">
                    <SpkDatepickr
                      className="form-control text-sm h-[38px] w-full"
                      placeholderText="Pilih Tanggal..."
                      selected={selectedDate}
                      onChange={(date: any) => setSelectedDate(date)}
                    />
                    <i className="ri-calendar-line absolute right-3 top-2.5 text-gray-400 pointer-events-none"></i>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Petugas Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={petugasUji} onChange={e => setPetugasUji(e.target.value)}>
                    <option value="Dewi Lestari">Dewi Lestari</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Parameter Uji */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</span>
                Parameter Uji
              </h6>
              <div className="border border-gray-100 rounded overflow-hidden">
                <table className="table whitespace-nowrap min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Parameter</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Satuan</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Batas Minimal</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Hasil Uji</th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const selectedMethod = methods?.find(m => m.kode === metodeUji || m.id === metodeUji);
                      let paramsToRender = (selectedMethod?.testParameters || allParameters?.filter(p => p.metodeId === selectedMethod?.id) || []);
                      
                      if (paramsToRender.length === 0) {
                        const defaultParamNames = ['daya tumbuh', 'kadar air', 'kemurnian', 'benih mati', 'benih lain'];
                        paramsToRender = allParameters?.filter(p => {
                          if (!p.nama) return false;
                          const pNama = p.nama.toLowerCase();
                          return defaultParamNames.some(d => pNama.includes(d));
                        }) || [];
                      }

                      if (paramsToRender.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="text-center text-sm py-4 text-gray-500">
                              {allParameters?.length === 0 ? 'Memuat parameter...' : 'Tidak ada parameter yang tersedia.'}
                            </td>
                          </tr>
                        );
                      }

                      return paramsToRender.map((param: any, i: number) => {
                        const result = parameterResults[param.id] || { hasilUji: '', status: 'Sedang Diuji' };
                        
                        const handleResultChange = (val: string) => {
                          const numVal = parseFloat(val);
                          let status = 'Sedang Diuji';
                          
                          if (!isNaN(numVal) && param.batasAcuan) {
                            if (param.batasAcuan.includes('>=')) {
                              const limit = parseFloat(param.batasAcuan.replace('>=', '').replace(',', '.').trim());
                              status = numVal >= limit ? 'Lulus' : 'Tidak Lulus';
                            } else if (param.batasAcuan.includes('<=')) {
                              const limit = parseFloat(param.batasAcuan.replace('<=', '').replace(',', '.').trim());
                              status = numVal <= limit ? 'Lulus' : 'Tidak Lulus';
                            } else if (param.batasAcuan.includes('>')) {
                              const limit = parseFloat(param.batasAcuan.replace('>', '').replace(',', '.').trim());
                              status = numVal > limit ? 'Lulus' : 'Tidak Lulus';
                            } else if (param.batasAcuan.includes('<')) {
                              const limit = parseFloat(param.batasAcuan.replace('<', '').replace(',', '.').trim());
                              status = numVal < limit ? 'Lulus' : 'Tidak Lulus';
                            }
                          }
                          
                          setParameterResults(prev => ({
                            ...prev,
                            [param.id]: { hasilUji: isNaN(numVal) ? 0 : numVal, status }
                          }));
                        };

                        return (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="text-sm py-2 px-4 font-medium">{param.nama}</td>
                            <td className="text-sm py-2 px-4 text-gray-500">{param.satuan || '-'}</td>
                            <td className="text-sm py-2 px-4">{param.batasAcuan || '-'}</td>
                            <td className="text-sm py-2 px-4 w-48">
                              <input 
                                type="number" 
                                className="form-control text-sm py-1" 
                                placeholder="0.00"
                                value={result.hasilUji}
                                onChange={(e) => handleResultChange(e.target.value)}
                              />
                            </td>
                            <td className="text-sm py-2 px-4">
                              <span className={`badge ${result.status === 'Lulus' ? 'bg-success/10 text-success' : result.status === 'Tidak Lulus' ? 'bg-danger/10 text-danger' : 'bg-gray-100 text-gray-500'}`}>
                                {result.status}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Detail Pengujian */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
                Detail Pengujian
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Benih Ditanam</label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="0" value={jumlahBenihDitanam} onChange={e => setJumlahBenihDitanam(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Berkecambah</label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="0" value={jumlahBerkecambah} onChange={e => setJumlahBerkecambah(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Tidak Berkecambah</label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0 bg-gray-100" placeholder="0" readOnly value={(parseInt(jumlahBenihDitanam) || 0) - (parseInt(jumlahBerkecambah) || 0)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Waktu Uji (Hari)</label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="0" value={waktuUjiHari} onChange={e => setWaktuUjiHari(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Hari</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Suhu Uji</label>
                  <div className="flex">
                    <input type="text" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="Contoh: 25 ± 2" value={suhuUji} onChange={e => setSuhuUji(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">°C</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Media Uji</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: Kertas Merang" value={mediaUji} onChange={e => setMediaUji(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kelembaban Media</label>
                  <div className="flex">
                    <input type="text" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="Contoh: 70 - 80" value={kelembabanMedia} onChange={e => setKelembabanMedia(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">%</span>
                  </div>
                </div>
                <div className="md:col-span-4">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Catatan Tambahan</label>
                  <textarea className="form-control text-sm h-[38px] w-full" rows={2} placeholder="Tuliskan catatan (opsional)" value={catatanTambahan} onChange={e => setCatatanTambahan(e.target.value)}></textarea>
                </div>
              </div>
            </div>

            {/* 4. Lampiran */}
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
                Lampiran Foto / Dokumen Pendukung
              </h6>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.pdf"
              />

              <div
                className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${lampiranUrl ? 'border-primary/50 bg-primary/5' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm font-semibold">Mengupload...</p>
                  </div>
                ) : lampiranUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                      <i className="ri-check-line text-2xl"></i>
                    </div>
                    <p className="text-sm font-semibold mb-1 text-primary">File berhasil diupload</p>
                    <a href={lampiranUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Lihat File</a>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                      <i className="ri-upload-cloud-2-line text-2xl"></i>
                    </div>
                    <p className="text-sm font-semibold mb-1">Klik untuk upload atau drag and drop</p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG, JPEG atau PDF (MAX. 5MB)</p>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <ModalFooter
          onCancel={onClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isDisabled={isUploading}
          submitText="Simpan Hasil Uji"
        />
      </div>
    </div>
  );
}
