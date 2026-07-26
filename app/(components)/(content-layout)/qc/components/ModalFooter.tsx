import React from 'react';
import SpkButton from '@/shared/@spk-reusable-components/uielements/spk-button';

interface ModalFooterProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  cancelText?: string;
  submitText?: string;
  submitBtnClass?: string;
}

export default function ModalFooter({
  onCancel,
  onSubmit,
  isSubmitting = false,
  isDisabled = false,
  cancelText = 'Batal',
  submitText = 'Simpan',
  submitBtnClass = 'bg-[#1B4E3B]'
}: ModalFooterProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50/80 rounded-b-xl">
      <SpkButton 
        variant="light" 
        onClick={onCancel}
        customClass="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        {cancelText}
      </SpkButton>
      <SpkButton 
        variant="primary" 
        customClass={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all font-semibold ${submitBtnClass}`} 
        onClick={onSubmit} 
        disabled={isSubmitting || isDisabled}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <i className="ri-loader-4-line animate-spin"></i> Menyimpan...
          </div>
        ) : submitText}
      </SpkButton>
    </div>
  );
}
