import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const SpkLeaflet = dynamic<any>(
  () => import('@/shared/@spk-reusable-components/spk-packages/spk-leaflet'),
  { ssr: false }
);

interface Step2Props {
  options?: any;
  dataLK?: any;
  dataIL?: any;
  dataRT?: any;
  onChangeLK?: (field: string, val: any) => void;
  onChangeIL?: (field: string, val: any) => void;
  onChangeRT?: (field: string, val: any) => void;
}

export default function Step2LahanKomoditas({ options, dataLK, dataIL, dataRT, onChangeLK, onChangeIL, onChangeRT }: Step2Props) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedLandId = dataLK?.idLahan || '';
  const landsList = options?.lahanKomoOption?.lands || [];
  const selectedLand = landsList.find(
    (l: any) => l.id === selectedLandId || l.kodeLahan === selectedLandId || l.namaLahan === selectedLandId
  );

  const petaUrl = selectedLand?.image || '';
  const petaFileName = petaUrl ? (petaUrl.split('/').pop() || '') : '';
  const isPdf = petaUrl ? petaUrl.toLowerCase().endsWith('.pdf') : false;

  const riwayatLahan: any[] = [];

  const currentCoord = dataIL?.koordinat || selectedLand?.koordinat || '-7.123456, 112.123456';
  const currentLuas = dataLK?.luasTanam ? Number(dataLK.luasTanam) : (selectedLand?.luas || 5.0);
  const blockLuas = (currentLuas / 4).toFixed(2);

  const parseLatLng = (coordStr: string): [number, number] => {
    if (!coordStr) return [-7.123456, 112.123456];
    const parts = coordStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
    return [-7.123456, 112.123456];
  };

  const mapPosition = parseLatLng(currentCoord);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column (8 cols on xl) */}
      <div className="xl:col-span-8 col-span-12 space-y-6">

        {/* Section A: Informasi Lahan */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">A. Informasi Lahan</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Lahan <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.idLahan || dataLK?.namaLahan || ''}
                onChange={(e) => {
                  if (onChangeLK) {
                    const selectedOpt = options?.lahanKomoOption?.lahan?.find((opt: any) => opt.value === e.target.value || opt.label === e.target.value);
                    onChangeLK('idLahan', e.target.value);
                    if (selectedOpt) onChangeLK('namaLahan', selectedOpt.label);
                  }
                }}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="">Pilih Lahan</option>
                {options?.lahanKomoOption?.lahan?.map((opt: any, idx: number) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Luas Tanam <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataLK?.luasTanam || ''}
                  onChange={(e) => onChangeLK && onChangeLK('luasTanam', e.target.value)}
                  placeholder="5,00"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">Ha</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Status Lahan <span className="text-red-500">*</span></label>
              <select
                value={dataIL?.statusLahan || 'Milik Sendiri'}
                onChange={(e) => onChangeIL && onChangeIL('statusLahan', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Sewa">Sewa</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Tipe Lahan <span className="text-red-500">*</span></label>
              <select
                value={dataIL?.tipeLahan || 'Lahan Terbuka'}
                onChange={(e) => onChangeIL && onChangeIL('tipeLahan', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Lahan Terbuka">Lahan Terbuka</option>
                <option value="Greenhouse">Greenhouse</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Koordinat Lahan (GPS)</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataIL?.koordinat || ''}
                  onChange={(e) => onChangeIL && onChangeIL('koordinat', e.target.value)}
                  placeholder="-7.123456, 112.123456"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full"
                />
                <i className="ri-map-pin-line absolute right-2.5 text-gray-400 text-sm"></i>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Ketinggian</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataIL?.ketinggian || ''}
                  onChange={(e) => onChangeIL && onChangeIL('ketinggian', e.target.value)}
                  placeholder="450"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-10 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">mdpl</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Jenis Tanah</label>
              <select
                value={dataIL?.jenisTanah || 'Latosol'}
                onChange={(e) => onChangeIL && onChangeIL('jenisTanah', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Latosol">Latosol</option>
                <option value="Aluvial">Aluvial</option>
                <option value="Grumosol">Grumosol</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">pH Tanah</label>
              <input
                type="text"
                value={dataIL?.phTanah || ''}
                onChange={(e) => onChangeIL && onChangeIL('phTanah', e.target.value)}
                placeholder="6.2"
                className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Sumber Air</label>
              <select
                value={dataRT?.sumberAir || dataIL?.sumberAir || 'Sumur Bor'}
                onChange={(e) => {
                  if (onChangeRT) onChangeRT('sumberAir', e.target.value);
                  if (onChangeIL) onChangeIL('sumberAir', e.target.value);
                }}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Sumur Bor">Sumur Bor</option>
                <option value="Sungai">Sungai</option>
                <option value="Irigasi Teknis">Irigasi Teknis</option>
                <option value="Waduk / Embung">Waduk / Embung</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Jarak ke Sumber Air <span className="text-red-500">*</span></label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={dataIL?.jarakSumberAir || ''}
                  onChange={(e) => onChangeIL && onChangeIL('jarakSumberAir', e.target.value)}
                  placeholder="120"
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 pr-8 text-gray-700 w-full"
                />
                <span className="absolute right-3 text-xs text-gray-500 font-medium">m</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Sistem Irigasi</label>
              <select
                value={dataRT?.irigasi || dataIL?.sistemIrigasi || 'Irigasi Terjadwal'}
                onChange={(e) => {
                  if (onChangeRT) onChangeRT('irigasi', e.target.value);
                  if (onChangeIL) onChangeIL('sistemIrigasi', e.target.value);
                }}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Irigasi Terjadwal">Irigasi Terjadwal</option>
                <option value="Irigasi Otomatis">Irigasi Otomatis</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Ketersediaan Air <span className="text-red-500">*</span></label>
              <select
                value={dataIL?.ketersediaanAir || 'Baik'}
                onChange={(e) => onChangeIL && onChangeIL('ketersediaanAir', e.target.value)}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="Baik">Baik</option>
                <option value="Cukup">Cukup</option>
                <option value="Kurang">Kurang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Peta & Layout Lahan */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Peta & Layout Lahan</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: PDF / Image File Card */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">Peta Lahan</label>
              {petaUrl ? (
                <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-10 h-10 rounded ${isPdf ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center font-bold text-xs shrink-0`}>
                      {isPdf ? 'PDF' : 'IMG'}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-gray-800 mb-0 truncate" title={petaFileName}>
                        {petaFileName}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {selectedLand?.namaLahan ? `Lahan: ${selectedLand.namaLahan}` : 'Dokumen Peta Lahan'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-1 transition-colors"
                    >
                      <i className="ri-eye-line text-xs"></i> Lihat
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-3 bg-gray-50/50 text-gray-500">
                  <div className="w-10 h-10 rounded bg-gray-200 text-gray-400 flex items-center justify-center shrink-0">
                    <i className="ri-image-off-line text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-0 leading-tight">Tidak ada preview lahan atau greenhouse</p>
                    <span className="text-[10px] text-gray-400">File peta/layout belum diunggah untuk lahan ini</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Layout Blok Lahan overlaid on SpkLeaflet map based on GPS coordinates */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">Layout Blok Lahan</label>
              <div className="relative border border-gray-300 rounded-lg overflow-hidden h-36 bg-gray-900 shadow-sm [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full">
                {/* SpkLeaflet component rendered dynamically */}
                <SpkLeaflet
                  position={mapPosition}
                  Zoom={15}
                  scrollWheel={false}
                  Customclass="h-36 w-full rounded-lg"
                  Id="leaflet-map-lahan"
                />

              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Penggunaan Lahan */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Riwayat Penggunaan Lahan (3 Tahun Terakhir)</h3>

          <div className="table-responsive">
            <table className="table whitespace-nowrap min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-semibold">
                  <th className="p-2.5 text-start">Tahun</th>
                  <th className="p-2.5 text-start">Komoditas</th>
                  <th className="p-2.5 text-start">Luas (Ha)</th>
                  <th className="p-2.5 text-start">Tanggal Tanam</th>
                  <th className="p-2.5 text-start">Tanggal Panen</th>
                  <th className="p-2.5 text-start">Hasil Produksi</th>
                  <th className="p-2.5 text-start">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {riwayatLahan.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                        <i className="ri-history-line text-2xl text-gray-300"></i>
                        <span className="text-xs text-gray-500 font-medium">Tidak ada riwayat penggunaan lahan</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  riwayatLahan.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2.5 font-bold text-gray-800">{r.tahun}</td>
                      <td className="p-2.5">{r.komoditas}</td>
                      <td className="p-2.5">{r.luas}</td>
                      <td className="p-2.5">{r.tglTanam}</td>
                      <td className="p-2.5">{r.tglPanen}</td>
                      <td className="p-2.5">{r.hasil}</td>
                      <td className="p-2.5 text-gray-500">{r.catatan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catatan ISO Alert */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <i className="ri-shield-check-line text-lg"></i>
            </div>
            <div>
              <h6 className="text-xs font-bold text-blue-900 mb-1">Catatan ISO</h6>
              <p className="text-xs text-blue-800 leading-relaxed mb-0">
                Pastikan lahan bebas dari kontaminasi, memiliki riwayat budidaya yang baik, dan memenuhi persyaratan isolasi sesuai standar sertifikasi benih.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column (4 cols on xl) */}
      <div className="xl:col-span-4 col-span-12 space-y-6">
        {/* Section B: Komoditas & Varietas */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">B. Komoditas & Varietas</h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Komoditas <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.komoditas || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = options?.lahanKomoOption?.komoditas?.find((opt: any) => opt.value === val);
                  if (onChangeLK) {
                    onChangeLK('komoditas', val);
                    if (found) onChangeLK('namaKomoditas', found.label);
                  }
                }}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="">Pilih Komoditas</option>
                {options?.lahanKomoOption?.komoditas?.map((opt: any, idx: number) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Varietas <span className="text-red-500">*</span></label>
              <select
                value={dataLK?.varietas || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = options?.lahanKomoOption?.varietas?.find((opt: any) => opt.value === val);
                  const foundAll = options?.lahanKomoOption?.allVarietas?.find((v: any) => v.kodeVarietas === val || v.id === val);
                  const labelName = found?.label || foundAll?.namaVarietas || val;
                  if (onChangeLK) {
                    onChangeLK('varietas', val);
                    if (labelName) onChangeLK('namaVarietas', labelName);
                  }
                }}
                className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
              >
                <option value="">Pilih Varietas</option>
                {options?.lahanKomoOption?.varietas?.map((opt: any, idx: number) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Kelas Benih yang Dihasilkan <span className="text-red-500">*</span></label>
              <select className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white">
                <option>Benih Bersertifikat (SS)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 block">Sumber Benih <span className="text-red-500">*</span></label>
              <select className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white mb-1">
                <option>BP-2505-001 - Gudang Benih</option>
              </select>
              <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200/60">
                Stok Tersedia: 1.250 Kg
              </span>
            </div>

            {/* Informasi Varietas Box */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-4 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-900 text-xs mb-2">Informasi Varietas</h4>
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Varietas</span>
                <span className="font-bold text-gray-800">{dataLK?.namaVarietas || dataLK?.varietas || 'Pilih Varietas'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Umur Panen</span>
                <span className="font-medium text-gray-800">± 115 hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Potensi Hasil</span>
                <span className="font-medium text-gray-800">7,2 Ton/Ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ketahanan</span>
                <span className="font-medium text-gray-800">Tahan Hawar Daun (HDB)</span>
              </div>
              <div>
                <span className="text-gray-600 block mb-0.5">Deskripsi</span>
                <span className="text-gray-700 leading-relaxed block text-[11px]">
                  Varietas unggul, hasil tinggi, dan cocok untuk produksi benih bersertifikat.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Persyaratan Isolasi */}
        <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-gray-800 pb-2 border-b border-gray-100 mb-1">Persyaratan Isolasi</h3>

          <div className="flex justify-between py-1">
            <span className="text-gray-600">Jarak Isolasi Minimal</span>
            <span className="font-bold text-gray-800">3 meter</span>
          </div>

          <div className="flex justify-between py-1 border-t border-gray-100">
            <span className="text-gray-600">Tanaman Sekeliling</span>
            <span className="font-bold text-gray-800">Jagung</span>
          </div>

          <div className="flex justify-between py-1 border-t border-gray-100">
            <span className="text-gray-600">Jarak Tanaman</span>
            <span className="font-bold text-gray-800">&gt; 3 meter</span>
          </div>

          {/* Status Kepatuhan Banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-3 flex items-start gap-2.5 mt-2">
            <i className="ri-checkbox-circle-fill text-emerald-600 text-base mt-0.5"></i>
            <div>
              <h5 className="font-bold text-emerald-900 text-xs mb-0.5">Status Kepatuhan</h5>
              <p className="text-[11px] text-emerald-800 mb-0">
                Lahan memenuhi persyaratan isolasi sesuai standar sertifikasi benih.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal View Peta Lahan */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <i className={`${isPdf ? 'ri-file-pdf-2-line text-red-600' : 'ri-image-line text-blue-600'} text-lg`}></i>
                <h4 className="font-bold text-sm text-gray-800">
                  Peta Lahan {selectedLand?.namaLahan ? `— ${selectedLand.namaLahan}` : ''}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-gray-900/5 min-h-[350px]">
              {petaUrl ? (
                isPdf ? (
                  <iframe src={petaUrl} className="w-full h-[550px] rounded border border-gray-200 shadow-sm" title="Peta Lahan PDF" />
                ) : (
                  <img src={petaUrl} alt={`Peta ${selectedLand?.namaLahan || 'Lahan'}`} className="max-h-[550px] max-w-full object-contain rounded shadow-lg border border-gray-200 bg-white" />
                )
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm max-w-md w-full">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                    <i className="ri-file-pdf-2-line text-3xl"></i>
                  </div>
                  <h5 className="font-bold text-sm text-gray-800 mb-1">{petaFileName}</h5>
                  <p className="text-xs text-gray-500 mb-4">Peta lokasi &amp; batas area lahan format dokumen/gambar.</p>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-left text-xs text-gray-600 space-y-1">
                    <p>• <strong>Lahan:</strong> {selectedLand?.namaLahan || 'Belum Dipilih'}</p>
                    <p>• <strong>Kode Lahan:</strong> {selectedLand?.kodeLahan || '—'}</p>
                    <p>• <strong>Status File:</strong> Preview Dokumen Peta Lahan</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
              {petaUrl && (
                <a
                  href={petaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <i className="ri-download-2-line"></i> Unduh File
                </a>
              )}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
