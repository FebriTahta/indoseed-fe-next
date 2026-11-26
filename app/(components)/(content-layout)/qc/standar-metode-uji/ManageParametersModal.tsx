import React, { useState, useEffect, useMemo } from 'react';

interface ManageParametersModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: any; // The TestMethod being managed
  allParameters: any[]; // All Parameter records
  onSave: (added: string[], removed: string[]) => Promise<void>;
  isSaving?: boolean;
}

export default function ManageParametersModal({
  isOpen,
  onClose,
  method,
  allParameters,
  onSave,
  isSaving = false,
}: ManageParametersModalProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [original, setOriginal] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    setSearch('');
    const linked = new Set<string>(
      allParameters
        .filter((p) => p.metodeId === method?.id)
        .map((p) => p.id)
    );
    setSelected(new Set(linked));
    setOriginal(new Set(linked));
  }, [isOpen, method, allParameters]);

  const filteredParameters = useMemo(() => {
    const q = search.toLowerCase();
    return allParameters.filter(
      (p) =>
        p.kode.toLowerCase().includes(q) ||
        p.nama.toLowerCase().includes(q) ||
        (p.kategori || '').toLowerCase().includes(q)
    );
  }, [allParameters, search]);

  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    const added = [...selected].filter((id) => !original.has(id));
    const removed = [...original].filter((id) => !selected.has(id));
    await onSave(added, removed);
  };

  const linkedCount = selected.size;
  const changesCount = (() => {
    const added = [...selected].filter((id) => !original.has(id)).length;
    const removed = [...original].filter((id) => !selected.has(id)).length;
    return added + removed;
  })();

  if (!isOpen || !method) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden animate-slide-down">
          
          <div className="px-6 py-4 border-b border-defaultborder bg-gradient-to-r from-success/5 to-transparent">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-lg font-bold text-gray-800 mb-0.5">
                  Kelola Parameter Uji
                </h5>
                <p className="text-sm text-gray-500">
                  Metode Uji:{' '}
                  <span className="font-semibold text-gray-700">
                    {method.kode} — {method.nama}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition-colors mt-0.5"
              >
                <i className="ri-close-line text-2xl" />
              </button>
            </div>

            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <i className="ri-link text-success" />
                <span>
                  <strong className="text-gray-800">{linkedCount}</strong> parameter terhubung
                </span>
              </div>
              {changesCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-warning">
                  <i className="ri-edit-line" />
                  <span>
                    <strong>{changesCount}</strong> perubahan belum disimpan
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                className="form-control pl-9 text-sm"
                placeholder="Cari parameter berdasarkan kode atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filteredParameters.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                <i className="ri-flask-line text-3xl block mb-2 text-gray-300" />
                Tidak ada parameter yang cocok
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">
                    Menampilkan {filteredParameters.length} dari {allParameters.length} parameter
                  </span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="text-xs text-success hover:underline"
                      onClick={() =>
                        setSelected((prev) => {
                          const next = new Set(prev);
                          filteredParameters.forEach((p) => next.add(p.id));
                          return next;
                        })
                      }
                    >
                      Pilih semua
                    </button>
                    <button
                      type="button"
                      className="text-xs text-danger hover:underline"
                      onClick={() =>
                        setSelected((prev) => {
                          const next = new Set(prev);
                          filteredParameters.forEach((p) => next.delete(p.id));
                          return next;
                        })
                      }
                    >
                      Hapus semua
                    </button>
                  </div>
                </div>

                {filteredParameters.map((p) => {
                  const isChecked = selected.has(p.id);
                  const wasOriginal = original.has(p.id);
                  const isChanged = isChecked !== wasOriginal;
                  const isLinkedElsewhere =
                    p.metodeId && p.metodeId !== method.id;

                  return (
                    <label
                      key={p.id}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                        ${isChecked
                          ? 'border-success bg-success/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }
                        ${isChanged ? 'ring-1 ring-offset-0 ring-warning/60' : ''}
                      `}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 accent-[#10b981] cursor-pointer"
                        checked={isChecked}
                        onChange={() => toggleSelection(p.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {p.kode}
                          </span>
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {p.nama}
                          </span>
                          {isChecked && (
                            <span className="text-xs bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">
                              Terhubung
                            </span>
                          )}
                          {isChanged && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isChecked ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                              {isChecked ? '+ Ditambahkan' : '− Dihapus'}
                            </span>
                          )}
                        </div>
                        {p.kategori && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {p.kategori}
                          </p>
                        )}
                        {isLinkedElsewhere && (
                          <p className="text-xs text-warning mt-0.5 flex items-center gap-1">
                            <i className="ri-information-line" />
                            Saat ini terhubung ke metode lain. Memilih ini akan memindahkan parameter ke metode ini.
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-defaultborder bg-gray-50 rounded-b-xl">
            <div className="text-xs text-gray-500">
              {changesCount > 0 ? (
                <span className="text-warning font-medium">
                  <i className="ri-alert-line mr-1" />
                  {changesCount} perubahan menunggu konfirmasi
                </span>
              ) : (
                <span>Tidak ada perubahan</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="py-2 px-4 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <i className="ri-close-line" /> Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || changesCount === 0}
                className="py-2 px-4 rounded-md text-white bg-[#10b981] hover:bg-[#059669] font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line" />
                    Simpan Perubahan
                    {changesCount > 0 && (
                      <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {changesCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
