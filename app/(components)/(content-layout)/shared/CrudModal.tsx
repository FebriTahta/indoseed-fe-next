import React from 'react';
import { buttonClass } from './buttonStyles';

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  maxWidthClass?: string;
}

export default function CrudModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Simpan Data',
  cancelText = 'Batal',
  isLoading = false,
  maxWidthClass = 'max-w-lg'
}: CrudModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={isLoading ? undefined : onClose}
      ></div>

      {/* Center Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${maxWidthClass} rounded-lg bg-white shadow-xl overflow-hidden border border-defaultborder animate-slide-down`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-defaultborder bg-emerald-600 text-white">
            <h5 className="text-white font-bold mb-0">{title}</h5>
            <button
              type="button"
              onClick={onClose}
              className={`text-white/80 hover:text-white transition-colors ${isLoading ? 'pointer-events-none opacity-40' : ''}`}
              disabled={isLoading}
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-defaultborder bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className={buttonClass('secondary')}
                disabled={isLoading}
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className={buttonClass('primary')}
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                )}
                {isLoading ? 'Menyimpan...' : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
