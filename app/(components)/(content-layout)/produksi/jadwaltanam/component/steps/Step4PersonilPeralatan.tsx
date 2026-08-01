import React, { useState } from 'react';

interface Step4Props {
  options?: any;
  dataIU?: any;
  dataIL?: any;
  dataLK?: any;
  dataRT?: any;
  detailList?: any[];
  personilList?: any[];
  setPersonilList?: React.Dispatch<React.SetStateAction<any[]>>;
  peralatanList?: any[];
  setPeralatanList?: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Step4PersonilPeralatan({
  options,
  dataIU,
  dataIL,
  dataLK,
  dataRT,
  detailList = [],
  personilList,
  setPersonilList,
  peralatanList,
  setPeralatanList,
}: Step4Props) {
  const [internalPersonilList, setInternalPersonilList] = useState<any[]>([]);
  const activePersonilList = personilList !== undefined ? personilList : internalPersonilList;
  const setActivePersonilList = setPersonilList || setInternalPersonilList;

  const [internalPeralatanList, setInternalPeralatanList] = useState<any[]>([]);
  const activePeralatanList = peralatanList !== undefined ? peralatanList : internalPeralatanList;
  const setActivePeralatanList = setPeralatanList || setInternalPeralatanList;

  // Resolvers for Komoditas & Varietas display names
  const getKomoditasDisplay = () => {
    if (dataLK?.namaKomoditas) return dataLK.namaKomoditas;
    const val = dataLK?.komoditas;
    if (!val) return 'Padi';
    const found = options?.lahanKomoOption?.komoditas?.find(
      (opt: any) => opt.value === val || opt.label === val
    );
    return found ? found.label : val;
  };

  const getVarietasDisplay = () => {
    if (dataLK?.namaVarietas) return dataLK.namaVarietas;
    const val = dataLK?.varietas;
    if (!val) return 'Inpari 32';
    const found = options?.lahanKomoOption?.varietas?.find(
      (opt: any) => opt.value === val || opt.label === val
    );
    if (found) return found.label;
    const foundAll = options?.lahanKomoOption?.allVarietas?.find(
      (v: any) => v.kodeVarietas === val || v.id === val || v.namaVarietas === val
    );
    return foundAll ? foundAll.namaVarietas : val;
  };

  // Personil Modal State
  const [isPersonilModalOpen, setIsPersonilModalOpen] = useState(false);
  const [personilModalMode, setPersonilModalMode] = useState<'add' | 'edit'>('add');
  const [editingPersonilNo, setEditingPersonilNo] = useState<number | null>(null);

  const [formPersonil, setFormPersonil] = useState({
    nama: '',
    peran: 'Koordinator Lapangan',
    tugas: 'Koordinasi & Pengawasan',
    kontak: ''
  });

  // Peralatan Modal State
  const [isPeralatanModalOpen, setIsPeralatanModalOpen] = useState(false);
  const [peralatanModalMode, setPeralatanModalMode] = useState<'add' | 'edit'>('add');
  const [editingPeralatanNo, setEditingPeralatanNo] = useState<number | null>(null);

  const [formPeralatan, setFormPeralatan] = useState({
    nama: '',
    jenis: 'Alat Pengolahan Tanah',
    jumlah: 1,
    satuan: 'Unit',
    kondisi: 'Baik'
  });

  // Helper Badge Color for Peran
  const getBadgeColor = (peran: string) => {
    switch (peran) {
      case 'Koordinator Lapangan': return 'bg-emerald-100 text-emerald-800';
      case 'Supervisor': return 'bg-blue-100 text-blue-800';
      case 'Teknisi Lapangan': return 'bg-purple-100 text-purple-800';
      case 'Operator Irigasi': return 'bg-amber-100 text-amber-800';
      case 'Ahli Hama / QC': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Personil Handlers
  const handleOpenAddPersonil = () => {
    setPersonilModalMode('add');
    setEditingPersonilNo(null);
    setFormPersonil({
      nama: '',
      peran: 'Koordinator Lapangan',
      tugas: 'Koordinasi & Pengawasan',
      kontak: ''
    });
    setIsPersonilModalOpen(true);
  };

  const handleOpenEditPersonil = (p: any) => {
    setPersonilModalMode('edit');
    setEditingPersonilNo(p.no);
    setFormPersonil({
      nama: p.nama,
      peran: p.peran,
      tugas: p.tugas,
      kontak: p.kontak
    });
    setIsPersonilModalOpen(true);
  };

  const handleDeletePersonil = (no: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus personil ini?')) {
      setActivePersonilList(prev => prev.filter(p => p.no !== no).map((p, idx) => ({ ...p, no: idx + 1 })));
    }
  };

  const handleSavePersonil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPersonil.nama.trim()) return;

    const badgeColor = getBadgeColor(formPersonil.peran);

    if (personilModalMode === 'add') {
      const newPersonil = {
        no: activePersonilList.length + 1,
        ...formPersonil,
        badgeColor
      };
      setActivePersonilList(prev => [...prev, newPersonil]);
    } else if (personilModalMode === 'edit' && editingPersonilNo !== null) {
      setActivePersonilList(prev => prev.map(p => p.no === editingPersonilNo ? { ...p, ...formPersonil, badgeColor } : p));
    }

    setIsPersonilModalOpen(false);
  };

