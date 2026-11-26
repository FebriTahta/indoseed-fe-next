import React, { useState } from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';

export default function DownloadCertificateModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [options, setOptions] = useState({
    qrCode: true,
    signature: true,
    watermark: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#f8f9fa] rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] flex overflow-hidden relative">
        
        {/* LEFT PANEL: Options */}
        <div className="w-1/3 bg-white flex flex-col h-full border-r border-gray-100 z-10 relative">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h4 className="text-lg font-bold">Download Sertifikat</h4>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 block md:hidden">
               <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <p className="text-sm text-gray-500 mb-4">Pilih format file yang ingin diunduh</p>
            
            <div className="space-y-3 mb-6">
               <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedFormat === 'pdf' ? 'border-success bg-success/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="format" className="form-radio text-success mt-1 mr-3" checked={selectedFormat === 'pdf'} onChange={() => setSelectedFormat('pdf')} />
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <i className="ri-file-pdf-2-line text-danger text-xl"></i>
                        <span className="font-semibold text-sm">PDF (Siap Cetak)</span>
                     </div>
                     <p className="text-[11px] text-gray-500 mt-1 mb-0 ml-7">Format PDF dengan kualitas tinggi untuk dicetak</p>
                  </div>
                  {selectedFormat === 'pdf' && <i className="ri-checkbox-circle-fill text-success text-lg"></i>}
               </label>
               
               <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedFormat === 'png' ? 'border-success bg-success/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="format" className="form-radio text-success mt-1 mr-3" checked={selectedFormat === 'png'} onChange={() => setSelectedFormat('png')} />
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <i className="ri-image-line text-success text-xl"></i>
                        <span className="font-semibold text-sm">PNG (Gambar)</span>
                     </div>
                     <p className="text-[11px] text-gray-500 mt-1 mb-0 ml-7">Format gambar untuk keperluan digital</p>
                  </div>
                  {selectedFormat === 'png' && <i className="ri-checkbox-circle-fill text-success text-lg"></i>}
               </label>
               
               <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedFormat === 'jpg' ? 'border-success bg-success/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="format" className="form-radio text-success mt-1 mr-3" checked={selectedFormat === 'jpg'} onChange={() => setSelectedFormat('jpg')} />
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <i className="ri-image-fill text-warning text-xl"></i>
                        <span className="font-semibold text-sm">JPG (Gambar)</span>
                     </div>
                     <p className="text-[11px] text-gray-500 mt-1 mb-0 ml-7">Format gambar dengan ukuran lebih kecil</p>
                  </div>
                  {selectedFormat === 'jpg' && <i className="ri-checkbox-circle-fill text-success text-lg"></i>}
               </label>

               <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedFormat === 'excel' ? 'border-success bg-success/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="format" className="form-radio text-success mt-1 mr-3" checked={selectedFormat === 'excel'} onChange={() => setSelectedFormat('excel')} />
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <i className="ri-file-excel-2-line text-blue-500 text-xl"></i>
                        <span className="font-semibold text-sm">Excel (Data Uji)</span>
                     </div>
                     <p className="text-[11px] text-gray-500 mt-1 mb-0 ml-7">Export data hasil uji dalam format Excel</p>
                  </div>
                  {selectedFormat === 'excel' && <i className="ri-checkbox-circle-fill text-success text-lg"></i>}
               </label>
            </div>

            <h5 className="font-semibold text-sm mb-3">Opsi Tambahan</h5>
            <div className="space-y-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-success rounded" checked={options.qrCode} onChange={(e) => setOptions({...options, qrCode: e.target.checked})} />
                  <span className="text-sm">Sertakan QR Code</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-success rounded" checked={options.signature} onChange={(e) => setOptions({...options, signature: e.target.checked})} />
                  <span className="text-sm">Sertakan Tanda Tangan Digital</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="form-checkbox text-success rounded" checked={options.watermark} onChange={(e) => setOptions({...options, watermark: e.target.checked})} />
                  <span className="text-sm">Sertakan Watermark "SALINAN"</span>
               </label>
            </div>

          </div>

          <div className="p-5 border-t border-gray-100 flex justify-between gap-3 bg-white mt-auto">
             <SpkButton variant="light" onclickfunc={onClose} customClass="w-1/2">Batal</SpkButton>
             <SpkButton variant="primary" customClass="w-1/2 bg-[#1B4E3B]"><i className="ri-download-2-line mr-1"></i> Download</SpkButton>
          </div>
        </div>

        {/* RIGHT PANEL: Preview */}
        <div className="w-2/3 bg-[#323639] h-full flex flex-col relative overflow-hidden">
           {/* Top bar like PDF viewer */}
           <div className="h-12 bg-[#323639] border-b border-[#434749] flex items-center justify-between px-4 text-white shrink-0">
              <div className="text-sm font-medium truncate max-w-[200px]">Sertifikat_QC_QC-2026-0001.pdf</div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-sm">
                    <span className="opacity-70">1 / 1</span>
                    <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
                    <button className="hover:bg-white/10 p-1 rounded"><i className="ri-subtract-line"></i></button>
                    <span>100%</span>
                    <button className="hover:bg-white/10 p-1 rounded"><i className="ri-add-line"></i></button>
                 </div>
                 <div className="flex gap-2">
                    <button className="hover:bg-white/10 p-1.5 rounded-full"><i className="ri-download-line text-lg"></i></button>
                    <button className="hover:bg-white/10 p-1.5 rounded-full"><i className="ri-printer-line text-lg"></i></button>
                    <button className="hover:bg-white/10 p-1.5 rounded-full"><i className="ri-more-2-fill text-lg"></i></button>
                    <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-full ml-2"><i className="ri-close-line text-lg"></i></button>
                 </div>
              </div>
           </div>

           {/* Preview Container */}
           <div className="flex-1 overflow-auto p-8 flex justify-center custom-scrollbar">
              
              {/* Paper A4 */}
              <div className="bg-white w-[700px] h-fit min-h-[900px] shadow-2xl relative">
                 {/* Border pattern */}
                 <div className="absolute inset-4 border-[3px] border-[#1B4E3B] flex">
                    <div className="absolute inset-1 border-[1px] border-[#1B4E3B]"></div>
                    {/* Corner accents */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-[4px] border-l-[4px] border-[#1B4E3B] bg-white"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-[4px] border-r-[4px] border-[#1B4E3B] bg-white"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-[4px] border-l-[4px] border-[#1B4E3B] bg-white"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-[4px] border-r-[4px] border-[#1B4E3B] bg-white"></div>
                 </div>

                 {/* Content */}
                 <div className="absolute inset-10 flex flex-col pt-8">
                    
                    {/* Header COA */}
                    <div className="flex justify-between items-start mb-8 border-b-2 border-[#1B4E3B] pb-6">
                       <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-[#1B4E3B] flex items-center justify-center rounded-lg mb-2">
                             <i className="ri-leaf-fill text-white text-3xl"></i>
                          </div>
                          <span className="font-bold text-[#1B4E3B] text-lg tracking-wider">SI BENIH</span>
                       </div>
                       <div className="text-center flex-1 mt-2">
                          <h2 className="text-2xl font-bold text-[#1B4E3B] tracking-wide m-0">SERTIFIKAT QUALITY CONTROL</h2>
                          <h3 className="text-lg font-semibold text-[#1B4E3B] mb-2">(CERTIFICATE OF ANALYSIS)</h3>
                          <p className="font-semibold text-gray-800 m-0">No. Sertifikat : QC-2026-0001</p>
                       </div>
                       <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border border-gray-300">
                          {options.qrCode ? (
                             <i className="ri-qr-code-line text-5xl text-gray-800"></i>
                          ) : (
                             <span className="text-[10px] text-gray-400">No QR</span>
                          )}
                       </div>
                    </div>

                    <div className="text-center mb-8 px-8">
                       <p className="text-[13px] leading-relaxed mb-1">
                          Sertifikat ini menyatakan bahwa benih di bawah ini telah diuji dan memenuhi standar mutu yang ditetapkan.
                       </p>
                       <p className="text-[11px] text-gray-500 italic">
                          This is to certify that the seed lot described below has been tested and complies with the required quality standards.
                       </p>
                    </div>

                    {/* Info Table Layout */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-8 text-[13px] px-4">
                       <div className="grid grid-cols-[120px_10px_1fr]">
                          <span className="font-semibold">Kode Batch</span><span>:</span><span>QC-2606-0001</span>
                          <span className="font-semibold">Komoditas</span><span>:</span><span>Padi</span>
                          <span className="font-semibold">Varietas</span><span>:</span><span>Inpari 32</span>
                          <span className="font-semibold">Lot / No. Benih</span><span>:</span><span>LOT-2606-001</span>
                          <span className="font-semibold">Tanggal Panen</span><span>:</span><span>10 Juni 2026</span>
                          <span className="font-semibold">Tanggal Pengujian</span><span>:</span><span>11 Juni 2026</span>
                          <span className="font-semibold">Metode Uji</span><span>:</span><span>ISTA 5.2.1</span>
                          <span className="font-semibold">Laboratorium</span><span>:</span><span>Lab. Benih Utama</span>
                       </div>
                       <div className="grid grid-cols-[130px_10px_1fr]">
                          <span className="font-semibold">Tanggal Terbit</span><span>:</span><span>12 Juni 2026</span>
                          <span className="font-semibold">Berlaku Hingga</span><span>:</span><span>12 Desember 2026</span>
                          <span className="font-semibold">Penerbit Sertifikat</span><span>:</span><span>SI BENIH - Quality Control</span>
                          <span className="font-semibold self-start">Alamat Laboratorium</span><span className="self-start">:</span><span className="leading-tight">Jl. Raya Benih No. 88<br/>Bogor, Jawa Barat</span>
                          <span className="font-semibold mt-2">Email</span><span className="mt-2">:</span><span className="mt-2">qc@sibenih.id</span>
                          <span className="font-semibold">Telepon</span><span>:</span><span>(0251) 1234 567</span>
                       </div>
                    </div>

                    {/* Data Table */}
                    <div className="px-4 mb-6">
                       <table className="w-full border-collapse border border-[#1B4E3B] text-[13px]">
                          <thead>
                             <tr className="bg-[#1B4E3B]/5 border-b border-[#1B4E3B]">
                                <th className="border-r border-[#1B4E3B] py-2 px-3 text-left">Parameter Uji</th>
                                <th className="border-r border-[#1B4E3B] py-2 px-3">Satuan</th>
                                <th className="border-r border-[#1B4E3B] py-2 px-3">Hasil Uji</th>
                                <th className="border-r border-[#1B4E3B] py-2 px-3">Batas Standar<br/><span className="text-[10px] font-normal">(ISTA / SNI)</span></th>
                                <th className="py-2 px-3">Status</th>
                             </tr>
                          </thead>
                          <tbody className="text-center">
                             <tr className="border-b border-[#1B4E3B]">
                                <td className="border-r border-[#1B4E3B] py-2 px-3 text-left">Daya Tumbuh</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">%</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">92</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">≥ 80 %</td>
                                <td className="py-2 px-3 text-success font-semibold">Memenuhi</td>
                             </tr>
                             <tr className="border-b border-[#1B4E3B]">
                                <td className="border-r border-[#1B4E3B] py-2 px-3 text-left">Kadar Air</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">%</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">10,2</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">≤ 12 %</td>
                                <td className="py-2 px-3 text-success font-semibold">Memenuhi</td>
                             </tr>
                             <tr className="border-b border-[#1B4E3B]">
                                <td className="border-r border-[#1B4E3B] py-2 px-3 text-left">Kemurnian</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">%</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">99,2</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">≥ 98 %</td>
                                <td className="py-2 px-3 text-success font-semibold">Memenuhi</td>
                             </tr>
                             <tr className="border-b border-[#1B4E3B]">
                                <td className="border-r border-[#1B4E3B] py-2 px-3 text-left">Benih Mati</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">%</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">1,0</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">≤ 2 %</td>
                                <td className="py-2 px-3 text-success font-semibold">Memenuhi</td>
                             </tr>
                             <tr>
                                <td className="border-r border-[#1B4E3B] py-2 px-3 text-left">Benih Lain (Other Seed)</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">%</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">0,3</td>
                                <td className="border-r border-[#1B4E3B] py-2 px-3">≤ 0,5 %</td>
                                <td className="py-2 px-3 text-success font-semibold">Memenuhi</td>
                             </tr>
                          </tbody>
                       </table>
                    </div>

                    <div className="px-4 text-[11px] text-gray-600 mb-8 flex-1">
                       <p className="font-semibold mb-1 text-black">Catatan :</p>
                       <ol className="list-decimal pl-4 m-0 space-y-1">
                          <li>Hasil uji hanya berlaku untuk contoh benih yang diuji.</li>
                          <li>Sertifikat ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah.</li>
                       </ol>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-end px-12 pb-8">
                       <div className="text-center relative">
                          <p className="text-[13px] mb-2">Disetujui oleh,</p>
                          
                          <div className="h-20 w-48 relative flex items-center justify-center">
                             {/* Stamp */}
                             <div className="absolute -left-12 opacity-80 border-[3px] border-[#1B4E3B] text-[#1B4E3B] w-24 h-24 rounded-full flex flex-col items-center justify-center transform -rotate-12">
                                <i className="ri-leaf-fill text-2xl mb-1"></i>
                                <span className="text-[10px] font-bold tracking-widest text-center leading-tight border-t border-b border-[#1B4E3B] w-full">SI BENIH<br/>QUALITY CONTROL</span>
                             </div>
                             
                             {/* Signature */}
                             {options.signature && (
                               <div className="text-3xl font-serif italic text-gray-800">Dewi Lestari</div>
                             )}
                          </div>
                          
                          <p className="text-[13px] font-bold underline mb-0 mt-2">Dewi Lestari, S.TP.</p>
                          <p className="text-[12px]">Quality Control Manager</p>
                       </div>
                    </div>

                    {/* Watermark overlay if selected */}
                    {options.watermark && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                        <span className="text-9xl font-bold transform -rotate-45 text-red-500 tracking-widest">SALINAN</span>
                      </div>
                    )}
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
