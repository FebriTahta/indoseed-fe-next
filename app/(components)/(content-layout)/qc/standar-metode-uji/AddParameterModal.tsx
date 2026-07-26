// Component for adding/editing a parameter
import React, { useState, useEffect } from 'react';

interface AddParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'add' | 'edit';
  initialData?: any;
  onSubmit: (data: any) => void;
  methods: any[];
  standards: any[];
}

export default function AddParameterModal({ isOpen, onClose, mode = 'add', initialData, onSubmit, methods, standards }: AddParameterModalProps) {
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    kategori: '',
    satuan: '',
    batasAcuan: '',
    terkaitTipe: '', // 'standar' | 'metode'
    terkaitId: '',
    definisi: '',
    keterangan: '',
    status: 'Aktif'
  });

  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      setFormData({
        kode: initialData.kode || '',
        nama: initialData.nama || '',
        kategori: initialData.kategori || '',
        satuan: initialData.satuan || '',
        batasAcuan: initialData.batasAcuan || '',
        terkaitTipe: initialData.standarId ? 'standar' : initialData.metodeId ? 'metode' : '',
        terkaitId: initialData.standarId || initialData.metodeId || '',
        definisi: initialData.definisi || '',
        keterangan: initialData.keterangan || '',
        status: initialData.status || 'Aktif'
      });
    } else if (isOpen && mode === 'add') {
      setFormData({
        kode: '',
        nama: '',
        kategori: '',
        satuan: '',
        batasAcuan: '',
        terkaitTipe: '',
        terkaitId: '',
        definisi: '',
        keterangan: '',
        status: 'Aktif'
      });
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden animate-slide-down">
          <div className="flex items-center justify-between px-6 py-4 border-b border-defaultborder">
            <h5 className="text-lg font-bold text-gray-800 mb-0">{mode === 'edit' ? 'Edit' : 'Tambah'} Parameter Uji</h5>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Parameter <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="kode" value={formData.kode} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Kode Parameter" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Parameter <span className="text-danger">*</span>
                  </label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Nama Parameter" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori <span className="text-danger">*</span>
                  </label>
                  <select name="kategori" value={formData.kategori} onChange={handleChange} className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" required>
                    <option value="">Pilih kategori</option>
                    <option value="Fisik">Fisik</option>
                    <option value="Fisiologis">Fisiologis</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <input type="text" name="satuan" value={formData.satuan} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Contoh: %, gr, dll" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batas Acuan</label>
                  <input type="text" name="batasAcuan" value={formData.batasAcuan} onChange={handleChange} className="form-control w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Contoh: > 80%, < 12%, dll" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terkait Dengan (Standar / Metode) <span className="text-danger">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="terkaitTipe" value="standar" checked={formData.terkaitTipe === 'standar'} onChange={handleChange} required /> Standar Uji
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="terkaitTipe" value="metode" checked={formData.terkaitTipe === 'metode'} onChange={handleChange} required /> Metode Uji
                    </label>
                  </div>
                  {formData.terkaitTipe && (
                    <select name="terkaitId" value={formData.terkaitId} onChange={handleChange} className="form-select w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" required>
                      <option value="">Pilih {formData.terkaitTipe === 'standar' ? 'Standar Uji' : 'Metode Uji'}</option>
                      {formData.terkaitTipe === 'standar' 
                        ? standards.map(s => <option key={s.id} value={s.id}>{s.kode} - {s.nama}</option>)
                        : methods.map(m => <option key={m.id} value={m.id}>{m.kode} - {m.nama}</option>)
                      }
                    </select>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Definisi</label>
                  <textarea name="definisi" value={formData.definisi} onChange={handleChange} className="form-control w-full h-20 resize-none border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Definisi parameter"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                  <textarea name="keterangan" value={formData.keterangan} onChange={handleChange} className="form-control w-full h-20 resize-none border-gray-300 rounded-md shadow-sm text-sm focus:border-success focus:ring focus:ring-success/50" placeholder="Keterangan tambahan"></textarea>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-defaultborder bg-gray-50 rounded-b-xl">
              <button type="button" onClick={onClose} className="py-2.5 px-4 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm">
                <i className="ri-close-line"></i> Batal
              </button>
              <button type="submit" className="py-2.5 px-4 rounded-md text-white bg-[#10b981] hover:bg-[#059669] font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm">
                <i className="ri-save-line"></i> Simpan Parameter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
