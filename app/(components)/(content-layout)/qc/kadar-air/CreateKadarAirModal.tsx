import React, { useState, useRef } from 'react';
import SpkDatepickr from "@/shared/@spk-reusable-components/spk-packages/datepicker-component";
import uploadService from '@/app/services/uploadService';
import { qcKadarAirService } from '@/app/services/qcKadarAirService';
import ModalFooter from '../components/ModalFooter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  methods: any[];
  commodities: any[];
  varieties: any[];
}

export default function CreateKadarAirModal({ isOpen, onClose, onSuccess, methods, commodities, varieties }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lampiranUrl, setLampiranUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [kodeBatch, setKodeBatch] = useState<string>(`QC-${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [commodityId, setCommodityId] = useState<string>('');
  const [varietyId, setVarietyId] = useState<string>('');
  const [lotNumber, setLotNumber] = useState<string>('LOT-A-001');
  const [jumlahSampel, setJumlahSampel] = useState<string>('');
  const [testMethodId, setTestMethodId] = useState<string>('');
  const [lokasiLab, setLokasiLab] = useState<string>('Lab Pusat');
  const [petugasUji, setPetugasUji] = useState<string>('Dewi Lestari');
  
  const [kadarAir, setKadarAir] = useState<string>('');
  const [batasMaksimal, setBatasMaksimal] = useState<string>('');
  const [alat, setAlat] = useState<string>('');
  const [suhuUji, setSuhuUji] = useState<string>('');
  const [waktuPengeringan, setWaktuPengeringan] = useState<string>('');
  const [ulangan, setUlangan] = useState<string>('');
  const [beratAwal, setBeratAwal] = useState<string>('');
  const [beratAkhir, setBeratAkhir] = useState<string>('');
  const [catatan, setCatatan] = useState<string>('');

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
        testMethodId: testMethodId || null,
        lotNumber,
        tanggalUji: selectedDate,
        lokasiLab,
        petugasUji,
        jumlahSampel: parseInt(jumlahSampel) || null,
        lampiranUrl,
        kadarAir: parseFloat(kadarAir) || null,
        batasMaksimal: parseFloat(batasMaksimal) || null,
        alat: alat || null,
        suhuUji: suhuUji || null,
        waktuPengeringan: waktuPengeringan || null,
        ulangan: ulangan || null,
        beratAwal: parseFloat(beratAwal) || null,
        beratAkhir: parseFloat(beratAkhir) || null,
        catatan: catatan || null,
      };

      const res = await qcKadarAirService.createKadarAir(payload);
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
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h5 className="font-semibold text-lg">Buat Uji Baru - Kadar Air</h5>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            
            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</span>
                Informasi Batch
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Kode Batch / Lot <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="form-control text-sm h-[38px] w-full" 
                    value={kodeBatch} 
                    onChange={e => setKodeBatch(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Komoditas <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={commodityId} onChange={e => setCommodityId(e.target.value)}>
                    <option value="">Pilih komoditas</option>
                    {commodities?.map(c => <option key={c.id} value={c.id}>{c.namaKomoditas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Varietas <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={varietyId} onChange={e => setVarietyId(e.target.value)}>
                    <option value="">Pilih varietas</option>
                    {varieties?.map(v => <option key={v.id} value={v.id}>{v.namaVarietas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lot / No. Benih <span className="text-danger">*</span></label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" value={lotNumber} onChange={e => setLotNumber(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Jumlah Sampel <span className="text-danger">*</span></label>
                  <div className="flex">
                    <input type="number" className="form-control text-sm h-[38px] w-full rounded-r-none border-r-0" placeholder="0" value={jumlahSampel} onChange={e => setJumlahSampel(e.target.value)} />
                    <span className="inline-flex items-center px-3 h-[38px] text-sm text-gray-900 bg-gray-100 border border-l-0 border-gray-200 rounded-r-md">Butir</span>
                  </div>
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
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lokasi / Lab <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={lokasiLab} onChange={e => setLokasiLab(e.target.value)}>
                    <option value="Lab Pusat">Lab Pusat</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Petugas Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={petugasUji} onChange={e => setPetugasUji(e.target.value)}>
                    <option value="Dewi Lestari">Dewi Lestari</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Metode Uji <span className="text-danger">*</span></label>
                  <select className="form-select text-sm h-[38px] w-full" value={testMethodId} onChange={e => setTestMethodId(e.target.value)}>
                    <option value="">Pilih Metode Uji</option>
                    {methods?.map(m => (
                      <option key={m.id} value={m.id}>{m.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

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
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Batas Maksimal <span className="text-danger">*</span></th>
                      <th className="text-left text-xs font-semibold text-gray-500 py-2 px-4">Hasil Uji (%) <span className="text-danger">*</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="text-sm py-2 px-4 font-medium">Kadar Air</td>
                      <td className="text-sm py-2 px-4 text-gray-500">%</td>
                      <td className="text-sm py-2 px-4 w-48">
                        <input type="number" className="form-control text-sm py-1" placeholder="0.00" value={batasMaksimal} onChange={(e) => setBatasMaksimal(e.target.value)} />
                      </td>
                      <td className="text-sm py-2 px-4 w-48">
                        <input type="number" className="form-control text-sm py-1" placeholder="0.00" value={kadarAir} onChange={(e) => setKadarAir(e.target.value)} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</span>
                Detail Pengujian
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Alat / Instrumen</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: Oven Memmert UN55" value={alat} onChange={e => setAlat(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Suhu Uji (°C)</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 105 ± 3" value={suhuUji} onChange={e => setSuhuUji(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Waktu Pengeringan</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 17 jam" value={waktuPengeringan} onChange={e => setWaktuPengeringan(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Ulangan</label>
                  <input type="text" className="form-control text-sm h-[38px] w-full" placeholder="Contoh: 2 kali" value={ulangan} onChange={e => setUlangan(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Berat Awal (g) (Opsional)</label>
                  <input type="number" className="form-control text-sm h-[38px] w-full" placeholder="0" value={beratAwal} onChange={e => setBeratAwal(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Berat Akhir (g) (Opsional)</label>
                  <input type="number" className="form-control text-sm h-[38px] w-full" placeholder="0" value={beratAkhir} onChange={e => setBeratAkhir(e.target.value)} />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Catatan (Opsional)</label>
                  <textarea className="form-control text-sm h-[38px] w-full" rows={2} placeholder="Tambahkan catatan jika diperlukan..." value={catatan} onChange={e => setCatatan(e.target.value)}></textarea>
                </div>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">4</span>
                Lampiran (Opsional)
              </h6>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".svg,.png,.jpg,.jpeg,.pdf,.xlsx"
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
                    <p className="text-sm font-semibold mb-1">Drag & drop file di sini atau klik untuk memilih file</p>
                    <p className="text-xs text-gray-500">Format yang didukung: JPG, PNG, PDF, XLSX (Maks. 10 MB)</p>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        <ModalFooter 
          onCancel={onClose} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          isDisabled={isUploading} 
          submitText="Simpan & Proses Hasil" 
        />
      </div>
    </div>
  );
}