  // Peralatan Handlers
  const handleOpenAddPeralatan = () => {
    setPeralatanModalMode('add');
    setEditingPeralatanNo(null);
    setFormPeralatan({
      nama: '',
      jenis: 'Alat Pengolahan Tanah',
      jumlah: 1,
      satuan: 'Unit',
      kondisi: 'Baik'
    });
    setIsPeralatanModalOpen(true);
  };

  const handleOpenEditPeralatan = (eq: any) => {
    setPeralatanModalMode('edit');
    setEditingPeralatanNo(eq.no);
    setFormPeralatan({
      nama: eq.nama,
      jenis: eq.jenis,
      jumlah: eq.jumlah,
      satuan: eq.satuan,
      kondisi: eq.kondisi
    });
    setIsPeralatanModalOpen(true);
  };

  const handleDeletePeralatan = (no: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus peralatan ini?')) {
      setActivePeralatanList(prev => prev.filter(eq => eq.no !== no).map((eq, idx) => ({ ...eq, no: idx + 1 })));
    }
  };

  const handleSavePeralatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPeralatan.nama.trim()) return;

    if (peralatanModalMode === 'add') {
      const newPeralatan = {
        no: activePeralatanList.length + 1,
        ...formPeralatan
      };
      setActivePeralatanList(prev => [...prev, newPeralatan]);
    } else if (peralatanModalMode === 'edit' && editingPeralatanNo !== null) {
      setActivePeralatanList(prev => prev.map(eq => eq.no === editingPeralatanNo ? { ...eq, ...formPeralatan } : eq));
    }

    setIsPeralatanModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="box border border-defaultborder/60 bg-slate-50/90 shadow-sm rounded-lg p-4">
        <h4 className="text-xs font-bold text-gray-800 mb-3">Ringkasan Rencana Tanam</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Periode Tanam</span>
            <span className="font-bold text-gray-800">{dataIU?.periodeTanam || 'Juni II - 2025'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Tgl Mulai Tanam</span>
            <span className="font-bold text-gray-800">{dataRT?.tanggalTanam || '30/07/2026'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Tgl Selesai Tanam</span>
            <span className="font-bold text-gray-800">{dataRT?.perkiraanPanen || '30/07/2026'}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Komoditas</span>
            <span className="font-bold text-gray-800">{getKomoditasDisplay()}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Varietas</span>
            <span className="font-bold text-gray-800">{getVarietasDisplay()}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Luas Total</span>
            <span className="font-bold text-gray-800">
              {detailList && detailList.length > 0
                ? `${detailList.reduce((acc: number, item: any) => acc + (parseFloat(String(item.luas || '0').replace(',', '.')) || 0), 0).toFixed(2).replace('.', ',')} Ha`
                : `${dataLK?.luasTanam || dataLK?.luasTotal || '0,00'} Ha`}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Jumlah Lahan</span>
            <span className="font-bold text-gray-800">
              {detailList && detailList.length > 0
                ? `${detailList.length} Lahan`
                : `${dataLK?.jumlahLahan || (dataLK?.idLahan || dataLK?.namaLahan ? 1 : 0)} Lahan`}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] mb-0.5">Sistem Irigasi</span>
            <span className="font-bold text-gray-800">{dataRT?.irigasi || 'Irigasi Terjadwal'}</span>
          </div>
        </div>
      </div>

      {/* Two Columns Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Personil */}
        <div className="xl:col-span-6 col-span-12 space-y-4">
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">A. Personil yang Ditugaskan</h3>
              <button
                type="button"
                onClick={handleOpenAddPersonil}
                className="px-2.5 py-1 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              >
                <i className="ri-add-line"></i> Tambah Personil
              </button>
            </div>

            <div className="table-responsive mb-3">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-semibold">
                    <th className="p-2 text-start">No</th>
                    <th className="p-2 text-start">Nama Personil</th>
                    <th className="p-2 text-start">Peran / Jabatan</th>
                    <th className="p-2 text-start">Tugas</th>
                    <th className="p-2 text-start">Kontak</th>
                    <th className="p-2 text-start">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {activePersonilList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-400">
                        Belum ada personil yang ditugaskan.
                      </td>
                    </tr>
                  ) : (
                    activePersonilList.map((p) => (
                      <tr key={p.no} className="hover:bg-slate-50/50">
                        <td className="p-2 font-bold text-gray-800">{p.no}</td>
                        <td className="p-2 font-semibold text-gray-800">{p.nama}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.badgeColor}`}>
                            {p.peran}
                          </span>
                        </td>
                        <td className="p-2 text-gray-600">{p.tugas}</td>
                        <td className="p-2 text-gray-600">
                          <span className="flex items-center gap-1">
                            <i className="ri-phone-line text-xs text-emerald-600"></i> {p.kontak || '-'}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPersonil(p)}
                              className="p-1 border border-emerald-300 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Edit Personil"
                            >
                              <i className="ri-pencil-line text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePersonil(p.no)}
                              className="p-1 border border-red-300 rounded text-red-500 hover:bg-red-50 transition-colors"
                              title="Hapus Personil"
                            >
                              <i className="ri-delete-bin-line text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-gray-500 font-medium mb-4">
              Total Personil: {activePersonilList.length} orang
            </div>

            {/* Catatan Personil Box */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 text-xs block">Catatan Personil</label>
              <div className="relative">
                <textarea
                  rows={2}
                  defaultValue="Pastikan semua personil memahami SOP budidaya dan keselamatan kerja."
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full resize-none"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">68/255</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Peralatan */}
        <div className="xl:col-span-6 col-span-12 space-y-4">
          <div className="box border border-defaultborder/60 bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">B. Peralatan yang Digunakan</h3>
              <button
                type="button"
                onClick={handleOpenAddPeralatan}
                className="px-2.5 py-1 border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
              >
                <i className="ri-add-line"></i> Tambah Peralatan
              </button>
            </div>

            <div className="table-responsive mb-3">
              <table className="table whitespace-nowrap min-w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-slate-50 text-gray-700 font-semibold">
                    <th className="p-2 text-start">No</th>
                    <th className="p-2 text-start">Nama Peralatan</th>
                    <th className="p-2 text-start">Jenis</th>
                    <th className="p-2 text-start">Jumlah</th>
                    <th className="p-2 text-start">Satuan</th>
                    <th className="p-2 text-start">Kondisi</th>
                    <th className="p-2 text-start">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {activePeralatanList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-400">
                        Belum ada peralatan yang ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    activePeralatanList.map((eq) => (
                      <tr key={eq.no} className="hover:bg-slate-50/50">
                        <td className="p-2 font-bold text-gray-800">{eq.no}</td>
                        <td className="p-2 font-semibold text-gray-800">{eq.nama}</td>
                        <td className="p-2 text-gray-600">{eq.jenis}</td>
                        <td className="p-2 font-semibold text-gray-800">{eq.jumlah}</td>
                        <td className="p-2">{eq.satuan}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${eq.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                              eq.kondisi === 'Perlu Perbaikan' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {eq.kondisi}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPeralatan(eq)}
                              className="p-1 border border-emerald-300 rounded text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Edit Peralatan"
                            >
                              <i className="ri-pencil-line text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePeralatan(eq.no)}
                              className="p-1 border border-red-300 rounded text-red-500 hover:bg-red-50 transition-colors"
                              title="Hapus Peralatan"
                            >
                              <i className="ri-delete-bin-line text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="text-xs text-gray-500 font-medium mb-4">
              Total Peralatan: {activePeralatanList.length} item
            </div>

            {/* Catatan Peralatan Box */}
            <div className="space-y-1">
              <label className="font-semibold text-gray-700 text-xs block">Catatan Peralatan</label>
              <div className="relative">
                <textarea
                  rows={2}
                  defaultValue="Pastikan peralatan dalam kondisi baik dan siap digunakan sebelum kegiatan tanam."
                  className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full resize-none"
                />
                <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">76/255</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Personil yang Ditugaskan */}
      {isPersonilModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-[#078836] text-lg"></i>
                <h4 className="font-bold text-sm text-gray-800">
                  {personilModalMode === 'add' ? 'Tambah Personil yang Ditugaskan' : 'Edit Personil'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPersonilModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePersonil}>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 mb-1 block">Nama Personil <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formPersonil.nama}
                    onChange={(e) => setFormPersonil(prev => ({ ...prev, nama: e.target.value }))}
                    placeholder="Masukkan nama lengkap personil"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Peran / Jabatan <span className="text-red-500">*</span></label>
                  <select
                    value={formPersonil.peran}
                    onChange={(e) => setFormPersonil(prev => ({ ...prev, peran: e.target.value }))}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="Koordinator Lapangan">Koordinator Lapangan</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Teknisi Lapangan">Teknisi Lapangan</option>
                    <option value="Operator Irigasi">Operator Irigasi</option>
                    <option value="Pencatat Data">Pencatat Data</option>
                    <option value="Ahli Hama / QC">Ahli Hama / QC</option>
                    <option value="Pekerja Harian">Pekerja Harian</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Kontak / No. HP</label>
                  <input
                    type="text"
                    value={formPersonil.kontak}
                    onChange={(e) => setFormPersonil(prev => ({ ...prev, kontak: e.target.value }))}
                    placeholder="0812-xxxx-xxxx"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 mb-1 block">Tugas / Tanggung Jawab</label>
                  <input
                    type="text"
                    value={formPersonil.tugas}
                    onChange={(e) => setFormPersonil(prev => ({ ...prev, tugas: e.target.value }))}
                    placeholder="Contoh: Pengawasan Lahan & Irigasi"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsPersonilModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <i className="ri-save-line"></i> {personilModalMode === 'add' ? 'Tambah Personil' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Peralatan yang Digunakan */}
      {isPeralatanModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <i className="ri-tools-line text-[#078836] text-lg"></i>
                <h4 className="font-bold text-sm text-gray-800">
                  {peralatanModalMode === 'add' ? 'Tambah Peralatan yang Digunakan' : 'Edit Peralatan'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPeralatanModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePeralatan}>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700 mb-1 block">Nama Peralatan <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formPeralatan.nama}
                    onChange={(e) => setFormPeralatan(prev => ({ ...prev, nama: e.target.value }))}
                    placeholder="Masukkan nama alat / mesin"
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Jenis Peralatan</label>
                  <select
                    value={formPeralatan.jenis}
                    onChange={(e) => setFormPeralatan(prev => ({ ...prev, jenis: e.target.value }))}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="Alat Pengolahan Tanah">Alat Pengolahan Tanah</option>
                    <option value="Alat Irigasi">Alat Irigasi</option>
                    <option value="Alat Penyemprotan">Alat Penyemprotan</option>
                    <option value="Alat Manual">Alat Manual</option>
                    <option value="Alat Ukur">Alat Ukur</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Kondisi Alat</label>
                  <select
                    value={formPeralatan.kondisi}
                    onChange={(e) => setFormPeralatan(prev => ({ ...prev, kondisi: e.target.value }))}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Jumlah <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min={1}
                    value={formPeralatan.jumlah}
                    onChange={(e) => setFormPeralatan(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 1 }))}
                    className="form-control text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 mb-1 block">Satuan</label>
                  <select
                    value={formPeralatan.satuan}
                    onChange={(e) => setFormPeralatan(prev => ({ ...prev, satuan: e.target.value }))}
                    className="form-select text-xs border border-gray-300 rounded px-3 py-2 text-gray-700 w-full bg-white"
                  >
                    <option value="Unit">Unit</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Set">Set</option>
                    <option value="Buah">Buah</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsPeralatanModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#078836] hover:bg-[#06732d] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <i className="ri-save-line"></i> {peralatanModalMode === 'add' ? 'Tambah Peralatan' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
