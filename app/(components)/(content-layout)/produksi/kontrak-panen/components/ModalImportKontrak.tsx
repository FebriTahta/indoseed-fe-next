import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface ModalImportKontrakProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalImportKontrak({
  isOpen,
  onClose,
  onSuccess,
}: ModalImportKontrakProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.warning('Silakan pilih file data excel/csv untuk diunggah');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`Data dari file "${file.name}" berhasil diimpor!`);
      onSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={isUploading ? undefined : onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <h4 className="text-sm font-bold text-gray-900 mb-0 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import Data Kontrak Panen
            </h4>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleUpload}>
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-500">
                Unggah file Excel (.xlsx, .xls) atau CSV yang berisi data kontrak panen sesuai dengan format template yang disediakan.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors bg-gray-50/50">
                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="mt-2 text-xs text-gray-600">
                  <label htmlFor="file-upload" className="font-semibold text-emerald-600 hover:text-emerald-500 cursor-pointer">
                    <span>Pilih file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <span> atau tarik dan lepas di sini</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">XLSX, XLS, atau CSV hingga 10MB</p>
                {file && (
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <span>📄 {file.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => toast.info('Mengunduh template template_kontrak_panen.xlsx...')}
                  className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Unduh Format Template Excel
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUploading || !file}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#078836] hover:bg-emerald-700 rounded-lg disabled:opacity-50"
              >
                {isUploading ? 'Mengimpor...' : 'Mulai Import'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
